# 🍸 Hidden District - Web amb Edició Admin

Pàgina web professional per al bar Hidden District amb sistema d'edició integrat i guardada al núvol amb Firebase.

## 🚀 Inici Ràpid

### Mode Admin
- **Obrir panel admin**: `Ctrl + Shift + A`
- **Contrasenya per defecte**: `hiddendistrict2024`
- **⚠️ IMPORTANT**: Canvia la contrasenya abans de publicar (instruccions a FIREBASE-SETUP.md)

### Editar contingut
1. Prem `Ctrl + Shift + A`
2. Introdueix la contrasenya
3. Fes clic als botons d'edició (✏️) que apareixen
4. Edita el text i guarda
5. Els canvis es guarden automàticament a Firebase!

## 📋 Configuració Firebase

**Els canvis NO es guardaran permanentment fins que configuris Firebase.**

Segueix la guia pas a pas: **[FIREBASE-SETUP.md](FIREBASE-SETUP.md)**

Només necessites:
- ✅ 10 minuts
- ✅ Un compte de Google (gratuït)
- ✅ No cal servidor propi
- ✅ Completament gratuït

## 📁 Estructura del projecte

```
hidden-district/
├── index.html              # Pàgina principal
├── styles.css             # Estils generals
├── admin.css              # Estils del mode admin
├── script.js              # JavaScript general
├── admin.js               # Sistema d'edició admin
├── firebase-config.js     # ⚠️ Configuració Firebase (edita això!)
├── content.json           # Contingut inicial
├── FIREBASE-SETUP.md      # 📖 Guia de configuració
└── README.md              # Aquest fitxer
```

## Seccions de la web

1. **Hero** - Pàgina inicial amb logo
2. **El Distrito** - Descripció del local
3. **Cócteles De Autor** - Menú de còctels (amb pestanya de Tapas)
4. **Eventos** - Esdeveniments generals
5. **Eventos Privados** - Reserva d'esdeveniments privats
6. **Contacto** - Informació de contacte

## Icones

Les icones són SVG inline que es poden personalitzar canviant el color amb CSS. Icones disponibles:

- `icon-cocktail` - Cóctel
- `icon-mask` - Màscara
- `icon-music` - Música
- `icon-clock` - Rellotge
- `icon-headphones` - Auriculars
- `icon-location` - Ubicació
- `icon-phone` - Telèfon
- `icon-email` - Email

## Personalització

### Canviar colors

A `styles.css`, modifica les variables CSS:

```css
:root {
    --color-primary: #d4af37;     /* Color daurat principal */
    --color-secondary: #1a1a1a;   /* Color secundari */
    --color-background: #0a0a0a;  /* Fons */
    --color-text: #e0e0e0;        /* Text */
}
```

### Afegir contingut

Substitueix tots els textos "Lorem ipsum" pel contingut real del bar.

### Afegir imatges

Canvia els URLs de les imatges de fons i afegeix fotos dels còctels als elements `.cocktail-image`.

## 🌐 Publicar la web

Pots allotjar-ho gratuïtament a:

- **GitHub Pages**: [Tutorial](https://pages.github.com/)
- **Netlify**: [netlify.com](https://www.netlify.com/) (Recomanat - més fàcil)
- **Vercel**: [vercel.com](https://vercel.com/)

## 🔐 Seguretat

- La contrasenya està encriptada amb SHA-256
- Firebase té regles de seguretat configurades
- Només tu pots editar el contingut
- Tothom pot veure la web

## Com veure la web localment

Obre `index.html` directament al navegador o utilitza un servidor local.

---

**Creat amb ❤️ per Hidden District**
