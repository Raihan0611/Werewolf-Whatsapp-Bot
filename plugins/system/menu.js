import { generateWAMessageFromContent, proto } from 'baileys';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const wwsettingPath = path.join(__dirname, '../../lib/werewolf/wwsetting.json')
function getWwSetting() {
  try {
    return JSON.parse(fs.readFileSync(wwsettingPath, 'utf-8'))
  } catch (e) {
    return { menu: true }
  }
}

let handler = async (m, { conn }) => {
  try {
    // Respect debug menu toggle: if disabled, do nothing (no output)
    try {
      const setting = getWwSetting()
      if (typeof setting.menu !== 'undefined' && setting.menu === false) return
    } catch (__) {}
    console.log('[plugin:menu] invoked for', m.chat, m.sender);
    // removed preparing message per request

    const ownername = (global.info && global.info.namebot) ? global.info.namebot : 'Owner';
    const teks = `Hai @${m.sender.split('@')[0]} 👋\nPilih menu di bawah untuk melihat opsi:`;

    // Definisikan tombol sebagai quick reply buttons
    // Ini akan muncul sebagai tombol individual di bawah teks pesan
    const quickReplyButtons = [
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🐺 Werewolf', id: '.ww' }) },
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🧩 Skata', id: '.skata' }) },
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📱 Device', id: '.device' }) },
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🆔 Lid', id: '.getlid' }) },
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '👤 Profile', id: '.rank' }) },
      { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📜 Script', id: '.sc' }) }
    ];

    // Buat pesan interaktif menggunakan proto
    const interactiveMessage = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.create({
        text: teks
      }),
      footer: proto.Message.InteractiveMessage.Footer.create({
        text: `By ${ownername}`
      }),
      // Tambahkan header kosong agar sesuai dengan skema pesan yang mungkin ketat di iOS
      header: proto.Message.InteractiveMessage.Header.create({
        hasMediaAttachment: false
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons: quickReplyButtons, // Menggunakan quick reply buttons di sini
      }),
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2
      },
      contextInfo: {
        mentionedJid: [m.sender]
      }
    });

    // Kirim interactiveMessage secara langsung, tanpa membalas pesan (no quote)
    const msg = generateWAMessageFromContent(m.chat, {
      interactiveMessage: interactiveMessage
    }, {});

    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });

  } catch (finalErr) {
    console.error('[plugin:menu] final error', finalErr);
    try {
      await conn.sendMessage(m.chat, { text: 'Terjadi error saat menampilkan menu.' }, {});
    } catch (__) {}
  }
}

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^menu$/i;

export default handler;