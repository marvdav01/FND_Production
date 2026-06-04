import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { jsPDF } = require('jspdf')
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

function addPageChrome(pageNum, title) {
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, 20, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 20, W, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('FND PRODUCTION – Laporan Implementasi Tools PM', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })

  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Tugas 2  •  Kerja Praktek Informatika UNDIRA  •  2026', ML, H-6)
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
// PAGE 1 – LAPORAN REFLEKSI PENGGUNAAN TOOLS (1 PAGE MAX)
// ══════════════════════════════════════════════════════════════════════════
addPageChrome(1, 'Laporan Refleksi & Analisis')

let y = 30
y = sectionTitle(doc, 'LAPORAN REFLEKSI: IMPLEMENTASI LINIMASA & KANBAN TRELLO', y)

// Metadata Info
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 25, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 25, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8.5)
doc.setTextColor(...PRIMARY)
doc.text('Nama Mahasiswa', ML + 6, y + 7)
doc.text('NIM / Prodi', ML + 6, y + 13)
doc.text('Proyek / Sistem', ML + 6, y + 19)

doc.setFont('helvetica', 'normal')
doc.setTextColor(...DARK)
doc.text(':  Edisyah Putra Waruwu', ML + 40, y + 7)
doc.text(':  411231179  /  Informatika', ML + 40, y + 13)
doc.text(':  FND Production (Event Lighting Management System)', ML + 40, y + 19)

y += 33

// Reflection Text Section
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.setTextColor(...PRIMARY)
doc.text('1. Latar Belakang Transisi Digital', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const p1 = 'FND Production sebelumnya mengelola perencanaan proyek secara manual atau semi-digital (berkas PDF statis). Transisi rencana proyek ke dalam alat manajemen digital (Trello) bertujuan untuk meningkatkan efisiensi kolaborasi tim secara dinamis, mengelola alur kerja harian (WIP - Work in Progress) secara visual, serta memantau lini masa proyek secara real-time menggunakan fitur Trello Timeline.'
const splitP1 = doc.splitTextToSize(p1, CW)
doc.text(splitP1, ML, y)
y += splitP1.length * 4.2 + 2

// Trello Kanban Analysis
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.setTextColor(...PRIMARY)
doc.text('2. Trello Kanban Board – Visualisasi Alur Kerja & PIC', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
const p2 = '• Kelebihan: Trello sangat unggul dalam visualisasi alur kerja harian menggunakan kartu. Pembagian PIC (PM, BE, FE, UI, QA) tercermin sangat jelas di setiap kartu tugas, lengkap dengan label prioritas, tanggal mulai/tenggat, dan checklist sub-tugas. Kolaborasi menjadi sangat mudah bagi pengembang junior.\n• Limitasi: Trello secara bawaan tidak mendukung pelacakan jalur kritis (critical path) yang ketat secara otomatis. Hubungan dependensi antar tugas WBS harus dikelola secara manual dengan menautkan kartu prasyarat (attachments).'
const splitP2 = doc.splitTextToSize(p2, CW)
doc.text(splitP2, ML, y)
y += splitP2.length * 4.2 + 2

// Trello Timeline Analysis
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.setTextColor(...PRIMARY)
doc.text('3. Trello Timeline View – Pemantauan Jadwal Kerja & Sprint', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
const p3 = '• Kelebihan: Fitur Trello Timeline (Power-Up) memberikan visualisasi linimasa proyek 12 minggu secara komprehensif. Pengguna dapat melihat distribusi tugas per sprint, durasi pengerjaan, serta mendeteksi potensi overlap waktu secara langsung. Tampilan ini sangat bersahabat bagi tim kreatif FND Production.\n• Limitasi: Pengeditan jadwal massal kurang fleksibel dibandingkan software penjadwalan kelas berat. Perubahan jadwal pada satu kartu tidak otomatis menggeser kartu-kartu lain yang bergantung padanya.'
const splitP3 = doc.splitTextToSize(p3, CW)
doc.text(splitP3, ML, y)
y += splitP3.length * 4.2 + 2

// Conclusion
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.setTextColor(...PRIMARY)
doc.text('4. Rekomendasi Solusi Penerapan Optimal', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
const p4 = 'Untuk memaksimalkan penggunaan Trello di FND Production, tim direkomendasikan untuk mengintegrasikan Power-Up Timeline secara kontinu untuk manajerial, menggunakan checklist terstruktur pada setiap kartu tugas untuk operasional, serta memanfaatkan Trello Butler untuk otomatisasi pemindahan kartu. Sesi sprint review mingguan wajib dilakukan untuk menjaga sinkronisasi data.'
const splitP4 = doc.splitTextToSize(p4, CW)
doc.text(splitP4, ML, y)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 – SCREENSHOTS (KANBAN & TIMELINE)
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'Tangkapan Layar Implementasi')

y = 30
y = sectionTitle(doc, 'TANGKAPAN LAYAR HASIL IMPLEMENTASI DIGITAL', y)

// Load screenshots
const kanbanPath = path.resolve('screenshot_kanban.png')
const timelinePath = path.resolve('screenshot_timeline.png')
const detailsPath = path.resolve('screenshot_details.png')

const kBase64 = fs.readFileSync(kanbanPath, { encoding: 'base64' })
const tBase64 = fs.readFileSync(timelinePath, { encoding: 'base64' })
const dBase64 = fs.readFileSync(detailsPath, { encoding: 'base64' })

const kUri = 'data:image/png;base64,' + kBase64
const tUri = 'data:image/png;base64,' + tBase64
const dUri = 'data:image/png;base64,' + dBase64

// 1. Kanban Board Screenshot
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('Tangkapan Layar A: Trello Board (Kanban View)', ML, y)
y += 4

doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.rect(ML, y, CW, 85, 'S')
doc.addImage(kUri, 'PNG', ML + 0.5, y + 0.5, CW - 1, 84)
y += 89

// 2. Timeline Screenshot
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('Tangkapan Layar B: Trello Timeline (Power-Up / Gantt View)', ML, y)
y += 4

doc.rect(ML, y, CW, 85, 'S')
doc.addImage(tUri, 'PNG', ML + 0.5, y + 0.5, CW - 1, 84)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – SCREENSHOT (TASK DETAILS) & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'Detail Tugas & Dependensi')

y = 30
y = sectionTitle(doc, 'DETAIL TUGAS INTERAKTIF & PELACAKAN DEPENDENSI', y)

// 3. Task Details Screenshot
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('Tangkapan Layar C: Detail Tugas Interaktif & Dependensi (Modal View)', ML, y)
y += 4

doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.rect(ML, y, CW, 88, 'S')
doc.addImage(dUri, 'PNG', ML + 0.5, y + 0.5, CW - 1, 87)
y += 93

// Analysis of Dependencies Table
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...PRIMARY)
doc.text('Manajemen Dependensi WBS dalam Kartu Trello:', ML, y)
y += 4

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)
doc.setTextColor(...DARK)

