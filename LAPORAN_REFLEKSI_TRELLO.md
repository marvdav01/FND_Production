# LAPORAN REFLEKSI: IMPLEMENTASI RENCANA PROYEK PADA DIGITAL PM TOOL (TRELLO)
**Mata Kuliah:** Kerja Praktek (KP) Informatika  
**Institusi:** Universitas Di Nusantara (UNDIRA)  

---

## 📌 INFORMASI MAHASISWA & PROYEK
* **Nama Mahasiswa** : Edisyah Putra Waruwu
* **NIM / Prodi**     : 411231179 / Informatika
* **Judul Proyek**    : FND Production (Event Lighting Management System)
* **Periode Proyek**   : 5 Januari 2026 – 29 Maret 2026 (12 Minggu / 3 Bulan)
* **Tools PM Digital** : Trello (Kanban Board & Trello Timeline Power-Up)

---

## 1. LATAR BELAKANG TRANSISI DIGITAL
Sebelumnya, FND Production mengelola penjadwalan rental lighting secara manual menggunakan berkas PDF statis yang menyulitkan pembaruan status harian. Transisi rencana proyek WBS (Work Breakdown Structure) 12 minggu ke dalam **Trello** bertujuan untuk memodernisasi manajemen proyek. Langkah ini diambil untuk menciptakan transparansi alur kerja harian (WIP - *Work in Progress*), memperjelas tanggung jawab (PIC), serta melacak kepatuhan lini masa secara dinamis dan real-time bagi tim pengembang dan kru lapangan.

## 2. KANBAN BOARD (TRELLO BOARD) – REFLEKSI & EVALUASI
Implementasi Kanban Board pada Trello dilakukan dengan membuat 6 kolom (List) representasi sprint:
1. `Sprint 1 - Inisiasi & Analisis` (W1-W2)
2. `Sprint 2 - Desain Sistem` (W2-W4)
3. `Sprint 3 - Backend Development` (W4-W7)
4. `Sprint 4 - Frontend Development` (W6-W9)
5. `Sprint 5 - Pengujian & Validasi` (W9-W10)
6. `Sprint 6 - Deployment & Rilis` (W11-W12)

### **Kelebihan & Manfaat:**
* **Visualisasi WIP Sangat Jelas**: Kartu tugas membagi pekerjaan harian secara visual. Anggota tim dapat mengetahui tugas yang sedang dikerjakan (*In Progress*) dan yang sudah selesai (*Done*).
* **Penetapan Akuntabilitas (PIC & Checklist)**: Setiap kartu memuat PIC yang bertanggung jawab (PM, BE, FE, UI, QA) beserta checklist sub-tugas yang terperinci. Hal ini mempermudah kolaborasi pengembang junior.
* **Label Prioritas**: Tag warna (Urgent, High, Medium, Low) membantu tim memfokuskan tenaga pada modul yang paling kritis.

### **Limitasi & Tantangan:**
* **Dependensi Sederhana**: Trello secara bawaan tidak mendeteksi jalur kritis (*critical path*) otomatis. Tim harus menautkan kartu prasyarat (seperti menghubungkan kartu API Spec ke kartu Frontend) secara manual via *Attachment Links*.

## 3. TRELLO TIMELINE VIEW (POWER-UP) – REFLEKSI & EVALUASI
Dengan mengaktifkan Power-Up **Trello Timeline**, tanggal mulai (*Start Date*) dan tenggat waktu (*Due Date*) dari kartu-kartu WBS terintegrasi secara otomatis ke dalam grafik linimasa visual.

### **Kelebihan & Manfaat:**
* **Pelacakan Lintas-Fase (12 Minggu)**: Distribusi beban kerja antar-sprint terpetakan dengan sangat kokoh dalam baris waktu horizontal yang intuitif untuk presentasi manajerial.
* **Deteksi Overlap**: Memudahkan alokasi jam kerja sumber daya manusia agar tidak terjadi bentrok penugasan (*over-allocation*) pada minggu yang sama.

### **Limitasi & Tantangan:**
* **Fleksibilitas Geser Jadwal**: Pergeseran tenggat waktu pada satu kartu prasyarat tidak otomatis menggeser kartu berikutnya yang bergantung padanya (*no automatic schedule cascading*). Hal ini membutuhkan kedisiplinan manajerial dari Project Manager (PM) untuk melakukan penyesuaian manual.

## 4. KESIMPULAN & REKOMENDASI PENERAPAN
Bagi FND Production, Trello merupakan alat manajemen proyek yang sangat tangkas (*agile*) dan kolaboratif. Solusi optimal untuk mengatasi keterbatasannya adalah:
1. **Menerapkan Otomatisasi (Trello Butler)** untuk memindahkan status kartu berdasarkan checklist yang selesai.
2. **Disiplin Checklist**: Seluruh tim wajib melakukan update berkala harian.
3. **Weekly Sprint Review** untuk menyinkronkan status linimasa secara berkala.

---

> [!NOTE]  
> *Laporan ini memenuhi syarat maksimal satu halaman untuk refleksi implementasi PM Digital Trello pada FND Production.*
