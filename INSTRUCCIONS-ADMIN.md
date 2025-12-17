# 🔐 Sistema d'Administració - Hidden District

## Com accedir al panell d'administració

### Pas 1: Obrir el panell d'admin
El botó d'admin està **completament ocult** per als clients. Per accedir:

1. Obre la web al navegador
2. Prem la combinació de tecles: **Ctrl + Shift + A** (o Cmd + Shift + A en Mac)
3. Apareixerà un panell de login

### Pas 2: Introduir la contrasenya
- **Contrasenya per defecte**: `hiddendistrict2024`
- Introdueix la contrasenya i clica "Entrar"

### Pas 3: Mode d'edició activat
Un cop autenticat, veuràs:
- Un indicador groc a dalt a la dreta: "✏️ Mode Admin Actiu"
- Tots els elements editables amb un contorn groc puntejat
- Botons d'edició (✏️) al costat de cada element

## Com editar contingut

1. **Clica el botó ✏️** que apareix al costat de l'element que vols editar
2. S'obrirà un formulari d'edició
3. **Modifica el text, URL o imatge**
4. Clica **"Guardar"**
5. Els canvis es guarden automàticament!

## Elements que pots editar

### Textos editables:
- Títol principal (HIDDEN DISTRICT)
- Eslogan (COCTELERÍA EVOLUTIVA)
- Tots els títols de seccions
- Tots els paràgrafs descriptius
- Informació de contacte (telèfon, email, horaris)
- Text del footer

### Links editables:
- Instagram, Facebook, Twitter (canvia les URLs)

### Per afegir imatges:
1. Puja la imatge al teu servidor o utilitza un servei com Imgur
2. Copia l'URL de la imatge
3. Edita l'element i enganxa l'URL

## Tancar la sessió d'admin

Tens 2 opcions:
1. Clica el botó **"Sortir"** a l'indicador groc
2. Torna a prémer **Ctrl + Shift + A**

## Canviar la contrasenya

Per més seguretat, **CANVIA LA CONTRASENYA** seguint aquests passos:

1. Obre la consola del navegador (F12)
2. Escriu aquesta comanda (substituint "nouaContrasenya" per la teva):
   ```javascript
   changeAdminPassword('nouaContrasenya')
   ```
3. Copia el "hash" que apareix
4. Obre el fitxer `admin.js` amb un editor de text
5. Cerca la línia que diu `this.passwordHash = "..."`
6. Substitueix el valor entre cometes pel nou hash
7. Guarda el fitxer

## Recuperar els canvis

Els canvis es guarden al **localStorage** del navegador. Si vols fer una còpia de seguretat:

1. Obre la consola del navegador (F12)
2. Escriu:
   ```javascript
   window.adminSystem.exportContent()
   ```
3. Es descarregarà un fitxer `content-backup.json` amb tot el contingut

## Restaurar una còpia de seguretat

Si has fet canvis i vols tornar a l'estat original:

1. Esborra el localStorage:
   - Obre la consola (F12)
   - Escriu: `localStorage.removeItem('hiddenDistrictContent')`
2. Refresca la pàgina

## Consells de seguretat

- **MAI comparteixis la contrasenya** amb ningú
- **Canvia la contrasenya** regularment
- **NO obris el panell d'admin** davant de clients
- La combinació **Ctrl+Shift+A** és secreta, no la comparteixis

## Navegadors compatibles

✅ Chrome, Firefox, Safari, Edge (versions modernes)
❌ Internet Explorer (no compatible)

## Problemes comuns

**Q: He oblidat la contrasenya, què faig?**
A: Contacta amb el desenvolupador per restablir-la.

**Q: Els canvis no es guarden**
A: Assegura't que el navegador no estigui en mode privat/incògnit.

**Q: El botó ✏️ no apareix**
A: Assegura't d'haver fet login correctament amb Ctrl+Shift+A.

## Suport tècnic

Si tens problemes, contacta amb: [el teu email o telèfon]

---

**Desenvolupat amb ❤️ per Hidden District**
