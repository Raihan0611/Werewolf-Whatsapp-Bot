import { sKata, cKata } from '../../lib/skata/sambung-kata.js'
import db from '../../lib/system/database.js'
let handler = m => m

handler.before = async function (m) {
	this.skata = this.skata ? this.skata : {}
	let id = m.chat
	if (!(id in this.skata)) return !0
	let room = this.skata[id]

	// helpers
	function getQuotedText(m) {
		if (!m.quoted) return null
		try {
			if (typeof m.quoted === 'string') return m.quoted
			if (m.quoted.text) return m.quoted.text
			if (m.quoted.message) {
				const msg = m.quoted.message
				if (msg.conversation) return msg.conversation
				if (msg.extendedTextMessage && msg.extendedTextMessage.text) return msg.extendedTextMessage.text
				if (msg.imageMessage && msg.imageMessage.caption) return msg.imageMessage.caption
				if (msg.videoMessage && msg.videoMessage.caption) return msg.videoMessage.caption
			}
		} catch (e) { }
		return null
	}
	function getQuotedId(m) {
		if (!m.quoted) return null
		return m.quoted.id || (m.quoted.key && m.quoted.key.id) || (m.quoted.message && m.quoted.message.key && m.quoted.message.key.id) || null
	}
	function getRoomChatId(room) {
		if (!room.chat) return null
		return room.chat.id || (room.chat.key && room.chat.key.id) || (room.chat.message && room.chat.message.key && room.chat.message.key.id) || null
	}

	// helper accessors will use DB API
	let _kata = await genKata()
	let member = room.player
	let bonus = rwd(500, 600)
	let lose_skata
	let win_skata

	function mmr(apa = '', jid = '') {
		let user = db.getSkataUserRef(jid)
		if (apa == 'win') {
			if (user.skata > 5000) win_skata = rwd(5, 9)
			else if (user.skata > 3000) win_skata = rwd(5, 10)
			else if (user.skata > 1500) win_skata = rwd(10, 15)
			else if (user.skata > 1000) win_skata = rwd(15, 20)
			else if (user.skata > 500) win_skata = rwd(20, 30)
			else win_skata = rwd(30, 50)
		} else {
			if (user.skata > 8000) lose_skata = rwd(35, 50)
			else if (user.skata > 5000) lose_skata = rwd(25, 30)
			else if (user.skata > 3000) lose_skata = rwd(20, 25)
			else if (user.skata > 1500) lose_skata = rwd(15, 19)
			else if (user.skata > 1000) lose_skata = rwd(10, 14)
			else if (user.skata > 500) lose_skata = rwd(5, 9)
			else lose_skata = rwd(1, 5)
		}
		return apa == 'win' ? win_skata : lose_skata
	}

	let who
	// MODIFIKASI: Room New Turn
	if (room.new) {
		if (!/nextkata/i.test(m.text)) return !0
		room.new = false
		room.killer = false
		room.kata = _kata
		room.chat = await this.sendMessage(m.chat, {
			text: `Saatnya @${room.curr.split(`@`)[0]}\nMulai : *${(_kata).toUpperCase()}*\n*${room.filter(_kata).toUpperCase()}... ?*\n*Reply untuk menjawab!*\n"nyerah" untuk menyerah\nXP terkumpul: ${room.win_point}\nTersisa: \n${room.player.map((v, i) => i + 1 + '. @' + v.split('@')[0]).join('\n')}`,
			contextInfo: { mentionedJid: member }
		}, { quoted: null })
	}

	// MODIFIKASI: Waktu Habis (Diam)
	if (room.diam) {
		if (!/nextkata/i.test(m.text)) return !0
		room.diam = false
		room.waktu = setTimeout(() => {
			lose_skata = mmr('lose', room.curr)
			win_skata = (room.killer ? mmr('win', room.killer) : null)
			
			this.sendMessage(m.chat, {
				text: `Waktu jawab habis\n@${room.curr.split`@`[0]} tereliminasi -${lose_skata} MMR${room.killer ? `\n@${room.killer.split`@`[0]} +${win_skata} MMR` : ''}`,
				contextInfo: { mentionedJid: room.killer ? [room.curr, room.killer] : [room.curr] }
			}, { quoted: room.chat }).then(_ => {
				room.eliminated.push(room.curr)
				if (room.killer) {
					db.addSkataScore(room.killer, win_skata)
					db.addSkataScore(room.curr, -lose_skata)
				}
				let index = member.indexOf(room.curr)
				member.splice(index, 1)
				room.curr = member[index] || member[0]
				
				if (member.length == 1 && room.status == 'play') {
					this.sendMessage(m.chat, {
						text: `@${member[0].split`@`[0]} Berhasil bertahan\n+${room.win_point}XP`,
						contextInfo: { mentionedJid: [member[0]] }
					}, { quoted: room.chat }).then(_ => {
						db.addSkataExp(member[0], room.win_point)
						delete this.skata[id]
						return !0
					})
				} else {
					room.diam = true
					room.new = true
					who = room.curr
					try {
						let _msg = {
							messages: [{
								key: { remoteJid: m.chat, fromMe: false, id: Math.random().toString(36).slice(2), participant: who },
								message: { conversation: 'nextkata' }
							}],
							type: 'notify'
						}
						if (this && this.ev && this.ev.emit) this.ev.emit('messages.upsert', _msg)
					} catch (e) { }
				}
			})
		}, 30000)
	}

	// Giliran Pemain
	if (room.curr == m.sender) {
		// MODIFIKASI: Menyerah
		if (/nyerah/i.test(m.text)) {
			lose_skata = mmr('lose', room.curr)
			win_skata = (room.killer ? mmr('win', room.killer) : null)
			clearTimeout(room.waktu)
			
			this.sendMessage(m.chat, {
				text: `@${room.curr.split`@`[0]} tereliminasi -${lose_skata} MMR${room.killer ? `\n@${room.killer.split`@`[0]} +${win_skata} MMR` : ''}`,
				contextInfo: { mentionedJid: room.killer ? [room.curr, room.killer] : [room.curr] }
			}, { quoted: room.chat })

			room.eliminated.push(room.curr)
			if (room.killer) {
				db.addSkataScore(room.killer, win_skata)
				db.addSkataScore(room.curr, -lose_skata)
			}
			let index = member.indexOf(room.curr)
			member.splice(index, 1)
			room.curr = member[index] || member[0]
			
			if (member.length == 1 && room.status == 'play') {
				this.sendMessage(m.chat, {
					text: `@${member[0].split`@`[0]} Berhasil bertahan\n+${room.win_point}XP`,
					contextInfo: { mentionedJid: [member[0]] }
				}, { quoted: room.chat })
					db.addSkataExp(member[0], room.win_point)
				delete this.skata[id]
				return !0
			}
			room.new = true
			room.diam = true
			who = room.curr
			try {
				let _msg = {
					messages: [{
						key: { remoteJid: m.chat, fromMe: false, id: Math.random().toString(36).slice(2), participant: who },
						message: { conversation: 'nextkata' }
					}],
					type: 'notify'
				}
				if (this && this.ev && this.ev.emit) this.ev.emit('messages.upsert', _msg)
			} catch (e) { }
		}

		let qtext = getQuotedText(m)
		if (!qtext || !/(Mulai|Tersisa)\s*:/i.test(qtext)) return !0
		let qid = getQuotedId(m), rcid = getRoomChatId(room)
		if (rcid && qid && rcid != qid) return !0

		let answerF = (m.text.toLowerCase().split` `[0]).trim().replace(/[^a-z]/gi, '')
		let checkF = await cKata(m.text.toLowerCase().split` `[0])
		
		if (!answerF.startsWith(room.filter(room.kata))) {
			return m.reply(`👎🏻 *Salah!*\nJawaban harus dimulai dari kata *${room.filter(room.kata).toUpperCase()}*`)
		} else if (!checkF.status) {
			return m.reply(`👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* tidak valid!`)
		} else if ((room.filter(room.kata)) == answerF) {
			return m.reply(`👎🏻 *Salah!*\nJawabanmu sama dengan soal, silahkan cari kata lain!`)
		} else if (room.basi.includes(answerF)) {
			return m.reply(`👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* sudah pernah digunakan!`)
		}

		clearTimeout(room.waktu)
		room.killer = room.curr
		db.addSkataExp(m.sender, bonus)
		let waktunya = member.indexOf(room.curr)
		room.curr = member[waktunya + 1] || member[0]
				room.basi.push(answerF)
		room.win_point += 200
		
		// MODIFIKASI: Jawaban Benar
		room.chat = await this.sendMessage(m.chat, {
			text: `👍+${bonus}XP\nGiliran @${room.curr.split`@`[0]}\n*${room.filter(answerF).toUpperCase()}... ?*\n*Reply untuk menjawab!*\n"nyerah" untuk menyerah\nXP terkumpul: ${room.win_point}\nTersisa: \n${room.player.map((v, i) => i + 1 + '. @' + v.split('@')[0]).join('\n')}`,
			contextInfo: { mentionedJid: member }
		}, { quoted: m })

		room.diam = true
		room.kata = answerF
		who = room.curr
		try {
			let _msg = {
				messages: [{
					key: { remoteJid: m.chat, fromMe: false, id: Math.random().toString(36).slice(2), participant: who },
					message: { conversation: 'nextkata' }
				}],
				type: 'notify'
			}
				if (this && this.ev && this.ev.emit) this.ev.emit('messages.upsert', _msg)
		} catch (e) { }
		return !0
			
	} else if (room.curr !== m.sender) {
		let qtext = getQuotedText(m)
		if (!qtext || !/(Mulai|Tersisa)\s*:/i.test(qtext)) return !0
		let qid = getQuotedId(m), rcid = getRoomChatId(room)
		if (rcid && qid && rcid != qid) return !0

		if (room.eliminated.includes(m.sender)) {
			m.reply(`_Hei, kamu sudah tereliminasi, tunggu hingga game ini selesai_\n*Nice Try, next game*`)
		} else if (room.player.includes(m.sender)) {
			m.reply(`_Bukan giliranmu.._`)
		} else {
			m.reply(`_*Kamu tidak dapat menjawab soal itu*_\nKarena kamu tidak bergabung dalam game ini\n\nTunggu hingga game ini berakhir, kemudian ikutlah bermain!`)
		}
	}
	return !0
}

export default handler

async function genKata() {
	let json = await sKata()
	let result = json.kata
	while (result.length < 3) {
		json = await sKata()
		result = json.kata
	}
	return result
}

function rwd(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}