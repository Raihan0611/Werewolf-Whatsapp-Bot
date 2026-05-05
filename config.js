import fs from 'fs';
import { getOwners } from './lib/system/owner.js';
const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));
global.version = `v${pkg.version}`;

// Global Configuration
const ownerNumbers = '6285183030930'; // Ganti dengan nomor WhatsApp Anda
const botNumbers = '6285117810930'; // penting!! wajib ganti jadi nomor bot mu untuk Pairing number
const lidNumber = '251543483859030@lid'; // Ganti dengan LID Anda, kirim command .getlid ke bot untuk mendapatkan LID Anda
const NamaOwner = 'Icyriel'; // Ganti dengan nama Anda
const NamaBot = 'IcyBotFun'; // Ganti dengan nama bot Anda
const pairingMetode = 'code'; // metode pairing: 'qr' atau 'code'
const botTimer = '-' // Ganti dengan nomor timer bot Anda jika tidak ada isi dengan strip '-'
const delay = 500; // delay untuk menghindari spam, dalam milidetik

// Owner Information
try {
  const savedOwners = Array.isArray(getOwners()) ? getOwners() : [];
  const ownerEntries = [];
  
  if (ownerNumbers) {
    ownerEntries.push([ownerNumbers, NamaOwner, true]);
    ownerEntries.push([`${ownerNumbers}@lid`, NamaOwner, true]);
  }
  
  if (lidNumber) ownerEntries.push([lidNumber, 'LID', true]);
  
  for (const jid of savedOwners) {
    if (!ownerEntries.find(e => e[0] === jid)) ownerEntries.push([jid, 'LID', true]);
  }
  
  const seen = new Set();
  global.owner = ownerEntries.filter(e => {
    if (seen.has(e[0])) return false;
    seen.add(e[0]);
    return true;
  });
} catch (e) {
  // fallback to static defaults if anything goes wrong
  global.owner = [
    [ownerNumbers, NamaOwner, true],
    [lidNumber, 'LID', true],
  ];
}

// Bot Information
global.info = {
  nomerbot: botNumbers,
  pairingNumber: botNumbers,
  nomerown: ownerNumbers,
  nameown: NamaOwner,
  namebot: NamaBot,
};

// expose pairing method globally so other modules can read it
global.pairingMetode = pairingMetode;

// expose bot timer globally so other modules can read it
global.botTimer = botTimer;

// expose delay globally so other modules can read it
global.delay = delay;