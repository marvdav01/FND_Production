# LAPORAN STATUS DAN EVALUASI KINERJA PROYEK
**FND Production – Event Lighting Management System**

*Laporan Status Mingguan & Evaluasi Proyek – Tugas Minggu 6*  
*Mata Kuliah: Kerja Praktek (KP) Informatika – Universitas Dian Nusantara (UNDIRA)*

---

### **INFORMASI MAHASISWA & KELOMPOK**
* **Nama Kelompok**: FND Production Group
* **Nama Mahasiswa**: Edisyah Putra Waruwu  
* **NIM**: 411231179  
* **Program Studi**: Informatika  
* **Instansi**: Universitas Dian Nusantara (UNDIRA)  
* **Versi Dokumen**: v1.0 (Status & Evaluasi)  
* **Tanggal**: 21 Mei 2026

---

## **01. RINGKASAN EKSEKUTIF PROYEK (EXECUTIVE SUMMARY)**

Proyek **FND Production** merupakan pengembangan sistem informasi persewaan peralatan lighting panggung profesional berbasis web fullstack. Sistem ini dirancang khusus untuk mengotomatiskan alur bisnis, mencegah kendala *double-booking* peralatan, mengoptimalkan penugasan kru lapangan, serta menyederhanakan laporan keuangan bulanan.

Laporan status dan evaluasi kinerja ini disusun pada akhir Minggu ke-3 fase konstruksi (Sprint 2). Evaluasi kinerja proyek dilakukan secara kuantitatif menggunakan metode **Earned Value Management (EVM)** untuk menilai deviasi biaya (*Cost Performance*) dan jadwal (*Schedule Performance*). Berdasarkan analisis EVM saat ini:
* Proyek berada dalam status **Cost-Under-Run** (penggunaan anggaran sangat efisien di bawah batas rencana).
* Proyek mengalami deviasi waktu minor berupa **Behind-Schedule** (sedikit terlambat sebesar 4% dari jadwal).
* Arsitektur database relasional (8 entitas) dan API operasional utama telah berhasil diintegrasikan dengan tingkat kestabilan 100%.

---

## **02. DESKRIPSI & RUANG LINGKUP PENGEMBANGAN PROYEK**

Ruang lingkup proyek FND Production hingga pertengahan Sprint 2 ini mencakup 4 pilar fungsional utama:
1. **Modul Client Portal**: UI/UX modern berbasis Next.js untuk registrasi akun klien, monitoring pesanan, dan form pemesanan event (*booking wizard*) secara interaktif.
2. **Modul Core Backend Service**: Layanan API CRUD relasional, sistem autentikasi JWT, validasi constraints ketersediaan aset di gudang (*Stock Collision Guard*), dan validasi jadwal kerja kru harian (*Calendar Conflict Checker*).
3. **Modul Admin Control Panel**: Manajemen pesanan oleh admin, perubahan alur status event (6 tahapan), alokasi peralatan per event, penugasan kru lapangan, pencatatan transaksi keuangan, dan log audit.
4. **Modul Laporan & Print Service**: Pembuatan mesin ekspor otomatis (*document engine*) berformat PDF dan Excel untuk menghasilkan 10 dokumen operasional sistem yang dapat dicetak.

---

## **03. TABEL PROGRES AKTIVITAS PENGEMBANGAN PROYEK**

Berikut adalah tabel progres status pengerjaan fitur-fitur utama proyek hingga akhir Minggu ke-3:

| Aktivitas Pengembangan / Fitur | Status Kerja | Persentase | Keterangan Fungsionalitas & Catatan Kinerja |
| :--- | :---: | :---: | :--- |
| **Inisiasi & Perancangan Relasi Database** | Selesai | 100% | Skema relasional 8 tabel di PostgreSQL Supabase berhasil dibuat lengkap dengan indexing dan cascade. |
| **Modul Autentikasi & Authorization (JWT)** | Selesai | 100% | Middleware verifikasi token JWT backend dan sistem role-based access control (RBAC) berjalan stabil. |
| **UI Portal Wizard Booking & Admin Panel** | Berjalan | 90% | Dashboard analitik admin, visualisasi grafik Recharts, dan formulir multi-step wizard booking telah terintegrasi API. |
| **Stock Collision Guard & Crew Assignment** | Berjalan | 85% | Algoritma backend pendeteksi double-booking alat dan bentrokan jadwal kru harian telah lulus uji fungsionalitas. |
| **Ekspor PDF Laporan & UAT Pengujian** | Berjalan | 50% | Modul pembuat PDF laporan operasional online, dokumen pengujian UAT internal sedang dalam penyusunan akhir. |

---

## **04. PERHITUNGAN METRIK KINERJA PROYEK (EARNED VALUE MANAGEMENT - EVM)**

Evaluasi kuantitatif dilakukan dengan membandingkan anggaran rencana kerja (**PV**), nilai pekerjaan riil terselesaikan (**EV**), dan biaya aktual yang dikeluarkan (**AC**):

