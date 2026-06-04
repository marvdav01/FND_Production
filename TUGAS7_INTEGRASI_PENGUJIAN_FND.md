# LAPORAN INTEGRASI MODUL & PENGUJIAN AWAL SISTEM
**FND Production – Event Lighting Management System**

*Laporan Integrasi Modul & Pengujian Awal Sistem – Tugas Minggu 7*  
*Mata Kuliah: Kerja Praktek (KP) Informatika – Universitas Dian Nusantara (UNDIRA)*

---

### **INFORMASI MAHASISWA & KELOMPOK**
* **Nama Mahasiswa**: Edisyah Putra Waruwu  
* **NIM**: 411231179  
* **Program Studi**: Informatika  
* **Instansi**: Universitas Dian Nusantara (UNDIRA)  
* **Versi Dokumen**: v1.0 (Integrasi & Testing)  
* **Tanggal**: 21 Mei 2026

---

## **I. PENDAHULUAN – LATAR BELAKANG & DESKRIPSI MODUL**

### **A. Latar Belakang Integrasi Modul**
Pengembangan sistem **FND Production (Event Lighting Management System)** berfokus pada integrasi data secara *real-time* guna menyajikan fungsionalitas otomatisasi operasional persewaan lighting panggung yang handal dan bebas bentrok. 

Untuk menguji kesiapan sistem secara utuh pada fase awal pengkodean, dilakukan pengujian integrasi awal (*Integration Testing*) pada dua modul inti yang saling bertukar data dan memiliki tingkat dependensi fungsi yang sangat tinggi:
1. **Modul Pemesanan Event (Event Booking Module)**: Modul *client-side* yang bertanggung jawab menerima input pemesanan sewa peralatan lighting dari portal klien. Modul ini mencatat data dasar pemesanan (Nama Event, Tanggal, Lokasi, Kebutuhan Daya) beserta rincian item alat dan jumlah unit yang diajukan untuk disewa.
2. **Modul Validasi Ketersediaan Alat (Stock Collision Guard Module)**: Modul *server-side* yang berfungsi sebagai filter keamanan inventaris di gudang. Modul ini mendeteksi ketersediaan fisik alat secara *real-time* pada rentang tanggal sewa yang sama untuk mencegah terjadinya sewa ganda (*double-booking*).

### **B. Arsitektur Komunikasi Data & API Contract**
Kedua modul berinteraksi secara asinkron melalui antarmuka REST API. Ketika klien menekan tombol *submit booking*, Modul Pemesanan mengirimkan *payload HTTP POST request* ke backend. Controller backend memanggil modul *Stock Collision Guard* untuk melakukan validasi relasional silang sebelum merekam data ke database.

* **HTTP Endpoint**: `POST /api/bookings/validate-and-create`
* **Payload Request**:
  ```json
  {
    "client_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d4bad",
    "start_date": "2026-05-25",
    "end_date": "2026-05-27",
    "items": [
      { "equipment_id": 102, "quantity": 15 }
    ]
  }
  ```
* **HTTP Response Sukses (200 OK)**:
  ```json
  {
    "status": "success",
    "booking_id": 4091,
    "message": "Booking successfully created, stock secured."
  }
  ```
* **HTTP Response Konflik (409 Conflict)**:
  ```json
  {
    "status": "failed",
    "error": "Stock Collision Error",
    "shortfall_details": [
      { "equipment_id": 102, "equipment_name": "Moving Head Beam 230W", "shortfall": 5 }
    ]
  }
  ```

---

## **II. METODE UJI – LINGKUNGAN UJI & SKENARIO SKEMA**

