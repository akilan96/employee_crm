const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC table for PNG
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const chunkTypeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(chunkTypeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // Scanlines with filter type 0 (None)
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawScanlines[y * (1 + width * 4)] = 0; // Filter None
    rgbaBuffer.copy(
      rawScanlines,
      y * (1 + width * 4) + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }
  
  const compressed = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Decode source PNG
function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let width = 0, height = 0;
  const idatChunks = [];

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }

  const compressed = Buffer.concat(idatChunks);
  const raw = zlib.inflateSync(compressed);
  const stride = 1 + width * 4;
  const pixels = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const filterType = raw[y * stride];
    const scanline = raw.subarray(y * stride + 1, (y + 1) * stride);
    
    for (let x = 0; x < width; x++) {
      const rIdx = x * 4;
      let r = scanline[rIdx];
      let g = scanline[rIdx + 1];
      let b = scanline[rIdx + 2];
      let a = scanline[rIdx + 3];
      
      if (filterType === 1) {
        if (x > 0) {
          r = (r + scanline[(x - 1) * 4]) & 0xFF;
          g = (g + scanline[(x - 1) * 4 + 1]) & 0xFF;
          b = (b + scanline[(x - 1) * 4 + 2]) & 0xFF;
          a = (a + scanline[(x - 1) * 4 + 3]) & 0xFF;
          scanline[rIdx] = r;
          scanline[rIdx+1] = g;
          scanline[rIdx+2] = b;
          scanline[rIdx+3] = a;
        }
      } else if (filterType === 2) {
        if (y > 0) {
          const prevYScan = pixels.subarray((y - 1) * width * 4, y * width * 4);
          r = (r + prevYScan[x * 4]) & 0xFF;
          g = (g + prevYScan[x * 4 + 1]) & 0xFF;
          b = (b + prevYScan[x * 4 + 2]) & 0xFF;
          a = (a + prevYScan[x * 4 + 3]) & 0xFF;
        }
      } else if (filterType === 3) {
        const prevX_r = x > 0 ? scanline[(x - 1) * 4] : 0;
        const prevX_g = x > 0 ? scanline[(x - 1) * 4 + 1] : 0;
        const prevX_b = x > 0 ? scanline[(x - 1) * 4 + 2] : 0;
        const prevX_a = x > 0 ? scanline[(x - 1) * 4 + 3] : 0;
        const prevY_r = y > 0 ? pixels[((y - 1) * width + x) * 4] : 0;
        const prevY_g = y > 0 ? pixels[((y - 1) * width + x) * 4 + 1] : 0;
        const prevY_b = y > 0 ? pixels[((y - 1) * width + x) * 4 + 2] : 0;
        const prevY_a = y > 0 ? pixels[((y - 1) * width + x) * 4 + 3] : 0;
        r = (r + Math.floor((prevX_r + prevY_r) / 2)) & 0xFF;
        g = (g + Math.floor((prevX_g + prevY_g) / 2)) & 0xFF;
        b = (b + Math.floor((prevX_b + prevY_b) / 2)) & 0xFF;
        a = (a + Math.floor((prevX_a + prevY_a) / 2)) & 0xFF;
        scanline[rIdx] = r;
        scanline[rIdx+1] = g;
        scanline[rIdx+2] = b;
        scanline[rIdx+3] = a;
      } else if (filterType === 4) {
        const a_r = x > 0 ? scanline[(x - 1) * 4] : 0;
        const b_r = y > 0 ? pixels[((y - 1) * width + x) * 4] : 0;
        const c_r = (x > 0 && y > 0) ? pixels[((y - 1) * width + (x - 1)) * 4] : 0;
        const paeth = (a, b, c) => {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          if (pa <= pb && pa <= pc) return a;
          if (pb <= pc) return b;
          return c;
        };
        r = (r + paeth(a_r, b_r, c_r)) & 0xFF;
        const a_g = x > 0 ? scanline[(x - 1) * 4 + 1] : 0;
        const b_g = y > 0 ? pixels[((y - 1) * width + x) * 4 + 1] : 0;
        const c_g = (x > 0 && y > 0) ? pixels[((y - 1) * width + (x - 1)) * 4 + 1] : 0;
        g = (g + paeth(a_g, b_g, c_g)) & 0xFF;
        const a_b = x > 0 ? scanline[(x - 1) * 4 + 2] : 0;
        const b_b = y > 0 ? pixels[((y - 1) * width + x) * 4 + 2] : 0;
        const c_b = (x > 0 && y > 0) ? pixels[((y - 1) * width + (x - 1)) * 4 + 2] : 0;
        b = (b + paeth(a_b, b_b, c_b)) & 0xFF;
        const a_a = x > 0 ? scanline[(x - 1) * 4 + 3] : 0;
        const b_a = y > 0 ? pixels[((y - 1) * width + x) * 4 + 3] : 0;
        const c_a = (x > 0 && y > 0) ? pixels[((y - 1) * width + (x - 1)) * 4 + 3] : 0;
        a = (a + paeth(a_a, b_a, c_a)) & 0xFF;
        scanline[rIdx] = r;
        scanline[rIdx+1] = g;
        scanline[rIdx+2] = b;
        scanline[rIdx+3] = a;
      }
      
      const outIdx = (y * width + x) * 4;
      pixels[outIdx] = r;
      pixels[outIdx + 1] = g;
      pixels[outIdx + 2] = b;
      pixels[outIdx + 3] = a;
    }
  }

  return { width, height, pixels };
}

