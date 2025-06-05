let handler = async(m, { conn }) => {
    // Daftar nomor owner dan developer
    let contacts = [
        [global.info.nomerbot, 'Bot 🤖', ''],
        [global.info.nomerown, 'Owner 👑', ''],
        ['6285173061143', 'Developer 💻', '']
    ]
    // Kirim kontak owner dulu, lalu developer
    let msg = await conn.sendContact(m.chat, contacts, m)
    await delay(1000)
    await conn.sendMessage(
        m.chat,
        { text: `Hallo Kak @${m.sender.split('@')[0]}, Itu Nomor Owner dan Developerku. Jangan di spam ya!`, mentions: [m.sender] },
        { quoted: msg }
    )
}
handler.help = ['owner']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

export default handler

const delay = time => new Promise(res => setTimeout(res, time))