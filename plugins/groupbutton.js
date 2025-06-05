let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Contoh: ${usedPrefix + command} 1234567890-123456@g.us|Halo grup!|Button1|Button2`)
  let [idgrup, pesan, ...buttons] = args.join(' ').split('|').map(v => v.trim())
  if (!idgrup || !pesan) return m.reply('Format salah!\nContoh: .gcbtn 1234567890-123456@g.us|Halo grup!|Button1|Button2')
  if (buttons.length === 0) return m.reply('Minimal 1 button!')

//   if (!idgrup.endsWith('@g.us')) return m.reply('ID grup harus diakhiri dengan @g.us')

  let buttonObjects = buttons.map((btn, i) => ({
    buttonId: `.groupbtn${i+1}`,
    buttonText: { displayText: btn },
    type: 1,
  }))

  try {
    await conn.sendMessage(idgrup, {
      text: pesan,
      footer: 'Sorry ya guys', // bisa diisi jika ingin
      buttons: buttonObjects,
      headerType: 1,
      viewOnce: true
    })
    m.reply(`Pesan dengan button berhasil dikirim ke grup ${idgrup}`)
  } catch (e) {
    m.reply('Gagal mengirim pesan!\n' + e)
  }
}

handler.help = ['group <idgrup>|<pesan>|<button1>|[button2]|[button3]|[button4]|[button5]']
handler.tags = ['tools']
handler.command = /^gcbtn$/i

export default handler