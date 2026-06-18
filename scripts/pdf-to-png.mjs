import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const inputPath = path.join(rootDir, 'Old Graphic.pdf');
const outputPath = path.join(rootDir, 'public', 'stage-plot-original.png');
const stagePlotPath = path.join(rootDir, 'public', 'stage-plot-stage.png');

const pdfBuffer = await readFile(inputPath);
const pdf = await getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: 2 });

const canvas = createCanvas(viewport.width, viewport.height);
const context = canvas.getContext('2d');

await page.render({
  canvasContext: context,
  viewport,
}).promise;

const fullImage = canvas.toBuffer('image/png');
await writeFile(outputPath, fullImage);

// Crop to the stage diagram row (exclude contact block, input list, and mix notes).
const cropTop = Math.round(viewport.height * 0.2);
const cropHeight = Math.round(viewport.height * 0.48);
const stageCanvas = createCanvas(viewport.width, cropHeight);
const stageContext = stageCanvas.getContext('2d');
stageContext.drawImage(
  canvas,
  0,
  cropTop,
  viewport.width,
  cropHeight,
  0,
  0,
  viewport.width,
  cropHeight,
);

await writeFile(stagePlotPath, stageCanvas.toBuffer('image/png'));

console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${stagePlotPath}`);
