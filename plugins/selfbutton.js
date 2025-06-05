let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Contoh: ${usedPrefix + command} 6281234567890|Halo!|Button1|Button2`)
  let [nomor, pesan, ...buttons] = args.join(' ').split('|').map(v => v.trim())
  if (!nomor || !pesan) return m.reply('Format salah!\nContoh: .selfbtn 6281234567890|Halo!|Button1|Button2')
  if (buttons.length === 0) return m.reply('Minimal 1 button!')

  let cleanNumber = nomor.replace(/[^0-9]/g, '')
  if (cleanNumber.length < 8) return m.reply('Nomor tidak valid!')
  let jid = cleanNumber + '@s.whatsapp.net'

  // Format button seperti allmenu.js
  let buttonObjects = buttons.map((btn, i) => ({
    buttonId: `.selfbtn${i+1}`,
    buttonText: { displayText: btn },
    type: 1,
  }))

  try {
    await conn.sendMessage(jid, {
      text: pesan,
      footer: 'Pilihh Coba', // bisa diisi jika ingin
      buttons: buttonObjects,
      headerType: 3,
      viewOnce: true
    },)
    m.reply(`Pesan dengan button berhasil dikirim ke ${nomor}`)
  } catch (e) {
    m.reply('Gagal mengirim pesan!\n' + e)
  }
}

handler.help = ['self <nomor>|<pesan>|<button1>|[button2]|[button3]|[button4]|[button5]']
handler.tags = ['tools']
handler.command = /^selfbtn$/i

export default handler