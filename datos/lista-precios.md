# Lista de precios — Accessories BYM

Fuente única de verdad de los precios. Valores en COP. `app.js` expone `GET /api/precios`
parseando esta tabla; `index.html` la consulta al cargar y sobrescribe el precio de cada
pieza cuyo campo `nombre` coincida EXACTO con la columna "Referencia" de aquí. Si esta API
falla, el catálogo usa el `precio` hardcodeado del HTML como respaldo.

**Fuente de estos precios**: catálogo real de la dueña, "Accessories By LM 2026" (PDF en
Descargas, 44 páginas, Instagram @aaccessories.by.lm). Los marcados `[confirmado]` en
`scripts/catalogo-bym.js` aparecen igual en ese catálogo; los `[estimado]` usan el precio
típico de esa categoría porque no hay una coincidencia exacta de diseño — Lina puede
ajustarlos aquí en cualquier momento.

| Referencia | Precio |
|---|---|
| Anillo Flor con Circonias | $25.000 |
| Anillo Tres Mariposas | $20.000 |
| Anillo Tréboles Dorados | $20.000 |
| Collar Dije "Fe" con Corazón de Circonias | $25.000 |
| Collar Dije Tortuga Marina | $25.000 |
| Set Collar y Aretes Sol y Estrellas | $30.000 |
| Aretes Corazones Dorados con Circonias | $12.000 |
| Set de Aretes x3: Corazones, Bolitas y Gatito | $25.000 |
| Aretes Flor Multicolor | $10.000 |
| Aretes Estrella Verde | $10.000 |
| Pulsera Ajustable Tres Corazones | $30.000 |
| Pulsera Tres Tréboles | $22.000 |
| Pulsera Perlas y Trébol | $25.000 |
| Dije Candado y Llave de Corazón | $20.000 |
| Dije Set Viajera (Pasaporte, Mundo y Avión) | $17.000 |
| Mini Bolso Acolchado Beige | $0 |
| Funda Tarjetera Floral Rosa para Celular | $32.000 |

<!-- Agrega una fila por cada pieza nueva. El descuento por volumen (5% desde 50 und, 10%
     desde 100) lo aplica el cotizador automáticamente; aquí va SOLO el precio por unidad.
     "Mini Bolso Acolchado Beige" no aparece en el catálogo de joyería de Lina (es un bolso,
     no una joya) -- queda en $0 hasta que ella lo defina. -->
