import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pdfPath = resolve('C:/Users/Nurmiati/Downloads/Kop surat Fix.pdf');
const pdfBase64 = readFileSync(pdfPath).toString('base64');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 1 });

await page.setContent(`
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs" type="module"></script>
</head>
<body style="margin:0;background:white;">
  <canvas id="canvas" style="display:block;"></canvas>
  <script type="module">
    import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs';

    const data = atob('${pdfBase64}');
    const arr = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) arr[i] = data.charCodeAt(i);

    const pdf = await pdfjsLib.getDocument({ data: arr }).promise;
    const pg = await pdf.getPage(1);

    const scale = 4;
    const viewport = pg.getViewport({ scale });
    const canvas = document.getElementById('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await pg.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    window.__canvasW = canvas.width;
    window.__canvasH = canvas.height;
    window.__pdfReady = true;
  </script>
</body>
</html>
`, { waitUntil: 'networkidle0', timeout: 20000 });

await page.waitForFunction('window.__pdfReady === true', { timeout: 15000 });

const { cw, ch } = await page.evaluate(() => ({
  cw: window.__canvasW,
  ch: window.__canvasH,
}));
console.log('Canvas:', cw, 'x', ch);

// Extract header and footer as cropped PNG via canvas API
const headerData = await page.evaluate((w, h) => {
  const src = document.getElementById('canvas');
  const headerH = Math.round(h * 0.16); // top 16%
  const c = document.createElement('canvas');
  c.width = w;
  c.height = headerH;
  c.getContext('2d').drawImage(src, 0, 0, w, headerH, 0, 0, w, headerH);
  return c.toDataURL('image/png').split(',')[1];
}, cw, ch);

writeFileSync(resolve('public/kop/header.png'), Buffer.from(headerData, 'base64'));
console.log('Header saved');

const footerData = await page.evaluate((w, h) => {
  const src = document.getElementById('canvas');
  const footerH = Math.round(h * 0.12); // bottom 12%
  const sy = h - footerH;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = footerH;
  c.getContext('2d').drawImage(src, 0, sy, w, footerH, 0, 0, w, footerH);
  return c.toDataURL('image/png').split(',')[1];
}, cw, ch);

writeFileSync(resolve('public/kop/footer.png'), Buffer.from(footerData, 'base64'));
console.log('Footer saved');

await browser.close();
console.log('Done!');
