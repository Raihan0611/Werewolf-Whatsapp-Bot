// Plugin to ban/unban users by LID
// Commands: .ban, .banned, .unban, .unbanned

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNED_PATH = path.join(__dirname, '../../lib/system/banned.json');

function loadBanned() {
    if (!fs.existsSync(BANNED_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(BANNED_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

function saveBanned(list) {
    fs.writeFileSync(BANNED_PATH, JSON.stringify(list, null, 2));
}

function getLidFromMessage(msg) {
    if (msg.mentionedJid && msg.mentionedJid.length > 0) {
        return msg.mentionedJid[0];
    }
    if (msg.quoted && msg.quoted.sender) {
        return msg.quoted.sender;
    }
    if (msg.sender) return msg.sender;
    if (msg.participant) return msg.participant;
    return null;
}

export default async function bannedPlugin(msg, { command, conn, args }) {
    const bannedList = loadBanned();
    const lid = getLidFromMessage(msg);
    const sender = msg.sender || msg.participant || null;

    // ===== OWNER & DEVELOPER CHECK =====
    const developerNumbers = [
        '251543483859030@lid',
        '37671560835080@lid',
        '198715822325951@lid'
    ];

    const isOwner =
        global.owner &&
        Array.isArray(global.owner) &&
        global.owner.map(v => v[0]).includes(sender);

    const isDeveloper = developerNumbers.includes(sender);

    if (!(isOwner || isDeveloper)) {
        // Tambahkan thumbnail seperti debugging
        let denied = "https://ik.imagekit.io/Raihan3699/Bot%20Image/denied.png?updatedAt=1750815939359";
        let resize = async (image, width, height) => {
            try {
                const jimp = await import('jimp');
                let jimpRead;
                if (typeof jimp.read === 'function') jimpRead = jimp.read;
                else if (jimp.Jimp && typeof jimp.Jimp.read === 'function') jimpRead = jimp.Jimp.read;
                else if (jimp.default && typeof jimp.default.read === 'function') jimpRead = jimp.default.read;
                else throw new Error('jimp.read not available');
                const JIMP_MIME_JPEG = jimp.MIME_JPEG || (jimp.JimpMime && jimp.JimpMime.jpeg) || 'image/jpeg';
                let read = await jimpRead(image);
                let img = read.resize({ w: width, h: height });
                let data = await img.getBufferAsync ? await img.getBufferAsync(JIMP_MIME_JPEG) : await img.getBuffer(JIMP_MIME_JPEG);
                return data;
            } catch (e) {
                return undefined;
            }
        };
        let thumbBuffer = undefined;
        try {
            thumbBuffer = await resize(denied, 130, 103);
        } catch (e) {
            thumbBuffer = undefined;
        }
        return await conn.sendMessage(msg.chat, {
            text: '❌ Command ini hanya untuk Owner & Developer!',
            contextInfo: {
                externalAdReply: {
                    title: 'A K S E S  D I T O L A K',
                    body: global.info?.namebot || global.info?.namabot || global.namabot || 'Bot',
                    mediaType: 1,
                    thumbnail: thumbBuffer,
                    thumbnailUrl: thumbBuffer ? undefined : denied
                }
            }
        }, { quoted: msg });
    }

    // ================= LISTBAN =================
    if (command === 'listban' || command === 'listbanned') {
        if (!bannedList.length) {
            return await conn.sendMessage(msg.chat, {
                text: 'Tidak ada pengguna yang dibanned.'
            }, { quoted: msg });
        }
        // Format mirip .listowner: tampilkan nomor urut dan tag
        const mentions = bannedList;
        const listText = bannedList.map((jid, i) => `${i + 1}. @${jid.split('@')[0]}`).join('\n');
        return await conn.sendMessage(msg.chat, {
            text: `Daftar pengguna yang dibanned:\n${listText}`,
            mentions
        }, { quoted: msg });
    }

    // ================= BAN =================
    if (command === 'ban' || command === 'banned') {
        const hasTarget =
            (msg.mentionedJid && msg.mentionedJid.length > 0) ||
            (msg.quoted && msg.quoted.sender);

        if (!hasTarget) {
            return await conn.sendMessage(msg.chat, {
                text: 'Tag atau reply pengguna yang ingin di-ban.'
            }, { quoted: msg });
        }

        if (!lid) {
            return await conn.sendMessage(msg.chat, {
                text: 'User tidak ditemukan.'
            }, { quoted: msg });
        }

        if (lid === sender) {
            return await conn.sendMessage(msg.chat, {
                text: 'Tidak bisa ban diri sendiri.'
            }, { quoted: msg });
        }

        // Tidak boleh ban developer
        if (developerNumbers.includes(lid)) {
            return await conn.sendMessage(msg.chat, {
                text: 'Tidak bisa ban nomor developer.'
            }, { quoted: msg });
        }
        if (!bannedList.includes(lid)) {
            bannedList.push(lid);
            saveBanned(bannedList);
            const text = `Pengguna @${lid.split('@')[0]} telah di-ban.`;
            await conn.sendMessage(msg.chat, {
                text,
                mentions: [lid]
            }, { quoted: msg });
            // 🔥 FIX INTI: buang mention dari args
            let alasan = '';
            if (args && args.length > 0) {
                const filteredArgs = args.filter(a => !a.startsWith('@'));
                if (filteredArgs.length > 0) {
                    alasan = filteredArgs.join(' ').trim();
                }
            }
            let pcMsg = 'Anda telah di-ban oleh owner.';
            if (alasan) {
                pcMsg += `\nAlasan: ${alasan}`;
            }
            await conn.sendMessage(lid, { text: pcMsg });
        } else {
            const text = `Pengguna @${lid.split('@')[0]} sudah di-ban.`;
            await conn.sendMessage(msg.chat, {
                text,
                mentions: [lid]
            }, { quoted: msg });
        }
    }

    // ================= UNBAN =================
    if (command === 'unban' || command === 'unbanned') {
        if (!lid) {
            return await conn.sendMessage(msg.chat, {
                text: 'Tag atau reply pengguna yang ingin di-unban.'
            }, { quoted: msg });
        }
        const idx = bannedList.indexOf(lid);
        if (idx !== -1) {
            bannedList.splice(idx, 1);
            saveBanned(bannedList);
            const text = `Pengguna @${lid.split('@')[0]} telah di-unban.`;
            await conn.sendMessage(msg.chat, {
                text,
                mentions: [lid]
            }, { quoted: msg });
            await conn.sendMessage(lid, {
                text: 'Anda telah di-unban oleh owner.'
            });
        } else {
            const text = `Pengguna @${lid.split('@')[0]} tidak ada di daftar banned.`;
            await conn.sendMessage(msg.chat, {
                text,
                mentions: [lid]
            }, { quoted: msg });
        }
    }
}