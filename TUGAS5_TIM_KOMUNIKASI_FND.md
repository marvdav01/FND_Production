# LAPORAN STRUKTUR TIM & MANAJEMEN KOMUNIKASI PROYEK
**FND Production – Event Lighting Management System**

*Dokumen Tim & Komunikasi Proyek – Tugas Minggu 5*  
*Mata Kuliah: Kerja Praktek (KP) Informatika – Universitas Dian Nusantara (UNDIRA)*

---

### **INFORMASI MAHASISWA**
* **Nama**: Edisyah Putra Waruwu  
* **NIM**: 411231179  
* **Program Studi**: Informatika  
* **Instansi**: Universitas Dian Nusantara (UNDIRA)  
* **Versi Dokumen**: v1.0 (Tim & Komunikasi)  
* **Tanggal**: 21 Mei 2026

---

## **01 & 02. STRUKTUR TIM PROYEK & DISTRIBUSI PERAN**

Dalam rangka menyukseskan proyek pengembangan **Event Lighting Management System (FND Production)**, dibentuk tim pengembang terintegrasi yang memiliki pembagian peran dan keahlian yang beragam. Berikut rincian peran, keahlian teknis, dan tanggung jawab utama setiap anggota tim:

| Nama Anggota | Peran Utama | Keahlian Teknis / Spesialisasi | Tanggung Jawab Utama |
| :--- | :--- | :--- | :--- |
| **Edisyah Putra Waruwu**  *(NIM: 411231179)* | **Project Manager & Tech Lead** | Next.js, System Architecture, Agile Management, Git Workflow. | Memimpin seluruh siklus proyek, alokasi timeline, integrasi modul frontend & backend, review code (Pull Requests), serta koordinasi tim. |
| **Timotius Sibarani** | **System Analyst & Database Designer** | ERD Modeling, PostgreSQL Constraints, BRD, API Specification. | Menganalisis proses bisnis sewa lighting FND Production, merancang schema database di Supabase, dan mendesain spesifikasi REST API. |
| **Maria Clara** | **Backend Developer** | Node.js Express, Supabase Auth, REST API CRUD, Security, SQL. | Membangun fungsionalitas server-side, mengonfigurasi database relasional, menerapkan enkripsi auth token, dan membuat audit log status. |
| **Christian Wijaya** | **Frontend Developer** | React 19, Tailwind CSS, Lucide Icons, React Hook Form, Recharts. | Membangun antarmuka pengguna (UI) yang responsif untuk Admin Portal, Client Portal, Crew Portal, dan mengintegrasikan API. |
| **Sarah Angelina** | **Quality Assurance & Tester** | Postman, Integration Testing, UAT, Bug Tracking, Manual Testing. | Membuat skenario pengujian, menguji kehandalan API, memvalidasi fitur stock collision guard, memantau bug, dan menyusun laporan pengujian UAT. |
| **Reza Adrian** | **Technical Writer & Dokumentator** | Markdown, jsPDF/PDFKit, Technical Writing, Microsoft Office. | Menyusun dokumentasi teknis proyek, menulis API docs, manual panduan pengguna (Setup Guide), serta merancang berkas keluaran sistem (print layout). |

---

## **03. MATRIKS RENCANA KOMUNIKASI (COMMUNICATION PLAN)**

Komunikasi dalam tim dikelola secara terstruktur melalui matriks rencana komunikasi formal untuk menjaga transparansi kerja, memantau progress secara ketat, dan meminimalisir hambatan koordinasi teknis lapangan:

