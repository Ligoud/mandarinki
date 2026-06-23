import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const artDir = join(root, 'public', 'art');
const iconsDir = join(root, 'public', 'icons');

mkdirSync(artDir, { recursive: true });
mkdirSync(iconsDir, { recursive: true });

const CATEGORY_COLORS = {
  soviet: '#9ca3af',
  ritsa: '#60a5fa',
  sacred: '#fbbf24',
  table: '#fb923c',
  voices: '#c084fc',
  sea: '#34d399',
};

function frameSvg(color, legendary = false) {
  const stroke = legendary ? '#fbbf24' : color;
  const sw = legendary ? 6 : 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <rect x="0" y="0" width="300" height="50" fill="rgba(26,15,10,0.75)"/>
  <rect x="0" y="350" width="300" height="50" fill="rgba(26,15,10,0.75)"/>
  <rect x="0" y="50" width="24" height="300" fill="rgba(26,15,10,0.55)"/>
  <rect x="276" y="50" width="24" height="300" fill="rgba(26,15,10,0.55)"/>
  <rect x="${sw}" y="${sw}" width="${300 - sw * 2}" height="${400 - sw * 2}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>
  ${legendary ? '<circle cx="150" cy="25" r="8" fill="#fbbf24"/>' : ''}
</svg>`;
}

const arts = [
  ['bg_soviet_1.svg', 'soviet'], ['bg_soviet_2.svg', 'soviet'], ['bg_soviet_3.svg', 'soviet'], ['bg_soviet_4.svg', 'soviet'],
  ['bg_ritsa_1.svg', 'ritsa'], ['bg_ritsa_2.svg', 'ritsa'], ['bg_ritsa_3.svg', 'ritsa'], ['bg_ritsa_4.svg', 'ritsa'], ['bg_ritsa_legend.svg', 'ritsa', true],
  ['bg_sacred_1.svg', 'sacred'], ['bg_sacred_2.svg', 'sacred'], ['bg_sacred_3.svg', 'sacred'], ['bg_sacred_legend.svg', 'sacred', true],
  ['bg_table_1.svg', 'table'], ['bg_table_2.svg', 'table'], ['bg_table_3.svg', 'table'], ['bg_table_4.svg', 'table'],
  ['bg_voices_1.svg', 'voices'], ['bg_voices_2.svg', 'voices'], ['bg_voices_3.svg', 'voices'], ['bg_voices_legend.svg', 'voices', true],
  ['bg_sea_1.svg', 'sea'], ['bg_sea_2.svg', 'sea'], ['bg_sea_3.svg', 'sea'], ['bg_sea_4.svg', 'sea'], ['bg_sea_legend.svg', 'sea', true],
];

for (const [file, cat, legendary] of arts) {
  const color = CATEGORY_COLORS[cat];
  writeFileSync(join(artDir, file), frameSvg(color, !!legendary));
}

function createPngSync(size) {
  const width = size;
  const height = size;
  const rowBytes = width * 4;
  const raw = Buffer.alloc((rowBytes + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (rowBytes + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const i = rowStart + 1 + x * 4;
      const t = x / width;
      raw[i] = Math.round(255 * (0.65 + t * 0.35));
      raw[i + 1] = Math.round(107 + (1 - t) * 40);
      raw[i + 2] = Math.round(43 + t * 20);
      raw[i + 3] = 255;
    }
  }
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync(join(iconsDir, 'icon-192.png'), createPngSync(192));
writeFileSync(join(iconsDir, 'icon-512.png'), createPngSync(512));
console.log('Generated art and icons');