* **Planned Value (PV)** = **Rp 12.000.000** (Rencana anggaran untuk 100% penyelesaian target pekerjaan s.d Minggu ke-3).
* **Earned Value (EV)** = **Rp 11.520.000** (Bobot fisik pekerjaan terselesaikan sesungguhnya, yaitu 96% dari target PV).
* **Actual Cost (AC)** = **Rp 10.800.000** (Biaya riil yang telah dikeluarkan untuk infrastruktur serverless dan tim dev).

### **Rumus & Hasil Perhitungan Kinerja:**

1. **Cost Variance (CV)**  
   $$\text{CV} = \text{EV} - \text{AC} = 11.520.000 - 10.800.000 = +\text{Rp } 720.000$$  
   *Interpretasi*: Bernilai **Positif (+)**. Penggunaan anggaran hemat sebesar Rp 720.000 (*Cost-Under-Run*).

2. **Schedule Variance (SV)**  
   $$\text{SV} = \text{EV} - \text{PV} = 11.520.000 - 12.000.000 = -\text{Rp } 480.000$$  
   *Interpretasi*: Bernilai **Negatif (-)**. Proyek mengalami keterlambatan jadwal setara Rp 480.000 (*Behind-Schedule*).

3. **Cost Performance Index (CPI)**  
   $$\text{CPI} = \frac{\text{EV}}{\text{AC}} = \frac{11.520.000}{10.800.000} = 1,067$$  
   *Interpretasi*: **CPI > 1,00**. Penggunaan anggaran sangat efisien. Dari setiap Rp 1.000 biaya yang dikeluarkan, tim menghasilkan nilai pekerjaan setara Rp 1.067.

4. **Schedule Performance Index (SPI)**  
   $$\text{SPI} = \frac{\text{EV}}{\text{PV}} = \frac{11.520.000}{12.000.000} = 0,960$$  
   *Interpretasi*: **SPI < 1,00**. Kecepatan kerja sedikit terlambat, tim baru bekerja dengan efektivitas jadwal 96% dari rencana awal.

---

## **05. ANALISIS KINERJA & INTERPRETASI SPI / CPI**

1. **Efisiensi Anggaran (Cost Efficiency - CPI = 1,067):**  
   Penghematan anggaran sebesar Rp 720.000 diperoleh karena optimalisasi alokasi resource database PostgreSQL yang bersifat serverless (Supabase free tier), serta kecepatan backend developer dalam menyusun API CRUD boilerplate tanpa memerlukan banyak jam kerja tambahan. Penggunaan budget berjalan sangat sehat dan terkontrol.
2. **Keterlambatan Jadwal (Schedule Deviation - SPI = 0,960):**  
   Keterlambatan minor sebesar 4% ini dipicu oleh kendala optimasi query pencarian relasi M:N pada tabel database `event_equipment` pada hari ke-4 Sprint 2. Tim membutuhkan waktu ekstra untuk memecahkan perlambatan query database saat menghitung sisa stok alat secara *real-time*. Namun, deviasi 4% ini masih jauh di bawah batas kritis deviasi proyek (yaitu 5%) dan dijamin tidak akan menunda tanggal rilis final.

---

## **06. VISUALISASI PROGRES PROYEK (GANTT CHART TIMELINE)**

```
+------------------------------------------------------------------------------------+
|  Aktivitas Tugas            | Bobot | Minggu 1   | Minggu 2   | Minggu 3   | Minggu 4 |
+-----------------------------+-------+------------+------------+------------+----------+
| 1. Inisiasi & ERD DB        | 100%  | [=========]|            |            |          |
| 2. Backend Auth & JWT       | 100%  |      [=====|=====]      |            |          |
| 3. UI Portal Booking        |  90%  |            |  [=========|====]       |          |
| 4. Stock Guard Algo         |  85%  |            |            |  [=========|==]       |
| 5. PDF Export & UAT         |  50%  |            |            |      [=====|=====]    |
+------------------------------------------------------------------------------------+
```
*(Catatan: Grafik Gantt Chart visual di dalam PDF utama digambar secara programmatik dengan shape rounded rectangle dan persentase dinamis yang presisi).*

---

## **07. KENDALA UTAMA, RENCANA TINDAK LANJUT & MITIGASI**

| No | Hambatan / Kendala Utama | Dampak Kinerja Proyek | Tindakan Mitigasi / Solusi Lanjut |
| :---: | :--- | :--- | :--- |
| **1** | Perhitungan sisa stok pada relasi M:N melambat saat volume query meningkat. | Keterlambatan waktu respon cek stock (*Behind-Schedule*). | Backend Developer menambahkan indeks komposit pada field relasional untuk mempercepat query relasi. |
| **2** | *Hydration mismatch* Next.js saat merender data tanggal transaksi di sisi client. | Gagal rendering dinamis di browser dan error logs. | PM menginstruksikan penggunaan flag `suppressHydrationWarning` pada layout tanggal di sisi frontend. |
| **3** | *Visual glitch* pada grafik analitik Recharts saat diakses menggunakan mobile view. | Penurunan kualitas UX (tampilan chart keluar dari batas layar). | Frontend Developer membungkus chart ke dalam responsive-container dengan *class layout* scrollable. |

---

## **08. PENGESAHAN LAPORAN EVALUASI**

Laporan evaluasi ini diajukan untuk memenuhi kewajiban akademik Kerja Praktek (KP) Informatika dengan menjunjung tinggi integritas data.

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
