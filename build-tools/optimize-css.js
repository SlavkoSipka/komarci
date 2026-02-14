const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// CSS fajlovi koje treba spojiti (redosled je bitan!)
const cssFiles = [
  'css/animate.css',
  'css/aos.css',
  'css/bootstrap.min.css',
  'css/bootstrap-datepicker.css',
  'css/flaticon.css',
  'css/icomoon.css',
  'css/ionicons.min.css',
  'css/jquery.timepicker.css',
  'css/magnific-popup.css',
  'css/open-iconic-bootstrap.min.css',
  'css/owl.carousel.min.css',
  'css/owl.theme.default.min.css',
  'css/style.css'
];

// Kreiraj dist folder ako ne postoji
const distCssDir = path.join(__dirname, '../dist/css');
if (!fs.existsSync(distCssDir)) {
  fs.mkdirSync(distCssDir, { recursive: true });
}

// Učitaj i spoji sve CSS fajlove
let combinedCSS = '';
cssFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`📦 Adding: ${file}`);
    combinedCSS += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.warn(`⚠️  File not found: ${file}`);
  }
});

// Minifikuj CSS
console.log('🔧 Minifying CSS...');
const minified = new CleanCSS({
  level: 2,
  compatibility: 'ie11'
}).minify(combinedCSS);

if (minified.errors.length > 0) {
  console.error('❌ CSS minification errors:', minified.errors);
  process.exit(1);
}

// Sačuvaj minifikovani CSS
const outputPath = path.join(distCssDir, 'bundle.min.css');
fs.writeFileSync(outputPath, minified.styles);

const originalSize = (combinedCSS.length / 1024).toFixed(2);
const minifiedSize = (minified.styles.length / 1024).toFixed(2);
const savings = ((1 - minified.styles.length / combinedCSS.length) * 100).toFixed(2);

console.log(`✅ CSS optimized!`);
console.log(`   Original: ${originalSize} KB`);
console.log(`   Minified: ${minifiedSize} KB`);
console.log(`   Savings: ${savings}%`);
