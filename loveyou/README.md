# LoveYou

Web kejutan romantis untuk pacar. Situs statis biasa (HTML, CSS, JS), tanpa build dan tanpa dependensi, jadi bisa langsung di-deploy ke Vercel.

## Isi folder

| File | Fungsi |
| --- | --- |
| `config.js` | **Satu-satunya file yang perlu kamu ubah.** Pilih gaya, isi nama dan tanggal jadian, lalu (opsional) tulis suratmu sendiri. |
| `presets.js` | Tiga gaya siap pakai: manis, lucu, tulus. Tidak perlu diubah. |
| `index.html` | Struktur halaman. |
| `style.css` | Tampilan (terang dan gelap, HP dan laptop). |
| `app.js` | Logika: amplop, hitung hari, kupon, tombol "Tidak" yang kabur. |
| `foto/` | Taruh foto kalian di sini (opsional, buat foldernya sendiri). |

## Personalisasi

Buka `config.js`, ganti isinya, simpan.

**Gaya (preset)**: isi `preset` dengan salah satu dari tiga ini. Gaya menentukan warna, judul bagian, dan isi teks awal.

| Preset | Rasanya |
| --- | --- |
| `manis` | Romantis hangat, merah muda. |
| `lucu` | Santai dan jahil, banyak candaan, jingga koral. |
| `tulus` | Tenang dan dewasa, sedikit puitis, ungu lembut. |

Cukup pilih gaya, isi `name` dan `startDate`, dan situsmu sudah jadi. Bagian yang ingin kamu tulis sendiri (surat, alasan, kenangan, kupon, pertanyaan akhir) tinggal diaktifkan dengan menghapus `//` di `config.js`. Yang kamu tulis menimpa isi preset, sisanya tetap dari preset.

- `name`: nama panggilan dia.
- `from`: namamu (muncul di bagian bawah).
- `startDate`: tanggal jadian, format `2025-02-14`.
- `letter`: isi surat. `{nama}` otomatis jadi namanya.
- `reasons`, `memories`, `coupons`: daftar yang bisa kamu tambah atau kurangi.
- `photos`: foto polaroid. Contoh:
  ```js
  photos: [
    { src: "foto/1.jpg", caption: "Kencan pertama" },
    { src: "foto/2.jpg", caption: "Liburan kita" }
  ],
  ```
  Pakai foto yang sudah dikecilkan (di bawah 500 KB per foto) supaya cepat terbuka di HP.

### Editor tanpa mengubah kode

Buka alamat webmu dengan tambahan `?edit=1`, misalnya `https://namamu.vercel.app/?edit=1`. Tombol **Ubah** muncul. Pilih gaya (isi teks ikut berganti, lalu bebas kamu edit), isi formulirnya, lalu tekan **Salin link**. Link yang dihasilkan sudah berisi nama, surat, kenangan, dan lainnya, jadi bisa langsung dikirim ke dia tanpa deploy ulang. Foto tidak ikut karena harus lewat `config.js`.

Jangan kirim link yang mengandung `?edit=1` ke dia, nanti tombol Ubah kelihatan.

## Animasi

Semua animasi memakai CSS dan JavaScript biasa, tanpa library, dan hanya menganimasikan transform serta opacity supaya tetap mulus di HP. Kalau pengguna mengaktifkan "kurangi gerakan" di perangkatnya, semua animasi mati otomatis dan isi halaman langsung tampil.

Saat amplop dibuka, bunga meledak dalam dua gelombang. Warna bunganya mengikuti gaya yang dipilih. Jumlahnya diatur di `app.js` pada dua baris `bloom(ex, ey, 34)` dan `bloom(ex, ey, 22)`.

Kalau ingin menyesuaikan, buka `style.css` dan cari bagian **ANIMASI HALUS** di paling bawah. Kecepatan dan karakter gerak diatur lewat tiga kurva di awal bagian itu (`--ease`, `--ease-spring`, `--ease-inout`).

## Deploy ke Vercel (jadi `namamu.vercel.app`)

**Lewat GitHub (disarankan)**
1. Buat repository baru di GitHub, upload semua file di folder ini.
2. Buka vercel.com/new, pilih repository tadi. Di **Framework Preset** pilih **Other**. Build Command, Output Directory, dan Install Command dikosongkan. Lalu tekan **Deploy**.
3. Nama project menentukan alamatnya. Kalau nama sudah dipakai orang lain, Vercel menambahkan akhiran. Kamu bisa ganti di Project Settings, bagian Domains.

**Lewat terminal**
```
npm i -g vercel
cd loveyou
vercel --prod
```

Setiap kali mengubah `config.js`, push ke GitHub (atau jalankan `vercel --prod` lagi) dan situsnya terbarui otomatis.

## Coba di komputer sendiri

Klik dua kali `index.html` sudah cukup. Untuk meniru kondisi asli:
```
npx serve .
```
