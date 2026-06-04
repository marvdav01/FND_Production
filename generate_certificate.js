import { jsPDF } from "jspdf";
import fs from 'fs';

// Create a new PDF document in landscape mode
const doc = new jsPDF({
  orientation: "landscape",
  unit: "mm",
  format: "a4"
});

// Width and height of A4 landscape: 297 x 210 mm
const width = doc.internal.pageSize.getWidth();
const height = doc.internal.pageSize.getHeight();

// 1. Draw Background
doc.setFillColor(252, 252, 252);
doc.rect(0, 0, width, height, 'F');

// 2. Draw Borders
// Outer thick dark border
doc.setDrawColor(33, 37, 41);
doc.setLineWidth(2);
doc.rect(10, 10, width - 20, height - 20);

// Inner gold border
doc.setDrawColor(212, 175, 55); // Gold color
doc.setLineWidth(1);
doc.rect(13, 13, width - 26, height - 26);

// Inner thin border
doc.setDrawColor(33, 37, 41);
doc.setLineWidth(0.5);
doc.rect(15, 15, width - 30, height - 30);

// 3. Draw Corner Decorations (Geometrical)
// Top Left
doc.setFillColor(33, 37, 41);
doc.triangle(10, 10, 50, 10, 10, 50, 'F');
doc.setFillColor(212, 175, 55);
doc.triangle(10, 10, 45, 10, 10, 45, 'F');

// Bottom Right
doc.setFillColor(33, 37, 41);
doc.triangle(width - 10, height - 10, width - 50, height - 10, width - 10, height - 50, 'F');
doc.setFillColor(212, 175, 55);
doc.triangle(width - 10, height - 10, width - 45, height - 10, width - 10, height - 45, 'F');

// Top Right
doc.setFillColor(212, 175, 55);
doc.triangle(width - 10, 10, width - 30, 10, width - 10, 30, 'F');

// Bottom Left
doc.setFillColor(212, 175, 55);
doc.triangle(10, height - 10, 30, height - 10, 10, height - 30, 'F');

// 4. Text Content
doc.setTextColor(33, 37, 41);

// Main Title
doc.setFont("helvetica", "bold");
doc.setFontSize(36);
doc.text("CERTIFICATE OF INTERNSHIP", width / 2, 45, { align: "center" });

// Subtitle
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(100, 100, 100);
doc.text("SERTIFIKAT KERJA PRAKTEK", width / 2, 53, { align: "center" });

// Presenter text
doc.setFont("helvetica", "italic");
doc.setFontSize(14);
doc.setTextColor(50, 50, 50);
doc.text("This certificate is proudly presented to:", width / 2, 75, { align: "center" });

// Student Name
doc.setFont("times", "bolditalic");
doc.setFontSize(44);
doc.setTextColor(212, 175, 55); // Gold
doc.text("Edisyah Putra Waruwu", width / 2, 95, { align: "center" });

// NIM and University
doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(80, 80, 80);
doc.text("NIM: 411231179 | Universitas Dian Nusantara (UNDIRA)", width / 2, 105, { align: "center" });

// Body Text
doc.setFont("helvetica", "normal");
doc.setFontSize(14);
doc.setTextColor(33, 37, 41);
let bodyText = "For successfully completing the Internship Program (Kerja Praktek) as a\nFull Stack Developer / Software Engineer\nat FND Production (Event Lighting Management System)\nfrom March 2026 to May 2026.";
doc.text(bodyText, width / 2, 125, { align: "center", lineHeightFactor: 1.5 });

// Appreciation Text
doc.setFont("helvetica", "italic");
doc.setFontSize(12);
doc.setTextColor(80, 80, 80);
doc.text("In recognition of outstanding dedication, excellent performance, and valuable contribution\nto the development of the Event Lighting Management System.", width / 2, 150, { align: "center", lineHeightFactor: 1.5 });

// 5. Signatures
doc.setTextColor(33, 37, 41);

// Left signature (Company)
doc.setDrawColor(33, 37, 41);
doc.setLineWidth(0.5);
doc.line(40, 180, 100, 180);
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("FND Production Management", 70, 187, { align: "center" });
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("Company Director", 70, 193, { align: "center" });

// Right signature (University)
doc.line(width - 100, 180, width - 40, 180);
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Dosen Pembimbing KP", width - 70, 187, { align: "center" });
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("Universitas Dian Nusantara", width - 70, 193, { align: "center" });

// 6. Date of Issue / Seal area
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(150, 150, 150);
doc.text("Date of Issue: 26 Mei 2026", width / 2, 193, { align: "center" });

// Draw a simple circular "Seal" in the middle bottom
doc.setDrawColor(212, 175, 55);
doc.setFillColor(252, 252, 252);
doc.setLineWidth(1);
doc.circle(width / 2, 178, 10, 'FD');
doc.setFont("times", "bold");
doc.setFontSize(10);
doc.setTextColor(212, 175, 55);
doc.text("FND", width / 2, 177, { align: "center" });
doc.text("PRO", width / 2, 181, { align: "center" });

// Save PDF
const fileName = "Sertifikat_Magang_Edisyah_Putra_Waruwu.pdf";
const buffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(fileName, buffer);
console.log(`Certificate successfully generated: ${fileName}`);
