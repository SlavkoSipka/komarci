const fs = require('fs');
const path = require('path');

/**
 * Validates sitemap.xml for duplicates and incorrect paths
 */
function validateSitemap() {
  const sitemapPath = path.join(__dirname, '../sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.xml not found!');
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Check for duplicate paths
  const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
  if (!urlMatches) {
    console.error('❌ No URLs found in sitemap!');
    process.exit(1);
  }

  const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
  const duplicates = [];
  const seen = new Set();
  
  urls.forEach((url, index) => {
    if (seen.has(url)) {
      duplicates.push({ url, index: index + 1 });
    } else {
      seen.add(url);
    }
  });

  // Check for incorrect paths
  const incorrectPaths = urls.filter(url => {
    return url.includes('/images/images') || 
           url.includes('/images/images/images') ||
           url.includes('/js/js/') ||
           url.includes('/css/css/') ||
           url.match(/\/images\/js\//) ||
           url.match(/\/images\/css\//);
  });

  // Report results
  console.log('📋 Sitemap Validation Report\n');
  console.log(`Total URLs: ${urls.length}`);
  console.log(`Unique URLs: ${seen.size}`);
  
  if (duplicates.length > 0) {
    console.log(`\n❌ Found ${duplicates.length} duplicate(s):`);
    duplicates.forEach(dup => {
      console.log(`   - ${dup.url} (line ${dup.index})`);
    });
    process.exit(1);
  } else {
    console.log('✅ No duplicates found');
  }

  if (incorrectPaths.length > 0) {
    console.log(`\n❌ Found ${incorrectPaths.length} incorrect path(s):`);
    incorrectPaths.forEach(path => {
      console.log(`   - ${path}`);
    });
    process.exit(1);
  } else {
    console.log('✅ No incorrect paths found');
  }

  // Validate URL format
  const invalidUrls = urls.filter(url => {
    return !url.startsWith('https://ugradnja-zavesa-komarnika.com/') &&
           !url.startsWith('https://ugradnja-zavesa-komarnika.com');
  });

  if (invalidUrls.length > 0) {
    console.log(`\n⚠️  Found ${invalidUrls.length} URL(s) with incorrect domain:`);
    invalidUrls.forEach(url => {
      console.log(`   - ${url}`);
    });
  }

  console.log('\n✅ Sitemap validation passed!');
}

validateSitemap();
