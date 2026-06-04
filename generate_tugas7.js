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
// Header Block
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
doc.text('LAPORAN INTEGRASI MODUL', W/2, 95, { align: 'center' })
doc.text('& PENGUJIAN AWAL SISTEM', W/2, 103, { align: 'center' })

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
doc.text('Tugas Minggu 7  •  Kerja Praktek Informatika UNDIRA', W/2, 134, { align: 'center' })

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
  ['Versi Dokumen',  'v1.0 (Integrasi & Testing)', ''],
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
doc.text('TUGAS MINGGU 7', ML+27.5, 220.5, { align: 'center' })

doc.setFillColor(...ACCENT)
doc.roundedRect(ML+60, 212, 55, 14, 3, 3, 'F')
doc.text('INTEGRASI MODUL', ML+87.5, 220.5, { align: 'center' })

// Footer strip Page 1
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
  doc.text('FND PRODUCTION – Integrasi Modul & Pengujian Awal', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })

  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Tugas 7 Kerja Praktek  •  Informatika UNDIRA  •  2026', ML, H-6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(`Halaman ${pageNum} dari 4`, W-MR, H-6, { align: 'right' })
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(...PRIMARY)
  doc.rect(ML, y, CW, 9, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(ML, y, 3, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9.5)
  doc.text(text, ML+6, y+6.2)
  return y + 13
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 – PENDAHULUAN & METODE UJI
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'I. Pendahuan & II. Metode Uji')

let y = 30
y = sectionTitle(doc, 'I. PENDAHULUAN – LATAR BELAKANG & DESKRIPSI MODUL', y)

doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...PRIMARY)
doc.text('A. Latar Belakang Integrasi Modul', ML, y)
y += 4.5

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pPendahuluan = 'Pengembangan sistem FND Production (Event Lighting Management System) berfokus pada integrasi data real-time untuk menyajikan fungsionalitas otomatisasi operasional yang handal. Untuk menguji kesiapan sistem secara utuh, dilakukan pengujian integrasi awal (Integration Testing) pada dua modul inti yang saling bertukar data dan memiliki dependensi tinggi:\n' +
                     '1. Modul Pemesanan Event (Event Booking Module): Bertanggung jawab menerima input pemesanan sewa lighting dari portal client, mencatat status awal (pending), tanggal event, lokasi, serta rincian item alat yang diajukan untuk disewa.\n' +
                     '2. Modul Validasi Ketersediaan Alat (Stock Collision Guard Module): Berfungsi sebagai filter keamanan stok di gudang untuk mencegah double-booking dengan menghitung sisa stok riil dinamis secara real-time pada rentang tanggal sewa yang sama.'
const splitPendahuluan = doc.splitTextToSize(pPendahuluan, CW)
doc.text(splitPendahuluan, ML, y)
y += splitPendahuluan.length * 4.0 + 6

doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...PRIMARY)
doc.text('B. Arsitektur Komunikasi Data & API Contract', ML, y)
y += 4.5

doc.setFont('helvetica', 'normal')
const pContract = 'Kedua modul berinteraksi secara asinkron melalui antarmuka REST API. Ketika client menekan tombol submit booking, Modul Pemesanan mengirimkan payload HTTP POST request ke endpoint backend. Controller backend memanggil Stock Collision Guard untuk melakukan validasi relasional silang sebelum merekam data ke database.\n' +
                  '• HTTP Endpoint: POST /api/bookings/validate-and-create\n' +
                  '• Payload Request: { client_id: UUID, event_date: "2026-05-25", items: [{ equipment_id: 102, quantity: 15 }] }\n' +
                  '• HTTP Response Sukses (200 OK): { status: "success", booking_id: 4091, message: "Booking allowed" }\n' +
                  '• HTTP Response Konflik (409 Conflict): { status: "failed", error: "Stock Collision Error", shortfall: 5 }'
const splitContract = doc.splitTextToSize(pContract, CW)
doc.text(splitContract, ML, y)
y += splitContract.length * 4.0 + 8

