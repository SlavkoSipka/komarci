# 🔍 TROUBLESHOOTING AUDIT - Zašto Slike Ne Rade

## ✅ CHECKLIST - Proveri sve redosledno!

### 1️⃣ **NETLIFY DEPLOYMENT STATUS**

**Proveri:**
- Idi na Netlify Dashboard → Deploys
- Da li je POSLEDNJI deploy USPEŠAN? (zeleni checkmark)
- Da li je deploy završen POSLE što si promenio settings na `dist/`?
- Proveri vreme deploya - mora biti posle promene settings-a!

**Test:**
```
Otvori: https://tvoj-sajt.netlify.app/VERSION.txt
```

**Rezultat:**
- ✅ VIDIŠ TEXT FAJL → Netlify služi iz `dist/` foldera - DOBRO!
- ❌ 404 ERROR → Netlify NE služi iz `dist/` - LOŠE! Uradi redeploy!

---

### 2️⃣ **BROWSER CACHE - KRITIČNO!**

**Problem:** Browser možda učitava STARE slike iz cache-a!

**Rešenje - PROBAJ SVE:**

**A) Hard Refresh:**
```
Chrome/Edge: Ctrl + Shift + R
Firefox:     Ctrl + F5
```

**B) Clear Cache Potpuno:**
1. Pritisni `F12` (otvori Dev Tools)
2. Klikni desni klik na **Reload button** (pored adrese)
3. Izaberi: **"Empty Cache and Hard Reload"**

**C) Incognito/Private Mode:**
- Otvori sajt u **Incognito** prozoru
- Ako RADI u incognito → Problem je cache!

**D) Clear All Site Data:**
1. `F12` → **Application** tab
2. **Storage** (levo) → **Clear site data**
3. Refresh (`F5`)

---

### 3️⃣ **PROVERI NETWORK TAB - NAJVAŽNIJE!**

Ovo će ti TAČNO pokazati šta ne radi!

**Kako:**
1. Otvori sajt
2. Pritisni `F12` (Dev Tools)
3. Idi na **Network** tab
4. Refresh (`F5` ili `Ctrl+R`)
5. U filteru napiši: `images/`
6. Pogledaj listu slika

**Što da tražiš:**

| Status | Šta znači | Rešenje |
|--------|-----------|---------|
| **200** | ✅ Slika radi perfektno | Nema problema |
| **404** | ❌ Slika NE POSTOJI na serveru | Proveri tačnu putanju |
| **304** | ⚠️ Cache - učitava staru verziju | Hard refresh (`Ctrl+Shift+R`) |
| **(pending)** | ⏳ Učitava se sporo | Čekaj ili proveri brzinu neta |

**Ako vidiš 404 greške:**
- Klikni na sliku koja ima 404
- Kopiraj **TAČAN URL** koji browser traži
- Uporedi sa onim što STVARNO postoji u `dist/images/`

**Primer:**
```
Browser traži: https://sajt.com/images/zebra%20zavesa%201.jpg  ❌ LOŠE (ima razmak)
Treba da traži: https://sajt.com/images/zebra-zavesa-1.jpg     ✅ DOBRO (ima crticu)
```

---

### 4️⃣ **PROVERI CONSOLE TAB - GREŠKE**

1. `F12` → **Console** tab
2. Proveri da li ima crvenih grešaka
3. Često piše tačno koja slika ne može da se učita

**Primer greške:**
```
GET https://sajt.com/images/slika%20naziv.jpg 404 (Not Found)
```

Ovo ti pokazuje **TAČNO** koju sliku ne može da nađe!

---

### 5️⃣ **TEST - Otvori Sliku Direktno**

Probaj da otvoriš slike DIREKTNO u browseru:

```
https://tvoj-sajt.netlify.app/images/FIKSNI-KOMARNICI-2.jpg
https://tvoj-sajt.netlify.app/images/harmonika-vrata.jpg
https://tvoj-sajt.netlify.app/images/zebra-zavesa-1.jpg
https://tvoj-sajt.netlify.app/images/trakaste-zavese-cena.jpg
https://tvoj-sajt.netlify.app/images/plise-komarnici.jpg
https://tvoj-sajt.netlify.app/images/komarnici-karaburma.jpg
https://tvoj-sajt.netlify.app/images/ZEBRA-ZAVESA-BEOGRAD.jpg
```

