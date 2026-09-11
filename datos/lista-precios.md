# Lista de precios — Accessories BYM

Fuente única de verdad de los precios. Valores en COP. `app.js` expone `GET /api/precios`
parseando esta tabla; `index.html` la consulta al cargar y sobrescribe el precio de cada
pieza cuyo campo `nombre` coincida EXACTO con la columna "Referencia" de aquí. Si esta API
falla, el catálogo usa el `precio` hardcodeado del HTML como respaldo.

**Cómo se usa:** cambia un número en esta tabla y la web se actualiza sin tocar el HTML.
La coincidencia es por el nombre exacto de la pieza (mismo texto que el campo `nombre` del
array `productos` en `index.html`).

| Referencia | Precio |
|---|---|
| Anillo Solitario | $0 |
| Anillo Media Alianza | $0 |
| Cadena Eslabón Fino | $0 |
| Collar con Dije de Corazón | $0 |
| Aretes Topo Circonia | $0 |
| Aretes Argolla Lisa | $0 |
| Pulsera Cadena con Charm | $0 |
| Tobillera Bolitas | $0 |

<!-- Agrega una fila por cada pieza nueva. El descuento por volumen (5% desde 50 und, 10%
     desde 100) lo aplica el cotizador automáticamente; aquí va SOLO el precio por unidad. -->
