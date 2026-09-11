// Accessories BYM — servidor Express de un solo archivo. Misma estructura que el proyecto
// "Bolsas De Colombia": proyecto 100% independiente (repo propio, puerto propio, sin carpetas
// ni datos compartidos con ningún otro sitio). La raíz '/' sirve el catálogo directo.
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = parseInt(process.env.PORT, 10) || 3005;

app.use(express.json({ limit: '8mb' }));

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// index:false — la ruta explícita de abajo controla qué se sirve en '/', no express.static.
app.use(express.static(__dirname, { index: false }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Panel de operaciones interno.
app.get('/panel', (_req, res) => {
  res.sendFile(path.join(__dirname, 'panel.html'));
});

// ===== Lista de precios: fuente única en datos/lista-precios.md =====
// El catálogo (index.html) trae los precios hardcodeados como respaldo; si esta API responde,
// sobrescribe el precio de cada pieza según su campo `fila`. Cambiar un precio en el .md
// actualiza la web sin tocar el HTML.
function parsePrecios(markdown) {
  const precios = {};
  const filas = markdown.split('\n').filter((l) => l.trim().startsWith('|') && !l.includes('---'));
  filas.forEach((linea) => {
    const cols = linea.split('|').map((c) => c.trim());
    const nombre = cols[1];
    const valor = parseInt(String(cols[2] || '').replace(/[^0-9]/g, ''), 10);
    if (!nombre || nombre.toLowerCase() === 'referencia' || Number.isNaN(valor)) return;
    precios[nombre] = valor;
  });
  return precios;
}

app.get('/api/precios', (_req, res) => {
  const preciosPath = path.join(__dirname, 'datos', 'lista-precios.md');
  fs.readFile(preciosPath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'No se encontró la lista de precios.' });
    res.json(parsePrecios(data));
  });
});

// ===== Inventario (opcional): datos/01_control_de_inventario.md =====
function parseInventarioDisponible(markdown) {
  const seccion = (markdown.split('## Producto terminado')[1] || '').split('## Insumos')[0] || '';
  const filas = seccion.split('\n').filter((l) => l.trim().startsWith('|') && !l.includes('---') && !l.toLowerCase().includes('codigo'));
  const totales = {};
  filas.forEach((linea) => {
    const cols = linea.split('|').map((c) => c.trim());
    const codigo = cols[1];
    const disponible = parseInt(cols[5], 10);
    if (!codigo || Number.isNaN(disponible)) return;
    totales[codigo] = (totales[codigo] || 0) + disponible;
  });
  return totales;
}

app.get('/api/inventario', (_req, res) => {
  const inventoryPath = path.join(__dirname, 'datos', '01_control_de_inventario.md');
  fs.readFile(inventoryPath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'No se encontró el archivo de inventario.' });
    res.json(parseInventarioDisponible(data));
  });
});

