import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

// Define project start date (Monday, Jan 5, 2026)
const START_DATE = new Date('2026-01-05');

// Colors
const PRIMARY_NAVY = '1A3C6E';
const SECONDARY_BLUE = '3478B9';
const ACCENT_AMBER = 'F19A28';
const TEXT_DARK = '1E1E1E';
const BORDER_COLOR = 'DCE8F6';
const LIGHT_STRIPE = 'F5F9FD';

// Phase colors for Gantt Chart bars & backgrounds
const PHASE_COLORS = [
  { main: '3498DB', light: 'EBF5FB', text: '1B4F72' }, // Inisiasi - Blue
  { main: '9B59B6', light: 'F5EEF8', text: '4A235A' }, // Desain - Purple
  { main: 'E74C3C', light: 'FDEDEC', text: '78281F' }, // Backend - Red
  { main: '2ECC71', light: 'EAFAF1', text: '145A32' }, // Frontend - Green
  { main: 'F1C40F', light: 'FEF9E7', text: '7D6608' }, // Testing - Yellow
  { main: '1ABC9C', light: 'E8F8F5', text: '0E6251' }, // Deployment - Teal
];

// Tasks definition based on WBS and Gantt
const tasks = [
  // Phase 1
  { code: '1', name: 'INISIASI & ANALISIS', pic: 'PM', startW: 1, durW: 2, phase: 0, isHeader: true },
  { code: '1.1', name: 'Kickoff Meeting & Pembentukan Tim', pic: 'PM', startW: 1, durW: 1, phase: 0, isHeader: false, checklist: 'Pembentukan tim; Pembagian peran; Penentuan media komunikasi; Kickoff meeting log' },
  { code: '1.2', name: 'Pengumpulan & Analisis Kebutuhan (BRD)', pic: 'PM + Analyst', startW: 1, durW: 2, phase: 0, isHeader: false, checklist: 'Wawancara stakeholder FND; Identifikasi alur rental lighting; Pembuatan dokumen BRD' },
  { code: '1.3', name: 'Studi Kelayakan Teknis & Finansial', pic: 'PM + Tech Lead', startW: 1, durW: 2, phase: 0, isHeader: false, checklist: 'Evaluasi infrastruktur serverless; Estimasi anggaran; Analisis kelayakan platform' },
  { code: '1.4', name: 'Penyusunan Dokumen Perencanaan Proyek', pic: 'PM', startW: 2, durW: 1, phase: 0, isHeader: false, checklist: 'Finalisasi WBS; Pembuatan Gantt Chart; Pengesahan dokumen perencanaan' },

  // Phase 2
  { code: '2', name: 'DESAIN SISTEM', pic: 'Tech Lead', startW: 2, durW: 2, phase: 1, isHeader: true },
  { code: '2.1', name: 'Desain Arsitektur (ERD, API Spec)', pic: 'Tech Lead', startW: 2, durW: 1, phase: 1, isHeader: false, checklist: 'Pembuatan ERD 8 entitas utama; Spesifikasi endpoint REST API; Mapping flow data' },
  { code: '2.2', name: 'Desain UI/UX Wireframe & Prototype (Figma)', pic: 'UI/UX Designer', startW: 3, durW: 2, phase: 1, isHeader: false, checklist: 'Wireframing desktop & mobile; Pembuatan UI design di Figma; User flow prototype' },
  { code: '2.3', name: 'Review & Approval Desain', pic: 'PM + Stakeholder', startW: 4, durW: 1, phase: 1, isHeader: false, checklist: 'Sesi presentasi desain ke FND Production; Walkthrough prototype; Approval layout' },

  // Phase 3
  { code: '3', name: 'PENGEMBANGAN BACKEND', pic: 'Backend Dev', startW: 4, durW: 4, phase: 2, isHeader: true },
  { code: '3.1', name: 'Setup Database MySQL & Schema Migration', pic: 'Backend Dev', startW: 4, durW: 1, phase: 2, isHeader: false, checklist: 'Setup PostgreSQL/MySQL; Eksekusi migration script; Seeding dummy data' },
  { code: '3.2', name: 'Implementasi REST API (Auth, Events, Crew)', pic: 'Backend Dev', startW: 5, durW: 2, phase: 2, isHeader: false, checklist: 'Setup JWT Auth; CRUD Profiles & Events; CRUD Crew & Calendars' },
  { code: '3.3', name: 'Implementasi API Equipment & Payments', pic: 'Backend Dev', startW: 6, durW: 2, phase: 2, isHeader: false, checklist: 'Algoritma Stock Collision Guard; CRUD Equipment; Integrasi pencatatan Payment' },
  { code: '3.4', name: 'Implementasi API Reports (PDF/Excel)', pic: 'Backend Dev', startW: 7, durW: 1, phase: 2, isHeader: false, checklist: 'Build generator engine; Export laporan keuangan bulanan; Export manifes sewa' },

  // Phase 4
  { code: '4', name: 'PENGEMBANGAN FRONTEND', pic: 'Frontend Dev', startW: 6, durW: 4, phase: 3, isHeader: true },
  { code: '4.1', name: 'Implementasi Admin Dashboard & Analytics', pic: 'Frontend Dev', startW: 6, durW: 2, phase: 3, isHeader: false, checklist: 'Pembuatan chart analitik Recharts; Panel ringkasan metrik; Table event tracking' },
  { code: '4.2', name: 'Implementasi Client Portal (Booking Wizard)', pic: 'Frontend Dev', startW: 7, durW: 2, phase: 3, isHeader: false, checklist: 'Multi-step booking form; Validasi real-time ketersediaan; Halaman invoice client' },
  { code: '4.3', name: 'Implementasi Crew Portal', pic: 'Frontend Dev', startW: 8, durW: 1, phase: 3, isHeader: false, checklist: 'Calendar view tugas kru harian; Status update checklist lapangan' },
  { code: '4.4', name: 'Integrasi Frontend ↔ Backend API', pic: 'Frontend Dev', startW: 8, durW: 2, phase: 3, isHeader: false, checklist: 'Koneksi client fetcher; Middleware verifikasi token; Handler error global' },

  // Phase 5
  { code: '5', name: 'PENGUJIAN & VALIDASI', pic: 'QA Engineer', startW: 9, durW: 2, phase: 4, isHeader: true },
  { code: '5.1', name: 'Unit Testing & Integration Testing', pic: 'QA Engineer', startW: 9, durW: 1, phase: 4, isHeader: false, checklist: 'Penulisan unit test endpoint Auth/CRUD; Uji beban Stock Guard; Validasi constraints' },
  { code: '5.2', name: 'User Acceptance Testing (UAT)', pic: 'QA + Stakeholder', startW: 10, durW: 1, phase: 4, isHeader: false, checklist: 'Demo fungsionalitas ke tim FND; Uji skenario sewa langsung; Tanda tangan berita acara' },
  { code: '5.3', name: 'Bug Fixing & Performance Optimization', pic: 'Full Team', startW: 10, durW: 1, phase: 4, isHeader: false, checklist: 'Fixing hydration error Next.js; Optimasi query index M:N database; Responsive mobile charts' },

  // Phase 6
  { code: '6', name: 'DEPLOYMENT & PELATIHAN', pic: 'DevOps', startW: 11, durW: 2, phase: 5, isHeader: true },
  { code: '6.1', name: 'Konfigurasi Server & CI/CD Pipeline', pic: 'DevOps / Backend Dev', startW: 11, durW: 1, phase: 5, isHeader: false, checklist: 'Konfigurasi server production; Setup GitHub Actions CI/CD; Integrasi environment variables' },
  { code: '6.2', name: 'Deployment ke Production (Vercel + MySQL)', pic: 'DevOps', startW: 11, durW: 1, phase: 5, isHeader: false, checklist: 'Push build final ke Vercel; Setup database production; SSL certificate activation' },
  { code: '6.3', name: 'Pelatihan & Penyerahan Dokumentasi', pic: 'PM + Tech Lead', startW: 12, durW: 1, phase: 5, isHeader: false, checklist: 'Sesi training tim operator FND; Penyerahan API docs & User Manual; Serah terima manual book' },
  { code: '6.4', name: 'Serah Terima Proyek (Project Closure)', pic: 'PM', startW: 12, durW: 1, phase: 5, isHeader: false, checklist: 'Penutupan administrasi proyek; Penyerahan laporan akhir KP; Tanda tangan closing statement' },
];

