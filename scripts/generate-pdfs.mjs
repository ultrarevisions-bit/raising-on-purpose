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
  constructor() { this.objects = []; }
  object(content) { this.objects.push(content); }
  build() {
    const header = "%PDF-1.4\n";
    const parts = []; const offsets = [];
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
    const trailer = `trailer\n<< /Size ${counter + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    return header + parts.join("") + xref + trailer;
  }
}

function escapeText(t) { return String(t).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)"); }

function makePdf({ title, subtitle, contentCommands, fonts = ["B"] }) {
  const builder = new PDFBuilder();
  const commands = [
    "0.972 0.929 0.878 rg",
    "0 0 612 792 re f",
    ...genericHeader(title, subtitle),
    ...contentCommands,
  ];
  const stream = commands.join("\n") + "\n";
  builder.object("<</Type /Catalog /Pages 2 0 R>>");
  builder.object("<</Type /Pages /Kids [3 0 R] /Count 1>>");
  builder.object(`<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R /F2 5 0 R>>>> /Contents 6 0 R>>`);
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
  const rowH = Math.min(box, 26);
  const colW = (PAGE_W - MARGIN * 2) / cols;
  commands.push("0.9 0.85 0.8 RG", "1 w");
  for (let r = 0; r < rows; r++) {
    const ry = y - r * rowH;
    commands.push(`BT /F2 10 Tf ${x + 6} ${ry - 8} Td (${escapeText(rowLabels[r] ?? "")}) Tj ET`);
    for (let c = 1; c < cols; c++) {
      const cx = x + c * colW;
      commands.push(`${cx} ${ry} m ${cx} ${ry + rowH} l S`);
      const chx = cx + (colW - box) / 2;
      const chy = ry + (rowH - box) / 2;
      commands.push(`${chx} ${chy} ${box} ${box} re S`);
    }
    commands.push(`${x} ${ry} m ${x + colW * cols} ${ry} l S`);
  }
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
    "0.78 0.404 0.275 RG", "1.5 w",
    `${x} ${y} ${w} ${h} re S`,
    "0.463 0.353 0.267 rg",
    `BT /F1 ${size} Tf ${x + 10} ${y + h / 2 - size / 2.6} Td (${escapeText(label)}) Tj ET`,
  ];
}

// ============================================
// 10 PRINTABLES
// ============================================

function makeChoreChart() {
  const jobs = ["Put my cup in the sink", "Throw away my trash", "Pick up toys", "Match shoes", "Make my bed", "Feed the cat"];
  return makePdf({
    title: "My Chore Chart",
    subtitle: "One job at a time. Print it, hang it, let it nag for you.",
    contentCommands: [
      "0.78 0.404 0.275 rg", `BT /F1 14 Tf 36 660 Td (My jobs this week) Tj ET`,
      ...drawCheckableGrid({ x: MARGIN, y: 640, box: 14, rows: jobs.length, rowLabels: jobs, cols: 8 }),
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "Colour one space each time you finish a job." }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
}

function makeFeelingsChart() {
  const feelings = ["Happy", "Sad", "Angry", "Worried", "Tired", "Excited", "Calm", "Silly"];
  const feelCommands = [];
  const boxW = 255; const boxH = 44; const startY = 620;
  for (let i = 0; i < 8; i++) {
    const col = i % 2; const row = Math.floor(i / 2);
    const x = 36 + col * 285; const y = startY - row * 60;
    feelCommands.push(...drawBoxLine({ x, y, w: 255, h: 44, label: ["Happy","Sad","Angry","Worried","Tired","Excited","Calm","Silly"][i] }));
  }
  return makePdf({
    title: "How Do I Feel?",
    subtitle: "Point at the face that matches. Name it to tame it.",
    contentCommands: [
      ...Array.from({length: 8}, (_, i) => drawBoxLine({ x: 36 + (i%2)*285, y: 620 - Math.floor(i/2)*60, w: 255, h: 44, label: ["Happy","Sad","Angry","Worried","Tired","Excited","Calm","Silly"][i] })).flat(),
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "I feel ____________ because ____________" }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
}

function makeDailyRoutineCards() {
  const steps = ["Wake up", "Breakfast", "Brush teeth", "Get dressed", "School / play", "Lunch", "Nap or quiet time", "Snack", "Play outside", "Dinner", "Bath", "Story", "Bed"];
  return makePdf({
    title: "Daily Routine Cards",
    subtitle: "Cut them out and put them in order. The chart, not the nagging.",
    contentCommands: [
      ...steps.flatMap((s, i) => { const col = i % 3; const row = Math.floor(i / 3); const x = 36 + col * 170; const y = 640 - row * 44; return drawBoxLine({ x, y, w: 160, h: 34, label: s, size: 11 }); }),
      ...drawTextLine({ x: 36, y: 470, size: 10, font: "F2", text: "Move the card when the job is done." }),
      ...drawTextLine({ x: 36, y: 452, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
}

function makePrintableChecklist() {
  return makePdf({
    title: "My Printable Checklist",
    subtitle: "Print it, check things off, feel accomplished.",
    contentCommands: [
      ...Array.from({length: 12}, (_, i) => { const y = 640 - i * 40; return ["0.78 0.404 0.275 RG", "1.5 w", `36 ${y} 16 16 re S`, `60 ${y} m 576 ${y} l S`]; }).flat(),
      ...drawTextLine({ x: 36, y: 130, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
}

function makeBedtimeRoutineChart() {
  const bedSteps = ["Bath / wash up", "Pajamas on", "Brush teeth", "Story time", "Cuddle / song", "Water sip", "Hug & kiss", "Lights out"];
  return makePdf({
    title: "Bedtime Routine",
    subtitle: "Same steps, same order, every night. Predictability = peace.",
    contentCommands: [
      ...bedSteps.flatMap((s, i) => { const col = i % 2; const row = Math.floor(i / 2); const x = 36 + col * 260; const y = 620 - row * 60; return drawBoxLine({ x, y, w: 240, h: 40, label: s, size: 11 }); }),
      ...drawTextLine({ x: 36, y: 130, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }),
    ],
  });
}

function makeMealPlanner() {
  const mpCommands = []; const mStartY = 640;
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  for (let i = 0; i < 8; i++) {
    const y = mStartY - i * 38;
    for (let i = 0; i < 8; i++) {
    const y = mStartY - i * 38;
    if (i < 7) {
      mpCommands.push("0.78 0.404 0.275 RG", "1.5 w", `36 ${y} m 286 ${y} l S`, `286 ${y} m 286 ${y - 30} l S`, `286 ${y - 30} m 36 ${y - 30} l S`, `36 ${y - 30} m 36 ${y} l S`, `BT /F1 11 Tf 42 ${y - 12} Td (${escapeText(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i])}) Tj ET`, `BT /F2 9 Tf 42 ${y - 22} Td (Lunch) Tj ET`, `BT /F2 9 Tf 150 ${y - 12} Td (Dinner) Tj ET`);
    } else {
      const y2 = mStartY - 7 * 38;
      mpCommands.push("0.78 0.404 0.275 RG", "1.5 w", `36 ${y2} m 576 ${y2} l S`, `BT /F1 11 Tf 42 ${y2 - 12} Td (Grocery List) Tj ET`);
      for (let g = 0; g < 3; g++) { const gy = y2 - 20 - g * 22; mpCommands.push("0.78 0.404 0.275 RG", "1.5 w", `36 ${gy + 20} m 576 ${gy + 20} l S`, `BT /F2 9 Tf 42 ${gy + 8} Td ( ) Tj ET`); }
    }
  }
}

function makePottyTrainingChart() {
  const pottyCmds = ["0.78 0.404 0.275 rg", `BT /F1 14 Tf 36 660 Td (Potty Progress) Tj ET`];
  for (let i = 0; i < 14; i++) {
    const col = i % 7; const row = Math.floor(i / 2);
    const x1 = 36 + col * 75;
    const y1 = 600 - Math.floor(i / 2) * 55 - (i % 2 ? 25 : 0);
    const boxW = 68; const boxH = 45; const day = i + 1;
    pottyCmds.push("0.78 0.404 0.275 RG", "1.5 w", `${x1} ${y1 + 45} m ${x1} ${y1} l S`, `${x1 + 68} ${y1 + 45} m ${x1 + 68} ${y1} l S`, `${x1 + 68} ${y1 + 45} m ${x1} ${y1 + 45} l S`, `${x1} ${y1} m ${x1 + 68} ${y1} l S`, `BT /F1 10 Tf ${x1 + 10} ${y1 + 35} Td (Day ${day}) Tj ET`, `${x1 + 5} ${y1 + 5} m ${x1 + 63} ${y1 + 40} l S`, `${x1 + 5} ${y1 + 40} m ${x1 + 63} ${y1 + 5} l S`);
  }
  return makePdf({ title: "Potty Training Chart", subtitle: "Two weeks of wins. Every dry day is a celebration.", contentCommands: pottyCmds });
}

function makeScreenTimeTracker() {
  const stCmds = ["0.78 0.404 0.275 rg", `BT /F1 14 Tf 36 660 Td (Screen Time Tracker) Tj ET`];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (let i = 0; i < 7; i++) {
    const y = 620 - i * 40;
    stCmds.push("0.78 0.404 0.275 RG", "1.5 w", `36 ${y} m 286 ${y} l S`, `286 ${y} m 286 ${y - 30} l S`, `286 ${y - 30} m 36 ${y - 30} l S`, `36 ${y - 30} m 36 ${y} l S`, `BT /F1 11 Tf 42 ${y - 12} Td (${escapeText(days[i])}) Tj ET`, `BT /F2 9 Tf 42 ${y - 22} Td (Tablet) Tj ET`, `BT /F2 9 Tf 150 ${y - 12} Td (TV) Tj ET`);
    for (let s = 0; s < 3; s++) { const sy = y - 20 - s * 10; stCmds.push(`36 ${sy} m 286 ${sy} l S`); }
  }
  stCmds.push(...drawTextLine({ x: 36, y: 130, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }));
  return makePdf({ title: "Screen Time Tracker", subtitle: "See the time. Set the limit. Keep the peace.", contentCommands: stCmds });
}

function makeFamilyRulesChart() {
  const rules = ["We listen first", "We use kind words", "We clean up our mess", "We ask before taking", "We try our best", "We say please & thank you"];
  const ruleCmds = ["0.78 0.404 0.275 rg", `BT /F1 14 Tf 36 660 Td (Our Family Rules) Tj ET`];
  rules.forEach((r, i) => { const y = 620 - i * 55; ruleCmds.push(...drawBoxLine({ x: 36, y, w: 540, h: 40, label: r, size: 12 })); });
  return makePdf({ title: "Our Family Rules", subtitle: "Simple. Clear. Posted where everyone sees them.", contentCommands: [ ...ruleCmds, ...drawTextLine({ x: 36, y: 130, size: 10, font: "F2", text: "Raising On Purpose | raisingonpurpose.vercel.app" }) ] });
}

function makeScreenTimeContract() {
  const stcCmds = ["0.78 0.404 0.275 rg", `BT /F1 14 Tf 36 660 Td (Screen Time Agreement) Tj ET`, "0.463 0.353 0.267 rg", `BT /F2 11 Tf 36 620 Td (We agree to:) Tj ET`];
  const items = ["No screens before school", "Max 1 hour on weekdays", "Max 2 hours on weekends", "Screens off 1 hour before bed", "Ask before new apps/games", "Device-free meals & family time"];
  items.forEach((item, i) => { const y = 590 - i * 40; stcCmds.push(`36 ${y + 10} 12 12 re S`, `BT /F2 10 Tf 54 ${y + 8} Td (${escapeText(item)}) Tj ET`); });
  stcCmds.push("0.78 0.404 0.275 rg", `BT /F2 10 Tf 36 180 Td (Child signature: ________________   Date: ________) Tj ET`, `BT /F2 10 Tf 36 160 Td (Parent signature: ________________   Date: ________) Tj ET`, `BT /F2 10 Tf 36 140 Td (We review this together every month.) Tj ET`);
  return makePdf({ title: "Screen Time Agreement", subtitle: "Clear limits. Fewer battles. Signed together.", contentCommands: stcCmds });
}

// ============================================
// MAIN
// ============================================

function core() {
  const outDir = path.join(process.cwd(), "public", "downloads");
  fs.mkdirSync(outDir, { recursive: true });

  const printables = [
    { file: "chore-chart-printable.pdf", fn: makeChoreChart },
    { file: "feelings-chart-printable.pdf", fn: makeFeelingsChart },
    { file: "daily-routine-cards.pdf", fn: makeDailyRoutineCards },
    { file: "printable-checklist.pdf", fn: makePrintableChecklist },
    { file: "bedtime-routine-chart.pdf", fn: makeBedtimeRoutineChart },
    { file: "meal-planner.pdf", fn: makeMealPlanner },
    { file: "potty-training-chart.pdf", fn: makePottyTrainingChart },
    { file: "screen-time-tracker.pdf", fn: makeScreenTimeTracker },
    { file: "family-rules-chart.pdf", fn: makeFamilyRulesChart },
    { file: "screen-time-agreement.pdf", fn: makeScreenTimeContract },
  ];

  for (const { file, fn } of printables) {
    const pdf = fn();
    fs.writeFileSync(path.join(outDir, file), pdf);
    console.log(`Generated ${file}`);
  }

  console.log("All 10 printables generated in /public/downloads");
}

core();

