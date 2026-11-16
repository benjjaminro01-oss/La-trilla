# LA TRILLA — El precio de una decisión

Experiencia narrativa interactiva (HTML + CSS + JavaScript, sin dependencias ni compilación).

## Ejecutar localmente
Abre `index.html` con doble clic en cualquier navegador moderno. No necesita servidor.
(Las tipografías Playfair Display e Inter se cargan desde Google Fonts; sin conexión se usan Georgia y la fuente del sistema.)

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub y sube el contenido de esta carpeta (`index.html`, `styles.css`, `script.js`, `.nojekyll`).
2. En el repositorio: **Settings → Pages → Build and deployment**.
3. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
4. En uno o dos minutos la demo quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Mantenimiento
- Todo el contenido narrativo está en el objeto `scenes` de `script.js` (parte 1). El motor está después de `FIN PARTE 1`.
- Los colores y ambientes visuales están en `styles.css` (`body[data-bg="..."]`).
- Teclado: Enter/Espacio avanza; las teclas 1, 2, 3 eligen decisiones.
