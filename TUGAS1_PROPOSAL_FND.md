# PROPOSAL USULAN APLIKASI: FND PRODUCTION
**Event Lighting Management System**

*Dokumen Usulan Pengembangan Aplikasi – Tugas Minggu 1*  
*Mata Kuliah: Kerja Praktek (KP) Informatika – Universitas Dian Nusantara (UNDIRA)*

---

### **INFORMASI MAHASISWA**
* **Nama**: Edisyah Putra Waruwu  
* **NIM**: 411231179  
* **Program Studi**: Informatika  
* **Instansi**: Universitas Dian Nusantara (UNDIRA)  
* **Versi Dokumen**: v1.0 (Final Proposal)  
* **Tanggal**: 21 Mei 2026

---

## **01. USULAN APLIKASI**
### **Nama Aplikasi: FND Production (Event Lighting Management System)**
**FND Production** adalah platform sistem informasi manajemen operasional berbasis web fullstack yang dirancang khusus untuk mengelola seluruh ekosistem bisnis penyedia jasa *event lighting* profesional. 

Sistem ini diusulkan untuk mentransformasi tata kelola operasional perusahaan penyedia lighting yang selama ini masih bersifat manual atau semi-digital menjadi terintegrasi, otomatis, dan real-time. Aplikasi ini mencakup manajemen inventaris peralatan, alokasi kru teknisi lapangan, penjadwalan acara, pelacakan keuangan, serta portal pelayanan klien.

---

## **02. PENJELASAN APLIKASI**

### **A. Tujuan Pengembangan**
1. **Mengotomatiskan Penjadwalan & Booking:** Mempercepat proses pemesanan layanan dari klien hingga penjadwalan teknis di lapangan.
2. **Optimalisasi Manajemen Sumber Daya:** Mengelola alokasi peralatan lighting bernilai tinggi dan penugasan kru lapangan agar berjalan maksimal tanpa terjadi bentrokan.
3. **Meningkatkan Transparansi Keuangan:** Mempermudah pemantauan arus kas dari Down Payment (DP), pelunasan, sisa piutang, hingga laporan bulanan.
4. **Menyediakan Data Real-time:** Memberikan wawasan analitis instan bagi pemilik perusahaan untuk pengambilan keputusan bisnis yang tepat.

### **B. Pengguna Utama (Actors)**
1. **Admin (Manajemen / Owner):**
   * Mengelola basis data peralatan, tarif sewa, dan data kru.
   * Menyetujui atau menolak pesanan klien (*booking approval*).
   * Melakukan alokasi alat dan penugasan kru teknis ke suatu acara.
   * Memantau arus pembayaran dan laporan keuangan bulanan.
2. **Client (Penyelenggara Event / EO):**
   * Membuat pemesanan (*booking*) dengan mengisi formulir kebutuhan acara secara online.
   * Melacak status pemesanan (dari pengajuan hingga selesai).
   * Mengunggah bukti pembayaran DP dan pelunasan.
   * Mengunduh *Quotation* (Penawaran) dan *Invoice* (Tagihan) resmi.
