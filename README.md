# Hidden District - Web del Bar

Pàgina web professional per al bar Hidden District amb disseny fosc i elegant.

## Estructura

- `index.html` - Pàgina principal amb totes les seccions
- `styles.css` - Estils CSS amb tema fosc i icones SVG
- `script.js` - JavaScript per interactivitat

## Seccions

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

## Com veure la web

Obre `index.html` directament al navegador o utilitza un servidor local.
