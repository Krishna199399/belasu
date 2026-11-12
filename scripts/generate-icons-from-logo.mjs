/**
 * generate-icons-from-logo.mjs
 * Reads Belesu-logo1.png (788x296), pads it to a square with white background,
 * scales to required icon sizes, writes all icon files.
 * Pure Node.js PNG decoder/encoder — no external dependencies.
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const LOGO_PATH   = 'd:/belasu/public/Belesu-logo1.png';
const PUBLIC_DIR  = 'd:/belasu/public';
const APP_DIR     = 'd:/belasu/src/app';

// ── PNG Decoder ───────────────────────────────────────────────────────────────
function readPNG(buf) {
  let pos = 8; // skip PNG signature
  let width, height, bitDepth, colorType, interlace;
  const idatChunks = [];

  while (pos < buf.length) {
    const len  = buf.readUInt32BE(pos); pos += 4;
    const type = buf.slice(pos, pos + 4).toString('ascii'); pos += 4;
    const data = buf.slice(pos, pos + len); pos += len + 4; // skip CRC

    if (type === 'IHDR') {
      width     = data.readUInt32BE(0);
      height    = data.readUInt32BE(4);
      bitDepth  = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    }
  }

  const compressed  = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // Channels: 2=RGB, 3=palette, 4=RGBA, 0=grey, 6=RGBA
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const bytesPerRow = width * channels + 1; // +1 for filter byte

  // Reconstruct pixel rows (handle filter types 0-4)
  const pixels = new Uint8Array(height * width * channels);

  function paethPredictor(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  }

  for (let y = 0; y < height; y++) {
    const rowStart  = y * bytesPerRow;
    const filterType = decompressed[rowStart];
    const rowData   = decompressed.slice(rowStart + 1, rowStart + 1 + width * channels);
    const outRow    = pixels.subarray(y * width * channels, (y + 1) * width * channels);
    const prevRow   = y > 0 ? pixels.subarray((y - 1) * width * channels, y * width * channels) : null;

    for (let x = 0; x < rowData.length; x++) {
      const raw = rowData[x];
      const ch  = x % channels;
      const col = Math.floor(x / channels);
      const a   = col > 0        ? outRow[x - channels] : 0;
      const b   = prevRow        ? prevRow[x]           : 0;
      const c   = (col > 0 && prevRow) ? prevRow[x - channels] : 0;
      switch (filterType) {
        case 0: outRow[x] = raw; break;
        case 1: outRow[x] = (raw + a) & 0xFF; break;
        case 2: outRow[x] = (raw + b) & 0xFF; break;
        case 3: outRow[x] = (raw + ((a + b) >> 1)) & 0xFF; break;
        case 4: outRow[x] = (raw + paethPredictor(a, b, c)) & 0xFF; break;
        default: outRow[x] = raw;
      }
    }
  }

  return { width, height, channels, pixels };
}

// ── Nearest-neighbour scale ───────────────────────────────────────────────────
function scaleRGBA(srcPixels, srcW, srcH, dstW, dstH) {
  const dst = new Uint8Array(dstW * dstH * 4);
  for (let dy = 0; dy < dstH; dy++) {
    const sy = Math.min(Math.floor(dy * srcH / dstH), srcH - 1);
    for (let dx = 0; dx < dstW; dx++) {
      const sx = Math.min(Math.floor(dx * srcW / dstW), srcW - 1);
      const si = (sy * srcW + sx) * 4;
      const di = (dy * dstW + dx) * 4;
      dst[di]   = srcPixels[si];
      dst[di+1] = srcPixels[si+1];
      dst[di+2] = srcPixels[si+2];
      dst[di+3] = srcPixels[si+3];
    }
  }
  return dst;
}

// ── Pad to square (white background, logo centred) ───────────────────────────
function padToSquare(img) {
  const { width, height, channels, pixels } = img;
  // Convert to RGBA first
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    if (channels === 4) {
      rgba[i*4]   = pixels[i*channels];
      rgba[i*4+1] = pixels[i*channels+1];
      rgba[i*4+2] = pixels[i*channels+2];
      rgba[i*4+3] = pixels[i*channels+3];
    } else if (channels === 3) {
      rgba[i*4]   = pixels[i*channels];
      rgba[i*4+1] = pixels[i*channels+1];
      rgba[i*4+2] = pixels[i*channels+2];
      rgba[i*4+3] = 255;
    } else {
      rgba[i*4] = rgba[i*4+1] = rgba[i*4+2] = pixels[i*channels];
      rgba[i*4+3] = 255;
    }
  }

  const size    = Math.max(width, height);
  const square  = new Uint8Array(size * size * 4);
  // Fill with white
  for (let i = 0; i < size * size; i++) {
    square[i*4] = 255; square[i*4+1] = 255; square[i*4+2] = 255; square[i*4+3] = 255;
  }
  // Add padding (20% on each side of the shorter dimension)
  const pad    = Math.round(size * 0.08); // 8% padding
  const logoW  = size - pad * 2;
  const logoH  = Math.round(logoW * height / width);
  const startX = pad;
  const startY = Math.round((size - logoH) / 2);

  // Scale logo to fit padded area
  const scaled = scaleRGBA(rgba, width, height, logoW, logoH);

  for (let dy = 0; dy < logoH; dy++) {
    for (let dx = 0; dx < logoW; dx++) {
      const si = (dy * logoW + dx) * 4;
      const a  = scaled[si+3] / 255;
      const di = ((startY + dy) * size + (startX + dx)) * 4;
      // Alpha composite over white
      square[di]   = Math.round(scaled[si]   * a + 255 * (1 - a));
      square[di+1] = Math.round(scaled[si+1] * a + 255 * (1 - a));
      square[di+2] = Math.round(scaled[si+2] * a + 255 * (1 - a));
      square[di+3] = 255;
    }
  }

  return { width: size, height: size, channels: 4, pixels: square };
}

// ── PNG Encoder ───────────────────────────────────────────────────────────────
function writePNG(img) {
  const { width, height, pixels } = img;
  const channels = 4;

  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = new Uint8Array(1 + width * channels);
    row[0] = 0; // filter None
    for (let x = 0; x < width * channels; x++) {
      row[x + 1] = pixels[y * width * channels + x];
    }
    rawRows.push(row);
  }

  const raw      = Buffer.concat(rawRows);
  const deflated = zlib.deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const t   = Buffer.from(type);
    const crc = crc32(Buffer.concat([t, data]));
    const c   = Buffer.alloc(4); c.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, t, data, c]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width,  0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ── ICO Writer ────────────────────────────────────────────────────────────────
function writeICO(sizes, squareImg) {
  const pngBuffers = sizes.map(sz => {
    const scaled = scaleRGBA(squareImg.pixels, squareImg.width, squareImg.height, sz, sz);
    return writePNG({ width: sz, height: sz, channels: 4, pixels: scaled });
  });

  const headerSize = 6 + 16 * pngBuffers.length;
  let   offset     = headerSize;
  const header     = Buffer.alloc(headerSize);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(pngBuffers.length, 4);

  pngBuffers.forEach((png, i) => {
    const sz = sizes[i];
    const off = 6 + i * 16;
    header[off]   = sz >= 256 ? 0 : sz;
    header[off+1] = sz >= 256 ? 0 : sz;
    header[off+2] = 0; header[off+3] = 0;
    header.writeUInt16LE(1,          off+4);
    header.writeUInt16LE(32,         off+6);
    header.writeUInt32LE(png.length, off+8);
    header.writeUInt32LE(offset,     off+12);
    offset += png.length;
  });

  return Buffer.concat([header, ...pngBuffers]);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('📖 Reading Belesu-logo1.png...');
const logoBuf    = fs.readFileSync(LOGO_PATH);
const logoImg    = readPNG(logoBuf);
console.log(`   Source: ${logoImg.width}x${logoImg.height} (channels: ${logoImg.channels})`);

console.log('⬛ Padding to square with white background...');
const squareImg  = padToSquare(logoImg);
console.log(`   Square: ${squareImg.width}x${squareImg.height}`);

const targets = [
  { name: 'icon-512.png',                  dir: PUBLIC_DIR, size: 512  },
  { name: 'icon-192.png',                  dir: PUBLIC_DIR, size: 192  },
  { name: 'apple-icon.png',               dir: PUBLIC_DIR, size: 180  },
  { name: 'icon.png',                      dir: PUBLIC_DIR, size: 32   },
  { name: 'Belesu-logo1-square.png',      dir: PUBLIC_DIR, size: squareImg.width }, // keep full square
  { name: 'icon-512.png',                  dir: APP_DIR,    size: 512  },
  { name: 'apple-icon.png',               dir: APP_DIR,    size: 180  },
  { name: 'icon.png',                      dir: APP_DIR,    size: 32   },
];

for (const t of targets) {
  let buf;
  if (t.size === squareImg.width) {
    buf = writePNG(squareImg);
  } else {
    const scaled = scaleRGBA(squareImg.pixels, squareImg.width, squareImg.height, t.size, t.size);
    buf = writePNG({ width: t.size, height: t.size, channels: 4, pixels: scaled });
  }
  const dest = path.join(t.dir, t.name);
  fs.writeFileSync(dest, buf);
  console.log(`✅ ${dest.replace('d:/belasu/', '')}  (${t.size}x${t.size}, ${Math.round(buf.length/1024)}KB)`);
}

// favicon.ico — multi-size (16, 32, 48)
console.log('\n🖼  Generating favicon.ico (16, 32, 48px)...');
const icoBuf = writeICO([16, 32, 48], squareImg);
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuf);
fs.writeFileSync(path.join(APP_DIR,    'favicon.ico'), icoBuf);
console.log(`✅ public/favicon.ico  (${Math.round(icoBuf.length/1024)}KB)`);
console.log(`✅ src/app/favicon.ico  (${Math.round(icoBuf.length/1024)}KB)`);

console.log('\n🎉 All icon files generated from full Belesu logo!');
