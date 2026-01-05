// utils/generateBlockReport.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { THEMES } from '@/utils/csvParser';

export const THEME_COLORS: Record<string, string> = {
  health: '#ef4444',
  nutrition: '#f59e0b',
  basicInfra: '#3b82f6',
  socialDevelopment: '#8b5cf6',
  education: '#22c55e',
  agriculture: '#16a34a'
};


export const generateBlockReport = (
  block: any,
  rankingMap: Record<number, number>
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  /* ---------------- Header ---------------- */
  doc.setFontSize(20);
  doc.text(block.blockName, 14, y);
  y += 7;

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(block.districtName, 14, y);
  y += 10;

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`Overall Rank: ${rankingMap[block.sno] ?? 'N/A'}`, 14, y);
  y += 6;

  doc.text(
    `Balanced Composite Score: ${block.balancedCompositeScore ?? 'N/A'}`,
    14,
    y
  );
  y += 12;

  /* ---------------- Theme-wise Sections ---------------- */
  Object.keys(THEMES).forEach(themeKey => {
    const theme = THEMES[themeKey];
    const themeData = block[themeKey];
    if (!themeData) return;

    // Section title
    doc.setFontSize(14);
    doc.setTextColor(THEME_COLORS[themeKey]);
    doc.text(theme.name, 14, y);
    y += 4;

    doc.setDrawColor(THEME_COLORS[themeKey]);
    doc.line(14, y, 196, y);
    y += 6;

    // Indicators table
    autoTable(doc, {
      startY: y,
      head: [['Indicator', 'Value (%)']],
      body: Object.keys(theme.indicators).map(indKey => [
        theme.indicators[indKey],
        themeData[indKey] ?? 'N/A'
      ]),
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: THEME_COLORS[themeKey],
        textColor: 255
      },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 4;

    // Composite + Rank
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(
      `Composite Score: ${themeData.compositeScore ?? 'N/A'}   |   Rank: ${themeData.rank ?? 'N/A'}`,
      14,
      y
    );

    y += 10;
  });

  /* ---------------- Insights ---------------- */
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text('Key Insights', 14, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(
    `• ${block.blockName} performs strongest in ${
      Object.keys(THEMES).sort(
        (a, b) => block[a]?.rank - block[b]?.rank
      )[0]
    }.`,
    14,
    y
  );
  y += 5;

  doc.text(
    `• Improvement opportunities exist in lower-ranked thematic areas.`,
    14,
    y
  );

  /* ---------------- Signature (hidden in plain sight) ---------------- */
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'crafted with intent · Himanshu C',
    105,
    290,
    { align: 'center' }
  );

  doc.save(`${block.blockName}_Report.pdf`);
};
