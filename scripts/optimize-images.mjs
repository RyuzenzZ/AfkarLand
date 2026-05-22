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
  const width = Math.min(metadata.width || 1600, 1600);

  await image
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${baseOutput}.webp`);

  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 60 })
    .toFile(`${baseOutput}.avif`);
}

await Promise.all(targets.map(optimizeImage));
console.log(`Optimized ${targets.length} public images to WebP/AVIF.`);
