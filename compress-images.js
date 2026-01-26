const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images-optimized');

// Kreiraj output folder ako ne postoji
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const fileName = path.basename(inputPath, ext);
    
    // Preskoči non-image fajlove
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      console.log(`Skipping ${fileName}${ext} (not a supported image)`);
      return;
    }

    const webpPath = path.join(outputDir, `${fileName}.webp`);
    const jpgPath = path.join(outputDir, `${fileName}.jpg`);

    // Konvertuj u WebP (najbolja kompresija)
    await sharp(inputPath)
      .resize(1920, null, { // Max širina 1920px, održi aspect ratio
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 }) // 80% kvalitet je odličan balans
      .toFile(webpPath);

    // Takođe napravi optimizovan JPG kao fallback
    await sharp(inputPath)
      .resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 82, progressive: true })
      .toFile(jpgPath);

    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(webpPath).size;
    const jpgSize = fs.statSync(jpgPath).size;
    
    const webpReduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const jpgReduction = ((originalSize - jpgSize) / originalSize * 100).toFixed(1);

    console.log(`✓ ${fileName}:`);
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB (-${webpReduction}%)`);
    console.log(`  JPG: ${(jpgSize / 1024 / 1024).toFixed(2)} MB (-${jpgReduction}%)`);

  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }
}

async function compressAllImages() {
  const files = fs.readdirSync(inputDir);
  
  console.log(`\n🖼️  Kompresovanje ${files.length} fajlova...\n`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    
    if (fs.statSync(inputPath).isFile()) {
      await compressImage(inputPath);
    }
  }

  console.log('\n✅ Kompresija završena!');
  console.log(`📁 Optimizovane slike su u: ${outputDir}`);
}

compressAllImages();
