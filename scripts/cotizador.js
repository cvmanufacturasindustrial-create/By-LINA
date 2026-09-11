// ============================================================================================
// MÓDULO COMPARTIDO: Cotizador por volumen
// Motor de cálculo genérico. Soporta dos formas de "escala" para poder cubrir tanto el
// descuento por porcentaje (CV/Bolsas De Colombia, Number: 5% ≥50, 10% ≥100) como el precio
// fijo por mayoreo (Montex: $55.000 c/u desde 12 unidades) con la MISMA interfaz.
//
// config = {
//   catalogo:       array de productos, cada uno con { codigo, nombre, precio }
//   escalas:        [{ minUnidades, tipo: 'porcentaje'|'precioFijo', valor }, ...]
//                   'porcentaje': valor entre 0 y 1, se resta del precio base.
//                   'precioFijo': valor reemplaza el precio unitario completo.
//                   Se aplica la escala de mayor minUnidades que la cantidad alcance.
//   whatsappNumero: string
//   formatMoneda:   (numero) => string
//   elementos: { select, qty, outUnit, outDiscount, outTotal, tip, cont, vacio, outSub? }
//              (outSub es opcional: algunos sitios no muestran subtotal aparte del total)
//   mensajesTip: (qty, escalaActual, siguienteEscala) => string   — opcional, texto del aviso
// }
// ============================================================================================

function crearCotizador(config) {
  const { catalogo, escalas, whatsappNumero, formatMoneda, elementos } = config;
  const escalasOrdenadas = [...escalas].sort((a, b) => b.minUnidades - a.minUnidades);

  function buscarProducto(codigo) { return catalogo.find((p) => p.codigo === codigo); }

  // Devuelve { unitario, escalaAplicada, siguienteEscala } para una cantidad dada.
  function precioSegunEscala(precioBase, qty) {
    const aplicada = escalasOrdenadas.find((e) => qty >= e.minUnidades) || null;
    const siguiente = [...escalasOrdenadas].reverse().find((e) => qty < e.minUnidades) || null;
    if (!aplicada) return { unitario: precioBase, escalaAplicada: null, siguienteEscala: siguiente };
    const unitario = aplicada.tipo === 'precioFijo' ? aplicada.valor : precioBase * (1 - aplicada.valor);
    return { unitario, escalaAplicada: aplicada, siguienteEscala: siguiente };
  }

  function init() {
    const sel = document.getElementById(elementos.select);
    if (elementos.cont && elementos.vacio) {
      const cont = document.getElementById(elementos.cont);
      const vacio = document.getElementById(elementos.vacio);
      if (!catalogo.length) { cont.hidden = true; vacio.hidden = false; return; }
      cont.hidden = false; vacio.hidden = true;
    }
    sel.innerHTML = catalogo.map((p) => '<option value="' + p.codigo + '">' + p.nombre + '</option>').join('');
    calcular();
  }

  function textoTipPorDefecto(qty, escalaAplicada, siguienteEscala) {
    if (escalaAplicada && escalaAplicada.tipo === 'precioFijo') {
      return '🎉 ¡Precio por mayor aplicado! ' + formatMoneda(escalaAplicada.valor) + ' c/u desde ' + escalaAplicada.minUnidades + ' unidades.';
    }
    if (escalaAplicada) {
      return '👍 ¡Tienes ' + Math.round(escalaAplicada.valor * 100) + '% de descuento!' +
        (siguienteEscala ? ' Agrega ' + (siguienteEscala.minUnidades - qty) + ' más para ' + Math.round(siguienteEscala.valor * 100) + '%.' : '');
    }
    if (siguienteEscala) {
      const detalle = siguienteEscala.tipo === 'precioFijo'
        ? formatMoneda(siguienteEscala.valor) + ' c/u'
        : Math.round(siguienteEscala.valor * 100) + '% de descuento';
      return '¡Agrega ' + siguienteEscala.minUnidades + ' unidades o más para obtener ' + detalle + '!';
    }
    return '';
  }

  function calcular() {
    const p = buscarProducto(document.getElementById(elementos.select).value);
    if (!p) return;
    const qty = parseInt(document.getElementById(elementos.qty).value, 10) || 1;
    if (p.precio == null) {
      document.getElementById(elementos.outUnit).textContent = 'Precio pendiente';
      if (elementos.outSub) document.getElementById(elementos.outSub).textContent = 'Precio pendiente';
      document.getElementById(elementos.outDiscount).textContent = '—';
      document.getElementById(elementos.outTotal).textContent = 'Precio pendiente';
      if (elementos.tip) document.getElementById(elementos.tip).textContent = 'Este producto todavía no tiene precio definido.';
      return;
    }
    const { unitario, escalaAplicada, siguienteEscala } = precioSegunEscala(p.precio, qty);
    const subtotal = unitario * qty;
    const ahorroUnitario = p.precio - unitario;
    document.getElementById(elementos.outUnit).textContent = formatMoneda(unitario);
    if (elementos.outSub) document.getElementById(elementos.outSub).textContent = formatMoneda(subtotal);
    document.getElementById(elementos.outDiscount).textContent = ahorroUnitario > 0
      ? formatMoneda(ahorroUnitario * qty) + (escalaAplicada && escalaAplicada.tipo === 'precioFijo' ? ' (precio por mayor)' : ' (' + Math.round((escalaAplicada.valor) * 100) + '%)')
      : '$0';
    document.getElementById(elementos.outTotal).textContent = formatMoneda(subtotal);
    if (elementos.tip) {
      const tip = document.getElementById(elementos.tip);
      const texto = config.mensajesTip ? config.mensajesTip(qty, escalaAplicada, siguienteEscala) : textoTipPorDefecto(qty, escalaAplicada, siguienteEscala);
      tip.textContent = texto;
      tip.style.background = ahorroUnitario > 0 ? '#f0fdf4' : '#fdf6ec';
      tip.style.color = ahorroUnitario > 0 ? '#166534' : '#8a6644';
    }
  }

  function enviarWhatsapp() {
    const p = buscarProducto(document.getElementById(elementos.select).value);
    if (!p) return;
    const qty = parseInt(document.getElementById(elementos.qty).value, 10) || 1;
    const total = p.precio == null ? null : precioSegunEscala(p.precio, qty).unitario * qty;
    const texto = mensajeDesdeCotizacion({ nombre: p.nombre, cantidad: qty, total, formatMoneda });
    abrirWhatsapp(whatsappNumero, texto);
  }

  return { init, calcular, enviarWhatsapp, precioSegunEscala };
}
