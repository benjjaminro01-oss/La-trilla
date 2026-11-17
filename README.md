# LA TRILLA — El precio de una decisión · Prototipo Capítulo 01 (Pixel Art)

Capítulo 01: *El campo que ya no responde*. Phaser 3.80.1 (CDN), JavaScript modular, sin backend.

## Ejecutar
Los módulos ES no funcionan con doble clic (file://). Desde esta carpeta:
`python3 -m http.server 8000` → abre http://localhost:8000 (necesita internet para Phaser y fuentes; para offline, descarga `phaser.min.js` a `vendor/` y cambia la etiqueta en `index.html`).

## Publicar en GitHub Pages
Sube el contenido de la carpeta a un repositorio → Settings → Pages → rama `main`, carpeta `/ (root)`.

## Controles
A/D o flechas: caminar · E: interactuar · Espacio/Enter: continuar · 1/2/3: decidir · Esc: pausa.

## Estructura
`src/core` (estado, diálogos) · `src/scenes` (boot, menú, campo) · `src/data` (narrativa como datos) · `src/systems` (audio, guardado) · `assets/` (carpetas listas para arte y audio reales).
Se simplificó respecto a la estructura sugerida: no hay `entities/`, `scene-manager`, `input-manager` ni `ui/` separados; los personajes viven en la escena y la UI es DOM. Pueden extraerse al crecer el proyecto.

## Estado narrativo (`src/core/game-state.js`, guardado en localStorage)
pacto, vinculoVieja, orgullo, desconfianza, pistas, quedarse + decisiones y progreso. `pacto` nunca se activa en este capítulo.

## Recursos PROVISIONALES (generados por código en `boot-scene.js`)
- Sprites de Lucho, Vieja y Forastero: NO son los modelos oficiales (las hojas de modelo no estaban entre los archivos). Pendiente: sprites pixel art fieles a la Biblia Visual, y animaciones de mirar y reaccionar (hoy solo idle, caminar, interactuar; Vieja: idle y relincho; Forastero: idle).
- Tiles, casa, árbol, herramientas, mesa, fondos con parallax, niebla y partículas: provisionales.
- Audio: solo viento sintetizado. Pendiente: pisadas, relinchos, madera, música, sonido del Forastero.
- Tilemap construido por código; pendiente exportarlo desde Tiled si se quiere editar visualmente.
- Fuera de alcance: lluvia (corresponde a capítulos posteriores), finales.
