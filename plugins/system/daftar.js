import db from '../../lib/system/database.js'

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
    if (args.length < 2) {
      return ctx.sendMessage(jid, 'Format: .daftar Nama Umur\nContoh:\n.daftar Raihan 25')
    }
    const name = String(args[0]).trim()
    const ageStr = String(args[1]).trim()
    if (!/^-?\d+$/.test(ageStr)) {
      return ctx.sendMessage(jid, 'Umur harus berupa angka (contoh: 25)')
    }
    const age = Number(ageStr)
    // Name validation: only letters, max 10 characters
    if (!/^[A-Za-z]{1,10}$/.test(name)) {
      return ctx.sendMessage(jid, 'Nama harus berupa huruf (maksimal 10 huruf), contoh: Raihan')
    }
    // Age limits: min 10, max 60
    if (age < 10) return ctx.sendMessage(jid, 'Umur minimal 10 tahun — anak kecil tidak diperbolehkan')
    if (age > 60) return ctx.sendMessage(jid, 'Umur maksimal 60 tahun — terlalu tua untuk mendaftar')
    try {
      const p = db.registerPlayer(senderLid, name, age)
      return ctx.sendMessage(jid, `✅ Terdaftar: ${p.name} (umur ${p.age})`)
    } catch (e) {
      console.error('daftar error', e)
      return ctx.sendMessage(jid, 'Gagal mendaftar: ' + (e.message || e))
    }
  }

  if (command === 'unreg') {
    try {
      const ok = db.deletePlayer(senderLid)
      if (ok) return ctx.sendMessage(jid, 'Pendaftaran Anda telah dihapus.')
      return ctx.sendMessage(jid, 'Anda belum terdaftar.')
    } catch (e) {
      console.error('unreg error', e)
      return ctx.sendMessage(jid, 'Gagal menghapus pendaftaran: ' + (e.message || e))
    }
  }
}
