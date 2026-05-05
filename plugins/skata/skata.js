import { sKata, cKata } from '../../lib/skata/sambung-kata.js'
import db from '../../lib/system/database.js'
const game = `╔══「 *Kata Bersambung* 」
╟ Game Kata Bersambung adalah
║  permainan yang dimana setiap
║  pemainnya diharuskan membuat
║  kata dari akhir kata yang
║  berasal dari kata sebelumnya.
╚═════`.trim()
const rules = `╔══「 *PERATURAN* 」
╟ Jawaban merupakan kata dasar
║  yaitu tidak mengandung
║  spasi dan imbuhan (me-, -an, dll).
╟ Pemain yang bertahan akan
║  menang dan mendapatkan
║  500xp X jumlah pemain
╟ .skata start untuk memulai
╚═════`.trim()

let handler = async (m, { conn, text, args, isPrems, isROwner, usedPrefix, command } = {}) => {
	if (!conn) conn = (global.connShim || global.conn || {})
	if (!text) text = (args && args[0]) ? args[0] : ''
	let isDebug = /debug/i.test(command) && isROwner
	
	if (!conn.skata || typeof conn.skata !== 'object') conn.skata = {}
	let id = m.chat
	let kata = await genKata()
	const skataStore = conn.skata || {}
	
	let room_all = Object.values(skataStore).find(room => room && room.id !== id && room.player && room.player.includes(m.sender))
	if (room_all) {
		await conn.sendMessage(m.chat, { text: 'Kamu sedang bermain sambung kata di chat lain, selesaikan game kamu terlebih dahulu' }, { quoted: m })
		return
	}

	if (Object.prototype.hasOwnProperty.call(skataStore, id)) {
		let room = skataStore[id]
		let member = room.player
		
		if (room.status == 'play') {
			if (!room.waktu._destroyed && !room.diam) {
				return conn.sendMessage(m.chat, { 
					text: `Hii @${m.sender.split('@')[0]}, Masih ada game berlangsung di chat ini\nTunggu hingga game berakhir\nLalu ikut bergabung`, 
					contextInfo: { 
						mentionedJid: [m.sender] 
					} 
				}, { quoted: m }) // Menggunakan m (pesan user) sebagai quote agar tag lebih jelas
			}
			delete conn.skata[id]
		}

		if (text == 'start' && room.status == 'wait') {
			// hanya owner room yang dapat memulai permainan
			if (room.owner && room.owner !== m.sender) {
				const textOwner = `Hanya @${room.owner.split("@")[0]} yang dapat memulai permainan`
				return await conn.sendMessage(m.chat, { text: textOwner, mentions: [room.owner] }, { quoted: m })
			}
			if (!member.includes(m.sender)) return m.reply('Kamu belum ikut')
			if (member.length < 2) {
				await conn.sendMessage(m.chat, { text: 'Minimal 2 orang' }, { quoted: m })
				return
			}
			room.curr = member[0]
			room.status = 'play'
			
			// FIX TAG: Memulai Game
			room.chat = await conn.sendMessage(m.chat, { 
				text: `Saatnya @${member[0].split`@`[0]}\nMulai : *${(room.kata).toUpperCase()}*\n*${room.filter(room.kata).toUpperCase()}... ?*\n*Reply untuk menjawab!*\n"nyerah" untuk menyerah\nTotal: ${member.length} Player`, 
				contextInfo: { mentionedJid: member } 
			}, { quoted: m })
			
			room.win_point = 100
			for (let i of room.player) {
				const user = db.getSkataUserRef(i)
				if (typeof user.skata === 'undefined') user.skata = 0
				if (typeof user.exp === 'undefined') user.exp = 0
			}
			clearTimeout(room.waktu_list)
			
			room.waktu = setTimeout(() => {
				// FIX TAG: Waktu Habis
				conn.sendMessage(m.chat, { 
					text: `Waktu jawab habis\n@${room.curr.split`@`[0]} tereliminasi`, 
					contextInfo: { mentionedJid: [room.curr] } 
				}, { quoted: room.chat }).then(_ => {
					room.eliminated.push(room.curr)
					let index = member.indexOf(room.curr)
					member.splice(index, 1)
					room.curr = member[0]
					
					if (room.player.length == 1 && room.status == 'play') {
						db.addSkataExp(member[0], room.win_point)
						// FIX TAG: Pemenang
						conn.sendMessage(m.chat, { 
							text: `@${member[0].split`@`[0]} Menang\n+${room.win_point}XP`, 
							contextInfo: { mentionedJid: [member[0]] } 
						}, { quoted: room.chat }).then(_ => {
							delete conn.skata[id]
							return !0
						})
					}
					
					room.diam = true
					room.new = true
					let who = room.curr
					try {
						let _msg = {
							messages: [{
								key: { remoteJid: m.chat, fromMe: false, id: Math.random().toString(36).slice(2), participant: who },
								message: { conversation: 'nextkata' }
							}],
							type: 'notify'
						}
						if (conn && conn.ev && conn.ev.emit) conn.ev.emit('messages.upsert', _msg)
					} catch (e) { }
				})
			}, 45000)

		} else if (room.status == 'wait') {
			if (member.includes(m.sender)) {
				await conn.sendMessage(m.chat, { text: 'Kamu sudah ikut di list' }, { quoted: m })
				return
			}
			member.push(m.sender)
			clearTimeout(room.waktu_list)
			room.waktu_list = setTimeout(() => {
				conn.sendMessage(m.chat, { text: `Sambung kata tidak dimulai (Cancel)` }, { quoted: room.chat }).then(() => { delete conn.skata[id] })
			}, 120000)
			
			let caption = `╔═〘 Daftar Player 〙
${member.map((v, i) => `╟ ${i + 1}. @${v.split`@`[0]}`).join('\n')}
╚════
Sambung kata akan dimainkan sesuai urutan player ( *Bergiliran* )
Dan hanya bisa dimainkan oleh player yang terdaftar`.trim()
			
			// FIX TAG: Daftar Player saat Join
			room.chat = await conn.sendMessage(m.chat, { 
				text: `${caption}\n\nKetik\n*${usedPrefix + command}* untuk join/ikut\n*${usedPrefix + command} start* untuk memulai`, 
				contextInfo: { mentionedJid: member } 
			}, { quoted: m })
		}
	} else {
		let initialChat = await conn.sendMessage(m.chat, { text: `${game}\n${rules}` }, { quoted: m }).catch(() => null)
		conn.skata[id] = {
			id,
			player: isDebug ? ([owner[0] + '@s.whatsapp.net', conn.user.jid]) : [],
			owner: isDebug ? (owner && owner[0] ? owner[0] + '@s.whatsapp.net' : m.sender) : m.sender,
			status: 'wait',
			eliminated: [],
			basi: [],
			diam: false,
			win_point: 0,
			curr: '',
			kata,
			filter,
			genKata,
			chat: initialChat,
			waktu: false
		}
	}
}

