import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { jsPDF } = require('jspdf')
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable')
const fs = require('fs')
const path = require('path')

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
const W = 210
const H = 297
const ML = 18
const MR = 18
const CW = W - ML - MR

// ── Color Palette ──────────────────────────────────────────────────────────
const PRIMARY   = [26, 60, 110]   // dark navy
const SECONDARY = [52, 120, 185]  // steel blue
const ACCENT    = [241, 154, 40]  // amber
const LIGHT     = [235, 242, 252] // pale blue
const WHITE     = [255, 255, 255]
const DARK      = [30, 30, 30]
const MID       = [100, 110, 125]
const BORDER    = [200, 212, 228]

// ══════════════════════════════════════════════════════════════════════════
// PAGE 1 – COVER PAGE
// ══════════════════════════════════════════════════════════════════════════
// Gradient-like header block
doc.setFillColor(...PRIMARY)
doc.rect(0, 0, W, 75, 'F')

doc.setFillColor(...SECONDARY)
doc.rect(0, 72, W, 6, 'F')

doc.setFillColor(...ACCENT)
doc.rect(0, 75, W, 4, 'F')

// Decorative circles
doc.setFillColor(60, 100, 160)
doc.circle(175, 20, 30, 'F')
doc.setFillColor(40, 80, 140)
doc.circle(185, 55, 18, 'F')
doc.setFillColor(30, 65, 120)
doc.circle(20, 15, 12, 'F')

// Project icon (lightbulb shape via rect+ellipse)
doc.setFillColor(...ACCENT)
doc.rect(100, 22, 10, 12, 'F')
doc.ellipse(105, 21, 7, 7, 'F')
doc.setFillColor(...WHITE)
doc.ellipse(105, 20, 5, 5, 'F')
doc.setFillColor(...ACCENT)
doc.ellipse(105, 20, 3, 3, 'F')

// Title
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(20)
doc.text('LAPORAN STRUKTUR TIM', W/2, 95, { align: 'center' })
doc.text('& MANAJEMEN KOMUNIKASI PROYEK', W/2, 103, { align: 'center' })

doc.setFontSize(15)
doc.setTextColor(...ACCENT)
doc.text('FND Production', W/2, 113, { align: 'center' })

doc.setFontSize(11)
doc.setTextColor(...WHITE)
doc.text('Event Lighting Management System', W/2, 121, { align: 'center' })

// Divider line
doc.setDrawColor(...ACCENT)
doc.setLineWidth(0.8)
doc.line(ML+20, 126, W-MR-20, 126)

doc.setFontSize(10)
doc.setTextColor(...MID)
doc.text('Tugas Minggu 5  •  Kerja Praktek Informatika UNDIRA', W/2, 134, { align: 'center' })

// Info card
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, 142, CW, 60, 4, 4, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, 142, CW, 60, 4, 4, 'S')

const infoRows = [
  ['Nama Mahasiswa', 'Edisyah Putra Waruwu', '411231179'],
  ['Program Studi',  'Informatika – Universitas Dian Nusantara', ''],
  ['Mata Kuliah',    'Kerja Praktek (KP)', ''],
  ['Versi Dokumen',  'v1.0 (Tim & Komunikasi)', ''],
  ['Tanggal Dibuat', '21 Mei 2026', ''],
]

let iy = 154
doc.setFontSize(9)
for (const [label, val, extra] of infoRows) {
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.text(label, ML+6, iy)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  doc.text(': ' + val + (extra ? '   •   NIM: ' + extra : ''), ML+52, iy)
  iy += 9
}

