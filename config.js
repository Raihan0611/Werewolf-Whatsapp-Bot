import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));
global.version = `v${pkg.version}`;


// Global Configuration
const ownerNumbers = '62xxxxxxxxxxx'; // Ganti dengan nomor WhatsApp Anda
const botNumbers = '62xxxxxxxxxxx'; // penting!! wajib ganti jadi nomor bot mu untuk Pairing number
const NamaOwner = 'Raihan'; // Ganti dengan nama Anda
const NamaBot = '© 2025 Werewolf Bot'; // Ganti dengan nama bot Anda

// URLs
global.url = {
  profil: 'https://files.catbox.moe/ijeati.jpg',
  did: 'https://telegra.ph/file/fdc1a8b08fe63520f4339.jpg',
  rules: 'https://telegra.ph/file/afcfa712bd09f4fcf027a.jpg',
  thumbnail: 'https://files.catbox.moe/ijeati.jpg',
  thumb: 'https://files.catbox.moe/ijeati.jpg',
  logo: 'https://telegra.ph/file/07428fea2fd4dccaab65f.jpg',
  unReg: 'https://telegra.ph/file/ef02d1fdd59082d05f08d.jpg',
  registrasi: 'https://itzpire.com/file/6ead5b50254b.jpg',
  confess: 'https://telegra.ph/file/03cabea082a122abfa5be.jpg',
  akses: 'https://ik.imagekit.io/Raihan3699/Bot%20Image/denied.png?updatedAt=1750815939359',
  wel: 'https://telegra.ph/file/9dbc9c39084df8691ebdd.mp4', // Welcome GIF
  bye: 'https://telegra.ph/file/1c05b8c019fa525567d01.mp4', // Goodbye GIF
  sound: 'https://media.vocaroo.com/mp3/1awgSZYHXP3B', // Audio menu
  sig: '',
  sgh: '',
  sgc: 'https://whatsapp.com/channel/0029VaMxHNd4SpkBSTSsGF2r',
};

// Owner Information
global.owner = [
  [ownerNumbers, NamaOwner, true],
];

// Bot Information
global.info = {
  nomerbot: botNumbers,
  pairingNumber: botNumbers,
  nomerown: ownerNumbers,
  nameown: NamaOwner,
  namebot: NamaBot,
};

// API Configuration
global.APIKeys = {
  'https://api.botcahx.eu.org': '_',
  'https://api.itsrose.rest': '_',
};

// Watch for File Changes
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});