// Render simple del inventario con semáforo de stock (rojo < mínimo, amarillo < 20% sobre el
// mínimo, verde el resto). Las columnas se localizan por nombre, no por posición.
app.get('/inventario', (_req, res) => {
  const inventoryPath = path.join(__dirname, 'datos', '01_control_de_inventario.md');
  fs.readFile(inventoryPath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('No se encontró el archivo de inventario.');
    let cuerpo = data;
    if (cuerpo.trimStart().startsWith('#')) cuerpo = cuerpo.slice(cuerpo.indexOf('\n## ') === -1 ? 0 : cuerpo.indexOf('\n## '));
    let secciones = '';
    cuerpo.split(/\n## /).slice(1).forEach((bloque) => {
      const fin = bloque.indexOf('\n');
      const titulo = (fin === -1 ? bloque : bloque.slice(0, fin)).trim();
      const lineas = bloque.split('\n').filter((l) => l.trim().startsWith('|'));
      secciones += '<h2>' + escapeHtml(titulo) + '</h2>';
      if (lineas.length < 2) { secciones += '<p style="color:#94a3b8">Sin datos.</p>'; return; }
      const parseFila = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
      const enc = parseFila(lineas[0]);
      const iDisp = enc.findIndex((c) => c.toLowerCase() === 'disponible');
      const iMin = enc.findIndex((c) => c.toLowerCase() === 'minimo');
      secciones += '<table><thead><tr>' + enc.map((c) => '<th>' + escapeHtml(c) + '</th>').join('') + '</tr></thead><tbody>';
      lineas.slice(2).map(parseFila).filter((f) => f.some((c) => c !== '')).forEach((f) => {
        let cls = '';
        if (iDisp !== -1 && iMin !== -1) {
          const d = parseInt(f[iDisp], 10), m = parseInt(f[iMin], 10);
          if (!Number.isNaN(d) && !Number.isNaN(m)) cls = d < m ? ' class="rojo"' : d < m * 1.2 ? ' class="amarillo"' : '';
        }
        secciones += '<tr' + cls + '>' + f.map((c) => '<td>' + escapeHtml(c) + '</td>').join('') + '</tr>';
      });
      secciones += '</tbody></table>';
    });
    res.type('html').send('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Inventario — Accessories BYM</title>' +
      '<style>body{font-family:Arial,sans-serif;margin:0;padding:2rem;background:linear-gradient(135deg,#1c1a16,#2a2620);color:#f5f1e8}' +
      'a.volver{color:#b0a48c;text-decoration:none;display:inline-block;margin-bottom:1.25rem}h2{color:#b08d57;margin-top:1.75rem;font-size:1.1rem}' +
      'table{width:100%;border-collapse:collapse;background:rgba(0,0,0,.2);border-radius:12px;overflow:hidden;margin-bottom:1rem}' +
      'th,td{padding:.5rem .75rem;border-bottom:1px solid rgba(255,255,255,.08);text-align:left;font-size:.85rem}' +
      'th{color:#b0a48c;text-transform:uppercase;font-size:.7rem;letter-spacing:.4px}' +
      '.rojo{background:rgba(248,113,113,.16)}.amarillo{background:rgba(250,204,21,.13)}</style></head>' +
      '<body><a class="volver" href="/panel">← Volver al panel</a><h1>Control de inventario</h1>' + secciones + '</body></html>');
  });
});

// ===== Pasarela de pagos (Wompi Web Checkout) =====
// Se activa SOLO si están definidas BYM_WOMPI_PUBLIC_KEY y BYM_WOMPI_INTEGRITY_SECRET (Render →
// Environment). Sin ellas, configurada:false y el carrito cae al flujo de WhatsApp. El secreto
// nunca sale al cliente. La firma es SHA256(referencia + monto + "COP" + secreto).
app.get('/api/pago/config', (_req, res) => {
  const publicKey = (process.env.BYM_WOMPI_PUBLIC_KEY || '').trim();
  const secreto = (process.env.BYM_WOMPI_INTEGRITY_SECRET || '').trim();
  res.json({ configurada: Boolean(publicKey && secreto), publicKey });
});

app.post('/api/pago/firma', (req, res) => {
  const secreto = (process.env.BYM_WOMPI_INTEGRITY_SECRET || '').trim();
  if (!secreto) return res.status(503).json({ error: 'Pasarela no configurada (falta BYM_WOMPI_INTEGRITY_SECRET).' });
  const { referencia, montoEnCentavos } = req.body || {};
  if (!referencia || typeof referencia !== 'string' || !Number.isInteger(montoEnCentavos) || montoEnCentavos <= 0) {
    return res.status(400).json({ error: 'Datos de pago inválidos.' });
  }
  const firma = crypto.createHash('sha256').update(referencia + montoEnCentavos + 'COP' + secreto).digest('hex');
  res.json({ firma });
});

