# **Werewolf - Game**

**Werewolf** adalah permainan sosial berbasis teks yang dimainkan melalui WhatsApp dengan bantuan bot sebagai moderator. Permainan ini penuh intrik, strategi, dan deduksi, di mana para pemain bekerja sama atau saling menipu untuk mencapai tujuan masing-masing. Bot WhatsApp akan mengatur jalannya permainan, termasuk pemberian peran, pengelolaan ronde, dan pengumuman hasil.

---

## **Fitur Utama**

1. **Berbasis WhatsApp Bot**: Permainan dikelola sepenuhnya oleh bot WhatsApp, sehingga pemain dapat fokus menikmati permainan tanpa harus mengatur manual.
2. **Peran yang Dinamis**: Setiap pemain mendapatkan peran yang unik, dengan kemampuan dan tujuan berbeda.
3. **Multiplayer**: Mendukung 4 hingga 15 pemain dalam satu sesi permainan.
4. **Fitur Debug untuk Owner/Developer**: Fitur khusus untuk melihat informasi detail tentang grup yang sedang bermain dan untuk melakukan pengetesan/debugging.
5. **Interaksi Berbasis Perintah**: Pemain hanya perlu menggunakan perintah sederhana atau menekan tombol yang tersedia untuk berinteraksi dengan bot.

---

## **Peraturan Permainan**

1. Setiap pemain akan mendapatkan peran secara acak di awal permainan.
2. Pemain harus menggunakan kemampuan perannya masing-masing untuk mencapai tujuan tim mereka (baik atau jahat).
3. Voting dilakukan pada siang hari untuk menentukan siapa yang dieliminasi.
4. Permainan berakhir ketika salah satu tim (baik atau jahat) memenangkan permainan.

---

## **Peran dalam Permainan**

- **WARGA 👩🏻‍🤝‍👨🏻**  
  Warga biasa yang tidak mengetahui siapa teman atau lawan. Tugasnya adalah mencari tahu siapa Werewolf yang asli dan ikut voting.

- **WEREWOLF 🐺**  
  Serigala lapar yang memakan warga setiap malam. Werewolf mengetahui komplotannya dan dapat berkomunikasi untuk menyusun strategi.

- **ALPHA WEREWOLF 🐺👑**  
  Sama seperti Werewolf biasa, tetapi memiliki kemampuan khusus untuk mengubah salah satu warga baik menjadi Werewolf setelah mati.

- **GUARDIAN 🛡**  
  Pelindung yang dapat melindungi satu pemain dari serangan Werewolf setiap malam.

- **SEER 🔮**  
  Penerawang yang dapat melihat identitas asli satu pemain setiap malam.

- **SORCERER 🧙🏼‍♂**  
  Penyihir jahat yang membantu Werewolf dengan kemampuan menerawang Seer atau Werewolf.

- **TANNER 🪓**  
  Orang depresi yang ingin mati. Tanner menang jika berhasil divote mati, tetapi tidak menang jika dibunuh oleh Werewolf, diracuni Penyihir, dan ditembak Hunter.

- **WITCH 🧙🏻‍♀**  
  Penyihir baik yang memiliki dua ramuan:
  - **Ramuan Obat 🧫**: Melindungi semua warga desa dari serangan Werewolf.
  - **Ramuan Racun 🧪**: Membunuh satu pemain.

- **HUNTER 🏹**  
  Pemburu yang dapat menembak salah satu pemain jika ia divote mati (kecuali jika diracuni Penyihir atau diserang Werewolf).

- **NECROMANCER 🔮🪄**  
  Dapat menghidupkan kembali satu pemain yang sudah mati (baik maupun jahat), hanya bisa digunakan sekali.

- **CURSED 🧟‍♂**  
  Pemain yang terkutuk yang awalnya adalah warga biasa, tetapi jika dibunuh werewolf, dia akan berubah menjadi Werewolf.

- **CORRUPT 🧑🏻‍💻**
  Seorang Hacker yang bisa meretas player lain agar mereka tidak bisa menggunkan skilnya dan tidak bisa vote, tapi player yang di hack bisa bebas jika corrupt mati atau player memecahkan kode, selain itu Corrupt tidak bisa di kill oleh Werewolf, cara Corrupt menang adalah dengan mennjadi Last Man Standing, jika Corrupt mati maka semua player yang di hack akan bebas dan Corrupt kalah.

---

## **List Perintah**

Berikut adalah daftar perintah yang dapat digunakan selama permainan:

- **ww tutor**: Melihat tutorial cara bermain.
- **ww role**: Menampilkan penjelasan tentang peran.
- **ww list**: Melihat daftar jumlah role.
- **ww create**: Membuat sesi permainan baru.
- **ww join**: Bergabung ke dalam sesi permainan.
- **ww start**: Memulai permainan.
- **ww leave**: Keluar dari sesi permainan.
- **ww delete**: Menghapus sesi permainan.
- **ww wait**: Masuk daftar tunggu.
- **ww player**: Melihat daftar pemain dalam sesi.
- **ww vote**: Melakukan voting untuk mengeliminasi pemain.
- **ww timer**: Mengaktifkan timer (tidak disarankan, karena dapat menyebabkan bot crash),(disarankan menggunakan bot timer eksternal).
- **ww board**: Melihat papan skor dan statistik permainan.
- **ww set**: Mengatur konfigurasi permainan (hanya untuk owner/developer).
- **ww report**: Melaporkan player yang curang.

## **Fitur Bot Timer Eksternal**

Bot Timer adalah modul pendamping yang mengelola pesan timer untuk permainan Werewolf.

- **Integrasi**: Dirancang untuk bekerja bersama bot Werewolf utama, menggunakan panel yang terpisah alias kita butuh panel lain untuk menjalankan bot timer.
- **Fungsi Utama**: Bot Timer akan mengirim pesan timer otomatis di grup permainan Werewolf, untuk meringankan beban bot Werewolf dan mencegah crash akibat overload pesan timer.
- **Konfigurasi**: Pastikan untuk mengatur nomor bot timer di file `config.js` bot Werewolf agar integrasi berjalan lancar,bot timer dan bot werewolf harus ada di grup yang sama, serta pastikan bot timer sudah di pair ke WhatsApp.
- **Catatan**: Bot Timer hanya mengelola pesan timer, sedangkan logika permainan tetap diatur oleh bot Werewolf.
- **Link Download Bot Timer**: [Bot Timer WhatsApp](https://github.com/Raihan0611/Bot-Timer-For-Werewolf-Whatsapp)

---

## **Fitur Debug (.debug)**

- **Akses Khusus Owner/Developer**: Fitur ini hanya dapat digunakan oleh owner bot atau developer.
- **Fungsi Utama**:
  - .debug menu on/off: Mengaktifkan atau menonaktifkan menu.
  - Melihat semua role & status player di room.
  - Skip fase room saat ini.
  - Tampilkan fase saat ini beserta sisa waktu.
  - Set/atur role player
  - DLL
  - Hanya untuk debugging, bukan untuk pemain biasa.

---

## **Fitur Lain**

- **.menu**  
  Melihat daftar perintah yang tersedia.

- **.addowner .delowner .listowner**  
  Menambahkan, menghapus owner bot, dan melihat list owner.

- **.getlid**  
  Mendapatkan Lid user.

- **.ban .unban .listban**  
  Melakukan ban atau unban user, dan melihat list user yang dibanned.

- **.daftar .unreg**  
  Mendaftar atau menghapus pendaftaran user di database bot.

- **.device**
  Melihat informasi devicemu dan ganti device.

- **.bot on/off**  
  Mengaktifkan atau menonaktifkan bot untuk sementara di grup.

---

## **Tutorial Cara Bermain Werewolf**

_(Versi Bot WhatsApp)_

**A. Pembuatan Room**  
Satu player mengetik `.ww create` untuk membuat Room dan para Player yang ingin main mengetik `.ww join` (Atau klik tombol join) hingga jumlah pemain cukup. Lalu ketik `.ww start` untuk memulai permainan maka Bot akan berjalan secara Otomatis.

**B. Pembagian Peran**  
Setiap pemain akan mendapatkan peran secara acak, seperti Werewolf, Seer, Guardian, dll.  
Sebelum permainan dimulai, bot akan membagikan peran secara otomatis lewat chat pribadi. Peran bersifat rahasia dan tidak boleh dibocorkan ke pemain lain.

**C. Fase Permainan (Dipandu Bot)**  
Permainan terbagi menjadi 4 fase yang berjalan berulang:

1. **Malam (Aksi Peran)**
   - Pemain yang punya kemampuan khusus bisa menggunakan perannya lewat chat pribadi ke bot.
   - Gunakan command: `.wwpc` Bot akan membalas dan memberi pilihan skill yang bisa digunakan, sesuai peranmu. contoh penggunaan `.wwpc kill 1` (Atau bisa juga dengan klik tombol yang tersedia).
   - Contoh aksi malam: Werewolf memilih korban, Seer menerawang, Guardian melindungi, dll.

2. **Pagi (Info & Pengumuman)**
   - Bot akan mengumumkan hasil malam sebelumnya, seperti siapa yang mati, dan informasi lainnya.

3. **Siang (Diskusi)**
   - Pemain bebas berdiskusi di grup untuk mencari tahu siapa yang dicurigai sebagai Werewolf.
   - Tidak ada perintah khusus di fase ini, cukup ngobrol dan analisis bareng.

4. **Sore (Voting)**
   - Pemain melakukan voting untuk mengeliminasi satu pemain yang paling dicurigai.
   - Gunakan command: `.ww vote (nomor)` contoh `.ww vote 1` (Atau bisa juga dengan klik tombol yang tersedia).
   - Pemain yang mendapatkan vote terbanyak akan dieliminasi dan keluar dari permainan.

**D. Cara Menang**

- Tim Warga menang jika semua Werewolf sudah dieliminasi.
- Tim Werewolf menang jika jumlah Warga sisa 1.
- Tanner menang sendirian jika dia dieliminasi saat voting sore.

**Tips Bermain**

- Jangan terlalu cepat percaya atau menuduh tanpa bukti.
- Perhatikan ketikan & reaksi pemain lain.
- Kalau kamu dapat peran spesial, pakai dengan bijak dan jangan ketahuan!

**Catatan Tambahan**

- Semua interaksi dengan bot bersifat pribadi kecuali voting.
- Jangan spam command.
- Jaga rahasia peranmu agar strategi tetap berjalan.

---

## **Cara Install & Jalankan**

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/Raihan0611/Werewolf-Whatsapp-Bot.git
   ```
2. **Masuk ke folder repositori:**
   ```bash
   cd Werewolf-Whatsapp-Bot
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
   **4. Edit file `config.js`:**

- Buka file `config.js` di folder utama project.
- Isi data berikut sesuai dengan nomor WhatsApp bot dan owner milikmu:

  ```js
  // Global Configuration
  const ownerNumbers = "62xxxxxxxxxx"; // Ganti dengan nomor WhatsApp Anda
  const lidNumber = "25xxxxxxxxxxxxx@lid"; // kirim command .getid ke bot untuk mendapatkan nomor lid, penting!! wajib ganti jadi nomor lid mu untuk fitur owner
  const botNumbers = "62xxxxxxxxxxx"; // penting!! wajib ganti jadi nomor bot mu untuk Pairing number
  const NamaOwner = "Nama Anda"; // Ganti dengan nama Anda
  const NamaBot = "Nama Bot Anda"; // Ganti dengan nama bot Anda
  const Watermark = "© 2026 Ultimate Werewolf"; // Ganti dengan watermark bot Anda
  const pairingMetode = "qr"; // metode pairing: 'qr' atau 'code'
  const delay = 1000; // delay untuk menghindari spam, dalam milidetik

  // Jika tidak mengerti cara menggunakannya diamkan saja, agar bot berjalan dengan settingan default, jika ingin menggunakannya silahkan tanya owner atau lihat di Readme.
  const pakaiBotTimer = false; // Ganti dengan true jika ingin menggunakan timer, false jika tidak ingin menggunakan timer
  const LidbotTimer = "-"; // Ganti dengan nomor @Lid Bot Timer Anda jika tidak ada isi dengan strip '-'
  const pakaiBotPembantu = false; // Ganti dengan true jika ingin menggunakan bot pembantu, false jika tidak ingin menggunakan bot pembantu
  const LidbotPembantu = "-"; // Ganti dengan nomor bot pembantu Anda jika tidak ada isi dengan strip '-', // Fitur ini masih dalam tahap pengembangan.
  ```

  - **Nomor harus diawali 62** (bukan 08).
  - **PENTING!!!** Nomor bot harus di isi di file `config.js` karena system akan mengambil nomor bot dari situ untuk pairing dengan kode.

5. **Jalankan bot:**
   ```bash
   npm start
   ```
6. **Pairing Bot ke WhatsApp:**
   - Saat bot dijalankan, nomor bot dan owner akan otomatis diambil dari file config.
   - Ikuti instruksi di terminal untuk melakukan pairing (scan QR code atau masukkan kode pairing).
   - Setelah berhasil, bot akan online dan siap digunakan di WhatsApp.

## **Bonus Game — Skata (Sambung Kata)**

`Skata` adalah mini-game sambung kata yang tersedia sebagai bonus untuk dimainkan di grup.

- **Perintah dasar**: Ketik `.skata` untuk membuat room atau bergabung ke room yang dibuat.
- **Memulai permainan**: Pemain mengetik `.skata start` untuk memulai.
- **Aturan singkat**: Setiap jawaban harus berupa kata dasar (tanpa spasi atau imbuhan). Pemain bergiliran menjawab kata yang dimulai dari akhiran kata sebelumnya. Ketik `nyerah` untuk menyerah.
- **Hadiah**: Pemenang mendapatkan poin/XP sesuai konfigurasi bot (lihat implementasi untuk detail).

---

## **Selamat bermain dan nikmati keseruannya! 🎮**

---

# Fitur Bot Pembantu masih dalam tahap pengembangan~~
