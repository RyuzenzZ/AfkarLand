import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const imageDir = path.join(rootDir, 'public', 'images');
const targets = [
  'Hero.jpg',
  'MasagenaParallax.jpg',
  'Masagena.jpg',
  'Masagena1.jpg',
  'LogoAfkar.png',
  'LogoAfkar1.png',
  'Logomerahafkar.jpeg',
  'ustadz.png',
  'nia.png',
  'Abdi.jpeg',
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(fileName) {
  const inputPath = path.join(imageDir, fileName);
  if (!(await exists(inputPath))) return;

  const parsed = path.parse(fileName);
  const baseOutput = path.join(imageDir, parsed.name);
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();
  const smallAsset = /logo|ustadz|nia|abdi/i.test(fileName);
  const maxWidth = smallAsset ? 640 : 1200;
  const width = Math.min(metadata.width || maxWidth, maxWidth);

  await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: smallAsset ? 74 : 76 })
    .toFile(`${baseOutput}.webp`);

  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: smallAsset ? 42 : 46 })
    .toFile(`${baseOutput}.avif`);
}

await Promise.all(targets.map(optimizeImage));
console.log(`Optimized ${targets.length} public images to WebP/AVIF.`);
