// Gera os arquivos assets/svg/onibus-*.svg a partir de assets/js/onibus.js
// Uso: node ferramentas/gerar-onibus.js
const fs = require('fs');
const path = require('path');
const { MODELOS, desenhar } = require('../assets/js/onibus.js');

const saida = path.join(__dirname, '..', 'assets', 'svg');
const nomes = { micro: 'micro', executivo: 'executivo', semiLeito: 'semi-leito', doubleDeck: 'double-deck' };
for (const modelo of Object.keys(MODELOS)) {
  const arquivo = path.join(saida, `onibus-${nomes[modelo]}.svg`);
  fs.writeFileSync(arquivo, desenhar(modelo, { avulso: true }) + '\n');
  console.log(path.relative(process.cwd(), arquivo), (fs.statSync(arquivo).size / 1024).toFixed(1) + ' KB');
}
