import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("C:/Users/ILLUSIONIST/Projects/digi-world/products/photographer-os/etsy/listing-art/node_modules/puppeteer");

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(root, "Client-Tracker.html");
const outDir = path.resolve(root, "../../frontend/public/images/products/client-tracker");
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(htmlPath);
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
});

await new Promise((r) => server.listen(4181, "127.0.0.1", r));

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4181/", { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));

const shots = [
  ["clients", "01.png"],
  ["dashboard", "02.png"],
  ["tasks", "03.png"],
  ["comms", "04.png"],
  ["calendar", "05.png"],
  ["overview", "06.png"],
];

for (const [tab, file] of shots) {
  await page.evaluate((t) => {
    const btn = document.querySelector(`[data-tab="${t}"]`);
    if (btn) btn.click();
  }, tab);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, file), type: "png" });
  console.log(file);
}

await browser.close();
server.close();
console.log("images ->", outDir);
