import db from '../../lib/system/database.js'
import { playerOnGame } from '../../lib/werewolf/werewolf.js'

export default async function daftar(m, ctx) {
  const senderLid = m.sender || (m.key && m.key.participant) || m.participant || null
  const jid = m.chat || m.remoteJid || (m.key && m.key.remoteJid) || null
  const command = (ctx && ctx.command) || ''
  const args = (ctx && ctx.args) || []

  if (!senderLid) return

  if (command === 'daftar') {
    // prevent re-registration
    try {
      if (db.isRegistered(senderLid)) {
        return ctx.sendMessage(jid, 'Anda sudah terdaftar. Gunakan\n*.unreg* untuk menghapus pendaftaran jika ingin mendaftar ulang. Tetapi semua data akan dihapus.')
      }
    } catch (e) {
      console.error('daftar: isRegistered check failed', e)
    }

    // Accept format: .daftar Nama.Umur.Platform
    // Nama boleh mengandung spasi, contoh: .daftar Raihan Fathur.25.android
    const raw = (args || []).join(' ').trim()
    if (!raw) {
      return ctx.sendMessage(jid, 'Format: .daftar Nama.Umur.Platform\nContoh:\n> .daftar Raihan.25.android\n> .daftar Raihan.25.iphone\n\n‼️ *Penting untuk memberitahu Device mu agar hp mu tidak error!')
    }

    const lastDot = raw.lastIndexOf('.')
    const secondLastDot = raw.lastIndexOf('.', lastDot - 1)
    if (secondLastDot === -1 || lastDot === -1) {
      return ctx.sendMessage(jid, 'Format tidak valid.\ncontoh:\n.daftar Raihan.25.android')
    }

    const name = raw.slice(0, secondLastDot).trim()
    const ageStr = raw.slice(secondLastDot + 1, lastDot).trim()
    const platform = raw.slice(lastDot + 1).trim().toLowerCase()

    if (!/^\d+$/.test(ageStr)) {
      return ctx.sendMessage(jid, 'Umur harus berupa angka (contoh: 25)')
    }
    const age = Number(ageStr)

    // Validate platform: only accept 'android' or 'iphone'
    if (!['android', 'iphone'].includes(platform)) {
      return ctx.sendMessage(jid, 'Platform tidak valid. Gunakan "android" atau "iphone".\nContoh: .daftar Raihan.25.android')
    }

    // Name validation: allow letters and spaces, reasonable length
    if (!/^[A-Za-z\s]{1,20}$/.test(name)) {
      return ctx.sendMessage(jid, 'Nama hanya boleh berisi huruf dan spasi (maks 20 karakter), contoh: Raihan Carmen')
    }

    // Age limits: min 10, max 70
    if (age < 10) return ctx.sendMessage(jid, 'Umur minimal 10 tahun — anak kecil tidak diperbolehkan')
    if (age > 70) return ctx.sendMessage(jid, 'Umur maksimal 70 tahun — terlalu tua untuk mendaftar')

    try {
      const p = db.registerPlayer(senderLid, name, age, platform)
      // include platform in confirmation message
      return ctx.sendMessage(jid, `✅ Terdaftar:\n🪪 Nama: ${p.name}\n🎂 Umur: ${p.age}\n📱 Platform: ${p.platform || platform}`)
    } catch (e) {
      console.error('daftar error', e)
      return ctx.sendMessage(jid, 'Gagal mendaftar: ' + (e.message || e))
    }
  }

  if (command === 'unreg') {
    try {
      // prevent unreg while player is in an active werewolf session
      try {
        const ww = ctx && ctx.conn ? ctx.conn.werewolf : null
        if (ww && playerOnGame(senderLid, ww) === true) {
          return ctx.sendMessage(jid, 'Kamu sedang dalam sesi permainan, tidak dapat unreg sampai permainan selesai.')
        }
      } catch (e) {}

      const ok = db.deletePlayer(senderLid)
      if (ok) return ctx.sendMessage(jid, 'Pendaftaran Anda telah dihapus.')
      return ctx.sendMessage(jid, 'Anda belum terdaftar.')
    } catch (e) {
      console.error('unreg error', e)
      return ctx.sendMessage(jid, 'Gagal menghapus pendaftaran: ' + (e.message || e))
    }
  }
}
