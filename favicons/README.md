# Favicon Folder - KOMOTRAKS

## Instrukcije za dodavanje favicon-a

U ovaj folder (`favicons/`) ubacite sledeće fajlove:

### Potrebni fajlovi:
1. **favicon.ico** - Klasični favicon (16x16, 32x32, 48x48)
2. **favicon-16x16.png** - 16x16 pixels
3. **favicon-32x32.png** - 32x32 pixels
4. **apple-touch-icon.png** - 180x180 pixels (za iOS uređaje)
5. **android-chrome-192x192.png** - 192x192 pixels
6. **android-chrome-512x512.png** - 512x512 pixels
7. **site.webmanifest** - Web manifest fajl

---

## HTML kod za dodavanje u `<head>` sekciju

Nakon što ubacite sve fajlove, dodajte sledeći kod u `<head>` sekciju svih HTML stranica (odmah nakon `<meta charset="utf-8">`):

```html
<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="favicons/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="favicons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="favicons/android-chrome-512x512.png">
<link rel="manifest" href="favicons/site.webmanifest">
<meta name="theme-color" content="#1a1a1a">
```

---

## Kako generisati favicon fajlove?

### Opcija 1: Online Generator (Preporučeno)
Koristite **[Favicon Generator](https://realfavicongenerator.net/)** ili **[Favicon.io](https://favicon.io/)**

1. Uploadujte KOMOTRAKS logo (`images/komotraks logotip.png`)
2. Sajt će automatski generisati sve potrebne fajlove
3. Preuzmite ZIP arhivu
4. Raspakovajte i kopirajte sve fajlove u ovaj `favicons/` folder

### Opcija 2: Ručno (Photoshop/GIMP)
1. Otvorite logo u editoru
2. Kreirajte verzije u navedenim dimenzijama
3. Sačuvajte kao PNG/ICO format
4. Kopirajte u ovaj folder

---

## Primer `site.webmanifest` fajla

Kreirajte `site.webmanifest` fajl sa sledećim sadržajem:

```json
{
  "name": "KOMOTRAKS",
  "short_name": "KOMOTRAKS",
  "description": "Profesionalna ugradnja komarnika, harmonika vrata i zavesa",
  "icons": [
    {
      "src": "android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1a1a1a",
  "background_color": "#1a1a1a",
  "display": "standalone",
  "start_url": "/"
}
```

---

## Provera

Nakon što dodate fajlove i HTML kod:
1. Osvežite stranicu u browseru
2. Pogledajte tab - trebalo bi da vidite favicon
3. Testirajte na mobilnim uređajima
4. Proverite Google Search Console za greške

---

**Napomena:** Favicon poboljšava prepoznatljivost brenda i profesionalnost sajta u search results i browser tabs.
