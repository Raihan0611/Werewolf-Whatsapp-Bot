const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(
    `Contoh:\n${usedPrefix + command} 62812xxxxxxx@s.whatsapp.net|Judul Carousel|Footer Carousel || Judul1|Deskripsi1|https://gambar1.jpg|Tombol1|https://link1.com || Judul2|Deskripsi2|https://gambar2.jpg|Tombol2|https://link2.com`
  )

  // Format: <jid>|<judulCarousel>|<footerCarousel> || <judul1>|<desc1>|<img1>|<btn1>|<url1> || <judul2>|<desc2>|<img2>|<btn2>|<url2>
  let [first, ...cardInputs] = args.join(' ').split('||').map(v => v.trim()).filter(Boolean)
  let [jid, carouselTitle, carouselFooter] = first.split('|').map(v => v.trim())
  if (!jid || !carouselTitle || !carouselFooter) return m.reply('Format salah!\nContoh: .carousel 62812xxxxxxx@s.whatsapp.net|Judul Carousel|Footer Carousel || Judul1|Deskripsi1|https://gambar1.jpg|Tombol1|https://link1.com')

  let cards = []
  for (let cardStr of cardInputs) {
    let [title, desc, img, btnText, btnUrl] = cardStr.split('|').map(v => v.trim())
    if (!title || !desc || !img || !btnText || !btnUrl) continue

    // Buat imageMessage
    const imageMsg = await generateWAMessageContent({ image: { url: img } }, {
      upload: conn.waUploadToServer
    }).then(res => res.imageMessage)

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `*${title}*\n\n${desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: carouselFooter
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: 'cta_url',
            buttonParamsJson: `{
              "display_text": "${btnText}",
              "url": "${btnUrl}",
              "merchant_url": "${btnUrl}"
            }`
          }
        ]
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
  m.reply('Carousel berhasil dikirim!')
}

handler.help = ['carousel <id>|<judulCarousel>|<footerCarousel> || <judul1>|<deskripsi1>|<urlgambar1>|<tombol1>|<urlbutton1> [|| ...]']
handler.tags = ['tools']
handler.command = /^carousel$/i
handler.owner = true

export default handler