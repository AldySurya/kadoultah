WEBSITE ULANG TAHUN COUPLE - PANDUAN EDIT UNTUK DIJUAL
=======================================================
Konsep: untuk orang pacaran, romance theme

CARA EDIT DI VS CODE (3 LANGKAH UNTUK PEMBELI):
------------------------------------------------
1. BUKA FOLDER DI VS CODE
   File > Open Folder > pilih folder "ultah web 2"

2. EDIT FILE config.js SAJA (paling penting)
   Buka config.js, kamu akan lihat:

   recipient: "Sayang",  -> ganti jadi nama pacar, contoh: "Alya"
   
   photos: [ ... ]       -> caption tiap foto, contoh: '"kangen kamu"'
   
   note: {
     title: "Untuk kamu..."        -> judul surat
     message: ` ... isi surat ... ` -> pesan panjang, bisa pakai <br> untuk baris baru
   }
   
   music: "music/happy-birthday.mp3" -> ganti nama file musik (lihat music/INFO.txt)

   Foto asli taruh di folder images/photo1.jpg ... photo5.jpg (lihat images/INFO.txt)
   Musik taruh di folder music/lagu-kamu.mp3 (lihat music/INFO.txt)

3. SAVE & LIHAT HASIL
   Ctrl+S untuk save, lalu double klik index.html untuk buka di browser.
   Atau klik kanan index.html > Open with Live Server (jika pakai VS Code extension).

FILE YANG TIDAK PERLU DIEDIT:
- index.html (struktur)
- style.css (desain romance)
- script.js (logic)

CARA MASUKIN MUSIK KE HTML (DETAIL):
-------------------------------------
Opsi A (REKOMENDASI - via config.js):
  1. Copy file .mp3 ke folder music/
  2. Buka config.js, ubah: music: "music/nama-file-kamu.mp3"
  3. Save

Opsi B (manual via HTML):
  1. Buka index.html
  2. Cari baris: <source src="music/happy-birthday.mp3" type="audio/mpeg">
  3. Ganti src jadi: <source src="music/lagu-kamu.mp3" type="audio/mpeg">
  4. Save

Musik akan play otomatis setelah user klik tombol pertama (aturan browser).
Tombol ♫ di pojok kanan atas untuk pause/play manual.

ALUR WEBSITE:
--------------
Screen 1: "Hay [NAMA], selamat ulang tahun semoga sehat selalu" + tombol
   ↓ klik "Tekan di sini untuk melihat hadiah"
Screen 2: Kado 3D warna pink dengan pita putih (klik untuk buka, ada animasi + glow)
   ↓ klik kado
Screen 3: 5 foto polaroid miring + 1 note kertas surat (seperti kertas tulis tangan)

WARNA ROMANCE:
--------------
Background: #fdf2f0 (cream pink soft)
Primary: #e85d75 (rose)
Blush: #f8c4b4 (peach)
Untuk ganti warna, edit :root di paling atas style.css

UNTUK DIJUAL KE ORANG:
----------------------
- Duplikat folder ini per pelanggan (copy paste folder)
- Edit config.js + ganti 5 foto + 1 musik sesuai request
- Kirim/link hosting (bisa upload ke Netlify - drag & drop folder, gratis)

HOSTING GRATIS:
---------------
- Netlify: app.netlify.com/drop -> drag folder ini -> jadi link
- Vercel: vercel.com -> New Project -> upload
- GitHub Pages: push ke GitHub -> Settings -> Pages

BUTUH BANTUAN? Chat penjual template ini.
