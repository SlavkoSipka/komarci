# 🚀 DEPLOYMENT INSTRUKCIJE - KOMOTRAKS

## 📦 Build Proces

### Pre Deploya

1. **Instaliraj dependencies (jednom)**
   ```bash
   npm install
   ```

2. **Pokreni build**
   ```bash
   npm run build
   ```

### Build Rezultati

✅ **CSS Optimizacija:**
- Original: 549.55 KB
- Minified: 436.31 KB  
- **Ušteđeno: 20.61%**

✅ **JavaScript Optimizacija:**
- Original: 528.50 KB
- Minified: 312.53 KB
- **Ušteđeno: 40.86%**

✅ **HTML Optimizacija:**
- **Prosečno ušteđeno: 30.79%**

---

## 📁 Struktura Nakon Build-a

```
dist/
├── css/
│   └── bundle.min.css       ← Svi CSS fajlovi spojeni i minifikovani
├── js/
│   ├── bundle.min.js        ← Svi JS fajlovi spojeni i minifikovani
│   └── config.js            ← API ključ (dodaj pravi pre deploya!)
├── images/                  ← Sve slike
├── fonts/                   ← Svi fontovi
├── favicons/                ← Favicon fajlovi
├── *.html                   ← Minifikovani HTML fajlovi
└── sitemap.xml

```

---

## ⚠️ PRE DEPLOYA - OBAVEZNO!

### 1. Dodaj Google Maps API Key

Otvori `dist/js/config.js` i dodaj **PRAVI** API ključ:

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'TVOJ_PRAVI_API_KLJUC_OVDE'
};
```

**Važno:** Deaktiviraj stari API ključ i kreiraj novi sa ograničenjima!

### 2. Preporučene Optimizacije (Opciono)

#### Konvertuj Slike u WebP Format
```bash
# Za sve JPG slike u images/ folderu
# Koristi https://squoosh.app ili cwebp alat
```

#### Kompresuj Video Fajl
```bash
# harmonika vrata snimak.mp4
# Koristi HandBrake ili online kompresiju
```

---

## 🌐 Deploy na Hosting

### GitHub Pages

1. Kopiraj **samo sadržaj `dist/` foldera** u root projekta
2. Commit i push na `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   cp -r dist/* .
   git add .
   git commit -m "Deploy production build"
   git push origin gh-pages
   ```

### Shared Hosting (cPanel, Plesk, itd.)

1. Konektuj se na hosting (FTP/SFTP/File Manager)
2. Upload **samo sadržaj `dist/` foldera** u `public_html/` ili `www/`
3. Proveri da je `index.html` u root-u

### Netlify / Vercel

1. Povezi GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist/`
4. Deploy! 🚀

---

## ✅ Post-Deploy Checklist

- [ ] Sajt se učitava brzo (< 3 sekunde)
- [ ] Mapa na kontakt strani radi (API key je validan)
- [ ] Sve slike se učitavaju
- [ ] Karousel radi glatko
- [ ] Galerija otvara slike
- [ ] Mobilna verzija izgleda dobro
- [ ] Kontakt forma radi

---

## 🔄 Za Buduće Izmene

1. Radi izmene u **root fajlovima** (ne u `dist/`)
2. Pokreni `npm run build` ponovo
3. Deploy novi `dist/` folder

---

## 📊 Performance Metrics

**Očekivani rezultati:**
- Google PageSpeed Score: 85-95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Bundle Size: ~750 KB (sa slikama)

---

## 🆘 Troubleshooting

### "API key not valid"
→ Dodaj pravi API ključ u `dist/js/config.js`

### "Images not loading"
→ Proveri da su sve slike kopirane u `dist/images/`

### "CSS not loading"
→ Proveri da `css/bundle.min.css` postoji

### "JS errors"
→ Proveri browser console za specifične greške

---

## 📞 Kontakt

Za podršku ili pitanja: [dodaj kontakt info]

**Build datum:** ${new Date().toLocaleDateString('sr-RS')}
**Verzija:** 1.0.0
