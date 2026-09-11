/* Accessories BYM — carrito flotante. Capa delgada sobre el motor compartido
   (scripts/carrito.js + scripts/whatsapp.js, cárgalos antes que este archivo). Misma
   arquitectura que "Bolsas De Colombia", simplificada para joyería: cada pieza tiene un solo
   precio (sin niveles de calidad, sin precio por escala de tela). Descuento por volumen:
   5% desde 50 unidades, 10% desde 100 — igual que Bolsas. Pedidos de más de 50 unidades van
   al cotizador por volumen en vez del carrito. */

(function () {
  const WHATSAPP = window.BYM_WHATSAPP || '573000000000';   // se define en index.html

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatoCOP(n) { return '$' + Math.round(n).toLocaleString('es-CO') + ' COP'; }

  const Cart = crearCarrito({
    claveStorage: 'cart_bym',
    whatsappNumero: WHATSAPP,
    limiteCarrito: 50,
    formatMoneda: formatoCOP,
    prefijoReferenciaPago: 'BYM',
    redirectUrlPago: location.origin + '/',
    apiPago: { config: '/api/pago/config', firma: '/api/pago/firma' },
    elementos: { count: 'cart-count', overlay: null },   // el panel usa su propia clase .open, ver toggleCart()

    clavesIguales: (a, b) => a.codigo === b.codigo && a.talla === b.talla && a.color === b.color,

    // 5% desde 50 unidades, 10% desde 100 (igual que Bolsas De Colombia).
    descuentoVolumen(unidades) { return unidades >= 100 ? 0.10 : unidades >= 50 ? 0.05 : 0; },

    onRender(items, h) {
      const cont = document.querySelector('#cart-panel .cart-items');
      if (!cont) return;
      if (!items.length) {
        cont.innerHTML = '<div class="cart-empty">Tu carrito está vacío.</div>';
        renderFooter(items, h);
        return;
      }
      cont.innerHTML = items.map((it, i) => {
        const st = it.precioUnitario * it.cantidad;
        const detalle = [it.talla ? 'Talla ' + escapeHtml(it.talla) : null, it.color ? escapeHtml(it.color) : null]
          .filter(Boolean).join(' · ');
        return '' +
          '<div class="cart-item">' +
            '<img class="cart-item-img" src="' + escapeHtml(it.img || '') + '" alt="' + escapeHtml(it.nombre) + '" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
            '<div class="cart-item-info">' +
              '<div class="cart-item-nombre">' + escapeHtml(it.nombre) + '</div>' +
              (detalle ? '<div class="cart-item-detalle">' + detalle + '</div>' : '') +
              '<div class="cart-item-precio">' + formatoCOP(it.precioUnitario) + ' c/u</div>' +
              '<div class="cart-item-row">' +
                '<div class="cart-item-qty">' +
                  '<button type="button" onclick="cartChangeQty(' + i + ',-1)" aria-label="Restar unidad">−</button>' +
                  '<span>' + it.cantidad + '</span>' +
                  '<button type="button" onclick="cartChangeQty(' + i + ',1)" aria-label="Sumar unidad">+</button>' +
                '</div>' +
                '<span class="cart-item-subtotal">' + formatoCOP(st) + '</span>' +
              '</div>' +
              '<button type="button" class="cart-item-remove" onclick="cartRemove(' + i + ')">Eliminar</button>' +
            '</div>' +
          '</div>';
      }).join('');
      renderFooter(items, h);
    }
  });

  function renderFooter(items, h) {
    const footer = document.querySelector('#cart-panel .cart-panel-footer');
    if (!footer) return;
    if (!items.length) { footer.innerHTML = ''; return; }
    const sub = h.subtotales(items);
    const desc = h.descuentoVolumen();
    const total = sub.conDescuento * (1 - desc) + sub.escala;
    footer.innerHTML =
      '<div class="cart-summary-row"><span>Subtotal</span><span>' + formatoCOP(sub.bruto) + '</span></div>' +
      (desc > 0 ? '<div class="cart-summary-row"><span>Descuento (' + Math.round(desc * 100) + '%)</span><span>-' + formatoCOP(sub.conDescuento * desc) + '</span></div>' : '') +
      '<div class="cart-summary-row total"><span>Total</span><span>' + formatoCOP(total) + '</span></div>' +
      '<button type="button" class="cart-btn cart-btn-pagar">Pagar en línea (hasta 50 unidades)</button>' +
      '<button type="button" class="cart-btn cart-btn-whatsapp">Enviar pedido por WhatsApp</button>' +
      '<button type="button" class="cart-btn cart-btn-seguir" onclick="toggleCart(false)">Seguir viendo productos</button>';
    footer.querySelector('.cart-btn-pagar').onclick = h.pagar;
    footer.querySelector('.cart-btn-whatsapp').onclick = h.pedir;
  }

  // El panel (#cart-panel) lleva la clase .open él mismo (ver styles/cart.css).
  window.toggleCart = function (forzarAbierto) {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;
    const abrir = typeof forzarAbierto === 'boolean' ? forzarAbierto : !panel.classList.contains('open');
    panel.classList.toggle('open', abrir);
    panel.setAttribute('aria-hidden', abrir ? 'false' : 'true');
    if (abrir) Cart.render();
  };

  function notificarAgregado() {
    const fab = document.getElementById('cart-fab');
    if (!fab) return;
    fab.classList.remove('recien-agregado');
    void fab.offsetWidth;
    fab.classList.add('recien-agregado');
    setTimeout(() => fab.classList.remove('recien-agregado'), 450);
  }

  /* item: { codigo, nombre, talla, color, img, precioUnitario, cantidad } */
  window.addToCart = function (item) {
    const ok = Cart.agregar(item);
    if (ok) { notificarAgregado(); window.toggleCart(true); }
    return ok;
  };
  window.cartChangeQty = function (indice, delta) {
    const ok = delta > 0 ? Cart.sumar(indice) : Cart.restar(indice);
    if (!ok) alert('Para pedidos de más de 50 unidades usa el cotizador por volumen: obtienes precio formal por escrito.');
  };
  window.cartRemove = function (indice) { Cart.quitar(indice); };
  window.sendCartWhatsApp = Cart.pedir;
  window.pagarEnLinea = Cart.pagar;
  window.renderCart = Cart.render;

  document.addEventListener('DOMContentLoaded', () => Cart.render());
})();
