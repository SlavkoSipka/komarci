#!/bin/bash
# ============================================
# SEO Path Cleanup Script
# Automatska zamena pogrešnih putanja
# ============================================

echo "🔍 Starting SEO Path Cleanup..."

# Backup svih HTML fajlova
echo "📦 Creating backup..."
tar -czf backup-html-$(date +%Y%m%d-%H%M%S).tar.gz *.html
echo "✅ Backup created"

# 1. Zamena /images/images/ sa /images/
echo "🔧 Fixing duplicate /images/images/ paths..."
find . -name "*.html" -type f -exec sed -i 's|images/images/|images/|g' {} +
find . -name "*.css" -type f -exec sed -i 's|images/images/|images/|g' {} +

# 2. Zamena /images/js/ sa /js/
echo "🔧 Fixing misplaced /images/js/ paths..."
find . -name "*.html" -type f -exec sed -i 's|images/js/|js/|g' {} +

# 3. Zamena /images/css/ sa /css/
echo "🔧 Fixing misplaced /images/css/ paths..."
find . -name "*.html" -type f -exec sed -i 's|images/css/|css/|g' {} +

# 4. Zamena /js/images/ sa /images/
echo "🔧 Fixing reverse /js/images/ paths..."
find . -name "*.html" -type f -exec sed -i 's|js/images/|images/|g' {} +

# 5. Case sensitivity fix za image extensions
echo "🔧 Standardizing image extensions..."
find . -name "*.html" -type f -exec sed -i 's/\.JPG/.jpg/g' {} +
find . -name "*.html" -type f -exec sed -i 's/\.PNG/.png/g' {} +
find . -name "*.html" -type f -exec sed -i 's/\.WEBP/.webp/g' {} +

# 6. Provera rezultata
echo ""
echo "📊 Verification - Checking for remaining issues:"
echo "-------------------------------------------"
echo "❌ Remaining /images/images/ references:"
grep -r "images/images/" *.html 2>/dev/null | wc -l
echo "❌ Remaining /images/js/ references:"
grep -r "images/js/" *.html 2>/dev/null | wc -l
echo "❌ Remaining uppercase extensions:"
grep -rE "\.(JPG|PNG|WEBP)" *.html 2>/dev/null | wc -l
echo ""

# 7. Generate validation report
echo "📝 Generating validation report..."
{
  echo "=== SEO PATH CLEANUP REPORT ==="
  echo "Date: $(date)"
  echo ""
  echo "Scanned Files:"
  find . -name "*.html" -type f | wc -l
  echo ""
  echo "Remaining Issues:"
  echo "- Duplicate /images/images/: $(grep -r "images/images/" *.html 2>/dev/null | wc -l)"
  echo "- Misplaced /images/js/: $(grep -r "images/js/" *.html 2>/dev/null | wc -l)"
  echo "- Uppercase extensions: $(grep -rE "\.(JPG|PNG|WEBP)" *.html 2>/dev/null | wc -l)"
} > seo-cleanup-report.txt

echo "✅ Cleanup Complete! Check seo-cleanup-report.txt for details"
echo ""
echo "🚀 Next Steps:"
echo "1. Review changes: git diff"
echo "2. Test locally: npm run dev"
echo "3. Deploy to production"
