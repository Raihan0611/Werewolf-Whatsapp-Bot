let handler = async (m, { conn }) => {
    // Loading animasi singkat
    let loadd = [
        '《██▒▒▒▒▒▒▒▒▒▒▒》',
        '《████▒▒▒▒▒▒▒▒▒》',
        '《███████▒▒▒▒▒▒》',
        '《██████████▒▒▒》',
        '《█████████████》',
        '𝙻𝙾𝙰𝙳𝙸𝙽𝙶...'
    ];

    let { key } = await conn.sendMessage(m.chat, { text: '_Loading_' });

    for (let i = 0; i < loadd.length; i++) {
        await conn.sendMessage(m.chat, { text: loadd[i], edit: key });
    }

    // Info script Werewolf Bot
    let info = `╭━[ *SCRIPT WEREWOLF BOT* ]━╮

*📂 Source Code (GitHub):*
https://github.com/Raihan0611/Werewolf-Whatsapp-Bot

*▶️ YouTube Channel:*
https://www.youtube.com/@raiverseid

*👨‍💻 Developer:*
wa.me/6285173061143

━━━━━━━━━━━━━━━━━━━━━━
Silakan kunjungi link di atas untuk mendapatkan script, tutorial, atau bertanya seputar pengembangan bot ini.
Jangan lupa subscribe dan support channel YouTube developer!

╰━━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text: info }, { quoted: m });
};

handler.help = ['sc']
handler.tags = ['info']
handler.command = /^(sc|script|source)$/i;

export default handler;