| Jenis Informasi / Rapat | Kanal / Media | Frekuensi | Tujuan & Agenda Utama | Partisipan |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Standup Meeting** | Discord (Voice Room) | Setiap Hari Kerja (09.00 - 09.15 WIB) | Melaporkan progress hari kemarin, rencana kerja hari ini, dan hambatan teknis (*blockers*) yang dihadapi. | PM, Developer, Tester, Analyst |
| **Sprint Planning & Weekly Review** | Google Meet & Trello Board | Setiap Hari Senin (10.00 - 11.30 WIB) | Perencanaan tugas mingguan, peninjauan kartu backlog di Trello, demo fungsionalitas fitur yang selesai, dan alokasi sprint berikutnya. | Seluruh Anggota Tim |
| **Technical Discussion** | Discord (Tech-Chat) & GitHub PR | Kondisional / On Demand | Diskusi pemecahan bug kritis, review kode pada Pull Requests, dan koordinasi perubahan spesifikasi database/API. | PM, Backend Dev, Frontend Dev, Analyst |
| **Project Status Update** | WhatsApp Group | Setiap Hari (Sore Hari / EOD) | Pengiriman laporan singkat pencapaian harian secara asinkron (*End of Day report*) untuk pelacakan pasif owner. | Seluruh Anggota Tim |
| **User Acceptance Test (UAT)** | Google Meet & Web App Portal | Fase Akhir Sprint | Simulasi langsung pengujian fungsionalitas sistem bersama perwakilan klien untuk penandatanganan berita acara. | PM, Tester, Perwakilan Klien |

---

## **04. SIMULASI LAPORAN STATUS PROYEK (DAILY STATUS REPORT – 5 HARI KERJA)**

Berikut adalah simulasi laporan status harian selama 5 hari kerja berturut-turut pada fase pengembangan inti (Sprint 2):

### **Hari 1: Senin, 18 Mei 2026**
* **Fokus Kegiatan Utama**: Kick-off Sprint 2 & Finalisasi Database ERD FND Production.
* **Capaian Utama (Deliverables)**:
  * ERD disetujui (8 entity utama: `profiles`, `events`, `equipment`, `event_equipment`, `event_crew`, `payments`, `event_schedules`, `event_status_history`).
  * Database PostgreSQL Supabase berhasil diinisialisasi.
  * Papan Trello board diisi dengan 18 card tugas operasional.
* **Kendala / Hambatan**: Detail check constraint stok belum terakomodasi di migration SQL.
* **Solusi & Tindakan Lanjut**: System Analyst merevisi file migration backend dan menambahkan CHECK rules untuk ketersediaan stock.
* **Status**: SELESAI (100%)

### **Hari 2: Selasa, 19 Mei 2026**
* **Fokus Kegiatan Utama**: Pengembangan core REST API backend & setup Next.js auth.
* **Capaian Utama (Deliverables)**:
  * Endpoint REST API untuk CRUD events dan profiles selesai didevelop.
  * Supabase Auth terintegrasi di backend (JWT session verification).
  * Postman collection dibuat untuk testing endpoints.
* **Kendala / Hambatan**: Terjadi delay verifikasi token saat konfigurasi middleware Next.js.
* **Solusi & Tindakan Lanjut**: Tech Lead membantu Backend Developer merestrukturisasi middleware token extraction logic.
* **Status**: SELESAI (100%)

### **Hari 3: Rabu, 20 Mei 2026**
* **Fokus Kegiatan Utama**: Pembangunan UI Dashboard & integrasi API awal.
* **Capaian Utama (Deliverables)**:
  * UI Admin Dashboard (metrik total event, revenue, dan Recharts) selesai dibangun.
  * Formulir event booking multi-step wizard di Client Portal selesai diimplementasi.
* **Kendala / Hambatan**: Hydration mismatch di Next.js saat merender server-side data pembayaran.
* **Solusi & Tindakan Lanjut**: PM menyarankan penambahan flag `suppressHydrationWarning` pada layout untuk sinkronisasi waktu client-server.
* **Status**: SELESAI (100%)

