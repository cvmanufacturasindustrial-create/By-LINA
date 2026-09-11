// ============ DATOS DEL CATÁLOGO ============
document.getElementById('whatsapp-float').href = 'https://wa.me/' + window.BYM_WHATSAPP;

// --- Tallas / medidas por tipo de pieza ---
const TALLAS_ANILLO   = ['5', '6', '7', '8', '9', '10', '11', '12'];   // numeración estándar
const LARGOS_CADENA   = ['40 cm', '45 cm', '50 cm', '55 cm', '60 cm'];
const LARGOS_PULSERA  = ['16 cm', '17 cm', '18 cm', '19 cm', 'Ajustable'];
const TALLA_UNICA     = ['Única'];

// --- Subcategorías del carrusel ---
// Las 4 originales + 3 nuevas creadas automáticamente al montar las fotos de
// C:\Users\User\Desktop\Joyeria By Lina (esa carpeta traía fotos reales para Dijes, Bolsos y
// Accesorios de Celular, que no existían todavía como categoría).
const SUBCATS = [
  { id: 'anillos',   label: 'Anillos' },
  { id: 'collares',  label: 'Collares y cadenas' },
  { id: 'aretes',    label: 'Aretes' },
  { id: 'pulseras',  label: 'Pulseras y tobilleras' },
  { id: 'dijes',     label: 'Dijes' },
  { id: 'bolsos',    label: 'Bolsos' },
  { id: 'celular',   label: 'Accesorios de Celular' }
];