// Resample / scale RGBA image with bilinear interpolation
function resampleRGBA(srcPixels, srcW, srcH, srcX, srcY, cropW, cropH, targetW, targetH, targetPixels, targetX, targetY) {
  for (let dy = 0; dy < targetH; dy++) {
    const sy = srcY + (dy + 0.5) * (cropH / targetH) - 0.5;
    const y0 = Math.max(0, Math.min(srcH - 1, Math.floor(sy)));
    const y1 = Math.max(0, Math.min(srcH - 1, Math.ceil(sy)));
    const wy1 = sy - y0;
    const wy0 = 1 - wy1;

    for (let dx = 0; dx < targetW; dx++) {
      const sx = srcX + (dx + 0.5) * (cropW / targetW) - 0.5;
      const x0 = Math.max(0, Math.min(srcW - 1, Math.floor(sx)));
      const x1 = Math.max(0, Math.min(srcW - 1, Math.ceil(sx)));
      const wx1 = sx - x0;
      const wx0 = 1 - wx1;

      // Sample 4 neighbors
      const idx00 = (y0 * srcW + x0) * 4;
      const idx10 = (y0 * srcW + x1) * 4;
      const idx01 = (y1 * srcW + x0) * 4;
      const idx11 = (y1 * srcW + x1) * 4;

      const r = wy0 * (wx0 * srcPixels[idx00] + wx1 * srcPixels[idx10]) +
                wy1 * (wx0 * srcPixels[idx01] + wx1 * srcPixels[idx11]);
      const g = wy0 * (wx0 * srcPixels[idx00 + 1] + wx1 * srcPixels[idx10 + 1]) +
                wy1 * (wx0 * srcPixels[idx01 + 1] + wx1 * srcPixels[idx11 + 1]);
      const b = wy0 * (wx0 * srcPixels[idx00 + 2] + wx1 * srcPixels[idx10 + 2]) +
                wy1 * (wx0 * srcPixels[idx01 + 2] + wx1 * srcPixels[idx11 + 2]);
      const a = wy0 * (wx0 * srcPixels[idx00 + 3] + wx1 * srcPixels[idx10 + 3]) +
                wy1 * (wx0 * srcPixels[idx01 + 3] + wx1 * srcPixels[idx11 + 3]);

      const outIdx = ((targetY + dy) * targetW + (targetX + dx)) * 4;
      targetPixels[outIdx] = Math.round(r);
      targetPixels[outIdx + 1] = Math.round(g);
      targetPixels[outIdx + 2] = Math.round(b);
      targetPixels[outIdx + 3] = Math.round(a);
    }
  }
}

