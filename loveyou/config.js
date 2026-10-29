// ============================================================
//  LOVEYOU - FILE PERSONALISASI
//  Ubah isi di bawah ini, simpan, lalu deploy ulang ke Vercel.
//  Tanda kutip " " jangan dihapus.
//
//  CARA TERCEPAT: pilih "preset" dan isi name serta startDate. Selesai.
//  Mau lebih personal? Hapus tanda // di depan bagian yang ingin kamu tulis sendiri.
//  Bagian yang kamu tulis menimpa isi preset, sisanya tetap dari preset.
// ============================================================
window.LOVEYOU_CONFIG = {

  // Pilih gaya: "manis" (romantis hangat), "lucu" (santai dan jahil), atau "tulus" (tenang dan dewasa).
  // Gaya ikut menentukan warna, judul bagian, dan isi teks awalnya.
  preset: "manis",

  // Nama panggilan dia. Muncul di judul, surat, dan jawaban akhir.
  name: "Sayang",

  // Namamu. Muncul di bagian paling bawah halaman. Kosongkan "" kalau tidak mau.
  from: "",

  // Tanggal jadian, format TAHUN-BULAN-TANGGAL (contoh: 2025-02-14).
  // Kalau tanggalnya di masa depan, halaman menampilkan hitung mundur.
  startDate: "2025-02-14",

  // ---------- Tulis sendiri (opsional). Hapus // untuk mengaktifkan. ----------

  // Isi surat. {nama} otomatis jadi namanya. \n pindah baris, \n\n satu baris kosong.
  // letter: "Halo {nama},\n\nIni suratku untukmu...\n\nPeluk jauh,\nAku",

  // Alasan kenapa kamu sayang dia.
  // reasons: [
  //   "Alasan pertama",
  //   "Alasan kedua"
  // ],

  // Kenangan kalian. when = waktu singkat, title = judul, text = ceritanya.
  // memories: [
  //   { when: "Maret 2024", title: "Kencan pertama", text: "Kita makan bakso sambil hujan-hujanan." }
  // ],

  // Kupon yang bisa dia "pakai".
  // coupons: [
  //   { title: "Satu kali peluk lama", desc: "Berlaku kapan saja." }
  // ],

  // Pertanyaan di akhir (tombol "Tidak" akan kabur) dan pesan setelah dia menekan "Mau".
  // question: "Mau sama aku terus?",
  // finalMessage: "Terima kasih sudah bilang mau.",

  // Foto kalian (opsional). Taruh file di folder "foto", lalu tulis namanya di sini.
  // Kalau tidak diaktifkan, bagian foto tidak muncul.
  // photos: [
  //   { src: "foto/1.jpg", caption: "Kencan pertama" },
  //   { src: "foto/2.jpg", caption: "Liburan kita" }
  // ],

  // Biarkan false supaya tombol "Ubah" tidak kelihatan oleh dia.
  // Untuk membuka editor sendiri, tambahkan ?edit=1 di ujung alamat web.
  showEditor: false
};