3. **Crew (Teknisi / Operator Lapangan):**
   * Melihat daftar tugas harian (*today's assignment*) dan jadwal mingguan.
   * Melakukan pembaruan status ketersediaan (*availability toggle*).
   * Melihat detail spesifikasi teknis lighting yang harus dipasang di lokasi acara.

### **C. Masalah yang Diselesaikan**
1. **Double-Booking Peralatan:** Sering terjadi kesalahan alokasi unit lighting (seperti Moving Head Beam, Par LED, Strobe, dll.) di mana alat yang sama dialokasikan ke dua acara berbeda di hari yang sama. Sistem menyelesaikan ini dengan pencocokan stok dinamis berbasis tanggal acara.
2. **Bentrokan Penugasan Kru:** Koordinasi kru lapangan yang selama ini dilakukan manual via WhatsApp sering menyebabkan kru ditugaskan di dua lokasi berbeda. Sistem menyelesaikan ini dengan melacak jadwal kalender individu kru secara ketat.
3. **Ketidakteraturan Keuangan & Piutang:** Tagihan dan sisa piutang klien sering kali tidak terdata dengan rapi, sehingga menunda arus kas masuk. Sistem mengatasi ini dengan pelacakan status pembayaran (*lunas*, *belum lunas*, *kurang bayar*) yang terikat langsung pada status acara.
4. **Ketiadaan Riwayat Audit (Audit Trail):** Sulitnya melacak siapa yang melakukan perubahan status acara atau alokasi barang jika terjadi kesalahan lapangan. Sistem menyelesaikan ini dengan tabel riwayat status (*event status history*) otomatis.

---

## **03. ALUR APLIKASI (NARRATIVE FLOW)**

Alur operasional sistem FND Production dirancang secara komprehensif dari masukan awal hingga hasil keluaran yang dapat diaudit, terbagi menjadi tiga fase utama:

### **1. Tahap Input (Masukan)**
* **Input dari Sisi Klien (Client):** Klien melakukan registrasi, masuk ke portal, dan mengisi formulir pemesanan acara yang mencakup: Nama Event, Tanggal Pelaksanaan, Lokasi Acara, Jenis Paket/Kebutuhan Daya, dan Keterangan Tambahan.
* **Input dari Sisi Lapangan (Survey):** Setelah survei lokasi dilakukan, Admin memasukkan spesifikasi kebutuhan riil alat lighting (jumlah Moving Head, Par LED, kabel, controller) ke dalam sistem.
* **Input dari Sisi Penugasan:** Admin memilih kru lapangan yang bertugas (Project Leader, Operator, Helper) dari daftar kru yang tersedia pada tanggal tersebut.
* **Input Keuangan:** Klien mengunggah bukti transfer bank untuk pembayaran Down Payment (DP) atau pelunasan, sedangkan Admin memasukkan data validasi pembayaran setelah mencocokkan mutasi kas.

### **2. Tahap Proses (Pengolahan)**
* **Validasi Ketersediaan Aset (Stock Collision Guard):** Ketika Admin mengalokasikan alat, sistem secara otomatis menghitung:  
  $$\text{Sisa Stok} = \text{Total Alat} - \sum \text{Alat yang Sedang Digunakan pada Tanggal Terpilih}$$  
  Jika sisa stok kurang dari jumlah yang diajukan, sistem akan memblokir alokasi dan menampilkan peringatan stok tidak cukup.
* **Validasi Ketersediaan Kru (Calendar Conflict Checker):** Sistem memeriksa tabel `event_crew` untuk mendeteksi apakah kru yang dipilih sudah terikat pada acara lain dengan status aktif (`survey`, `deal`, atau `running`) pada tanggal yang sama. Jika ada bentrokan, nama kru tersebut disembunyikan atau dinonaktifkan dari daftar pilihan.
* **State Machine & Workflow Status:** Sistem mengelola transisi status acara secara ketat untuk menjamin konsistensi bisnis:  
  $$\text{Pending} \rightarrow \text{Survey} \rightarrow \text{Deal} \rightarrow \text{Running} \rightarrow \text{Selesai}$$  
  Klien dapat membatalkan acara (*Cancel*) kapan saja sebelum status mencapai `running`. Setiap perubahan status memicu pembuatan record baru pada tabel log histori untuk keperluan audit trail.

### **3. Tahap Output (Keluaran)**
* **Dashboard Real-time:** Menampilkan visualisasi analitis berupa bagan garis pendapatan bulanan, bagan lingkaran sebaran status acara, persentase ketersediaan kru hari ini, dan daftar peralatan terpopuler.
* **10 Dokumen Resmi & Laporan Fungsional:** Menghasilkan dokumen digital formal berformat PDF atau spreadsheet Excel yang dapat diunduh, dicetak, dan dikirimkan sebagai bukti transaksi sah serta bahan evaluasi bisnis.

---

## **04. 10 LUARAN SISTEM YANG DAPAT DICETAK ATAU DIEXPORT**

Sistem FND Production menghasilkan 10 dokumen, laporan, dan bukti transaksi terukur yang bertindak sebagai bukti fungsionalitas sistem nyata:

| No | Nama Dokumen / Luaran | Deskripsi & Konten Utama | Format File | Pemicu (Trigger) / Frekuensi |
| :--- | :--- | :--- | :---: | :--- |
| **1** | **Invoice Tagihan Event** *(Event Payment Invoice)* | Rincian biaya sewa peralatan, jasa kru, detail pelaksanaan acara, riwayat termin bayar, nominal sisa piutang, dan status kelayakan bayar. | **PDF** | Otomatis dibuat saat status acara berubah menjadi `deal` |
| **2** | **Kuitansi Tanda Terima** *(Official Payment Receipt)* | Bukti bayar sah yang berisi tanggal transfer, nominal uang yang diterima (DP/pelunasan), nama pembayar, nomor kuitansi unik, dan tanda tangan digital admin. | **PDF** | Diterbitkan setiap kali admin memverifikasi bukti pembayaran |
| **3** | **Surat Perintah Kerja (SPK) Kru** *(Crew Assignment Order)* | Dokumen penugasan teknis lapangan yang memuat nama-nama kru, peran (operator/helper), penanggung jawab acara (PIC), alamat lokasi acara, jadwal loading barang, dan tenggat waktu instalasi. | **PDF** | Dicetak oleh Admin/Project Leader pada H-2 sebelum acara dimulai |
| **4** | **Surat Jalan Pengiriman Alat** *(Equipment Delivery Note)* | Bukti fisik pengeluaran barang gudang yang mencantumkan nama, tipe, dan kuantitas unit lighting yang dikirim ke lokasi acara, dilengkapi kolom tanda tangan pengirim, pembawa, dan penerima lokasi. | **PDF** | Dicetak oleh kepala gudang pada H-1 acara saat barang masuk ke armada |
| **5** | **Laporan Ketersediaan Stok** *(Inventory Stock Report)* | Laporan inventarisasi gudang yang merinci total aset alat lighting, kuantitas terpakai hari ini, sisa stok di rak, alat yang sedang diservis, serta nilai penyusutan aset. | **PDF / Excel** | Real-time diakses admin atau diexport berkala setiap akhir bulan |
| **6** | **Laporan Keuangan Bulanan** *(Monthly Revenue & Financial Report)* | Rangkuman performa keuangan bisnis mencakup total pendapatan kotor, piutang macet klien, sisa saldo kas berjalan, biaya operasional kru, dan margin keuntungan bersih. | **PDF / Excel** | Diexport otomatis oleh sistem setiap akhir bulan untuk rapat owner |
| **7** | **Laporan Kinerja & Kehadiran Kru** *(Crew Performance & Work Report)* | Rekapitulasi jumlah jam terbang/event yang diselesaikan masing-masing kru, tingkat ketersediaan ketersediaan harian, rating kepuasan klien terhadap kru, dan perhitungan bonus. | **PDF / Excel** | Diexport setiap tanggal cutoff penggajian bulanan |
| **8** | **Proposal Penawaran Harga** *(Event Quotation Proposal)* | Dokumen penawaran harga awal pasca survei lokasi yang dikirim ke calon klien, memuat rekomendasi tata letak cahaya, rincian biaya paket sewa, dan syarat ketentuan kerja sama. | **PDF** | Dibuat oleh Admin setelah survei kelayakan teknis selesai dilakukan |
| **9** | **Laporan Log Audit Status Event** *(Event Status Audit Trail Report)* | Laporan penelusuran audit yang menampilkan riwayat lengkap perubahan status suatu pesanan (waktu perubahan, pelaku perubahan, status awal, status tujuan, catatan revisi). | **PDF** | Diunduh oleh pemilik untuk audit internal jika terjadi sengketa dengan klien |
| **10** | **Laporan Feedback Pelanggan** *(Client Satisfaction & Feedback Report)* | Rekap penilaian bintang (*rating*), testimoni, tingkat kepuasan layanan, serta keluhan/saran yang diberikan klien pasca acara selesai diselenggarakan. | **PDF / Excel** | Diexport berkala per semester atau per tahun untuk bahan evaluasi manajemen |

---

## **05. PENGESAHAN DOKUMEN PROPOSAL**

Dokumen usulan ini disusun dengan sungguh-sungguh berdasarkan kebutuhan operasional riil lapangan pada **FND Production** dan rencana arsitektur sistem kerja praktek Informatika.

```
+-------------------------------------------------------------------------+
|                                                                         |
|  Diajukan Oleh,                                 Disetujui Oleh,         |
|  Mahasiswa Penyusun                             Dosen Pembimbing KP     |
|                                                                         |
|                                                                         |
|  [Tanda Tangan Mahasiswa]                       [Tanda Tangan Dosen]    |
|                                                                         |
|  Edisyah Putra Waruwu                           (Nama Dosen Pembimbing) |
|  NIM: 411231179                                 NIDN:                   |
|                                                                         |
+-------------------------------------------------------------------------+
```
