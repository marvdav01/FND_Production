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
doc.setFontSize(22)
doc.text('PROPOSAL USULAN APLIKASI', W/2, 95, { align: 'center' })

doc.setFontSize(16)
doc.setTextColor(...ACCENT)
doc.text('FND Production', W/2, 107, { align: 'center' })

doc.setFontSize(12)
doc.setTextColor(...WHITE)
doc.text('Event Lighting Management System', W/2, 117, { align: 'center' })

// Divider line
doc.setDrawColor(...ACCENT)
doc.setLineWidth(0.8)
doc.line(ML+20, 123, W-MR-20, 123)

doc.setFontSize(10)
doc.setTextColor(...MID)
doc.text('Tugas Minggu 1  •  Kerja Praktek Informatika UNDIRA', W/2, 131, { align: 'center' })

// Info card
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, 140, CW, 60, 4, 4, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, 140, CW, 60, 4, 4, 'S')

const infoRows = [
  ['Nama Mahasiswa', 'Edisyah Putra Waruwu', '411231179'],
  ['Program Studi',  'Informatika – Universitas Dian Nusantara', ''],
  ['Mata Kuliah',    'Kerja Praktek (KP)', ''],
  ['Versi Dokumen',  'v1.0 (Final Proposal)', ''],
  ['Tanggal Dibuat', '21 Mei 2026', ''],
]

let iy = 152
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
doc.roundedRect(ML, 210, 55, 14, 3, 3, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('TUGAS MINGGU 1', ML+27.5, 218.5, { align: 'center' })

doc.setFillColor(...ACCENT)
doc.roundedRect(ML+60, 210, 55, 14, 3, 3, 'F')
doc.text('USULAN APLIKASI', ML+87.5, 218.5, { align: 'center' })

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
  doc.text('FND PRODUCTION – Proposal Usulan Aplikasi', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })

  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Tugas 1 Kerja Praktek  •  Informatika UNDIRA  •  2026', ML, H-6)
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
// PAGE 2 – USULAN & PENJELASAN APLIKASI (01 & 02)
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'Usulan & Penjelasan Aplikasi')

let y = 30
y = sectionTitle(doc, '01. USULKAN APLIKASI – IDE YANG DIUSULKAN', y)

