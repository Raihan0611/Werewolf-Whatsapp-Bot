import db from '../../lib/system/database.js'

let handler = async (m, { conn, command, usedPrefix, args }) => {
  const jid = m.sender || (m.key && m.key.participant) || null
  if (!jid) return m.reply('Gagal: tidak ada sender')
  const raw = (args[0] || '').toString().toLowerCase().trim()
  // If no argument provided, show current platform
  if (!raw) {
    try {
      const p = db.getPlayer(jid)
      const current = (p && p.platform) ? p.platform : 'tidak diset'
      return m.reply(`📱 Platform kamu saat ini: *${current}*\n\nUntuk mengubah platform, ketik:\n${usedPrefix}device android\n${usedPrefix}device iphone`)
    } catch (e) {
      return m.reply(`Contoh penggunaan:\n${usedPrefix}device android\n${usedPrefix}device iphone`)
    }
  }
  let plat = null
  if (raw === 'android') plat = 'android'
  else if (raw === 'iphone' || raw === 'ios' || raw === 'apple') plat = 'iphone'
  else return m.reply('Pilihan tidak dikenal. Gunakan "android" atau "iphone"')

  try {
    const p = db.getPlayerRef(jid)
    if (!p) return m.reply('Profil tidak ditemukan')
    p.platform = plat
    // persist immediately
    try { db.saveDatabaseSync() } catch (e) {}
    return m.reply(`Platform kamu diubah menjadi ${plat}`)
  } catch (e) {
    console.error('device plugin error', e)
    return m.reply('Terjadi error saat mengubah platform')
  }
}

handler.daftar = true

export default handler