### **Hari 4: Kamis, 21 Mei 2026**
* **Fokus Kegiatan Utama**: Implementasi Stock Collision Guard & Penugasan Kru.
* **Capaian Utama (Deliverables)**:
  * Algoritma pengecekan bentrok stok (Stock Collision Guard) selesai diimplementasi.
  * Query ketersediaan kru harian berhasil diuji via API.
  * UI alokasi alat dan crew assignment selesai dibangun di Admin Panel.
* **Kendala / Hambatan**: Perhitungan sisa stok di backend melambat saat query relasi M:N peralatan.
* **Solusi & Tindakan Lanjut**: Backend Developer menambahkan indeks komposit pada tabel `event_equipment` pada field `event_id` dan `equipment_id`.
* **Status**: SELESAI (100%)

### **Hari 5: Jumat, 22 Mei 2026**
* **Fokus Kegiatan Utama**: Unit Testing, Bug Fixing, & Penyusunan Dokumen Print PDF.
* **Capaian Utama (Deliverables)**:
  * Pengujian menyeluruh API Auth & CRUD sukses (100% pass rate dari 20 endpoint).
  * Script otomasi generator PDF Laporan berhasil dijalankan.
  * Dokumen UAT internal ditandatangani oleh QA Tester dan PM.
* **Kendala / Hambatan**: Ditemukan bug visual kecil (*visual glitch*) pada grafik Recharts di perangkat mobile.
* **Solusi & Tindakan Lanjut**: Frontend Developer membungkus grafik dalam container dengan class `overflow-x-auto` dan flex responsif Tailwind.
* **Status**: SELESAI (100%)

---

## **05. DOKUMENTASI BUKTI KOMUNIKASI (LOG RAPAT & SIMULASI CHAT TIM)**

### **A. Notulen Rapat Koordinasi (Meeting Minutes Log)**
* **Nama Pertemuan**: Sprint 2 Planning & Database Design Review
* **Tanggal & Waktu**: Senin, 18 Mei 2026 / 10.00 - 11.30 WIB
* **Media Rapat**: Google Meet (Online Video Conference)
* **Daftar Hadir**: Edisyah (PM), Timotius (Analyst), Maria (BE), Christian (FE), Sarah (QA), Reza (Doc).
* **Agenda Utama**:
  1. Peninjauan dan persetujuan skema ERD relasional dengan 8 table utama.
  2. Pembagian backlog tugas pengkodean dan set-up papan tugas Trello.
  3. Pengenalan standardisasi API response format untuk frontend-backend.
* **Keputusan Kunci**:
  * Database Supabase PostgreSQL dikonfigurasikan hari ini.
  * Integrasi modul auth menggunakan JWT wajib diselesaikan besok malam.
  * Next meeting: Daily standup via Discord besok pagi jam 09.00 WIB.

### **B. Log Chat Koordinasi Teknis (Simulated Chat Logs – Discord)**
* **[18/05/2026 - 13:42]  Timotius Sibarani (Analyst)**:  
  *“Guys, ERD fix sudah saya upload ke folder design. Maria, silakan buat migration script-nya ya.”*
* **[18/05/2026 - 13:45]  Maria Clara (Backend Dev)**:  
  *“Siap, Tim! Database Supabase PostgreSQL sudah online. Saya buat schema migration sesuai file ERD.”*
* **[19/05/2026 - 15:10]  Sarah Angelina (QA Tester)**:  
  *“Edisyah, saya sudah test endpoint CRUD event via Postman. Semuanya pass, tinggal testing auth-nya.”*
* **[19/05/2026 - 15:12]  Edisyah P. Waruwu (PM/Tech Lead)**:  
  *“Mantap sarah! Christian, backend integration sudah bisa dimulai di frontend. Jangan lupa git checkouts.”*

---

## **06. PENGESAHAN DOKUMEN LAPORAN**

Laporan struktur tim dan rencana manajemen komunikasi proyek ini disusun dengan sungguh-sungguh berdasarkan simulasi kerja praktek nyata Informatika.

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
