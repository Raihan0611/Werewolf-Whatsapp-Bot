import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, command, usedPrefix }) => {
  try {
    const pkgPath = path.join(__dirname, '../../package.json')
    const raw = fs.readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(raw)
    const werewolfVer = pkg.version || 'unknown'
    let baileysVer = 'not found'
    if (pkg.dependencies && pkg.dependencies.baileys) baileysVer = pkg.dependencies.baileys
    else if (pkg.devDependencies && pkg.devDependencies.baileys) baileysVer = pkg.devDependencies.baileys

    const teks = `◧ Werewolf : v${werewolfVer}\n◧ Baileys : v${baileysVer}`
    return m.reply(teks)
  } catch (e) {
    console.error('[plugin:version] error', e)
    return m.reply('Gagal mengambil versi dari package.json')
  }
}

export default handler