Pengujian integrasi menggunakan metode **Black-Box Testing** pada tingkat REST API dan simulasi **User Acceptance Testing (UAT)** untuk memverifikasi keakuratan alur data. Pengujian dijalankan pada lingkungan lokal terstandarisasi:
* **Environment Pengujian**: Node.js v20.10, Next.js v14 App Router, PostgreSQL Supabase DB, Postman Client v10.
* **Skenario Uji 1 (Normal Flow)**: Menguji proses booking event dengan kuantitas sewa di bawah kapasitas stok aktual gudang yang bebas jadwal. *(Ekspektasi: HTTP 200 OK, record booking baru terbuat di DB, status pending).*
* **Skenario Uji 2 (Exception Flow - Stock Collision)**: Menguji pengajuan booking event dengan kuantitas alat melebihi stok yang tersedia karena sebagian stok telah terpakai di event lain pada rentang tanggal yang sama. *(Ekspektasi: HTTP 409 Conflict, response menampilkan pesan galat bentrok stok, data di-rollback).*
* **Skenario Uji 3 (Edge Flow - Date Overlap)**: Menguji ketepatan deteksi bentrok stok jika tanggal sewa beririsan sebagian (overlapping) atau melintasi tengah malam. *(Ekspektasi: Deteksi bentrok stok secara akurat).*

---

## **III. HASIL PENGUJIAN – TABEL EKSEKUSI SKENARIO INTEGRASI**

Berikut adalah tabel matriks hasil eksekusi skenario pengujian integrasi awal:

| No | Skenario Pengujian | Data Masukan (Input) | Hasil yang Diharapkan | Hasil Aktual Pengujian | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Normal Flow**: Booking aman di bawah kapasitas stok. | Items: Moving Head 10 unit.<br>Stok Gudang: 30 unit.<br>Tanggal: 25 Mei 2026. | HTTP 200 OK.<br>Status event pending.<br>Stok terpotong secara temporer. | HTTP 200 OK.<br>Booking terbuat di DB.<br>Stok relasional terpotong sukses. | **PASS** |
| **2** | **Exception Flow**: Pengajuan melebihi sisa kapasitas stok. | Items: Moving Head 25 unit.<br>Event Overlap Terjadwal: 15 unit.<br>Tanggal: 25 Mei 2026. | HTTP 409 Conflict.<br>Error: Stock Collision.<br>Shortfall: 10 unit. | HTTP 409 Conflict.<br>"Stock Collision Error"<br>Shortfall: 10. Rollback OK. | **PASS** |
| **3** | **Edge Flow**: Rentang tanggal sewa beririsan sebagian. | Event A: 25 s.d 27 Mei.<br>Event B (Input): 26 s.d 28 Mei.<br>Quantity: Melebihi batas. | HTTP 409 Conflict.<br>Mendeteksi irisan irisan tanggal secara akurat. | HTTP 409 Conflict.<br>Berhasil menolak irisan tanggal sewa ganda. | **PASS** |
| **4** | **Validation Flow**: Format payload salah atau kosong. | event_date: "invalid-date"<br>items: [] | HTTP 400 Bad Request.<br>Validation failure message. | HTTP 400 Bad Request.<br>"Validation failed: Invalid date formats". | **PASS** |

---

## **IV. LOG BUG YANG DITEMUKAN & TINDAKAN SOLUSI PERBAIKAN**

Selama proses integrasi awal, ditemukan beberapa bug kritikal yang segera diselesaikan:

### **1. BUG-01: Overlapping Date range validation bypass**
* **Deskripsi**: Jika Event B memesan alat pada rentang tanggal yang beririsan sebagian dengan Event A, validasi bentrok stok meloset dan booking tetap diizinkan.
* **Dampak**: Kritikal. Terjadi kegagalan data sewa ganda (*double-booking*) alat lighting di lapangan yang memicu kerugian operasional.
* **Akar Masalah**: Query SQL di backend hanya membandingkan `start_date` secara absolut (`=`), bukan irisan rentang waktu (`overlap`).
* **Solusi Perbaikan**: Mengubah query validasi SQL di tingkat database untuk mendeteksi overlap menggunakan ekspresi:  
  `WHERE (start_date <= target_end) AND (end_date >= target_start)`

