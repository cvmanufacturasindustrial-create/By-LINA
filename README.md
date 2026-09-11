# Accessories BYM — Joyería

Catálogo web de joyería. **Proyecto 100% independiente** — repo propio, puerto propio, sin
carpetas ni datos compartidos con ningún otro sitio. Misma estructura que el proyecto
**Bolsas De Colombia** (mismos módulos compartidos, mismas convenciones de datos), adaptada
a joyería:

- Presentación de ítems, tallas/medidas y precios: **igual que Bolsas De Colombia**.
- **Sin visor 3D** (a diferencia de Bolsas, aquí no hay `model-viewer` ni `.glb`).
- **Colores en blanco**: la estructura del selector de color está lista pero sin valores.
  Para activarla, agrega strings al array `colores` de cada pieza en `index.html`
  (`colores: ['Dorado', 'Plateado', ...]`) — el modal muestra los chips automáticamente.

## Cómo correrlo

```bash
npm install
npm start                # node app.js → http://localhost:3005

PORT=6060 npm start      # otro puerto si lo necesitas
```

## Estructura

```
Accessories-BYM/
├── app.js                       servidor Express de un solo archivo (sin build step)
├── index.html                   el catálogo: header, hero, carrusel de categorías, grilla, modal, cotizador, carrito
├── panel.html                   panel interno (/panel): catálogo, pedidos, inventario
├── styles/
│   ├── branding.css             identidad visual — TODO por variables CSS en :root (cambiar la marca = editar :root)
│   └── cart.css                 carrito flotante y su panel
├── scripts/
│   ├── whatsapp.js              módulo compartido: arma el mensaje y abre wa.me
│   ├── carrito.js               módulo compartido: motor del carrito (estado, totales, WhatsApp, pago Wompi)
│   ├── cotizador.js             módulo compartido: motor del cotizador por volumen
│   └── cart.js                  capa propia de BYM: configura el carrito con los datos del sitio
├── datos/
│   ├── lista-precios.md         fuente única de precios (GET /api/precios lo lee)
│   ├── 01_control_de_inventario.md   plantilla de inventario (opcional)
│   ├── pedidos-web.csv          se crea solo al llegar el primer pedido (NO se versiona — PII)
│   └── leads-recibidos.csv      se crea solo al llegar el primer lead (NO se versiona — PII)
└── imagenes/
    ├── marca/                   logo, favicon
    └── productos/               fotos de cada pieza (nombres = los del campo `galeria` en index.html)
```

## Qué falta llenar (todo marcado con `TODO` o "Ejemplo" en el código)

1. **WhatsApp**: `window.BYM_WHATSAPP` en `index.html` (y el pie de página / botón flotante).
2. **Piezas reales**: reemplazar los 8 ejemplos del array `productos` en `index.html`
   (nombre exacto según la foto, `sub`, `galeria`, `precio`, `tallas`). Las fotos van en
   `imagenes/productos/` con el mismo nombre que en `galeria`.
3. **Precios**: `datos/lista-precios.md` (o directo en `precio:` del HTML).
4. **Colores** (opcional, cuando los definan): array `colores` de cada pieza.
5. **Logo / favicon**: `imagenes/marca/`.

## Pago en línea (Wompi) — opcional

Se activa SOLO si defines en el entorno (Render → Environment):

- `BYM_WOMPI_PUBLIC_KEY` y `BYM_WOMPI_INTEGRITY_SECRET` — llaves PROPIAS de Accessories BYM.

Sin ellas, `configurada:false` y el carrito cae al flujo de WhatsApp (por diseño). La firma
es `SHA256(referencia + montoEnCentavos + "COP" + secreto)`; el secreto nunca sale al cliente.

## Panel de pedidos (`/pedidos`)

Protegido con Basic Auth: define `PANEL_USER` y `PANEL_PASS` en el entorno. Sin ellas, la ruta
responde 503 (falla cerrado). Muestra nombre/teléfono/dirección de cada pedido y permite
descargar el CSV.

## Publicar

- **Netlify** (hosting estático): sirve `index.html` y los assets; el pago en línea y el
  panel necesitan el servidor real (`node app.js`), así que en Netlify caen al flujo de
  WhatsApp automáticamente. `netlify.toml` ya está.
- **Render / cualquier host de Node**: `npm start`. Ahí sí funciona todo (pago, pedidos, panel).
