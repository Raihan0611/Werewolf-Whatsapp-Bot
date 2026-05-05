export default async function getLid(m, { conn }) {
  let who = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.sender;

  if (!who) return m.reply('Siapa yang ingin kamu cek LID-nya?');

  let lid = '';
  
  if (who === conn.user.id.split(':')[0] + '@s.whatsapp.net' || who === conn.user.id) {
    lid = conn.user.lid || 'LID tidak ditemukan di sesi ini';
  } else {
    lid = m.senderLid || (m.quoted && m.quoted.senderLid) || null;
  }

  let caption = `\n*LID:* ${who}\n`;

  await m.reply(caption);
}