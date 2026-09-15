/**
 * Generates the free downloadable printables in /public/downloads as
 * clean, print-ready PDF files. No external dependencies.
 *
 * Run: node scripts/generate-pdfs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 36;

class PDFBuilder {
  constructor() {
    this.objects = [];
    this.streamContents = null;
  }

  object(content) {
    this.objects.push(content);
  }

  build() {
    const header = "%PDF-1.4\n";
    const parts = [];
    const offsets = [];
    let pos = Buffer.byteLength(header, "ascii");
    let counter = 1;

    for (const obj of this.objects) {
      offsets.push(pos);
      const block = `${counter} 0 obj\n${obj}\nendobj\n`;
      parts.push(block);
      pos += Buffer.byteLength(block, "ascii");
      counter += 1;
    }

    const xrefStart = pos;
    let xref = `xref\n0 ${counter + 1}\n0000000000 65535 f \n`;
    for (const off of offsets) {
      xref += `${String(off).padStart(10, "0")} 00000 n \n`;
    }

    const trailer =
      `trailer\n<< /Size ${counter + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

    return header + parts.join("") + xref + trailer;
  }
}

function escapeText(t) {
  return String(t).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/**
 * Convenience: build a single-page PDF.
 * content: stream commands (without BT/ET).
 */
function makePdf({
  title,
  subtitle,
  contentCommands,
  fonts = ["B"],
}) {
  const builder = new PDFBuilder();

  // Prepare content stream
  const commands = [
    "0.972 0.929 0.878 rg",
    "0 0 612 792 re f",
    ...genericHeader(title, subtitle),
    ...contentCommands,
  ];
  const stream = commands.join("\n") + "\n";

  // Objects
  builder.object("<</Type /Catalog /Pages 2 0 R>>");
  builder.object("<</Type /Pages /Kids [3 0 R] /Count 1>>");
  builder.object(
    `<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R /F2 5 0 R>>>> /Contents 6 0 R>>`,
  );
  builder.object("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>");
  builder.object("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>");
  builder.object(`<</Length ${Buffer.byteLength(stream, "ascii")}>>\nstream\n${stream}endstream`);

  return builder.build();
}

function genericHeader(title, subtitle) {
  return [
    "0.463 0.353 0.267 rg",
    `BT /F1 26 Tf 36 736 Td (${escapeText(title)}) Tj ET`,
    "0.78 0.404 0.275 rg",
    `BT /F2 13 Tf 36 712 Td (${escapeText(subtitle)}) Tj ET`,
  ];
}

function drawCheckableGrid({ x, y, box, rows, rowLabels, cols }) {
  const commands = [];
  const cellH = box;
  const rowH = Math.min(box, 26);
  const colW = (PAGE_W - MARGIN * 2) / cols;

  commands.push("0.9 0.85 0.8 RG", "1 w");

  for (let r = 0; r < rows; r++) {
    const ry = y - r * rowH;
    // row label
    commands.push(
      `BT /F2 10 Tf ${x + 6} ${ry - 8} Td (${escapeText(rowLabels[r] ?? "")}) Tj ET`,
    );
    for (let c = 1; c < cols; c++) {
      const cx = x + c * colW;
      commands.push(`${cx} ${ry} m ${cx} ${ry + rowH} l S`);
      // checkbox
      const chx = cx + (colW - box) / 2;
      const chy = ry + (rowH - box) / 2;
      commands.push(`${chx} ${chy} ${box} ${box} re S`);
    }
    // horizontal line
    commands.push(`${x} ${ry} m ${x + colW * cols} ${ry} l S`);
  }

  // draw header row squares + weekday
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  for (let c = 1; c < cols; c++) {
    const cx = x + c * colW;
    const chx = cx + (colW - box) / 2;
    const chy = y - rowH + (rowH - box) / 2;
    commands.push(`${chx} ${chy} ${box} ${box} re S`);
    commands.push(`BT /F2 8 Tf ${cx + 4} ${y - 15} Td (${weekdays[c - 1]}) Tj ET`);
  }
  return commands;
}

