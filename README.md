# Hidden District

Web application for Hidden District - Coctelería Evolutiva (Evolutionary Cocktail Bar).

## Features

- Responsive single-page design
- Integrated admin panel for content management
- Firebase Firestore cloud storage
- Offline fallback with localStorage

## Project Structure

```
hidden-district/
├── index.html              # Main page
├── package.json            # Project configuration
├── css/
│   ├── styles.css          # Main styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── script.js           # Main JavaScript
│   ├── admin.js            # Admin system
│   └── firebase-config.js  # Firebase configuration
├── assets/
│   └── img/                # Images
│       └── hidden-logo.jpg
└── docs/
    ├── FIREBASE-SETUP.md   # Firebase setup guide
    ├── INSTRUCCIONS-ADMIN.md
    └── content.json        # Content structure
```

## Quick Start

### Running locally

```bash
npm start
```

Or open `index.html` directly in your browser.

### Admin Panel

- **Access**: `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
- **Default password**: `hiddendistrict2024`

> **Important**: Change the password before deploying to production.

## Configuration

### Firebase Setup

For persistent cloud storage, configure Firebase:

1. Edit `js/firebase-config.js` with your Firebase credentials
2. See [docs/FIREBASE-SETUP.md](docs/FIREBASE-SETUP.md) for detailed instructions

### Customization

#### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --color-primary: #d4af37;
    --color-secondary: #1a1a1a;
    --color-background: #0a0a0a;
    --color-text: #e0e0e0;
}
```

## Deployment

Compatible with:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting

## Security

- SHA-256 password encryption
- Firebase security rules
- Admin-only content editing

## License

Private - All rights reserved.
