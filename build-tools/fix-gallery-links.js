const fs = require('fs');
const path = require('path');

/**
 * Adds aria-label and hidden text to gallery links for SEO and accessibility
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

function fixGalleryLinks() {
  console.log('🔧 Fixing gallery links...\n');
  
  let totalFixed = 0;

  HTML_FILES.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    let fixed = 0;
    
    // Find gallery links with title but no anchor text
    // Pattern: <a ... class="gallery image-popup" ... title="..." ...>
    const galleryLinkRegex = /<a([^>]*class=["'][^"']*gallery[^"']*image-popup[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi;
    
    content = content.replace(galleryLinkRegex, (match, attributes, innerContent) => {
      // Extract title attribute
      const titleMatch = attributes.match(/title=["']([^"']*)["']/);
      if (!titleMatch) return match; // Skip if no title
      
      const title = titleMatch[1];
      
      // Check if already has aria-label or visible text
      if (attributes.includes('aria-label=') || 
          innerContent.replace(/<[^>]+>/g, '').trim().length > 0) {
        return match; // Already has text
      }
      
      // Add aria-label and hidden text
      const newAttributes = attributes.replace(
        /title=["']([^"']*)["']/,
        `title="$1" aria-label="Pogledaj sliku: $1"`
      );
      
      // Add hidden text for SEO (visually hidden but accessible)
      const newInnerContent = innerContent + `<span class="sr-only">${title}</span>`;
      
      changed = true;
      fixed++;
      return `<a${newAttributes}>${newInnerContent}</a>`;
    });
    
    if (changed) {
      // Add CSS for sr-only class if not exists
      if (!content.includes('.sr-only')) {
        const styleRegex = /(<style[^>]*>|<\/head>)/i;
        const srOnlyCSS = `
    <style>
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    </style>
`;
        content = content.replace(styleRegex, (match) => {
          if (match.includes('</head>')) {
            return srOnlyCSS + match;
          }
          return match;
        });
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Fixed ${fixed} gallery links in ${file}`);
      totalFixed += fixed;
    }
  });

  console.log(`\n✅ Total: Fixed ${totalFixed} gallery links`);
  console.log('\n💡 Explanation:');
  console.log('  - Gallery links now have aria-label for accessibility');
  console.log('  - Added hidden text (sr-only) for SEO crawlers');
  console.log('  - These links are NOT for indexing (they link to images)');
  console.log('  - But they need text for accessibility and SEO compliance');
}

fixGalleryLinks();
