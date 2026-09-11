# Lista de precios — Accessories BYM

Fuente única de verdad de los precios. Valores en COP. `app.js` expone `GET /api/precios`
parseando esta tabla; `index.html` la consulta al cargar y sobrescribe el precio de cada
pieza cuyo campo `nombre` coincida EXACTO con la columna "Referencia" de aquí. Si esta API
falla, el catálogo usa el `precio` hardcodeado del HTML como respaldo.

**Cómo se usa:** cambia un número en esta tabla y la web se actualiza sin tocar el HTML.
La coincidencia es por el nombre exacto de la pieza (mismo texto que el campo `nombre` del
array `productos` en `scripts/catalogo-bym.js`).

| Referencia | Precio |
|---|---|
| Anillo Flor con Circonias | $0 |
| Anillo Tres Mariposas | $0 |
| Collar Dije "Fe" con Corazón de Circonias | $0 |
| Collar Dije Tortuga Marina | $0 |
| Aretes Corazones Dorados con Circonias | $0 |
| Set de Aretes x3: Corazones, Bolitas y Gatito | $0 |
| Pulsera Ajustable Tres Corazones | $0 |
| Pulsera Tres Tréboles | $0 |
| Dije Candado y Llave de Corazón | $0 |
| Dije Set Viajera (Pasaporte, Mundo y Avión) | $0 |
| Mini Bolso Acolchado Beige | $0 |
| Funda Tarjetera Floral Rosa para Celular | $0 |

<!-- Piezas montadas como prueba desde la carpeta "Joyeria By Lina" del escritorio -- todas en
     $0 ("por definir") porque esa carpeta traía solo fotos, sin precios. Agrega una fila por
     cada pieza nueva. El descuento por volumen (5% desde 50 und, 10% desde 100) lo aplica el
     cotizador automáticamente; aquí va SOLO el precio por unidad. -->