// ===== Registro de pedidos web (nombre, teléfono, dirección de entrega) =====
// Se anexa como fila de un CSV (datos/pedidos-web.csv). Lo consume el panel /pedidos.
function csvEscape(valor) { return '"' + String(valor || '').replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"'; }
const RUTA_PEDIDOS_CSV = path.join(__dirname, 'datos', 'pedidos-web.csv');
const ENCABEZADO_PEDIDOS = 'fecha,metodo,referencia,nombre,telefono,direccion,resumen,total\n';

app.post('/api/pedidos', (req, res) => {
  const { metodo, referencia, nombre, telefono, direccion, resumen, total } = req.body || {};
  if (!nombre || !telefono || !direccion) {
    return res.status(400).json({ error: 'Faltan nombre, teléfono o dirección de entrega.' });
  }
  fs.mkdirSync(path.dirname(RUTA_PEDIDOS_CSV), { recursive: true });
  if (!fs.existsSync(RUTA_PEDIDOS_CSV)) fs.writeFileSync(RUTA_PEDIDOS_CSV, ENCABEZADO_PEDIDOS, 'utf8');
  const fila = [new Date().toISOString(), metodo || 'whatsapp', referencia || '', nombre, telefono, direccion, resumen || '', total || 0]
    .map(csvEscape).join(',') + '\n';
  fs.appendFileSync(RUTA_PEDIDOS_CSV, fila, 'utf8');
  res.json({ ok: true });
});

// Panel protegido para ver y descargar los pedidos. Login con PANEL_USER / PANEL_PASS
// (Render → Environment). Sin esas variables, la ruta queda deshabilitada por seguridad.
function exigirLogin(req, res, next) {
  const usuario = process.env.PANEL_USER;
  const clave = process.env.PANEL_PASS;
  if (!usuario || !clave) return res.status(503).send('Panel no configurado. Define PANEL_USER y PANEL_PASS.');
  const [tipo, cred] = (req.headers.authorization || '').split(' ');
  if (tipo === 'Basic' && cred) {
    const [u, p] = Buffer.from(cred, 'base64').toString('utf8').split(':');
    if (u === usuario && p === clave) return next();
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Accessories BYM"');
  res.status(401).send('Autenticación requerida.');
}

function parseCsvSimple(texto) {
  const filas = []; let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) { if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else comillas = false; } else campo += c; }
    else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\r') { /* ignora */ }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo.length || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => !(f.length === 1 && f[0] === ''));
}