// --- Productos ---
// FORMATO de cada pieza (mismo criterio que Bolsas De Colombia):
// {
//   codigo: 'BYM-ANI-001',
//   nombre: 'Nombre EXACTO según la foto (material, piedra, acabado)',
//   sub: 'anillos',                       // debe existir en SUBCATS
//   galeria: [ { src: 'imagenes/productos/archivo.jpg', etiqueta: 'frente' }, ... ],
//   precio: 0,                            // COP, un solo precio por pieza
//   desc: 'Descripción breve.',
//   detalles: ['Detalle 1', 'Detalle 2'],
//   tallas: TALLAS_ANILLO,                // o LARGOS_CADENA / LARGOS_PULSERA / TALLA_UNICA
//   colores: []                           // <-- SE DEJA EN BLANCO. Al agregar valores
//                                         //     (['Dorado','Plateado',...]) el modal muestra
//                                         //     los chips de color automáticamente.
// }
//
// Piezas montadas automáticamente desde C:\Users\User\Desktop\Joyeria By Lina (prueba pedida
// por el dueño): cada foto se revisó una por una antes de nombrarla. Precio en 0 ("por
// definir") porque esa carpeta no traía precios — solo fotos. `colores` va vacío a propósito
// (regla del proyecto: los colores se agregan después). Quedan pendientes en esa misma carpeta
// las carpetas Capturas_Pantalla, Empaques, Marca_Logos, Publicidad_RedesSociales y Videos:
// no son fotos de producto, así que no se montaron.
const productos = [
  { codigo: 'BYM-ANI-001', nombre: 'Anillo Flor con Circonias', sub: 'anillos',
    galeria: [{ src: 'imagenes/productos/anillo-flor-circonias.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Anillo en tono plateado con una flor tipo margarita cubierta de circonias y piedra central.',
    detalles: ['Material: por definir', 'Diseño floral con circonias'], tallas: TALLAS_ANILLO, colores: [] },

  { codigo: 'BYM-ANI-002', nombre: 'Anillo Tres Mariposas', sub: 'anillos',
    galeria: [{ src: 'imagenes/productos/anillo-tres-mariposas.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Anillo en tono dorado con tres mariposas de circonias en fila sobre la banda.',
    detalles: ['Material: por definir', 'Diseño de mariposas con circonias'], tallas: TALLAS_ANILLO, colores: [] },

  { codigo: 'BYM-COL-001', nombre: 'Collar Dije "Fe" con Corazón de Circonias', sub: 'collares',
    galeria: [{ src: 'imagenes/productos/collar-dije-fe-corazon.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Collar de cadena fina dorada con dije "Fe" en letra cursiva y un pequeño corazón de circonias.',
    detalles: ['Material: por definir', 'Cierre: mosquetón'], tallas: LARGOS_CADENA, colores: [] },

  { codigo: 'BYM-COL-002', nombre: 'Collar Dije Tortuga Marina', sub: 'collares',
    galeria: [{ src: 'imagenes/productos/collar-dije-tortuga-marina.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Collar de cadena dorada tipo veneciana con dije de tortuga marina en esmalte azul y verde.',
    detalles: ['Material: por definir', 'Cierre: mosquetón'], tallas: LARGOS_CADENA, colores: [] },

  { codigo: 'BYM-ARE-001', nombre: 'Aretes Corazones Dorados con Circonias', sub: 'aretes',
    galeria: [{ src: 'imagenes/productos/aretes-corazones-dorados.jpg', etiqueta: 'par' }],
    precio: 0, desc: 'Aretes tipo botón en forma de corona de corazones, alternando corazones lisos dorados y corazones cubiertos de circonias.',
    detalles: ['Material: por definir', 'Cierre: presión'], tallas: TALLA_UNICA, colores: [] },

  { codigo: 'BYM-ARE-002', nombre: 'Set de Aretes x3: Corazones, Bolitas y Gatito', sub: 'aretes',
    galeria: [{ src: 'imagenes/productos/aretes-set-x3-corazones-bolitas-gatito.jpg', etiqueta: 'set' }],
    precio: 0, desc: 'Set de 3 pares de aretes dorados: corazones calados con circonias, bolitas lisas, y aretes de gatito con dije de corazón colgante en circonias.',
    detalles: ['Material: por definir', 'Incluye 3 pares'], tallas: TALLA_UNICA, colores: [] },

  { codigo: 'BYM-PUL-001', nombre: 'Pulsera Ajustable Tres Corazones', sub: 'pulseras',
    galeria: [{ src: 'imagenes/productos/pulsera-tres-corazones-ajustable.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Pulsera deslizante (ajustable a cualquier muñeca) en tono dorado con tres dijes de corazón en circonias negras, rosadas y lilas.',
    detalles: ['Material: por definir', 'Cierre deslizante ajustable'], tallas: LARGOS_PULSERA, colores: [] },

  { codigo: 'BYM-PUL-002', nombre: 'Pulsera Tres Tréboles', sub: 'pulseras',
    galeria: [{ src: 'imagenes/productos/pulsera-tres-treboles.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Pulsera en tono plateado con tres dijes de trébol de 4 hojas en circonias rosa, fucsia y café, sobre cadena fina.',
    detalles: ['Material: por definir'], tallas: LARGOS_PULSERA, colores: [] },

  { codigo: 'BYM-DIJ-001', nombre: 'Dije Candado y Llave de Corazón', sub: 'dijes',
    galeria: [{ src: 'imagenes/productos/dije-candado-llave-corazon.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Dije doble en tono plateado: candado en forma de corazón cubierto de circonias con ojo de cerradura, y una pequeña llave a juego.',
    detalles: ['Material: por definir', 'Incluye candado y llave'], tallas: TALLA_UNICA, colores: [] },

  { codigo: 'BYM-DIJ-002', nombre: 'Dije Set Viajera (Pasaporte, Mundo y Avión)', sub: 'dijes',
    galeria: [{ src: 'imagenes/productos/dije-set-viajera-pasaporte-mundo-avion.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Set de 3 dijes en tono plateado con temática de viaje: pasaporte, globo terráqueo en esmalte azul con brillo, y avión.',
    detalles: ['Material: por definir', 'Incluye 3 dijes'], tallas: TALLA_UNICA, colores: [] },

  { codigo: 'BYM-BOL-001', nombre: 'Mini Bolso Acolchado Beige', sub: 'bolsos',
    galeria: [{ src: 'imagenes/productos/bolso-mini-acolchado-beige.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Mini bolso de mano acolchado en beige, asas anudadas, correa de eslabones de resina, dije de cordón trenzado y llavero decorativo.',
    detalles: ['Material: por definir', 'Incluye correa y llavero'], tallas: TALLA_UNICA, colores: [] },

  { codigo: 'BYM-CEL-001', nombre: 'Funda Tarjetera Floral Rosa para Celular', sub: 'celular',
    galeria: [{ src: 'imagenes/productos/funda-celular-floral-rosa.jpg', etiqueta: 'frente' }],
    precio: 0, desc: 'Funda tipo tarjetero/porta-celular con estampado floral rosa, correa de cordón trenzado blanco y azul, con dije de flor tipo margarita.',
    detalles: ['Material: por definir', 'Incluye correa y dije'], tallas: TALLA_UNICA, colores: [] }
];

// ============ RENDER ============
let subCategoriaActiva = null;
let modal = { codigo: null, talla: null, color: null, galeria: [], imagenActiva: 0 };

function formatCOP(n) { return '$' + Math.round(n).toLocaleString('es-CO') + ' COP'; }
function buscarProducto(codigo) { return productos.find((p) => p.codigo === codigo); }

// Placeholder SVG mientras no exista la foto real (mismo recurso que usó Bolsas De Colombia).
function placeholderProducto(nombre) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
    '<rect width="300" height="300" fill="#f3efe7"/>' +
    '<rect x="10" y="10" width="280" height="280" fill="none" stroke="#d8cdb8" stroke-width="2" stroke-dasharray="6,6"/>' +
    '<text x="150" y="145" font-family="Arial,sans-serif" font-size="15" fill="#8a7f68" text-anchor="middle">Foto pendiente</text>' +
    '<text x="150" y="168" font-family="Arial,sans-serif" font-size="12" fill="#a8987a" text-anchor="middle">' + nombre + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function manejarErrorImagen(img, nombre) { img.onerror = null; img.src = placeholderProducto(nombre); }

function renderSubcats() {
  const cont = document.getElementById('subcats-wrap');
  cont.innerHTML = SUBCATS.map((sc) =>
    '<button type="button" class="subcat-chip' + (sc.id === subCategoriaActiva ? ' activa' : '') + '" onclick="elegirSubcat(\'' + sc.id + '\')">' + sc.label + '</button>'
  ).join('') + (subCategoriaActiva ? '<button type="button" class="subcat-chip" onclick="elegirSubcat(null)">Ver todo</button>' : '');
}
function elegirSubcat(id) {
  subCategoriaActiva = (id === subCategoriaActiva) ? null : id;
  renderSubcats(); renderGrid();
}

function crearCard(p) {
  const portada = (p.galeria && p.galeria[0]) ? p.galeria[0].src : '';
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => abrirProducto(p.codigo);
  card.innerHTML =
    '<img src="' + portada + '" alt="' + p.nombre + '" loading="lazy" onerror="manejarErrorImagen(this,\'' + p.nombre.replace(/'/g, "") + '\')">' +
    '<div class="info"><p class="nombre">' + p.nombre + '</p>' +
    '<p class="precio">' + (p.precio ? formatCOP(p.precio) : 'Precio por definir') + '</p></div>';
  return card;
}

function renderGrid() {
  const grid = document.getElementById('products-grid');
  const conteo = document.getElementById('conteo-productos');
  const visibles = subCategoriaActiva ? productos.filter((p) => p.sub === subCategoriaActiva) : productos;
  conteo.textContent = productos.length ? visibles.length + ' pieza' + (visibles.length === 1 ? '' : 's') : '';
  grid.innerHTML = '';
  if (!visibles.length) {
    const v = document.createElement('div');
    v.className = 'grid-vacio';
    v.innerHTML = productos.length
      ? '<h3>Sin piezas en esta categoría</h3><p>Elige otra categoría.</p>'
      : '<h3>Catálogo en preparación</h3><p>Muy pronto vas a ver aquí el catálogo completo de Accessories BYM.</p>';
    grid.appendChild(v);
    return;
  }
  visibles.forEach((p) => grid.appendChild(crearCard(p)));
}

function chips(contenedorId, opciones, seleccion, alElegir) {
  const cont = document.getElementById(contenedorId);
  cont.innerHTML = '';
  opciones.forEach((op) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (op === seleccion ? ' active' : '');
    b.textContent = op;
    b.onclick = () => alElegir(op);
    cont.appendChild(b);
  });
}

function abrirProducto(codigo) {
  const p = buscarProducto(codigo);
  if (!p) return;
  const tieneColores = Array.isArray(p.colores) && p.colores.length > 0;
  modal = {
    codigo, talla: (p.tallas && p.tallas[0]) || null, color: tieneColores ? p.colores[0] : null,
    galeria: p.galeria && p.galeria.length ? p.galeria : [{ src: '', etiqueta: '' }], imagenActiva: 0
  };
  document.getElementById('modal-code').textContent = codigo;
  document.getElementById('modal-name').textContent = p.nombre;
  document.getElementById('modal-desc').textContent = p.desc || '';
  document.getElementById('modal-detalles').innerHTML = (p.detalles || []).map((d) => '<li>' + d + '</li>').join('');
  renderGaleriaModal();
  // El bloque de color siempre se ve (la estructura está lista); si `colores` está vacío,
  // muestra "Colores por definir" en vez de chips.
  document.getElementById('modal-colores').classList.toggle('oculto', !tieneColores);
  document.getElementById('modal-color-vacio').classList.toggle('oculto', tieneColores);
  document.getElementById('modal-qty').value = 1;
  refrescarModal();
  const ov = document.getElementById('product-modal');
  ov.classList.add('open');
  ov.setAttribute('aria-hidden', 'false');
}
function cerrarProducto() {
  const ov = document.getElementById('product-modal');
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden', 'true');
}

function renderGaleriaModal() {
  const p = buscarProducto(modal.codigo);
  if (!p) return;
  const g = modal.galeria;
  const mini = document.getElementById('modal-miniaturas');
  const soloUna = g.length <= 1;
  mini.classList.toggle('oculto', soloUna);
  document.getElementById('modal-galeria-prev').classList.toggle('oculto', soloUna);
  document.getElementById('modal-galeria-next').classList.toggle('oculto', soloUna);
  mini.innerHTML = g.map((foto, i) =>
    '<img src="' + foto.src + '" alt="' + p.nombre + '" class="' + (i === modal.imagenActiva ? 'activa' : '') +
    '" onclick="mostrarImagenGaleria(' + i + ')" onerror="manejarErrorImagen(this,\'' + p.nombre.replace(/'/g, "") + '\')">'
  ).join('');
  const activa = g[modal.imagenActiva] || { src: '' };
  const principal = document.getElementById('modal-img');
  principal.src = activa.src;
  principal.alt = p.nombre;
  principal.onerror = () => manejarErrorImagen(principal, p.nombre);
}
function mostrarImagenGaleria(i) { modal.imagenActiva = i; renderGaleriaModal(); }
function moverImagenGaleria(delta) {
  const g = modal.galeria;
  if (!g || g.length <= 1) return;
  modal.imagenActiva = (modal.imagenActiva + delta + g.length) % g.length;
  renderGaleriaModal();
}

function refrescarModal() {
  const p = buscarProducto(modal.codigo);
  if (!p) return;
  chips('modal-tallas', p.tallas || [], modal.talla, (v) => { modal.talla = v; refrescarModal(); });
  if (Array.isArray(p.colores) && p.colores.length) {
    chips('modal-colores', p.colores, modal.color, (v) => { modal.color = v; refrescarModal(); });
  }
  const qty = parseInt(document.getElementById('modal-qty').value, 10) || 1;
  const boton = document.getElementById('modal-action');
  const aviso = document.getElementById('modal-aviso');
  const precioBase = p.precio || 0;

  if (!precioBase) {
    document.getElementById('modal-precio').textContent = 'Precio por definir';
    aviso.style.display = 'none';
    boton.disabled = true; boton.textContent = 'Precio por definir';
    return;
  }
  const info = Cotizador.precioSegunEscala(precioBase, qty);
  document.getElementById('modal-precio').textContent = formatCOP(info.unitario) + ' c/u — Subtotal ' + formatCOP(info.unitario * qty);

  if (qty > 50) {
    aviso.style.display = 'block';
    aviso.textContent = 'Pedidos de más de 50 unidades van al cotizador por volumen (precio formal por escrito).';
    boton.disabled = false; boton.textContent = 'Ir al cotizador';
    boton.onclick = () => { cerrarProducto(); document.getElementById('calc-product').value = p.codigo; document.getElementById('calc-qty').value = qty; Cotizador.calcular(); document.querySelector('.cotizador').scrollIntoView({ behavior: 'smooth' }); };
  } else {
    aviso.style.display = 'none';
    boton.disabled = false; boton.textContent = 'Agregar al carrito';
    boton.onclick = agregarProductoAlCarrito;
  }
}

function agregarProductoAlCarrito() {
  const p = buscarProducto(modal.codigo);
  if (!p || !p.precio) return;
  const qty = parseInt(document.getElementById('modal-qty').value, 10) || 1;
  const ok = addToCart({
    codigo: p.codigo, nombre: p.nombre, img: (p.galeria && p.galeria[0]) ? p.galeria[0].src : '',
    talla: modal.talla, color: modal.color, cantidad: qty,
    precioUnitario: Cotizador.precioSegunEscala(p.precio, qty).unitario
  });
  if (ok) cerrarProducto();
}

document.getElementById('product-modal').addEventListener('click', (e) => { if (e.target.id === 'product-modal') cerrarProducto(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { cerrarProducto(); toggleCart(false); } });

// ============ COTIZADOR (módulo compartido scripts/cotizador.js) ============
const Cotizador = crearCotizador({
  catalogo: productos,
  escalas: [
    { minUnidades: 50, tipo: 'porcentaje', valor: 0.05 },
    { minUnidades: 100, tipo: 'porcentaje', valor: 0.10 }
  ],
  whatsappNumero: window.BYM_WHATSAPP,
  formatMoneda: formatCOP,
  elementos: {
    select: 'calc-product', qty: 'calc-qty', outUnit: 'out-unit', outSub: 'out-sub',
    outDiscount: 'out-discount', outTotal: 'out-total', tip: 'discount-tip',
    cont: 'cotizador-cont', vacio: 'cotizador-vacio'
  }
});
// Este archivo se carga con `defer`, así que sus `const` de nivel superior NO quedan como
// propiedades de window: los onclick inline del HTML (Cotizador.calcular(), etc.) no las verían.
// Las funciones sí (las `function` declaradas arriba se enganchan a window automáticamente);
// Cotizador es un objeto, así que se expone a mano.
window.Cotizador = Cotizador;

renderSubcats();
renderGrid();
Cotizador.init();

