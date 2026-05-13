import readline from "readline";
import {
  sesi,
  dataPlayer,
  killWerewolf,
  dreamySeer,
  sorcerer,
  protectGuardian,
  protectWitch,
  changeRole,
  shortPlayer,
  pagi,
  voting,
  malam,
  skill,
  win,
  clearAll,
  clearAllSTATUS,
  poisonWitch,
  vote,
  getWinner,
  hunterShoot,
  changeDay,
  resetVote,
  clearAllVote,
  reviveNecromancer,
} from "./lib/werewolf.js";

// Atur info bot global untuk testing
global.info = global.info || {
  nomorbot: "6281234567890",
  version: "v2.0-test",
};

// QUICK TEST MODE: toggleable at runtime with `fast` command
let FAST_MODE = false;
// Setup interface untuk input/output di terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function untuk menanyakan pertanyaan di terminal
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// Enhanced ask to accept admin commands during interactive testing
async function askWithCommands(question, roomData) {
  while (true) {
    const input = FAST_MODE
      ? String(selectRandomAlive(roomData, -1))
      : await ask(question);
    const t = String(input || "").trim();
    if (FAST_MODE) return t;
    if (t === "") continue;
    // Commands: list, r <num> <role>, fast, skip
    if (t.toLowerCase() === "list") {
      printPlayers(roomData);
      continue;
    }
    if (t.toLowerCase() === "fast") {
      FAST_MODE = true;
      console.log("[SYSTEM] FAST_MODE diaktifkan.");
      return String(selectRandomAlive(roomData, -1));
    }
    if (t.toLowerCase() === "skip") return t;
    const m = t.match(/^r\s+(\d+)\s+(\w+)$/i);
    if (m) {
      const num = parseInt(m[1]);
      const newRole = m[2].toLowerCase();
      const pl = roomData.player.find((p) => p.number === num);
      if (!pl) {
        console.log("[ERROR] Nomor pemain tidak ditemukan.");
        continue;
      }
      pl.role = newRole;
      console.log(
        `[SYSTEM] Player ${num} sekarang berperan sebagai ${newRole}.`,
      );
      continue;
    }
    return t;
  }
}

// Inisialisasi data game untuk testing
const ROOM_ID = "test_room_123";
let dataGame = {
  [ROOM_ID]: {
    room: ROOM_ID,
    owner: "player1@s.whatsapp.net",
    status: false,
    iswin: null,
    cooldown: null,
    day: 0,
    time: "malem",
    player: [],
    dead: [],
    voting: false,
    seer: false,
    guardian: [],
    witchUsed: false,
    immuneUsed: false,
    poisonUsed: false,
    pendingAlpha: false,
    onceAlphaNotify: false,
    notifyAlpha: true,
    pendingRevive: null,
  },
};

// Simulasi objek koneksi WhatsApp
const conn = {
  sendMessage: (chatId, content, options) => {
    const hasThumb = content?.contextInfo?.externalAdReply?.thumbnail;
    let logMessage = `\n[BOT -> ${chatId.split("@")[0] || chatId}]`;

    if (hasThumb) {
      logMessage += ` [${content.contextInfo.externalAdReply.title}]`;
    }

    let text = content.text || "";

    const mentions =
      content.mentions || content.contextInfo?.mentionedJid || [];
    for (let jid of mentions) {
      text = text.replace(
        new RegExp(`@${jid.replace("@s.whatsapp.net", "")}`, "g"),
        `@${jid.split("@")[0]}`,
      );
    }

    // Beautify output a bit for easier reading
    console.log(`${logMessage}\n${text}\n`);
    return Promise.resolve({
      key: {
        id: `msg_${Date.now()}`,
      },
    });
  },
  getName: (jid) => jid.split("@")[0],
};

// Fungsi untuk menambahkan player ke dalam game
function addPlayer(roomId, playerId, role, data) {
  const playerNumber = data[roomId].player.length + 1;
  data[roomId].player.push({
    id: playerId,
    number: playerNumber,
    sesi: roomId,
    status: false,
    role: role,
    effect: [],
    vote: 0,
    isdead: false,
    isvote: false,
    alphaUsed: false,
    necroUsed: false,
    isPoisoned: false,
    // cursed-specific flags
    cursedPending: false,
    curseTransformed: false,
    // hunter processing flag
    hunterShotDone: false,
  });
  console.log(
    `[SYSTEM] Player ${playerNumber} (${playerId}) ditambahkan sebagai ${role}.`,
  );
}

