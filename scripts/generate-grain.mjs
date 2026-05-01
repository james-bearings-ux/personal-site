// Generates public/img/grain-tile.png — a 256x256 tileable grayscale noise texture.
// Run with: node scripts/generate-grain.mjs
// No external dependencies; uses Node built-ins only.
import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

const W = 64;
const H = 64;

// --- CRC32 (required by PNG spec) ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

// --- Noise: raw random, no blur — gives crisp distinct pixels at 64x64 ---
// Range [64, 192] centered at 128 so overlay blend is neutral on average
const pixels = Uint8Array.from({ length: W * H }, () => Math.round(64 + Math.random() * 128));

// --- PNG scanlines: filter byte 0 (None) + pixel row ---
const scanlines = Buffer.alloc(H * (1 + W));
for (let y = 0; y < H; y++) {
  scanlines[y * (1 + W)] = 0;
  for (let x = 0; x < W; x++) scanlines[y * (1 + W) + 1 + x] = pixels[y * W + x];
}

// --- Assemble PNG ---
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', deflateSync(scanlines, { level: 9 })),
  pngChunk('IEND', Buffer.alloc(0)),
]);

writeFileSync('public/img/grain-tile.png', png);
console.log(`grain-tile.png: ${png.length} bytes (${W}x${H} grayscale)`);