// Section II
y = sectionTitle(doc, 'II. METODE UJI – LINGKUNGAN UJI & SKENARIO SKEMA', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pMetode = 'Pengujian integrasi menggunakan metode Black-Box Testing pada level API dan UAT (User Acceptance Testing) simulasi alur data. Pengujian dijalankan pada lingkungan lokal terstandarisasi:\n' +
                '• Environment Pengujian: Node.js v20.10, Next.js v14 App Router, PostgreSQL Supabase DB, Postman Client v10.\n' +
                '• Skenario Uji 1 (Normal Flow): Menguji proses booking event dengan kuantitas alat lighting di bawah kapasitas stok aktual gudang. (Ekspektasi: HTTP 200 OK, record baru terbuat di database).\n' +
                '• Skenario Uji 2 (Exception Flow - Stock Collision): Menguji pengajuan booking event dengan kuantitas alat melebihi stok yang tersedia karena terpakai di event lain pada tanggal yang sama. (Ekspektasi: HTTP 409 Conflict, transaksi di-rollback).\n' +
                '• Skenario Uji 3 (Edge Flow - Date Overlap): Menguji validasi tanggal sewa yang melintasi tengah malam atau beririsan sebagian (overlapping). (Ekspektasi: Deteksi bentrok stok secara akurat).'
const splitMetode = doc.splitTextToSize(pMetode, CW)
doc.text(splitMetode, ML, y)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – HASIL PENGUJIAN & LOG BUG
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'III. Hasil Uji & IV. Log Bug perbaikan')

y = 30
y = sectionTitle(doc, 'III. HASIL PENGUJIAN – TABEL EKSEKUSI SKENARIO INTEGRASI', y)

const testResultsData = [
  ['No', 'Skenario Pengujian', 'Data Masukan (Input)', 'Hasil yang Diharapkan', 'Hasil Aktual Pengujian', 'Status'],
  ['1', 'Normal Flow: Booking aman.', 'Items: Moving Head 10 unit.\nStok Gudang: 30 unit.\nTanggal: 25 Mei 2026.', 'HTTP 200 OK.\nStatus event pending.\nStok terpotong temporer.', 'HTTP 200 OK.\nBooking terbuat.\nStok relasional berkurang.', 'PASS'],
  ['2', 'Exception: Double-Booking.', 'Items: Moving Head 25 unit.\nOverlapping Event Terpakai: 15.\nTanggal: 25 Mei 2026.', 'HTTP 409 Conflict.\nDetail: Stock Collision Error.\nShortfall: 10.', 'HTTP 409 Conflict.\n"Stock Collision Error"\nShortfall: 10. Rollback OK.', 'PASS'],
  ['3', 'Edge Case: Tanggal overlap.', 'Event A: 25 s.d 27 Mei.\nEvent B (Input): 26 s.d 28 Mei.\nQuantity: Melebihi batas.', 'HTTP 409 Conflict.\nBerhasil mendeteksi irisan tanggal (overlap).', 'HTTP 409 Conflict.\nDeteksi irisan tanggal sukses secara akurat.', 'PASS'],
  ['4', 'Validation: Invalid payload.', 'event_date: "invalid-date"\nItems: []', 'HTTP 400 Bad Request.\nError validation message.', 'HTTP 400 Bad Request.\n"Validation failed: Invalid date".', 'PASS'],
]

autoTable(doc, {
  startY: y,
  head: [testResultsData[0]],
  body: testResultsData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.2, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.8 },
  columnStyles: {
    0: { cellWidth: 7, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY },
    2: { cellWidth: 38 },
    3: { cellWidth: 38 },
    4: { cellWidth: CW - 7 - 38 - 38 - 38 - 15 },
    5: { cellWidth: 15, halign: 'center', fontStyle: 'bold', textColor: SECONDARY },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
  didParseCell(data) {
    if (data.section === 'body' && data.column.index === 5) {
      data.cell.styles.fillColor = [235, 250, 240]
      data.cell.styles.textColor = [46, 125, 50]
    }
  }
})

y = doc.lastAutoTable.finalY + 6

// Section IV: Log Bug & Solusi
y = sectionTitle(doc, 'IV. LOG BUG YANG DITEMUKAN & TINDAKAN SOLUSI PERBAIKAN', y)

const bugLogData = [
  ['ID Bug', 'Deskripsi Temuan Bug', 'Dampak Kinerja / Keamanan', 'Akar Masalah (Root Cause)', 'Solusi & Kode Perbaikan'],
  ['BUG-01', 'Overlapping Date Bypass:\nJika event B memesan pada rentang tanggal irisan dengan event A, validasi stok meleset.', 'Kritikal:\nTerjadi double-booking alat lighting di lapangan yang berisiko bentrok.', 'Logic query database hanya membandingkan start_date secara absolut (=), bukan irisan rentang.', 'Mengubah logic SQL overlap di database:\n(start_date <= target_end) AND (end_date >= target_start)'],
  ['BUG-02', 'Race Condition Concurrent Bookings:\nDua client melakukan checkout di milidetik yang sama melebihi stok.', 'Tinggi:\nStok lolos validasi ganda, mencatatkan minus stok di inventaris.', 'Validasi dan penulisan transaksi database berjalan paralel tanpa lock.', 'Menggunakan PostgreSQL Transaction isolation level SERIALIZABLE atau SELECT FOR UPDATE.'],
  ['BUG-03', 'Floating decimal on quantity:\nPayload input menerima kuantitas berkoma (ex: 2.5 unit).', 'Rendah:\nAngka inventarisasi alat menjadi tidak presisi.', 'Tipe data API validator kurang ketat, menggunakan float bukan integer.', 'Menambahkan middleware sanitizer dan schema check Joi/Zod (.integer().positive()).'],
]