// Fungsi untuk menampilkan status semua player
function printPlayers(roomData, showDeadOnly = false) {
  const header = showDeadOnly
    ? "--- DAFTAR PEMAIN (MENINGGAL) ---"
    : "--- DAFTAR PEMAIN (HIDUP) ---";
  console.log(`\n${header}`);
  const sortedPlayers = [...roomData.player].sort(
    (a, b) => a.number - b.number,
  );
  for (let p of sortedPlayers) {
    const isTarget = showDeadOnly ? p.isdead : !p.isdead;
    if (!isTarget) continue;
    const roleEmoji =
      {
        werewolf: "🐺",
        alpha: "🦁",
        seer: "🔮",
        guardian: "🛡️",
        witch: "🧪",
        necromancer: "🪦",
        hunter: "🎯",
        warga: "🙂",
        cursed: "🕯️",
      }[p.role] || "❓";

    const statusParts = [];
    if (p.isdead) statusParts.push("☠️ DEAD");
    if (p.status && !p.isdead) statusParts.push("(acted)");
    if (p.isPoisoned) statusParts.push("(poisoned)");
    if (p.cursedPending) statusParts.push("(will transform)");

    console.log(
      ` ${p.number}) ${p.id.split("@")[0]} ${roleEmoji} [${p.role}] ${statusParts.join(" ")}`,
    );
  }
  console.log("--------------------------------\n");
}

// Fungsi interaktif untuk menjalankan aksi malam
async function malamInteractive(roomData) {
  console.log("\n--- INTERAKSI MALAM ---");
  // Urutkan player berdasarkan peran spesial dulu untuk alur yang lebih baik
  const specialRoles = [
    "werewolf",
    "alpha",
    "seer",
    "guardian",
    "witch",
    "necromancer",
  ];
  const actionOrder = [...roomData.player].sort((a, b) => {
    return specialRoles.indexOf(a.role) - specialRoles.indexOf(b.role);
  });

  for (let player of actionOrder) {
    if (player.status || player.isdead) continue; // Skip jika sudah beraksi atau mati

    const role = player.role;
    const prompt = `[${player.number}] ${player.id.split("@")[0]} (${role}): `;

    if (role === "werewolf" || role === "alpha") {
      printPlayers(roomData);
      const target = await askWithCommands(
        `${prompt}Pilih nomor untuk dibunuh: `,
        roomData,
      );
      if (target.toLowerCase() !== "skip")
        killWerewolf(player.id, parseInt(target), dataGame);
      player.status = true;
    } else if (role === "seer") {
      printPlayers(roomData);
      const target = await askWithCommands(
        `${prompt}Pilih nomor untuk diterawang: `,
        roomData,
      );
      if (target.toLowerCase() !== "skip") {
        const resultRole = dreamySeer(player.id, parseInt(target), dataGame);
        console.log(
          `\n[🔮 SEER] ${player.id.split("@")[0]} melihat #${target} -> ${resultRole}`,
        );
      }
      player.status = true;
    } else if (role === "guardian") {
      printPlayers(roomData);
      const target = await askWithCommands(
        `${prompt}Pilih nomor untuk dilindungi: `,
        roomData,
      );
      if (target.toLowerCase() !== "skip")
        protectGuardian(player.id, parseInt(target), dataGame);
      player.status = true;
    } else if (role === "witch") {
      const action = await askWithCommands(
        `${prompt}Pilih aksi (immune/poison/skip): `,
        roomData,
      );
      if (action === "immune" && !roomData.immuneUsed) {
        protectWitch(player.id, dataGame);
        roomData.witchUsed = true;
        roomData.immuneUsed = true;
        player.status = true;
      } else if (action === "poison" && !roomData.poisonUsed) {
        printPlayers(roomData);
        const target = await askWithCommands(
          `${prompt}Pilih nomor untuk diracun: `,
          roomData,
        );
        if (target.toLowerCase() !== "skip")
          poisonWitch(player.id, parseInt(target), dataGame);
        roomData.witchUsed = true;
        roomData.poisonUsed = true;
        player.status = true;
      }
    } else if (role === "necromancer" && !player.necroUsed) {
      printPlayers(roomData, true); // Tampilkan hanya yang mati
      if (roomData.player.some((p) => p.isdead)) {
        const target = await askWithCommands(
          `${prompt}Pilih nomor untuk dihidupkan kembali: `,
          roomData,
        );
        if (target.toLowerCase() !== "skip")
          reviveNecromancer(player.id, parseInt(target), dataGame);
        player.necroUsed = true;
        player.status = true;
      } else {
        console.log(
          `[INFO NECRO] Tidak ada pemain yang mati untuk dihidupkan.`,
        );
      }
    }
  }
}

