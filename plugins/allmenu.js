import os from 'os'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import fetch from 'node-fetch'

let stateMenu = 0;

let handler = async (m, { conn, usedPrefix: _p, _args: theargs }) => {
  let p = '```'
  let x = '`'
  let tags = {}

  const defaultMenu = {
    before: `
┏━━━━━━━━━━━━━━━━━━
┃  *INFO BOT*
┣━━━━━━━━━━━━━━━━━━
┃ • Nama Bot  : *Zenzz AI - MD*  
┃ • Platform  : *${os.platform()}*
┃ • Runtime   : *%muptime
┃ • Uptime    : *%uptime
┃ • Versi     : *${global.versi}*
┣━━━━━━━━━━━━━━━━━━
┃  *USER*
┣━━━━━━━━━━━━━━━━━━
┃ • Nama Pengguna : *${m.pushName || conn.getName(m.sender)}* 
┃ • Total User    : *%totalreg*
┃ • Mode Bot      : *Public*
┗━━━━━━━━━━━━━━━━━━
  `.trimStart(),

    header: `
┣━━━━━━━━━━━━━━━━
┃ *%category*
┣━━━━━━━━━━━━━━━━`,

    body: `┃ • .%cmd`,

    footer: '┗━━━━━━━━━━━━━━━━',

    after: `> © Zenrix MD V6`
  }

  try {
    let name = m.pushName || conn.getName(m.sender)  // Nama pengguna
    let botName = global.namebot || conn.getName(conn.user.jid)  // Nama bot (ambil dari config)

    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    })
    let time = d.toLocaleTimeString(locale, { timeZone: 'Asia/Jakarta' }).replace(/[.]/g, ':')

    let _muptime, _uptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
      process.send('uptime')
      _uptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }

    let totalreg = Object.keys(global.db.data.users).length
    let platform = os.platform()
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }))

    for (let plugin of help) {
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    }

    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after

    let alltags = []
    let menunya = []

    if (theargs?.length > 0) {
      if (theargs?.includes("next")) {
        let tag = Object.keys(tags)[Math.floor(Math.random() * Object.keys(tags).length)]
        menunya = [ header.replace(/%category/g, tags[tag].toUpperCase()) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
              return menu.help.map(help => {
                return body.replace(/%cmd/g, help).trim()
              }).join('\n')
            }),
            footer
          ].join('\n')
        ]
      } else {
        menunya = Object.keys(tags).map(tag => {
          alltags.push(`- *${tag}*`)
          if (!theargs.includes(tag) && !theargs.includes('all')) return ''
          return header.replace(/%category/g, tags[tag].toUpperCase()) + '\n' + [
            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
              return menu.help.map(help => {
                return body.replace(/%cmd/g, help).trim()
              }).join('\n')
            }),
            footer
          ].join('\n')
        })
      }
    } else if (theargs?.length === 0) {
      menunya = [global?.msg?.menu(m)]
    }

    menunya = menunya.filter(item => item !== '' && item !== undefined && item !== null)

    if (menunya?.length <= 0) {
      menunya = [`Menu "${theargs.join(' ')}" tidak ditemukan. Tag tersedia:`]
      menunya.push(...alltags)
    }

    let _text = [before, ...menunya, after].join('\n')

    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      name, date, time, platform, _p, totalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let loadingFrames = [
      '*[ ⚀ ] Loading...*\n_*▰▱▱▱▱*_',
      '*[ ⚁ ] Loading...*\n_*▱▰▱▱▱*_',
      '*[ ⚂ ] Loading...*\n_*▱▱▰▱▱*_',
      '*[ ⚃ ] Loading...*\n_*▱▱▱▰▱*_',
      '*[ ⚄ ] Loading...*\n_*▱▱▱▱▰*_',
      '*[ ✔ ] Selesai!*'
    ]

    let { key } = await conn.sendMessage(m.chat, { text: loadingFrames[0] }, { quoted: m })

    for (let i = 1; i < loadingFrames.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)) // bisa diatur jadi 100-300ms
      await conn.sendMessage(m.chat, { text: loadingFrames[i], edit: key })
    }

    await conn.sendMessage(m.chat, {
  document: { url: 'https://wa.me' },
  mimetype: 'application/pdf',
  fileName: m.name,
  fileLength: 1000000000000,
  caption: text.trim(),
  contextInfo: {
    isForwarded: true,
    externalAdReply: {
      title: botName,
      body: 'zen',
      thumbnailUrl: 'https://files.catbox.moe/h3njeb.jpg',
      sourceUrl: 'https://wa.me',
      mediaType: 1,
      renderLargerThumbnail: true,
    },
  },
    buttons: [
      {
        buttonId: '.menu all',
        buttonText: {
          displayText: 'ᴀʟʟᴍᴇɴᴜ 📚'
        },
        type: 1,
      },
      {
        buttonId: '.owner',
        buttonText: {
          displayText: 'ᴏᴡɴᴇʀ👤'
        },
        type: 1,
      },
      {
        buttonId: 'action',
        buttonText: {
          displayText: 'sᴇᴍᴜᴀ ᴍᴇɴᴜ'
        },
        type: 4,
        nativeFlowInfo: {
  name: 'single_select',
  paramsJson: JSON.stringify({
    title: 'ᴢᴇɴɴ ᴍᴇɴᴜʟɪsᴛ',
    sections: [
      {
        title: 'ᴢᴇɴɴ ᴍᴇɴᴜʟɪsᴛ',
        highlight_label: 'sᴇᴍᴜᴀ ᴍᴇɴᴜ',
rows: [
  { title: 'Allmenu 📚', description: '➡️ Menampilkan semua menu', id: '.menu all' },
  { title: 'Advanced 🧪', description: '➡️ Menampilkan Menu Advanced', id: '.menu advanced' },
  { title: 'Ai 🤖', description: '➡️ Menampilkan Menu Ai', id: '.menu ai' },
  { title: 'Audio 🎧', description: '➡️ Menampilkan Menu Audio', id: '.menu audio' },
  { title: 'Downloader ⬇️', description: '➡️ Menampilkan Menu Downloader', id: '.menu downloader' },
  { title: 'Fun 🎉', description: '➡️ Menampilkan Menu Fun', id: '.menu fun' },
  { title: 'Game 🎮', description: '➡️ Menampilkan Menu Game', id: '.menu game' },
  { title: 'Group 👥', description: '➡️ Menampilkan Menu Group', id: '.menu group' },
  { title: 'Image 🖌️', description: '➡️ Menampilkan Menu Image', id: '.menu image' },
  { title: 'Info ℹ️', description: '➡️ Menampilkan Menu Info', id: '.menu info' },
  { title: 'Internet 🌐', description: '➡️ Menampilkan Menu Internet', id: '.menu internet' },
  { title: 'Islami 🕌', description: '➡️ Menampilkan Menu Islami', id: '.menu islami' },
  { title: 'Islamic 🕋', description: '➡️ Menampilkan Menu Islamic', id: '.menu islamic' },
  { title: 'Kerang 🐚', description: '➡️ Menampilkan Menu Kerang', id: '.menu kerang' },
  { title: 'Main 🧭', description: '➡️ Menampilkan Menu Main', id: '.menu main' },
  { title: 'Maker ✏️', description: '➡️ Menampilkan Menu Maker', id: '.menu maker' },
  { title: 'Nsfw 🔞', description: '➡️ Menampilkan Menu NSFW', id: '.menu nsfw' },
  { title: 'Owner 👑', description: '➡️ Menampilkan Menu Owner', id: '.menu owner' },
  { title: 'Premium 💎', description: '➡️ Menampilkan Menu Premium', id: '.menu premium' },
  { title: 'Rpg ⚔️', description: '➡️ Menampilkan Menu RPG', id: '.menu rpg' },
  { title: 'Search 🔍', description: '➡️ Menampilkan Menu Search', id: '.menu search' },
  { title: 'Sound 🔊', description: '➡️ Menampilkan Menu Sound', id: '.menu sound' },
  { title: 'Stalker 🕵️', description: '➡️ Menampilkan Menu Stalker', id: '.menu stalker' },
  { title: 'Sticker 🖼️', description: '➡️ Menampilkan Menu Sticker', id: '.menu sticker' },
  { title: 'Store 🛒', description: '➡️ Menampilkan Menu Store', id: '.menu store' },
  { title: 'Tools 🛠️', description: '➡️ Menampilkan Menu Tools', id: '.menu tools' },
  { title: 'User 👤', description: '➡️ Menampilkan Menu User', id: '.menu user' }
]
      },
    ],
  }),
        },
      },
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: m })
  } catch (e) {
    m.reply('Error')
  }
}

handler.command = /^(menu|allmenu)$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  return [d, 'H ', h, 'J ', m, 'M*'].map(v => v.toString().padStart(2, 0)).join('')
}

// Konfigurasi agar tidak ngetag
global.configMenuTagUser = false