// Helper to calculate start & end dates based on week number
function getTaskDates(startW, durW) {
  const start = new Date(START_DATE.getTime());
  start.setDate(START_DATE.getDate() + (startW - 1) * 7);
  
  const end = new Date(start.getTime());
  end.setDate(start.getDate() + durW * 7 - 3); // -3 makes it end on Friday of that week (e.g. Mon-Fri workdays)
  
  return { start, end };
}

// Format date as DD-MM-YYYY
function formatDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

async function generateExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Edisyah Putra Waruwu (NIM: 411231179)';
  workbook.lastModifiedBy = 'Edisyah Putra Waruwu';
  workbook.created = new Date();
  workbook.modified = new Date();

  // =========================================================================
  // SHEET 1: JADWAL & GANTT CHART
  // =========================================================================
  const ws1 = workbook.addWorksheet('Gantt Chart 12 Minggu', {
    views: [{ showGridLines: true }]
  });

  // Set standard row heights
  ws1.properties.defaultRowHeight = 22;

  // Title Block styling
  ws1.mergeCells('A1:S1');
  ws1.mergeCells('A2:S2');
  ws1.mergeCells('A3:S3');

  const titleCell = ws1.getCell('A1');
  titleCell.value = 'RENCANA JADWAL PROYEK & GANTT CHART (12 MINGGU / 3 BULAN)';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  const subTitleCell = ws1.getCell('A2');
  subTitleCell.value = 'FND Production - Event Lighting Management System (Sistem Informasi Penyewaan Alat)';
  subTitleCell.font = { name: 'Segoe UI', size: 11, italic: true, color: { argb: 'FFFFFFFF' } };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECONDARY_BLUE } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  const metaCell = ws1.getCell('A3');
  metaCell.value = 'NAMA: EDISYAH PUTRA WARUWU  |  NIM: 411231179  |  PERIODE PROYEK: JANUARI - MARET 2026';
  metaCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECONDARY_BLUE } };
  metaCell.alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.getRow(1).height = 32;
  ws1.getRow(2).height = 20;
  ws1.getRow(3).height = 18;

  // Blank row
  ws1.getRow(4).height = 12;

  // Header 1: Month row
  ws1.mergeCells('A5:G5');
  const taskHeader = ws1.getCell('A5');
  taskHeader.value = 'IDENTIFIKASI TUGAS & TANGGAL';
  taskHeader.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  taskHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
  taskHeader.alignment = { horizontal: 'center', vertical: 'middle' };

  // Months cells
  const monthSpans = [
    { name: 'JANUARI 2026', range: 'H5:K5' },
    { name: 'FEBRUARI 2026', range: 'L5:O5' },
    { name: 'MARET 2026', range: 'P5:S5' }
  ];
  for (const m of monthSpans) {
    ws1.mergeCells(m.range);
    const mCell = ws1.getCell(m.range.split(':')[0]);
    mCell.value = m.name;
    mCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    mCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
    mCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }
  ws1.getRow(5).height = 25;

  // Header 2: Columns subheader
  const subheaders = [
    { col: 'A', name: 'KODE', width: 8 },
    { col: 'B', name: 'NAMA TUGAS / DELIVERABLE', width: 42 },
    { col: 'C', name: 'PIC TANGGUNG JAWAB', width: 22 },
    { col: 'D', name: 'MGG MULAI', width: 12 },
    { col: 'E', name: 'DURASI', width: 10 },
    { col: 'F', name: 'TGL MULAI', width: 14 },
    { col: 'G', name: 'TGL SELESAI', width: 14 }
  ];

  for (const sh of subheaders) {
    const cell = ws1.getCell(`${sh.col}6`);
    cell.value = sh.name;
    cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECONDARY_BLUE } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    ws1.getColumn(sh.col).width = sh.width;
  }

  // Weeks subheaders W1 to W12
  const weekCols = ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
  for (let i = 0; i < 12; i++) {
    const colName = weekCols[i];
    const cell = ws1.getCell(`${colName}6`);
    cell.value = `W${i + 1}`;
    cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECONDARY_BLUE } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws1.getColumn(colName).width = 7.5;
  }
  ws1.getRow(6).height = 24;

  // Populate data
  let currentRow = 7;
  let stripe = false;

  for (const t of tasks) {
    const row = ws1.getRow(currentRow);
    row.height = t.isHeader ? 22 : 20;

    // Calculate dates
    const { start, end } = getTaskDates(t.startW, t.durW);

    // Apply values
    ws1.getCell(`A${currentRow}`).value = t.code;
    ws1.getCell(`B${currentRow}`).value = t.name;
    ws1.getCell(`C${currentRow}`).value = t.pic;
    ws1.getCell(`D${currentRow}`).value = `Minggu ${t.startW}`;
    ws1.getCell(`E${currentRow}`).value = `${t.durW} Minggu`;
    ws1.getCell(`F${currentRow}`).value = formatDate(start);
    ws1.getCell(`G${currentRow}`).value = formatDate(end);

    // Styling values
    const textStyle = {
      name: 'Segoe UI',
      size: t.isHeader ? 9.5 : 9,
      bold: t.isHeader,
      color: { argb: t.isHeader ? 'FFFFFFFF' : TEXT_DARK }
    };

    const rowBg = t.isHeader 
      ? PHASE_COLORS[t.phase].main 
      : (stripe ? LIGHT_STRIPE : 'FFFFFF');

    // Color code and format WBS columns
    const colsToStyle = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    for (const colLetter of colsToStyle) {
      const cell = ws1.getCell(`${colLetter}${currentRow}`);
      cell.font = textStyle;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowBg }
      };
      
      // Alignments
      if (colLetter === 'B') {
        cell.alignment = { horizontal: 'left', vertical: 'middle', indent: t.isHeader ? 0 : 1 };
      } else {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }

      // Borders
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };
    }

    // Populate Gantt Chart Cells W1-W12
    for (let w = 0; w < 12; w++) {
      const colLetter = weekCols[w];
      const cell = ws1.getCell(`${colLetter}${currentRow}`);
      const inRange = (w + 1) >= t.startW && (w + 1) < t.startW + t.durW;

      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };

      if (inRange) {
        // Active week fill based on phase color
        const colorObj = PHASE_COLORS[t.phase];
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: t.isHeader ? colorObj.main : colorObj.light }
        };
        if (t.isHeader) {
          cell.value = '█'; // Solid visual anchor for header bar
          cell.font = { name: 'Segoe UI', size: 8, color: { argb: colorObj.main } };
        } else {
          cell.value = '✔'; // Friendly status checkmark
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: colorObj.text } };
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        // Empty cells background
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: t.isHeader ? rowBg : (stripe ? LIGHT_STRIPE : 'FFFFFF') }
        };
      }
    }

    if (!t.isHeader) {
      stripe = !stripe;
    }
    currentRow++;
  }

  // Blank row
  ws1.getRow(currentRow).height = 15;
  currentRow++;

  // Legend Title
  ws1.mergeCells(`A${currentRow}:S${currentRow}`);
  const legendTitleCell = ws1.getCell(`A${currentRow}`);
  legendTitleCell.value = 'LEGENDA WARNA FASE & PERENCANAAN MILSTONES';
  legendTitleCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  legendTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
  legendTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws1.getRow(currentRow).height = 22;
  currentRow++;

  // Phase legend cells
  const phaseNames = [
    'Fase 1: Inisiasi & Analisis',
    'Fase 2: Desain Sistem',
    'Fase 3: Pengembangan Backend',
    'Fase 4: Pengembangan Frontend',
    'Fase 5: Pengujian & Validasi',
    'Fase 6: Deployment & Pelatihan'
  ];

  // Set up 3 columns of legends (2 phases per row)
  for (let i = 0; i < 6; i += 2) {
    const row = ws1.getRow(currentRow);
    row.height = 24;

    // Left Legend Item
    ws1.mergeCells(`A${currentRow}:C${currentRow}`);
    const lBoxCell = ws1.getCell(`A${currentRow}`);
    lBoxCell.value = '███';
    lBoxCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PHASE_COLORS[i].main } };
    lBoxCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PHASE_COLORS[i].light } };
    lBoxCell.alignment = { horizontal: 'center', vertical: 'middle' };
    lBoxCell.border = { left: { style: 'thin', color: { argb: BORDER_COLOR } }, top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } } };

    ws1.mergeCells(`D${currentRow}:G${currentRow}`);
    const lTextCell = ws1.getCell(`D${currentRow}`);
    lTextCell.value = phaseNames[i];
    lTextCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: TEXT_DARK } };
    lTextCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: stripe ? LIGHT_STRIPE : 'FFFFFF' } };
    lTextCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    lTextCell.border = { right: { style: 'thin', color: { argb: BORDER_COLOR } }, top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } } };

    // Right Legend Item
    ws1.mergeCells(`H${currentRow}:J${currentRow}`);
    const rBoxCell = ws1.getCell(`H${currentRow}`);
    rBoxCell.value = '███';
    rBoxCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: PHASE_COLORS[i+1].main } };
    rBoxCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PHASE_COLORS[i+1].light } };
    rBoxCell.alignment = { horizontal: 'center', vertical: 'middle' };
    rBoxCell.border = { left: { style: 'thin', color: { argb: BORDER_COLOR } }, top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } } };

    ws1.mergeCells(`K${currentRow}:N${currentRow}`);
    const rTextCell = ws1.getCell(`K${currentRow}`);
    rTextCell.value = phaseNames[i+1];
    rTextCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: TEXT_DARK } };
    rTextCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: stripe ? LIGHT_STRIPE : 'FFFFFF' } };
    rTextCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    rTextCell.border = { right: { style: 'thin', color: { argb: BORDER_COLOR } }, top: { style: 'thin', color: { argb: BORDER_COLOR } }, bottom: { style: 'thin', color: { argb: BORDER_COLOR } } };

    // Notes cell next to legends
    if (i === 0) {
      ws1.mergeCells(`O${currentRow}:S${currentRow+2}`);
      const notesCell = ws1.getCell(`O${currentRow}`);
      notesCell.value = "Catatan Integrasi Trello:\n1. Setiap 'Nama Tugas' dipetakan sebagai Trello Card.\n2. Kolom 'PIC' mewakili Assignee di Trello.\n3. Gunakan lembar 'Panduan Import Trello' untuk mempermudah pemindahan tugas.";
      notesCell.font = { name: 'Segoe UI', size: 8, italic: true, color: { argb: 'FF5E5E5E' } };
      notesCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FCFF' } };
      notesCell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
      notesCell.border = {
        top: { style: 'medium', color: { argb: SECONDARY_BLUE } },
        bottom: { style: 'medium', color: { argb: SECONDARY_BLUE } },
        left: { style: 'medium', color: { argb: SECONDARY_BLUE } },
        right: { style: 'medium', color: { argb: SECONDARY_BLUE } }
      };
    }

    currentRow++;
  }


  // =========================================================================
  // SHEET 2: DAFTAR KARTU TRELLO (SYNC GUIDE)
  // =========================================================================
  const ws2 = workbook.addWorksheet('Panduan Import Trello', {
    views: [{ showGridLines: true }]
  });

  ws2.properties.defaultRowHeight = 22;

  // Title Block Sheet 2
  ws2.mergeCells('A1:F1');
  ws2.mergeCells('A2:F2');

  const tTitle = ws2.getCell('A1');
  tTitle.value = 'PANDUAN PEMINDAHAN TUGAS KE TRELLO BOARD (TRELLO CARD SYNC)';
  tTitle.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  tTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
  tTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  const tSub = ws2.getCell('A2');
  tSub.value = 'Salin tabel di bawah ini untuk membuat kartu di Trello dengan tanggal mulai, tanggal selesai, PIC, dan checklist penugasan.';
  tSub.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FFFFFFFF' } };
  tSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SECONDARY_BLUE } };
  tSub.alignment = { horizontal: 'center', vertical: 'middle' };

  ws2.getRow(1).height = 30;
  ws2.getRow(2).height = 20;

  // Blank row
  ws2.getRow(3).height = 12;

  // Table Headers
  const tHeaders = [
    { col: 'A', name: 'NAMA KARTU TRELLO', width: 45 },
    { col: 'B', name: 'TRELLO LIST (KOLOM)', width: 28 },
    { col: 'C', name: 'TANGGAL MULAI', width: 16 },
    { col: 'D', name: 'TANGGAL SELESAI (DUE)', width: 20 },
    { col: 'E', name: 'PIC (MEMBERS)', width: 22 },
    { col: 'F', name: 'CHECKLIST SUB-TUGAS / DELIVERABLES (DESKRIPSI KARTU)', width: 75 }
  ];

  for (const th of tHeaders) {
    const cell = ws2.getCell(`${th.col}4`);
    cell.value = th.name;
    cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PRIMARY_NAVY } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    ws2.getColumn(th.col).width = th.width;
  }
  ws2.getRow(4).height = 26;

  // Populate Trello Cards
  let tRow = 5;
  let tStripe = false;

  for (const t of tasks) {
    if (t.isHeader) {
      // We skip WBS group headers for card rows or we write them beautifully as list section indicators
      continue;
    }

    const { start, end } = getTaskDates(t.startW, t.durW);
    const row = ws2.getRow(tRow);
    row.height = 35; // Taller rows for readability of checklists

    const cardTitle = `[WBS ${t.code}] ${t.name}`;
    const trelloList = `Sprint ${t.phase + 1} - ${phaseNames[t.phase].split(': ')[1]}`;
    
    ws2.getCell(`A${tRow}`).value = cardTitle;
    ws2.getCell(`B${tRow}`).value = trelloList;
    ws2.getCell(`C${tRow}`).value = formatDate(start);
    ws2.getCell(`D${tRow}`).value = formatDate(end);
    ws2.getCell(`E${tRow}`).value = t.pic;
    ws2.getCell(`F${tRow}`).value = t.checklist.split('; ').map((item, idx) => `[ ] ${idx + 1}. ${item}`).join('\n');

    const rowBg = tStripe ? LIGHT_STRIPE : 'FFFFFF';

    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (const c of cols) {
      const cell = ws2.getCell(`${c}${tRow}`);
      cell.font = { name: 'Segoe UI', size: 9, color: { argb: TEXT_DARK } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };

      if (c === 'F') {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      } else if (c === 'A') {
        cell.alignment = { horizontal: 'left', vertical: 'middle', font: { bold: true } };
      } else {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }

    tStripe = !tStripe;
    tRow++;
  }

  // Write workbook to file
  const filename = 'Jadwal_Proyek_FND_Production.xlsx';
  const filepath = path.resolve('g:/Tugas/KP/FND_Production', filename);
  await workbook.xlsx.writeFile(filepath);
  console.log(`Excel file successfully created at: ${filepath}`);
}

generateExcel().catch(err => {
  console.error('Error generating Excel file:', err);
});
