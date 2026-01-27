const fs = require('fs');
const path = require('path');

/**
 * Analyzes links without anchor text in HTML files
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

function analyzeLinks() {
  console.log('🔍 Analyzing links without anchor text...\n');
  
  let totalLinksWithoutText = 0;
  const linkTypes = {
    placeholder: [], // href="#"
    imageOnly: [],    // <a><img></a> without alt or text
    iconOnly: [],     // <a><span class="icon"></span></a> without text
    empty: [],        // <a></a> completely empty
    other: []         // Other cases
  };

  HTML_FILES.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all <a> tags
    const linkRegex = /<a([^>]*)>([\s\S]*?)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const attributes = match[1];
      const innerContent = match[2].trim();
      
      // Extract href
      const hrefMatch = attributes.match(/href=["']([^"']*)["']/);
      const href = hrefMatch ? hrefMatch[1] : '';
      
      // Check if has anchor text
      const hasText = innerContent && 
                     !innerContent.match(/^<img[^>]*>$/i) && 
                     !innerContent.match(/^<span[^>]*class=["'][^"']*icon[^"']*["'][^>]*><\/span>$/i) &&
                     !innerContent.match(/^<i[^>]*class=["'][^"']*icon[^"']*["'][^>]*><\/i>$/i) &&
                     innerContent.replace(/<[^>]+>/g, '').trim().length > 0;
      
      // Check if has image with alt
      const imgMatch = innerContent.match(/<img[^>]*alt=["']([^"']*)["']/i);
      const hasAltText = imgMatch && imgMatch[1].trim().length > 0;
      
      if (!hasText && !hasAltText) {
        totalLinksWithoutText++;
        
        const linkInfo = {
          file,
          href,
          innerContent: innerContent.substring(0, 100),
          line: content.substring(0, match.index).split('\n').length
        };
        
        if (href === '#' || href === '' || href.startsWith('javascript:')) {
          linkTypes.placeholder.push(linkInfo);
        } else if (innerContent.match(/<img/i)) {
          linkTypes.imageOnly.push(linkInfo);
        } else if (innerContent.match(/<span[^>]*class=["'][^"']*icon/i) || innerContent.match(/<i[^>]*class=["'][^"']*icon/i)) {
          linkTypes.iconOnly.push(linkInfo);
        } else if (innerContent.length === 0) {
          linkTypes.empty.push(linkInfo);
        } else {
          linkTypes.other.push(linkInfo);
        }
      }
    }
  });

  console.log(`📊 Total links without anchor text: ${totalLinksWithoutText}\n`);
  
  console.log(`📌 Breakdown by type:\n`);
  console.log(`   Placeholder links (href="#"): ${linkTypes.placeholder.length}`);
  console.log(`   Image-only links (no alt): ${linkTypes.imageOnly.length}`);
  console.log(`   Icon-only links: ${linkTypes.iconOnly.length}`);
  console.log(`   Empty links: ${linkTypes.empty.length}`);
  console.log(`   Other: ${linkTypes.other.length}\n`);

  // Show examples
  if (linkTypes.placeholder.length > 0) {
    console.log(`\n🔗 Examples of placeholder links (href="#"):`);
    linkTypes.placeholder.slice(0, 5).forEach(link => {
      console.log(`   ${link.file}:${link.line} - href="${link.href}"`);
      console.log(`     Content: ${link.innerContent.substring(0, 60)}...`);
    });
  }

  if (linkTypes.imageOnly.length > 0) {
    console.log(`\n🖼️  Examples of image-only links (need alt text):`);
    linkTypes.imageOnly.slice(0, 5).forEach(link => {
      console.log(`   ${link.file}:${link.line} - href="${link.href}"`);
      console.log(`     Content: ${link.innerContent.substring(0, 60)}...`);
    });
  }

  if (linkTypes.iconOnly.length > 0) {
    console.log(`\n🎨 Examples of icon-only links:`);
    linkTypes.iconOnly.slice(0, 5).forEach(link => {
      console.log(`   ${link.file}:${link.line} - href="${link.href}"`);
      console.log(`     Content: ${link.innerContent.substring(0, 60)}...`);
    });
  }

  console.log(`\n💡 Recommendations:`);
  console.log(`   ✅ Placeholder links (href="#") are OK - they're not indexed`);
  console.log(`   ✅ Icon-only links with aria-label are OK`);
  console.log(`   ⚠️  Image links need alt text for accessibility`);
  console.log(`   ⚠️  Empty links should be removed or have content`);
}

analyzeLinks();
