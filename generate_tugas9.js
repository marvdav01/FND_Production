import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { jsPDF } = require('jspdf')
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable')
const fs = require('fs')
const path = require('path')

// ═══════════════════════════════════════════════════════════════
// LANDSCAPE A4 — 297 x 210 mm
// ═══════════════════════════════════════════════════════════════
const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
const W = 297
const H = 210
const ML = 12
const MR = 12
const CW = W - ML - MR

// ── Color Palette ────────────────────────────────────────────
const PRIMARY    = [18, 42, 80]
const PRIMARY_L  = [30, 58, 100]
const SECONDARY  = [42, 110, 180]
const ACCENT     = [241, 168, 40]
const ACCENT2    = [80, 200, 140]
const LIGHT      = [232, 240, 252]
const WHITE      = [255, 255, 255]
const DARK       = [28, 28, 34]
const MID        = [100, 112, 130]
const BORDER     = [190, 205, 225]
const RED        = [220, 60, 60]
const GREEN      = [46, 160, 90]
const BLUE_L     = [100, 160, 230]
const PURPLE     = [130, 80, 200]
const TEAL       = [30, 170, 170]

let slideNum = 0

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function slideHeader(title, subtitle) {
  slideNum++
  // Top bar
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, 24, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 24, W, 1.5, 'F')

  // Slide number badge
  doc.setFillColor(...ACCENT)
  doc.roundedRect(ML, 5, 18, 13, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(11)
  doc.text(`${slideNum}`, ML + 9, 13.5, { align: 'center' })

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(15)
  doc.text(title, ML + 22, 13)
  if (subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(180, 200, 230)
    doc.text(subtitle, ML + 22, 19)
  }

  // Logo text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...ACCENT)
  doc.text('FND PRODUCTION', W - MR, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 170, 200)
  doc.setFontSize(7)
  doc.text('Event Lighting Management System', W - MR, 19, { align: 'right' })

  // Bottom bar
  doc.setFillColor(...PRIMARY)
  doc.rect(0, H - 10, W, 10, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(150, 170, 200)
  doc.setFontSize(6.5)
  doc.text('Kerja Praktek Informatika — Universitas Dian Nusantara (UNDIRA) — 2026', ML, H - 4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...ACCENT)
  doc.text(`Slide ${slideNum} / 15`, W - MR, H - 4, { align: 'right' })
}

function drawBox(x, y, w, h, fillColor, borderColor, radius) {
  doc.setFillColor(...fillColor)
  doc.roundedRect(x, y, w, h, radius || 3, radius || 3, 'F')
  if (borderColor) {
    doc.setDrawColor(...borderColor)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, w, h, radius || 3, radius || 3, 'S')
  }
}

function drawArrow(x1, y1, x2, y2, color) {
  doc.setDrawColor(...(color || SECONDARY))
  doc.setLineWidth(0.6)
  doc.line(x1, y1, x2, y2)
  // arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLen = 2.5
  doc.setFillColor(...(color || SECONDARY))
  doc.triangle(
    x2, y2,
    x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4),
    x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4),
    'F'
  )
}

