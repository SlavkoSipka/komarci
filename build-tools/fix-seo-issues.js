const fs = require('fs');
const path = require('path');

/**
 * Fixes all SEO issues found by Screaming Frog crawler
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

const CANONICAL_URLS = {
  'index.html': 'https://ugradnja-zavesa-komarnika.com/',
  'komarnici.html': 'https://ugradnja-zavesa-komarnika.com/komarnici.html',
  'harmonika-vrata.html': 'https://ugradnja-zavesa-komarnika.com/harmonika-vrata.html',
  'zavese.html': 'https://ugradnja-zavesa-komarnika.com/zavese.html',
  'kontakt.html': 'https://ugradnja-zavesa-komarnika.com/kontakt.html',
  'galerija.html': 'https://ugradnja-zavesa-komarnika.com/galerija.html',
  'blog.html': 'https://ugradnja-zavesa-komarnika.com/blog.html',
  'autor.html': 'https://ugradnja-zavesa-komarnika.com/autor.html'
};

function fixHTMLFile(filePath) {
  console.log(`\n🔧 Fixing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove meta keywords (deprecated, Google doesn't use them)
  const keywordsRegex = /<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>\s*\n?/gi;
  if (content.match(keywordsRegex)) {
    content = content.replace(keywordsRegex, '');
    changed = true;
    console.log('  ✅ Removed meta keywords tag');
  }

  // 2. Add/update canonical tag
  const fileName = path.basename(filePath);
  const canonicalUrl = CANONICAL_URLS[fileName];
  if (canonicalUrl) {
    const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>\s*\n?/gi;
    const newCanonical = `    <link rel="canonical" href="${canonicalUrl}">\n`;
    
    if (content.match(canonicalRegex)) {
      content = content.replace(canonicalRegex, newCanonical);
      console.log('  ✅ Updated canonical tag');
    } else {
      // Add canonical after description or before Open Graph
      const insertPoint = content.match(/<meta\s+name=["']description["'][^>]*>/i);
      if (insertPoint) {
        const insertIndex = content.indexOf(insertPoint[0]) + insertPoint[0].length;
        content = content.slice(0, insertIndex) + '\n' + newCanonical + content.slice(insertIndex);
        console.log('  ✅ Added canonical tag');
      }
    }
    changed = true;
  }

  // 3. Remove noindex from autor.html (or add content)
  if (fileName === 'autor.html') {
    const noindexRegex = /<meta\s+name=["']robots["']\s+content=["']noindex[^"']*["']\s*\/?>\s*\n?/gi;
    if (content.match(noindexRegex)) {
      content = content.replace(noindexRegex, '');
      changed = true;
      console.log('  ✅ Removed noindex from autor.html');
    }
  }

  // 4. Fix images - add width/height attributes (basic fix, will need manual review for exact dimensions)
  // This is a placeholder - actual dimensions should be added manually or via image processing
  const imgRegex = /<img([^>]*?)(?:\s+width=["'][^"']*["'])?(?:\s+height=["'][^"']*["'])?([^>]*?)>/gi;
  // Note: We'll add a script to extract and add dimensions later

  // 5. Fix external links - add rel="noopener" to target="_blank"
  const externalLinkRegex = /<a([^>]*?)\s+target=["']_blank["']([^>]*?)(?:\s+rel=["'][^"']*["'])?([^>]*?)>/gi;
  content = content.replace(externalLinkRegex, (match, before, target, after) => {
    if (!match.includes('rel=')) {
      return match.replace('target="_blank"', 'target="_blank" rel="noopener"');
    } else if (!match.includes('noopener') && !match.includes('noreferrer')) {
      return match.replace(/rel=["']([^"']*)["']/, 'rel="$1 noopener"');
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved changes to ${filePath}`);
  } else {
    console.log(`  ℹ️  No changes needed for ${filePath}`);
  }

  return changed;
}

// Fix all HTML files
console.log('🚀 Starting SEO fixes...\n');
let totalFixed = 0;

HTML_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    if (fixHTMLFile(filePath)) {
      totalFixed++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✅ Fixed ${totalFixed} files`);
console.log('\n📋 Next steps:');
console.log('  1. Add width/height attributes to images (16 images need this)');
console.log('  2. Review and fix H2 heading structure');
console.log('  3. Add anchor text to internal links (461 links)');
console.log('  4. Optimize page titles (3 pages over 60 chars)');
console.log('  5. Add Content-Security-Policy header');
