#!/usr/bin/env node
// Migration script: replace @lid -> @s.whatsapp.net in JSON files
// Usage: node scripts/migrate-lid-to-jid.js

import fs from 'fs'
import path from 'path'

function walk(dir, out) {
  const files = fs.readdirSync(dir)
  for (const f of files) {
    const p = path.join(dir, f)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) walk(p, out)
    else if (f.endsWith('.json')) out.push(p)
  }
}

function migrateFile(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    if (!raw.includes('@lid')) return false
    const replaced = raw.replace(/@lid/g, '@s.whatsapp.net')
    fs.writeFileSync(file, replaced, 'utf8')
    return true
  } catch (e) {
    console.error('fail', file, e)
    return false
  }
}

function main() {
  const root = process.cwd()
  const files = []
  walk(root, files)
  console.info('Found', files.length, '.json files')
  let changed = 0
  for (const f of files) {
    const ok = migrateFile(f)
    if (ok) changed++
  }
  console.info('Migration complete. Files changed:', changed)
}

main()