**Rezultat:**
- ✅ Slika se prikazuje → Slika POSTOJI, problem je u HTML-u ili CSS-u
- ❌ 404 Error → Slika NE POSTOJI na serveru, nije upload-ovana

---

### 6️⃣ **PROVERI NETLIFY DEPLOY LOG**

1. Netlify Dashboard → **Deploys**
2. Klikni na **poslednji deploy**
3. Scroll do **"Deploy log"**
4. Traži reči: `dist/` ili `images/`

**Šta da tražiš:**
```
✅ DOBRO: "Publishing directory: dist"
❌ LOŠE:  "Publishing directory: /" ili nema dist/
```

---

### 7️⃣ **PROVERI HTML SOURCE CODE**

1. Desni klik na stranicu → **View Page Source** (ili `Ctrl+U`)
2. Traži (`Ctrl+F`): `images/FIKSNI`
3. Proveri kako izgleda putanja

**Treba da vidiš:**
```html
✅ DOBRO: <a href="komarnici.html" class="img" style="background-image: url('images/FIKSNI-KOMARNICI-2.jpg');"></a>

❌ LOŠE: <a href="komarnici.html" class="img" style="background-image: url('images/FIKSNI%20KOMARNICI%202.jpg');"></a>
```

Ako vidiš `%20` → HTML NIJE minifikovan/optimizovan, služi STARI fajl!

---

## 🎯 NAJČEŠĆI PROBLEMI I REŠENJA:

### Problem 1: "404 - Image Not Found"
**Uzrok:** Slike nisu upload-ovane ili putanja nije dobra  
**Rešenje:** 
- Proveri da li postoji `dist/images/` folder u Git repo-u
- Uradi `git status` i proveri da li je `dist/` commitovan
- Push ponovo: `git add . && git commit -m "Fix" && git push`

### Problem 2: "Slike rade lokalno, NE na Netlify"
**Uzrok:** Netlify ne služi iz `dist/` foldera  
**Rešenje:**
- Proveri Netlify settings: **Publish directory = dist**
- Uradi **Clear cache and redeploy**

### Problem 3: "Neke slike rade, neke NE"
**Uzrok:** Case sensitivity (velika/mala slova)  
**Rešenje:**
- Linux serveri razlikuju: `Komarnici.jpg` ≠ `komarnici.jpg`
- Proveri TAČNO ime fajla u `dist/images/`
- HTML mora imati TAČNO isto ime

### Problem 4: "Browser cache"
**Uzrok:** Browser učitava stare slike  
**Rešenje:**
- Hard refresh: `Ctrl + Shift + R`
- Incognito mode
- Clear all site data (`F12` → Application → Clear storage)

---

## 📸 SCREENSHOT PROVERE:

Otvori Dev Tools (`F12`) i napravi screenshot:
1. **Network** tab → filtrirano na `images/`
2. **Console** tab → ako ima grešaka

Pošalji mi screenshot-ove i rešićemo!

---

## 🚀 QUICK FIX KOMANDE:

Ako ništa ne radi, pokušaj ovo:

```bash
# U terminalu, u projektu:
npm run build
git add .
git commit -m "Rebuild dist folder"
git push origin master
```

Zatim na Netlify:
- Deploys → Trigger deploy → **Clear cache and deploy site**

---

## ✅ FINAL TEST:

Kada misliš da si sve popravio:

1. ✅ Otvori Incognito prozor
2. ✅ Otvori sajt
3. ✅ `F12` → Network tab
4. ✅ Refresh (`F5`)
5. ✅ Proveri da SVE slike imaju status **200** (zeleno)
6. ✅ Ako vidiš **404** ili **304** → Problem još postoji!

---

## 📞 ŠTA DA MI JAVIŠ:

Probaj sve gornje korake i javi mi:

1. **Da li VERSION.txt radi?** (https://sajt.com/VERSION.txt)
2. **Koliko slika ima 404 u Network tab-u?**
3. **Koja greška se vidi u Console tab-u?**
4. **Da li radi u Incognito mode-u?**
5. **Screenshot Network tab-a** (filtrirano na `images/`)

Sa tim podacima ću tačno znati gde je problem! 🎯
