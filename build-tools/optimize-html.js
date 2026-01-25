const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const htmlFiles = [
  'index.html',
  'komarnici.html',
  'zavese.html',
  'harmonika-vrata.html',
  'galerija.html',
  'kontakt.html',
  'blog.html',
  'autor.html'
];

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Minifikacione opcije
const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  useShortDoctype: true
};

let totalOriginal = 0;
let totalMinified = 0;

console.log('🔧 Optimizing HTML files...\n');

htmlFiles.forEach(async (file) => {
  const inputPath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️  File not found: ${file}`);
    return;
  }

  let html = fs.readFileSync(inputPath, 'utf8');
  
  // Zameni individualne CSS linkove sa bundlom
  const cssPattern = /<link[^>]*href=["']css\/[^"']*["'][^>]*>/gi;
  const cssLinks = html.match(cssPattern) || [];
  
  if (cssLinks.length > 0) {
    // Zadrži samo prvi link i pretvori ga u bundle link
    let replaced = false;
    html = html.replace(cssPattern, (match) => {
      if (!replaced) {
        replaced = true;
        return '<link rel="stylesheet" href="css/bundle.min.css">';
      }
      return ''; // Ukloni ostale CSS linkove
    });
  }
  
  // Zameni individualne JS scriptove sa bundlom
  const jsPattern = /<script[^>]*src=["']js\/(?!config\.js)[^"']*["'][^>]*><\/script>/gi;
  const jsScripts = html.match(jsPattern) || [];
  
  if (jsScripts.length > 0) {
    // Zadrži samo prvi script i pretvori ga u bundle
    let replaced = false;
    html = html.replace(jsPattern, (match) => {
      if (!replaced) {
        replaced = true;
        return '<script src="js/bundle.min.js" defer></script>';
      }
      return ''; // Ukloni ostale JS scriptove
    });
  }
  
  // Dodaj preload za kritične resurse
  const headClosing = html.indexOf('</head>');
  if (headClosing !== -1) {
    const preloads = `
  <link rel="preload" href="css/bundle.min.css" as="style">
  <link rel="preload" href="js/bundle.min.js" as="script">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://maps.googleapis.com">
`;
    html = html.slice(0, headClosing) + preloads + html.slice(headClosing);
  }
  
  // Minifikuj HTML
  const minified = await minify(html, minifyOptions);
  
  // Sačuvaj
  const outputPath = path.join(distDir, file);
  fs.writeFileSync(outputPath, minified);
  
  const originalSize = (html.length / 1024).toFixed(2);
  const minifiedSize = (minified.length / 1024).toFixed(2);
  const savings = ((1 - minified.length / html.length) * 100).toFixed(2);
  
  totalOriginal += html.length;
  totalMinified += minified.length;
  
  console.log(`✅ ${file}`);
  console.log(`   ${originalSize} KB → ${minifiedSize} KB (${savings}% savings)`);
});

setTimeout(() => {
  const totalSavings = ((1 - totalMinified / totalOriginal) * 100).toFixed(2);
  console.log(`\n🎉 Total HTML optimization: ${totalSavings}% reduction`);
}, 1000);