// App Concept Introduction
doc.setFont('helvetica', 'bold')
doc.setFontSize(9.5)
doc.setTextColor(...PRIMARY)
doc.text('Nama Aplikasi: FND Production (Event Lighting Management System)', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const p1 = 'FND Production adalah sistem informasi manajemen operasional berbasis web yang dirancang khusus untuk mengelola seluruh ekosistem bisnis penyedia jasa event lighting professional. Perusahaan lighting seringkali mengalami kendala koordinasi lapangan yang tinggi dan pengelolaan inventaris yang rawan bentrok jadwal (double-booking). Aplikasi ini hadir sebagai solusi terintegrasi untuk menyatukan manajemen event, kru lapangan, peralatan, dan keuangan dalam satu platform digital yang efisien, transparan, dan dapat diakses oleh seluruh pemangku kepentingan (Admin, Client, dan Crew) sesuai peran masing-masing.'
const splitP1 = doc.splitTextToSize(p1, CW)
doc.text(splitP1, ML, y)
y += splitP1.length * 4.2 + 8

// Section 02
y = sectionTitle(doc, '02. JELASKAN APLIKASI – TUJUAN, PENGGUNA, DAN MASALAH', y)

// Tujuan
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('A. Tujuan Pengembangan', ML, y)
y += 5

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pTujuan = '1. Mengotomatiskan penjadwalan booking event dari klien hingga penjadwalan teknis lapangan.\n' +
                '2. Optimalisasi manajemen sumber daya: alat lighting dan kru teknisi tanpa bentrokan jadwal.\n' +
                '3. Meningkatkan transparansi keuangan: DP, pelunasan, piutang, dan laporan bulanan.\n' +
                '4. Menyediakan data real-time untuk pengambilan keputusan bisnis yang cepat dan akurat.'
const splitTujuan = doc.splitTextToSize(pTujuan, CW)
doc.text(splitTujuan, ML, y)
y += splitTujuan.length * 4.2 + 6

// Pengguna Utama
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('B. Pengguna Utama (Actors)', ML, y)
y += 5

autoTable(doc, {
  startY: y,
  head: [['Peran', 'Deskripsi Tanggung Jawab']],
  body: [
    ['Admin\n(Manajemen / Owner)', 'Menyetujui/menolak pesanan klien, alokasi alat & kru ke event, memantau keuangan, mencetak laporan, dan mengakses seluruh data sistem.'],
    ['Client\n(Penyelenggara / EO)', 'Melakukan booking event online (3-step wizard), memantau status pemesanan real-time, mengunggah bukti pembayaran, dan mengunduh Invoice/Kuitansi.'],
    ['Crew\n(Teknisi / Operator)', 'Melihat daftar tugas harian & jadwal mingguan, memperbarui status ketersediaan, dan melihat detail alat lighting yang harus dipasang di lokasi.'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: CW - 38 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 8

// Masalah yang Diselesaikan
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('C. Masalah yang Diselesaikan', ML, y)
y += 5

autoTable(doc, {
  startY: y,
  head: [['No', 'Masalah', 'Solusi dalam Sistem']],
  body: [
    ['1', 'Double-Booking Peralatan Lighting', 'Validasi stok dinamis: sistem mengecek ketersediaan alat per tanggal secara otomatis sebelum alokasi diizinkan.'],
    ['2', 'Bentrokan Jadwal Kru Lapangan', 'Pencocokan kalender kerja kru: sistem memblokir kru berstatus "on_job" agar tidak bisa dipilih di event lain.'],
    ['3', 'Ketidakjelasan Status Pembayaran', 'Pelacakan status lunas/belum_lunas terhubung langsung dengan status workflow event yang terstruktur.'],
    ['4', 'Tidak Ada Riwayat Audit', 'Tabel log riwayat status event otomatis mencatat setiap perubahan status beserta waktu dan pelakunya.'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: { top: 2.2, bottom: 2.2, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 8, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 55, fontStyle: 'bold', textColor: PRIMARY },
    2: { cellWidth: CW - 8 - 55 },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – ALUR APLIKASI (NARRATIVE FLOW)
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'Alur Aplikasi – Narrative Flow')

y = 30
y = sectionTitle(doc, '03. ALUR APLIKASI (NARRATIVE FLOW DARI INPUT KE OUTPUT)', y)

// Intro
doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...MID)
const pIntro = 'Alur operasional sistem FND Production dirancang secara komprehensif dari masukan awal hingga hasil keluaran yang dapat diaudit, terbagi dalam tiga fase utama berikut:'
const splitIntro = doc.splitTextToSize(pIntro, CW)
doc.text(splitIntro, ML, y)
y += splitIntro.length * 4.2 + 6

// ── TAHAP INPUT ──
doc.setFillColor(...SECONDARY)
doc.roundedRect(ML, y, CW, 8, 2, 2, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('TAHAP 1 – INPUT (Masukan Data)', ML + 5, y + 5.5)
y += 12

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pInput = '• Client: Melakukan registrasi, masuk ke portal, dan mengisi formulir pemesanan event: Nama Event, Tanggal, Lokasi, Jenis Paket/Kebutuhan Daya Lighting, dan Keterangan Tambahan.\n' +
               '• Admin (Pasca Survey): Memasukkan spesifikasi kebutuhan riil alat lighting ke sistem (jumlah unit Moving Head, Par LED, kabel, controller) setelah survei lokasi dilakukan.\n' +
               '• Admin (Penugasan): Memilih kru teknisi yang akan bertugas (Project Leader, Operator, Helper) dari daftar kru yang tersedia pada tanggal tersebut berdasarkan kalender aktif.\n' +
               '• Klien / Admin (Keuangan): Mengunggah bukti transfer bank untuk DP atau pelunasan; Admin memvalidasi penerimaan pembayaran dari mutasi kas perusahaan.'
const splitInput = doc.splitTextToSize(pInput, CW - 4)
doc.text(splitInput, ML + 4, y)
y += splitInput.length * 4.2 + 8

// ── TAHAP PROSES ──
doc.setFillColor(...PRIMARY)
doc.roundedRect(ML, y, CW, 8, 2, 2, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('TAHAP 2 – PROSES (Pengolahan & Validasi Bisnis)', ML + 5, y + 5.5)
y += 12

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pProses = '• Validasi Ketersediaan Aset (Stock Collision Guard): Saat Admin mengalokasikan alat, sistem otomatis menghitung: Sisa Stok = Total Alat - Sigma(Alat yang Sedang Digunakan pada Tanggal yang Sama). Jika stok tidak mencukupi, sistem memblokir alokasi dan menampilkan peringatan.\n' +
                '• Validasi Ketersediaan Kru (Calendar Conflict Checker): Sistem memeriksa tabel event_crew untuk mendeteksi apakah kru yang dipilih sudah terikat event aktif (status: survey/deal/running) pada tanggal yang sama. Kru dengan bentrokan jadwal dinonaktifkan dari daftar pilihan.\n' +
                '• State Machine Workflow: Sistem mengelola transisi status event secara ketat:\n' +
                '    Pending → Survey → Deal → Running → Selesai  (atau Cancel kapan saja)\n' +
                '    Setiap perubahan status menciptakan record baru di tabel log histori untuk audit trail.\n' +
                '• Kalkulasi Keuangan Otomatis: Sistem menghitung sisa piutang (Total Tagihan - DP yang sudah dibayar) dan memperbarui status pembayaran (lunas / belum_lunas / kurang_bayar) secara real-time.'
const splitProses = doc.splitTextToSize(pProses, CW - 4)
doc.text(splitProses, ML + 4, y)
y += splitProses.length * 4.2 + 8

// ── TAHAP OUTPUT ──
doc.setFillColor(...ACCENT)
doc.roundedRect(ML, y, CW, 8, 2, 2, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('TAHAP 3 – OUTPUT (Keluaran & Laporan)', ML + 5, y + 5.5)
y += 12

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...DARK)
const pOutput = '• Dashboard Analitik Real-time: Menampilkan 5 kartu metrik kunci (Total Event, Event Hari Ini, Total Pendapatan, % Ketersediaan Alat, % Kru Tersedia), grafik tren pendapatan bulanan 12 bulan, bagan distribusi status event, serta tabel event terbaru.\n' +
                '• 10 Dokumen Resmi & Laporan Fungsional: Menghasilkan dokumen digital berformat PDF atau Excel yang dapat diunduh, dicetak, dan dikirimkan sebagai bukti transaksi sah serta bahan evaluasi bisnis.\n' +
                '• Notifikasi Status: Klien menerima pembaruan status pesanan (dari pending hingga selesai) secara real-time melalui antarmuka portal pelanggan.'
const splitOutput = doc.splitTextToSize(pOutput, CW - 4)
doc.text(splitOutput, ML + 4, y)

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 – 10 LUARAN SISTEM & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(4, '10 Luaran Sistem & Pengesahan')

y = 30
y = sectionTitle(doc, '04. DAFTAR 10 LUARAN SISTEM (DAPAT DICETAK ATAU DIEXPORT)', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...MID)
doc.text('Sebagai bukti fungsionalitas sistem yang terukur, berikut adalah 10 dokumen, laporan, dan bukti transaksi yang dapat dicetak/diexport langsung dari sistem:', ML, y)
y += 6

const outputData = [
  ['No', 'Nama Dokumen / Luaran', 'Fungsi & Konten Utama', 'Format File', 'Frekuensi / Trigger'],
  ['1', 'Invoice Tagihan Event', 'Rincian biaya sewa, detail event, sisa pembayaran, status lunas.', 'PDF', 'Setiap Booking Deal'],
  ['2', 'Kuitansi Tanda Terima', 'Bukti pembayaran DP/pelunasan resmi dengan nomor tanda terima.', 'PDF', 'Setiap Pembayaran Lunas'],
  ['3', 'Surat Perintah Kerja (SPK)', 'Daftar kru, detail lokasi event, penanggung jawab, jadwal loading.', 'PDF', 'H-2 Sebelum Event'],
  ['4', 'Surat Jalan Pengiriman Alat', 'Daftar lighting yang dikeluarkan dari gudang untuk dikirim ke lokasi.', 'PDF', 'H-1 Sebelum Event'],
  ['5', 'Laporan Ketersediaan Stok', 'Status stok alat (total, terpakai, sisa, rusak) untuk manajer gudang.', 'PDF / Excel', 'Real-time / Bulanan'],
  ['6', 'Laporan Pendapatan Bulanan', 'Tren omset bulanan, grafik pendapatan kotor, piutang, rata-rata order.', 'PDF / Excel', 'Akhir Bulan'],
  ['7', 'Laporan Kinerja & Absen Kru', 'Rekapitulasi jumlah event yang ditangani kru untuk penggajian/insentif.', 'PDF / Excel', 'Bulanan / Periodik'],
  ['8', 'Proposal Penawaran Harga', 'Quotation estimasi biaya lighting setelah survey sebelum deal.', 'PDF', 'Setelah Selesai Survey'],
  ['9', 'Laporan Log Audit Status', 'Rekap riwayat log status event (pending->selesai) untuk transparansi.', 'PDF', 'Setiap Event Selesai'],
  ['10','Laporan Feedback Pelanggan', 'Ulasan bintang, kepuasan client, kritik & saran evaluasi layanan.', 'PDF / Excel', 'Pasca Event Selesai'],
]

autoTable(doc, {
  startY: y,
  head: [outputData[0]],
  body: outputData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.5, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
  columnStyles: {
    0: { cellWidth: 8, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 40, fontStyle: 'bold', textColor: PRIMARY },
    2: { cellWidth: CW - 8 - 40 - 18 - 25 },
    3: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: SECONDARY },
    4: { cellWidth: 25, halign: 'center', textColor: MID },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 12

// Section Lembar Pengesahan
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, y, CW, 38, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, y, CW, 38, 3, 3, 'S')

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
doc.line(ML + 15, y + 26, ML + 75, y + 26)
doc.line(ML + CW/2 + 15, y + 26, ML + CW/2 + 75, y + 26)

doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...DARK)
doc.text('Edisyah Putra Waruwu', ML + 15, y + 30)
doc.text('(Nama Dosen Pembimbing)', ML + CW/2 + 15, y + 30)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.setTextColor(...MID)
doc.text('NIM: 411231179', ML + 15, y + 34)
doc.text('NIDN: _________________', ML + CW/2 + 15, y + 34)

// Save to disk
const outputPath = path.resolve('EdisyahPutraWaruwu_411231179_Tugas1_FNDProduction.pdf')
const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(outputPath, pdfBuffer)
console.log('✅ PDF Tugas 1 berhasil dibuat:', outputPath)
