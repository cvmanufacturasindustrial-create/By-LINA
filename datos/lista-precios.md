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

**Ajuste pedido por Lina (2026-09-10)**: +$2.000 COP a todas las piezas sobre el precio
anterior. "Mini Bolso Acolchado Beige" ya tiene precio definido por ella ($120.000) + el
mismo ajuste = $122.000. "Funda Tarjetera Floral Rosa para Celular" se renombró a
"Porta Carnet Floral Rosa" (mismo producto/foto).

| Referencia | Precio |
|---|---|
| Anillo Flor con Circonias | $27.000 |
| Anillo Tres Mariposas | $22.000 |
| Anillo Tréboles Dorados | $22.000 |
| Collar Dije "Fe" con Corazón de Circonias | $27.000 |
| Collar Dije Tortuga Marina | $27.000 |
| Set Collar y Aretes Sol y Estrellas | $32.000 |
| Aretes Corazones Dorados con Circonias | $14.000 |
| Set de Aretes x3: Corazones, Bolitas y Gatito | $27.000 |
| Aretes Flor Multicolor | $12.000 |
| Aretes Estrella Verde | $12.000 |
| Pulsera Ajustable Tres Corazones | $32.000 |
| Pulsera Tres Tréboles | $24.000 |
| Pulsera Perlas y Trébol | $27.000 |
| Dije Candado y Llave de Corazón | $22.000 |
| Dije Set Viajera (Pasaporte, Mundo y Avión) | $19.000 |
| Mini Bolso Acolchado Beige | $122.000 |
| Porta Carnet Floral Rosa | $34.000 |

<!-- Agrega una fila por cada pieza nueva. El descuento por volumen (5% desde 50 und, 10%
     desde 100) lo aplica el cotizador automáticamente; aquí va SOLO el precio por unidad. -->