// Generate square favicon with emblem centered
function generateFavicon(src, size) {
  const cropX = 1;
  const cropY = 0;
  const cropW = 1099;
  const cropH = 446;

  const targetPixels = Buffer.alloc(size * size * 4); // all 0 (transparent)

  // Determine scale to fit within size with padding (e.g., 85% of square width/height)
  const paddingRatio = 0.08;
  const availW = size * (1 - paddingRatio * 2);
  const availH = size * (1 - paddingRatio * 2);

  const scale = Math.min(availW / cropW, availH / cropH);
  const drawW = Math.round(cropW * scale);
  const drawH = Math.round(cropH * scale);
  const drawX = Math.round((size - drawW) / 2);
  const drawY = Math.round((size - drawH) / 2);

  // High quality supersampled rendering:
  // For each output pixel in [0, size) x [0, size):
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      // Is this pixel inside draw area?
      if (dx >= drawX && dx < drawX + drawW && dy >= drawY && dy < drawY + drawH) {
        // Map (dx, dy) back to source (cropX..cropX+cropW, cropY..cropY+cropH)
        const u = (dx - drawX + 0.5) / drawW;
        const v = (dy - drawY + 0.5) / drawH;
        
        const srcPosX = cropX + u * cropW - 0.5;
        const srcPosY = cropY + v * cropH - 0.5;

        const x0 = Math.max(0, Math.min(src.width - 1, Math.floor(srcPosX)));
        const x1 = Math.max(0, Math.min(src.width - 1, Math.ceil(srcPosX)));
        const wx1 = srcPosX - Math.floor(srcPosX);
        const wx0 = 1 - wx1;

        const y0 = Math.max(0, Math.min(src.height - 1, Math.floor(srcPosY)));
        const y1 = Math.max(0, Math.min(src.height - 1, Math.ceil(srcPosY)));
        const wy1 = srcPosY - Math.floor(srcPosY);
        const wy0 = 1 - wy1;

        const idx00 = (y0 * src.width + x0) * 4;
        const idx10 = (y0 * src.width + x1) * 4;
        const idx01 = (y1 * src.width + x0) * 4;
        const idx11 = (y1 * src.width + x1) * 4;

        // Bilinear blend
        const r = wy0 * (wx0 * src.pixels[idx00] + wx1 * src.pixels[idx10]) +
                  wy1 * (wx0 * src.pixels[idx01] + wx1 * src.pixels[idx11]);
        const g = wy0 * (wx0 * src.pixels[idx00 + 1] + wx1 * src.pixels[idx10 + 1]) +
                  wy1 * (wx0 * src.pixels[idx01 + 1] + wx1 * src.pixels[idx11 + 1]);
        const b = wy0 * (wx0 * src.pixels[idx00 + 2] + wx1 * src.pixels[idx10 + 2]) +
                  wy1 * (wx0 * src.pixels[idx01 + 2] + wx1 * src.pixels[idx11 + 2]);
        const a = wy0 * (wx0 * src.pixels[idx00 + 3] + wx1 * src.pixels[idx10 + 3]) +
                  wy1 * (wx0 * src.pixels[idx01 + 3] + wx1 * src.pixels[idx11 + 3]);

        const outIdx = (dy * size + dx) * 4;
        targetPixels[outIdx] = Math.round(r);
        targetPixels[outIdx + 1] = Math.round(g);
        targetPixels[outIdx + 2] = Math.round(b);
        targetPixels[outIdx + 3] = Math.round(a);
      }
    }
  }

  return encodePNG(size, size, targetPixels);
}

// Generate multi-size ICO file containing PNGs
function generateICO(pngBuffersWithSizes) {
  // ICO header: 6 bytes
  // Count: pngBuffersWithSizes.length
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngBuffersWithSizes.length, 4); // Count

  let dirOffset = 6;
  const dirSize = 16 * pngBuffersWithSizes.length;
  let imgOffset = dirOffset + dirSize;

  const dirEntries = [];
  const imgBuffers = [];

  for (const { size, png } of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(png.length, 8); // Size in bytes
    entry.writeUInt32LE(imgOffset, 12); // Offset

    dirEntries.push(entry);
    imgBuffers.push(png);
    imgOffset += png.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imgBuffers]);
}

const logoPath = path.join(__dirname, '../public/neekan-logo.png');
console.log('Reading source image:', logoPath);
const src = decodePNG(logoPath);
console.log('Decoded source image successfully:', src.width, 'x', src.height);

// Find empty columns between emblem and 'neekan' text
let emblemMaxX = 0;
let gapFound = false;
for (let x = 700; x < 1200; x++) {
  let count = 0;
  for (let y = 0; y < src.height; y++) {
    if (src.pixels[(y * src.width + x) * 4 + 3] > 10) count++;
  }
  if (count === 0) {
    emblemMaxX = x - 1;
    gapFound = true;
    break;
  }
}
console.log('Emblem maxX with gap detection:', emblemMaxX, 'gapFound:', gapFound);

