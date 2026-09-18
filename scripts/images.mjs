import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { parse } from 'node:path';
import sharp from 'sharp';

const DIRS = ['shots', 'certs', 'logos', 'me'];
const WIDTHS = [400, 800, 1600];
const OUT = 'public/img';
const MANIFEST = 'src/assets/image-sizes.json';

rmSync(OUT, { recursive: true, force: true });
const manifest = {};

for (const dir of DIRS) {
  mkdirSync(`${OUT}/${dir}`, { recursive: true });
  for (const file of readdirSync(`public/${dir}`)) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const source = sharp(`public/${dir}/${file}`);
    const { width } = await source.metadata();
    const widths = WIDTHS.filter((w) => w < width).concat(width > WIDTHS.at(-1) ? [] : [width]);
    const { name } = parse(file);
    for (const w of widths) {
      await source.clone().resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(`${OUT}/${dir}/${name}-${w}.webp`);
    }
    manifest[`/${dir}/${file}`] = { base: `/img/${dir}/${name}`, widths };
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`resized ${Object.keys(manifest).length} images into ${OUT}`);
