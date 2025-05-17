# **Werewolf - Game**

**Werewolf** adalah permainan sosial berbasis teks yang dimainkan melalui WhatsApp dengan bantuan bot sebagai moderator. Permainan ini penuh intrik, strategi, dan deduksi, di mana para pemain bekerja sama atau saling menipu untuk mencapai tujuan masing-masing. Bot WhatsApp akan mengatur jalannya permainan, termasuk pemberian peran, pengelolaan ronde, dan pengumuman hasil.

---

## **Fitur Utama**
1. **Berbasis WhatsApp Bot**: Permainan dikelola sepenuhnya oleh bot WhatsApp, sehingga pemain dapat fokus menikmati permainan tanpa harus mengatur manual.
2. **Peran yang Dinamis**: Setiap pemain mendapatkan peran yang unik, dengan kemampuan dan tujuan berbeda.
3. **Multiplayer**: Mendukung 4 hingga 15 pemain dalam satu sesi permainan.
4. **Fitur Cheat untuk Owner**: Fitur khusus bagi owner bot untuk melihat informasi detail tentang grup yang sedang bermain.
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
  - **Ramuan Obat 🧫**: Melindungi satu pemain dari serangan Werewolf.  
  - **Ramuan Racun 🧪**: Membunuh satu pemain.  

- **HUNTER 🏹**  
  Pemburu yang dapat menembak salah satu pemain jika ia divote mati (kecuali jika diracuni Penyihir atau diserang Werewolf).

---

## **List Perintah**

Berikut adalah daftar perintah yang dapat digunakan selama permainan:

- **ww role**: Menampilkan penjelasan tentang peran.  
- **ww create**: Membuat sesi permainan baru.  
- **ww join**: Bergabung ke dalam sesi permainan.  
- **ww start**: Memulai permainan.  
- **ww left**: Keluar dari sesi permainan.  
- **ww delete**: Menghapus sesi permainan.  
- **ww player**: Melihat daftar pemain dalam sesi.  
- **ww timer**: Mengaktifkan timer (tidak disarankan, karena dapat menyebabkan bot crash).  
- **wewecheat**: Melihat informasi grup yang sedang bermain (hanya untuk owner bot).

---

## **Fitur Cheat (wewecheat)**

- **Akses Khusus Owner**: Fitur ini hanya dapat digunakan oleh owner bot melalui chat pribadi.  
- **Informasi Detail**:
  - Nama grup yang sedang bermain.
  - ID grup.
  - Jumlah pemain (hidup dan mati).
  - Role masing-masing pemain.

---

## **Cara Install**

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Raihan0611/Werewolf.git
   ```
2. Masuk ke folder repositori:
   ```bash
   cd Werewolf
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan bot:
   ```bash
   npm start
   ```
5. Scan kode QR yang muncul di terminal menggunakan aplikasi WhatsApp dengan nomor yang akan dijadikan bot Werewolf.
---

**Selamat bermain dan nikmati keseruannya! 🎮**