// Generate square favicon with emblem centered
function generateFavicon(src, size, emblemX2) {
  const cropX = 1;
  const cropY = 0;
  const cropW = emblemX2;
  const cropH = 446;

  const targetPixels = Buffer.alloc(size * size * 4); // all 0 (transparent)

  // Padding ratio around emblem
  const paddingRatio = 0.08;
  const availW = size * (1 - paddingRatio * 2);
  const availH = size * (1 - paddingRatio * 2);

  const scale = Math.min(availW / cropW, availH / cropH);
  const drawW = Math.round(cropW * scale);
  const drawH = Math.round(cropH * scale);
  const drawX = Math.round((size - drawW) / 2);
  const drawY = Math.round((size - drawH) / 2);

  // High quality supersampled rendering
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      if (dx >= drawX && dx < drawX + drawW && dy >= drawY && dy < drawY + drawH) {
        const u = (dx - drawX + 0.5) / drawW;
        const v = (dy - drawY + 0.5) / drawH;
        
        const srcPosX = cropX + u * cropW - 0.5;
        const srcPosY = cropY + v * cropH - 0.5;

        const x0 = Math.max(0, Math.min(src.width - 1, Math.floor(srcPosX)));
        const x1 = Math.max(0, Math.min(src.width - 1, Math.ceil(srcPosX)));
        const wx1 = srcPosX - Math.floor(srcPosX);
        const wx0 = 1 - wx1;

        const y0 = Math.max(0, Math.min(src.height - 1, Math.floor(srcPosY)));
        const y1 = Math.max(0, Math.min(src.height - 1, Math.ceil(srcPosY)));
        const wy1 = srcPosY - Math.floor(srcPosY);
        const wy0 = 1 - wy1;

        const idx00 = (y0 * src.width + x0) * 4;
        const idx10 = (y0 * src.width + x1) * 4;
        const idx01 = (y1 * src.width + x0) * 4;
        const idx11 = (y1 * src.width + x1) * 4;

        const r = wy0 * (wx0 * src.pixels[idx00] + wx1 * src.pixels[idx10]) +
                  wy1 * (wx0 * src.pixels[idx01] + wx1 * src.pixels[idx11]);
        const g = wy0 * (wx0 * src.pixels[idx00 + 1] + wx1 * src.pixels[idx10 + 1]) +
                  wy1 * (wx0 * src.pixels[idx01 + 1] + wx1 * src.pixels[idx11 + 1]);
        const b = wy0 * (wx0 * src.pixels[idx00 + 2] + wx1 * src.pixels[idx10 + 2]) +
                  wy1 * (wx0 * src.pixels[idx01 + 2] + wx1 * src.pixels[idx11 + 2]);
        const a = wy0 * (wx0 * src.pixels[idx00 + 3] + wx1 * src.pixels[idx10 + 3]) +
                  wy1 * (wx0 * src.pixels[idx01 + 3] + wx1 * src.pixels[idx11 + 3]);

        const outIdx = (dy * size + dx) * 4;
        targetPixels[outIdx] = Math.round(r);
        targetPixels[outIdx + 1] = Math.round(g);
        targetPixels[outIdx + 2] = Math.round(b);
        targetPixels[outIdx + 3] = Math.round(a);
      }
    }
  }

  return encodePNG(size, size, targetPixels);
}

const png512 = generateFavicon(src, 512, emblemMaxX);
const png192 = generateFavicon(src, 192, emblemMaxX);
const png48 = generateFavicon(src, 48, emblemMaxX);
const png32 = generateFavicon(src, 32, emblemMaxX);
const png16 = generateFavicon(src, 16, emblemMaxX);

fs.writeFileSync(path.join(__dirname, '../public/favicon-512x512.png'), png512);
fs.writeFileSync(path.join(__dirname, '../public/favicon-192x192.png'), png192);
fs.writeFileSync(path.join(__dirname, '../public/favicon-32x32.png'), png32);
fs.writeFileSync(path.join(__dirname, '../public/favicon-16x16.png'), png16);
fs.writeFileSync(path.join(__dirname, '../public/neekan-favicon.png'), png512);
fs.writeFileSync(path.join(__dirname, '../public/neekan-logo-icon.png'), png512);
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), png192);

const ico = generateICO([
  { size: 16, png: png16 },
  { size: 32, png: png32 },
  { size: 48, png: png48 }
]);
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), ico);

// Generate crisp SVG wrapping the 512x512 PNG
const base64Png = png512.toString('base64');
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" xlink:href="data:image/png;base64,${base64Png}" />
</svg>`;
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);

console.log('Favicons and favicon.svg generated successfully in public folder!');
