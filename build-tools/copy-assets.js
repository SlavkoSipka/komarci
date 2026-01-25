const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📂 Copying assets...\n');

// Kopiraj images
console.log('📸 Copying images...');
copyDir(
  path.join(__dirname, '../images'),
  path.join(__dirname, '../dist/images')
);

// Kopiraj fonts
console.log('🔤 Copying fonts...');
copyDir(
  path.join(__dirname, '../fonts'),
  path.join(__dirname, '../dist/fonts')
);

// Kopiraj favicons
console.log('⭐ Copying favicons...');
copyDir(
  path.join(__dirname, '../favicons'),
  path.join(__dirname, '../dist/favicons')
);

// Kopiraj config.js (API key) - ali će korisnik trebati da ga updejtuje
if (fs.existsSync(path.join(__dirname, '../js/config.js'))) {
  const distJsDir = path.join(__dirname, '../dist/js');
  if (!fs.existsSync(distJsDir)) {
    fs.mkdirSync(distJsDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, '../js/config.js'),
    path.join(distJsDir, 'config.js')
  );
  console.log('🔑 Copied config.js');
}

// Kopiraj sitemap.xml ako postoji
if (fs.existsSync(path.join(__dirname, '../sitemap.xml'))) {
  fs.copyFileSync(
    path.join(__dirname, '../sitemap.xml'),
    path.join(__dirname, '../dist/sitemap.xml')
  );
  console.log('🗺️  Copied sitemap.xml');
}

// Kopiraj _headers za Netlify ako postoji
if (fs.existsSync(path.join(__dirname, '../_headers'))) {
  fs.copyFileSync(
    path.join(__dirname, '../_headers'),
    path.join(__dirname, '../dist/_headers')
  );
  console.log('📋 Copied _headers for Netlify');
}

console.log('\n✅ All assets copied successfully!');
