import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));
global.version = `v${pkg.version}`;

// Global Configuration
const ownerNumbers = '6289662732827'; // Ganti dengan nomor WhatsApp Anda
const botNumbers = '6285173061143'; // penting!! wajib ganti jadi nomor bot mu untuk Pairing number
const lidNumber = '251543483859030@lid'; // Ganti dengan LID Anda, kirim command .getlid ke bot untuk mendapatkan LID Anda
const NamaOwner = 'Raihan'; // Ganti dengan nama Anda
const NamaBot = '© 2025 Werewolf Bot'; // Ganti dengan nama bot Anda
const pairingMetode = 'qr'; // metode pairing: 'qr' atau 'code'

// Owner Information
global.owner = [
  [ownerNumbers, NamaOwner, true],
  [lidNumber, "LID", true],
];

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