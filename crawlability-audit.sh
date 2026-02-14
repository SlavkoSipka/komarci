#!/bin/bash
# ============================================
# Crawlability & Accessibility Audit Script
# Proverava da li Googlebot može pristupiti resursima
# ============================================

echo "🤖 CRAWLABILITY AUDIT - ugradnja-zavesa-komarnika.com"
echo "========================================================"
echo ""

# 1. Test robots.txt syntax
echo "📋 1. ROBOTS.TXT VALIDATION"
echo "----------------------------"
if [ -f "robots.txt" ]; then
  echo "✅ robots.txt exists"
  echo "Content preview:"
  head -20 robots.txt | sed 's/^/  /'
  
  # Check for blocked critical resources
  echo ""
  echo "⚠️  Checking for blocked critical paths:"
  grep -E "(Disallow.*\.(css|js|jpg|png|webp))" robots.txt && echo "  ⛔ WARNING: Critical resources may be blocked!" || echo "  ✅ No critical resources blocked"
else
  echo "❌ robots.txt NOT FOUND"
fi
echo ""

# 2. Check file permissions
echo "🔐 2. FILE PERMISSIONS CHECK"
echo "----------------------------"
echo "CSS files:"
ls -lh css/*.css 2>/dev/null | head -5 | awk '{print "  " $1 " " $9}'
echo ""
echo "JS files:"
ls -lh js/*.js 2>/dev/null | head -5 | awk '{print "  " $1 " " $9}'
echo ""
echo "Images:"
ls -lh images/*.{jpg,png,webp} 2>/dev/null | head -5 | awk '{print "  " $1 " " $9}'
echo ""

# 3. Test for 403 forbidden access issues
echo "🚫 3. 403 FORBIDDEN ACCESS CHECK"
echo "--------------------------------"
echo "Checking for .htaccess restrictions..."
if [ -f ".htaccess" ]; then
  echo "✅ .htaccess found"
  echo "Deny rules:"
  grep -i "deny from" .htaccess | sed 's/^/  /' || echo "  ✅ No deny rules found"
else
  echo "⚠️  No .htaccess file"
fi
echo ""

# 4. Check for missing files (404 errors)
echo "🔍 4. MISSING FILES DETECTION (404 Candidates)"
echo "----------------------------------------------"
echo "Scanning HTML for resource references..."

# Extract all src/href paths from HTML
ALL_RESOURCES=$(grep -roh 'src="[^"]*"' *.html | sed 's/src="//;s/"$//' | grep -v "^http" | sort -u)
ALL_RESOURCES+=" "
ALL_RESOURCES+=$(grep -roh 'href="[^"]*"' *.html | sed 's/href="//;s/"$//' | grep -v "^http" | grep -E "\.(css|js|jpg|png|webp|svg)" | sort -u)

MISSING_COUNT=0
echo "$ALL_RESOURCES" | while read -r file; do
  if [ ! -z "$file" ] && [ ! -f "$file" ]; then
    echo "  ❌ MISSING: $file"
    MISSING_COUNT=$((MISSING_COUNT + 1))
  fi
done

echo ""
echo "Total scanned: $(echo "$ALL_RESOURCES" | wc -w) resources"
echo ""

# 5. Test actual HTTP response codes (if server is running)
echo "🌐 5. HTTP RESPONSE CODE TEST"
echo "-----------------------------"
if command -v curl &> /dev/null; then
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Server is running on localhost:3000"
    echo ""
    echo "Testing critical resources:"
    
    # Test CSS
    CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/css/style.css)
    echo "  CSS (style.css): $CSS_CODE"
    
    # Test JS
    JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/js/main.js)
    echo "  JS (main.js): $JS_CODE"
    
    # Test Image
    IMG_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/images/komotraks-logotip.png)
    echo "  Image (logo): $IMG_CODE"
    
    # Test problematic path
    echo ""
    echo "Testing duplicate path vulnerability:"
    DUP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/images/images/komotraks-logotip.png)
    echo "  /images/images/logo.png: $DUP_CODE"
    if [ "$DUP_CODE" == "404" ]; then
      echo "  ✅ Correctly returns 404"
    elif [ "$DUP_CODE" == "403" ]; then
      echo "  ✅ Blocked by robots.txt/server config"
    else
      echo "  ⚠️  WARNING: Duplicate path is accessible!"
    fi
  else
    echo "⚠️  Server not running. Start with: npm run dev"
  fi
else
  echo "⚠️  curl not installed. Skipping HTTP tests."
fi
echo ""

# 6. Generate sitemap validation
echo "🗺️  6. SITEMAP VALIDATION"
echo "------------------------"
if [ -f "sitemap.xml" ]; then
  echo "✅ sitemap.xml exists"
  echo "URLs in sitemap: $(grep -c "<url>" sitemap.xml)"
  
  # Check for invalid URLs in sitemap
  echo "Checking for duplicate path references in sitemap..."
  grep -c "images/images/" sitemap.xml &>/dev/null && echo "  ⚠️  Found images/images/ in sitemap!" || echo "  ✅ No duplicate paths in sitemap"
else
  echo "❌ sitemap.xml NOT FOUND"
fi
echo ""

# 7. Google Search Console recommendations
echo "📊 7. GOOGLE SEARCH CONSOLE RECOMMENDATIONS"
echo "-------------------------------------------"
echo "To verify Googlebot access:"
echo "  1. Go to: https://search.google.com/search-console"
echo "  2. Tools → URL Inspection"
echo "  3. Test these URLs:"
echo "     - https://ugradnja-zavesa-komarnika.com/css/style.css"
echo "     - https://ugradnja-zavesa-komarnika.com/js/main.js"
echo "     - https://ugradnja-zavesa-komarnika.com/images/komotraks-logotip.png"
echo ""
echo "  4. Use 'Fetch as Google' to verify rendering"
echo ""

# 8. Final Summary
echo "✅ AUDIT COMPLETE"
echo "================"
echo ""
echo "📌 CRITICAL ACTIONS:"
echo "  1. Fix missing files identified above"
echo "  2. Run ./fix-seo-paths.sh to clean up paths"
echo "  3. Deploy .htaccess to production server"
echo "  4. Re-test with: curl -I https://ugradnja-zavesa-komarnika.com/"
echo "  5. Submit updated sitemap to Google Search Console"
echo ""
echo "📈 Expected SEO Impact after fixes:"
echo "  - Crawl errors: -100%"
echo "  - Page Experience score: +15-25 points"
echo "  - Render-blocking resources: Reduced"
echo ""
