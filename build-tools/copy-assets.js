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

// Kopiraj emailjs-contact.js - trebuje biti dostupan kao odvojeni fajl
if (fs.existsSync(path.join(__dirname, '../js/emailjs-contact.js'))) {
  const distJsDir = path.join(__dirname, '../dist/js');
  if (!fs.existsSync(distJsDir)) {
    fs.mkdirSync(distJsDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, '../js/emailjs-contact.js'),
    path.join(distJsDir, 'emailjs-contact.js')
  );
  console.log('📧 Copied emailjs-contact.js');
}

// Kopiraj sw-register.js - trebuje biti dostupan kao odvojeni fajl
if (fs.existsSync(path.join(__dirname, '../js/sw-register.js'))) {
  const distJsDir = path.join(__dirname, '../dist/js');
  if (!fs.existsSync(distJsDir)) {
    fs.mkdirSync(distJsDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, '../js/sw-register.js'),
    path.join(distJsDir, 'sw-register.js')
  );
  console.log('⚙️  Copied sw-register.js');
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

// Kopiraj _redirects za Netlify ako postoji
if (fs.existsSync(path.join(__dirname, '../_redirects'))) {
  fs.copyFileSync(
    path.join(__dirname, '../_redirects'),
    path.join(__dirname, '../dist/_redirects')
  );
  console.log('🔀 Copied _redirects for Netlify');
}

// Kopiraj service-worker.js
if (fs.existsSync(path.join(__dirname, '../service-worker.js'))) {
  fs.copyFileSync(
    path.join(__dirname, '../service-worker.js'),
    path.join(__dirname, '../dist/service-worker.js')
  );
  console.log('⚙️  Copied service-worker.js');
}

// Kopiraj robots.txt
if (fs.existsSync(path.join(__dirname, '../robots.txt'))) {
  fs.copyFileSync(
    path.join(__dirname, '../robots.txt'),
    path.join(__dirname, '../dist/robots.txt')
  );
  console.log('🤖 Copied robots.txt');
}

// Kopiraj 404.html
if (fs.existsSync(path.join(__dirname, '../404.html'))) {
  fs.copyFileSync(
    path.join(__dirname, '../404.html'),
    path.join(__dirname, '../dist/404.html')
  );
  console.log('⚠️  Copied 404.html');
}

// Kopiraj lazy-backgrounds.js - trebuje biti dostupan kao odvojeni fajl
if (fs.existsSync(path.join(__dirname, '../js/lazy-backgrounds.js'))) {
  const distJsDir = path.join(__dirname, '../dist/js');
  if (!fs.existsSync(distJsDir)) {
    fs.mkdirSync(distJsDir, { recursive: true });
  }
  fs.copyFileSync(
    path.join(__dirname, '../js/lazy-backgrounds.js'),
    path.join(distJsDir, 'lazy-backgrounds.js')
  );
  console.log('🖼️  Copied lazy-backgrounds.js');
}

console.log('\n✅ All assets copied successfully!');