// Fungsi interaktif untuk voting
async function votingInteractive(roomData) {
  printPlayers(roomData);
  for (let player of roomData.player) {
    if (!player.isdead) {
      const target = await askWithCommands(
        `[${player.number}] ${player.id.split("@")[0]} vote nomor: `,
        roomData,
      );
      if (target && !isNaN(target))
        vote(roomData.room, parseInt(target), player.id, dataGame);
    }
  }
}

// SIMULASI FUNGSI DARI _werewolfgc.js
async function simulateGCHandler(roomData) {
  // Simulasi aksi Hunter setelah divote mati
  // allow processing if hunter died by vote or if room time is 'hunter'
  const hunterDiedByVote = roomData.player.find(
    (p) =>
      p.role === "hunter" &&
      p.isdead &&
      !p.hunterShotDone &&
      (roomData.time === "hunter" || p.deathCause === "vote"),
  );
  if (hunterDiedByVote) {
    console.log("\n--- FASE HUNTER MENEMBAK ---");
    printPlayers(roomData);
    const hunterPlayer = dataPlayer(hunterDiedByVote.id, dataGame);
    const target = await askWithCommands(
      `[${hunterPlayer.number}] ${hunterPlayer.id.split("@")[0]} (Hunter) tembak nomor: `,
      roomData,
    );

    if (target.toLowerCase() !== "skip") {
      // Memanggil fungsi dari werewolf.js, sama seperti di _werewolfgc.js
      await hunterShoot(
        roomData.room,
        parseInt(target),
        dataGame,
        conn,
        hunterPlayer.id,
      );

      // Kirim pesan simulasi
      const targetPlayer = roomData.player.find(
        (p) => p.number === parseInt(target),
      );
      await conn.sendMessage(roomData.room, {
        text: `@${hunterPlayer.id.split("@")[0]} telah menembak @${targetPlayer.id.split("@")[0]}, dia adalah *${targetPlayer.role}*.`,
        mentions: [hunterPlayer.id, targetPlayer.id],
      });

      // Mark hunter as processed so they can't shoot again
      hunterDiedByVote.hunterShotDone = true;

      // Reset state setelah hunter menembak
      changeDay(roomData.room, dataGame);
      resetVote(roomData.room, dataGame);
      clearAllVote(roomData.room, dataGame);
      return; // Menghentikan fase ini agar tidak lanjut ke fase alpha
    }
  }

  // Simulasi aksi Alpha setelah divote mati
  const alphaDiedByVote = roomData.player.find(
    (p) =>
      p.role === "alpha" && p.isdead && p.deathCause === "vote" && !p.alphaUsed,
  );
  if (alphaDiedByVote) {
    console.log("\n--- FASE ALPHA MENGUBAH ---");
    printPlayers(roomData);
    const alphaPlayer = dataPlayer(alphaDiedByVote.id, dataGame);
    const target = await askWithCommands(
      `[${alphaPlayer.number}] ${alphaPlayer.id.split("@")[0]} (Alpha) ubah player nomor: `,
      roomData,
    );

    // Memanggil fungsi dari werewolf.js
    if (target.toLowerCase() !== "skip")
      changeRole(alphaPlayer.id, parseInt(target), "werewolf", dataGame);
    alphaPlayer.alphaUsed = true;
    roomData.pendingAlpha = false;

    await conn.sendMessage(roomData.room, {
      text: `Alpha telah berhasil mengubah seorang warga menjadi Werewolf!`,
    });
  }
}

// --- NEW: cursed role mechanics ---
// Behavior: when a `cursed` player dies (by night/vote), they will transform into a werewolf
// at the start of the next day (they come back as werewolf). We mark them with `cursedPending`.
function processPendingCursedTransform(roomData) {
  const pending = roomData.player.filter(
    (p) =>
      p.isdead && p.role === "cursed" && !p.curseTransformed && p.cursedPending,
  );
  for (let p of pending) {
    // revive and change role
    p.isdead = false;
    p.curseTransformed = true;
    changeRole(p.id, p.number, "werewolf", dataGame);
    conn.sendMessage(roomData.room, {
      text: `🕯️ ${p.id.split("@")[0]} terbangkit sebagai Werewolf karena kutukan!`,
    });
  }
}