handler.help = ['sambungkata']
handler.tags = ['game']
handler.command = /^s(ambung)?kata(debug)?$/i
handler.group = true

export default handler

async function genKata() {
	let json = await sKata()
	let result = json.kata
	while (result.length < 3 || result.length > 7) {
		json = await sKata()
		result = json.kata
	}
	return result
}

function filter(text) {
	let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
	let misah
	if (text.length < 3) return text
	if (/([qwrtypsdfghjklzxcvbnm][qwrtypsdfhjklzxcvbnm])$/.test(text)) {
		let mid = /([qwrtypsdfhjklzxcvbnm])$/.exec(text)[0]
		return mid
	}
	if (/([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.test(text)) {
		let mid = /([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.exec(text)[0]
		return mid
	}
	else if (/([aiueo][aiueo]([qwrtypsdfghjklzxcvbnm]|ng)?)$/i.test(text)) {
		if (/(ng)$/i.test(text)) return text.substring(text.length - 3)
		else if (/([qwrtypsdfghjklzxcvbnm])$/i.test(text)) return text.substring(text.length - 2)
		else return text.substring(text.length - 1)
	}
	else if (/n[gy]([aiueo]([qwrtypsdfghjklzxcvbnm])?)$/.test(text)) {
		let nyenye = /n[gy]/i.exec(text)[0]
		misah = text.split(nyenye)
		return nyenye + misah[misah.length - 1]
	}
	else {
		let res = Array.from(text).filter(v => mati.includes(v))
		let resu = res[res.length - 1]
		for (let huruf of mati) {
			if (text.endsWith(huruf)) {
				resu = res[res.length - 2]
			}
		}
		misah = text.split(resu)
		if (text.endsWith(resu)) {
			return resu + misah[misah.length - 2] + resu
		}
		return resu + misah[misah.length - 1]
	}
}