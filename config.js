import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)))
global.version = `v${pkg.version}`

/*============== INFO OWNER ==============*/
global.link = {
	ig: 'https://www.instagram.com/raihan06.07/',
	gh: 'https://github.com/Raihan0611',
	gc: 'https://whatsapp.com/channel/0029VaMxHNd4SpkBSTSsGF2r',
	web: 'https://whatsapp.com/channel/0029VaMxHNd4SpkBSTSsGF2r'
}

/*============== NOMOR ==============*/
global.info = {
	nomorbot: '6285890900095',
	nomorown: '6285173061143',
	namebot: 'Werewolf Bot',
	nameown: 'Raihan'
}

/*============== STAFF ==============*/
global.owner = [
    ['6285173061143', 'Raihan', 'true']
// [number, dia creator/owner?, dia developer?]
]
global.mods = []
global.prems = []

/*==============API ==============*/
global.APIs = {
    xteam: 'https://api.xteam.xyz',
    lol: 'https://api.lolhuman.xyz',
    males: 'https://malesin.xyz',
    zein: 'https://api.zahwazein.xyz',
    rose: 'https://api.itsrose.life',
    skizo: 'https://skizo.tech',
    saipul: 'https://saipulanuar.cf'
}
global.APIKeys = {
    'https://api.zahwazein.xyz': 'zenzkey_848b800b1f',
    'https://api.xteam.xyz': 'cristian9407',
    'https://api.lolhuman.xyz': 'IchanZX',
    'https://api.itsrose.life': 'Rk-Ashbornt',
    'https://skizo.tech' : 'pinott'
}

/*============== WATERMARK ==============*/
global.wm = '© 2025 Werewolf'
global.author = 'Raihan'

/*============== TEXT ==============*/
global.wait = '_「P R O S E S」...._'

/*========== HIASAN ===========*/
global.decor = {
	menut: '❏═┅═━–〈',
	menub: '┊•',
	menub2: '┊',
	menuf: '┗––––––––––✦',
	hiasan: '꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷',

	menut: '––––––『',
    menuh: '』––––––',
    menub: '┊☃︎ ',
    menuf: '┗━═┅═━––––––๑\n',
	menua: '',
	menus: '☃︎',

	htki: '––––––『',
	htka: '』––––––',
	haki: '┅━━━═┅═❏',
	haka: '❏═┅═━━━┅',
	lopr: 'Ⓟ',
	lolm: 'Ⓛ',
	htjava: '❃'
}

global.hwaifu = [
    'https://i.pinimg.com/originals/ed/34/f8/ed34f88af161e6278993e1598c29a621.jpg',
    'https://i.pinimg.com/originals/85/4d/bb/854dbbd30304cd69f305352f0183fad0.jpg',
    'https://i.pinimg.com/originals/32/2c/a4/322ca456fa2cdec4b717895a65adfa8d.jpg',
    'https://i.pinimg.com/originals/f2/dd/cc/f2ddccd5a1b89d2302cf75c6520c58dd.png',
    'https://i.pinimg.com/originals/aa/6b/df/aa6bdf98cbc9e1fc741c36682fa3e838.jpg'
]
/*============== EMOJI ==============*/
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            level: '📊',
            limit: '🎫',
            health: '❤️',
            exp: '✨',
            atm: '💳',
            money: '💰',
            bank: '🏦',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🛍️',
            mythic: '🎁',
            legendary: '🗃️',
            superior: '💼',
            pet: '🔖',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐴',
            cat: '🐱',
            dog: '🐶',
            fox: '🦊',
            robo: '🤖',
            petfood: '🍖',
            iron: '⛓️',
            gold: '🪙',
            emerald: '❇️',
            upgrader: '🧰',
            bibitanggur: '🌱',
            bibitjeruk: '🌿',
            bibitapel: '☘️',
            bibitmangga: '🍀',
            bibitpisang: '🌴',
            anggur: '🍇',
            jeruk: '🍊',
            apel: '🍎',
            mangga: '🥭',
            pisang: '🍌',
            botol: '🍾',
            kardus: '📦',
            kaleng: '🏮',
            plastik: '📜',
            gelas: '🧋',
            chip: '♋',
            umpan: '🪱',
            skata: '🧩'
        }
        let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
        if (!results.length) return ''
        else return emot[results[0][0]]
    }
}

//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