app.get('/pedidos', exigirLogin, (_req, res) => {
  fs.readFile(RUTA_PEDIDOS_CSV, 'utf8', (err, data) => {
    const filas = err ? [] : parseCsvSimple(data);
    const enc = filas[0] || ENCABEZADO_PEDIDOS.trim().split(',');
    const regs = filas.slice(1).reverse();
    const filasHtml = regs.map((f) => '<tr>' + f.map((c) => '<td>' + escapeHtml(c) + '</td>').join('') + '</tr>').join('');
    res.type('html').send(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Pedidos web — Accessories BYM</title>
<style>body{font-family:Arial,sans-serif;margin:0;padding:2rem;background:linear-gradient(135deg,#1c1a16,#2a2620);color:#f5f1e8}
a.volver{color:#b0a48c;text-decoration:none;display:inline-block;margin-bottom:1.25rem}
.barra{display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;margin:1rem 0 1.25rem}
#buscador{flex:1 1 260px;padding:.6rem .9rem;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.25);color:#f5f1e8}
.btn-d{background:#b08d57;color:#1c1a16;font-weight:700;text-decoration:none;padding:.6rem 1.1rem;border-radius:8px;white-space:nowrap}
table{width:100%;border-collapse:collapse;background:rgba(0,0,0,.2);border-radius:12px;overflow:hidden}
th,td{padding:.5rem .75rem;border-bottom:1px solid rgba(255,255,255,.08);text-align:left;font-size:.82rem;white-space:nowrap}
th{color:#b0a48c;text-transform:uppercase;font-size:.68rem;letter-spacing:.4px}
.wrap{overflow-x:auto}.vacio{color:#b0a48c;padding:1.5rem;text-align:center}</style></head><body>
<a class="volver" href="/panel">← Volver al panel</a><h1>Pedidos web</h1>
<div class="barra"><input id="buscador" placeholder="Buscar por nombre, teléfono, dirección, referencia..."><a class="btn-d" href="/pedidos/descargar">⬇ Descargar CSV</a></div>
<p id="conteo">${regs.length} pedido${regs.length === 1 ? '' : 's'} registrados</p>
${regs.length === 0 ? '<p class="vacio">Todavía no hay pedidos registrados.</p>' :
`<div class="wrap"><table id="t"><thead><tr>${enc.map((h) => '<th>' + escapeHtml(h) + '</th>').join('')}</tr></thead><tbody>${filasHtml}</tbody></table></div>`}
<script>var b=document.getElementById('buscador'),t=document.getElementById('t'),c=document.getElementById('conteo');
if(b&&t){var fs=[].slice.call(t.querySelectorAll('tbody tr'));b.addEventListener('input',function(){var q=b.value.trim().toLowerCase(),v=0;
fs.forEach(function(f){var m=!q||f.textContent.toLowerCase().indexOf(q)>-1;f.style.display=m?'':'none';if(m)v++;});
c.textContent=v+' de '+fs.length+' pedidos';});}</script></body></html>`);
  });
});

app.get('/pedidos/descargar', exigirLogin, (_req, res) => {
  res.download(RUTA_PEDIDOS_CSV, 'pedidos-web.csv', (err) => {
    if (err && !res.headersSent) res.status(404).send('Todavía no hay pedidos registrados.');
  });
});

// ===== Leads B2B / mayoristas con opt-in =====
app.post('/api/lead-b2b', (req, res) => {
  const { nombre, empresa, telefono, mensaje, acepto } = req.body || {};
  if (!nombre || !telefono || !acepto) return res.status(400).json({ error: 'Faltan nombre, teléfono o el consentimiento.' });
  const archivo = path.join(__dirname, 'datos', 'leads-recibidos.csv');
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, 'fecha,nombre,empresa,telefono,mensaje\n', 'utf8');
  fs.appendFileSync(archivo, [new Date().toISOString(), nombre, empresa, telefono, mensaje].map(csvEscape).join(',') + '\n', 'utf8');
  res.json({ ok: true });
});

// ===== Recepción de imágenes/diseños de clientes (grabados, personalización) =====
app.post('/api/logo', (req, res) => {
  const { nombre, datosBase64 } = req.body || {};
  if (!nombre || !datosBase64) return res.status(400).json({ error: 'Faltan el nombre o el contenido del archivo.' });
  const ext = path.extname(String(nombre)).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.svg', '.pdf'].includes(ext)) {
    return res.status(400).json({ error: 'Formato no permitido. Usa PNG, JPG, SVG o PDF.' });
  }
  const binario = Buffer.from(String(datosBase64).replace(/^data:[^;]+;base64,/, ''), 'base64');
  if (binario.length === 0) return res.status(400).json({ error: 'El archivo llegó vacío.' });
  if (binario.length > 5 * 1024 * 1024) return res.status(413).json({ error: 'El archivo supera el máximo de 5 MB.' });
  const carpeta = path.join(__dirname, 'datos', 'archivos-clientes');
  fs.mkdirSync(carpeta, { recursive: true });
  const nombreLimpio = String(nombre).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
  const archivo = new Date().toISOString().slice(0, 10) + '-' + (Date.now() % 100000) + '-' + nombreLimpio;
  fs.writeFileSync(path.join(carpeta, archivo), binario);
  res.json({ archivo });
});

// Puerto único y propio de este proyecto (3005 por defecto). No lo comparte con ningún otro
// sitio: CV usa 3000, Bolsas De Colombia 3001, Montex 4000.
app.listen(port, '0.0.0.0', () => {
  console.log('Accessories BYM corriendo en http://0.0.0.0:' + port);
}).on('error', (err) => {
  console.error('No se pudo escuchar en el puerto ' + port + ': ' + (err.code || err.message));
});
