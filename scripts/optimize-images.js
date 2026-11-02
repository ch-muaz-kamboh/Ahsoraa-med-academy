const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const TEAM_DIR = path.join(PUBLIC_DIR, 'team');

async function optimizeFile(filePath, isAvatar = false) {
  const originalBuffer = fs.readFileSync(filePath);
  const originalSize = originalBuffer.length;
  const ext = path.extname(filePath).toLowerCase();

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  try {
    const image = sharp(originalBuffer);
    const metadata = await image.metadata();

    let transform = sharp(originalBuffer);

    const maxWidth = isAvatar ? 500 : 1600;
    const maxHeight = isAvatar ? 500 : 1200;

    if (metadata.width && metadata.height && (metadata.width > maxWidth || metadata.height > maxHeight)) {
      transform = transform.resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    let buffer;
    if (ext === '.png') {
      buffer = await transform.png({ quality: 85, compressionLevel: 8 }).toBuffer();
    } else {
      buffer = await transform.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();
    }

    if (buffer.length < originalSize) {
      fs.writeFileSync(filePath, buffer);
      const savedPct = (((originalSize - buffer.length) / originalSize) * 100).toFixed(1);
      console.log(`[OPTIMIZED] ${path.basename(filePath)}: ${(originalSize / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB (-${savedPct}%)`);
    } else {
      console.log(`[SKIPPED] ${path.basename(filePath)}: already optimal`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to optimize ${path.basename(filePath)}:`, err.message);
  }
}

async function run() {
  console.log('Optimizing main public images...');
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  for (const file of publicFiles) {
    const fullPath = path.join(PUBLIC_DIR, file);
    if (fs.statSync(fullPath).isFile()) {
      await optimizeFile(fullPath, false);
    }
  }

  if (fs.existsSync(TEAM_DIR)) {
    console.log('\nOptimizing team avatars...');
    const teamFiles = fs.readdirSync(TEAM_DIR);
    for (const file of teamFiles) {
      const fullPath = path.join(TEAM_DIR, file);
      if (fs.statSync(fullPath).isFile()) {
        await optimizeFile(fullPath, true);
      }
    }
  }

  console.log('\nImage optimization finished!');
}

run();
