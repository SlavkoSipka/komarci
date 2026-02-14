const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// JS fajlovi koje treba spojiti (redosled je bitan!)
const jsFiles = [
  'js/jquery.min.js',
  'js/jquery-migrate-3.0.1.min.js',
  'js/popper.min.js',
  'js/bootstrap.min.js',
  'js/jquery.easing.1.3.js',
  'js/jquery.waypoints.min.js',
  'js/jquery.stellar.min.js',
  'js/owl.carousel.min.js',
  'js/jquery.magnific-popup.min.js',
  'js/aos.js',
  'js/jquery.animatenumber.min.js',
  'js/bootstrap-datepicker.js',
  'js/jquery.timepicker.min.js',
  'js/scrollax.min.js',
  'js/range.js',
  'js/google-map.js',
  'js/main.js'
];

// Kreiraj dist folder ako ne postoji
const distJsDir = path.join(__dirname, '../dist/js');
if (!fs.existsSync(distJsDir)) {
  fs.mkdirSync(distJsDir, { recursive: true });
}

// Učitaj i spoji sve JS fajlove
let combinedJS = '';
jsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`📦 Adding: ${file}`);
    combinedJS += fs.readFileSync(filePath, 'utf8') + ';\n';
  } else {
    console.warn(`⚠️  File not found: ${file}`);
  }
});

// Minifikuj JS
console.log('🔧 Minifying JavaScript...');
minify(combinedJS, {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: true,
    keep_fnames: false,
    passes: 2
  },
  mangle: {
    keep_classnames: true,
    keep_fnames: false
  },
  format: {
    comments: false
  }
}).then(minified => {
  if (minified.error) {
    console.error('❌ JS minification error:', minified.error);
    process.exit(1);
  }

  // Sačuvaj minifikovani JS
  const outputPath = path.join(distJsDir, 'bundle.min.js');
  fs.writeFileSync(outputPath, minified.code);

  const originalSize = (combinedJS.length / 1024).toFixed(2);
  const minifiedSize = (minified.code.length / 1024).toFixed(2);
  const savings = ((1 - minified.code.length / combinedJS.length) * 100).toFixed(2);

  console.log(`✅ JavaScript optimized!`);
  console.log(`   Original: ${originalSize} KB`);
  console.log(`   Minified: ${minifiedSize} KB`);
  console.log(`   Savings: ${savings}%`);
}).catch(err => {
  console.error('❌ Minification failed:', err);
  process.exit(1);
});