// Status badge
doc.setFillColor(...PRIMARY)
doc.roundedRect(ML, 212, 55, 14, 3, 3, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('TUGAS MINGGU 5', ML+27.5, 220.5, { align: 'center' })

doc.setFillColor(...ACCENT)
doc.roundedRect(ML+60, 212, 55, 14, 3, 3, 'F')
doc.text('TIM & KOMUNIKASI', ML+87.5, 220.5, { align: 'center' })

// Footer strip
doc.setFillColor(...PRIMARY)
doc.rect(0, H-18, W, 18, 'F')
doc.setFont('helvetica', 'normal')
doc.setTextColor(...WHITE)
doc.setFontSize(8)
doc.text('FND Production  |  Tugas Kerja Praktek  |  Informatika – UNDIRA  |  2026', W/2, H-8, { align: 'center' })

// ══════════════════════════════════════════════════════════════════════════
// HELPER – page header/footer
// ══════════════════════════════════════════════════════════════════════════
function addPageChrome(pageNum, title) {
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, 20, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 20, W, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('FND PRODUCTION – Struktur Tim & Manajemen Komunikasi', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })

  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Tugas 5 Kerja Praktek  •  Informatika UNDIRA  •  2026', ML, H-6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(`Halaman ${pageNum}`, W-MR, H-6, { align: 'right' })
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(...PRIMARY)
  doc.rect(ML, y, CW, 9, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(ML, y, 3, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text(text, ML+6, y+6.2)
  return y + 14
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 – TIM & DISTRIBUTION OF ROLES & COMMUNICATION PLAN
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'Pembentukan Tim & Rencana Komunikasi')

let y = 30
y = sectionTitle(doc, '01 & 02. STRUKTUR TIM PROYEK & DISTRIBUSI PERAN', y)

// Team intro
doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pTimIntro = 'Dalam rangka mensukseskan proyek Event Lighting Management System (FND Production), dibentuk tim terintegrasi dengan disiplin keilmuan yang saling melengkapi. Berikut rincian peran, keahlian, dan tanggung jawab masing-masing anggota tim:'
const splitTimIntro = doc.splitTextToSize(pTimIntro, CW)
doc.text(splitTimIntro, ML, y)
y += splitTimIntro.length * 4.2 + 4

// Team Table
const teamData = [
  ['Nama Anggota', 'Peran Utama', 'Keahlian Teknis / Spesialisasi', 'Tanggung Jawab Utama'],
  ['Edisyah Putra Waruwu\n(NIM: 411231179)', 'Project Manager\n& Tech Lead', 'Next.js, System Architecture, Agile Management, Git Workflow.', 'Memimpin seluruh siklus proyek, alokasi timeline, integrasi modul, review code, dan koordinasi tim.'],
  ['Timotius Sibarani', 'System Analyst\n& Database Designer', 'ERD Modeling, PostgreSQL Constraints, BRD, API Design.', 'Menganalisis proses bisnis FND Production, merancang schema database Supabase, dan mendesain REST API spec.'],
  ['Maria Clara', 'Backend Developer', 'Node.js Express, Supabase Auth, REST API CRUD, Security.', 'Membangun fungsionalitas server-side, integrasi Supabase PostgreSQL, role-based checks, dan audit log status.'],
  ['Christian Wijaya', 'Frontend Developer', 'React 19, Tailwind CSS, Lucide Icons, React Hook Form.', 'Membangun UI responsif untuk Admin Portal, Client Wizard Booking, Crew Portal, dan integrasi API Client.'],
  ['Sarah Angelina', 'Quality Assurance\n& Tester', 'Postman, Integration Testing, UAT, Bug Tracking.', 'Membuat test plan, menguji kehandalan API, mengecek stok collision guard, memantau bug, dan menyusun laporan UAT.'],
  ['Reza Adrian', 'Technical Writer\n& Dokumentator', 'Markdown, PDFKit/jsPDF, Technical Writing.', 'Menyusun dokumentasi lengkap, membuat API docs, manual panduan pengguna (Setup Guide), dan format print output.'],
]

autoTable(doc, {
  startY: y,
  head: [teamData[0]],
  body: teamData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.5, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
  columnStyles: {
    0: { cellWidth: 35, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 28, fontStyle: 'bold', textColor: SECONDARY },
    2: { cellWidth: 40 },
    3: { cellWidth: CW - 35 - 28 - 40 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 8

// Section 03
y = sectionTitle(doc, '03. MATRIKS RENCANA KOMUNIKASI (COMMUNICATION PLAN)', y)

const pCommIntro = 'Komunikasi tim dikelola secara terstruktur melalui communication plan yang mendefinisikan kanal, frekuensi, dan jenis informasi yang dipertukarkan untuk menjaga keterbukaan dan meminimalisir miskomunikasi:'
const splitCommIntro = doc.splitTextToSize(pCommIntro, CW)
doc.text(splitCommIntro, ML, y)
y += splitCommIntro.length * 4.2 + 4

const commPlanData = [
  ['Jenis Informasi / Rapat', 'Kanal / Media', 'Frekuensi', 'Tujuan & Agenda Utama', 'Partisipan'],
  ['Daily Standup Meeting', 'Discord (Voice Room)', 'Setiap Hari Kerja\n(09.00 - 09.15)', 'Membahas progress kemarin, rencana hari ini, dan hambatan teknis (blockers).', 'PM, Devs, QA, Analyst'],
  ['Sprint Planning & Weekly Review', 'Google Meet & Trello', 'Setiap Hari Senin\n(10.00 - 11.30)', 'Perencanaan tugas mingguan, peninjauan Trello card backlog, demo hasil kerja mingguan.', 'Seluruh Anggota Tim'],
  ['Technical Discussion', 'Discord & GitHub PR', 'Kondisional / On Demand', 'Pembahasan bug kritis, spesifikasi API yang berubah, review pull requests.', 'PM, Devs, Analyst'],
  ['Project Status Update', 'WhatsApp Group', 'Setiap Hari\n(Sore Hari / EOD)', 'Laporan singkat pencapaian harian secara asinkron (End of Day report).', 'Seluruh Anggota Tim'],
  ['User Acceptance Test (UAT)', 'Google Meet & Portal', 'Fase Akhir Proyek', 'Simulasi langsung pengujian fitur dengan pengguna, pencatatan feedback.', 'PM, Tester, Client'],
]

autoTable(doc, {
  startY: y,
  head: [commPlanData[0]],
  body: commPlanData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.5, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
  columnStyles: {
    0: { cellWidth: 35, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 28, fontStyle: 'bold', textColor: SECONDARY },
    2: { cellWidth: 25, halign: 'center' },
    3: { cellWidth: CW - 35 - 28 - 25 - 22 },
    4: { cellWidth: 22, halign: 'center', textColor: MID },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – SIMULATED DAILY STATUS REPORT (5 DAYS)
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'Simulasi Laporan Status 5 Hari Kerja')

y = 30
y = sectionTitle(doc, '04. SIMULASI LAPORAN STATUS PROYEK (5 HARI KERJA)', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pSimIntro = 'Berikut adalah simulasi laporan status harian (Daily Status Report) tim FND Production selama 5 hari kerja berturut-turut pada fase pengembangan inti (Sprint 2):'
const splitSimIntro = doc.splitTextToSize(pSimIntro, CW)
doc.text(splitSimIntro, ML, y)
y += splitSimIntro.length * 4.2 + 5

const statusReportData = [
  ['Hari / Tanggal', 'Fokus Kegiatan Utama', 'Capaian Utama (Deliverables)', 'Kendala / Hambatan', 'Solusi & Tindakan Lanjut', 'Status'],
  ['Hari 1\nSenin, 18 Mei 2026', 'Kick-off Sprint 2 & Finalisasi Database ERD FND Production.', '• ERD disetujui (8 entity).\n• Database PostgreSQL Supabase diinisialisasi.\n• Trello board diisi 18 card tugas.', 'Detail check constraint stok belum terakomodasi di migration SQL.', 'Analyst merevisi file migration backend dan menambahkan CHECK rules untuk stock.', 'SELESAI\n(100%)'],
  ['Hari 2\nSelasa, 19 Mei 2026', 'Pengembangan core REST API backend & setup Next.js auth.', '• Endpoint CRUD events & profiles selesai.\n• Supabase Auth terintegrasi di backend.\n• Postman collection dibuat.', 'Sempat terjadi delay saat config middleware token verification.', 'Tech Lead membantu Backend Dev merestrukturisasi token extraction logic.', 'SELESAI\n(100%)'],
  ['Hari 3\nRabu, 20 Mei 2026', 'Pembangunan UI Dashboard & integrasi API awal.', '• UI Admin Dashboard (metrik & Recharts) selesai.\n• Event booking multi-step wizard di Client Portal selesai.', 'Hydration mismatch di Next.js saat merender server side data.', 'PM menyarankan menambahkan flag suppressHydrationWarning pada layout.', 'SELESAI\n(100%)'],
  ['Hari 4\nKamis, 21 Mei 2026', 'Implementasi Stock Collision Guard & Penugasan Kru.', '• Algorithm stock check terimplementasi.\n• Database query ketersediaan kru diuji via API.\n• UI list crew & assign button selesai.', 'Perhitungan sisa stok di backend melambat saat query relasi M:N.', 'Backend Dev menambahkan indeks komposit pada event_id dan equipment_id.', 'SELESAI\n(100%)'],
  ['Hari 5\nJumat, 22 Mei 2026', 'Unit Testing, Bug Fixing, & Penyusunan Dokumen Print PDF.', '• Pengujian API Auth & CRUD sukses (100% pass).\n• Generator PDF Laporan berhasil dibuat via script.\n• Dokumen UAT ditandatangani.', 'Menemukan visual glitch kecil pada charts di resolusi mobile.', 'Frontend Dev menambahkan kelas overflow-x-auto dan responsivitas Tailwind.', 'SELESAI\n(100%)'],
]

autoTable(doc, {
  startY: y,
  head: [statusReportData[0]],
  body: statusReportData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.2, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
  columnStyles: {
    0: { cellWidth: 24, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 32 },
    2: { cellWidth: 42 },
    3: { cellWidth: 32, textColor: [180, 50, 50] },
    4: { cellWidth: 30, textColor: [50, 120, 50] },
    5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', textColor: SECONDARY },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
  didParseCell(data) {
    if (data.section === 'body' && data.column.index === 5) {
      data.cell.styles.fillColor = [235, 250, 240]
      data.cell.styles.textColor = [46, 125, 50]
    }
  }
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 – COMMUNICATION EVIDENCE, LOGS, & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(4, 'Bukti Komunikasi & Lembar Pengesahan')

y = 30
y = sectionTitle(doc, '05. BUKTI KOMUNIKASI (LOG RAPAT & SIMULASI CHAT TIM)', y)

// Meeting Minutes Block
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...PRIMARY)
doc.text('A. Notulen Rapat Koordinasi (Meeting Minutes Log)', ML, y)
y += 4.5

const minutesData = [
  ['Atribut Rapat', 'Detail Log Pertemuan'],
  ['Nama Rapat', 'Sprint 2 Planning & Database Design Review'],
  ['Tanggal & Waktu', 'Senin, 18 Mei 2026 / 10.00 - 11.30 WIB'],
  ['Media Rapat', 'Google Meet (Online Video Conference)'],
  ['Daftar Hadir', 'Edisyah (PM), Timotius (Analyst), Maria (BE), Christian (FE), Sarah (QA), Reza (Doc).'],
  ['Agenda Utama', '1. Persetujuan ERD schema dengan 8 table utama.\n2. Pembagian backlog tugas dan set-up Trello board.\n3. Pengenalan API standard response format.'],
  ['Keputusan Kunci', '• Database Supabase PostgreSQL dikonfigurasikan hari ini.\n• Integrasi auth menggunakan JWT wajib selesai besok malam.\n• Next meeting: Daily standup via Discord besok jam 09.00 WIB.'],
]

autoTable(doc, {
  startY: y,
  head: [],
  body: minutesData,
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.5, cellPadding: 2, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY, fillColor: LIGHT },
    1: { cellWidth: CW - 38 },
  },
})

y = doc.lastAutoTable.finalY + 8

// Chat Logs Block
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...PRIMARY)
doc.text('B. Bukti Chat Koordinasi Teknis (Simulated Chat Logs – Discord)', ML, y)
y += 4.5

// Visual Chat Box Simulation
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 50, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 50, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(7.5)
doc.setTextColor(...SECONDARY)
doc.text('[18/05/2026 - 13:42]  Timotius Sibarani (Analyst) :', ML + 4, y + 6)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.text('Guys, ERD fix sudah saya upload ke folder design. Maria, silakan buat migration script-nya ya.', ML + 4, y + 10)

doc.setFont('helvetica', 'bold')
doc.setTextColor(...SECONDARY)
doc.text('[18/05/2026 - 13:45]  Maria Clara (Backend Dev) :', ML + 4, y + 17)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.text('Siap, Tim! Database Supabase PostgreSQL sudah online. Saya buat schema migration sesuai file ERD.', ML + 4, y + 21)

doc.setFont('helvetica', 'bold')
doc.setTextColor(...SECONDARY)
doc.text('[19/05/2026 - 15:10]  Sarah Angelina (QA Tester) :', ML + 4, y + 28)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.text('Edisyah, saya sudah test endpoint CRUD event via Postman. Semuanya pass, tinggal testing auth-nya.', ML + 4, y + 32)

doc.setFont('helvetica', 'bold')
doc.setTextColor(...PRIMARY)
doc.text('[19/05/2026 - 15:12]  Edisyah P. Waruwu (PM/Tech Lead) :', ML + 4, y + 39)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.text('Mantap sarah! Christian, backend integration sudah bisa dimulai di frontend. Jangan lupa git checkouts.', ML + 4, y + 43)

y += 56

// Lembar Pengesahan
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 35, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 35, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8.5)
doc.setTextColor(...PRIMARY)
doc.text('Diajukan Oleh,', ML + 15, y + 7)
doc.text('Disetujui Oleh,', ML + CW/2 + 15, y + 7)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7.5)
doc.setTextColor(...MID)
doc.text('Mahasiswa Informatika UNDIRA', ML + 15, y + 11)
doc.text('Dosen Pembimbing Kerja Praktek', ML + CW/2 + 15, y + 11)

// Signature lines
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.line(ML + 15, y + 24, ML + 75, y + 24)
doc.line(ML + CW/2 + 15, y + 24, ML + CW/2 + 75, y + 24)

doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...DARK)
doc.text('Edisyah Putra Waruwu', ML + 15, y + 28)
doc.text('(Nama Dosen Pembimbing)', ML + CW/2 + 15, y + 28)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.setTextColor(...MID)
doc.text('NIM: 411231179', ML + 15, y + 32)
doc.text('NIDN: _________________', ML + CW/2 + 15, y + 32)

// Save to disk
const outputPath = path.resolve('EdisyahPutraWaruwu_411231179_Tugas5_TimKomunikasi.pdf')
const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(outputPath, pdfBuffer)
console.log('✅ PDF Tugas 5 berhasil dibuat:', outputPath)
