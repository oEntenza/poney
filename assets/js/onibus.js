/*
 * Ilustrações vetoriais da frota Poney.
 * Cada modelo é desenhado a partir de parâmetros (comprimento, altura, eixos...),
 * então o mesmo código gera os ônibus animados do site e os arquivos .svg avulsos
 * (ver ferramentas/gerar-onibus.js).
 */
(function (root) {
  'use strict';

  // Logo Poney vetorizado (versão leve, para uso em tamanhos pequenos)
  var WORDMARK = 'M1.6 49.6C1.2 49.4 3 48.4 4.5 48C5 47.8 6.3 47.4 7.3 47C8.3 46.6 9.6 46.1 10.2 46C11.4 45.6 12.7 44.3 16.5 39.5C18 37.7 19.3 36 19.5 35.8C19.7 35.6 20.4 34.8 21 34C22 32.8 25.1 28.9 28 25.5C28.6 24.7 32 20.6 33.5 18.7C34.1 18 36 15.6 37.8 13.4C44.6 5.1 44.3 5.5 43.8 4.8C43.6 4.4 42.7 3.8 42 3.4C39 1.8 37.2 0.7 37.1 0.4C37 0.1 47.9 0 76.1 0C114.2 0 115.2 0 116.5 0.7C117.2 1 118 1.6 118.2 2C119.3 3.5 118.6 4.6 110.9 14.2C106.8 19.3 103.1 24 102.6 24.6C102.1 25.3 101.4 26.1 101.1 26.5C100.7 26.9 99.6 28.2 98.6 29.5C94.7 34.4 96.6 34 74.8 34C60.8 34 56.4 34.1 56 34.4C54.8 35.3 47 45.4 47 46C47 46.3 47.4 47 48 47.4C50.1 49.2 50 49.2 38.3 49.5C22.3 49.8 2 49.9 1.6 49.6ZM119.7 49.7C99.5 49.5 97.7 49.5 96.9 48.9C95.4 47.9 95.3 45.3 96.8 43.7C97.2 43.2 99 41 100.8 38.7C112.6 23.4 112.7 23.3 115.1 22.1L116.8 21.2L141.5 21.1L166.2 21L167.5 21.9C168.7 22.8 168.8 23 168.9 24.4C169 26.1 168.7 26.7 165.8 30C165.3 30.7 164.2 31.9 163.5 32.8C162.8 33.7 161.9 34.7 161.5 35.1C161.2 35.5 160.2 36.7 159.4 37.8C158.5 38.9 157.7 40 157.4 40.3C157.2 40.5 156.1 41.9 155 43.3C152 47.3 150.1 48.8 147.8 49.3C144.8 49.8 143 49.9 119.7 49.7ZM159.3 49.7C158.9 49.6 159.5 48.5 161.3 46.3C162.2 45.3 163.6 43.6 164.5 42.4C165.4 41.2 167 39.2 168.1 37.9C169.1 36.6 170.9 34.4 172 33C173.1 31.6 174.9 29.4 175.9 28.1C177 26.8 178.6 24.8 179.5 23.6C180.4 22.4 181.3 21.4 181.5 21.3C181.7 21.1 186.7 21 192.6 21.1L203.4 21.2L204 22.2C204.4 22.7 205 23.8 205.4 24.7C207.2 28 207.5 28.5 208.1 28.8C208.5 29.1 208.8 29 209.2 28.4C209.5 28 209.9 27.5 210.1 27.3C210.3 27 211.6 25.5 213 23.9L215.4 21L227.2 21C235.9 21 239 21.1 239 21.4C239 21.7 237 24.4 236.3 25C236.2 25.1 234.1 27.8 231.5 31C228.9 34.2 226.5 37.2 226.1 37.7C225.4 38.5 224.4 39.8 221 44C219.9 45.4 218.5 47.1 217.8 47.9L216.5 49.4L206.7 49.7C201.3 49.9 196.5 50 196.1 49.9C195.7 49.7 195.3 49.3 195.2 48.9C195 48.5 194.8 47.7 194.5 47.2C194.3 46.6 193.6 45 193 43.5C192.4 42 191.8 40.7 191.6 40.6C191.4 40.3 189.4 42.6 186.1 46.9C185.3 47.9 184.4 49 184 49.2C183.6 49.6 180.8 49.7 171.5 49.7C165 49.8 159.5 49.8 159.3 49.7ZM226.2 49.7C226.1 49.5 226.6 48.5 227.5 47.4C228.3 46.4 229.9 44.3 231.1 42.8C232.2 41.4 233.2 40.1 233.3 40C233.5 39.9 234.9 38.1 236.5 36C238.2 33.9 240.5 31 241.7 29.5C242.9 28 244.8 25.5 245.9 24C247.1 22.5 248.4 21.2 248.8 21C250 20.6 306 21 306 21.5C306 21.7 304.9 23 303.7 24.3L301.3 26.8L299.6 26.8C297.3 26.8 268 26.7 267.3 26.7C266.7 26.7 263 31.4 263 32.2C263 32.6 264.5 32.7 275.3 32.7C283.4 32.7 287.7 32.8 287.8 33C288 33.2 287.1 34.4 286 35.7L283.9 38L271 38C264 38 258 38.1 257.8 38.3C257 38.9 254 42.7 254 43.1C254 43.6 255.7 43.7 271 43.7C286.1 43.7 288 43.7 288 44.2C288 44.5 287 45.9 285.8 47.3L283.6 50L255 50C236.2 50 226.3 49.9 226.2 49.7ZM308.9 49.7C308.8 49.5 310.1 48.4 311.9 47.1C313.6 45.9 316.5 43.8 318.3 42.5C320.1 41.1 321.9 39.9 322.3 39.7C323.2 39.2 323.2 38.3 322 36.2C321.5 35.3 320.3 33 319.3 31.2C317.7 28.1 316.7 26.3 314.7 22.7C314.2 21.7 314.1 21.3 314.4 21.2C314.7 21.1 319.4 21 325 21.1L335.2 21.2L336.8 24.3C337.6 26.1 338.6 27.5 338.9 27.6C339.1 27.7 340.2 27.1 341.1 26.4C342.1 25.6 344.2 24.1 345.7 23.1L348.6 21.1L360.7 21C370.1 20.9 372.8 20.9 372.8 21.2C372.8 21.5 372.2 22.1 371.3 22.6C370.5 23.2 368.6 24.5 367 25.6C365.4 26.7 363 28.5 361.5 29.5C360 30.5 357.5 32.3 355.8 33.5C354.2 34.7 351.6 36.5 350.2 37.5C348.7 38.5 346.2 40.3 344.5 41.5C342.8 42.7 340.3 44.5 338.8 45.5C337.4 46.5 335.3 48 334.3 48.7L332.5 50L320.8 50C314.3 50 309 49.9 308.9 49.7ZM129.7 43.1C130.1 42.9 130.8 42.4 131.3 42C132.6 40.8 142 28 142 27.5C142 26.8 140.7 26.6 137.3 26.7C134.5 26.9 134.3 26.9 133.1 28C131.7 29.4 122 42.2 122 42.7C122 42.9 122.3 43.1 122.7 43.3C123.6 43.6 128.6 43.5 129.7 43.1ZM75.3 22C76 21.6 76.9 20.8 77.3 20.3C77.8 19.8 79.4 18.1 80.8 16.5C84 13 85 11.7 84.8 11.3C84.7 11.1 83 11 81 11C78.1 11 77.1 11.1 76.4 11.6C75.4 12.2 75.4 12.2 71.7 16.3C70.1 18.1 68.4 19.9 67.9 20.4C67 21.3 66.8 22 67.2 22.4C67.3 22.6 69 22.7 70.8 22.7C73.6 22.7 74.3 22.6 75.3 22Z';
  var CAVALO = 'M17.2 172.1C16.9 171.3 19.2 168.7 20.2 168.7C20.8 168.7 21 168.5 21.1 167.6C21.1 166.9 21.4 166.4 21.8 166.2C24.8 164.6 26.7 162.8 29.4 159.2C31.1 156.8 31.6 155.8 31.8 153.7C32.1 151.3 33.2 149.7 35.5 148.2C38 146.6 41.4 143.2 42.4 141.3C44.1 138.3 45 136.6 45 136.1C45 135.9 44.2 135.2 43.2 134.5C42.3 133.7 40.8 132.5 39.9 131.7L38.3 130.2L34.1 130.5C31.7 130.6 28.9 130.7 27.8 130.7C26.7 130.7 25.4 130.8 25 130.9C24.1 131.3 22 133.3 22 133.8C22 134.1 20.3 136.4 19.3 137.3C18.4 138.2 17 139 16.3 139C15.1 139 14.6 139.5 14.8 140.4C15 140.9 14.8 141.9 14.5 142.8C13.9 144.7 13.9 148.3 14.5 149.1C14.8 149.5 15.1 150.4 15.2 151.2C15.3 152.2 15.7 152.9 16.7 153.9C18.2 155.4 18.4 156.7 17.3 159.1C16 162.1 12.6 163 10.2 161C9 160 9 159.9 9 157.8C9.1 156.2 9 155.5 8.5 155C7.9 154.4 7.9 154.2 8.5 152.2C8.8 151 9.2 149 9.5 147.9C9.9 146.4 10 145.1 9.9 143.8C9.3 138.5 9.3 137.5 9.7 136.5C10.8 134.1 12.8 131.6 16.2 128.4C18.2 126.5 20 124.5 20.3 123.8C21.1 122.1 22 119.3 22 118.6C22 117.4 24.9 111.6 26.7 109C28.3 106.8 32.7 102.5 35.5 100.4C39.9 97.1 42.6 93.6 43.1 90.7C43.3 90 43.9 88.4 44.6 87C45.8 84.7 45.9 84.5 47.2 84.2C50.3 83.5 53 81.6 53 79.9C53 79.2 53 79.1 51 80.5C49.3 81.7 47.5 82.3 46.1 82.3C45.2 82.3 42.4 85 41.1 87.1C37.8 92.3 33 94.6 28.6 93.1C27 92.6 25.6 91.3 25.2 89.7C24.6 88 26.2 85.2 30 81.4C32.4 78.8 33.4 76.8 33.6 74.1C33.7 72.9 33.9 72 34 72C34.5 72 34.4 70.8 33.8 70.2C33.1 69.5 33.2 69.3 35.2 67.2C39.1 63.4 40 62.1 40 60.1C40 59.1 39.9 58.3 39.7 58.2C39.3 57.9 38 59.3 38 60C38 60.9 37.4 62 37 62C36.4 62 37 59.6 37.7 58.9C38.1 58.5 38.3 57.9 38.3 57.2C38.3 55.5 39.3 55.6 40.8 57.6C42.3 59.7 42.4 60.8 41 62.2C39.9 63.2 39.8 63.7 40.4 64.3C41.4 65.1 41.8 64.9 41.8 63.5C41.9 62.3 42.1 61.9 43.4 60.7C45.2 59 45.5 57.9 44.3 55.7C43.4 53.9 44.1 53.5 46.1 54.5C46.6 54.8 47.3 55 47.5 55C47.7 55 48.3 55.5 48.9 56.1C50.1 57.3 50.3 58.7 49.5 59.9C48.8 60.9 48.5 62.8 49 63.6C49.6 64.7 50.2 64.5 50.1 63.2C50 62.4 50.2 61.8 51.1 60.6C51.8 59.8 52.7 58.5 53.2 57.7C53.8 57 54.3 56.3 54.5 56.3C54.7 56.4 55.4 57.1 56 57.9C57.4 59.8 57.6 62.1 56.5 63.3C55.3 64.6 54.4 63.9 55.5 62.5C56.2 61.6 56.1 59.6 55.4 58.9C54.7 58.3 54 58.4 54 59.1C54 59.3 53.5 60 53 60.6C51.7 62.1 51.6 64.1 52.9 65.5C53.7 66.3 53.9 66.4 55.2 66.2C56.4 66.1 56.9 65.8 58.9 63.8C61.9 60.7 63.3 60 66.5 60C67.8 60 69 60.1 69.1 60.2C69.2 60.3 68.9 61 68.3 61.6C67.8 62.3 67 63.9 66.5 65.1C65.6 67.3 63.6 70 63 70C62.4 70 60.7 71.4 60.9 71.7C61.5 72.8 64.3 71.3 67.8 68C70.5 65.5 71.1 65.1 72.9 64.6C75.7 63.7 76.3 64.1 74.9 65.7C74.4 66.4 73.9 67.6 73.5 69.6C72.9 72.7 71.6 74.8 69.7 75.8C69.2 76.1 68.6 76.6 68.2 76.9C67.4 77.9 68.2 78.1 70.2 77.4C72.2 76.7 73.5 75.9 75.1 74.2C75.8 73.5 76.5 73.1 76.7 73.2C76.9 73.3 77 74.4 77 75.6C77 77.6 76.9 78.1 76 79.3C75.4 80.1 74.6 80.8 74.2 81C73.2 81.4 73.1 82 73.9 82C75.6 82.1 76.9 81.9 77.6 81.3C78.9 80.3 79.2 81 78.4 82.7C77.4 84.7 76.2 85.9 74.7 86.4C73.4 86.8 72.8 86.7 68.8 85.8C67.7 85.5 67.8 86.4 68.9 87.2C70.2 88.2 71.9 88.7 73.6 88.7C75.4 88.7 78.5 87.9 79.2 87.3C80 86.6 80.4 87.3 80.3 89.3C80.1 90.8 79.9 91.3 79 92.1C78.1 92.9 77.8 93 75.5 93C73.7 93 73 93.1 73.1 93.4C73.3 94.1 75.1 94.4 77.9 94.2C80.8 93.9 81.2 94.1 79.9 95.2C77.5 97.4 72.3 97.2 68.8 94.8C67.1 93.6 66.2 93.9 67.6 95.3C70.7 98.4 73 98.9 82.8 99.1C86.9 99.1 90.3 99.1 90.3 98.9C90.3 98.8 89.9 97.7 89.3 96.6C87.8 93.5 87.3 91.4 87.7 90.2C88.5 88 93 86 96.9 86C98.9 86 99.6 86.4 98.5 86.8C98 87 97.8 88.4 98.2 88.8C98.3 88.9 99 88.5 99.7 88C101.6 86.5 104 86.7 108.6 88.8C110.5 89.6 110.4 90 108 90C106.9 90 106 90.1 105.9 90.3C105.6 90.6 106.4 91 107.4 91C108.3 91 110.4 92.2 111.7 93.4C113 94.6 115 97.1 115 97.5C115 97.6 115.4 98.3 116 99C117.2 100.5 117.6 101.7 116.9 101.7C116.6 101.7 116.3 101.5 116.2 101.3C115.9 100.9 114.4 100.9 114.2 101.3C114.1 101.4 114.8 102.1 115.7 102.8C120.5 106.3 121.2 112.3 118.2 122C117.6 124.1 116.8 124 116.8 121.7C116.8 119.6 116.4 119.2 115.4 120.5C115 121 114 122.2 113.1 123.3C112.1 124.3 111 125.6 110.6 126.1C109.3 127.6 109 127.1 109 123.3C109 115.9 106.8 109.5 103.2 106.5C101.1 104.7 96.7 103.3 96.7 104.4C96.7 104.6 97.2 105.3 97.8 106.1C98.4 106.9 99.4 108.5 100 109.8C101.1 112.1 101.1 112.3 101.1 116.7C101.2 120.6 101.1 121.4 100.4 123.3C99.1 126.8 98.8 127.4 98 129.1L97.2 130.7L98 131.5C99 132.6 98.7 133.3 95.5 136.7C94 138.2 92.2 140.4 91.4 141.5C90.7 142.6 88.8 145.4 87.2 147.8L84.4 152L84.6 153.8C84.7 155.1 84.6 156 84.2 157.1C83.8 158.2 83.7 158.7 84 159.5C84.5 160.7 84.2 161.6 82.9 162.8C81.1 164.4 79.6 165 77.4 165C73.4 165 72.8 162.7 75.8 158.2C76.4 157.4 76.4 157.3 75.9 156.5C75 155.2 75.2 154.7 77.1 152.9C80.3 149.8 84 144.3 84 142.7C84 142.3 83.6 141.7 83.1 141.3C82.1 140.5 81.3 139 81.3 137.6C81.3 137.1 81.2 136.6 81 136.5C80.6 136.3 78.7 137 77.5 137.8C77 138.3 75.7 138.9 74.8 139.4C72.9 140.3 69 142.9 67.3 144.3C66.7 144.9 65.3 146.2 64.2 147.1C58 152.4 56.7 154.1 54 159.6C52.8 162.1 51.1 164.5 49.6 165.6C48.7 166.2 48.5 166.7 48.3 168C48.2 168.9 47.8 170 47.3 170.6C46.7 171.5 46.4 171.6 43.9 171.8C39.9 172.1 36.7 172 36.5 171.7C36.1 171 38.1 168.3 39.1 168.3C39.7 168.3 39.8 168.1 39.7 166.8C39.7 166.4 40.1 165.9 40.9 165.3C42.7 164.1 49.8 157 50.5 155.8C50.8 155.2 51 154.2 51 153.6C51 151.3 52.5 149.1 56 146.5C58.2 144.9 59.8 143.3 60.9 141.8C61.9 140.5 62.9 139.2 63.3 138.9C64.2 138 64.2 137.5 63.2 137.8C62 138.1 61.8 137.4 62.9 136.4C64.1 135.3 64.5 134.4 63.9 134.1C63.6 134 62.7 134.7 61.8 135.5C60.2 137.1 56.5 140 56.2 140C56.1 140 54.9 140.7 53.5 141.5C52.1 142.3 50.9 143 50.7 143C50.5 143 45 147.7 42.5 150C41.6 150.9 40.5 152 40 152.4C38 154.3 36.1 157 34.5 160.3C33 163.2 32.4 164.1 30.7 165.6C28.8 167.3 28.7 167.5 28.8 168.5C29 169.2 28.9 169.7 28.5 170C28.2 170.2 28 170.6 28 170.9C28 171.6 26.8 171.9 22.5 172.1C20.3 172.3 18.3 172.4 18 172.5C17.6 172.6 17.3 172.4 17.2 172.1ZM46.6 74.3C47.9 73.7 49.1 72.5 48.9 71.8C48.9 71.3 48.5 71.1 47.4 71.1C46.2 71 45.8 71.1 45 71.9C43.9 72.9 43.8 73.6 44.4 74.3C44.9 74.8 45.4 74.8 46.6 74.3Z';

  var COR = {
    verde: '#135E33',
    verdeEscuro: '#0b3d21',
    verdeMedio: '#2f9a5c',
    lima: '#cfe27a',
    cinzaCavalo: '#657983',
    vidro1: '#13242a',
    vidro2: '#2e464d',
  };

  var MODELOS = {
    micro: {
      nome: 'Micro-ônibus', L: 640, H: 228, r: 37, bico: 64,
      eixos: [150, 640 - 150], andares: 1, janelas: 5, arCond: [0.32, 0.56],
    },
    executivo: {
      nome: 'Executivo', L: 900, H: 262, r: 42, bico: 150,
      eixos: [235, 900 - 215], andares: 1, janelas: 7, arCond: [0.24, 0.5],
    },
    semiLeito: {
      nome: 'Semi-leito', L: 940, H: 276, r: 42, bico: 156,
      eixos: [205, 300, 940 - 215], andares: 1, janelas: 7, arCond: [0.22, 0.48],
    },
    doubleDeck: {
      nome: 'Double deck', L: 960, H: 338, r: 43, bico: 118,
      eixos: [205, 300, 960 - 210], andares: 2, janelas: 7, arCond: null,
    },
  };

  function n(v) { return Math.round(v * 10) / 10; }

  // Contorno da carroceria (olhando para a direita)
  function carroceria(x0, yT, L, H, bico) {
    var x1 = x0 + L, yB = yT + H;
    return [
      'M', x0 + 26, yT,
      'H', x1 - bico,
      'C', n(x1 - bico * 0.42), yT, x1 - 22, n(yT + H * 0.05), x1 - 13, n(yT + H * 0.3),
      'C', x1 - 5, n(yT + H * 0.55), x1, n(yT + H * 0.74), x1, yB - 24,
      'Q', x1, yB, x1 - 24, yB,
      'H', x0 + 10,
      'Q', x0, yB, x0, yB - 12,
      'V', yT + 32,
      'Q', x0 + 1, yT + 1, x0 + 26, yT,
      'Z',
    ].join(' ');
  }

  // Faixa ondulada da pintura (sobe na frente, como nos ônibus da Poney)
  function onda(x0, yB, L, H, desloc) {
    var y = function (f) { return n(yB - H * f - desloc); };
    var x = function (f) { return n(x0 + L * f); };
    return [
      'M', x0 - 10, y(0.27),
      'C', x(0.12), y(0.31), x(0.2), y(0.13), x(0.36), y(0.15),
      'S', x(0.55), y(0.33), x(0.66), y(0.3),
      'S', x(0.8), y(0.12), x(0.88), y(0.2),
      'S', x(0.96), y(0.56), x0 + L + 10, y(0.62),
      'V', yB + 10, 'H', x0 - 10, 'Z',
    ].join(' ');
  }

  function roda(id, cx, cy, r) {
    var furos = '';
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      furos += '<circle cx="' + n(Math.cos(a) * r * 0.36) + '" cy="' + n(Math.sin(a) * r * 0.36) + '" r="' + n(r * 0.05) + '" fill="#5d6863"/>';
    }
    var raios = '';
    for (var j = 0; j < 5; j++) {
      var b = (j / 5) * 360;
      raios += '<rect x="' + n(-r * 0.05) + '" y="' + n(-r * 0.58) + '" width="' + n(r * 0.1) + '" height="' + n(r * 0.14) + '" rx="' + n(r * 0.04) + '" fill="#6f7a75" transform="rotate(' + b + ')"/>';
    }
    return (
      '<g class="roda" transform="translate(' + n(cx) + ' ' + n(cy) + ')">' +
        '<circle r="' + r + '" fill="#191d1b"/>' +
        '<circle r="' + n(r * 0.83) + '" fill="none" stroke="#2c3330" stroke-width="' + n(r * 0.06) + '"/>' +
        '<g class="giro">' +
          '<circle r="' + n(r * 0.62) + '" fill="url(#' + id + '-aro)"/>' +
          raios + furos +
          '<circle r="' + n(r * 0.19) + '" fill="#9aa59f" stroke="#59645f" stroke-width="' + n(r * 0.04) + '"/>' +
        '</g>' +
      '</g>'
    );
  }

  function estrela(cx, cy, s) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? s * 0.42 : s;
      p.push(n(cx + Math.cos(a) * rr) + ',' + n(cy + Math.sin(a) * rr));
    }
    return '<polygon points="' + p.join(' ') + '"/>';
  }

  // <symbol>s do logo; no site entram uma vez só, num sprite escondido
  function simbolos() {
    return (
      '<symbol id="poney-wordmark" viewBox="0 0 374 50"><path d="' + WORDMARK + '"/></symbol>' +
      '<symbol id="poney-cavalo" viewBox="7 53 115 120"><path d="' + CAVALO + '"/></symbol>'
    );
  }

  // Logo empilhado (wordmark + 3 cavalos), cada cavalo é um elemento animável
  function logo(titulo) {
    var cav = '';
    [[0, 0], [107.6, 0.2], [215.5, 0.2]].forEach(function (d, i) {
      cav += '<use class="logo-cavalo" style="--i:' + i + '" href="#poney-cavalo" x="' + (7 + d[0]) + '" y="' + (53 + d[1]) + '" width="115" height="120"/>';
    });
    return (
      '<svg class="logo" viewBox="0 0 374 174" role="img" aria-label="' + (titulo || 'Poney Turismo') + '">' +
        '<use class="logo-wordmark" href="#poney-wordmark" width="374" height="50"/>' +
        '<g class="logo-cavalos">' + cav + '</g>' +
      '</svg>'
    );
  }

  /**
   * Monta o SVG de um modelo.
   * opcoes.id         prefixo único para gradientes/máscaras (vários ônibus na mesma página)
   * opcoes.avulso     true = embute o logo (arquivo .svg independente)
   * opcoes.titulo     texto acessível
   */
  function desenhar(modelo, opcoes) {
    var m = MODELOS[modelo];
    if (!m) throw new Error('Modelo desconhecido: ' + modelo);
    opcoes = opcoes || {};
    var id = opcoes.id || 'bus-' + modelo;
    var L = m.L, H = m.H, r = m.r;
    var x0 = 24, yT = 22, x1 = x0 + L, yB = yT + H;
    var chao = yB + n(r * 0.58);
    var cy = chao - r;
    var W = x1 + 52, VH = chao + 14;
    var corpo = carroceria(x0, yT, L, H, m.bico);
    var dd = m.andares === 2;

    var s = [];
    s.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + ' ' + VH + '" class="onibus onibus-' + modelo + '" role="img" aria-label="' + (opcoes.titulo || 'Ilustração do ônibus ' + m.nome + ' da Poney Turismo') + '">');
    s.push('<defs>');
    if (opcoes.avulso) s.push(simbolos());
    s.push('<linearGradient id="' + id + '-lata" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3f6f2"/><stop offset="1" stop-color="#dfe6e0"/></linearGradient>');
    s.push('<linearGradient id="' + id + '-vidro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + COR.vidro2 + '"/><stop offset="1" stop-color="' + COR.vidro1 + '"/></linearGradient>');
    s.push('<radialGradient id="' + id + '-aro" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#f4f7f5"/><stop offset=".6" stop-color="#c3cbc6"/><stop offset="1" stop-color="#7f8a85"/></radialGradient>');
    s.push('<radialGradient id="' + id + '-sombra" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>');
    s.push('<clipPath id="' + id + '-corpo"><path d="' + corpo + '"/></clipPath>');
    // máscara que "encolhe" a carroceria: o vidro acompanha a curva da frente com uma margem
    s.push('<mask id="' + id + '-recuo" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + VH + '"><path d="' + corpo + '" fill="#fff" stroke="#000" stroke-width="22"/></mask>');
    s.push('</defs>');

    // sombra no chão
    s.push('<ellipse class="sombra" cx="' + n(x0 + L / 2) + '" cy="' + (chao - 2) + '" rx="' + n(L * 0.56) + '" ry="' + n(r * 0.32) + '" fill="url(#' + id + '-sombra)"/>');

    s.push('<g class="carro">');
    // ar-condicionado no teto
    if (m.arCond) {
      var a0 = x0 + L * m.arCond[0], a1 = x0 + L * m.arCond[1];
      s.push('<rect x="' + n(a0) + '" y="' + (yT - 9) + '" width="' + n(a1 - a0) + '" height="16" rx="8" fill="#e3e9e4" stroke="#0b3d21" stroke-opacity=".25" stroke-width="1.5"/>');
    }

    s.push('<path d="' + corpo + '" fill="url(#' + id + '-lata)"/>');

    // pintura: faixa lima, verde médio e verde escuro
    s.push('<g clip-path="url(#' + id + '-corpo)">');
    s.push('<path d="' + onda(x0, yB, L, H, H * 0.1) + '" fill="' + COR.lima + '"/>');
    s.push('<path d="' + onda(x0, yB, L, H, H * 0.065) + '" fill="' + COR.verdeMedio + '"/>');
    s.push('<path d="' + onda(x0, yB, L, H, 0) + '" fill="' + COR.verde + '"/>');
    s.push('<rect x="' + x0 + '" y="' + (yB - 12) + '" width="' + L + '" height="12" fill="' + COR.verdeEscuro + '"/>');
    // portas do bagageiro
    var bag0 = x0 + m.eixos[m.eixos.length - 2 >= 0 ? m.eixos.length - 2 : 0] + r * 1.5;
    var bag1 = x0 + m.eixos[m.eixos.length - 1] - r * 1.5;
    if (m.eixos.length > 1 && bag1 - bag0 > 120) {
      var nb = Math.max(2, Math.round((bag1 - bag0) / 150));
      for (var k = 1; k < nb; k++) {
        var bx = n(bag0 + ((bag1 - bag0) * k) / nb);
        s.push('<line x1="' + bx + '" y1="' + n(yB - H * 0.3) + '" x2="' + bx + '" y2="' + (yB - 14) + '" stroke="#000" stroke-opacity=".18" stroke-width="2"/>');
      }
    }
    s.push('</g>');

    // vidros
    var g = [];
    var pilar = function (x, y0, y1, w) {
      return '<rect x="' + n(x - w / 2) + '" y="' + n(y0 - 2) + '" width="' + w + '" height="' + n(y1 - y0 + 4) + '" fill="url(#' + id + '-lata)"/>';
    };
    var faixaVidro = function (yv0, yv1, xIni, xFim, janelas, topoBrisa, frenteAte) {
      var out = '<rect x="' + n(xIni) + '" y="' + n(yv0) + '" width="' + n(xFim - xIni) + '" height="' + n(yv1 - yv0) + '" rx="9" fill="url(#' + id + '-vidro)"/>';
      // para-brisa: a máscara de recuo faz a borda acompanhar a curva da frente
      var xb = xFim + 14;
      out += '<path d="M' + n(xb + 12) + ' ' + n(topoBrisa) + ' H' + (x1 + 30) + ' V' + n(frenteAte) + ' L' + n(xb) + ' ' + n(yv1) + ' V' + n(topoBrisa + 14) + ' Q' + n(xb) + ' ' + n(topoBrisa) + ' ' + n(xb + 12) + ' ' + n(topoBrisa) + ' Z" fill="url(#' + id + '-vidro)"/>';
      for (var i = 1; i < janelas; i++) out += pilar(xIni + ((xFim - xIni) * i) / janelas, yv0, yv1, 7);
      return out;
    };
    var fimLateral = x1 - m.bico - 34;
    if (!dd) {
      var v0 = yT + H * 0.13, v1 = yT + H * 0.47;
      g.push(faixaVidro(v0, v1, x0 + 24, fimLateral, m.janelas, yT + H * 0.07, yT + H * 0.58));
    } else {
      var u0 = yT + H * 0.07, u1 = yT + H * 0.33;
      g.push(faixaVidro(u0, u1, x0 + 24, fimLateral, m.janelas, yT + H * 0.05, yT + H * 0.36));
      var l0 = yT + H * 0.48, l1 = yT + H * 0.63;
      g.push(faixaVidro(l0, l1, x0 + 24, fimLateral, m.janelas, yT + H * 0.45, yT + H * 0.72));
    }
    // reflexos
    var refl = '';
    for (var q = 0; q < 4; q++) {
      var rx = x0 + 60 + q * (L / 4);
      refl += '<polygon points="' + n(rx) + ',' + (yT - 10) + ' ' + n(rx + 46) + ',' + (yT - 10) + ' ' + n(rx - 50) + ',' + n(yB) + ' ' + n(rx - 96) + ',' + n(yB) + '" fill="#fff" opacity=".08"/>';
    }
    s.push('<g class="vidros" mask="url(#' + id + '-recuo)">' + g.join('') + refl + '</g>');

    // porta dianteira
    var px0 = n(fimLateral + 22), px1 = n(fimLateral + 22 + (dd ? 58 : 52));
    if (modelo === 'micro') { px0 = n(fimLateral + 14); px1 = n(fimLateral + 56); }
    var pTopo = n(dd ? yT + H * 0.47 : yT + H * 0.13);
    s.push('<rect x="' + px0 + '" y="' + pTopo + '" width="' + n(px1 - px0) + '" height="' + n(yB - 16 - pTopo) + '" rx="6" fill="none" stroke="#0b3d21" stroke-opacity=".35" stroke-width="2"/>');

    // logo na lateral
    // no double deck, o logo vai na faixa branca entre os andares
    var wW = L * (dd ? 0.2 : 0.25);
    var wH = wW * 50 / 374;
    var wx = x0 + L * (modelo === 'micro' ? 0.22 : 0.27);
    var wy = dd ? yT + H * 0.405 - wH / 2 : yT + H * 0.47 + 14;
    s.push('<use href="#poney-wordmark" xlink:href="#poney-wordmark" x="' + n(wx) + '" y="' + n(wy) + '" width="' + n(wW) + '" height="' + n(wH) + '" fill="' + COR.verde + '"/>');
    // cavalos na traseira
    var cH = H * (dd ? 0.1 : 0.12), cW = cH * 115 / 120;
    var cy0 = dd ? yT + H * 0.355 : yT + H * 0.49;
    for (var c = 0; c < 3; c++) {
      s.push('<use href="#poney-cavalo" xlink:href="#poney-cavalo" x="' + n(x0 + 22 + c * cW * 0.92) + '" y="' + n(cy0) + '" width="' + n(cW) + '" height="' + n(cH) + '" fill="' + COR.cinzaCavalo + '"/>');
    }
    if (dd) {
      // as cinco estrelas do double deck
      var st = '';
      for (var e = 0; e < 5; e++) st += estrela(wx + wW + 34 + e * 22, yT + H * 0.405, 8);
      s.push('<g fill="' + COR.verde + '">' + st + '</g>');
    }

    // farol, lanterna e para-choque
    s.push('<path d="M' + (x1 - 3) + ' ' + n(yB - 56) + ' q-20 2 -30 12 q14 4 31 2 z" fill="#fffbe6" stroke="#0b3d21" stroke-opacity=".4" stroke-width="1.5"/>');
    s.push('<rect x="' + (x0 - 1) + '" y="' + n(yB - H * 0.42) + '" width="8" height="' + n(H * 0.18) + '" rx="3" fill="#d23b2f"/>');
    s.push('<path d="M' + n(x1 - 70) + ' ' + (yB - 12) + ' H' + (x1 - 16) + ' Q' + x1 + ' ' + (yB - 12) + ' ' + x1 + ' ' + (yB - 2) + ' V' + yB + ' H' + n(x1 - 70) + ' Z" fill="#0b3d21"/>');

    // contorno
    s.push('<path d="' + corpo + '" fill="none" stroke="#0b3d21" stroke-opacity=".4" stroke-width="2.2"/>');

    // retrovisor "chifre" (estilo Marcopolo)
    if (modelo !== 'micro') {
      var my = yT + (dd ? H * 0.06 : H * 0.1);
      s.push('<path d="M' + (x1 - 26) + ' ' + n(my) + ' C' + (x1 - 6) + ' ' + n(my - 12) + ' ' + (x1 + 22) + ' ' + n(my - 6) + ' ' + (x1 + 24) + ' ' + n(my + 22) + '" fill="none" stroke="#0b3d21" stroke-width="6" stroke-linecap="round"/>');
      s.push('<rect x="' + (x1 + 15) + '" y="' + n(my + 18) + '" width="17" height="42" rx="7" fill="' + COR.verde + '" stroke="#0b3d21" stroke-width="2"/>');
    } else {
      var my2 = yT + H * 0.2;
      s.push('<path d="M' + (x1 - 12) + ' ' + n(my2) + ' h22" stroke="#0b3d21" stroke-width="5" stroke-linecap="round"/>');
      s.push('<rect x="' + (x1 + 6) + '" y="' + n(my2 - 6) + '" width="13" height="32" rx="5" fill="' + COR.verde + '" stroke="#0b3d21" stroke-width="2"/>');
    }

    // caixas de roda (sombra) + rodas
    var arcos = '';
    m.eixos.forEach(function (e) {
      arcos += '<circle cx="' + n(x0 + e) + '" cy="' + n(cy) + '" r="' + n(r * 1.16) + '" fill="#0d1512"/>';
    });
    s.push('<g clip-path="url(#' + id + '-corpo)">' + arcos + '</g>');
    s.push('</g>'); // .carro (a carroceria balança; as rodas não)
    m.eixos.forEach(function (e) { s.push(roda(id, x0 + e, cy, r)); });

    s.push('</svg>');
    return s.join('');
  }

  var api = { MODELOS: MODELOS, desenhar: desenhar, simbolos: simbolos, logo: logo };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PoneyOnibus = api;
})(this);
