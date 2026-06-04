# 📅 JADWAL PROYEK & PANDUAN INTEGRASI TRELLO (12 MINGGU)
**FND Production – Event Lighting Management System**

Laporan dan panduan ini menyajikan visualisasi jadwal proyek 12 minggu (3 bulan) dan panduan praktis untuk melakukan sinkronisasi dengan papan Trello. File Excel utama telah berhasil dibuat: 
📂 **[Jadwal_Proyek_FND_Production.xlsx](file:///g:/Tugas/KP/FND_Production/Jadwal_Proyek_FND_Production.xlsx)**

---

## 📌 INFORMASI PROYEK
* **Nama Mahasiswa**: Edisyah Putra Waruwu
* **NIM**: 411231179
* **Periode Proyek**: 5 Januari 2026 – 29 Maret 2026 (12 Minggu / 3 Bulan)
* **Status Proyek**: Aktif (Konstruksi)
* **Metode Koordinasi**: Agile (Weekly Sprint Review, Daily Standup via Discord)

---

## 📆 KALENDARISASI & INTEGRASI TANGGAL
Untuk mempermudah pemetaan ke dalam Trello, proyek dijadwalkan mulai pada hari **Senin, 5 Januari 2026**. Durasi 1 minggu dihitung dari hari Senin hingga Minggu, dengan pengerjaan hari kerja (Senin - Jumat) sebagai tenggat waktu operasional.

### **Pemetaan 12 Minggu Proyek (2026)**
* **Minggu 1 (W1)**: 05 Jan 2026 – 11 Jan 2026
* **Minggu 2 (W2)**: 12 Jan 2026 – 18 Jan 2026
* **Minggu 3 (W3)**: 19 Jan 2026 – 25 Jan 2026
* **Minggu 4 (W4)**: 26 Jan 2026 – 01 Feb 2026
* **Minggu 5 (W5)**: 02 Feb 2026 – 08 Feb 2026
* **Minggu 6 (W6)**: 09 Feb 2026 – 15 Feb 2026
* **Minggu 7 (W7)**: 16 Feb 2026 – 22 Feb 2026
* **Minggu 8 (W8)**: 23 Feb 2026 – 01 Mar 2026
* **Minggu 9 (W9)**: 02 Mar 2026 – 08 Mar 2026
* **Minggu 10 (W10)**: 09 Mar 2026 – 15 Mar 2026
* **Minggu 11 (W11)**: 16 Mar 2026 – 22 Mar 2026
* **Minggu 12 (W12)**: 23 Mar 2026 – 29 Mar 2026

---

## 📊 DAFTAR DETAIL TUGAS & TANGGAL KARTU TRELLO
Tabel ini memetakan 20 tasks operasional dari WBS ke dalam tanggal Trello yang siap disalin:

| Kode WBS | Nama Kartu Trello | Trello List / Kolom | Tanggal Mulai | Tanggal Selesai (Due Date) | PIC (Members) | Checklist Sub-Tugas / Deliverables |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **1.1** | [WBS 1.1] Kickoff Meeting & Pembentukan Tim | Sprint 1 - Inisiasi & Analisis | 05-01-2026 | 09-01-2026 | PM | <ul><li>[ ] Pembentukan tim</li><li>[ ] Pembagian peran</li><li>[ ] Penentuan media komunikasi</li><li>[ ] Kickoff meeting log</li></ul> |
| **1.2** | [WBS 1.2] Pengumpulan & Analisis Kebutuhan (BRD) | Sprint 1 - Inisiasi & Analisis | 05-01-2026 | 16-01-2026 | PM + Analyst | <ul><li>[ ] Wawancara stakeholder FND</li><li>[ ] Identifikasi alur rental lighting</li><li>[ ] Pembuatan dokumen BRD</li></ul> |
| **1.3** | [WBS 1.3] Studi Kelayakan Teknis & Finansial | Sprint 1 - Inisiasi & Analisis | 05-01-2026 | 16-01-2026 | PM + Tech Lead | <ul><li>[ ] Evaluasi infrastruktur serverless</li><li>[ ] Estimasi anggaran</li><li>[ ] Analisis kelayakan platform</li></ul> |
| **1.4** | [WBS 1.4] Penyusunan Dokumen Perencanaan Proyek | Sprint 1 - Inisiasi & Analisis | 12-01-2026 | 16-01-2026 | PM | <ul><li>[ ] Finalisasi WBS</li><li>[ ] Pembuatan Gantt Chart</li><li>[ ] Pengesahan dokumen perencanaan</li></ul> |
| **2.1** | [WBS 2.1] Desain Arsitektur (ERD, API Spec) | Sprint 2 - Desain Sistem | 12-01-2026 | 16-01-2026 | Tech Lead | <ul><li>[ ] Pembuatan ERD 8 entitas utama</li><li>[ ] Spesifikasi endpoint REST API</li><li>[ ] Mapping flow data</li></ul> |
| **2.2** | [WBS 2.2] Desain UI/UX Wireframe & Prototype (Figma) | Sprint 2 - Desain Sistem | 19-01-2026 | 30-01-2026 | UI/UX Designer | <ul><li>[ ] Wireframing desktop & mobile</li><li>[ ] Pembuatan UI design di Figma</li><li>[ ] User flow prototype</li></ul> |
| **2.3** | [WBS 2.3] Review & Approval Desain | Sprint 2 - Desain Sistem | 26-01-2026 | 30-01-2026 | PM + Stakeholder | <ul><li>[ ] Sesi presentasi desain ke FND</li><li>[ ] Walkthrough prototype</li><li>[ ] Approval layout</li></ul> |
| **3.1** | [WBS 3.1] Setup Database MySQL & Schema Migration | Sprint 3 - Backend Development | 26-01-2026 | 30-01-2026 | Backend Dev | <ul><li>[ ] Setup PostgreSQL/MySQL</li><li>[ ] Eksekusi migration script</li><li>[ ] Seeding dummy data</li></ul> |
| **3.2** | [WBS 3.2] Implementasi REST API (Auth, Events, Crew) | Sprint 3 - Backend Development | 02-02-2026 | 13-02-2026 | Backend Dev | <ul><li>[ ] Setup JWT Auth</li><li>[ ] CRUD Profiles & Events</li><li>[ ] CRUD Crew & Calendars</li></ul> |
| **3.3** | [WBS 3.3] Implementasi API Equipment & Payments | Sprint 3 - Backend Development | 09-02-2026 | 20-02-2026 | Backend Dev | <ul><li>[ ] Algoritma Stock Collision Guard</li><li>[ ] CRUD Equipment</li><li>[ ] Integrasi pencatatan Payment</li></ul> |
| **3.4** | [WBS 3.4] Implementasi API Reports (PDF/Excel) | Sprint 3 - Backend Development | 16-02-2026 | 20-02-2026 | Backend Dev | <ul><li>[ ] Build generator engine</li><li>[ ] Export laporan keuangan bulanan</li><li>[ ] Export manifes sewa</li></ul> |
| **4.1** | [WBS 4.1] Implementasi Admin Dashboard & Analytics | Sprint 4 - Frontend Development | 09-02-2026 | 20-02-2026 | Frontend Dev | <ul><li>[ ] Pembuatan chart analitik Recharts</li><li>[ ] Panel ringkasan metrik</li><li>[ ] Table event tracking</li></ul> |
| **4.2** | [WBS 4.2] Implementasi Client Portal (Booking Wizard) | Sprint 4 - Frontend Development | 16-02-2026 | 27-02-2026 | Frontend Dev | <ul><li>[ ] Multi-step booking form</li><li>[ ] Validasi ketersediaan real-time</li><li>[ ] Halaman invoice client</li></ul> |
| **4.3** | [WBS 4.3] Implementasi Crew Portal | Sprint 4 - Frontend Development | 23-02-2026 | 27-02-2026 | Frontend Dev | <ul><li>[ ] Calendar view tugas kru harian</li><li>[ ] Status update checklist lapangan</li></ul> |
| **4.4** | [WBS 4.4] Integrasi Frontend ↔ Backend API | Sprint 4 - Frontend Development | 23-02-2026 | 06-03-2026 | Frontend Dev | <ul><li>[ ] Base client fetcher</li><li>[ ] Middleware verifikasi token</li><li>[ ] Handler error global</li></ul> |
| **5.1** | [WBS 5.1] Unit Testing & Integration Testing | Sprint 5 - Pengujian & Validasi | 02-03-2026 | 06-03-2026 | QA Engineer | <ul><li>[ ] Penulisan unit test endpoint Auth/CRUD</li><li>[ ] Uji beban Stock Guard</li><li>[ ] Validasi constraints</li></ul> |
| **5.2** | [WBS 5.2] User Acceptance Testing (UAT) | Sprint 5 - Pengujian & Validasi | 09-03-2026 | 13-03-2026 | QA + Stakeholder | <ul><li>[ ] Demo fungsionalitas ke tim FND</li><li>[ ] Uji skenario sewa langsung</li><li>[ ] Tanda tangan berita acara</li></ul> |
| **5.3** | [WBS 5.3] Bug Fixing & Performance Optimization | Sprint 5 - Pengujian & Validasi | 09-03-2026 | 13-03-2026 | Full Team | <ul><li>[ ] Fixing hydration error Next.js</li><li>[ ] Optimasi query index M:N database</li><li>[ ] Responsive mobile charts</li></ul> |
| **6.1** | [WBS 6.1] Konfigurasi Server & CI/CD Pipeline | Sprint 6 - Deployment & Rilis | 16-03-2026 | 20-03-2026 | DevOps | <ul><li>[ ] Konfigurasi server production</li><li>[ ] Setup GitHub Actions CI/CD</li><li>[ ] Integrasi environment variables</li></ul> |
| **6.2** | [WBS 6.2] Deployment ke Production (Vercel + MySQL) | Sprint 6 - Deployment & Rilis | 16-03-2026 | 20-03-2026 | DevOps | <ul><li>[ ] Push build final ke Vercel</li><li>[ ] Setup database production</li><li>[ ] SSL certificate activation</li></ul> |
| **6.3** | [WBS 6.3] Pelatihan & Penyerahan Dokumentasi | Sprint 6 - Deployment & Rilis | 23-03-2026 | 27-03-2026 | PM + Tech Lead | <ul><li>[ ] Sesi training tim operator FND</li><li>[ ] Penyerahan API docs & User Manual</li><li>[ ] Serah terima manual book</li></ul> |
| **6.4** | [WBS 6.4] Serah Terima Proyek (Project Closure) | Sprint 6 - Deployment & Rilis | 23-03-2026 | 27-03-2026 | PM | <ul><li>[ ] Penutupan administrasi proyek</li><li>[ ] Penyerahan laporan akhir KP</li><li>[ ] Tanda tangan closing statement</li></ul> |

---

## 🗺️ PROYEKSI GANTT CHART (12 MINGGU)

Berikut representasi grafis jadwal kerja di Trello Anda per fase:

```
FASE / AKTIVITAS                | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10| W11| W12|
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 1: INISIASI & ANALISIS     |====|====|    |    |    |    |    |    |    |    |    |    |
1.1 Kickoff & Pembentukan Tim   |====|    |    |    |    |    |    |    |    |    |    |    |
1.2 BRD (Analisis Kebutuhan)    |====|====|    |    |    |    |    |    |    |    |    |    |
1.3 Studi Kelayakan             |====|====|    |    |    |    |    |    |    |    |    |    |
1.4 Perencanaan Proyek          |    |====|    |    |    |    |    |    |    |    |    |    |
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 2: DESAIN SISTEM           |    |====|====|====|    |    |    |    |    |    |    |    |
2.1 Arsitektur (ERD, API Spec)  |    |====|    |    |    |    |    |    |    |    |    |    |
2.2 Desain UI/UX & Prototype    |    |    |====|====|    |    |    |    |    |    |    |    |
2.3 Review & Approval Desain    |    |    |    |====|    |    |    |    |    |    |    |    |
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 3: BACKEND DEVELOPMENT     |    |    |    |====|====|====|====|    |    |    |    |    |
3.1 Setup DB & Migrasi Skema    |    |    |    |====|    |    |    |    |    |    |    |    |
3.2 API Auth & Core Service     |    |    |    |    |====|====|    |    |    |    |    |    |
3.3 API Stock & Payment Guard   |    |    |    |    |    |====|====|    |    |    |    |    |
3.4 API Reports (PDF/Excel)     |    |    |    |    |    |    |====|    |    |    |    |    |
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 4: FRONTEND DEVELOPMENT    |    |    |    |    |    |====|====|====|====|    |    |    |
4.1 Admin Panel & Analytics     |    |    |    |    |    |====|====|    |    |    |    |    |
4.2 Client Portal Booking       |    |    |    |    |    |    |====|====|    |    |    |    |
4.3 Crew Portal                 |    |    |    |    |    |    |    |====|    |    |    |    |
4.4 Integrasi Frontend-Backend  |    |    |    |    |    |    |    |====|====|    |    |    |
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 5: PENGUJIAN & VALIDASI    |    |    |    |    |    |    |    |    |====|====|    |    |
5.1 Unit & Integration Test     |    |    |    |    |    |    |    |    |====|    |    |    |
5.2 User Acceptance Test (UAT)  |    |    |    |    |    |    |    |    |    |====|    |    |
5.3 Bug Fixing & Optimasi       |    |    |    |    |    |    |    |    |    |====|    |    |
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
FASE 6: DEPLOYMENT & PELATIHAN  |    |    |    |    |    |    |    |    |    |    |====|====|
6.1 Setup Server & CI/CD        |    |    |    |    |    |    |    |    |    |    |====|    |
6.2 Production Deploy (Vercel)  |    |    |    |    |    |    |    |    |    |    |====|    |
6.3 Sesi Training & User Docs   |    |    |    |    |    |    |    |    |    |    |    |====|
6.4 Project Closure             |    |    |    |    |    |    |    |    |    |    |    |====|
--------------------------------+----+----+----+----+----+----+----+----+----+----+----+----+
```

---

## 🛠️ PANDUAN PRAKTIS SINKRONISASI KE TRELLO
Berikut adalah cara terbaik untuk memindahkan data dari berkas Excel ke papan Trello Anda:

### **Langkah 1: Setup Kolom / Lists di Trello**
Buat 6 Kolom (List) di papan Trello Anda untuk mewakili setiap fase Sprint:
1. `Sprint 1 - Inisiasi & Analisis`
2. `Sprint 2 - Desain Sistem`
3. `Sprint 3 - Backend Development`
4. `Sprint 4 - Frontend Development`
5. `Sprint 5 - Pengujian & Validasi`
6. `Sprint 6 - Deployment & Rilis`

### **Langkah 2: Tambahkan Kartu Tugas**
Buka sheet **"Panduan Import Trello"** pada file Excel Anda.
1. Salin teks pada kolom **A** (misal: `[WBS 1.1] Kickoff Meeting & Pembentukan Tim`) dan buat sebagai **Title** kartu baru.
2. Tempatkan kartu tersebut di kolom (List) Trello yang sesuai di kolom **B**.

### **Langkah 3: Atur Waktu & Pengisi Kartu (Due Dates & Members)**
1. Klik kartu yang baru saja dibuat di Trello.
2. Pilih **Dates** (Tanggal):
   * Centang **Start Date** (Tanggal Mulai): Isi sesuai kolom **C** (misal: `05-01-2026`).
   * Centang **Due Date** (Tanggal Selesai): Isi sesuai kolom **D** (misal: `09-01-2026`).
3. Pilih **Members** (Anggota): Undang dan tugaskan PIC yang sesuai dari kolom **E** (PM, Tech Lead, Backend Dev, dll.).

### **Langkah 4: Tambahkan Checklist Sub-Tugas**
1. Di dalam kartu Trello, klik **Checklist** di menu sebelah kanan.
2. Beri nama checklist: `Sub-Tugas / Deliverables`.
3. Buka Excel, salin daftar sub-tugas di kolom **F** untuk baris tersebut.
4. Tempel (*paste*) langsung di input isian item Trello. Trello secara otomatis akan membagi baris-baris tersebut menjadi beberapa checkbox terpisah!

---

> [!TIP]
> **Rekomendasi Power-Up Trello:**
> Gunakan Power-Up gratis **"Timeline"** atau **"Gantt Chart"** di Trello agar tanggal mulai dan tanggal selesai yang telah Anda masukkan langsung terender sebagai grafik Gantt interaktif yang persis seperti tampilan di Excel!