function drawTextLine({ x, y, size, font, text, color }) {
  const c = color ?? "0.463 0.353 0.267";
  return [`${c} rg`, `BT /${font} ${size} Tf ${x} ${y} Td (${escapeText(text)}) Tj ET`];
}

function drawBoxLine({ x, y, w, h, label, size = 12 }) {
  return [
    "0.78 0.404 0.275 RG",
    "1.5 w",
    `${x} ${y} ${w} ${h} re S`,
    "0.463 0.353 0.267 rg",
    `BT /F1 ${size} Tf ${x + 10} ${y + h / 2 - size / 2.6} Td (${escapeText(label)}) Tj ET`,
  ];
}

// ---------------------------------------------------------------------------
core();

function core() {
  const outDir = path.join(process.cwd(), "public", "downloads");
  fs.mkdirSync(outDir, { recursive: true });

  // 1) Chore chart: rows = 6 jobs, cols = 7 days + label column
  const jobs = [
    "Put my cup in the sink",
    "Throw away my trash",
    "Pick up toys ",
    "Match shoes",
    "Make my bed",
    "Feed the cat",
  ];
  const chorePdf = makePdf({
    title: "My Chore Chart",
    subtitle: "One job at a time. Print it, hang it, let it nag for you.",
    contentCommands: [
      "0.78 0.404 0.275 rg",
      `BT /F1 14 Tf 36 660 Td (My jobs this week) Tj ET`,
      ...drawCheckableGrid({
        x: MARGIN,
        y: 640,
        box: 14,
        rows: jobs.length,
        rowLabels: jobs,
        cols: 8, // 1 label + 7 days
      }),
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "Colour one space each time you finish a job." }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
  fs.writeFileSync(path.join(outDir, "chore-chart-printable.pdf"), chorePdf);

  // 2) Feelings chart: 8 emotion boxes in 2 columns
  const feelings = ["Happy", "Sad", "Angry", "Worried", "Tired", "Excited", "Calm", "Silly"];
  const feelCommands = [];
  const boxW = 255;
  const boxH = 44;
  const startY = 620;
  feelings.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 36 + col * (boxW + 30);
    const y = startY - row * (boxH + 16);
    feelCommands.push(...drawBoxLine({ x, y, w: boxW, h: boxH, label: f }));
  });

  const feelPdf = makePdf({
    title: "How Do I Feel?",
    subtitle: "Point at the face that matches. Name it to tame it.",
    contentCommands: [
      ...feelCommands,
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "I feel ____________ because ____________" }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
  fs.writeFileSync(path.join(outDir, "feelings-chart-printable.pdf"), feelPdf);

  // 3) Daily routine cards: grid of routine steps
  const steps = [
    "Wake up",
    "Breakfast",
    "Brush teeth",
    "Get dressed",
    "School / play",
    "Lunch",
    "Nap or quiet time",
    "Snack",
    "Play outside",
    "Dinner",
    "Bath",
    "Story",
    "Bed",
  ];
  const routineCommands = [];
  const rW = 160;
  const rH = 34;
  const rGap = 10;
  const rStart = 640;
  steps.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 36 + col * (rW + rGap);
    const y = rStart - row * (rH + rGap);
    routineCommands.push(...drawBoxLine({ x, y, w: rW, h: rH, label: s, size: 11 }));
  });

  const routinePdf = makePdf({
    title: "Daily Routine Cards",
    subtitle: "Cut them out and put them in order. The chart, not the nagging.",
    contentCommands: [
      ...routineCommands,
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "Move the card when the job is done." }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
  fs.writeFileSync(path.join(outDir, "daily-routine-cards.pdf"), routinePdf);

  console.log("Generated printables: chore-chart-printable.pdf, feelings-chart-printable.pdf, daily-routine-cards.pdf");
}