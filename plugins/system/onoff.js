import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OFF_PATH = path.join(__dirname, '../../lib/system/botoff.json');

function loadOffList() {
  if (!fs.existsSync(OFF_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(OFF_PATH, 'utf-8')) || [];
  } catch (e) {
    return [];
  }
}

function saveOffList(list) {
  try {
    fs.mkdirSync(path.dirname(OFF_PATH), { recursive: true });
    fs.writeFileSync(OFF_PATH, JSON.stringify(list, null, 2));
  } catch (e) {
    // ignore
  }
}

import { isOwner as isOwnerCheck, isDeveloper as isDeveloperCheck } from '../../lib/system/owner.js';

// before hook: block processing in groups that have bot turned off
export function before(m) {
  try {
    const chatId = m.chat || m.remoteJid || m.key?.remoteJid || '';
    const isGroup = String(chatId).endsWith('@g.us');
    if (!isGroup) return true;

    const list = loadOffList();
    if (!list.includes(chatId)) return true;

    const text = String(m.text || m.body || '').trim();
    if (!text) return false;

    // Allow only the .bot on command to pass through (prefix . or /)
    const allowOn = /^([./]|\.)\s*bot\s+on\b/i.test(text);
    if (allowOn) return true;
    return false;
  } catch (e) {
    return true;
  }
}

export default async function onoffPlugin(m, { conn, args, groupMetadata }) {
  const chatId = m.chat || m.remoteJid || m.key?.remoteJid || '';
  const isGroup = String(chatId).endsWith('@g.us');
  if (!isGroup) return conn.sendMessage(chatId, { text: 'Perintah ini hanya dapat digunakan di grup.' }, { quoted: m }).catch(() => {});

  const sender = m.sender || m.key?.participant || m.participant;
  const isOwner = isOwnerCheck(sender);
  const isDeveloper = isDeveloperCheck(sender);

  let isAdmin = false;
  try {
    if (groupMetadata && groupMetadata.participants) {
      const p = groupMetadata.participants.find((x) => x.id === sender || x.id === (sender));
      // participant admin fields may be 'admin' or 'isAdmin'
      isAdmin = !!(p && (p.admin || p.isAdmin || p.is_super_admin || p.isSuperAdmin));
    }
  } catch (e) {}

  if (!isAdmin && !isOwner && !isDeveloper) {
    return conn.sendMessage(chatId, { text: '❌ Command ini hanya untuk Admin, Owner, atau Developer.' }, { quoted: m }).catch(() => {});
  }

  const sub = (args && args[0]) ? String(args[0]).toLowerCase() : '';
  const list = loadOffList();

  if (sub === 'off') {
    if (!list.includes(chatId)) {
      list.push(chatId);
      saveOffList(list);
      return conn.sendMessage(chatId, { text: '✅ Bot dimatikan untuk grup ini. Ketik .bot on untuk mengaktifkan kembali.' }, { quoted: m }).catch(() => {});
    } else {
      return conn.sendMessage(chatId, { text: 'ℹ️ Bot sudah dimatikan di grup ini.' }, { quoted: m }).catch(() => {});
    }
  }

  if (sub === 'on') {
    const idx = list.indexOf(chatId);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveOffList(list);
      return conn.sendMessage(chatId, { text: '✅ Bot diaktifkan kembali di grup ini.' }, { quoted: m }).catch(() => {});
    } else {
      return conn.sendMessage(chatId, { text: 'ℹ️ Bot sudah aktif di grup ini.' }, { quoted: m }).catch(() => {});
    }
  }

  return conn.sendMessage(chatId, { text: 'Gunakan .bot on atau .bot off' }, { quoted: m }).catch(() => {});
}

// attach before hook to default export for index.js resolveHandler lookup
try {
  onoffPlugin.before = before;
} catch (e) {}