function drawIconCircle(x, y, r, color, letter) {
  doc.setFillColor(...color)
  doc.circle(x, y, r, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(r * 2)
  doc.text(letter, x, y + r * 0.35, { align: 'center' })
}

function narrationBox(text, durasi) {
  const boxY = H - 46
  const boxH = 33
  drawBox(ML, boxY, CW, boxH, [245, 248, 255], BORDER)
  doc.setFillColor(...PRIMARY)
  doc.roundedRect(ML + 2, boxY + 2, 30, 6, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(6)
  doc.text('SCRIPT NARASI', ML + 17, boxY + 6, { align: 'center' })

  doc.setFillColor(...ACCENT)
  doc.roundedRect(ML + 34, boxY + 2, 20, 6, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(6)
  doc.text(durasi, ML + 44, boxY + 6, { align: 'center' })

  doc.setFont('helvetica', 'italic')
  doc.setTextColor(60, 60, 80)
  doc.setFontSize(7.5)
  const lines = doc.splitTextToSize(`"${text}"`, CW - 8)
  doc.text(lines.slice(0, 5), ML + 4, boxY + 13)
}

function sectionLabel(x, y, text, color) {
  doc.setFillColor(...(color || SECONDARY))
  doc.roundedRect(x, y, text.length * 2.2 + 6, 7, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7)
  doc.text(text, x + 3, y + 5)
  return y + 10
}

function bulletPoint(x, y, text, options) {
  const col = options?.color || DARK
  const sz = options?.size || 8
  doc.setFillColor(...(options?.bulletColor || ACCENT))
  doc.circle(x + 1.5, y - 1, 1, 'F')
  doc.setFont('helvetica', options?.bold ? 'bold' : 'normal')
  doc.setTextColor(...col)
  doc.setFontSize(sz)
  doc.text(text, x + 5, y)
  return y + (options?.gap || 5.5)
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 1 — COVER / TITLE SLIDE
// ═══════════════════════════════════════════════════════════════
function slide1_Cover() {
  // Full background
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, H, 'F')
  
  // Decorative gradient stripes
  doc.setFillColor(25, 50, 90)
  doc.rect(0, 0, W, 60, 'F')
  doc.setFillColor(20, 45, 85)
  doc.rect(0, 0, W, 30, 'F')
  
  // Decorative circles
  doc.setFillColor(35, 65, 110)
  doc.circle(260, 30, 40, 'F')
  doc.setFillColor(30, 55, 100)
  doc.circle(270, 60, 25, 'F')
  doc.setFillColor(25, 50, 95)
  doc.circle(30, 20, 18, 'F')
  doc.setFillColor(28, 52, 96)
  doc.circle(50, 180, 35, 'F')

  // Accent line
  doc.setFillColor(...ACCENT)
  doc.rect(ML, 75, 100, 2, 'F')

  // Title text
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(28)
  doc.text('FND PRODUCTION', ML, 95)
  doc.setFontSize(18)
  doc.setTextColor(...ACCENT)
  doc.text('Event Lighting Management System', ML, 106)

  // Subtitle
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 200, 230)
  doc.setFontSize(12)
  doc.text('Draft Final Presentasi Proyek — Kerja Praktek', ML, 118)

  // Info card
  drawBox(ML, 130, 170, 50, [30, 55, 100], [50, 80, 130])
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 200, 230)
  
  const infoLines = [
    ['Disusun oleh', 'Edisyah Putra Waruwu'],
    ['NIM', '411231179'],
    ['Program Studi', 'Informatika — Universitas Dian Nusantara'],
    ['Mata Kuliah', 'Kerja Praktek (KP)'],
  ]
  let iy = 142
  for (const [label, val] of infoLines) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 170, 200)
    doc.text(label, ML + 6, iy)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.text(`:   ${val}`, ML + 45, iy)
    iy += 9
  }

  // Badges
  doc.setFillColor(...ACCENT)
  doc.roundedRect(ML, 188, 40, 10, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(7)
  doc.text('TUGAS MINGGU 9', ML + 20, 194.5, { align: 'center' })

  doc.setFillColor(...ACCENT2)
  doc.roundedRect(ML + 44, 188, 45, 10, 3, 3, 'F')
  doc.setTextColor(...PRIMARY)
  doc.text('PRESENTASI PROYEK', ML + 66.5, 194.5, { align: 'center' })

  // Right side big icon placeholder
  doc.setFillColor(35, 65, 115)
  doc.roundedRect(200, 80, 85, 85, 6, 6, 'F')
  doc.setDrawColor(50, 85, 140)
  doc.setLineWidth(0.4)
  doc.roundedRect(200, 80, 85, 85, 6, 6, 'S')

  // Spotlight icon
  doc.setFillColor(...ACCENT)
  doc.ellipse(242, 108, 16, 16, 'F')
  doc.setFillColor(35, 65, 115)
  doc.ellipse(242, 106, 12, 12, 'F')
  doc.setFillColor(...ACCENT)
  doc.ellipse(242, 105, 8, 8, 'F')
  
  // Light beams
  doc.setFillColor(241, 168, 40, 0.3)
  doc.triangle(230, 116, 210, 155, 218, 155, 'F')
  doc.triangle(242, 118, 234, 155, 250, 155, 'F')
  doc.triangle(254, 116, 266, 155, 274, 155, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(9)
  doc.text('Web Fullstack App', 242, 145, { align: 'center' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 170, 200)
  doc.text('Next.js • Node.js • PostgreSQL', 242, 152, { align: 'center' })

  slideNum = 1
  // Footer
  doc.setFillColor(15, 35, 70)
  doc.rect(0, H - 10, W, 10, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(120, 140, 170)
  doc.setFontSize(6.5)
  doc.text('FND Production  •  Kerja Praktek Informatika  •  UNDIRA  •  2026', W / 2, H - 4, { align: 'center' })
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2 — LATAR BELAKANG MASALAH
// ═══════════════════════════════════════════════════════════════
function slide2_LatarBelakang() {
  doc.addPage('a4', 'landscape')
  slideHeader('LATAR BELAKANG MASALAH', 'Identifikasi masalah operasional FND Production')

  const startY = 32
  const colW = 62
  const gap = 7

  const problems = [
    { icon: '📋', color: RED, title: 'Booking Manual', desc: 'Proses pemesanan alat lighting masih manual via WhatsApp. Rentan salah koordinasi & tidak terdokumentasi.', impact: 'Efisiensi ↓ 60%' },
    { icon: '⚠️', color: [220, 140, 30], title: 'Double-Booking Alat', desc: 'Tidak ada validasi stok real-time. Sering terjadi bentrok alokasi peralatan di tanggal yang sama.', impact: 'Kerugian Operasional' },
    { icon: '👥', color: PURPLE, title: 'Bentrok Jadwal Kru', desc: 'Penugasan kru dilakukan tanpa cek kalender. Kru sering ditugaskan ke 2 lokasi sekaligus.', impact: 'SDM Tidak Optimal' },
    { icon: '💰', color: TEAL, title: 'Keuangan Tidak Rapi', desc: 'Pelacakan DP, pelunasan, dan piutang klien tidak terstruktur dan sulit diaudit.', impact: 'Arus Kas Terganggu' },
  ]

  problems.forEach((p, i) => {
    const x = ML + i * (colW + gap)
    const y = startY

    // Card
    drawBox(x, y, colW, 90, WHITE, BORDER)
    
    // Top color strip
    doc.setFillColor(...p.color)
    doc.rect(x, y, colW, 4, 'F')

    // Number circle
    drawIconCircle(x + 10, y + 16, 6, p.color, String(i + 1))
    
    // Title
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(10)
    doc.text(p.title, x + 20, y + 18)

    // Description
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(7.5)
    const descLines = doc.splitTextToSize(p.desc, colW - 10)
    doc.text(descLines, x + 5, y + 30)

    // Impact badge
    doc.setFillColor(...p.color)
    doc.roundedRect(x + 5, y + 72, colW - 10, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(7)
    doc.text(p.impact, x + colW / 2, y + 78.5, { align: 'center' })
  })

  // Stats summary box
  drawBox(ML, 126, CW, 16, LIGHT, BORDER)
  const stats = [
    { label: 'Peralatan Dikelola', value: '520+', color: SECONDARY },
    { label: 'Crew Member', value: '35+', color: ACCENT2 },
    { label: 'Events / Tahun', value: '128+', color: ACCENT },
    { label: 'Client Terdaftar', value: '50+', color: PURPLE },
  ]
  stats.forEach((s, i) => {
    const sx = ML + 8 + i * (CW / 4)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...s.color)
    doc.setFontSize(14)
    doc.text(s.value, sx, 136)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(7)
    doc.text(s.label, sx, 140)
  })

  narrationBox(
    'Latar belakang proyek ini bermula dari kendala operasional FND Production yang masih mengelola booking secara manual melalui WhatsApp. Hal ini menyebabkan double-booking alat, bentrok jadwal kru, dan arus keuangan yang tidak transparan. Dengan 520 lebih peralatan dan 35 anggota kru, dibutuhkan sistem digital terintegrasi.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3 — SOLUSI YANG DITAWARKAN
// ═══════════════════════════════════════════════════════════════
function slide3_Solusi() {
  doc.addPage('a4', 'landscape')
  slideHeader('SOLUSI YANG DITAWARKAN', 'Transformasi digital dari proses manual ke sistem terintegrasi')

  // Before section
  const bx = ML
  const by = 34
  drawBox(bx, by, 128, 80, [255, 245, 245], [220, 180, 180])
  sectionLabel(bx + 3, by + 3, 'SEBELUM (Manual)', RED)
  
  const befores = [
    'Booking via WhatsApp — tidak terdokumentasi',
    'Cek stok manual di buku catatan gudang',
    'Jadwal kru di kertas / spreadsheet',
    'Piutang klien sulit dilacak',
    'Tidak ada audit trail perubahan status',
  ]
  let by2 = by + 22
  befores.forEach(b => {
    doc.setFillColor(...RED)
    doc.circle(bx + 7, by2 - 1, 1.2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(130, 40, 40)
    doc.setFontSize(8)
    doc.text(b, bx + 11, by2)
    by2 += 8
  })

  // Arrow  
  drawArrow(ML + 131, 74, ML + 139, 74, ACCENT)

  // After section
  const ax = ML + 143
  drawBox(ax, by, 128, 80, [240, 255, 245], [160, 220, 180])
  sectionLabel(ax + 3, by + 3, 'SESUDAH (Digital)', GREEN)
  
  const afters = [
    'Portal booking online + validasi otomatis',
    'Stock Collision Guard — cek stok real-time',
    'Calendar Conflict Checker — kru otomatis',
    'Payment tracking terintegrasi per event',
    'Audit trail otomatis di setiap perubahan',
  ]
  let ay2 = by + 22
  afters.forEach(a => {
    doc.setFillColor(...GREEN)
    doc.circle(ax + 7, ay2 - 1, 1.2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 100, 50)
    doc.setFontSize(8)
    doc.text(a, ax + 11, ay2)
    ay2 += 8
  })

  // Features bar
  const fy = 120
  drawBox(ML, fy, CW, 22, LIGHT, BORDER)
  const features = [
    { label: 'Booking Online', icon: 'B', color: SECONDARY },
    { label: 'Validasi Stok', icon: 'S', color: GREEN },
    { label: 'Crew Assignment', icon: 'C', color: PURPLE },
    { label: 'Dashboard Admin', icon: 'D', color: ACCENT },
    { label: 'Payment Track', icon: 'P', color: TEAL },
  ]
  features.forEach((f, i) => {
    const fx2 = ML + 8 + i * (CW / 5)
    drawIconCircle(fx2, fy + 11, 5, f.color, f.icon)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(7.5)
    doc.text(f.label, fx2 + 9, fy + 13)
  })

  narrationBox(
    'Sebagai solusi, kami mengembangkan sistem informasi manajemen berbasis web yang mendigitalisasi seluruh proses. Sistem ini memperkenalkan Stock Collision Guard untuk mencegah bentrok stok, Calendar Conflict Checker untuk validasi jadwal kru, serta payment tracking terintegrasi.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4 — TUJUAN & MANFAAT
// ═══════════════════════════════════════════════════════════════
function slide4_Tujuan() {
  doc.addPage('a4', 'landscape')
  slideHeader('TUJUAN & MANFAAT PROYEK', 'Target pencapaian dan value proposition')

  // Tujuan section
  const tx = ML
  const ty = 34
  drawBox(tx, ty, 130, 100, WHITE, BORDER)
  doc.setFillColor(...PRIMARY)
  doc.rect(tx, ty, 130, 9, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(tx, ty, 3, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('🎯  TUJUAN PROYEK', tx + 6, ty + 6.5)

  const tujuans = [
    { num: '01', title: 'Digitalisasi Operasional', desc: 'Transformasi proses booking manual menjadi sistem online terintegrasi.' },
    { num: '02', title: 'Automasi Validasi Stok', desc: 'Mencegah double-booking dengan validasi ketersediaan alat real-time.' },
    { num: '03', title: 'Efisiensi Manajemen Kru', desc: 'Otomatisasi penugasan dan pengecekan ketersediaan kru lapangan.' },
    { num: '04', title: 'Transparansi Keuangan', desc: 'Tracking pembayaran DP, pelunasan, dan piutang secara terstruktur.' },
  ]

  let tyy = ty + 18
  tujuans.forEach(t => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...ACCENT)
    doc.setFontSize(12)
    doc.text(t.num, tx + 6, tyy + 2)
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(9)
    doc.text(t.title, tx + 18, tyy)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(7.5)
    doc.text(t.desc, tx + 18, tyy + 5.5)
    tyy += 18
  })

  // Manfaat section
  const mx = ML + 140
  drawBox(mx, ty, 130, 100, WHITE, BORDER)
  doc.setFillColor(...ACCENT2)
  doc.rect(mx, ty, 130, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(10)
  doc.text('✅  MANFAAT SISTEM', mx + 6, ty + 6.5)

  const manfaats = [
    { pct: '80%', title: 'Efisiensi Waktu Booking', desc: 'Dari hitungan jam menjadi hitungan menit.' },
    { pct: '0%', title: 'Tingkat Double-Booking', desc: 'Eliminasi total bentrok stok peralatan.' },
    { pct: '100%', title: 'Visibility Penuh', desc: 'Semua stakeholder dapat memantau status secara real-time.' },
    { pct: '10x', title: 'Skalabilitas', desc: 'Siap menangani pertumbuhan event hingga ribuan.' },
  ]

  let myy = ty + 18
  manfaats.forEach(m => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GREEN)
    doc.setFontSize(12)
    doc.text(m.pct, mx + 6, myy + 2)
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(9)
    doc.text(m.title, mx + 22, myy)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(7.5)
    doc.text(m.desc, mx + 22, myy + 5.5)
    myy += 18
  })

  narrationBox(
    'Tujuan utama proyek ini adalah membangun aplikasi operasional yang handal. Manfaatnya, tim admin dapat lebih efisien mengelola event, meminimalisir kesalahan manusia, dan memberikan transparansi data stok secara real-time. Proses booking yang sebelumnya memakan waktu berjam-jam kini dapat diselesaikan dalam hitungan menit.',
    '0.5 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5 — RUANG LINGKUP / SCOPE
// ═══════════════════════════════════════════════════════════════
function slide5_Scope() {
  doc.addPage('a4', 'landscape')
  slideHeader('RUANG LINGKUP SISTEM', 'Modul dan pengguna yang dicakup')

  // 3 User Role Cards
  const roles = [
    { 
      name: 'ADMIN', color: SECONDARY, letter: 'A',
      desc: 'System & Operations Manager',
      features: ['Dashboard Analytics', 'Kelola Semua Event', 'Crew Assignment', 'Equipment Management', 'Finance & Payment']
    },
    { 
      name: 'CLIENT', color: ACCENT, letter: 'C',
      desc: 'Event Organizer / Planner',
      features: ['Booking Online', 'Track Status Event', 'Upload Bukti Bayar', 'Lihat Riwayat Event', 'Profil Manajemen']
    },
    { 
      name: 'CREW', color: ACCENT2, letter: 'K',
      desc: 'Teknisi / Operator Lapangan',
      features: ["Today's Assignment", 'Jadwal Mingguan', 'Toggle Availability', 'Detail Spesifikasi Alat', 'Profil & Keahlian']
    },
  ]

  roles.forEach((r, i) => {
    const rx = ML + i * 92
    const ry = 34
    drawBox(rx, ry, 86, 95, WHITE, BORDER)
    doc.setFillColor(...r.color)
    doc.rect(rx, ry, 86, 3, 'F')

    drawIconCircle(rx + 43, ry + 18, 9, r.color, r.letter)
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(11)
    doc.text(r.name, rx + 43, ry + 34, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(7)
    doc.text(r.desc, rx + 43, ry + 40, { align: 'center' })

    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.2)
    doc.line(rx + 10, ry + 44, rx + 76, ry + 44)

    let fy = ry + 52
    r.features.forEach(f => {
      doc.setFillColor(...r.color)
      doc.circle(rx + 10, fy - 1, 1, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...DARK)
      doc.setFontSize(7.5)
      doc.text(f, rx + 14, fy)
      fy += 7
    })
  })

  narrationBox(
    'Ruang lingkup sistem difokuskan pada tiga peran pengguna utama: Admin untuk mengelola seluruh aspek operasional termasuk event, kru, inventaris dan keuangan. Client sebagai portal pemesanan online. Dan Crew sebagai antarmuka untuk melihat penugasan dan jadwal kerja lapangan.',
    '0.5 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 6 — ARSITEKTUR TEKNOLOGI
// ═══════════════════════════════════════════════════════════════
function slide6_Arsitektur() {
  doc.addPage('a4', 'landscape')
  slideHeader('ARSITEKTUR TEKNOLOGI', 'Technology Stack & System Architecture')

  const cy = 36
  
  // Layer 1 — Frontend
  drawBox(ML, cy, CW, 26, [235, 245, 255], SECONDARY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SECONDARY)
  doc.setFontSize(8)
  doc.text('FRONTEND LAYER', ML + 5, cy + 7)
  
  // Frontend boxes
  const frontendItems = [
    { name: 'Next.js 16', desc: 'React Framework', x: ML + 5 },
    { name: 'Tailwind CSS 4', desc: 'Utility-first CSS', x: ML + 65 },
    { name: 'shadcn/ui', desc: '40+ Components', x: ML + 125 },
    { name: 'React Hook Form', desc: 'Form Validation', x: ML + 185 },
  ]
  frontendItems.forEach(f => {
    drawBox(f.x, cy + 10, 54, 12, WHITE, SECONDARY)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(7.5)
    doc.text(f.name, f.x + 3, cy + 16)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6)
    doc.text(f.desc, f.x + 3, cy + 20)
  })

  // Arrows down
  drawArrow(W / 2, cy + 26, W / 2, cy + 31, ACCENT)

  // Layer 2 — API Layer
  const ay = cy + 32
  drawBox(ML, ay, CW, 26, [255, 248, 235], ACCENT)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.setFontSize(8)
  doc.text('API LAYER (Next.js API Routes + Middleware + Auth)', ML + 5, ay + 7)

  const apiItems = [
    { name: '/api/events', desc: 'Event Management' },
    { name: '/api/equipment', desc: 'Inventory CRUD' },
    { name: '/api/crew', desc: 'Crew Management' },
    { name: '/api/payments', desc: 'Payment Tracking' },
    { name: '/api/auth', desc: 'Authentication' },
  ]
  apiItems.forEach((a, i) => {
    const ax2 = ML + 5 + i * 54
    drawBox(ax2, ay + 10, 50, 12, WHITE, ACCENT)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(7)
    doc.text(a.name, ax2 + 3, ay + 16)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6)
    doc.text(a.desc, ax2 + 3, ay + 20)
  })

  // Arrows down
  drawArrow(W / 2, ay + 26, W / 2, ay + 31, ACCENT2)

  // Layer 3 — Backend / Database
  const dy = ay + 32
  drawBox(ML, dy, CW, 26, [235, 255, 245], ACCENT2)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREEN)
  doc.setFontSize(8)
  doc.text('DATABASE LAYER (Supabase PostgreSQL + Auth)', ML + 5, dy + 7)

  const dbItems = [
    { name: 'profiles', desc: 'Users & Roles' },
    { name: 'events', desc: 'Bookings' },
    { name: 'equipment', desc: 'Inventory' },
    { name: 'event_crew', desc: 'Assignments' },
    { name: 'payments', desc: 'Finance' },
  ]
  dbItems.forEach((d, i) => {
    const dx = ML + 5 + i * 54
    drawBox(dx, dy + 10, 50, 12, WHITE, ACCENT2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(7)
    doc.text(d.name, dx + 3, dy + 16)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6)
    doc.text(d.desc, dx + 3, dy + 20)
  })

  // Right side: Tech Stack summary
  const sx = ML + 5
  const sy = dy + 30
  drawBox(sx, sy, CW - 10, 15, LIGHT, BORDER)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(7)
  const techLabels = ['Next.js v16', 'React v19', 'TypeScript', 'Tailwind v4', 'Supabase', 'PostgreSQL', 'Zod', 'Recharts']
  techLabels.forEach((t, i) => {
    const tlx = sx + 5 + i * 34
    drawBox(tlx, sy + 3, 30, 9, PRIMARY, null)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6.5)
    doc.text(t, tlx + 15, sy + 9, { align: 'center' })
  })

  narrationBox(
    'Arsitektur sistem menggunakan 3-Layer Architecture. Frontend dibangun dengan Next.js dan Tailwind CSS. API Layer menggunakan Next.js API Routes dengan middleware otentikasi. Database menggunakan PostgreSQL di platform Supabase dengan fitur Row Level Security.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 7 — DESAIN DATABASE / ERD
// ═══════════════════════════════════════════════════════════════
function slide7_ERD() {
  doc.addPage('a4', 'landscape')
  slideHeader('DESAIN DATABASE (ERD)', 'Entity Relationship Diagram — 8 Tabel Relasional')

  const startY = 32

  // Draw entities as boxes with columns
  function drawEntity(x, y, name, columns, color) {
    const h = 8 + columns.length * 5.5
    drawBox(x, y, 56, h, WHITE, color)
    doc.setFillColor(...color)
    doc.rect(x, y, 56, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(7)
    doc.text(name, x + 28, y + 5.5, { align: 'center' })

    let cy2 = y + 13
    columns.forEach(c => {
      doc.setFont('helvetica', c.pk ? 'bold' : 'normal')
      doc.setTextColor(...(c.pk ? ACCENT : DARK))
      doc.setFontSize(6.5)
      doc.text((c.pk ? '🔑 ' : '    ') + c.name, x + 3, cy2)
      doc.setTextColor(...MID)
      doc.text(c.type, x + 53, cy2, { align: 'right' })
      cy2 += 5.5
    })
    return { cx: x + 28, cy: y + h / 2, bottom: y + h, top: y }
  }

  // Profiles
  const p = drawEntity(ML, startY, 'PROFILES', [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'email', type: 'TEXT' },
    { name: 'role', type: 'ENUM' },
    { name: 'full_name', type: 'TEXT' },
    { name: 'availability', type: 'TEXT' },
    { name: 'position', type: 'TEXT' },
  ], SECONDARY)

  // Events
  const e = drawEntity(ML + 80, startY, 'EVENTS', [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'client_id', type: 'FK→Profiles' },
    { name: 'event_name', type: 'TEXT' },
    { name: 'date', type: 'DATE' },
    { name: 'status', type: 'ENUM' },
    { name: 'price', type: 'DECIMAL' },
  ], PRIMARY)

  // Equipment
  const eq = drawEntity(ML + 160, startY, 'EQUIPMENT', [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'name', type: 'TEXT' },
    { name: 'category', type: 'ENUM' },
    { name: 'qty_total', type: 'INT' },
    { name: 'qty_available', type: 'INT' },
    { name: 'price_per_day', type: 'DECIMAL' },
  ], ACCENT)

  // Junction tables
  const jy = startY + 78
  const ec = drawEntity(ML + 20, jy, 'EVENT_CREW', [
    { name: 'event_id', type: 'FK→Events', pk: true },
    { name: 'crew_id', type: 'FK→Profiles', pk: true },
    { name: 'position', type: 'TEXT' },
  ], PURPLE)

  const ee = drawEntity(ML + 110, jy, 'EVENT_EQUIPMENT', [
    { name: 'event_id', type: 'FK→Events', pk: true },
    { name: 'equipment_id', type: 'FK→Equip', pk: true },
    { name: 'quantity', type: 'INT' },
  ], TEAL)

  const pay = drawEntity(ML + 200, jy, 'PAYMENTS', [
    { name: 'id', type: 'UUID', pk: true },
    { name: 'event_id', type: 'FK→Events' },
    { name: 'amount', type: 'DECIMAL' },
    { name: 'status', type: 'ENUM' },
  ], GREEN)

  // Draw relationships
  // Profiles -> Events (1:N)
  drawArrow(ML + 56, startY + 20, ML + 80, startY + 20, SECONDARY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MID)
  doc.setFontSize(5.5)
  doc.text('1:N', ML + 68, startY + 18)

  // Events -> Equipment (via junction)
  drawArrow(ML + 108, startY + 48, ML + 138, jy + 10, TEAL)
  drawArrow(ML + 166, jy + 10, ML + 160, startY + 48, TEAL)
  doc.setFontSize(5.5)
  doc.text('M:N', ML + 145, jy + 5)

  // Profiles -> EventCrew
  drawArrow(ML + 28, p.bottom, ML + 48, jy, PURPLE)
  doc.text('M:N', ML + 30, jy - 3)

  // Events -> EventCrew
  drawArrow(ML + 108, startY + 48, ML + 48, jy, PURPLE)

  // Events -> Payments
  drawArrow(ML + 136, startY + 48, ML + 228, jy, GREEN)
  doc.text('1:N', ML + 210, jy - 3)

  narrationBox(
    'Desain database terdiri dari 8 tabel utama dengan relasi yang terstruktur. Tabel Events menjadi entitas pusat yang terhubung ke Profiles, Equipment, Crew, dan Payments melalui tabel pivot. Relasi many-to-many antara Events dan Equipment serta Crew ditangani melalui junction table.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 8 — ALUR KERJA / WORKFLOW
// ═══════════════════════════════════════════════════════════════
function slide8_Workflow() {
  doc.addPage('a4', 'landscape')
  slideHeader('ALUR KERJA SISTEM', 'Status Workflow & Business Process Flow')

  const wy = 36

  // Status workflow
  sectionLabel(ML, wy, 'STATUS WORKFLOW EVENT', PRIMARY)
  
  const statuses = [
    { name: 'PENDING', color: [200, 160, 50], desc: 'Client submit' },
    { name: 'SURVEY', color: SECONDARY, desc: 'Admin review' },
    { name: 'DEAL', color: PURPLE, desc: 'Negotiated' },
    { name: 'RUNNING', color: ACCENT, desc: 'Event live' },
    { name: 'SELESAI', color: GREEN, desc: 'Completed' },
  ]

  const swY = wy + 14
  statuses.forEach((s, i) => {
    const sx = ML + 10 + i * 54
    drawBox(sx, swY, 44, 20, s.color, null)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(8)
    doc.text(s.name, sx + 22, swY + 9, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.text(s.desc, sx + 22, swY + 15, { align: 'center' })
    if (i < statuses.length - 1) {
      drawArrow(sx + 44, swY + 10, sx + 54, swY + 10, WHITE)
    }
  })

  // Cancel branch
  drawBox(ML + 136, swY + 26, 36, 12, RED, null)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7)
  doc.text('CANCEL', ML + 154, swY + 34, { align: 'center' })
  doc.setDrawColor(...RED)
  doc.setLineWidth(0.4)
  doc.setLineDashPattern([1.5, 1], 0)
  doc.line(ML + 136, swY + 18, ML + 136, swY + 26)
  doc.line(ML + 172, swY + 18, ML + 172, swY + 26)
  doc.setLineDashPattern([], 0)

  // Booking Flow
  const fy = swY + 48
  sectionLabel(ML, fy, 'ALUR BOOKING EVENT', ACCENT)

  const steps = [
    { label: 'Client buka\nportal booking', color: SECONDARY },
    { label: 'Isi form\n3-step wizard', color: SECONDARY },
    { label: 'Submit →\nValidasi Zod', color: ACCENT },
    { label: 'API Backend\ncek stok', color: TEAL },
    { label: 'Stock Guard\nvalidasi', color: GREEN },
    { label: 'Simpan DB\nstatus: pending', color: PRIMARY },
    { label: 'Admin\nApproval', color: PURPLE },
  ]

  const stepY = fy + 13
  steps.forEach((s, i) => {
    const stepX = ML + 5 + i * 39
    drawBox(stepX, stepY, 35, 22, s.color, null, 4)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6.5)
    const lines = doc.splitTextToSize(s.label, 31)
    doc.text(lines, stepX + 17.5, stepY + 8, { align: 'center' })
    if (i < steps.length - 1) {
      drawArrow(stepX + 35, stepY + 11, stepX + 39, stepY + 11, ACCENT)
    }
  })

  narrationBox(
    'Alur kerja sistem mengikuti state machine yang ketat: Pending, Survey, Deal, Running, Selesai. Client membuat pesanan melalui form wizard 3 langkah, lalu sistem memvalidasi stok secara otomatis sebelum menyimpan ke database. Admin kemudian melakukan approval.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 9 — TAMPILAN PORTAL CLIENT
// ═══════════════════════════════════════════════════════════════
function slide9_UIClient() {
  doc.addPage('a4', 'landscape')
  slideHeader('TAMPILAN PORTAL CLIENT', 'User Interface — Client Booking & Event Tracking')

  const uy = 32

  // Mock UI - Booking Form
  const formX = ML + 5
  const formY = uy
  drawBox(formX, formY, 130, 110, [250, 252, 255], BORDER)
  
  // Sidebar mock
  drawBox(formX, formY, 28, 110, PRIMARY, null)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(6)
  doc.text('FND', formX + 14, formY + 8, { align: 'center' })
  
  const menuItems = ['🏠 Home', '📋 Booking', '📂 Events', '👤 Profile']
  menuItems.forEach((m, i) => {
    const my = formY + 18 + i * 10
    if (i === 1) {
      drawBox(formX + 2, my - 3, 24, 9, ACCENT, null, 2)
      doc.setTextColor(...PRIMARY)
    } else {
      doc.setTextColor(150, 170, 200)
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.5)
    doc.text(m, formX + 5, my + 2)
  })

  // Main content
  const contentX = formX + 32
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(10)
  doc.text('Form Pemesanan Event', contentX, formY + 10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MID)
  doc.setFontSize(7)
  doc.text('Lengkapi data berikut untuk mengajukan booking', contentX, formY + 16)

  // Step indicators
  const stepColors = [ACCENT, BORDER, BORDER]
  const stepLabels = ['1. Info Event', '2. Detail Alat', '3. Konfirmasi']
  stepLabels.forEach((s, i) => {
    const sx = contentX + i * 30
    drawBox(sx, formY + 20, 28, 6, stepColors[i], null, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(i === 0 ? PRIMARY : MID))
    doc.setFontSize(5.5)
    doc.text(s, sx + 14, formY + 24, { align: 'center' })
  })

  // Form fields mock
  const fields = ['Nama Event', 'Jenis Event', 'Tanggal Pelaksanaan', 'Waktu Mulai — Selesai', 'Lokasi / Venue', 'Kota']
  let ffy = formY + 32
  fields.forEach(f => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(6)
    doc.text(f, contentX, ffy)
    drawBox(contentX, ffy + 1.5, 90, 6, WHITE, BORDER, 1)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 185, 195)
    doc.setFontSize(5.5)
    doc.text('Masukkan ' + f.toLowerCase() + '...', contentX + 3, ffy + 5.5)
    ffy += 11
  })

  // Submit button
  drawBox(contentX + 55, ffy + 2, 35, 8, ACCENT, null, 2)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(6.5)
  doc.text('Submit Booking →', contentX + 72.5, ffy + 7.5, { align: 'center' })

  // Event Tracking mock
  const trackX = ML + 145
  drawBox(trackX, uy, 130, 110, [250, 252, 255], BORDER)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(10)
  doc.text('Daftar Event Saya', trackX + 5, uy + 10)

  // Event cards
  const events = [
    { name: 'Wedding Rani & Budi', date: '25 Mei 2026', status: 'DEAL', statusColor: PURPLE, loc: 'Hotel Mulia, Jakarta' },
    { name: 'Corporate Gala Night', date: '02 Jun 2026', status: 'PENDING', statusColor: [200, 160, 50], loc: 'JCC Senayan' },
    { name: 'Music Festival 2026', date: '15 Jun 2026', status: 'SURVEY', statusColor: SECONDARY, loc: 'GBK, Jakarta' },
    { name: 'Birthday Party VIP', date: '20 Jun 2026', status: 'RUNNING', statusColor: ACCENT, loc: 'Ballroom Ritz' },
  ]

  let ey = uy + 16
  events.forEach(ev => {
    drawBox(trackX + 5, ey, 120, 18, WHITE, BORDER, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(7.5)
    doc.text(ev.name, trackX + 9, ey + 6)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6)
    doc.text(`${ev.date}  •  ${ev.loc}`, trackX + 9, ey + 12)

    // Status badge
    drawBox(trackX + 95, ey + 3, 26, 7, ev.statusColor, null, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(5.5)
    doc.text(ev.status, trackX + 108, ey + 8, { align: 'center' })
    ey += 22
  })

  narrationBox(
    'Portal client menyediakan antarmuka yang intuitif dengan form booking 3 langkah. Client dapat melihat daftar event mereka beserta status terkini, mulai dari Pending hingga Selesai. Setiap event menampilkan detail lokasi, tanggal, dan badge status berwarna.',
    '0.5 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 10 — TAMPILAN DASHBOARD ADMIN
// ═══════════════════════════════════════════════════════════════
function slide10_UIAdmin() {
  doc.addPage('a4', 'landscape')
  slideHeader('TAMPILAN DASHBOARD ADMIN', 'User Interface — Admin Analytics & Management')

  const uy = 32

  // Full dashboard mock
  drawBox(ML, uy, CW, 112, [248, 250, 255], BORDER)
  
  // Sidebar
  drawBox(ML, uy, 35, 112, PRIMARY, null)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.setFontSize(8)
  doc.text('FND Admin', ML + 17.5, uy + 10, { align: 'center' })
  
  const adminMenus = ['📊 Dashboard', '📋 Events', '📨 Request', '🔧 Inventory', '👥 Crew', '💰 Finance', '⚙️ Settings']
  adminMenus.forEach((m, i) => {
    const my = uy + 20 + i * 11
    if (i === 0) {
      drawBox(ML + 2, my - 2, 31, 9, ACCENT, null, 2)
      doc.setTextColor(...PRIMARY)
    } else {
      doc.setTextColor(150, 170, 200)
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.5)
    doc.text(m, ML + 6, my + 3)
  })

  // Stats cards
  const statsData = [
    { label: 'Total Events', value: '128', change: '+12%', color: SECONDARY, icon: '📋' },
    { label: 'Revenue', value: 'Rp 1.2M', change: '+8.5%', color: GREEN, icon: '💰' },
    { label: 'Active Crew', value: '28 / 35', change: '80%', color: PURPLE, icon: '👥' },
    { label: 'Equipment', value: '487 / 520', change: '93.6%', color: ACCENT, icon: '🔧' },
  ]

  statsData.forEach((s, i) => {
    const sx = ML + 40 + i * 60
    drawBox(sx, uy + 5, 55, 22, WHITE, BORDER, 3)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6)
    doc.text(s.label, sx + 5, uy + 11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(12)
    doc.text(s.value, sx + 5, uy + 20)
    
    drawBox(sx + 38, uy + 15, 14, 7, [235, 255, 240], null, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GREEN)
    doc.setFontSize(5.5)
    doc.text(s.change, sx + 45, uy + 20, { align: 'center' })
  })

  // Monthly Chart mock
  const chartX = ML + 40
  const chartY = uy + 32
  drawBox(chartX, chartY, 130, 55, WHITE, BORDER, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(8)
  doc.text('Grafik Event Bulanan 2026', chartX + 5, chartY + 8)

  // Bar chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
  const values = [12, 18, 15, 22, 28, 20]
  const maxVal = 30
  const barW = 12
  const chartBaseY = chartY + 48

  months.forEach((m, i) => {
    const bx = chartX + 15 + i * 18
    const barH = (values[i] / maxVal) * 32
    
    // Bar with gradient effect
    doc.setFillColor(...SECONDARY)
    doc.roundedRect(bx, chartBaseY - barH, barW, barH, 1, 1, 'F')
    
    // Value on top
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(6)
    doc.text(String(values[i]), bx + barW / 2, chartBaseY - barH - 2, { align: 'center' })
    
    // Month label
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(5.5)
    doc.text(m, bx + barW / 2, chartBaseY + 4, { align: 'center' })
  })

  // Pie chart mock (status distribution)
  const pieX = ML + 205
  const pieY = chartY + 28
  drawBox(ML + 175, chartY, 95, 55, WHITE, BORDER, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(8)
  doc.text('Status Event', ML + 180, chartY + 8)

  // Simplified pie (concentric arcs as colored segments)
  const pieR = 14
  const pieColors = [GREEN, SECONDARY, PURPLE, ACCENT, RED]
  const pieLabels = ['Selesai 45%', 'Running 20%', 'Deal 15%', 'Pending 12%', 'Cancel 8%']
  let startAngle = 0
  const pieValues = [0.45, 0.20, 0.15, 0.12, 0.08]
  
  // Draw full circles for each segment
  pieValues.forEach((v, i) => {
    doc.setFillColor(...pieColors[i])
    const endAngle = startAngle + v * 360
    // simplified: draw colored circles stacked
    doc.circle(pieX, pieY, pieR - i * 0.5, i === 0 ? 'F' : 'F')
    startAngle = endAngle
  })

  // Just draw a nice donut
  doc.setFillColor(...GREEN)
  doc.circle(pieX, pieY, pieR, 'F')
  doc.setFillColor(...SECONDARY)
  doc.circle(pieX + 3, pieY - 2, pieR - 2, 'F')
  doc.setFillColor(...PURPLE)
  doc.circle(pieX + 5, pieY + 2, pieR - 5, 'F')
  doc.setFillColor(...ACCENT)
  doc.circle(pieX + 2, pieY + 4, pieR - 8, 'F')
  doc.setFillColor(...WHITE)
  doc.circle(pieX + 2, pieY + 1, 5, 'F')

  // Legend
  let ly = chartY + 14
  pieLabels.forEach((l, i) => {
    doc.setFillColor(...pieColors[i])
    doc.rect(ML + 230, ly, 4, 3, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(5.5)
    doc.text(l, ML + 236, ly + 2.5)
    ly += 6
  })

  // Recent Events Table mock
  const tableX = ML + 40
  const tableY = uy + 90
  drawBox(tableX, tableY, 230, 20, WHITE, BORDER, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(7)
  doc.text('Recent Events', tableX + 5, tableY + 6)
  
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.line(tableX + 5, tableY + 8, tableX + 225, tableY + 8)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...MID)
  doc.setFontSize(5.5)
  const headers = ['Event Name', 'Client', 'Date', 'Location', 'Status']
  const hx = [5, 60, 110, 140, 190]
  headers.forEach((h, i) => {
    doc.text(h, tableX + hx[i], tableY + 12)
  })
  
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  const rows = [
    ['Wedding Rani & Budi', 'PT Kreatif', '25 Mei', 'Hotel Mulia', 'DEAL'],
    ['Corporate Night', 'Bank Mandiri', '02 Jun', 'JCC Senayan', 'PENDING'],
  ]
  rows.forEach((r, ri) => {
    r.forEach((c, ci) => {
      doc.text(c, tableX + hx[ci], tableY + 17 + ri * 4)
    })
  })

  narrationBox(
    'Dashboard admin menampilkan visualisasi analitis: total event, revenue, ketersediaan kru, dan utilisasi peralatan. Grafik bar menunjukkan tren event bulanan, sementara pie chart menampilkan distribusi status event secara real-time.',
    '0.5 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 11 — FITUR STOCK COLLISION GUARD
// ═══════════════════════════════════════════════════════════════
function slide11_StockGuard() {
  doc.addPage('a4', 'landscape')
  slideHeader('FITUR UTAMA: STOCK COLLISION GUARD', 'Validasi Ketersediaan Alat Secara Real-time')

  const startY = 34

  // Flow diagram
  sectionLabel(ML, startY, 'ALUR VALIDASI STOK', PRIMARY)

  const flowY = startY + 14
  const flowSteps = [
    { label: 'Client Submit\nBooking', color: SECONDARY, w: 36 },
    { label: 'POST\n/api/bookings', color: ACCENT, w: 36 },
    { label: 'Stock Guard\nCheck DB', color: TEAL, w: 36 },
    { label: 'Hitung\nSisa Stok', color: PURPLE, w: 36 },
  ]

  flowSteps.forEach((s, i) => {
    const fx = ML + 5 + i * 42
    drawBox(fx, flowY, s.w, 18, s.color, null, 3)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6.5)
    const lines = doc.splitTextToSize(s.label, 32)
    doc.text(lines, fx + 18, flowY + 6, { align: 'center' })
    if (i < flowSteps.length - 1) {
      drawArrow(fx + s.w, flowY + 9, fx + 42, flowY + 9, ACCENT)
    }
  })

  // Decision diamond (simplified as box)
  const dx = ML + 175
  drawBox(dx, flowY - 2, 36, 22, [255, 248, 235], ACCENT)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.setFontSize(7)
  doc.text('Stok\nCukup?', dx + 18, flowY + 7, { align: 'center' })
  drawArrow(ML + 173, flowY + 9, dx, flowY + 9, ACCENT)

  // Yes path
  const yesX = dx + 40
  drawBox(yesX, flowY - 5, 36, 12, GREEN, null, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7)
  doc.text('✅ 200 OK', yesX + 18, flowY + 2, { align: 'center' })
  drawArrow(dx + 36, flowY + 3, yesX, flowY + 1, GREEN)
  doc.setTextColor(...GREEN)
  doc.setFontSize(5.5)
  doc.text('Ya', dx + 37, flowY - 1)

  // No path
  drawBox(yesX, flowY + 12, 36, 12, RED, null, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7)
  doc.text('❌ 409 Conflict', yesX + 18, flowY + 19, { align: 'center' })
  drawArrow(dx + 36, flowY + 14, yesX, flowY + 18, RED)
  doc.setTextColor(...RED)
  doc.setFontSize(5.5)
  doc.text('Tidak', dx + 37, flowY + 15)

  // SQL Formula
  const sqlY = flowY + 36
  drawBox(ML, sqlY, CW, 22, [30, 35, 50], null, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.setFontSize(7)
  doc.text('SQL OVERLAP DETECTION QUERY:', ML + 5, sqlY + 7)
  doc.setFont('courier', 'normal')
  doc.setTextColor(180, 230, 200)
  doc.setFontSize(7)
  doc.text('SELECT SUM(quantity) FROM event_equipment ee', ML + 10, sqlY + 13)
  doc.text('JOIN events e ON ee.event_id = e.id', ML + 10, sqlY + 17)
  doc.text("WHERE ee.equipment_id = $1 AND e.start_date <= $3 AND e.end_date >= $2  -- Overlap detection", ML + 10, sqlY + 21)

  // Example scenario boxes
  const exY = sqlY + 28
  sectionLabel(ML, exY, 'CONTOH SKENARIO', SECONDARY)

  // Normal flow
  const nfX = ML + 5
  const nfY = exY + 12
  drawBox(nfX, nfY, 130, 24, [240, 255, 245], GREEN, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GREEN)
  doc.setFontSize(8)
  doc.text('✅ Normal Flow — Booking Berhasil', nfX + 5, nfY + 7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  doc.setFontSize(7)
  doc.text('Moving Head: 10 unit diminta  |  Stok: 30 unit  |  Terpakai: 0', nfX + 5, nfY + 14)
  doc.text('→ Sisa: 30 unit ≥ 10 unit diminta → HTTP 200 OK, booking created', nfX + 5, nfY + 20)

  // Exception flow
  const efX = ML + 141
  drawBox(efX, nfY, 130, 24, [255, 240, 240], RED, 3)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...RED)
  doc.setFontSize(8)
  doc.text('❌ Stock Collision — Booking Ditolak', efX + 5, nfY + 7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  doc.setFontSize(7)
  doc.text('Moving Head: 25 unit diminta  |  Stok: 30 unit  |  Terpakai: 15', efX + 5, nfY + 14)
  doc.text('→ Sisa: 15 unit < 25 diminta → HTTP 409 Conflict, shortfall: 10', efX + 5, nfY + 20)

  narrationBox(
    'Fitur utama sistem adalah Stock Collision Guard. Ketika client melakukan booking, sistem mengecek ketersediaan stok secara real-time dengan menghitung total alat yang sudah dialokasikan pada rentang tanggal yang beririsan. Query SQL overlap detection memastikan tidak ada celah double-booking.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 12 — HASIL PENGUJIAN (TESTING)
// ═══════════════════════════════════════════════════════════════
function slide12_Testing() {
  doc.addPage('a4', 'landscape')
  slideHeader('HASIL PENGUJIAN INTEGRASI', 'Black-Box Testing & Integration Testing Results')

  const ty = 30

  autoTable(doc, {
    startY: ty,
    head: [['No', 'Skenario Pengujian', 'Data Input', 'Expected Result', 'Actual Result', 'Status']],
    body: [
      ['1', 'Normal Flow:\nBooking aman', 'Moving Head: 10 unit\nStok: 30 unit\nTanggal: 25 Mei 2026', 'HTTP 200 OK\nBooking terbuat\nStok terpotong', 'HTTP 200 OK\nBooking ID: 4091\nStok berkurang', '✅ PASS'],
      ['2', 'Stock Collision:\nDouble-booking', 'Moving Head: 25 unit\nOverlap: 15 unit terpakai\nTanggal: 25 Mei 2026', 'HTTP 409 Conflict\nStock Collision Error\nShortfall: 10', 'HTTP 409 Conflict\nStock Collision Error\nRollback sukses', '✅ PASS'],
      ['3', 'Edge Case:\nDate Overlap', 'Event A: 25-27 Mei\nEvent B: 26-28 Mei\nQty melebihi batas', 'HTTP 409 Conflict\nDeteksi irisan tanggal', 'HTTP 409 Conflict\nIrisan terdeteksi akurat', '✅ PASS'],
      ['4', 'Validation:\nInvalid Payload', 'event_date: "invalid"\nitems: []', 'HTTP 400 Bad Request\nValidation failure', 'HTTP 400 Bad Request\n"Invalid date format"', '✅ PASS'],
    ],
    margin: { left: ML, right: MR },
    styles: { fontSize: 7, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.15, textColor: DARK },
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 40, fontStyle: 'bold', textColor: PRIMARY },
      2: { cellWidth: 50 },
      3: { cellWidth: 48 },
      4: { cellWidth: 48 },
      5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: [249, 252, 255] },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 5) {
        data.cell.styles.fillColor = [235, 250, 240]
        data.cell.styles.textColor = [46, 125, 50]
      }
    }
  })

  // Summary bar
  const sumY = doc.lastAutoTable.finalY + 5
  drawBox(ML, sumY, CW, 14, LIGHT, BORDER)
  
  const summaryItems = [
    { label: 'Total Skenario', value: '4', color: SECONDARY },
    { label: 'Passed', value: '4', color: GREEN },
    { label: 'Failed', value: '0', color: RED },
    { label: 'Pass Rate', value: '100%', color: ACCENT },
    { label: 'Metode', value: 'Black-Box', color: PURPLE },
  ]
  summaryItems.forEach((s, i) => {
    const sx = ML + 10 + i * 55
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...s.color)
    doc.setFontSize(12)
    doc.text(s.value, sx, sumY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MID)
    doc.setFontSize(6.5)
    doc.text(s.label, sx, sumY + 12)
  })

  narrationBox(
    'Pengujian integrasi dilakukan dengan metode Black-Box pada 4 skenario krusial. Semua skenario berhasil PASS dengan tingkat keberhasilan 100 persen. Skenario mencakup normal flow, stock collision, date overlap, dan validasi payload, membuktikan sistem siap untuk tahap berikutnya.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 13 — BUG LOG & SOLUSI
// ═══════════════════════════════════════════════════════════════
function slide13_BugLog() {
  doc.addPage('a4', 'landscape')
  slideHeader('LOG BUG & SOLUSI PERBAIKAN', 'Bug yang ditemukan selama integrasi dan tindakan korektif')

  const by = 30

  const bugs = [
    {
      id: 'BUG-01', severity: 'CRITICAL', severityColor: RED,
      title: 'Overlapping Date Bypass',
      problem: 'Query SQL hanya cek start_date absolut (=), bukan irisan rentang.',
      impact: 'Double-booking alat lighting di lapangan.',
      solution: 'SQL: (start_date <= target_end) AND (end_date >= target_start)',
    },
    {
      id: 'BUG-02', severity: 'HIGH', severityColor: [220, 140, 30],
      title: 'Race Condition Concurrent',
      problem: 'Dua client checkout bersamaan → stok lolos validasi ganda.',
      impact: 'Minus stok aktual inventaris gudang.',
      solution: 'PostgreSQL Transaction SERIALIZABLE + SELECT FOR UPDATE',
    },
    {
      id: 'BUG-03', severity: 'LOW', severityColor: SECONDARY,
      title: 'Float on Quantity Input',
      problem: 'API validator menerima angka berkoma (2.5 unit).',
      impact: 'Angka inventarisasi tidak presisi.',
      solution: 'Zod: z.number().int().positive() + sanitizer middleware',
    },
  ]

  bugs.forEach((b, i) => {
    const bx = ML + i * 92
    drawBox(bx, by, 86, 110, WHITE, BORDER, 3)
    
    // ID badge
    doc.setFillColor(...b.severityColor)
    doc.roundedRect(bx + 3, by + 3, 22, 7, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6.5)
    doc.text(b.id, bx + 14, by + 8, { align: 'center' })

    // Severity
    doc.setFillColor(...b.severityColor)
    doc.roundedRect(bx + 28, by + 3, 20, 7, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(5.5)
    doc.text(b.severity, bx + 38, by + 8, { align: 'center' })

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(9)
    doc.text(b.title, bx + 5, by + 20)

    // Problem
    doc.setFillColor(255, 245, 245)
    doc.roundedRect(bx + 3, by + 25, 80, 20, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...RED)
    doc.setFontSize(6)
    doc.text('MASALAH:', bx + 5, by + 31)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(6.5)
    const probLines = doc.splitTextToSize(b.problem, 74)
    doc.text(probLines, bx + 5, by + 36)

    // Impact
    doc.setFillColor(255, 250, 240)
    doc.roundedRect(bx + 3, by + 48, 80, 16, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...ACCENT)
    doc.setFontSize(6)
    doc.text('DAMPAK:', bx + 5, by + 54)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(6.5)
    doc.text(b.impact, bx + 5, by + 59)

    // Solution
    doc.setFillColor(240, 255, 245)
    doc.roundedRect(bx + 3, by + 68, 80, 36, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GREEN)
    doc.setFontSize(6)
    doc.text('SOLUSI:', bx + 5, by + 74)
    doc.setFont('courier', 'normal')
    doc.setTextColor(30, 80, 50)
    doc.setFontSize(6)
    const solLines = doc.splitTextToSize(b.solution, 74)
    doc.text(solLines, bx + 5, by + 80)

    // Resolved badge
    drawBox(bx + 25, by + 100, 36, 7, GREEN, null, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6)
    doc.text('✅ RESOLVED', bx + 43, by + 105, { align: 'center' })
  })

  narrationBox(
    'Selama pengembangan, kami menemukan 3 bug. Bug kritikal pertama adalah validasi tanggal overlap yang meloset. Bug kedua adalah race condition pada booking bersamaan. Bug ketiga adalah tipe data floating pada kuantitas. Ketiga bug telah berhasil diselesaikan dengan perbaikan di tingkat database dan validator.',
    '1 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 14 — KESIMPULAN
// ═══════════════════════════════════════════════════════════════
function slide14_Kesimpulan() {
  doc.addPage('a4', 'landscape')
  slideHeader('KESIMPULAN', 'Ringkasan pencapaian dan rekomendasi pengembangan')

  const ky = 34

  // Achievement cards
  sectionLabel(ML, ky, 'PENCAPAIAN UTAMA', GREEN)

  const achievements = [
    { icon: '✅', title: 'Integrasi Berhasil', desc: 'Semua modul terintegrasi dan berjalan stabil. Komunikasi API request-response berjalan lancar tanpa error.' },
    { icon: '🛡️', title: 'Bug Kritikal Terselesaikan', desc: 'Date overlap, race condition, dan float quantity telah diperbaiki dengan solusi database-level yang robust.' },
    { icon: '📊', title: '100% Test Pass Rate', desc: 'Seluruh 4 skenario pengujian Black-Box berhasil PASS, termasuk edge case dan exception flow.' },
    { icon: '🚀', title: 'Layak Deploy Staging', desc: 'Sistem siap digunakan di lingkungan operasional nyata (staging) untuk uji coba lebih lanjut.' },
  ]

  const achY = ky + 14
  achievements.forEach((a, i) => {
    const ax = ML + i * 68
    drawBox(ax, achY, 64, 42, WHITE, BORDER, 3)
    doc.setFillColor(...GREEN)
    doc.rect(ax, achY, 64, 3, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(9)
    doc.text(`${a.icon} ${a.title}`, ax + 5, achY + 12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(7)
    const descLines = doc.splitTextToSize(a.desc, 56)
    doc.text(descLines, ax + 5, achY + 20)
  })

  // Recommendations
  sectionLabel(ML, achY + 50, 'REKOMENDASI PENGEMBANGAN', SECONDARY)

  const recY = achY + 63
  const recs = [
    { num: '01', text: 'Integrasi Modul Crew Assignment dengan Calendar Conflict Checker' },
    { num: '02', text: 'Implementasi caching Redis untuk data master inventaris' },
    { num: '03', text: 'Penambahan notifikasi real-time (WebSocket) ke client dan crew' },
    { num: '04', text: 'Deployment ke production dengan CI/CD pipeline' },
  ]

  recs.forEach((r, i) => {
    const rx = ML + i * 68
    drawBox(rx, recY, 64, 14, LIGHT, BORDER, 2)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SECONDARY)
    doc.setFontSize(10)
    doc.text(r.num, rx + 5, recY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.setFontSize(6.5)
    const recLines = doc.splitTextToSize(r.text, 48)
    doc.text(recLines, rx + 15, recY + 6)
  })

  narrationBox(
    'Kesimpulannya, Event Lighting Management System telah berhasil diimplementasikan sesuai requirement. Sistem dinilai layak untuk dideploy ke lingkungan staging. Rekomendasi pengembangan selanjutnya mencakup integrasi Crew Assignment, caching Redis, notifikasi WebSocket, dan CI/CD pipeline.',
    '0.5 menit'
  )
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 15 — Q&A / PENUTUP
// ═══════════════════════════════════════════════════════════════
function slide15_QA() {
  doc.addPage('a4', 'landscape')
  
  // Full dark background
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, W, H, 'F')

  // Decorative elements
  doc.setFillColor(25, 50, 95)
  doc.circle(50, 40, 50, 'F')
  doc.setFillColor(22, 46, 88)
  doc.circle(250, 170, 60, 'F')
  doc.setFillColor(30, 55, 100)
  doc.circle(280, 30, 25, 'F')

  // Accent line
  doc.setFillColor(...ACCENT)
  doc.rect(W / 2 - 40, 70, 80, 2, 'F')

  // Q&A text
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(36)
  doc.text('Sesi Tanya Jawab', W / 2, 95, { align: 'center' })

  doc.setFontSize(14)
  doc.setTextColor(...ACCENT)
  doc.text('Q & A', W / 2, 110, { align: 'center' })

  // Accent line
  doc.setFillColor(...ACCENT)
  doc.rect(W / 2 - 40, 118, 80, 2, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 180, 220)
  doc.setFontSize(11)
  doc.text('Silakan ajukan pertanyaan, saran, atau masukan', W / 2, 132, { align: 'center' })

  // Contact info
  drawBox(W / 2 - 70, 145, 140, 28, [30, 55, 100], [50, 80, 130], 4)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(10)
  doc.text('Edisyah Putra Waruwu', W / 2, 156, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 180, 220)
  doc.setFontSize(8)
  doc.text('NIM: 411231179  •  Informatika  •  UNDIRA', W / 2, 164, { align: 'center' })

  // Thank you
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.setFontSize(14)
  doc.text('Terima Kasih', W / 2, 186, { align: 'center' })

  // Footer
  slideNum = 15
  doc.setFillColor(15, 35, 70)
  doc.rect(0, H - 10, W, 10, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(120, 140, 170)
  doc.setFontSize(6.5)
  doc.text('FND Production  •  Kerja Praktek Informatika  •  UNDIRA  •  2026', ML, H - 4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...ACCENT)
  doc.text('Slide 15 / 15', W - MR, H - 4, { align: 'right' })
}

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL PAGES — FULL SCRIPT NARASI (after slides)
// ═══════════════════════════════════════════════════════════════
function appendNarasiPages() {
  doc.addPage('a4', 'portrait')
  const PW = 210
  const PH = 297
  const PML = 18
  const PCW = PW - PML * 2

  // Header
  doc.setFillColor(...PRIMARY)
  doc.rect(0, 0, PW, 25, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 25, PW, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(14)
  doc.text('NASKAH NARASI PRESENTASI LENGKAP', PW / 2, 16, { align: 'center' })

  const narasiData = [
    { slide: 'Slide 1: Judul', durasi: '0.5 menit', text: 'Selamat pagi Bapak/Ibu Dosen Penguji dan rekan-rekan. Terima kasih atas kesempatan yang diberikan. Pada hari ini, saya Edisyah Putra Waruwu akan mempresentasikan hasil Kerja Praktek kami di FND Production dengan judul proyek Event Lighting Management System.' },
    { slide: 'Slide 2: Latar Belakang', durasi: '1 menit', text: 'Latar belakang proyek ini bermula dari kendala operasional FND Production. Proses pemesanan alat masih manual via WhatsApp, menyebabkan double-booking, bentrok jadwal kru, dan arus keuangan tidak transparan. Dengan 520 lebih peralatan dan 35 anggota kru, dibutuhkan sistem digital terintegrasi.' },
    { slide: 'Slide 3: Solusi', durasi: '1 menit', text: 'Sebagai solusi, kami mengembangkan sistem informasi manajemen berbasis web. Sistem ini mendigitalisasi proses penyewaan dan memperkenalkan fitur Stock Collision Guard untuk mencegah bentrok stok, serta Calendar Conflict Checker untuk validasi jadwal kru secara otomatis.' },
    { slide: 'Slide 4: Tujuan & Manfaat', durasi: '0.5 menit', text: 'Tujuan utama proyek ini adalah membangun aplikasi operasional yang handal. Manfaatnya, tim admin dapat lebih efisien mengelola event, meminimalisir kesalahan manusia, serta memberikan transparansi data stok secara real-time.' },
    { slide: 'Slide 5: Ruang Lingkup', durasi: '0.5 menit', text: 'Ruang lingkup sistem difokuskan pada tiga peran pengguna: Admin untuk mengelola seluruh operasional, Client sebagai portal pemesanan, dan Crew sebagai antarmuka penugasan lapangan.' },
    { slide: 'Slide 6: Arsitektur', durasi: '1 menit', text: 'Arsitektur sistem menggunakan 3-Layer Architecture. Frontend dibangun dengan Next.js dan Tailwind CSS. API Layer menggunakan Next.js API Routes. Database menggunakan PostgreSQL di platform Supabase.' },
    { slide: 'Slide 7: Database ERD', durasi: '1 menit', text: 'Desain database terdiri dari 8 tabel utama. Tabel Events menjadi entitas pusat yang terhubung ke Profiles, Equipment, Crew, dan Payments melalui tabel pivot untuk relasi many-to-many.' },
    { slide: 'Slide 8: Alur Kerja', durasi: '1 menit', text: 'Alur kerja mengikuti state machine: Pending, Survey, Deal, Running, Selesai. Client membuat pesanan melalui form wizard, sistem memvalidasi stok otomatis, lalu Admin melakukan approval.' },
    { slide: 'Slide 9: Portal Client', durasi: '0.5 menit', text: 'Portal client menyediakan antarmuka intuitif dengan form booking 3 langkah. Client dapat melihat daftar event beserta status terkini dari Pending hingga Selesai.' },
    { slide: 'Slide 10: Dashboard Admin', durasi: '0.5 menit', text: 'Dashboard admin menampilkan visualisasi analitis: total event, revenue, ketersediaan kru, dan utilisasi peralatan. Dilengkapi grafik bar tren bulanan dan pie chart distribusi status.' },
    { slide: 'Slide 11: Stock Guard', durasi: '1 menit', text: 'Fitur utama adalah Stock Collision Guard. Sistem mengecek ketersediaan stok real-time dengan menghitung total alat yang sudah dialokasikan pada rentang tanggal beririsan menggunakan SQL overlap detection.' },
    { slide: 'Slide 12: Pengujian', durasi: '1 menit', text: 'Pengujian integrasi dilakukan dengan metode Black-Box pada 4 skenario krusial. Semua skenario berhasil PASS dengan tingkat keberhasilan 100 persen.' },
    { slide: 'Slide 13: Bug & Solusi', durasi: '1 menit', text: 'Ditemukan 3 bug selama pengembangan: date overlap bypass, race condition, dan float quantity. Ketiga bug telah diselesaikan dengan perbaikan di tingkat database dan validator.' },
    { slide: 'Slide 14: Kesimpulan', durasi: '0.5 menit', text: 'Sistem berhasil diimplementasikan sesuai requirement dan layak untuk deploy staging. Rekomendasi: integrasi Crew Assignment, caching Redis, notifikasi WebSocket, dan CI/CD pipeline.' },
    { slide: 'Slide 15: Penutup', durasi: '—', text: 'Demikian presentasi dari saya. Silakan ajukan pertanyaan atau saran. Terima kasih banyak atas perhatiannya.' },
  ]

  let ny = 35
  narasiData.forEach((n, i) => {
    if (ny > 265) {
      doc.addPage('a4', 'portrait')
      doc.setFillColor(...PRIMARY)
      doc.rect(0, 0, PW, 20, 'F')
      doc.setFillColor(...ACCENT)
      doc.rect(0, 20, PW, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      doc.setFontSize(10)
      doc.text('NASKAH NARASI PRESENTASI (lanjutan)', PML, 13)
      ny = 30
    }

    // Slide label
    doc.setFillColor(...PRIMARY)
    doc.roundedRect(PML, ny, 50, 6, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.setFontSize(6.5)
    doc.text(n.slide, PML + 25, ny + 4.2, { align: 'center' })

    // Duration badge
    doc.setFillColor(...ACCENT)
    doc.roundedRect(PML + 52, ny, 20, 6, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PRIMARY)
    doc.setFontSize(6)
    doc.text(n.durasi, PML + 62, ny + 4.2, { align: 'center' })

    ny += 9
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(50, 50, 70)
    doc.setFontSize(8)
    const textLines = doc.splitTextToSize(`"${n.text}"`, PCW - 4)
    doc.text(textLines, PML + 2, ny)
    ny += textLines.length * 4 + 6
  })

  // Estimasi Total
  ny += 4
  drawBox(PML, ny, PCW, 14, LIGHT, BORDER)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PRIMARY)
  doc.setFontSize(10)
  doc.text('ESTIMASI TOTAL DURASI PRESENTASI:', PML + 5, ny + 9)
  doc.setTextColor(...ACCENT)
  doc.setFontSize(14)
  doc.text('~10 menit', PML + 100, ny + 9)

  // Footer sign-off
  ny += 22
  drawBox(PML, ny, PCW, 35, LIGHT, BORDER)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...PRIMARY)
  doc.text('Dibuat Oleh,', PML + 15, ny + 7)
  doc.text('Disetujui Oleh,', PML + PCW / 2 + 15, ny + 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...MID)
  doc.text('Mahasiswa Informatika UNDIRA', PML + 15, ny + 11)
  doc.text('Dosen Pembimbing KP', PML + PCW / 2 + 15, ny + 11)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.line(PML + 15, ny + 24, PML + 75, ny + 24)
  doc.line(PML + PCW / 2 + 15, ny + 24, PML + PCW / 2 + 75, ny + 24)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...DARK)
  doc.text('Edisyah Putra Waruwu', PML + 15, ny + 28)
  doc.text('(Nama Dosen Pembimbing)', PML + PCW / 2 + 15, ny + 28)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...MID)
  doc.text('NIM: 411231179', PML + 15, ny + 32)
  doc.text('NIDN: _________________', PML + PCW / 2 + 15, ny + 32)
}

// ═══════════════════════════════════════════════════════════════
// GENERATE PDF
// ═══════════════════════════════════════════════════════════════
slide1_Cover()
slide2_LatarBelakang()
slide3_Solusi()
slide4_Tujuan()
slide5_Scope()
slide6_Arsitektur()
slide7_ERD()
slide8_Workflow()
slide9_UIClient()
slide10_UIAdmin()
slide11_StockGuard()
slide12_Testing()
slide13_BugLog()
slide14_Kesimpulan()
slide15_QA()
appendNarasiPages()

// Save
const path1 = path.resolve('EdisyahPutraWaruwu_411231179_Tugas9_PresentasiProyek.pdf')
const path2 = path.resolve('Edisyah Putra Waruwu_411231179_Tugas9_PresentasiProyek.pdf')

const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(path1, pdfBuffer)
fs.writeFileSync(path2, pdfBuffer)

console.log('✅ PDF Slide Presentasi Visual (15 slides + narasi) berhasil dibuat:')
console.log('👉', path1)
console.log('👉', path2)
