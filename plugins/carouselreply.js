const { generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(
    `Contoh:\n${usedPrefix + command} 62812xxxxxxx@s.whatsapp.net|Judul Carousel|Footer Carousel || Judul1|Deskripsi1|.menu|.owner|.donasi || Judul2|Deskripsi2|.help|.info`
  )

  // Format: <jid>|<judulCarousel>|<footerCarousel> || <judul1>|<desc1>|<btn1>|[btn2]|[btn3] || ...
  let [first, ...cardInputs] = args.join(' ').split('||').map(v => v.trim()).filter(Boolean)
  let [jid, carouselTitle, carouselFooter] = first.split('|').map(v => v.trim())
  if (!jid || !carouselTitle || !carouselFooter) return m.reply('Format salah!\nContoh: .carouselreply 62812xxxxxxx@s.whatsapp.net|Judul Carousel|Footer Carousel || Judul1|Deskripsi1|.menu|.owner|.donasi')

  let cards = []
  for (let cardStr of cardInputs) {
    let [title, desc, ...btns] = cardStr.split('|').map(v => v.trim())
    if (!title || !desc || !btns.length) continue

    // Maksimal 3 tombol reply per card
    let replyButtons = btns.slice(0, 3).map((btn, i) => ({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: btn,
        id: btn // payload yang dikirim ke bot saat tombol diklik
      })
    }))

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `*${title}*\n\n${desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: carouselFooter
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: false
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: replyButtons
      })
    })
  }

  if (!cards.length) return m.reply('Card tidak boleh kosong!')

  const slideMessage = generateWAMessageFromContent(jid, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: carouselTitle
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: carouselFooter
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(jid, slideMessage.message, { messageId: slideMessage.key.id })
  m.reply('Carousel reply berhasil dikirim!')
}

handler.help = ['carouselreply <id>|<judulCarousel>|<footerCarousel> || <judul1>|<deskripsi1>|<button1>|[button2]|[button3] [|| ...]']
handler.tags = ['tools']
handler.command = /^carouselreply$/i
handler.owner = true

export default handler