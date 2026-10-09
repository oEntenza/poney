/* Poney Turismo — lista de passageiros */
(function () {
  'use strict';

  const doc = document;
  const $ = (s, c) => (c || doc).querySelector(s);
  const $$ = (s, c) => Array.from((c || doc).querySelectorAll(s));
  const WHATSAPP = '5513974200444';
  const EMAIL = 'poney@poneyturismo.com.br';
  const CHAVE = 'poney-lista-passageiros';
  const MAIOR_ONIBUS = 64;

  const form = $('[data-lista]');
  const lista = $('[data-passageiros]');
  const modelo = $('[data-modelo-passageiro]');
  const totalEl = $('[data-total]');
  const detalhesEl = $('[data-detalhes]');
  const assentosEl = $('[data-assentos]');
  const erroEl = $('[data-erro]');
  const salvoEl = $('[data-salvo]');
  const camposViagem = ['nome', 'email', 'ida', 'volta', 'embarque', 'destino'];
  let idSeq = 0;

  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // revelar ao rolar (mesmo comportamento do site)
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } }), { threshold: 0.05 });
  $$('[data-revelar]').forEach((el) => io.observe(el));

  /* ---------- datas ---------- */
  const hoje = new Date();
  const iso = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.elements.ida.min = iso;
  form.elements.volta.min = iso;
  form.elements.ida.addEventListener('change', () => {
    form.elements.volta.min = form.elements.ida.value || iso;
    if (form.elements.volta.value && form.elements.volta.value < form.elements.ida.value) form.elements.volta.value = '';
  });

  /* ---------- assentos do resumo (vista de cima do maior ônibus) ---------- */
  let htmlAssentos = '';
  for (let c = 0; c < MAIOR_ONIBUS / 4; c++) {
    htmlAssentos += '<i></i><i></i><i class="corredor"></i><i></i><i></i>';
  }
  assentosEl.innerHTML = htmlAssentos;
  const assentos = $$('i:not(.corredor)', assentosEl);

  /* ---------- passageiros ---------- */
  function linhas() { return $$('.passageiro:not(.saindo)', lista); }

  function numerar() {
    linhas().forEach((li, i) => { $('.passageiro-num', li).textContent = i + 1; });
  }

  function adicionar(dados, focar) {
    const li = modelo.content.firstElementChild.cloneNode(true);
    const id = ++idSeq;
    $$('.campo', li).forEach((campo) => {
      const input = $('input', campo);
      input.id = 'p' + id + '-' + input.dataset.campo;
      $('label', campo).htmlFor = input.id;
    });
    if (dados) {
      $('[data-campo="nome"]', li).value = dados.nome || '';
      $('[data-campo="rg"]', li).value = dados.rg || '';
      $('[data-campo="colo"]', li).checked = !!dados.colo;
      $('[data-campo="menor"]', li).checked = !!dados.menor;
    }
    lista.appendChild(li);
    numerar();
    if (focar) $('[data-campo="nome"]', li).focus();
    return li;
  }

  function remover(li) {
    if (linhas().length === 1) {
      // sempre deixa uma linha: só limpa
      $$('input', li).forEach((i) => { if (i.type === 'checkbox') i.checked = false; else i.value = ''; });
      atualizar();
      return;
    }
    const proxima = li.nextElementSibling || li.previousElementSibling;
    li.classList.add('saindo');
    li.addEventListener('animationend', () => { li.remove(); numerar(); atualizar(); }, { once: true });
    if (proxima) { const alvo = $('[data-campo="nome"]', proxima); if (alvo) alvo.focus(); }
  }

  lista.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-remover]');
    if (botao) remover(botao.closest('.passageiro'));
  });
  // Enter no documento cria o próximo passageiro
  lista.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !e.target.matches('input[type="text"]')) return;
    e.preventDefault();
    const li = e.target.closest('.passageiro');
    if (e.target.dataset.campo === 'nome') { $('[data-campo="rg"]', li).focus(); return; }
    if (li === linhas()[linhas().length - 1]) adicionar(null, true);
    else $('[data-campo="nome"]', li.nextElementSibling).focus();
  });
  $('[data-adicionar]').addEventListener('click', () => { adicionar(null, true); atualizar(); });

  /* ---------- colar uma lista ---------- */
  const colar = $('[data-colar]');
  const areaColar = $('#l-colar');
  $('[data-abrir-colar]').addEventListener('click', () => { colar.hidden = false; areaColar.focus(); });
  $('[data-fechar-colar]').addEventListener('click', () => { colar.hidden = true; areaColar.value = ''; });
  $('[data-importar]').addEventListener('click', () => {
    const novos = areaColar.value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
      const partes = l.split(/\t|;/).map((p) => p.trim());
      return { nome: partes[0], rg: partes[1] || '' };
    });
    if (!novos.length) { areaColar.focus(); return; }
    // reaproveita linhas vazias antes de criar novas
    const vazias = linhas().filter((li) => !$('[data-campo="nome"]', li).value.trim() && !$('[data-campo="rg"]', li).value.trim());
    vazias.forEach((li) => li.remove());
    novos.forEach((p) => adicionar(p));
    numerar();
    colar.hidden = true;
    areaColar.value = '';
    atualizar();
  });

  /* ---------- leitura dos dados ---------- */
  function dados() {
    const v = {};
    camposViagem.forEach((c) => { v[c] = form.elements[c].value.trim(); });
    v.passageiros = linhas().map((li) => ({
      nome: $('[data-campo="nome"]', li).value.trim(),
      rg: $('[data-campo="rg"]', li).value.trim(),
      colo: $('[data-campo="colo"]', li).checked,
      menor: $('[data-campo="menor"]', li).checked,
    })).filter((p) => p.nome || p.rg);
    return v;
  }

  /* ---------- resumo ---------- */
  let totalAnterior = 0;
  function atualizar() {
    const d = dados();
    const total = d.passageiros.length;
    totalEl.textContent = total;
    if (total !== totalAnterior) {
      totalEl.classList.remove('pulou');
      void totalEl.offsetWidth;
      totalEl.classList.add('pulou');
      totalAnterior = total;
    }
    const colo = d.passageiros.filter((p) => p.colo).length;
    const menores = d.passageiros.filter((p) => p.menor).length;
    const partes = [];
    if (colo) partes.push(colo + (colo === 1 ? ' criança de colo' : ' crianças de colo'));
    if (menores) partes.push(menores + (menores === 1 ? ' menor de idade' : ' menores de idade'));
    detalhesEl.textContent = total === 0 ? 'nenhum adicionado ainda' : (partes.join(' · ') || 'todos adultos');

    assentos.forEach((a, i) => {
      a.classList.toggle('ocupado', i < total);
      a.classList.toggle('excedente', total > MAIOR_ONIBUS);
    });
    $$('[data-capacidade]').forEach((li) => li.classList.toggle('cabe', total > 0 && total <= Number(li.dataset.capacidade)));
    salvar(d);
  }

  function aoEditar(e) {
    const campo = e.target.closest('.campo');
    if (campo && campo.classList.contains('invalido') && e.target.value.trim() && e.target.checkValidity()) campo.classList.remove('invalido');
    if (!$('.invalido', form)) erroEl.hidden = true;
    atualizar();
  }
  form.addEventListener('input', aoEditar);
  form.addEventListener('change', aoEditar);

  /* ---------- rascunho (somente neste navegador) ---------- */
  let timerSalvar;
  function salvar(d) {
    clearTimeout(timerSalvar);
    timerSalvar = setTimeout(() => {
      try {
        localStorage.setItem(CHAVE, JSON.stringify(d));
        salvoEl.hidden = !(d.passageiros.length || camposViagem.some((c) => d[c]));
      } catch (e) { /* armazenamento indisponível: segue sem rascunho */ }
    }, 400);
  }
  function restaurar() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch (e) { d = null; }
    if (d) {
      camposViagem.forEach((c) => { if (d[c]) form.elements[c].value = d[c]; });
      (d.passageiros || []).forEach((p) => adicionar(p));
    }
    if (!linhas().length) adicionar();
  }
  $('[data-limpar]').addEventListener('click', () => {
    if (!window.confirm('Apagar todos os dados preenchidos?')) return;
    try { localStorage.removeItem(CHAVE); } catch (e) { /* nada a fazer */ }
    form.reset();
    lista.innerHTML = '';
    adicionar();
    salvoEl.hidden = true;
    atualizar();
  });

  /* ---------- validação e envio ---------- */
  function validar() {
    const invalidos = [];
    camposViagem.forEach((c) => {
      const el = form.elements[c];
      const ok = el.value.trim() && el.checkValidity();
      el.closest('.campo').classList.toggle('invalido', !ok);
      if (!ok) invalidos.push(el);
    });
    let comPassageiro = 0;
    linhas().forEach((li) => {
      const nome = $('[data-campo="nome"]', li);
      const rg = $('[data-campo="rg"]', li);
      const vazia = !nome.value.trim() && !rg.value.trim();
      if (!vazia) comPassageiro++;
      [nome, rg].forEach((el) => {
        const ok = vazia || el.value.trim();
        el.closest('.campo').classList.toggle('invalido', !ok);
        if (!ok) invalidos.push(el);
      });
    });
    if (!comPassageiro) {
      const primeiro = $('[data-campo="nome"]', linhas()[0]);
      primeiro.closest('.campo').classList.add('invalido');
      invalidos.push(primeiro);
    }
    if (invalidos.length) {
      erroEl.textContent = !comPassageiro ? 'Adicione pelo menos um passageiro e confira os campos destacados.'
        : invalidos.length === 1 ? 'Confira o campo destacado.' : 'Confira os ' + invalidos.length + ' campos destacados.';
      erroEl.hidden = false;
      invalidos[0].focus();
      return false;
    }
    erroEl.hidden = true;
    return true;
  }

  const dataBR = (v) => (v ? v.split('-').reverse().join('/') : '');
  function marcas(p) {
    const m = [];
    if (p.colo) m.push('criança de colo');
    if (p.menor) m.push('menor de idade');
    return m.length ? ' (' + m.join(', ') + ')' : '';
  }

  function mensagem(d, negrito) {
    const b = (t) => (negrito ? '*' + t + '*' : t);
    return [
      'Olá, Poney Turismo! Segue a lista de passageiros:',
      '',
      b('Contratante:') + ' ' + d.nome,
      b('E-mail:') + ' ' + d.email,
      b('Ida:') + ' ' + dataBR(d.ida) + '  ' + b('Volta:') + ' ' + dataBR(d.volta),
      b('Embarque:') + ' ' + d.embarque,
      b('Destino:') + ' ' + d.destino,
      '',
      b('Passageiros (' + d.passageiros.length + '):'),
    ].concat(d.passageiros.map((p, i) => (i + 1) + '. ' + p.nome + ' — ' + p.rg + marcas(p))).join('\n');
  }

  function baixarCSV(d) {
    const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const linhasCSV = [
      ['Contratante', d.nome], ['E-mail', d.email], ['Ida', dataBR(d.ida)], ['Volta', dataBR(d.volta)],
      ['Embarque', d.embarque], ['Destino', d.destino], [],
      ['Nº', 'Nome', 'RG / documento', 'Criança de colo', 'Menor de idade'],
    ].concat(d.passageiros.map((p, i) => [i + 1, p.nome, p.rg, p.colo ? 'Sim' : 'Não', p.menor ? 'Sim' : 'Não']));
    // ";" e BOM para abrir certinho no Excel em português
    const csv = '﻿' + linhasCSV.map((l) => l.map(esc).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = doc.createElement('a');
    const nomeArquivo = ('lista-passageiros-' + d.destino + '-' + d.ida).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
    a.href = url;
    a.download = nomeArquivo + '.csv';
    doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function prepararImpressao(d) {
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const logo = $('.topo-logo .logo').outerHTML;
    $('[data-impressao]').innerHTML =
      logo +
      '<h1>Lista de passageiros</h1>' +
      '<dl>' +
        '<dt>Contratante</dt><dd>' + esc(d.nome) + '</dd><dt>E-mail</dt><dd>' + esc(d.email) + '</dd>' +
        '<dt>Ida</dt><dd>' + dataBR(d.ida) + '</dd><dt>Volta</dt><dd>' + dataBR(d.volta) + '</dd>' +
        '<dt>Embarque</dt><dd>' + esc(d.embarque) + '</dd><dt>Destino</dt><dd>' + esc(d.destino) + '</dd>' +
      '</dl>' +
      '<table><thead><tr><th>Nº</th><th>Nome</th><th>RG / documento</th><th>Criança de colo</th><th>Menor de idade</th></tr></thead><tbody>' +
      d.passageiros.map((p, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(p.nome) + '</td><td>' + esc(p.rg) + '</td><td>' + (p.colo ? 'Sim' : '') + '</td><td>' + (p.menor ? 'Sim' : '') + '</td></tr>').join('') +
      '</tbody></table>';
  }

  $$('[data-enviar]').forEach((botao) => {
    botao.addEventListener('click', () => {
      if (!validar()) return;
      const d = dados();
      const acao = botao.dataset.enviar;
      if (acao === 'whatsapp') {
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem(d, true)), '_blank', 'noopener');
      } else if (acao === 'email') {
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Lista de passageiros - ' + d.destino + ' - ' + dataBR(d.ida)) +
          '&body=' + encodeURIComponent(mensagem(d, false));
      } else if (acao === 'csv') {
        baixarCSV(d);
      } else if (acao === 'imprimir') {
        prepararImpressao(d);
        window.print();
      }
    });
  });

  restaurar();
  atualizar();
})();
