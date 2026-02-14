const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Adds width and height attributes to images in HTML files
 */
const HTML_FILES = [
  'index.html',
  'komarnici.html',
  'harmonika-vrata.html',
  'zavese.html',
  'kontakt.html',
  'galerija.html',
  'blog.html',
  'autor.html'
];

async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.warn(`  ⚠️  Could not get dimensions for ${imagePath}: ${error.message}`);
    return null;
  }
}

async function fixImagesInFile(filePath) {
  console.log(`\n🖼️  Processing images in ${path.basename(filePath)}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  const imgRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  const matches = [...content.matchAll(imgRegex)];
  
  let fixed = 0;
  
  for (const match of matches) {
    const fullMatch = match[0];
    const beforeSrc = match[1];
    const src = match[2];
    const afterSrc = match[3];
    
    // Skip if already has width and height
    if (fullMatch.includes('width=') && fullMatch.includes('height=')) {
      continue;
    }
    
    // Resolve image path
    let imagePath = src;
    if (!path.isAbsolute(imagePath)) {
      imagePath = path.join(path.dirname(filePath), imagePath);
    }
    
    // Skip external images
    if (src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }
    
    if (fs.existsSync(imagePath)) {
      const dimensions = await getImageDimensions(imagePath);
      if (dimensions) {
        const newImg = `<img${beforeSrc}src="${src}" width="${dimensions.width}" height="${dimensions.height}"${afterSrc}>`;
        content = content.replace(fullMatch, newImg);
        fixed++;
        console.log(`  ✅ Added dimensions to ${path.basename(src)} (${dimensions.width}x${dimensions.height})`);
      }
    }
  }
  
  if (fixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Fixed ${fixed} images in ${path.basename(filePath)}`);
  } else {
    console.log(`  ℹ️  No images needed fixing in ${path.basename(filePath)}`);
  }
  
  return fixed;
}

async function main() {
  console.log('🚀 Adding image dimensions...\n');
  let totalFixed = 0;
  
  for (const file of HTML_FILES) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const fixed = await fixImagesInFile(filePath);
      totalFixed += fixed;
    }
  }
  
  console.log(`\n✅ Total: Fixed ${totalFixed} images`);
}

main().catch(console.error);
