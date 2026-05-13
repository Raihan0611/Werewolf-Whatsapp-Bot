# **Werewolf - Game**

**Werewolf** adalah permainan sosial berbasis teks yang dimainkan melalui WhatsApp dengan bantuan bot sebagai moderator. Permainan ini penuh intrik, strategi, dan deduksi, di mana para pemain bekerja sama atau saling menipu untuk mencapai tujuan masing-masing. Bot WhatsApp akan mengatur jalannya permainan, termasuk pemberian peran, pengelolaan ronde, dan pengumuman hasil.

---

## **Fitur Utama**

1. **Berbasis WhatsApp Bot**: Permainan dikelola sepenuhnya oleh bot WhatsApp, sehingga pemain dapat fokus menikmati permainan tanpa harus mengatur manual.
2. **Peran yang Dinamis**: Setiap pemain mendapatkan peran yang unik, dengan kemampuan dan tujuan berbeda.
3. **Multiplayer**: Mendukung 4 hingga 15 pemain dalam satu sesi permainan.
4. **Fitur Debug untuk Owner/Developer**: Fitur khusus untuk melihat informasi detail tentang grup yang sedang bermain.
5. **Interaksi Berbasis Perintah**: Pemain hanya perlu menggunakan perintah sederhana untuk berinteraksi dengan bot.

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

---

## **List Perintah**

Berikut adalah daftar perintah yang dapat digunakan selama permainan:

- **ww role**: Menampilkan penjelasan tentang peran.
- **ww create**: Membuat sesi permainan baru.
- **ww join**: Bergabung ke dalam sesi permainan.
- **ww start**: Memulai permainan.
- **ww leave**: Keluar dari sesi permainan.
- **ww delete**: Menghapus sesi permainan.
- **ww player**: Melihat daftar pemain dalam sesi.
- **ww timer**: Mengaktifkan timer (tidak disarankan, karena dapat menyebabkan bot crash),(disarankan menggunakan bot timer eksternal).
- **ww report**: Melaporkan bug atau saran fitur ke developer.
- **ww tutor**: Melihat tutorial cara bermain.

## **Fitur Bot Timer Eksternal**

Bot Timer adalah modul pendamping yang mengelola pesan timer untuk permainan Werewolf.

- **Integrasi**: Dirancang untuk bekerja bersama bot Werewolf utama, menggunakan panel yang terpisah alias kita butuh panel lain untuk menjalankan bot timer.
- **Fungsi Utama**: Bot Timer akan mengirim pesan timer otomatis di grup permainan Werewolf, untuk meringankan beban bot Werewolf dan mencegah crash akibat overload pesan timer.
- **Konfigurasi**: Pastikan untuk mengatur nomor bot timer di file `config.js` bot Werewolf agar integrasi berjalan lancar,bot timer dan bot werewolf harus ada di grup yang sama, serta pastikan bot timer sudah di pair ke WhatsApp.
- **Catatan**: Bot Timer hanya mengelola pesan timer, sedangkan logika permainan tetap diatur oleh bot Werewolf.
- **Link Download Bot Timer**: [Bot Timer WhatsApp](https://github.com/Raihan3699/Bot-Timer-For-Werewolf-Whatsapp)

---

## **Fitur Debug (.debug)**

- **Akses Khusus Owner/Developer**: Fitur ini hanya dapat digunakan oleh owner bot atau developer.
- **Fungsi Utama**:
  - Melihat semua role & status player di room.
  - Skip fase room saat ini.
  - Tampilkan fase saat ini beserta sisa waktu.
  - Set/atur role player
  - Hanya untuk debugging, bukan untuk pemain biasa.

---

## **Fitur Lain**

- **.addowner .delowner .listowner**  
  Menambahkan, menghapus owner bot, dan melihat list owner.

- **.getlid**  
  Mendapatkan Lid user.

---

## **Tutorial Cara Bermain Werewolf**

_(Versi Bot WhatsApp)_

**A. Pembuatan Room**  
Satu player mengetik `.ww create` untuk membuat Room dan para Player yang ingin main mengetik `.ww join` hingga jumlah pemain cukup. Lalu ketik `.ww start` untuk memulai permainan maka Bot akan berjalan secara Otomatis.

**B. Pembagian Peran**  
Setiap pemain akan mendapatkan peran secara acak, seperti Werewolf, Seer, Guardian, dll.  
Sebelum permainan dimulai, bot akan membagikan peran secara otomatis lewat chat pribadi. Peran bersifat rahasia dan tidak boleh dibocorkan ke pemain lain.

**C. Fase Permainan (Dipandu Bot)**  
Permainan terbagi menjadi 4 fase yang berjalan berulang:

1. **Pagi (Info & Pengumuman)**
   - Bot akan mengumumkan hasil malam sebelumnya, seperti siapa yang mati, dan informasi lainnya.

2. **Siang (Diskusi)**
   - Pemain bebas berdiskusi di grup untuk mencari tahu siapa yang dicurigai sebagai Werewolf.
   - Tidak ada perintah khusus di fase ini, cukup ngobrol dan analisis bareng.

3. **Sore (Voting)**
   - Pemain melakukan voting untuk mengeliminasi satu pemain yang paling dicurigai.
   - Gunakan command: `.ww vote (nomor)` contoh `.ww vote 1`

4. **Malam (Aksi Peran)**
   - Pemain yang punya kemampuan khusus bisa menggunakan perannya lewat chat pribadi ke bot.
   - Gunakan command: `.wwpc` Bot akan membalas dan memberi pilihan skill yang bisa digunakan, sesuai peranmu. contoh penggunaan `.wwpc kill 1`
   - Contoh aksi malam: Werewolf memilih korban, Seer menerawang, Guardian melindungi, dll.

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
  const ownerNumbers = "62xxxxxxxxxxx";
  const botNumbers = "62xxxxxxxxxxx";
  const lidNumber = "25xxxxxxx@lid"; // kirim command .getlid ke bot untuk mendapatkan LID Anda
  const NamaOwner = "Nama Kamu";
  const NamaBot = "Nama Bot Kamu";
  const botTimer = "62xxxxxxxxxxx"; // Ganti dengan nomor timer bot Anda jika tidak ada isi dengan strip '-'
  const pairingMetode = "qr"; // metode pairing: 'qr' atau 'code'
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
