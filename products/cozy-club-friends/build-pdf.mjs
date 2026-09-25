import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const out = path.join(root, "Cozy-Club-Friends.pdf");
const toolsRoot = path.resolve(root, "../_storybook-tools");

async function embedImage(doc, filePath) {
  const bytes = fs.readFileSync(filePath);
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  const pageW = 612;
  const pageH = 792;
  const page = doc.addPage([pageW, pageH]);
  const scale = Math.min(pageW / img.width, pageH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  page.drawImage(img, {
    x: (pageW - w) / 2,
    y: (pageH - h) / 2,
    width: w,
    height: h,
  });
}

async function main() {
  const doc = await PDFDocument.create();
  const coverJpg = path.join(root, "cover-print.jpg");
  const coverPng = path.join(root, "cover.png");
  await embedImage(doc, fs.existsSync(coverJpg) ? coverJpg : coverPng);
  for (let i = 1; i <= 18; i++) {
    const n = String(i).padStart(2, "0");
    const jpg = path.join(root, "pages", `${n}.jpg`);
    const png = path.join(root, "pages", `${n}.png`);
    await embedImage(doc, fs.existsSync(jpg) ? jpg : png);
  }
  const pdf = await doc.save();
  fs.writeFileSync(out, pdf);
  console.log("Wrote", out, "pages=", doc.getPageCount(), "bytes=", pdf.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
