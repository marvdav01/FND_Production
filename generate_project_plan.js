import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { jsPDF } = require('jspdf')
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable')

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

function rgbSet(doc, [r, g, b]) { doc.setDrawColor(r,g,b); doc.setFillColor(r,g,b); doc.setTextColor(r,g,b) }

// ══════════════════════════════════════════════════════════════════════════
// PAGE 1 – COVER
// ══════════════════════════════════════════════════════════════════════════
// Gradient-like header block
doc.setFillColor(...PRIMARY)
doc.rect(0, 0, W, 75, 'F')

doc.setFillColor(...SECONDARY)
doc.rect(0, 72, W, 6, 'F')

doc.setFillColor(...ACCENT)
doc.rect(0, 75, W, 4, 'F')

// Decorative circles
doc.setFillColor(255,255,255,0.06)
doc.setGState ? null : null
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
doc.text('RENCANA MANAJEMEN PROYEK', W/2, 95, { align: 'center' })

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
doc.text('Dokumen Perencanaan Proyek  •  Tugas Kerja Praktek (KP)', W/2, 131, { align: 'center' })

// Info card
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, 140, CW, 60, 4, 4, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, 140, CW, 60, 4, 4, 'S')

const infoRows = [
  ['Nama Mahasiswa', 'Edisyah Putra Waruwu', '411231179'],
  ['Program Studi',  'Informatika – Universitas Dian Nusantara', ''],
  ['Periode KP',     'Januari – Mei 2026', ''],
  ['Versi Dokumen',  'v1.0', ''],
  ['Tanggal Dibuat', new Date().toLocaleDateString('id-ID', {year:'numeric',month:'long',day:'numeric'}), ''],
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
doc.setFillColor(...ACCENT)
doc.roundedRect(ML, 210, 55, 14, 3, 3, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(9)
doc.text('STATUS: DRAFT', ML+27.5, 218.5, { align: 'center' })

doc.setFillColor(...PRIMARY)
doc.roundedRect(ML+60, 210, 55, 14, 3, 3, 'F')
doc.text('PROYEK: AKTIF', ML+87.5, 218.5, { align: 'center' })

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
  doc.text('FND PRODUCTION – Rencana Manajemen Proyek', ML, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(title, W - MR, 13, { align: 'right' })

  doc.setFillColor(...PRIMARY)
  doc.rect(0, H-14, W, 14, 'F')
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text('Dokumen Perencanaan KP  •  Informatika UNDIRA  •  2026', ML, H-6)
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
// PAGE 2 – WBS
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(2, 'Work Breakdown Structure')

let y = 30
y = sectionTitle(doc, '1.  Work Breakdown Structure (WBS) – FND Production', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...MID)
doc.text('WBS mendekomposisikan seluruh lingkup pekerjaan proyek menjadi unit-unit terkelola (paket kerja / work packages).', ML, y)
y += 8

const wbsData = [
  ['Kode', 'Level 1 – Fase', 'Level 2 – Deliverable / Work Package', 'PIC'],
  // 1
  ['1', 'INISIASI & ANALISIS', '', ''],
  ['1.1', '', 'Kickoff Meeting & Pembentukan Tim', 'PM'],
  ['1.2', '', 'Pengumpulan & Analisis Kebutuhan (BRD)', 'PM + Analyst'],
  ['1.3', '', 'Studi Kelayakan Teknis & Finansial', 'PM + Tech Lead'],
  ['1.4', '', 'Penyusunan Dokumen Perencanaan Proyek', 'PM'],
  // 2
  ['2', 'DESAIN SISTEM', '', ''],
  ['2.1', '', 'Desain Arsitektur (ERD, API Spec)', 'Tech Lead'],
  ['2.2', '', 'Desain UI/UX Wireframe & Prototype (Figma)', 'UI/UX Designer'],
  ['2.3', '', 'Review & Approval Desain', 'PM + Stakeholder'],
  // 3
  ['3', 'PENGEMBANGAN BACKEND', '', ''],
  ['3.1', '', 'Setup Database MySQL & Schema Migration', 'Backend Dev'],
  ['3.2', '', 'Implementasi REST API (Auth, Events, Crew)', 'Backend Dev'],
  ['3.3', '', 'Implementasi API Equipment & Payments', 'Backend Dev'],
  ['3.4', '', 'Implementasi API Reports (PDF/Excel)', 'Backend Dev'],
  // 4
  ['4', 'PENGEMBANGAN FRONTEND', '', ''],
  ['4.1', '', 'Implementasi Admin Dashboard & Analytics', 'Frontend Dev'],
  ['4.2', '', 'Implementasi Client Portal (Booking Wizard)', 'Frontend Dev'],
  ['4.3', '', 'Implementasi Crew Portal', 'Frontend Dev'],
  ['4.4', '', 'Integrasi Frontend ↔ Backend API', 'Frontend Dev'],
  // 5
  ['5', 'PENGUJIAN & VALIDASI', '', ''],
  ['5.1', '', 'Unit Testing & Integration Testing', 'QA Engineer'],
  ['5.2', '', 'User Acceptance Testing (UAT)', 'QA + Stakeholder'],
  ['5.3', '', 'Bug Fixing & Performance Optimization', 'Full Team'],
  // 6
  ['6', 'DEPLOYMENT & PELATIHAN', '', ''],
  ['6.1', '', 'Konfigurasi Server & CI/CD Pipeline', 'DevOps / Backend Dev'],
  ['6.2', '', 'Deployment ke Production (Vercel + MySQL)', 'DevOps'],
  ['6.3', '', 'Pelatihan & Penyerahan Dokumentasi', 'PM + Tech Lead'],
  ['6.4', '', 'Serah Terima Proyek (Project Closure)', 'PM'],
]

autoTable(doc, {
  startY: y,
  head: [wbsData[0]],
  body: wbsData.slice(1),
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.2, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
    1: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY },
    2: { cellWidth: CW - 14 - 38 - 30 },
    3: { cellWidth: 30, halign: 'center', textColor: SECONDARY },
  },
  didParseCell(data) {
    const lv1Codes = ['1','2','3','4','5','6']
    if (data.section === 'body' && data.column.index === 0 && lv1Codes.includes(data.cell.raw)) {
      data.row.cells[0].styles.fillColor = LIGHT
      data.row.cells[0].styles.textColor = PRIMARY
      data.row.cells[0].styles.fontStyle = 'bold'
      data.row.cells[1].styles.fillColor = LIGHT
      data.row.cells[1].styles.textColor = PRIMARY
      data.row.cells[2].styles.fillColor = LIGHT
      data.row.cells[3].styles.fillColor = LIGHT
    }
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 – GANTT CHART
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(3, 'Jadwal Proyek – Gantt Chart')

y = 30
y = sectionTitle(doc, '2.  Jadwal Proyek – Gantt Chart  (12 Minggu / 3 Bulan)', y)

doc.setFontSize(8.5)
doc.setTextColor(...MID)
doc.text('Proyek berjalan selama 12 minggu dimulai dari Januari 2026. Setiap fase dirancang dengan buffer waktu antar fase.', ML, y)
y += 9

// Weeks header
const weeks = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']
const months = [['Jan 2026',4],['Feb 2026',4],['Mar 2026',4]]
const taskColW = 52
const wkColW   = (CW - taskColW) / weeks.length

// Month row
doc.setFillColor(...PRIMARY)
doc.rect(ML + taskColW, y, CW - taskColW, 7, 'F')
let mx = ML + taskColW
for (const [label, span] of months) {
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.text(label, mx + span * wkColW / 2, y + 5, { align: 'center' })
  doc.setDrawColor(...SECONDARY)
  doc.setLineWidth(0.3)
  if (label !== 'Mar 2026') doc.line(mx + span * wkColW, y, mx + span * wkColW, y + 7)
  mx += span * wkColW
}

y += 7

// Week sub-row
doc.setFillColor(...SECONDARY)
doc.rect(ML, y, taskColW, 7, 'F')
doc.setFont('helvetica', 'bold')
doc.setTextColor(...WHITE)
doc.setFontSize(7.5)
doc.text('Kegiatan / Task', ML + taskColW / 2, y + 5, { align: 'center' })

let wx = ML + taskColW
for (const w of weeks) {
  doc.setFillColor(...SECONDARY)
  doc.rect(wx, y, wkColW, 7, 'F')
  doc.setTextColor(...WHITE)
  doc.text(w, wx + wkColW / 2, y + 5, { align: 'center' })
  doc.setDrawColor(255,255,255)
  doc.setLineWidth(0.2)
  doc.line(wx, y, wx, y + 7)
  wx += wkColW
}
y += 7

// Tasks: [label, startWeek(1-based), durationWeeks, phase, isPrimary]
const ganttTasks = [
  // Phase 1 – Inisiasi
  ['1. Kickoff & Analisis Kebutuhan', 1, 2, 0, true],
  ['1.1 Kickoff Meeting', 1, 1, 0, false],
  ['1.2 BRD & Studi Kelayakan', 1, 2, 0, false],
  ['1.3 Dokumen Perencanaan', 2, 1, 0, false],
  // Phase 2 – Desain
  ['2. Desain Sistem', 2, 2, 1, true],
  ['2.1 Arsitektur & ERD', 2, 1, 1, false],
  ['2.2 UI/UX Wireframe', 3, 2, 1, false],
  ['2.3 Review Desain', 4, 1, 1, false],
  // Phase 3 – Backend
  ['3. Pengembangan Backend', 4, 4, 2, true],
  ['3.1 Database & Schema', 4, 1, 2, false],
  ['3.2 API Auth & Events', 5, 2, 2, false],
  ['3.3 API Equipment & Payment', 6, 2, 2, false],
  ['3.4 API Reports', 7, 1, 2, false],
  // Phase 4 – Frontend
  ['4. Pengembangan Frontend', 6, 4, 3, true],
  ['4.1 Admin Dashboard', 6, 2, 3, false],
  ['4.2 Client Portal', 7, 2, 3, false],
  ['4.3 Crew Portal', 8, 1, 3, false],
  ['4.4 Integrasi API', 8, 2, 3, false],
  // Phase 5 – Testing
  ['5. Pengujian & Validasi', 9, 2, 4, true],
  ['5.1 Unit & Integration Test', 9, 1, 4, false],
  ['5.2 UAT', 10, 1, 4, false],
  ['5.3 Bug Fixing', 10, 1, 4, false],
  // Phase 6 – Deployment
  ['6. Deployment & Pelatihan', 11, 2, 5, true],
  ['6.1 CI/CD & Deploy', 11, 1, 5, false],
  ['6.2 Pelatihan', 12, 1, 5, false],
  ['6.3 Serah Terima', 12, 1, 5, false],
]

const phaseColors = [
  [52, 152, 219],   // blue   – Inisiasi
  [155, 89, 182],   // purple – Desain
  [231, 76, 60],    // red    – Backend
  [46, 204, 113],   // green  – Frontend
  [241, 196, 15],   // yellow – Testing
  [26, 188, 156],   // teal   – Deployment
]

const rowH = 7
let rowAlt = false

for (const [label, start, dur, phase, isPhase] of ganttTasks) {
  // Row bg
  if (isPhase) {
    doc.setFillColor(...LIGHT)
  } else {
    doc.setFillColor(rowAlt ? 248 : 255, rowAlt ? 252 : 255, rowAlt ? 255 : 255)
    rowAlt = !rowAlt
  }
  doc.rect(ML, y, CW, rowH, 'F')

  // Label
  doc.setFont('helvetica', isPhase ? 'bold' : 'normal')
  doc.setTextColor(...(isPhase ? PRIMARY : DARK))
  doc.setFontSize(7)
  const indent = isPhase ? 2 : 5
  doc.text(label, ML + indent, y + 4.8)

  // Grid + bars
  for (let w = 0; w < 12; w++) {
    const cx = ML + taskColW + w * wkColW
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.15)
    doc.line(cx, y, cx, y + rowH)

    const inRange = (w + 1) >= start && (w + 1) < start + dur
    if (inRange) {
      const [pr, pg, pb] = phaseColors[phase]
      if (isPhase) {
        doc.setFillColor(pr, pg, pb)
        doc.rect(cx + 0.5, y + 1.5, wkColW - 1, rowH - 3, 'F')
      } else {
        doc.setFillColor(pr, pg, pb, 0.6)
        doc.setFillColor(Math.min(pr+40,255), Math.min(pg+40,255), Math.min(pb+40,255))
        doc.rect(cx + 1, y + 2.5, wkColW - 2, rowH - 5, 'F')
      }
    }
  }

  // Row border
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.15)
  doc.line(ML, y + rowH, ML + CW, y + rowH)
  y += rowH
}

// Right border
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.rect(ML, 44, CW, y - 44, 'S')

// Legend
y += 5
doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...PRIMARY)
doc.text('Legenda Warna Fase:', ML, y)
y += 5

const phaseLabels = ['1. Inisiasi', '2. Desain', '3. Backend', '4. Frontend', '5. Testing', '6. Deployment']
let lx = ML
for (let i = 0; i < 6; i++) {
  const [r,g,b] = phaseColors[i]
  doc.setFillColor(r,g,b)
  doc.rect(lx, y - 3, 6, 4, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...DARK)
  doc.text(phaseLabels[i], lx + 8, y)
  lx += 30
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 – IDENTIFIKASI SUMBER DAYA
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(4, 'Identifikasi Sumber Daya')

y = 30
y = sectionTitle(doc, '3.  Identifikasi Sumber Daya', y)

// Human Resources
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('A.  Sumber Daya Manusia (SDM)', ML, y)
y += 4

autoTable(doc, {
  startY: y,
  head: [['Peran', 'Jumlah', 'Tanggung Jawab Utama', 'Level Keterlibatan']],
  body: [
    ['Project Manager',    '1 orang', 'Perencanaan, monitoring, komunikasi stakeholder', 'Full-time (100%)'],
    ['Backend Developer',  '1 orang', 'REST API, Database, Server-side logic (Node.js/Express)', 'Full-time (100%)'],
    ['Frontend Developer', '1 orang', 'UI Next.js, integrasi API, komponen shadcn/ui', 'Full-time (100%)'],
    ['UI/UX Designer',     '1 orang', 'Wireframe, prototype Figma, design system', 'Part-time (60%)'],
    ['QA Engineer',        '1 orang', 'Test planning, unit/integration/UAT testing', 'Part-time (50%)'],
    ['DBA / DevOps',       '1 orang', 'Database tuning, CI/CD pipeline, deployment Vercel', 'Part-time (40%)'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, lineColor: BORDER, lineWidth: 0.2 },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: 22, halign: 'center' },
    2: { cellWidth: CW - 38 - 22 - 35 },
    3: { cellWidth: 35, halign: 'center', textColor: SECONDARY },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 8

// Hardware
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('B.  Perangkat Keras (Hardware)', ML, y)
y += 4

autoTable(doc, {
  startY: y,
  head: [['Perangkat', 'Spesifikasi', 'Jumlah', 'Keterangan']],
  body: [
    ['Laptop Developer', 'Core i5/i7 Gen-11+, RAM 16 GB, SSD 512 GB', '3 unit', 'Sudah dimiliki tim'],
    ['Laptop PM / QA',   'Core i5, RAM 8 GB, SSD 256 GB', '2 unit', 'Sudah dimiliki tim'],
    ['Smartphone Android', 'Android 12+, RAM 6 GB', '2 unit', 'Testing mobile UI'],
    ['Router / Switch',  'Jaringan LAN lokal development', '1 unit', 'Sudah tersedia'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: 2.5, lineColor: BORDER, lineWidth: 0.2 },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: CW - 38 - 22 - 35 },
    2: { cellWidth: 22, halign: 'center' },
    3: { cellWidth: 35, textColor: MID },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

y = doc.lastAutoTable.finalY + 8

// Software
doc.setFont('helvetica', 'bold')
doc.setFontSize(9)
doc.setTextColor(...SECONDARY)
doc.text('C.  Perangkat Lunak (Software)', ML, y)
y += 4

autoTable(doc, {
  startY: y,
  head: [['Software', 'Fungsi', 'Lisensi / Biaya']],
  body: [
    ['VS Code',        'IDE utama pengembangan', 'Open Source – Gratis'],
    ['Node.js / npm',  'Runtime backend & package manager', 'Open Source – Gratis'],
    ['Next.js 16',     'Framework frontend (React)', 'Open Source – Gratis'],
    ['MySQL 8 / XAMPP','Database relasional lokal', 'Open Source – Gratis'],
    ['Postman',        'API testing & dokumentasi', 'Gratis (Basic Plan)'],
    ['Figma',          'UI/UX design & prototyping', 'Gratis (Free Plan)'],
    ['Vercel',         'Deployment & hosting frontend', 'Gratis (Hobby Plan)'],
    ['GitHub',         'Version control & kolaborasi kode', 'Gratis (Free Plan)'],
    ['Git',            'Distributed version control', 'Open Source – Gratis'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 8, cellPadding: 2.5, lineColor: BORDER, lineWidth: 0.2 },
  headStyles: { fillColor: SECONDARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 40, fontStyle: 'bold', textColor: PRIMARY },
    1: { cellWidth: CW - 40 - 50 },
    2: { cellWidth: 50, textColor: [46, 204, 113], fontStyle: 'bold' },
  },
  alternateRowStyles: { fillColor: [249, 252, 255] },
})

// ══════════════════════════════════════════════════════════════════════════
// PAGE 5 – ESTIMASI ANGGARAN PROYEK & SIGN-OFF
// ══════════════════════════════════════════════════════════════════════════
doc.addPage()
addPageChrome(5, 'Estimasi Anggaran Proyek')

y = 30
y = sectionTitle(doc, '4.  Estimasi Anggaran Proyek', y)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8.5)
doc.setTextColor(...MID)
doc.text('Estimasi berbasis tarif pasar freelancer / junior developer Indonesia (IDR), durasi proyek 3 bulan.', ML, y)
y += 8

autoTable(doc, {
  startY: y,
  head: [['No', 'Komponen Biaya', 'Keterangan', 'Volume', 'Satuan Biaya (Rp)', 'Total (Rp)']],
  body: [
    // Labor
    ['1', 'Tenaga Kerja – PM',             'Selama 3 bulan',   '3 bln', '3.000.000', '9.000.000'],
    ['2', 'Tenaga Kerja – Backend Dev',    'Selama 3 bulan',   '3 bln', '3.500.000', '10.500.000'],
    ['3', 'Tenaga Kerja – Frontend Dev',   'Selama 3 bulan',   '3 bln', '3.500.000', '10.500.000'],
    ['4', 'Tenaga Kerja – UI/UX Designer', 'Selama 2 bulan',   '2 bln', '2.500.000', '5.000.000'],
    ['5', 'Tenaga Kerja – QA Engineer',    'Selama 1,5 bulan', '1,5 bln','2.000.000','3.000.000'],
    ['6', 'Tenaga Kerja – DevOps/DBA',     'Selama 1 bulan',   '1 bln', '3.000.000', '3.000.000'],
    ['', 'SUB-TOTAL TENAGA KERJA', '', '', '', '41.000.000'],
    // Hardware
    ['7', 'Sewa / Penyusutan Laptop Dev',  '3 unit × 3 bulan', '9 unit-bln','150.000','1.350.000'],
    ['8', 'Sewa / Penyusutan Laptop PM',   '2 unit × 3 bulan', '6 unit-bln','100.000','600.000'],
    ['9', 'Perangkat Uji Mobile',          'Biaya alokasi penggunaan', '2 unit','200.000','400.000'],
    ['', 'SUB-TOTAL HARDWARE', '', '', '', '2.350.000'],
    // Software
    ['10','Lisensi Software', 'Seluruh software open source / gratis', '-', '-', '0'],
    ['', 'SUB-TOTAL SOFTWARE', '', '', '', '0'],
    // Infrastructure
    ['11','Domain (.com, 1 tahun)',         'fndproduction.com',  '1 thn','200.000','200.000'],
    ['12','VPS / Cloud Hosting MySQL',      'DigitalOcean Droplet $12/bln × 3', '3 bln','180.000','540.000'],
    ['13','SSL Certificate',               'Gratis via Let\'s Encrypt', '-','-','0'],
    ['', 'SUB-TOTAL INFRASTRUKTUR', '', '', '', '740.000'],
    // Training
    ['14','Materi Pelatihan & Manual',      'Buku panduan pengguna cetak',  '3 eksemplar','100.000','300.000'],
    ['15','Sesi Pelatihan Pengguna',        'Fasilitator internal, 2 sesi', '2 sesi','250.000','500.000'],
    ['', 'SUB-TOTAL PELATIHAN', '', '', '', '800.000'],
    // Total
    ['', 'TOTAL BIAYA PROYEK', '', '', '', '44.890.000'],
    ['', 'Kontingensi 10%', 'Buffer untuk risiko & perubahan lingkup', '', '', '4.489.000'],
    ['', 'GRAND TOTAL', '', '', '', '49.379.000'],
  ],
  margin: { left: ML, right: MR },
  styles: { fontSize: 7.5, cellPadding: 2.2, lineColor: BORDER, lineWidth: 0.2, textColor: DARK },
  headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold', fontSize: 8.5 },
  columnStyles: {
    0: { cellWidth: 10, halign: 'center' },
    1: { cellWidth: 48 },
    2: { cellWidth: CW - 10 - 48 - 20 - 32 - 32 },
    3: { cellWidth: 20, halign: 'center' },
    4: { cellWidth: 32, halign: 'right' },
    5: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
  },
  didParseCell(data) {
    const subRows  = ['SUB-TOTAL TENAGA KERJA','SUB-TOTAL HARDWARE','SUB-TOTAL SOFTWARE','SUB-TOTAL INFRASTRUKTUR','SUB-TOTAL PELATIHAN']
    const grandRow = ['TOTAL BIAYA PROYEK', 'Kontingensi 10%', 'GRAND TOTAL']
    if (data.section !== 'body') return
    const raw = String(data.cell.raw)
    if (subRows.some(s => raw.includes(s))) {
      data.cell.styles.fillColor = LIGHT
      data.cell.styles.textColor = PRIMARY
      data.cell.styles.fontStyle = 'bold'
    }
    if (raw === 'TOTAL BIAYA PROYEK') {
      data.cell.styles.fillColor = SECONDARY; data.cell.styles.textColor = WHITE; data.cell.styles.fontStyle = 'bold'
    }
    if (raw === 'Kontingensi 10%') {
      data.cell.styles.fillColor = [255,243,215]; data.cell.styles.textColor = [150,80,0]; data.cell.styles.fontStyle = 'bold'
    }
    if (raw === 'GRAND TOTAL') {
      data.cell.styles.fillColor = PRIMARY; data.cell.styles.textColor = WHITE; data.cell.styles.fontStyle = 'bold'; data.cell.styles.fontSize = 8.5
    }
    if (raw === '49.379.000' || raw === '44.890.000') {
      data.cell.styles.fontStyle = 'bold'
    }
  },
})

// Signature / Sign-Off Block
let sigY = doc.lastAutoTable.finalY + 10
doc.setFillColor(...LIGHT)
doc.roundedRect(ML, sigY, CW, 38, 3, 3, 'F')
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.3)
doc.roundedRect(ML, sigY, CW, 38, 3, 3, 'S')

doc.setFont('helvetica', 'bold')
doc.setFontSize(8.5)
doc.setTextColor(...PRIMARY)
doc.text('Diajukan Oleh,', ML + 15, sigY + 7)
doc.text('Disetujui Oleh,', ML + CW/2 + 15, sigY + 7)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7.5)
doc.setTextColor(...MID)
doc.text('Mahasiswa Informatika UNDIRA', ML + 15, sigY + 11)
doc.text('Dosen Pembimbing Kerja Praktek', ML + CW/2 + 15, sigY + 11)

// Signature lines
doc.setDrawColor(...BORDER)
doc.setLineWidth(0.2)
doc.line(ML + 15, sigY + 27, ML + 75, sigY + 27)
doc.line(ML + CW/2 + 15, sigY + 27, ML + CW/2 + 75, sigY + 27)

doc.setFont('helvetica', 'bold')
doc.setFontSize(8)
doc.setTextColor(...DARK)
doc.text('Edisyah Putra Waruwu', ML + 15, sigY + 31)
doc.text('(Nama Dosen Pembimbing)', ML + CW/2 + 15, sigY + 31)

doc.setFont('helvetica', 'normal')
doc.setFontSize(7)
doc.setTextColor(...MID)
doc.text('NIM: 411231179', ML + 15, sigY + 35)
doc.text('NIDN: _________________', ML + CW/2 + 15, sigY + 35)

// Save
const fs = await import('fs')
const path = await import('path')
const outputPath = path.resolve('Rencana_Proyek_FND_Production.pdf')
const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
fs.writeFileSync(outputPath, pdfBuffer)
console.log('✅ PDF berhasil dibuat:', outputPath)
