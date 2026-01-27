const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Checks HTML files for incorrect image/asset paths
 */
function checkPaths() {
  console.log('🔍 Checking for incorrect paths in HTML files...\n');

  const htmlFiles = glob.sync('**/*.html', {
    ignore: ['node_modules/**', 'dist/**', '.git/**']
  });

  let foundIssues = false;
  const issues = [];

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for incorrect paths (only problematic nested paths)
    const patterns = [
      /images\/images\/images/g,
      /images\/images\/[^\/]/g,  // images/images/ followed by non-slash (but not images/images/images)
      /images\/js\//g,
      /images\/css\//g,
      /js\/images\//g,
      /js\/css\//g,
      /css\/images\//g,
      /css\/js\//g,
      /\.\.\/images\/images/g,
      /src=["'][^"']*images\/images/g,
      /href=["'][^"']*images\/images/g
    ];

    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        // Filter out false positives - valid paths like "images/komotraks-logotip.png"
        const validMatches = matches.filter(match => {
          // Allow simple "images/filename" patterns
          if (match.match(/^images\/[^\/]+$/)) return false;
          // Allow "images/filename.ext" in href/src attributes
          if (match.match(/["']images\/[^\/"']+["']/)) return false;
          return true;
        });
        
        if (validMatches.length > 0) {
          foundIssues = true;
          const patternNames = [
            'images/images/images (triple nested)',
            'images/images/ (double nested)',
            'images/js/ (incorrect path)',
            'images/css/ (incorrect path)',
            'js/images/ (incorrect path)',
            'js/css/ (incorrect path)',
            'css/images/ (incorrect path)',
            'css/js/ (incorrect path)',
            '../images/images (incorrect relative)',
            'src with images/images',
            'href with images/images'
          ];
        
          issues.push({
            file,
            pattern: patternNames[index],
            count: validMatches.length,
            examples: validMatches.slice(0, 3) // Show first 3 examples
          });
        }
      }
    });
  });

  if (foundIssues) {
    console.log('❌ Found incorrect paths:\n');
    issues.forEach(issue => {
      console.log(`   ${issue.file}:`);
      console.log(`     - Pattern: ${issue.pattern}`);
      console.log(`     - Count: ${issue.count}`);
      if (issue.examples && issue.examples.length > 0) {
        console.log(`     - Examples:`);
        issue.examples.forEach(example => {
          console.log(`       • ${example.substring(0, 80)}${example.length > 80 ? '...' : ''}`);
        });
      }
      console.log('');
    });
    process.exit(1);
  } else {
    console.log('✅ No incorrect paths found in HTML files!');
  }
}

// Check if glob is available, if not use simple fs.readdir
try {
  checkPaths();
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log('⚠️  glob module not found. Using basic file search...');
    
    const htmlFiles = [];
    function findHtmlFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
          findHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
          htmlFiles.push(filePath);
        }
      });
    }
    
    findHtmlFiles('.');
    
    let foundIssues = false;
    htmlFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('images/images') || 
          content.includes('images/js/') || 
          content.includes('images/css/')) {
        console.log(`❌ Found issue in: ${file}`);
        foundIssues = true;
      }
    });
    
    if (!foundIssues) {
      console.log('✅ No incorrect paths found!');
    } else {
      process.exit(1);
    }
  } else {
    throw e;
  }
}
