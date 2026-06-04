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
// PAGE 1 – COVER & EXECUTIVE SUMMARY & SCOPE
// ══════════════════════════════════════════════════════════════════════════
// Header Block
doc.setFillColor(...PRIMARY)
doc.rect(0, 0, W, 50, 'F')
doc.setFillColor(...SECONDARY)
doc.rect(0, 47, W, 4, 'F')
doc.setFillColor(...ACCENT)
doc.rect(0, 50, W, 3, 'F')

// Decorative Circle on header
doc.setFillColor(50, 90, 150)
doc.circle(185, 15, 20, 'F')

// Title & Subtitle inside Header
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(16)
doc.text('LAPORAN STATUS DAN EVALUASI KINERJA PROYEK', ML, 20)
doc.setFontSize(11)
doc.setTextColor(...ACCENT)
doc.text('FND Production – Event Lighting Management System', ML, 27)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...WHITE)
doc.setFontSize(8.5)
doc.text('Tugas Minggu 6  •  Kerja Praktek Informatika – UNDIRA', ML, 33)

// Profile Box (Compact)
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, 58, CW, 30, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.roundedRect(ML, 58, CW, 30, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8.5)
doc.setTextColor(...PRIMARY)
doc.text('INFORMASI MAHASISWA & PROYEK:', ML+5, 65)

doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.setFontSize(8)
doc.text('Nama Penyusun : Edisyah Putra Waruwu', ML+5, 71)
doc.text('NIM / Prodi     : 411231179 / Informatika', ML+5, 76)
doc.text('Universitas      : Universitas Dian Nusantara', ML+5, 81)

doc.text('Kelompok        : FND Production Group', ML + CW/2 + 10, 71)
doc.text('Mata Kuliah     : Kerja Praktek (KP)', ML + CW/2 + 10, 76)
doc.text('Versi / Tanggal : v1.0 / 21 Mei 2026', ML + CW/2 + 10, 81)

