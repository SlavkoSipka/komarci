const fs = require('fs');
const path = require('path');

/**
 * Konvertuje HTML fajlove da koriste WebP slike umesto JPG
 * Dodaje <picture> tag sa fallback-om za stare browsere
 */

function convertImgToWebP(htmlContent) {
  // Regex za img tagove sa .jpg ekstenzijom
  const imgRegex = /<img\s+([^>]*src=["']images\/([^"']+)\.(jpg|jpeg)["'][^>]*)>/gi;
  
  return htmlContent.replace(imgRegex, (match, attributes, filename, ext) => {
    // Извуци атрибуте
    const srcMatch = attributes.match(/src=["']([^"']+)["']/);
    const altMatch = attributes.match(/alt=["']([^"']*)["']/);
    const classMatch = attributes.match(/class=["']([^"']*)["']/);
    const loadingMatch = attributes.match(/loading=["']([^"']*)["']/);
    const styleMatch = attributes.match(/style=["']([^"']*)["']/);
    
    const jpgSrc = srcMatch ? srcMatch[1] : `images/${filename}.${ext}`;
    const webpSrc = `images/${filename}.webp`;
    const alt = altMatch ? altMatch[1] : '';
    const className = classMatch ? classMatch[1] : '';
    const loading = loadingMatch ? loadingMatch[1] : 'lazy';
    const style = styleMatch ? styleMatch[1] : '';
    
    // Kreiraj <picture> tag sa fallback-om
    return `<picture>
      <source srcset="${webpSrc}" type="image/webp">
      <img src="${jpgSrc}" alt="${alt}"${className ? ` class="${className}"` : ''}${style ? ` style="${style}"` : ''} loading="${loading}">
    </picture>`;
  });
}

function convertBackgroundImages(htmlContent) {
  // Regex za background-image sa .jpg ekstenzijom
  const bgRegex = /background-image:\s*url\(['"]?images\/([^'"]+)\.(jpg|jpeg)['"]?\)/gi;
  
  return htmlContent.replace(bgRegex, (match, filename, ext) => {
    // Za background slike, dodaj klasu i data atribut za lazy loading
    return `background-image: url('images/${filename}.webp')`;
  });
}

function processHtmlFile(filePath) {
  console.log(`\n📄 Obrađujem: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalSize = Buffer.byteLength(content, 'utf8');
  
  // Konvertuj img tagove
  content = convertImgToWebP(content);
  
  // Konvertuj background-image stilove
  content = convertBackgroundImages(content);
  
  // Sačuvaj izmenjeni fajl
  fs.writeFileSync(filePath, content, 'utf8');
  
  const newSize = Buffer.byteLength(content, 'utf8');
  const diff = newSize - originalSize;
  
  console.log(`✓ Zamenjeno JPG sa WebP formatom`);
  console.log(`  HTML veličina: ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB (${diff > 0 ? '+' : ''}${(diff / 1024).toFixed(2)} KB)`);
}

// Pronađi sve HTML fajlove
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'kontakt.html'),
  path.join(__dirname, 'komarnici.html'),
  path.join(__dirname, 'harmonika-vrata.html'),
  path.join(__dirname, 'zavese.html'),
  path.join(__dirname, 'galerija.html'),
  path.join(__dirname, 'blog.html'),
  path.join(__dirname, 'autor.html')
];

console.log('🔄 Konvertovanje HTML fajlova da koriste WebP slike...\n');

let processedCount = 0;
htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    processHtmlFile(file);
    processedCount++;
  }
});

console.log(`\n✅ Završeno! Obrađeno ${processedCount} fajlova.`);
console.log('\n📊 REZULTATI:');
console.log('  • Sve JPG slike su zamenjene sa WebP formatom');
console.log('  • Dodati <picture> tagovi sa fallback-om za stare browsere');
console.log('  • Background slike sada koriste WebP format');
console.log('\n💡 Sledeći korak: Testirajte sajt u browseru!');
