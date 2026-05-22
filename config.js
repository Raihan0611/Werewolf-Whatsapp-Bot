import fs from "fs";
import { getOwners } from "./lib/system/owner.js";
const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url)),
);
global.version = `v${pkg.version}`;

// Global Configuration
const ownerNumbers = "62xxxxxxxx"; // Ganti dengan nomor WhatsApp Anda
const lidNumber = "xxxxxxxxxxx@lid"; // kirim command .getid ke bot untuk mendapatkan nomor lid, penting!! wajib ganti jadi nomor lid mu untuk fitur owner
const botNumbers = "62xxxxxxxxx"; // penting!! wajib ganti jadi nomor bot mu untuk Pairing number
const NamaOwner = "Raihan"; // Ganti dengan nama Anda
const NamaBot = "Carmen"; // Ganti dengan nama bot Anda
const Watermark = "© 2026 Ultimate Werewolf"; // Ganti dengan watermark bot Anda
const pairingMetode = "code"; // metode pairing: 'qr' atau 'code'
const delay = 1000; // delay untuk menghindari spam, dalam milidetik

// Jika tidak mengerti cara menggunakannya diamkan saja, agar bot berjalan dengan settingan default, jika ingin menggunakannya silahkan tanya owner atau lihat di Readme.
const pakaiBotTimer = false; // Ganti dengan true jika ingin menggunakan timer, false jika tidak ingin menggunakan timer
const LidbotTimer = "-"; // Ganti dengan nomor @Lid Bot Timer Anda jika tidak ada isi dengan strip '-'
const pakaiBotPembantu = false; // Ganti dengan true jika ingin menggunakan bot pembantu, false jika tidak ingin menggunakan bot pembantu
const LidbotPembantu = "-"; // Ganti dengan nomor bot pembantu Anda jika tidak ada isi dengan strip '-', // Fitur ini masih dalam tahap pengembangan.

// Owner Information
try {
  const savedOwners = Array.isArray(getOwners()) ? getOwners() : [];
  const ownerEntries = [];

  if (ownerNumbers) {
    const ownerJid = ownerNumbers.includes("@")
      ? ownerNumbers
      : `${ownerNumbers}@lid`;
    ownerEntries.push([ownerJid, NamaOwner, true]);
  }

  // only add lidNumber if it's a real numeric entry (not placeholder like '-')
  if (
    lidNumber &&
    String(lidNumber).replace(/[^0-9]/g, "").length >= 5 &&
    lidNumber !== "-"
  ) {
    const jid = lidNumber.includes("@") ? lidNumber : `${lidNumber}@lid`;
    ownerEntries.push([jid, "JID", true]);
  }

  for (const jid of savedOwners) {
    const normalized = jid && String(jid).includes("@") ? jid : `${jid}@lid`;
    if (!ownerEntries.find((e) => e[0] === normalized))
      ownerEntries.push([normalized, "JID", true]);
  }

  const seen = new Set();
  global.owner = ownerEntries.filter((e) => {
    if (seen.has(e[0])) return false;
    seen.add(e[0]);
    return true;
  });
} catch (e) {
  // fallback to static defaults if anything goes wrong
  global.owner = [
    [
      ownerNumbers.includes("@") ? ownerNumbers : `${ownerNumbers}@lid`,
      NamaOwner,
      true,
    ],
  ];
  // include lidNumber in fallback only if valid
  if (
    lidNumber &&
    String(lidNumber).replace(/[^0-9]/g, "").length >= 5 &&
    lidNumber !== "-"
  ) {
    global.owner.push([
      lidNumber.includes("@") ? lidNumber : `${lidNumber}@lid`,
      "JID",
      true,
    ]);
  }
}

// Bot Information
global.info = {
  nomerbot: botNumbers,
  pairingNumber: botNumbers,
  nomerown: ownerNumbers,
  nameown: NamaOwner,
  namebot: NamaBot,
  wmbot: Watermark,
};

// expose pairing method globally so other modules can read it
global.pairingMetode = pairingMetode;

// expose bot timer globally so other modules can read it
global.botTimer = LidbotTimer;

// expose delay globally so other modules can read it
global.delay = delay;
// expose pakaiBotTimer so other modules can decide whether to use external bot timer
global.pakaiBotTimer = pakaiBotTimer;
// expose bot pembantu globally so other modules can decide whether to use bot pembantu
global.pakaiBotPembantu = pakaiBotPembantu;
global.LidbotPembantu = LidbotPembantu;