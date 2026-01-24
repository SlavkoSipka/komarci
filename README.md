# Welfare - Charity Website Template

Modern development setup za Welfare template.

## 🚀 Quick Start

### Instalacija zavisnosti

```bash
npm install
```

### Pokretanje razvojnog okruženja

```bash
npm run dev
```

Sajt će biti dostupan na `http://localhost:3000` sa automatskim live reload-om.

## 📦 NPM Scripts

- `npm run dev` - Pokreće development server sa live reload-om i Sass watch modom
- `npm run serve` - Pokreće samo browser-sync server
- `npm run sass:watch` - Kompajlira SCSS fajlove i prati izmene
- `npm run sass:build` - Kompajlira i minifikuje CSS za produkciju
- `npm run build` - Build za produkciju (compressed CSS)
- `npm run clean` - Briše generisane CSS fajlove
- `npm run format` - Formatira kod sa Prettier-om
- `npm run lint:scss` - Proverava i popravlja SCSS kod

## 🛠️ Tehnologije

- **Bootstrap 4** - CSS framework
- **Sass/SCSS** - CSS preprocessor
- **Browser-sync** - Live reload development server
- **Prettier** - Code formatter
- **Stylelint** - SCSS linter

## 📁 Struktura Projekta

```
welfare-gh-pages/
├── css/              # Compiled CSS files
├── scss/             # Source SCSS files
│   ├── bootstrap/    # Bootstrap SCSS
│   └── style.scss    # Main SCSS file
├── js/               # JavaScript files
├── images/           # Image assets
├── fonts/            # Font files
├── *.html            # HTML pages
└── package.json      # NPM dependencies
```

## 🎨 Customization

Sve izmene stilova radite u `scss/` folderu. Glavni fajl je `scss/style.scss`.

Boje i varijable možete menjati na početku `scss/style.scss` fajla:

```scss
$primary: #f86f2d;
$secondary: #fa8f3d;
$tertiary: #faaa3a;
$quarternary: #7cbd1e;
```

## 📝 License

This project is licensed under the MIT License.

## 🙏 Credits

Template by Colorlib
