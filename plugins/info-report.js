let handler = async (m, { conn }) => {
    const developerJid = '6285173061143@s.whatsapp.net';
    const githubIssue = 'https://github.com/Raihan0611/Werewolf-Whatsapp-Bot/issues';
    const supportGroup = 'https://chat.whatsapp.com/JqjGYDq0N58CcvkB5IWHLg';

    let reportText = `*🐞 REPORT BUG / SARAN FITUR*\n
Silakan kirim laporan bug, error, atau saran fitur dengan format berikut:

*1. Deskripsi Masalah:*
Tulis detail bug/error yang kamu alami.

*2. Langkah Memunculkan Bug:*
Jelaskan langkah-langkah agar bug bisa dimunculkan.

*3. Screenshot/Error Log:*
Lampirkan screenshot atau pesan error jika ada.

*4. Username/No WA:*
@${m.sender.replace('@s.whatsapp.net', '')}

━━━━━━━━━━━━━━━━━━━━━━━
*📞 Developer:* wa.me/6285173061143
*🐙 GitHub Issue:* ${githubIssue}
*💬 Grup Support:* ${supportGroup}

Kamu bisa bisa chat nomor di atas dengan bukti screenshot atau detail error, atau laporkan lewat GitHub Issue.
Terima kasih atas kontribusinya!`;

    await conn.sendMessage(m.chat, { text: reportText, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['report'];
handler.tags = ['info'];
handler.command = /^report$/i;

export default handler;