### **2. BUG-02: Race Condition Concurrent Bookings**
* **Deskripsi**: Dua klien yang checkout pemesanan di milidetik yang sama secara bersamaan melampaui sisa stok alat di gudang, keduanya lolos validasi.
* **Dampak**: Tinggi. Stok lolos validasi ganda, mencatatkan minus stok aktual inventaris gudang.
* **Akar Masalah**: Validasi stok read dan penulisan transaksi database berjalan paralel tanpa adanya penguncian baris data (*data row lock*).
* **Solusi Perbaikan**: Menerapkan transaction isolation level tingkat tinggi `SERIALIZABLE` pada PostgreSQL, atau melakukan locking di tingkat query dengan klausa SQL `SELECT FOR UPDATE` saat membaca sisa kapasitas stok.

### **3. BUG-03: Floating decimal on equipment quantity**
* **Deskripsi**: Payload input API validator menerima kuantitas berupa bilangan pecahan berkoma (contoh: 2.5 unit).
* **Dampak**: Rendah. Angka inventarisasi alat menjadi tidak presisi di database.
* **Akar Masalah**: API validator schema kurang ketat, menggunakan parser `number()` bukan `integer()`.
* **Solusi Perbaikan**: Menambahkan middleware validasi skema Joi/Zod yang memaksa tipe data kuantitas harus berupa bilangan bulat positif:  
  `Joi.number().integer().positive().required()`

---

## **V. ANALISIS INTEGRASI – EVALUASI DATA FLOW & ERROR HANDLING**

1. **Evaluasi Alur Data (Data Flow)**:  
   Alur data dari formulir Next.js berhasil terkirim secara utuh ke API backend Express. Data item yang dikirimkan berhasil diterjemahkan menjadi parameter query pencocokan relasi inventaris. Setelah dilakukan perbaikan pada Bug BUG-01 (Overlapping Date), penanganan tanggal sewa multipel kini berjalan sangat presisi, menjamin validitas data inventaris saat dibaca oleh Modul Pemesanan.
2. **Evaluasi Error Handling (Penanganan Kesalahan)**:  
   Sistem penanganan error (*global error handler middleware*) backend mampu menangkap exception database dengan baik. Jika terjadi kegagalan stok (*Shortfall*), API backend tidak membiarkan server crash melainkan menolak transaksi secara elegan, melakukan rollback otomatis ke database, dan mengembalikan response JSON status terstruktur. Hal ini sangat meningkatkan kualitas UX (User Experience) client karena langsung mendapatkan notifikasi spesifik item apa yang bentrok beserta jumlah kekurangan unitnya.
3. **Kinerja Validasi (Performance Impact)**:  
   Proses validasi stok menambahkan beban query database rata-rata 45ms. Waktu tunggu ini dinilai sangat dapat diterima karena menjamin keamanan stok gudang (*Stock Security*). Untuk optimasi masa depan, tim merencanakan penggunaan caching Redis untuk data master spesifikasi alat lighting.

---

## **VI. KESIMPULAN – KELAYAKAN SISTEM & REKOMENDASI PENGEMBANGAN**

Berdasarkan hasil pengujian integrasi awal antara Modul Pemesanan Event dan Modul Validasi Ketersediaan Alat (Stock Collision Guard), dapat ditarik kesimpulan:
1. Integrasi kedua modul dinilai **BERHASIL** dan **LAYAK** untuk dideploy ke lingkungan staging. Komunikasi API request-response dan validasi data flow berjalan lancar.
2. Temuan bug kritikal (*Date Overlap & Race Condition*) berhasil diatasi secara tuntas di tingkat kode program (database transaction lock & logic SQL overlap), meningkatkan ketahanan sistem dari ancaman kegagalan data sewa ganda.
3. Rekomendasi pengembangan selanjutnya adalah melanjutkan integrasi dengan Modul Penugasan Kru Lapangan (*Crew Assignment*) untuk memverifikasi ketersediaan jadwal kru dengan kalender kerja harian aktif.

---

## **VII. PENGESAHAN LAPORAN INTEGRASI**

Laporan pengujian integrasi modul ini diajukan untuk memenuhi kewajiban akademik Kerja Praktek (KP) Informatika Universitas Dian Nusantara (UNDIRA).

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