// Badges
doc.setFillColor(...PRIMARY)
doc.roundedRect(ML, 93, 40, 7, 2, 2, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(7.5)
doc.text('TUGAS MINGGU 6', ML+20, 97.8, { align: 'center' })

doc.setFillColor(...ACCENT)
doc.roundedRect(ML+44, 93, 45, 7, 2, 2, 'F')
doc.text('STATUS & EVALUASI PROYEK', ML+66.5, 97.8, { align: 'center' })

// Section 1: Executive Summary
let y = 107
y = sectionTitle(doc, '01. RINGKASAN EKSEKUTIF PROYEK (EXECUTIVE SUMMARY)', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pSummary = 'Proyek FND Production merupakan sistem manajemen persewaan peralatan lighting panggung profesional berbasis web yang bertujuan mengatasi masalah double-booking alat dan bentrokan jadwal kru lapangan. Laporan status evaluasi ini disusun pada akhir Minggu ke-3 fase konstruksi (Sprint 2). Kinerja proyek dievaluasi menggunakan metode Earned Value Management (EVM) untuk mengukur kepatuhan jadwal (SPI) dan efisiensi biaya (CPI). Berdasarkan analisis EVM saat ini, proyek berada dalam status "Cost-Under-Run" (di bawah anggaran/hemat) namun mengalami sedikit keterlambatan waktu "Behind-Schedule". Walaupun ada keterlambatan minor, seluruh arsitektur database relasional (8 entitas) dan API operasional utama telah berhasil diimplementasikan dengan sangat stabil.'
const splitSummary = doc.splitTextToSize(pSummary, CW)
doc.text(splitSummary, ML, y)
y += splitSummary.length * 4.0 + 5

// Section 2: Project Scope
y = sectionTitle(doc, '02. DESKRIPSI & RUANG LINGKUP PENGEMBANGAN PROYEK', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pScope = 'Ruang lingkup proyek FND Production hingga pertengahan Sprint 2 ini mencakup 4 pilar fungsional operasional utama:\n' +
               '1. Modul Client Portal: UI/UX modern berbasis Next.js untuk registrasi client dan form pengajuan (wizard) booking event secara online.\n' +
               '2. Modul Core Backend Service: API CRUD relasional, sistem autentikasi JWT, validasi constraints ketersediaan aset di gudang (Stock Collision Guard), dan validasi penugasan kru harian (Calendar Conflict Checker).\n' +
               '3. Modul Admin Control Panel: Manajemen pemesanan event (transisi 6 status), alokasi peralatan lighting per event, manajemen kru, pencatatan transaksi keuangan, dan rekapitulasi histori audit log.\n' +
               '4. Modul Laporan & Print Service: Pembuatan engine ekspor laporan ke format PDF dan Excel untuk 10 luaran operasional fungsional.'
const splitScope = doc.splitTextToSize(pScope, CW)
doc.text(splitScope, ML, y)

// Footer Strip Page 1
addPageFooter(1)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 – PROGRESS TABLE & EVM METRICS & INTERPRETATION
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'Tabel Progress & Evaluasi EVM')

y = 30
y = sectionTitle(doc, '03. TABEL PROGRES AKTIVITAS PENGEMBANGAN PROYEK', y)

const progressData = [
  ['Aktivitas Pengembangan / Fitur', 'Status Kerja', 'Persentase', 'Keterangan Fungsionalitas & Catatan Kinerja'],
  ['Inisiasi & Perancangan Relasi Database', 'Selesai', '100%', 'Schema 8 tabel PostgreSQL Supabase online & database constraints diimplementasikan.'],
  ['Modul Autentikasi & Authorization (JWT)', 'Selesai', '100%', 'Middleware verifikasi token backend dan role-based client-crew-admin berjalan stabil.'],
  ['UI Portal Wizard Booking & Admin Panel', 'Berjalan', '90%', 'Dashboard analitik, grafik Recharts, portal wizard event booking terintegrasi API.'],
  ['Stock Collision Guard & Crew Assignment', 'Berjalan', '85%', 'Algoritma mendeteksi double-booking alat dan bentrok kalender kru harian sukses.'],
  ['Ekspor PDF Laporan & UAT Pengujian', 'Berjalan', '50%', 'Mesin pembuat dokumen PDF & Excel online, lembar pengetesan UAT dalam penyusunan.'],
]

autoTable(doc, {
  startY: y,
  head: [progressData[0]],
  body: progressData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.2, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.8 },
  columnStyles: {
    0: { cellWidth: 46, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 20, fontStyle: 'bold', textColor: SECONDARY },
    2: { cellWidth: 16, halign: 'center' },
    3: { cellWidth: CW - 46 - 20 - 16 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 6

// Section 4: EVM Metrics Table
y = sectionTitle(doc, '04. PERHITUNGAN METRIK KINERJA PROYEK (EARNED VALUE MANAGEMENT)', y)

const evmData = [
  ['Variabel EVM', 'Metode / Rumus', 'Nilai (Rupiah / Indeks)', 'Status & Interpretasi Kinerja Teknis'],
  ['Planned Value (PV)', 'Rencana Anggaran Kerja', 'Rp 12.000.000', 'Anggaran terencana untuk pekerjaan terjadwal s.d Minggu ke-3.'],
  ['Earned Value (EV)', 'Bobot Fisik Selesai x PV', 'Rp 11.520.000', 'Nilai perolehan pekerjaan yang benar-benar terselesaikan (96%).'],
  ['Actual Cost (AC)', 'Pengeluaran Riil Tim', 'Rp 10.800.000', 'Biaya aktual yang telah dibelanjakan untuk kompensasi & infra cloud.'],
  ['Cost Variance (CV)', 'EV - AC', '+Rp 720.000', 'CV > 0 (Positif): Penggunaan anggaran hemat dari batas nominal riil.'],
  ['Schedule Variance (SV)', 'EV - PV', '-Rp 480.000', 'SV < 0 (Negatif): Sedikit terlambat dari milestone yang ditargetkan.'],
  ['Cost Perf. Index (CPI)', 'EV / AC', '1,067', 'CPI > 1,00: Penggunaan biaya sangat efisien (106,7% dari anggaran).'],
  ['Schedule Perf. Index (SPI)', 'EV / PV', '0,960', 'SPI < 1,00: Kecepatan kerja mencapai 96% dari kecepatan rencana.'],
]

autoTable(doc, {
  startY: y,
  head: [evmData[0]],
  body: evmData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.2, cellPadding: { top: 2, bottom: 2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.8 },
  columnStyles: {
    0: { cellWidth: 40, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 35 },
    2: { cellWidth: 26, fontStyle: 'bold', halign: 'right' },
    3: { cellWidth: CW - 40 - 35 - 26 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 6

// Section 5: EVM Interpretation
y = sectionTitle(doc, '05. ANALISIS KINERJA & INTERPRETASI SPI / CPI', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pInterpretation = '1. ANALISIS BIAYA (Cost Efficiency): Dengan nilai CPI sebesar 1,067 (> 1), proyek dinilai sangat efisien secara finansial (Cost-Under-Run). Dari setiap Rp1.000 yang dibelanjakan, tim menghasilkan nilai pekerjaan setara Rp1.067. Penghematan sebesar Rp720.000 (CV) diperoleh akibat optimasi penggunaan infrastruktur database Supabase Serverless yang murah serta kecepatan kerja developer backend.\n' +
                        '2. ANALISIS JADWAL (Schedule Compliance): Nilai SPI sebesar 0,960 (< 1) mengindikasikan proyek mengalami deviasi jadwal berupa keterlambatan minor sebesar 4% (SV = -Rp480.000). Hal ini dipicu oleh delay perancangan algoritma perhitungan stok relasional M:N pada hari ke-4 Sprint 2. Meskipun terlambat 4%, deviasi ini masih berada di batas toleransi deviasi proyek (< 5%) dan tidak berisiko menunda tanggal rilis produk utama.'
const splitInterpretation = doc.splitTextToSize(pInterpretation, CW)
doc.text(splitInterpretation, ML, y)

// Footer Strip Page 2
addPageFooter(2)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – PROGRESS VISUALIZATION (GANTT CHART) & RISKS & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'Visualisasi Progres & Evaluasi Akhir')

y = 30
y = sectionTitle(doc, '06. VISUALISASI PROGRES PROYEK (GANTT CHART TIMELINE)', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...MID)
doc.text('Visualisasi lini masa (timeline) pencapaian tugas harian dan bobot progres Sprint 2 FND Production:', ML, y)
y += 5

// --- Draw Gantt Chart Programmatically ---
const gX = ML + 42     // Start X of Gantt Area
const gW = CW - 42 - 5 // Width of Gantt Area
const gH = 34          // Total Height of Gantt Area
const rowH = 6         // Height of each row

// Draw Gantt Border / Background
doc.setFillColor(245, 248, 252)
doc.rect(ML, y, CW, gH, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.rect(ML, y, CW, gH, 'S')

// Draw Vertical Grid Lines & Week Labels
doc.setFont('helvetica', 'bold')
doc.setFontSize(7)
doc.setTextColor(...PRIMARY)
const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3 (Aktif)', 'Minggu 4']
for (let i = 0; i < 4; i++) {
  const wx = gX + (gW / 4) * i
  doc.line(wx, y, wx, y + gH)
  doc.text(weeks[i], wx + 2, y + 4.5)
}

const ganttRows = [
  { name: '1. Inisiasi & ERD DB', progress: 1.0, start: 0, end: 1.2 },
  { name: '2. Backend Auth & JWT', progress: 1.0, start: 0.8, end: 2.0 },
  { name: '3. UI Portal Booking', progress: 0.90, start: 1.5, end: 2.8 },
  { name: '4. Stock Guard Algo', progress: 0.85, start: 2.0, end: 3.2 },
  { name: '5. PDF Export & UAT', progress: 0.50, start: 2.5, end: 4.0 },
]

let ry = y + 7
for (const row of ganttRows) {
  // Draw Task Name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(...DARK)
  doc.text(row.name, ML + 3, ry + 4)

  // Draw task background bar
  const barStartX = gX + (gW / 4) * row.start
  const barWidth = (gW / 4) * (row.end - row.start)
  doc.setFillColor(220, 230, 245)
  doc.roundedRect(barStartX, ry + 1, barWidth, 3.8, 1, 1, 'F')

  // Draw task progress filled bar
  const fillWidth = barWidth * row.progress
  doc.setFillColor(...PRIMARY)
  doc.roundedRect(barStartX, ry + 1, fillWidth, 3.8, 1, 1, 'F')

  // Progress Label text
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...MID)
  doc.text(`${(row.progress * 100).toFixed(0)}%`, barStartX + barWidth + 1.5, ry + 4)

  ry += rowH
}

y += gH + 6

// Section 7: Risks and Mitigation
y = sectionTitle(doc, '07. KENDALA UTAMA, RENCANA TINDAK LANJUT & TINDAKAN MITIGASI', y)

const riskData = [
  ['No', 'Hambatan / Kendala Utama', 'Dampak Kinerja Proyek', 'Tindakan Mitigasi / Solusi Lanjut'],
  ['1', 'Relasi database equipment check lambat.', 'Keterlambatan runtime checking stock (behind schedule).', 'Backend Dev menambahkan indeks komposit pada field pencarian relasi M:N.'],
  ['2', 'Hydration mismatch Next.js di client booking.', 'Gagal render data dinamis di browser client.', 'Menambahkan flag suppressHydrationWarning di client component.'],
  ['3', 'Visual glitch grafik chart di mobile view.', 'Tampilan UI tidak responsif (UX terganggu).', 'Frontend Dev mengimplementasikan scrollable wrapper dan responsive-container.'],
]

autoTable(doc, {
  startY: y,
  head: [riskData[0]],
  body: riskData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7, cellPadding: { top: 2, bottom: 2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
  columnStyles: {
    0: { cellWidth: 6, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 44, fontStyle: 'bold', textColor: [180, 50, 50] },
    2: { cellWidth: 42 },
    3: { cellWidth: CW - 6 - 44 - 42 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 8

// Lembar Pengesahan
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 32, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 32, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...PRIMARY)
doc.text('Diajukan Oleh,', ML + 15, y + 6)
doc.text('Disetujui Oleh,', ML + CW/2 + 15, y + 6)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.setTextColor(...MID)
doc.text('Mahasiswa Informatika UNDIRA', ML + 15, y + 10)
doc.text('Dosen Pembimbing Kerja Praktek', ML + CW/2 + 15, y + 10)

// Signature lines
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.line(ML + 15, y + 21, ML + 75, y + 21)
doc.line(ML + CW/2 + 15, y + 21, ML + CW/2 + 75, y + 21)

doc.setFont('helvetica', 'bold')
doc.setFontSize(7.5)
doc.setTextColor(...DARK)
doc.text('Edisyah Putra Waruwu', ML + 15, y + 25)
doc.text('(Nama Dosen Pembimbing)', ML + CW/2 + 15, y + 25)

doc.setFont('helvetica', 'normal')
doc.setFontSize(6.5)
doc.setTextColor(...MID)
doc.text('NIM: 411231179', ML + 15, y + 29)
doc.text('NIDN: _________________', ML + CW/2 + 15, y + 29)

// Footer Strip Page 3
addPageFooter(3)

// ══════════════════════════════════════════════════════════════════════════
// FOOTER / CHROME HELPERS
// ══════════════════════════════════════════════════════════════════════════
function addPageChrome(pageNum, title) {
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, 20, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 20, W, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('FND PRODUCTION – Laporan Status & Evaluasi Proyek', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })
}

function addPageFooter(pageNum) {
  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Evaluasi & Status Kinerja  •  Informatika UNDIRA  •  2026', ML, H-6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(`Halaman ${pageNum} dari 3`, W-MR, H-6, { align: 'right' })
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(...PRIMARY)
  doc.rect(ML, y, CW, 9, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(ML, y, 3, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9)
  doc.text(text, ML+5, y+6.2)
  return y + 13
}

// Save to disk (Both names)
const path1 = path.resolve('LaporanStatus_FNDProduction_Minggu6.pdf')
const path2 = path.resolve('LaporanStatus_EdisyahPutraWaruwu_Minggu6.pdf')

const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(path1, pdfBuffer)
fs.writeFileSync(path2, pdfBuffer)

console.log('✅ PDF Laporan Kinerja Proyek Minggu 6 berhasil dibuat:')
console.log('👉', path1)
console.log('👉', path2)