autoTable(doc, {
  startY: y,
  head: [bugLogData[0]],
  body: bugLogData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 6.8, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
  columnStyles: {
    0: { cellWidth: 14, fontStyle: 'bold', textColor: [180, 50, 50] },
    1: { cellWidth: 32, fontStyle: 'bold', textColor: PRIMARY },
    2: { cellWidth: 26 },
    3: { cellWidth: 32 },
    4: { cellWidth: CW - 14 - 32 - 26 - 32 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 – ANALISIS & KESIMPULAN & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(4, 'V. Analisis & VI. Kesimpulan')

y = 30
y = sectionTitle(doc, 'V. ANALISIS INTEGRASI – EVALUASI DATA FLOW & ERROR HANDLING', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pAnalisis = '1. EVALUASI ALUR DATA (Data Flow Evaluation):\n' +
                  'Alur data dari form client Next.js berhasil terkirim secara utuh ke API backend Express. Data item yang dikirimkan berhasil diterjemahkan menjadi parameter query pencocokan relasi inventaris. Setelah dilakukan perbaikan pada Bug BUG-01 (Overlapping Date), penanganan tanggal sewa multipel kini berjalan sangat presisi, menjamin validitas data inventaris saat dibaca oleh Modul Pemesanan.\n\n' +
                  '2. EVALUASI ERROR HANDLING (Penanganan Kesalahan):\n' +
                  'Sistem penanganan error (*global error handler middleware*) backend mampu menangkap exception database dengan baik. Jika terjadi kegagalan stok (*Shortfall*), API backend tidak membiarkan server crash melainkan menolak transaksi secara elegan, melakukan rollback otomatis ke database, dan mengembalikan response JSON status terstruktur. Hal ini sangat meningkatkan kualitas UX (User Experience) client karena langsung mendapatkan notifikasi spesifik item apa yang bentrok beserta jumlah kekurangan unitnya.\n\n' +
                  '3. PERFORMANCE IMPACT (Dampak Kinerja):\n' +
                  'Proses validasi stok menambahkan beban query database rata-rata 45ms. Waktu tunggu ini dinilai sangat dapat diterima karena menjamin keamanan stok gudang (*Stock Security*). Untuk optimasi masa depan, tim merencanakan penggunaan caching Redis untuk data master spesifikasi alat lighting.'
const splitAnalisis = doc.splitTextToSize(pAnalisis, CW)
doc.text(splitAnalisis, ML, y)
y += splitAnalisis.length * 4.0 + 8

// Section VI
y = sectionTitle(doc, 'VI. KESIMPULAN – KELAYAKAN SISTEM & REKOMENDASI PENGEMBANGAN', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.2)
doc.setTextColor(...DARK)
const pKesimpulan = 'Berdasarkan hasil pengujian integrasi awal antara Modul Pemesanan Event dan Modul Validasi Ketersediaan Alat (Stock Collision Guard), dapat ditarik kesimpulan:\n' +
                    '1. Integrasi kedua modul dinilai BERHASIL dan LAYAK untuk dideploy ke lingkungan staging. Komunikasi API request-response dan validasi data flow berjalan lancar.\n' +
                    '2. Temuan bug kritikal (Date Overlap & Race Condition) berhasil diatasi secara tuntas di tingkat kode program (database transaction lock & logic SQL overlap), meningkatkan ketahanan sistem dari ancaman kegagalan data sewa ganda.\n' +
                    '3. Rekomendasi pengembangan selanjutnya adalah melanjutkan integrasi dengan Modul Penugasan Kru Lapangan (Crew Assignment) untuk memverifikasi ketersediaan jadwal kru dengan kalender kerja harian aktif.'
const splitKesimpulan = doc.splitTextToSize(pKesimpulan, CW)
doc.text(splitKesimpulan, ML, y)
y += splitKesimpulan.length * 4.0 + 10

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

// Save to disk (Both names)
const path1 = path.resolve('EdisyahPutraWaruwu_411231179_Tugas7_FNDProduction.pdf')
const path2 = path.resolve('Edisyah Putra Waruwu_411231179_Tugas7_FND Production.pdf')

const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(path1, pdfBuffer)
fs.writeFileSync(path2, pdfBuffer)

console.log('✅ PDF Pengujian Integrasi Modul Minggu 7 berhasil dibuat:')
console.log('👉', path1)
console.log('👉', path2)
