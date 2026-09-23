import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.STORY_ROOT || __dirname;
const PDF_NAME = process.env.PDF_NAME || "Storybook.pdf";
const PAGE_COUNT = Number(process.env.PAGE_COUNT || "9");

async function embedImage(doc, filePath) {
  const bytes = fs.readFileSync(filePath);
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  const pageW = 792;
  const pageH = 446;
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
  const out = path.join(root, PDF_NAME);
  const doc = await PDFDocument.create();
  await embedImage(doc, path.join(root, "cover.png"));
  for (let i = 1; i <= PAGE_COUNT; i++) {
    const n = String(i).padStart(2, "0");
    await embedImage(doc, path.join(root, "pages", `${n}.png`));
  }
  const endPath = path.join(root, "pages", "end.png");
  if (fs.existsSync(endPath)) await embedImage(doc, endPath);
  const pdf = await doc.save();
  fs.writeFileSync(out, pdf);
  console.log("Wrote", out, "pages=", doc.getPageCount(), "bytes=", pdf.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
