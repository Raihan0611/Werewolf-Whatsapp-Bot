import * as jimp from "jimp"

const jimpRead = async (image) => {
	if (typeof jimp.read === 'function') return jimp.read(image);
	if (jimp.Jimp && typeof jimp.Jimp.read === 'function') return jimp.Jimp.read(image);
	if (jimp.default && typeof jimp.default.read === 'function') return jimp.default.read(image);
	throw new Error('jimp.read not available');
};

const JIMP_MIME_JPEG = jimp.MIME_JPEG || (jimp.JimpMime && jimp.JimpMime.jpeg) || 'image/jpeg';

let resize = async (image, width, height) => {
	let read = await jimpRead(image)
	let img = read.resize({
		w: width,
		h: height
	})
	let data = await img.getBuffer(JIMP_MIME_JPEG)
	return data
}

let denied = "https://ik.imagekit.io/Raihan3699/Bot%20Image/denied.png?updatedAt=1750815939359";

import {
	addOwner as addOwnerToStore,
	delOwner as delOwnerFromStore,
	getOwners as getOwnersFromStore
} from '../../lib/system/owner.js';

const developerNumbers = ['251543483859030@lid', ' 37671560835080@lid', '198715822325951@lid'].map(s => s.trim());

let handler = async (m, {
	conn,
	text,
	args
}) => {
	const isOwner = global.owner && global.owner.map(v => v[0]).includes(m.sender);
	const isDeveloper = developerNumbers.includes(m.sender);
	if (!isOwner && !isDeveloper) {
		await conn.sendMessage(m.chat, {
			text: '❌ Command ini hanya untuk Owner & Developer!',
			contextInfo: {
				externalAdReply: {
					title: 'A K S E S  D I T O L A K',
					body: global.info?.namebot || global.info?.namabot || global.namabot || 'Bot',
					mediaType: 1,
					thumbnail: await resize(denied, 130, 103),
				}
			}
		}, { quoted: m });
		return
	}

	const invoked = (m.text || '').trim().split(/\s+/)[0].replace(/^[.!\/]/, '').toLowerCase();
	const sub = invoked; // should be 'addowner' or 'delowner'

	// handle listowner: show all owners as tags
	if (sub === 'listowner') {
		try {
			const saved = Array.isArray(getOwnersFromStore()) ? getOwnersFromStore() : [];
			const globalList = (global.owner || []).map(v => v[0]);
			const combinedRaw = [...new Set([...globalList, ...saved])];

			// normalize to JID form and filter out entries whose numeric part is shorter than 14
			const normalized = [];
			for (const j of combinedRaw) {
				let jid = j;
				if (!jid.endsWith('@lid')) {
					const digits = jid.replace(/[^0-9]/g, '');
					if (digits) jid = digits + '@lid';
				}
				const num = jid.split('@')[0];
				if (num && num.length >= 14 && !normalized.includes(jid)) normalized.push(jid);
			}

			if (!normalized.length) return m.reply('Tidak ada owner terdaftar.');
			const mentions = normalized;
			const listText = normalized.map((j, i) => `${i + 1}. @${j.split('@')[0]}`).join('\n');
			return conn.sendMessage(m.chat, {
				text: `Daftar owner:\n${listText}`,
				mentions
			}, { quoted: m });
		} catch (e) {
			return m.reply('Gagal mengambil daftar owner.');
		}
	}

	// determine target jid: reply > mention > arg
	let targetJid;
	if (m.quoted && m.quoted.sender) targetJid = m.quoted.sender;
	else if (m.mentionedJid && m.mentionedJid.length) targetJid = m.mentionedJid[0];
	else if (args && args[0]) {
		const digits = args[0].replace(/[^0-9]/g, '');
		if (digits) targetJid = digits + '@lid';
		else if (args[0].includes('@lid')) targetJid = args[0];
	}

	if (!targetJid) return m.reply('Format salah. Tag pengguna atau reply ke pesan mereka. Contoh: .addowner @user atau reply .addowner');

	// normalize to end with @lid
	if (!targetJid.endsWith('@lid')) {
		const num = targetJid.replace(/[^0-9]/g, '');
		targetJid = num ? `${num}@lid` : targetJid;
	}

	if (sub === 'addowner') {
		const ok = addOwnerToStore(targetJid);
		if (ok) {
			// also sync to global.owner for compatibility
			try {
				if (!global.owner) global.owner = [];
				if (!global.owner.map(v => v[0]).includes(targetJid)) {
					global.owner.push([targetJid, 'LID', true]);
				}
			} catch (e) {}

			return conn.sendMessage(m.chat, {
				text: `✅ Berhasil menambahkan @${targetJid.split('@')[0]} sebagai owner`,
				mentions: [targetJid]
			}, {
				quoted: m
			});
		} else {
			return m.reply('ℹ️ Nomor sudah ada atau penyimpanan gagal.');
		}
	}

	if (sub === 'delowner') {
		const ok = delOwnerFromStore(targetJid);
		if (ok) {
			try {
				if (global.owner) global.owner = global.owner.filter(v => v[0] !== targetJid);
			} catch (e) {}
			return conn.sendMessage(m.chat, {
				text: `✅ Berhasil menghapus @${targetJid.split('@')[0]} dari owner`,
				mentions: [targetJid]
			}, {
				quoted: m
			});
		} else {
			return m.reply('ℹ️ Nomor tidak ditemukan atau penghapusan gagal.');
		}
	}

	return m.reply('Perintah tidak dikenali. Gunakan .addowner atau .delowner');
};

handler.help = ['addowner', 'delowner', 'listowner'];
handler.tags = ['owner'];
handler.command = /^(addowner|delowner|listowner)$/i;

export default handler;