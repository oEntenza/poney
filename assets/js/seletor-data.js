/*
 * Seletor de data no estilo iOS: três rodas (dia, mês, ano) que giram até a data desejada.
 * Adaptado do seletor do sistema de propostas da JOTA5.
 * Substitui todo <input type="date"> da página: o campo original continua existindo (escondido),
 * com o valor "AAAA-MM-DD" e os eventos "input"/"change" de sempre, então o resto do site não muda.
 * Respeita o atributo min (datas anteriores ficam apagadas e a roda volta sozinha para o limite).
 */
(function () {
  'use strict';

  var MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var ITEM = 36; // altura de cada linha da roda (px); a roda mostra 5 linhas e a do meio é a selecionada
  var ANOS_A_FRENTE = 3; // viagens: até 3 anos à frente
  var descValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

  var ICONE_CALENDARIO = '<svg class="dp-icone" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><circle cx="8" cy="14" r=".6" fill="currentColor"/><circle cx="12" cy="14" r=".6" fill="currentColor"/><circle cx="16" cy="14" r=".6" fill="currentColor"/></g></svg>';
  var ICONE_CHECK = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var pad = function (n) { return String(n).padStart(2, '0'); };
  var diasNoMes = function (a, m) { return new Date(a, m + 1, 0).getDate(); }; // m = 0..11
  var ler = function (v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v.split('-').map(Number) : null; };
  var mostrar = function (v) { return ler(v) ? v.split('-').reverse().join('/') : ''; };
  var porExtenso = function (a, m, d) {
    return new Date(a, m, d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Uma roda ---------- */

  function roda(rotulo, itens, indice, aoMudar) {
    var col = document.createElement('div');
    col.className = 'dp-col';
    col.innerHTML = '<div class="dp-col-rotulo">' + rotulo + '</div>' +
      '<div class="dp-roda" tabindex="0" role="listbox" aria-label="' + rotulo + '"><div class="dp-folga"></div><div class="dp-itens"></div><div class="dp-folga"></div></div>';
    var el = col.querySelector('.dp-roda');
    var lista = col.querySelector('.dp-itens');
    var atual = indice;
    var timer = null;
    var raf = null;

    // Efeito de "engrenagem": cada linha gira em X conforme a distância (em linhas) até o centro
    function render3d() {
      var pos = el.scrollTop / ITEM;
      Array.prototype.forEach.call(lista.children, function (it, i) {
        var dist = i - pos;
        var limitado = Math.max(-2.6, Math.min(2.6, dist));
        it.style.transform = 'rotateX(' + (limitado * -22) + 'deg)';
        it.style.opacity = String(Math.max(0.15, 1 - Math.abs(dist) * 0.32));
        it.classList.toggle('on', Math.abs(dist) < 0.5);
      });
    }

    function definirItens(rotulos, manterIndice) {
      lista.innerHTML = rotulos.map(function (t, i) { return '<div class="dp-item" data-i="' + i + '" role="option">' + t + '</div>'; }).join('');
      atual = Math.min(manterIndice, rotulos.length - 1);
      el.scrollTop = atual * ITEM;
      render3d();
    }

    var alvo = null; // linha de destino enquanto a roda ainda está girando
    var limitar = function (i) { return Math.max(0, Math.min(lista.children.length - 1, i)); };

    // Quando a roda para: encaixa na linha mais próxima e ela vira a selecionada
    function assentar() {
      var i = limitar(Math.round(el.scrollTop / ITEM));
      if (Math.abs(el.scrollTop - i * ITEM) > 1) return irPara(i);
      alvo = null;
      if (i !== atual) {
        atual = i;
        aoMudar(i);
      }
    }

    // Animação própria (a rolagem "suave" nativa junto com o encaixe às vezes parava no meio)
    var anim = 0;
    function irPara(i, suave) {
      if (suave === undefined) suave = !reduzir;
      var para = limitar(i) * ITEM;
      cancelAnimationFrame(anim);
      anim = 0;
      if (!suave || Math.abs(el.scrollTop - para) < 1) {
        el.classList.remove('animando');
        el.scrollTop = para;
        return assentar();
      }
      var de = el.scrollTop;
      var t0 = performance.now();
      el.classList.add('animando'); // sem encaixe automático durante a animação
      function tique(t) {
        var k = Math.min(1, (t - t0) / 180);
        el.scrollTop = de + (para - de) * (1 - Math.pow(1 - k, 3));
        if (k < 1) anim = requestAnimationFrame(tique);
        else {
          anim = 0;
          el.classList.remove('animando');
          assentar();
        }
      }
      anim = requestAnimationFrame(tique);
    }

    // Um passo = uma linha. O alvo acumula passos seguidos (rodinha/teclado) antes de a roda parar.
    function passo(dir) {
      alvo = limitar((alvo !== null ? alvo : Math.round(el.scrollTop / ITEM)) + dir);
      irPara(alvo);
    }

    // Rodinha do mouse: cada "clique" anda exatamente uma linha; touchpad soma movimentos pequenos
    var acumulado = 0;
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      var dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      if (Math.abs(dy) >= 40) {
        acumulado = 0;
        return passo(Math.sign(dy));
      }
      acumulado += dy;
      if (Math.abs(acumulado) >= 40) {
        passo(Math.sign(acumulado));
        acumulado = 0;
      }
    }, { passive: false });

    // Segurar o clique e arrastar (no toque, a rolagem nativa já faz isso)
    var arrasto = null;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(anim);
      anim = 0;
      el.classList.remove('animando');
      arrasto = { y: e.clientY, topo: el.scrollTop, moveu: false };
      el.setPointerCapture(e.pointerId);
      el.classList.add('arrastando');
    });
    el.addEventListener('pointermove', function (e) {
      if (!arrasto) return;
      var dy = e.clientY - arrasto.y;
      if (Math.abs(dy) > 3) arrasto.moveu = true;
      el.scrollTop = arrasto.topo - dy;
    });
    function fimArrasto(e) {
      if (!arrasto) return;
      var moveu = arrasto.moveu;
      arrasto = null;
      el.classList.remove('arrastando');
      alvo = null;
      // Sem arrastar = clique numa linha: vai para ela; arrastou = encaixa na linha mais próxima
      var alvoEl = !moveu && e.type === 'pointerup' && document.elementFromPoint(e.clientX, e.clientY);
      var it = alvoEl && alvoEl.closest('.dp-item');
      irPara(it ? Number(it.dataset.i) : Math.round(el.scrollTop / ITEM));
    }
    el.addEventListener('pointerup', fimArrasto);
    el.addEventListener('pointercancel', fimArrasto);

    el.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render3d);
      clearTimeout(timer);
      // Rolagem nativa (toque/touchpad): quando parar, encaixa
      timer = setTimeout(function () { if (!arrasto && !anim) assentar(); }, 90);
    });
    // Toque numa linha (no mouse, o clique é tratado no pointerup)
    lista.addEventListener('click', function (e) {
      var it = e.target.closest('.dp-item');
      if (it) irPara(Number(it.dataset.i));
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        passo(e.key === 'ArrowDown' ? 1 : -1);
      }
    });

    return {
      col: col,
      definirItens: definirItens,
      get indice() { return atual; },
      montar: function () { definirItens(itens, indice); },
      // marca as linhas antes da data mínima (ficam apagadas)
      marcarFora: function (fn) {
        Array.prototype.forEach.call(lista.children, function (it, i) { it.classList.toggle('fora', fn(i)); });
      },
      ir: function (i, suave) { irPara(i, suave); },
    };
  }

  /* ---------- Painel ---------- */

  var aberto = null;

  function abrir(input, botao, rotulo) {
    if (aberto) aberto.fechar();
    var hoje = new Date();
    var min = ler(input.min); // [a, m(1-12), d] ou null
    var minData = min ? new Date(min[0], min[1] - 1, min[2]) : null;
    var inicial = ler(input.value);
    if (!inicial) {
      // sem valor: começa no limite mínimo (se for depois de hoje) ou em hoje
      var base = minData && minData > hoje ? minData : hoje;
      inicial = [base.getFullYear(), base.getMonth() + 1, base.getDate()];
    }
    var anoIni = min ? min[0] : Math.min(inicial[0], hoje.getFullYear()) - 5;
    var anoFim = Math.max(inicial[0], hoje.getFullYear()) + ANOS_A_FRENTE;
    var anos = [];
    for (var a = anoIni; a <= anoFim; a++) anos.push(a);
    var sel = { a: inicial[0], m: inicial[1] - 1, d: inicial[2] };

    var celular = window.matchMedia('(max-width: 600px)').matches;
    var fundo = document.createElement('div');
    fundo.className = 'dp-fundo ' + (celular ? 'dp-folha' : 'dp-popover');
    fundo.innerHTML = '<div class="dp-painel" role="dialog" aria-modal="true" aria-label="' + rotulo + '">' +
        '<div class="dp-cabecalho"><b>' + rotulo + '</b><span class="dp-previa"></span></div>' +
        '<div class="dp-rodas"><div class="dp-faixa"></div></div>' +
        '<div class="dp-rodape">' +
          '<button type="button" class="dp-link" data-dp="hoje">Hoje</button>' +
          (input.required ? '' : '<button type="button" class="dp-link" data-dp="limpar">Limpar</button>') +
          '<span class="dp-espaco"></span>' +
          '<button type="button" class="botao botao-contorno dp-botao" data-dp="cancelar">Cancelar</button>' +
          '<button type="button" class="botao botao-verde dp-botao" data-dp="ok">' + ICONE_CHECK + 'Confirmar</button>' +
        '</div>' +
      '</div>';
    var painel = fundo.querySelector('.dp-painel');
    var rodasEl = fundo.querySelector('.dp-rodas');
    var previa = fundo.querySelector('.dp-previa');
    var rotulosDias = function () {
      var n = diasNoMes(sel.a, sel.m), r = [];
      for (var i = 1; i <= n; i++) r.push(pad(i));
      return r;
    };
    var antesDoMin = function (a, m, d) { return minData && new Date(a, m, d) < minData; };

    function atualizarForaDoLimite() {
      if (!min) return;
      rodaMes.marcarFora(function (i) { return sel.a === min[0] && i < min[1] - 1; });
      rodaDia.marcarFora(function (i) { return sel.a === min[0] && sel.m === min[1] - 1 && i + 1 < min[2]; });
    }
    function atualizarPrevia() {
      previa.textContent = porExtenso(sel.a, sel.m, sel.d);
      atualizarForaDoLimite();
    }
    // Data antes do mínimo: as rodas voltam sozinhas para o limite (como no iPhone)
    function corrigirMinimo() {
      if (!antesDoMin(sel.a, sel.m, sel.d)) return false;
      sel.a = min[0]; sel.m = min[1] - 1; sel.d = min[2];
      rodaAno.ir(anos.indexOf(sel.a));
      rodaMes.ir(sel.m);
      rodaDia.definirItens(rotulosDias(), sel.d - 1);
      rodaDia.qtd = diasNoMes(sel.a, sel.m);
      atualizarPrevia();
      return true;
    }
    // Mudou mês/ano: o dia se ajusta (ex.: 31/01 → fevereiro vira dia 28/29)
    function sincronizarDias() {
      var max = diasNoMes(sel.a, sel.m);
      if (max !== rodaDia.qtd) {
        sel.d = Math.min(sel.d, max);
        rodaDia.definirItens(rotulosDias(), sel.d - 1);
        rodaDia.qtd = max;
      }
      if (!corrigirMinimo()) atualizarPrevia();
    }
    var rodaDia = roda('Dia', rotulosDias(), sel.d - 1, function (i) { sel.d = i + 1; if (!corrigirMinimo()) atualizarPrevia(); });
    rodaDia.qtd = diasNoMes(sel.a, sel.m);
    var rodaMes = roda('Mês', MESES, sel.m, function (i) { sel.m = i; sincronizarDias(); });
    var rodaAno = roda('Ano', anos.map(String), Math.max(0, anos.indexOf(sel.a)), function (i) { sel.a = anos[i]; sincronizarDias(); });
    [rodaDia, rodaMes, rodaAno].forEach(function (r) { rodasEl.appendChild(r.col); });

    document.body.appendChild(fundo);
    document.documentElement.classList.add('dp-travado');
    if (!celular) {
      // No computador: abre logo abaixo do campo (ou acima, se não couber)
      var r = botao.getBoundingClientRect();
      var w = 340, h = 340;
      painel.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
      painel.style.top = (r.bottom + 8 + h > window.innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8) + 'px';
    }
    [rodaDia, rodaMes, rodaAno].forEach(function (r) { r.montar(); });
    atualizarPrevia();
    requestAnimationFrame(function () { fundo.classList.add('mostrar'); });
    rodaDia.col.querySelector('.dp-roda').focus({ preventScroll: true });

    function definir(v) {
      input.value = v;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function fechar() {
      fundo.classList.remove('mostrar');
      document.documentElement.classList.remove('dp-travado');
      document.removeEventListener('keydown', aoTeclar, true);
      setTimeout(function () { fundo.remove(); }, 220);
      aberto = null;
      botao.focus({ preventScroll: true });
    }
    function aoTeclar(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        fechar();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        fundo.querySelector('[data-dp=ok]').click();
      }
      if (e.key === 'Tab') { // mantém o foco dentro do seletor
        var foco = Array.prototype.slice.call(painel.querySelectorAll('.dp-roda, button'));
        var pos = foco.indexOf(document.activeElement);
        e.preventDefault();
        foco[(pos + (e.shiftKey ? -1 : 1) + foco.length) % foco.length].focus();
      }
    }
    document.addEventListener('keydown', aoTeclar, true);
    fundo.addEventListener('click', function (e) {
      if (e.target === fundo) return fechar();
      var acaoEl = e.target.closest('[data-dp]');
      var acao = acaoEl && acaoEl.dataset.dp;
      if (acao === 'cancelar') fechar();
      if (acao === 'limpar') {
        definir('');
        fechar();
      }
      if (acao === 'hoje') {
        var t = new Date();
        sel.a = t.getFullYear(); sel.m = t.getMonth(); sel.d = t.getDate();
        if (anos.indexOf(sel.a) < 0) return;
        rodaAno.ir(anos.indexOf(sel.a), false);
        rodaMes.ir(sel.m, false);
        rodaDia.definirItens(rotulosDias(), sel.d - 1);
        rodaDia.qtd = diasNoMes(sel.a, sel.m);
        if (!corrigirMinimo()) atualizarPrevia();
      }
      if (acao === 'ok') {
        definir(sel.a + '-' + pad(sel.m + 1) + '-' + pad(sel.d));
        fechar();
      }
    });
    aberto = { fechar: fechar };
  }

  /* ---------- Troca do campo nativo pelo botão ---------- */

  function melhorar(input) {
    if (input.dataset.dp) return;
    input.dataset.dp = '1';
    var valor = input.value;
    var minimo = input.min;
    input.type = 'text'; // continua guardando "AAAA-MM-DD"
    input.value = valor;
    if (minimo) input.min = minimo;
    input.classList.add('dp-nativo');
    input.tabIndex = -1;

    var label = input.id && document.querySelector('label[for="' + input.id + '"]');
    var rotulo = input.getAttribute('aria-label') || (label && label.textContent.trim()) || 'Escolher data';
    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'dp-campo';
    if (input.id) {
      botao.id = input.id + '-seletor';
      if (label) label.htmlFor = botao.id; // clicar no rótulo abre o seletor
    }
    botao.innerHTML = '<span class="dp-texto"></span>' + ICONE_CALENDARIO;
    input.after(botao);

    function pintar() {
      var txt = mostrar(descValor.get.call(input));
      botao.querySelector('.dp-texto').textContent = txt || 'dd/mm/aaaa';
      botao.classList.toggle('vazio', !txt);
      botao.setAttribute('aria-label', rotulo + ': ' + (txt || 'escolher data'));
      botao.disabled = input.disabled;
    }
    // Quando o site muda o valor por código (ex.: volta antes da ida é apagada), o botão acompanha
    Object.defineProperty(input, 'value', {
      configurable: true,
      get: function () { return descValor.get.call(input); },
      set: function (v) { descValor.set.call(input, v); pintar(); },
    });
    // a validação do formulário foca o campo inválido: o foco vai para o botão visível
    input.focus = function (opcoes) { botao.focus(opcoes); };
    if (input.form) input.form.addEventListener('reset', function () { setTimeout(pintar); });
    new MutationObserver(pintar).observe(input, { attributes: true, attributeFilter: ['disabled'] });
    botao.addEventListener('click', function () { if (!input.disabled) abrir(input, botao, rotulo); });
    pintar();
  }

  function iniciar() {
    Array.prototype.forEach.call(document.querySelectorAll('input[type=date]'), melhorar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
