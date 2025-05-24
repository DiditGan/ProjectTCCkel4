# Dokumentasi Aplikasi Jual Beli Barang Bekas

## Fitur
1. **Autentikasi & Registrasi**  
   - Pengguna dapat membuat akun, login, dan logout.
2. **Manajemen Produk**  
   - Menambahkan, mengedit, dan menghapus barang bekas.
3. **Kategori & Pencarian**  
   - Mengelompokkan barang per kategori dan fitur pencarian.
4. **Transaksi & Pembayaran**  
   - Proses checkout, konfirmasi pembayaran, dan pelacakan pesanan.

## Database (Tabel Utama)
1. **users**  
   - Kolom: `id`, `nama`, `email`, `password`, `alamat`, `no_telp`.
2. **products**  
   - Kolom: `id`, `user_id`, `nama_barang`, `kategori`, `deskripsi`, `harga`, `status`, `waktu_upload`, `kondisi`, `views`, `interested`, `tanggal_posting`.
3. **transactions**  
   - Kolom: `id`, `user_id`, `total_harga`, `status`, `tanggal_transaksi`.
4. **transaction_details**  
   - Kolom: `id`, `transaction_id`, `product_id`, `jumlah`, `harga_satuan`.

## Alur Fitur Utama
1. **Autentikasi**  
   - Pengguna mendaftar dengan email dan password.  
   - Pengguna login untuk mengakses fitur lanjut.
2. **Menambahkan Produk**  
   - Penjual mengisi informasi barang (nama, harga, kategori, dll).
   - Sistem menyimpan data ke tabel `products`.
3. **Melihat & Pencarian Produk**  
   - Semua pengguna dapat melihat daftar barang bekas.  
   - Fitur pencarian berdasarkan nama, kategori, dan harga.
4. **Pembelian Barang**  
   - Pembeli melihat produk dan langsung memulai transaksi.  
   - Sistem membuat record di `transactions` dan `transaction_details`.

## Tampilan & Halaman
1. **Halaman Login & Registrasi**  
   - Form untuk membuat akun atau masuk.
2. **Halaman Beranda (Daftar Produk)**  
   - Menampilkan barang bekas terbaru atau populer.
3. **Halaman Detail Produk**  
   - Informasi lengkap barang, foto, deskripsi, dan tombol "Beli Sekarang".
4. **Halaman Pembayaran & Konfirmasi**  
   - Detail pesanan, metode pembayaran, dan konfirmasi transaksi.
5. **Halaman Profil Pengguna**  
   - Menampilkan info pengguna, riwayat pembelian/penjualan.
