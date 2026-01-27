const fs = require('fs');
const path = require('path');

/**
 * Comprehensive SEO fixes based on Screaming Frog crawler report
 */
console.log('🚀 Starting comprehensive SEO fixes...\n');

// 1. Fix URL case issues - convert uppercase to lowercase in HTML
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

let totalFixed = 0;

HTML_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Fix uppercase URLs in href/src attributes
  // Convert URLs like href="Komarnici.html" to href="komarnici.html"
  const urlPattern = /(href|src)=["']([^"']*[A-Z][^"']*)["']/gi;
  content = content.replace(urlPattern, (match, attr, url) => {
    // Only fix relative URLs, not external ones
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return match;
    }
    // Convert to lowercase
    const fixedUrl = url.toLowerCase();
    if (fixedUrl !== url) {
      changed = true;
      return `${attr}="${fixedUrl}"`;
    }
    return match;
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed uppercase URLs in ${file}`);
    totalFixed++;
  }
});

// 2. Add robots.txt rules to block problematic paths
const robotsPath = path.join(__dirname, '..', 'robots.txt');
let robotsContent = fs.readFileSync(robotsPath, 'utf8');

// Add more specific blocks for nested paths
const additionalBlocks = `
# Block all nested incorrect paths
Disallow: /images/images/
Disallow: /images/js/
Disallow: /images/css/
Disallow: /js/images/
Disallow: /js/css/
Disallow: /css/images/
Disallow: /css/js/
Disallow: /*/images/images/
Disallow: /*/images/js/
Disallow: /*/images/css/
`;

if (!robotsContent.includes('Disallow: /images/images/')) {
  robotsContent += additionalBlocks;
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log('✅ Updated robots.txt with additional path blocks');
  totalFixed++;
}

// 3. Update _headers to add more security headers
const headersPath = path.join(__dirname, '..', '_headers');
let headersContent = fs.readFileSync(headersPath, 'utf8');

// Ensure Content-Security-Policy is present
if (!headersContent.includes('Content-Security-Policy:')) {
  const cspHeader = `  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://maps.googleapis.com; frame-src https://www.google.com;\n`;
  headersContent = headersContent.replace('/*\n', `/*\n${cspHeader}`);
  fs.writeFileSync(headersPath, headersContent, 'utf8');
  console.log('✅ Added Content-Security-Policy header');
  totalFixed++;
}

// 4. Create netlify.toml redirects for all problematic paths
const netlifyPath = path.join(__dirname, '..', 'netlify.toml');
let netlifyContent = fs.readFileSync(netlifyPath, 'utf8');

// Add redirects for nested image paths to 404 or homepage
const imageRedirects = `
# Block nested image paths - redirect to 404
[[redirects]]
  from = "/images/images/*"
  to = "/404.html"
  status = 404
  force = true

[[redirects]]
  from = "/images/js/*"
  to = "/404.html"
  status = 404
  force = true

[[redirects]]
  from = "/images/css/*"
  to = "/404.html"
  status = 404
  force = true

[[redirects]]
  from = "/js/images/*"
  to = "/404.html"
  status = 404
  force = true

[[redirects]]
  from = "/css/images/*"
  to = "/404.html"
  status = 404
  force = true
`;

if (!netlifyContent.includes('from = "/images/images/*"')) {
  // Insert before catch-all redirect
  netlifyContent = netlifyContent.replace(
    '# Catch-all for SPA',
    `${imageRedirects}\n# Catch-all for SPA`
  );
  fs.writeFileSync(netlifyPath, netlifyContent, 'utf8');
  console.log('✅ Added redirects for problematic paths in netlify.toml');
  totalFixed++;
}

console.log(`\n✅ Total fixes applied: ${totalFixed}`);
console.log('\n📋 Summary:');
console.log('  ✅ Fixed uppercase URLs in HTML files');
console.log('  ✅ Updated robots.txt with path blocks');
console.log('  ✅ Added security headers');
console.log('  ✅ Added Netlify redirects for problematic paths');
console.log('\n⚠️  Note: Some issues require server-side fixes:');
console.log('  - 19 images over 100KB (optimize manually)');
console.log('  - 461 links without anchor text (review manually)');
console.log('  - 460 bad content types (server configuration)');