const depText = '• Kartu Desain Wireframe Figma (2.2) memiliki tautan prasyarat (attachment link) ke kartu Arsitektur & ERD (2.1).\n• Kartu Pengembangan Database Schema (3.1) dan REST API (3.2) memiliki checklist approval desain dari Stakeholder (2.3) sebelum pengerjaan.\n• Kartu Integrasi Frontend (4.4) bergantung penuh pada status selesai kartu REST API Backend (3.2 & 3.3) yang ditautkan di dalamnya.\n• Kartu Pengujian Unit & Integration (5.1) dilakukan segera setelah seluruh item checklist pada kartu integrasi (4.4) dicentang.'
const splitDep = doc.splitTextToSize(depText, CW)
doc.text(splitDep, ML, y)
y += splitDep.length * 4.2 + 8

// Signature Block
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 35, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 35, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8.5)
doc.setTextColor(...PRIMARY)
doc.text('Disusun Oleh,', ML + 15, y + 7)
doc.text('Divalidasi Oleh,', ML + CW/2 + 15, y + 7)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7.5)
doc.setTextColor(...MID)
doc.text('Mahasiswa Informatika UNDIRA', ML + 15, y + 11)
doc.text('Dosen Pembimbing Kerja Praktek', ML + CW/2 + 15, y + 11)

doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.line(ML + 15, y + 25, ML + 75, y + 25)
doc.line(ML + CW/2 + 15, y + 25, ML + CW/2 + 75, y + 25)

doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...DARK)
doc.text('Edisyah Putra Waruwu', ML + 15, y + 29)
doc.text('(Nama Dosen Pembimbing)', ML + CW/2 + 15, y + 29)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.setTextColor(...MID)
doc.text('NIM: 411231179', ML + 15, y + 33)
doc.text('NIDN: _________________', ML + CW/2 + 15, y + 33)

// Save
const outputPath = path.resolve('Laporan_Implementasi_PM_Digital.pdf')
const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(outputPath, pdfBuffer)
console.log('✅ PDF Laporan Implementasi PM Digital berhasil dibuat:', outputPath)
