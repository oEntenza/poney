/* Poney Turismo — interações do site */
(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c) => (c || doc).querySelector(s);
  const $$ = (s, c) => Array.from((c || doc).querySelectorAll(s));
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const WHATSAPP = '5513974200444';
  const EMAIL = 'poney@poneyturismo.com.br';

  let idOnibus = 0;
  const desenharOnibus = (modelo) => window.PoneyOnibus.desenhar(modelo, { id: 'onibus-' + ++idOnibus });

  /* ---------- ônibus vetoriais ---------- */
  $$('[data-onibus]').forEach((el) => { el.innerHTML = desenharOnibus(el.dataset.onibus); });

  /* ---------- anos / datas ---------- */
  const ano = new Date().getFullYear();
  $$('[data-ano], [data-ano-atual]').forEach((el) => { el.textContent = ano; });

  /* ---------- topo, progresso e parallax (um único rAF por rolagem) ---------- */
  const topo = $('[data-topo]');
  const paralaxes = $$('[data-parallax]');
  const fundoGaragem = $('[data-parallax-fundo]');
  let ultimoY = window.scrollY;
  let agendado = false;

  function aoRolar() {
    agendado = false;
    const y = window.scrollY;
    const alturaJanela = window.innerHeight;
    topo.classList.toggle('rolado', y > 40);
    const descendo = y > ultimoY + 2;
    const subindo = y < ultimoY - 2;
    if (descendo && y > 500 && !root.classList.contains('menu-aberto')) topo.classList.add('escondido');
    else if (subindo || y < 500) topo.classList.remove('escondido');
    ultimoY = y;

    if (reduzir) return;
    paralaxes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > alturaJanela + 100) return;
      const centro = r.top + r.height / 2 - alturaJanela / 2;
      el.style.translate = '0 ' + (centro * parseFloat(el.dataset.parallax)).toFixed(1) + 'px';
    });
    if (fundoGaragem) {
      const r = fundoGaragem.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < alturaJanela) {
        const centro = r.top + r.height / 2 - alturaJanela / 2;
        fundoGaragem.style.setProperty('--py', (centro * -0.18).toFixed(1) + 'px');
      }
    }
  }
  window.addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  window.addEventListener('resize', aoRolar);
  aoRolar();

  /* ---------- barra de rolagem: estrada com as seções como paradas ---------- */
  const trilho = $('[data-trilho]');
  if (trilho) {
    const pista = $('[data-trilho-pista]');
    const onibus = $('[data-trilho-onibus]');
    const placa = $('[data-trilho-placa]');
    const paradas = [
      ['inicio', 'Início'], ['servicos', 'Serviços'], ['quem-somos', 'Quem somos'], ['frota', 'Frota'],
      ['conforto', 'Conforto'], ['galeria', 'Galeria'], ['orcamento', 'Orçamento'], ['contato', 'Contato'],
    ].map(([id, nome]) => {
      const secao = doc.getElementById(id);
      if (!secao) return null;
      const botao = doc.createElement('button');
      botao.type = 'button';
      botao.className = 'trilho-parada';
      botao.setAttribute('aria-label', 'Ir para ' + nome);
      botao.innerHTML = '<span>' + nome + '</span>';
      pista.insertBefore(botao, onibus);
      return { secao, nome, botao, alvo: 0 };
    }).filter(Boolean);

    // só some com a barra nativa quando a estrada está funcionando
    trilho.hidden = false;
    root.classList.add('trilho-ativo');

    let maxRolagem = 1;
    let curso = 1;
    let alturaOnibus = 0;
    let paradaAtual = null;

    function posicionar() {
      const y = window.scrollY;
      onibus.style.setProperty('--y', (Math.min(1, y / maxRolagem) * curso).toFixed(1) + 'px');
      let atual = paradas[0];
      paradas.forEach((p) => {
        const passou = p.alvo <= y + 4;
        p.botao.classList.toggle('passou', passou);
        if (passou) atual = p;
      });
      if (atual !== paradaAtual) {
        paradaAtual = atual;
        placa.textContent = atual.nome;
      }
    }

    function medir() {
      maxRolagem = Math.max(1, root.scrollHeight - window.innerHeight);
      alturaOnibus = onibus.offsetHeight;
      curso = Math.max(1, pista.clientHeight - alturaOnibus);
      const folga = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      paradas.forEach((p) => {
        // posição de rolagem em que a seção chega ao topo (mesma conta do link âncora)
        p.alvo = Math.min(maxRolagem, Math.max(0, p.secao.getBoundingClientRect().top + window.scrollY - folga));
        p.botao.style.top = (p.alvo / maxRolagem * curso + alturaOnibus / 2).toFixed(1) + 'px';
      });
      posicionar();
    }

    let yAnterior = window.scrollY;
    let timerAndando;
    let timerPlaca;
    let agendadoTrilho = false;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (Math.abs(y - yAnterior) > 1) trilho.classList.toggle('subindo', y < yAnterior);
      yAnterior = y;
      trilho.classList.add('movendo', 'visivel', 'mostrar-placa');
      clearTimeout(timerAndando);
      clearTimeout(timerPlaca);
      timerAndando = setTimeout(() => trilho.classList.remove('movendo'), 180);
      timerPlaca = setTimeout(() => trilho.classList.remove('mostrar-placa', 'visivel'), 1300);
      if (!agendadoTrilho) {
        agendadoTrilho = true;
        requestAnimationFrame(() => { agendadoTrilho = false; posicionar(); });
      }
    }, { passive: true });

    const irPara = (top) => window.scrollTo({ top, behavior: reduzir ? 'auto' : 'smooth' });
    pista.addEventListener('click', (e) => {
      if (e.target.closest('[data-trilho-onibus]')) return;
      const botao = e.target.closest('.trilho-parada');
      if (botao) { irPara(paradas.find((p) => p.botao === botao).alvo); return; }
      const r = pista.getBoundingClientRect();
      irPara(((e.clientY - r.top - alturaOnibus / 2) / curso) * maxRolagem);
    });

    // arrastar o ônibus = arrastar a barra de rolagem
    let arrasto = null;
    onibus.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      onibus.setPointerCapture(e.pointerId);
      arrasto = { y: e.clientY, rolagem: window.scrollY };
      root.classList.add('trilho-arrastando');
    });
    onibus.addEventListener('pointermove', (e) => {
      if (!arrasto) return;
      window.scrollTo({ top: arrasto.rolagem + (e.clientY - arrasto.y) * (maxRolagem / curso), behavior: 'instant' });
    });
    const soltar = () => { arrasto = null; root.classList.remove('trilho-arrastando'); };
    onibus.addEventListener('pointerup', soltar);
    onibus.addEventListener('pointercancel', soltar);

    // a altura da página muda (fontes, painéis da frota, filtros da galeria...)
    new ResizeObserver(medir).observe(doc.body);
    window.addEventListener('resize', medir);
    medir();
  }

  /* ---------- menu ---------- */
  const botaoMenu = $('.menu-botao');
  function alternarMenu(abrir) {
    if (typeof abrir !== 'boolean') abrir = !root.classList.contains('menu-aberto');
    root.classList.toggle('menu-aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    if (abrir) topo.classList.remove('escondido');
  }
  botaoMenu.addEventListener('click', alternarMenu);
  $$('.menu a').forEach((a) => a.addEventListener('click', () => alternarMenu(false)));
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-aberto')) { alternarMenu(false); botaoMenu.focus(); } });

  // link do menu da seção visível
  const linksMenu = $$('.menu ul a[href^="#"]');
  const secoesMenu = linksMenu.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const ioMenu = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      linksMenu.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoesMenu.forEach((s) => ioMenu.observe(s));

  /* ---------- revelar ao rolar ---------- */
  const ioRevelar = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visivel');
      ioRevelar.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  $$('[data-revelar]').forEach((el) => {
    ioRevelar.observe(el);
    // depois de revelado, hover/inclinação reagem sem o atraso escalonado
    el.addEventListener('transitionend', function fim(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.style.transitionDelay = '0s';
      el.removeEventListener('transitionend', fim);
    });
  });

  /* ---------- contadores ---------- */
  const formatar = (v) => v.toLocaleString('pt-BR');
  function contar(el) {
    const alvo = el.dataset.anosDesde ? ano - Number(el.dataset.anosDesde) : Number(el.dataset.contar);
    if (reduzir) { el.textContent = formatar(alvo); return; }
    const inicio = performance.now();
    const duracao = 1800;
    (function passo(t) {
      const p = Math.min(1, (t - inicio) / duracao);
      el.textContent = formatar(Math.round(alvo * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(passo);
    })(inicio);
  }
  const ioContar = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { contar(e.target); ioContar.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('[data-contar]').forEach((el) => ioContar.observe(el));

  /* ---------- palavra rotativa do título ---------- */
  const rotativo = $('[data-rotativo]');
  if (rotativo && !reduzir) {
    const palavras = rotativo.dataset.rotativo.split(',');
    let i = 0;
    setInterval(() => {
      // aba escondida ou hero fora da tela (animações pausadas): espera
      if (doc.hidden || rotativo.closest('.pausado')) return;
      $$('em.saindo', rotativo).forEach((el) => el.remove()); // sobra de uma troca anterior
      const atual = $('em', rotativo);
      i = (i + 1) % palavras.length;
      const nova = doc.createElement('em');
      nova.textContent = palavras[i];
      nova.className = 'entrando';
      rotativo.appendChild(nova);
      // a largura acompanha a palavra nova, então a vírgula desliza junto
      rotativo.style.width = atual.offsetWidth + 'px';
      void rotativo.offsetWidth;
      rotativo.style.width = nova.offsetWidth + 'px';
      atual.className = 'saindo'; // substitui "entrando" (senão a saída não anima)
      atual.addEventListener('animationend', () => atual.remove(), { once: true });
      nova.addEventListener('animationend', () => nova.classList.remove('entrando'), { once: true });
    }, 2800);
  }

  /* ---------- hero: cenário acelera com a rolagem, brilho segue o ponteiro ---------- */
  const hero = $('[data-hero]');
  if (hero && !reduzir) {
    const camadas = $$('.camada, .pista', hero);
    const profundidade = [4, 9, 16, 0];
    let animacoes = [];
    let velocidade = 1;
    let heroVisivel = true;
    let yAnterior = window.scrollY;

    requestAnimationFrame(() => {
      animacoes = hero.getAnimations({ subtree: true })
        .filter((a) => ['rolar', 'rolar-faixa', 'girar'].includes(a.animationName));
    });

    (function laco() {
      if (heroVisivel) {
        const y = window.scrollY;
        const alvo = 1 + Math.min(7, Math.abs(y - yAnterior) * 0.35);
        yAnterior = y;
        velocidade += (alvo - velocidade) * 0.08;
        if (Math.abs(velocidade - (animacoes[0] ? animacoes[0].playbackRate : 1)) > 0.01) {
          animacoes.forEach((a) => { a.playbackRate = velocidade; });
        }
      }
      requestAnimationFrame(laco);
    })();
    new IntersectionObserver(([e]) => {
      heroVisivel = e.isIntersecting;
      hero.classList.toggle('pausado', !heroVisivel); // fora da tela, nada anima
    }).observe(hero);

    if (ponteiroFino) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        hero.style.setProperty('--mx', x + 'px');
        hero.style.setProperty('--my', y + 'px');
        const dx = (x / r.width - 0.5) * -2;
        const dy = (y / r.height - 0.5) * -1;
        camadas.forEach((c, i) => { c.style.translate = (dx * profundidade[i]).toFixed(1) + 'px ' + (dy * profundidade[i] * 0.4).toFixed(1) + 'px'; });
      });
    }

    const onibusHero = $('.hero-onibus', hero);
    onibusHero.addEventListener('click', () => {
      onibusHero.classList.remove('buzinou');
      void onibusHero.offsetWidth;
      onibusHero.classList.add('buzinou');
    });
    onibusHero.addEventListener('animationend', (e) => { if (e.animationName === 'pulinho') onibusHero.classList.remove('buzinou'); });
  }

  /* ---------- letreiro: duplica o conteúdo para o loop ---------- */
  const trilhoLetreiro = $('.letreiro-trilho');
  if (trilhoLetreiro) trilhoLetreiro.innerHTML += trilhoLetreiro.innerHTML;

  /* ---------- cartões com inclinação 3D ---------- */
  if (ponteiroFino && !reduzir) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.classList.add('inclinando');
        card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('inclinando');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    // botões "magnéticos"
    $$('[data-magnetico]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }

  /* ---------- frota ---------- */
  const abas = $$('.frota-abas [role="tab"]');
  const indicador = $('.frota-abas-indicador');
  const palco = $('[data-frota-onibus]');
  const MODELOS = window.PoneyOnibus.MODELOS;
  const maiorLargura = Math.max(...Object.values(MODELOS).map((m) => m.L));
  let modeloAtual = null;
  let trocando = false;
  let proximoModelo = null;

  function moverIndicador() {
    const ativa = abas.find((a) => a.getAttribute('aria-selected') === 'true');
    if (!ativa || !indicador) return;
    indicador.style.width = ativa.offsetWidth + 'px';
    indicador.style.transform = 'translateX(' + ativa.offsetLeft + 'px)';
  }

  function desenharAssentos(painel, total) {
    const mapa = $('.mapa-assentos', painel);
    if (!mapa) return;
    total = total || Number(mapa.dataset.assentos);
    let html = '';
    let k = 0;
    for (let c = 0; c < Math.ceil(total / 4); c++) {
      html += '<div class="mapa-coluna">';
      for (let s = 0; s < 4; s++, k++) html += '<i' + (k >= total ? ' class="vazio"' : '') + ' style="--n:' + k + '"></i>';
      html += '</div>';
    }
    mapa.innerHTML = html;
  }

  // rodas acompanham a velocidade da carroceria (acelera ao sair, freia ao chegar)
  function sincronizarRodas(conteudo, animCarro, curva, aoTerminar) {
    const rodas = conteudo.getAnimations({ subtree: true }).filter((a) => a.animationName === 'girar');
    rodas.forEach((a) => a.play());
    (function passo() {
      const t = animCarro && animCarro.effect ? animCarro.effect.getComputedTiming().progress : null;
      if (t === null || t === undefined || animCarro.playState === 'finished') {
        const final = curva(1);
        rodas.forEach((a) => { a.playbackRate = final; if (final === 0) a.pause(); });
        if (aoTerminar) aoTerminar();
        return;
      }
      const v = curva(t);
      rodas.forEach((a) => { a.playbackRate = Math.max(v, 0.001); });
      requestAnimationFrame(passo);
    })();
  }

  function animacaoDoPalco(nome) {
    return palco.getAnimations().find((a) => a.animationName === nome);
  }

  function colocarOnibus(modelo, chegando) {
    modeloAtual = modelo;
    // largura proporcional ao comprimento real: o micro aparece menor que o double deck
    palco.style.setProperty('--proporcao', ((MODELOS[modelo].L + 76) / (maiorLargura + 76)).toFixed(3));
    palco.innerHTML = desenharOnibus(modelo);
    palco.classList.add('rodando');
    palco.style.setProperty('--giro', '0.5s');
    if (!chegando || reduzir) {
      palco.getAnimations({ subtree: true }).forEach((a) => { if (a.animationName === 'girar') a.pause(); });
      trocando = false;
      return;
    }
    palco.classList.add('chegando');
    sincronizarRodas(palco, animacaoDoPalco('chegar'), (t) => 3 * Math.pow(1 - t, 2), () => {
      palco.classList.remove('chegando');
      trocando = false;
      if (proximoModelo && proximoModelo !== modeloAtual) {
        const m = proximoModelo;
        proximoModelo = null;
        trocarOnibus(m);
      }
      proximoModelo = null;
    });
  }

  function trocarOnibus(modelo) {
    if (modelo === modeloAtual) return;
    if (!modeloAtual || reduzir) { colocarOnibus(modelo, !reduzir); return; }
    if (trocando) { proximoModelo = modelo; return; }
    trocando = true;
    palco.classList.add('saindo');
    sincronizarRodas(palco, animacaoDoPalco('sair'), (t) => 0.6 + 3 * t, () => {
      palco.classList.remove('saindo');
      colocarOnibus(modelo, true);
    });
  }

  function mostrarModelo(modelo) {
    abas.forEach((a) => {
      const sel = a.dataset.modelo === modelo;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
    });
    moverIndicador();
    $$('[data-painel]').forEach((p) => {
      const ativo = p.dataset.painel === modelo;
      p.hidden = !ativo;
      if (ativo) {
        p.classList.remove('ativo-anim');
        void p.offsetWidth;
        p.classList.add('ativo-anim');
        const varAtiva = $('[data-variante][aria-pressed="true"]', p);
        desenharAssentos(p, varAtiva ? Number(varAtiva.dataset.variante) : 0);
      }
    });
    if (modeloAtual !== null) trocarOnibus(modelo);
  }

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => mostrarModelo(aba.dataset.modelo));
    aba.addEventListener('keydown', (e) => {
      const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: abas.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      const alvo = abas[(mapa[e.key] + abas.length) % abas.length];
      alvo.focus();
      mostrarModelo(alvo.dataset.modelo);
    });
  });
  window.addEventListener('resize', moverIndicador);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(moverIndicador);
  moverIndicador();
  $$('[data-painel]').forEach((p) => { if (!p.hidden) desenharAssentos(p); });

  // o primeiro ônibus entra quando a vitrine aparece na tela
  if (palco) {
    const ioPalco = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ioPalco.disconnect();
      const ativa = abas.find((a) => a.getAttribute('aria-selected') === 'true');
      colocarOnibus(ativa ? ativa.dataset.modelo : 'micro', true);
    }, { threshold: 0.4 });
    ioPalco.observe(palco.parentElement);
  }

  // capacidade (46/50, 64/56)
  $$('[data-variante]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const painel = botao.closest('[data-painel]');
      $$('[data-variante]', painel).forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
      const total = Number(botao.dataset.variante);
      const numero = $('[data-lugares]', painel);
      numero.dataset.contar = total;
      contar(numero);
      desenharAssentos(painel, total);
      if (botao.dataset.foto) {
        const foto = $('.foto-real', painel);
        foto.dataset.abrirFoto = botao.dataset.foto;
        foto.dataset.legenda = foto.dataset.legenda.replace(/\d+ lugares/, total + ' lugares');
        $('img', foto).src = botao.dataset.foto;
      }
    });
  });

  /* ---------- galeria + lightbox ---------- */
  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lb-img]');
  const lbLegenda = $('[data-lb-legenda]');
  let listaLb = [];
  let indiceLb = 0;
  let focoAnterior = null;

  function exibirLb() {
    const item = listaLb[indiceLb];
    lbImg.src = item.src;
    lbImg.alt = item.alt || item.legenda || '';
    lbLegenda.textContent = item.legenda || '';
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = '';
  }
  function abrirLb(itens, i) {
    listaLb = itens;
    indiceLb = i;
    focoAnterior = doc.activeElement;
    lb.hidden = false;
    lb.classList.toggle('unica', itens.length < 2);
    root.style.overflow = 'hidden';
    exibirLb();
    $('[data-lb-fechar]').focus();
  }
  function fecharLb() {
    lb.hidden = true;
    root.style.overflow = '';
    if (focoAnterior) focoAnterior.focus();
  }
  function navegarLb(passo) {
    indiceLb = (indiceLb + passo + listaLb.length) % listaLb.length;
    exibirLb();
  }

  $('[data-lb-fechar]').addEventListener('click', fecharLb);
  $('[data-lb-anterior]').addEventListener('click', () => navegarLb(-1));
  $('[data-lb-proxima]').addEventListener('click', () => navegarLb(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') fecharLb(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharLb();
    else if (e.key === 'ArrowLeft') navegarLb(-1);
    else if (e.key === 'ArrowRight') navegarLb(1);
    else if (e.key === 'Tab') {
      const focaveis = $$('button', lb).filter((b) => b.offsetParent !== null);
      const pos = focaveis.indexOf(doc.activeElement);
      e.preventDefault();
      focaveis[(pos + (e.shiftKey ? -1 : 1) + focaveis.length) % focaveis.length].focus();
    }
  });
  let toqueX = null;
  lb.addEventListener('pointerdown', (e) => { toqueX = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    if (toqueX === null) return;
    const dx = e.clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 50 && listaLb.length > 1) navegarLb(dx < 0 ? 1 : -1);
  });

  const galeria = $('[data-galeria]');
  if (galeria) {
    const links = $$('a', galeria);
    galeria.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      const visiveis = links.filter((l) => !l.classList.contains('oculto'));
      abrirLb(visiveis.map((l) => ({ src: l.getAttribute('href'), legenda: l.dataset.legenda, alt: $('img', l).alt })), visiveis.indexOf(link));
    });
    // carrossel do celular: contador "3 / 17" e barra de progresso
    const navegacao = $('.galeria-navegacao');
    const contador = $('[data-galeria-contador]');
    const barra = $('[data-galeria-barra]');
    function atualizarCarrossel() {
      const visiveis = links.filter((l) => !l.classList.contains('oculto'));
      const max = galeria.scrollWidth - galeria.clientWidth;
      const p = max > 0 ? galeria.scrollLeft / max : 1;
      const atual = Math.min(visiveis.length, Math.round(p * (visiveis.length - 1)) + 1);
      contador.textContent = atual + ' / ' + visiveis.length;
      barra.style.setProperty('--g', Math.max(1 / visiveis.length, p).toFixed(3));
      navegacao.classList.toggle('fim', p > 0.98);
    }
    galeria.addEventListener('scroll', () => requestAnimationFrame(atualizarCarrossel), { passive: true });

    $$('[data-filtro]').forEach((botao) => {
      botao.addEventListener('click', () => {
        $$('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
        const filtro = botao.dataset.filtro;
        links.forEach((l) => {
          const mostra = filtro === 'todos' || l.dataset.categoria === filtro;
          l.classList.toggle('oculto', !mostra);
          l.classList.remove('aparecendo');
          if (mostra) { void l.offsetWidth; l.classList.add('aparecendo'); }
        });
        galeria.scrollLeft = 0;
        atualizarCarrossel();
      });
    });
    atualizarCarrossel();
  }

  doc.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-abrir-foto]');
    if (botao) abrirLb([{ src: botao.dataset.abrirFoto, legenda: botao.dataset.legenda }], 0);
  });

  /* ---------- orçamento ---------- */
  const form = $('[data-orcamento]');
  if (form) {
    const rota = $('.rota');
    const rotaOnibus = $('[data-rota-onibus]');
    const status = $('[data-rota-status]');
    const origem = $('[data-rota-origem]');
    const destino = $('[data-rota-destino]');
    const erro = $('[data-form-erro]');
    const dica = $('[data-dica-veiculo]');
    const obrigatorios = $$('[required]', form);
    const f = (nome) => form.elements[nome];
    let progressoAnterior = 0;
    let canal = 'whatsapp';

    // datas: ida a partir de hoje, volta a partir da ida
    const hoje = new Date();
    const iso = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    f('ida').min = iso;
    f('volta').min = iso;
    f('ida').addEventListener('change', () => {
      f('volta').min = f('ida').value || iso;
      if (f('volta').value && f('volta').value < f('ida').value) f('volta').value = '';
    });

    function sugerirVeiculo() {
      const n = Number(f('pessoas').value);
      if (!n || f('veiculo').value) { dica.hidden = true; return; }
      let texto;
      if (n <= 26) texto = 'o Micro-ônibus (26 lugares) atende bem o seu grupo.';
      else if (n <= 46) texto = 'o Executivo ou o Semi-leito (46 lugares) são ótimas opções.';
      else if (n <= 50) texto = 'o Executivo de 50 lugares é o ideal.';
      else if (n <= 64) texto = 'o Double deck (até 64 lugares) leva todo mundo junto.';
      else texto = 'podemos combinar mais de um ônibus para a viagem.';
      dica.textContent = 'Para ' + n + ' pessoas, ' + texto;
      dica.hidden = false;
    }

    function atualizar() {
      const preenchidos = obrigatorios.filter((c) => c.value.trim() && c.checkValidity()).length;
      const prog = preenchidos / obrigatorios.length;
      rota.style.setProperty('--prog', prog.toFixed(3));
      if (prog !== progressoAnterior) {
        rotaOnibus.classList.remove('andando');
        void rotaOnibus.offsetWidth;
        rotaOnibus.classList.add('andando');
        progressoAnterior = prog;
      }
      origem.textContent = f('embarque').value.trim() || 'De onde?';
      destino.textContent = f('destino').value.trim() || 'Para onde?';
      const faltam = obrigatorios.length - preenchidos;
      status.classList.toggle('pronto', faltam === 0);
      status.textContent = faltam === 0 ? 'Tudo pronto! É só enviar.'
        : preenchidos === 0 ? 'Preencha o formulário para dar a partida'
        : 'Boa viagem até aqui! ' + (faltam === 1 ? 'Falta 1 informação.' : 'Faltam ' + faltam + ' informações.');
      sugerirVeiculo();
    }

    function aoEditar(e) {
      const campo = e.target.closest('.campo');
      if (campo && campo.classList.contains('invalido') && e.target.checkValidity() && e.target.value.trim()) campo.classList.remove('invalido');
      if (!$('.invalido', form)) erro.hidden = true;
      atualizar();
    }
    form.addEventListener('input', aoEditar);
    form.addEventListener('change', aoEditar);

    // botões "orçamento com este ônibus" já escolhem o veículo
    $$('[data-escolher-veiculo]').forEach((b) => b.addEventListener('click', () => {
      f('veiculo').value = b.dataset.escolherVeiculo;
      atualizar();
    }));

    $$('[data-enviar]', form).forEach((b) => b.addEventListener('click', () => { canal = b.dataset.enviar; }));

    const data = (v) => (v ? v.split('-').reverse().join('/') : '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalidos = obrigatorios.filter((c) => !c.value.trim() || !c.checkValidity());
      obrigatorios.forEach((c) => c.closest('.campo').classList.toggle('invalido', invalidos.includes(c)));
      if (invalidos.length) {
        erro.textContent = invalidos.length === 1 ? 'Confira o campo destacado.' : 'Confira os ' + invalidos.length + ' campos destacados.';
        erro.hidden = false;
        invalidos[0].focus();
        return;
      }
      erro.hidden = true;

      const linhas = [
        'Olá, Poney Turismo! Gostaria de um orçamento:',
        '',
        '*Nome:* ' + f('nome').value.trim(),
        '*E-mail:* ' + f('email').value.trim(),
        '*Pessoas:* ' + f('pessoas').value,
        '*Ida:* ' + data(f('ida').value),
        '*Volta:* ' + data(f('volta').value),
        '*Embarque:* ' + f('embarque').value.trim(),
        '*Destino:* ' + f('destino').value.trim(),
        '*Veículo:* ' + (f('veiculo').value || 'Indiquem o melhor para o meu grupo'),
      ];
      if (f('observacoes').value.trim()) linhas.push('*Observações:* ' + f('observacoes').value.trim());
      const mensagem = linhas.join('\n');

      if (canal === 'email') {
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Orçamento - ' + f('nome').value.trim()) +
          '&body=' + encodeURIComponent(mensagem.replace(/\*/g, ''));
      } else {
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem), '_blank', 'noopener');
      }
    });

    atualizar();
  }
})();