// --- Helpers for fast testing ---
function selectRandomAlive(roomData, excludeNumber) {
  const alive = roomData.player.filter(
    (p) => !p.isdead && p.number !== excludeNumber,
  );
  if (!alive.length) return 1;
  return alive[Math.floor(Math.random() * alive.length)].number;
}

function selectRandomDead(roomData) {
  const dead = roomData.player.filter((p) => p.isdead);
  if (!dead.length) return null;
  return dead[Math.floor(Math.random() * dead.length)].number;
}

// Loop utama permainan
async function main() {
  // === SETUP GAME ===
  console.log("=== MEMULAI SETUP GAME WEREWOLF ===");
  // Create a test table containing all roles for easier testing
  addPlayer(ROOM_ID, "player1@s.whatsapp.net", "werewolf", dataGame);
  addPlayer(ROOM_ID, "player2@s.whatsapp.net", "alpha", dataGame);
  addPlayer(ROOM_ID, "player3@s.whatsapp.net", "hunter", dataGame);
  addPlayer(ROOM_ID, "player4@s.whatsapp.net", "necromancer", dataGame);
  addPlayer(ROOM_ID, "player5@s.whatsapp.net", "warga", dataGame);
  addPlayer(ROOM_ID, "player6@s.whatsapp.net", "guardian", dataGame);
  addPlayer(ROOM_ID, "player7@s.whatsapp.net", "tanner", dataGame);
  addPlayer(ROOM_ID, "player8@s.whatsapp.net", "seer", dataGame);
  addPlayer(ROOM_ID, "player9@s.whatsapp.net", "witch", dataGame);
  addPlayer(ROOM_ID, "player10@s.whatsapp.net", "sorcerer", dataGame);
  addPlayer(ROOM_ID, "player11@s.whatsapp.net", "cursed", dataGame);

  dataGame[ROOM_ID].status = true;
  shortPlayer(ROOM_ID, dataGame);
  let roomData = sesi(ROOM_ID, dataGame);

  // === GAME LOOP ===
  while (getWinner(ROOM_ID, dataGame).status === null) {
    roomData.day++;
    console.log(`\n\n<<<<< HARI KE-${roomData.day} >>>>>`);
    // Apply pending cursed transformations (they revive as werewolf at day start)
    processPendingCursedTransform(roomData);

    // --- FASE MALAM ---
    console.log("\n--- FASE MALAM ---");
    roomData.time = "malem";
    clearAll(ROOM_ID, dataGame);
    clearAllSTATUS(ROOM_ID, dataGame);
    await skill(conn, roomData, dataGame);
    await malamInteractive(roomData);

    // --- FASE PAGI ---
    console.log("\n--- FASE PAGI ---");
    await pagi(conn, roomData, dataGame);
    if (getWinner(ROOM_ID, dataGame).status !== null) break;

    // --- FASE VOTING ---
    console.log("\n--- FASE VOTING ---");
    await voting(conn, roomData, dataGame);
    await votingInteractive(roomData);

    // --- PROSES HASIL VOTING (fungsi malam yang serbaguna) ---
    console.log("\n--- PROSES HASIL VOTE ---");
    await malam(conn, roomData, dataGame); // Ini akan memproses vote, membunuh player, dan MUNGKIN mengubah `roomData.time` ke `hunter` atau `pendingAlpha` menjadi `true`
    // If a cursed player died during the night/vote, mark them to transform next day
    for (let p of roomData.player) {
      if (p.isdead && p.role === "cursed" && !p.cursedPending) {
        p.cursedPending = true;
        console.log(
          `[INFO] ${p.id.split("@")[0]} (cursed) meninggal dan akan berubah menjadi werewolf di hari berikutnya.`,
        );
      }
    }

    // --- FASE AKSI SETELAH VOTE (SIMULASI DARI GC HANDLER) ---
    await simulateGCHandler(roomData);

    if (getWinner(ROOM_ID, dataGame).status !== null) break;
  }

  // === GAME SELESAI ===
  console.log("\n\nGAME SELESAI!");
  await win(roomData, 1, conn, dataGame);
  rl.close();
}

// Jalankan simulasi
main();
