# 🚀 NETLIFY DEPLOYMENT - UPUTSTVO

## ✅ ŠTA JE URAĐENO:

1. ✅ Sve slike **preimenovane** bez razmaka (npr. `zebra-zavesa-1.jpg`)
2. ✅ `dist/` folder **uključen** u Git (optimizovana production verzija)
3. ✅ Service Worker **deaktiviran** (bio je problem sa cache-om)
4. ✅ HTML/CSS/JS **optimizovani** i minifikovani
5. ✅ **98 fajlova** push-ovano na GitHub

---

## 📋 NETLIFY SETUP (IZBERI OPCIJU):

### **OPCIJA 1: Servuj Gotov `dist/` Folder (PREPORUČENO - NAJBRŽE)**

Ovim odabirom Netlify odmah služi gotove, optimizovane fajlove bez build procesa.

**Netlify Settings:**
```
Build command:       (ostavi prazno)
Publish directory:   dist
```

**Prednosti:**
- ⚡ Instant deployment (bez build procesa)
- ✅ Sigurno radi (već je build-ovano lokalno)
- 💯 Sve slike garantovano rade

---

### **OPCIJA 2: Netlify Automatski Build-uje (Napredniji način)**

Netlify sam pokreće `npm run build` pri svakom push-u.

**Netlify Settings:**
```
Build command:       npm install && npm run build
Publish directory:   dist
Node version:        18 (ili novija)
```

**Prednosti:**
- 🔄 Automatski build pri svakom push-u
- 📦 Ne mora `dist/` u Git (možeš vratiti u `.gitignore`)

**Mane:**
- ⏱️ Sporiji deployment (5-10 min build vreme)
- 🔧 Potreban Node.js na Netlify serveru

---

## 🎯 KOJI NAČIN ODABRATI?

### Koristi **OPCIJU 1** ako:
- ✅ Želiš brz i siguran deployment **ODMAH**
- ✅ Ne želiš da se zajebavaš sa build procesom
- ✅ Garantovano sve radi (što je slučaj sada)

### Koristi **OPCIJU 2** ako:
- ✅ Imaš iskustva sa CI/CD
- ✅ Želiš automatizaciju
- ✅ Planirano da Git repo bude čist (bez dist foldera)

---

## ⚙️ KAKO PODESITI NETLIFY:

1. **Idi na:** [app.netlify.com](https://app.netlify.com)
2. **"Add new site"** → **"Import an existing project"**
3. **Izaberi GitHub** i repozitorijum: `SlavkoSipka/komarci`
4. **Unesi settings** (vidi gore - OPCIJA 1 ili 2)
5. **Deploy site!** 🚀

---

## 🧪 TESTIRANJE POSLE DEPLOYA:

1. **Hard Refresh:**
   - Chrome/Edge: `Ctrl + Shift + R`
   - Firefox: `Ctrl + F5`

2. **Clear Cache:**
   - Dev Tools (`F12`) → Network tab → Checkbox "Disable cache"

3. **Proveri slike:**
   - Otvori dev console (`F12`) → Console tab
   - Treba da nema "404 Not Found" grešaka

4. **Proveri back button:**
   - Otvori sliku u galeriji
   - Klikni browser "Back" dugme
   - Treba da zatvori sliku, ne da izađe sa sajta

---

## 🐛 AKO NEŠTO NE RADI:

### Problem: Slike i dalje ne rade
**Rešenje:** 
1. Proveri da li Netlify služi **`dist/`** folder (ne root!)
2. Pogledaj Netlify "Deploy log" - da li je build uspeo?
3. Hard refresh (`Ctrl + Shift + R`)

### Problem: Back button ne radi
**Rešenje:**
1. To je Service Worker cache od **prethodnih** korisnika
2. Novi korisnici neće imati problem
3. Stari korisnici: Clear browsing data → Cached images

### Problem: CSS/JS ne radi
**Rešenje:**
1. Proveri da li `dist/css/bundle.min.css` postoji
2. Proveri da li `dist/js/bundle.min.js` postoji
3. Otvori Dev Tools → Network → vidi koje fajlove ne može da učita

---

## 📞 KONTAKT ZA DALJU POMOĆ:

Ako nešto ne radi:
1. Otvori Dev Console (`F12`)
2. Kopiraj greške iz "Console" tab-a
3. Screenshot problema
4. Pošalji

---

## ✅ SLEDEĆI KORACI:

1. **Deploy na Netlify** (koristi OPCIJU 1)
2. **Testuj sajt** (hard refresh + proveri slike)
3. **Ako sve radi** → 🎉 GOTOVO!
4. **Ako ne radi** → proveri "🐛 AKO NEŠTO NE RADI" sekciju

---

**POSLEDNJI COMMIT:** `e8b7736` - "FINALNO: Sve slike bez razmaka, dodat dist folder za Netlify deployment"

**BUILD DATUM:** 2026-01-25

🚀 **SPREMAN ZA DEPLOYMENT!**
