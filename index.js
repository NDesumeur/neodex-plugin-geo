// Géo : quiz des pays, des capitales et des drapeaux, par continent. Les drapeaux viennent de flagcdn.com et sont dessinés en pixels.
// Son canvas garde ses vraies couleurs (filter:none) : la teinte du thème de NeoDex fausserait les drapeaux. Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Géo</span><span class="hint">1 à 4 ou flèches et Entrée pour répondre · clic · manette</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="geCanvas" width="240" height="136" role="img" aria-label="Géo"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="geStats"></div></div>
      <div class="row"><select class="gSel" id="geMode"></select><select class="gSel" id="geZone"></select></div>
      <div class="row"><button class="btn main" id="geNew">NOUVELLE SÉRIE</button></div>
      <div class="hint">Dix questions par série, quatre réponses à chaque fois, prises sur le même continent. Drapeaux : trouve le pays. Capitales : trouve la capitale d'un pays. Pays : trouve le pays d'une capitale. Les pays ratés reviennent plus souvent.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto}
.gameBox canvas{height:min(72vh,560px);width:auto;aspect-ratio:240/136;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none;filter:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:260px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
// code ISO, pays, capitale (vide : pas de question de capitale), continent
const GE_DATA = `al|Albanie|Tirana|eu;ad|Andorre|Andorre-la-Vieille|eu;at|Autriche|Vienne|eu;by|Biélorussie|Minsk|eu;be|Belgique|Bruxelles|eu;ba|Bosnie-Herzégovine|Sarajevo|eu;bg|Bulgarie|Sofia|eu;hr|Croatie|Zagreb|eu;cy|Chypre|Nicosie|eu;cz|Tchéquie|Prague|eu;dk|Danemark|Copenhague|eu;ee|Estonie|Tallinn|eu;fi|Finlande|Helsinki|eu;fr|France|Paris|eu;de|Allemagne|Berlin|eu;gr|Grèce|Athènes|eu;hu|Hongrie|Budapest|eu;is|Islande|Reykjavik|eu;ie|Irlande|Dublin|eu;it|Italie|Rome|eu;lv|Lettonie|Riga|eu;li|Liechtenstein|Vaduz|eu;lt|Lituanie|Vilnius|eu;lu|Luxembourg|Luxembourg|eu;mt|Malte|La Valette|eu;md|Moldavie|Chisinau|eu;mc|Monaco|Monaco|eu;me|Monténégro|Podgorica|eu;nl|Pays-Bas|Amsterdam|eu;mk|Macédoine du Nord|Skopje|eu;no|Norvège|Oslo|eu;pl|Pologne|Varsovie|eu;pt|Portugal|Lisbonne|eu;ro|Roumanie|Bucarest|eu;ru|Russie|Moscou|eu;sm|Saint-Marin|Saint-Marin|eu;rs|Serbie|Belgrade|eu;sk|Slovaquie|Bratislava|eu;si|Slovénie|Ljubljana|eu;es|Espagne|Madrid|eu;se|Suède|Stockholm|eu;ch|Suisse|Berne|eu;ua|Ukraine|Kiev|eu;gb|Royaume-Uni|Londres|eu;va|Vatican|Vatican|eu
af|Afghanistan|Kaboul|as;am|Arménie|Erevan|as;az|Azerbaïdjan|Bakou|as;bh|Bahreïn|Manama|as;bd|Bangladesh|Dacca|as;bt|Bhoutan|Thimphou|as;bn|Brunei|Bandar Seri Begawan|as;kh|Cambodge|Phnom Penh|as;cn|Chine|Pékin|as;ge|Géorgie|Tbilissi|as;in|Inde|New Delhi|as;id|Indonésie|Jakarta|as;ir|Iran|Téhéran|as;iq|Irak|Bagdad|as;il|Israël||as;jp|Japon|Tokyo|as;jo|Jordanie|Amman|as;kz|Kazakhstan|Astana|as;kw|Koweït|Koweït|as;kg|Kirghizistan|Bichkek|as;la|Laos|Vientiane|as;lb|Liban|Beyrouth|as;my|Malaisie|Kuala Lumpur|as;mv|Maldives|Malé|as;mn|Mongolie|Oulan-Bator|as;mm|Birmanie|Naypyidaw|as;np|Népal|Katmandou|as;kp|Corée du Nord|Pyongyang|as;om|Oman|Mascate|as;pk|Pakistan|Islamabad|as;ph|Philippines|Manille|as;qa|Qatar|Doha|as;sa|Arabie saoudite|Riyad|as;sg|Singapour|Singapour|as;kr|Corée du Sud|Séoul|as;lk|Sri Lanka|Sri Jayawardenapura|as;sy|Syrie|Damas|as;tj|Tadjikistan|Douchanbé|as;th|Thaïlande|Bangkok|as;tl|Timor oriental|Dili|as;tr|Turquie|Ankara|as;tm|Turkménistan|Achgabat|as;ae|Émirats arabes unis|Abou Dabi|as;uz|Ouzbékistan|Tachkent|as;vn|Viêt Nam|Hanoï|as;ye|Yémen|Sanaa|as
dz|Algérie|Alger|af;ao|Angola|Luanda|af;bj|Bénin|Porto-Novo|af;bw|Botswana|Gaborone|af;bf|Burkina Faso|Ouagadougou|af;bi|Burundi|Gitega|af;cv|Cap-Vert|Praia|af;cm|Cameroun|Yaoundé|af;cf|Centrafrique|Bangui|af;td|Tchad|N'Djaména|af;km|Comores|Moroni|af;cd|RD Congo|Kinshasa|af;cg|Congo|Brazzaville|af;ci|Côte d'Ivoire|Yamoussoukro|af;dj|Djibouti|Djibouti|af;eg|Égypte|Le Caire|af;gq|Guinée équatoriale|Malabo|af;er|Érythrée|Asmara|af;sz|Eswatini|Mbabane|af;et|Éthiopie|Addis-Abeba|af;ga|Gabon|Libreville|af;gm|Gambie|Banjul|af;gh|Ghana|Accra|af;gn|Guinée|Conakry|af;gw|Guinée-Bissau|Bissau|af;ke|Kenya|Nairobi|af;ls|Lesotho|Maseru|af;lr|Liberia|Monrovia|af;ly|Libye|Tripoli|af;mg|Madagascar|Antananarivo|af;mw|Malawi|Lilongwe|af;ml|Mali|Bamako|af;mr|Mauritanie|Nouakchott|af;mu|Maurice|Port-Louis|af;ma|Maroc|Rabat|af;mz|Mozambique|Maputo|af;na|Namibie|Windhoek|af;ne|Niger|Niamey|af;ng|Nigeria|Abuja|af;rw|Rwanda|Kigali|af;st|Sao Tomé-et-Principe|Sao Tomé|af;sn|Sénégal|Dakar|af;sc|Seychelles|Victoria|af;sl|Sierra Leone|Freetown|af;so|Somalie|Mogadiscio|af;za|Afrique du Sud|Pretoria|af;ss|Soudan du Sud|Djouba|af;sd|Soudan|Khartoum|af;tz|Tanzanie|Dodoma|af;tg|Togo|Lomé|af;tn|Tunisie|Tunis|af;ug|Ouganda|Kampala|af;zm|Zambie|Lusaka|af;zw|Zimbabwe|Harare|af
ag|Antigua-et-Barbuda|Saint John's|na;bs|Bahamas|Nassau|na;bb|Barbade|Bridgetown|na;bz|Belize|Belmopan|na;ca|Canada|Ottawa|na;cr|Costa Rica|San José|na;cu|Cuba|La Havane|na;dm|Dominique|Roseau|na;do|République dominicaine|Saint-Domingue|na;sv|Salvador|San Salvador|na;gd|Grenade|Saint-Georges|na;gt|Guatemala|Guatemala|na;ht|Haïti|Port-au-Prince|na;hn|Honduras|Tegucigalpa|na;jm|Jamaïque|Kingston|na;mx|Mexique|Mexico|na;ni|Nicaragua|Managua|na;pa|Panama|Panama|na;kn|Saint-Christophe-et-Niévès|Basseterre|na;lc|Sainte-Lucie|Castries|na;vc|Saint-Vincent-et-les-Grenadines|Kingstown|na;tt|Trinité-et-Tobago|Port-d'Espagne|na;us|États-Unis|Washington|na
ar|Argentine|Buenos Aires|sa;bo|Bolivie|Sucre|sa;br|Brésil|Brasilia|sa;cl|Chili|Santiago|sa;co|Colombie|Bogota|sa;ec|Équateur|Quito|sa;gy|Guyana|Georgetown|sa;py|Paraguay|Asuncion|sa;pe|Pérou|Lima|sa;sr|Suriname|Paramaribo|sa;uy|Uruguay|Montevideo|sa;ve|Venezuela|Caracas|sa
au|Australie|Canberra|oc;fj|Fidji|Suva|oc;ki|Kiribati|Tarawa|oc;mh|Îles Marshall|Majuro|oc;fm|Micronésie|Palikir|oc;nr|Nauru||oc;nz|Nouvelle-Zélande|Wellington|oc;pw|Palaos|Ngerulmud|oc;pg|Papouasie-Nouvelle-Guinée|Port Moresby|oc;ws|Samoa|Apia|oc;sb|Îles Salomon|Honiara|oc;to|Tonga|Nukualofa|oc;tv|Tuvalu|Funafuti|oc;vu|Vanuatu|Port-Vila|oc`;
const GE_ZONES = [['', 'Monde entier'], ['eu', 'Europe'], ['af', 'Afrique'], ['as', 'Asie'], ['na', 'Amérique du Nord'], ['sa', 'Amérique du Sud'], ['oc', 'Océanie']];
const GE_MODES = [['flag', 'Drapeaux'], ['cap', 'Capitales'], ['land', 'Pays d’une capitale']];
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}



export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const sprite = (g, rows, x, y, pal) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } });
  const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
  const gameText = (g, w, lines, y0) => {  // lignes centrées en police pixel, sur une bande sombre
    g.fillStyle = 'rgba(11,3,28,.78)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
    lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
  };
  const theme = (acc, accL, accS, accD, acc2, base = ['#0c0a12', '#16121e', '#221c2c', '#2e263a', '#3a3046', '#62566e']) => {
    const [k, k2, fill, fillOn, hl, line] = base;
    return { k, k2, fill, fillOn, hl, line, acc, accL, accS, accD, rivet: '#f0f0f8', btn: hl, btnHi: line, btnLo: k2, btnHov: '#443852', btnHovHi: '#82768e', text: '#f4f0f8', muted: '#c0b8cc',
      acc2, gold: '#ffd84a', orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#100c16', bgDot: fill, bgDot2: k2, spark: accD, spark2: acc,
      tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................', '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] };
  };
  let ac = null, mute = false;
  const beep = (f, d, type = 'square', slide = 0, vol = .03, at = 0) => { if (mute) return; try { ac ??= new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + at; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d); } catch {} };
  const on = () => view.classList.contains('on');
  // la manette : croix et stick gauche = flèches, A = Entrée, B = Échap, X = Retour arrière, Y = H, Start = P ; envoyées comme des touches du clavier
  const padKeys = (map = {}) => {
    const KEY = { 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight', 0: 'Enter', 1: 'Escape', 2: 'Backspace', 3: 'h', 9: 'p', ...map };
    const held = new Map(), send = (k, type) => document.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));
    const loop = () => {
      requestAnimationFrame(loop);
      if (!on() || !navigator.getGamepads) return;
      const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
      const now = performance.now(), down = new Set();
      for (const [i, k] of Object.entries(KEY)) if (p.buttons[i]?.pressed) down.add(k);
      const [ax = 0, ay = 0] = p.axes;
      if (ax < -.5) down.add('ArrowLeft'); if (ax > .5) down.add('ArrowRight'); if (ay < -.5) down.add('ArrowUp'); if (ay > .5) down.add('ArrowDown');
      for (const k of down) { const t = held.get(k); if (t === undefined) { held.set(k, now + 260); send(k, 'keydown'); } else if (/^Arrow/.test(k) && now > t) { held.set(k, now + 110); send(k, 'keydown'); } }
      for (const k of [...held.keys()]) if (!down.has(k)) { held.delete(k); send(k, 'keyup'); }
    };
    requestAnimationFrame(loop);
  };
  pxSkin(view.querySelector('.appWrap'), { title: 'GÉO', T: theme('#5ad08a', '#d0f8e0', '#2a8a52', '#0a2014', '#5ab0ff'),
    emblem: ['....kkkk....', '..kkbbnnkk..', '.kbbbnnnbbk.', '.kbnnnnbbbk.', 'kbbnnnbbbbbk', 'kbbbnnbbnnbk', 'kbbbbbbnnnbk', 'kbbbbbbbnnbk', '.kbbbbbbnbk.', '.kbbbbbbbbk.', '..kkbbbbkk..', '....kkkk....'],
    icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const W = 240, H = 136, N = 10;
  const C = GE_DATA.split(/[;\n]/).map(s => { const [iso, name, cap, zone] = s.split('|'); return { iso, name, cap, zone }; });
  const save = { mode: 'flag', zone: '', best: {}, right: 0, series: 0, miss: {}, ...(await doc('records')) };
  const keep = () => folder.write('records', save).catch(() => {});
  const fill = (sel, list) => sel.replaceChildren(...list.map(([v, n]) => { const o = el('option', '', n); o.value = v; return o; }));
  fill($('geMode'), GE_MODES); fill($('geZone'), GE_ZONES); $('geMode').value = save.mode; $('geZone').value = save.zone;
  const flags = new Map();  // les images des drapeaux, chargées à la demande (et la suivante à l'avance)
  const flag = iso => { let f = flags.get(iso); if (!f) { f = new Image(); f.crossOrigin = 'anonymous'; f.src = 'https://flagcdn.com/w80/' + iso + '.png'; f.onerror = () => { f.bad = true; }; flags.set(iso, f); } return f; };
  const pick = (list, n, not) => { const out = []; const pool = list.filter(x => !not.includes(x)); while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]); return out; };
  // la série : les pays ratés avant ont plus de chances de revenir
  function series() {
    const mode = save.mode, pool = C.filter(c => (!save.zone || c.zone === save.zone) && (mode === 'flag' || c.cap)), qs = [], used = new Set();
    while (qs.length < Math.min(N, pool.length)) {
      const w = pool.map(c => used.has(c) ? 0 : 1 + 3 * (save.miss[c.iso] || 0)), tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot, c = pool[0];
      for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0 && w[i]) { c = pool[i]; break; } }
      if (used.has(c)) continue; used.add(c);
      const near = pool.filter(x => x.zone === c.zone), wrong = pick(near.length >= 4 ? near : pool, 3, [c]);
      qs.push({ c, ch: [c, ...wrong].sort(() => Math.random() - .5) });
    }
    return qs;
  }
  let g = null, st = null, tick = 0;
  const start = () => { st = { mode: save.mode, qs: series(), i: 0, ok: 0, sel: 0, fx: null, done: false, dead: 0 }; for (const q of st.qs.slice(0, 3)) if (st.mode === 'flag') flag(q.c.iso); };
  const label = (q, x) => st.mode === 'cap' ? x.cap : x.name;
  function answer(k) {
    if (!st || st.done || st.fx) return; const q = st.qs[st.i], good = q.ch[k] === q.c;
    st.fx = { k, good, t: good ? 40 : 90 };
    if (good) { st.ok++; save.right++; if (save.miss[q.c.iso]) save.miss[q.c.iso]--; beep(880, .08); beep(1320, .1, 'square', 0, .03, .08); }
    else { save.miss[q.c.iso] = Math.min(3, (save.miss[q.c.iso] || 0) + 1); beep(180, .25, 'sawtooth', 90); }
    if (st.mode === 'flag' && st.qs[st.i + 2]) flag(st.qs[st.i + 2].c.iso);
  }
  function next() {
    st.fx = null; st.sel = 0;
    if (++st.i >= st.qs.length) { st.done = true; save.series++; const k = st.mode + '|' + (save.zone || 'monde'); st.newBest = st.ok > (save.best[k] || 0); if (st.newBest) save.best[k] = st.ok; keep(); info(); $('geCanvas').setAttribute('aria-label', 'Série finie : ' + st.ok + ' sur ' + st.qs.length + '.'); }
  }
  const box = i => [8 + (i % 2) * 116, 88 + Math.floor(i / 2) * 22, 108, 18];
  function draw() {
    g.imageSmoothingEnabled = false; tick++;
    px(g, '#0c1a14', 0, 0, W, H); for (let y = 16; y < H; y += 8) for (let x = (y / 8) % 2 * 4; x < W; x += 8) px(g, '#10221a', x, y, 1, 1);
    px(g, '#06100a', 0, 0, W, 14);
    pxFont(g, GE_MODES.find(m => m[0] === st.mode)[1] + ' · ' + GE_ZONES.find(z => z[0] === save.zone)[1], 4, 11, '#ffffff');
    for (let i = 0; i < st.qs.length; i++) px(g, i < st.i ? '#5ad08a' : '#20382a', W - 4 - (st.qs.length - i) * 6, 5, 4, 4);
    if (st.fx && --st.fx.t <= 0) next();
    if (!st.done) {
      const q = st.qs[st.i];
      if (st.mode === 'flag') { const f = flag(q.c.iso), fx = W / 2 - 32, fy = 22;
        px(g, '#06100a', fx - 2, fy - 2, 68, 46);
        if (f.complete && f.naturalWidth) { g.imageSmoothingEnabled = true; g.drawImage(f, fx, fy, 64, 42); g.imageSmoothingEnabled = false; }  // réduit en 64×42 : il devient un drapeau en pixels
        else pxFont(g, f.bad ? 'Drapeau indisponible (hors ligne ?)' : 'Chargement…', W / 2, 46, '#8ab0a0', 8, 'center');
        pxFont(g, 'Quel pays ?', W / 2, 80, '#d0f8e0', 8, 'center');
      } else {
        pxFont(g, st.mode === 'cap' ? 'Capitale de' : 'Ce pays a pour capitale', W / 2, 34, '#8ab0a0', 8, 'center');
        const t = st.mode === 'cap' ? q.c.name : q.c.cap; pxFont(g, t, W / 2, 60, '#ffffff', t.length > 14 ? 8 : 16, 'center');
      }
      q.ch.forEach((x, i) => { const [bx, by, bw, bh] = box(i), s = i === st.sel, r = st.fx && x === q.c, wr = st.fx && !st.fx.good && i === st.fx.k;
        const t = label(q, x), sz = t.length > 17 ? 1 : 1;
        px(g, '#06100a', bx, by, bw, bh); px(g, r ? '#3aa860' : wr ? '#c0302a' : s ? '#5ad08a' : '#20382a', bx + 1, by + 1, bw - 2, bh - 2); px(g, 'rgba(0,0,0,.25)', bx + 1, by + bh - 3, bw - 2, 2);
        const tt = t.length > 18 ? t.slice(0, 17) + '…' : t; PXK.fill(g, tt, bx + bw / 2, by + 13, s && !st.fx ? '#06100a' : '#ffffff', sz, 'center'); PXK.fill(g, String(i + 1), bx + 5, by + 13, s && !st.fx ? '#2a5a3a' : '#5a8a6a', 1); });
    } else gameText(g, W, [['SÉRIE FINIE', '#5ad08a', 12], [st.ok + ' sur ' + st.qs.length + (st.newBest ? ' · record !' : ''), '#ffd84a', 12], ['Entrée : une autre série', '#b8b0c8']], 54);
    if (tick % 15 === 0) { const q = st.qs[st.i]; g.canvas.setAttribute('aria-label', st.done ? 'Série finie : ' + st.ok + ' sur ' + st.qs.length + '.' : 'Question ' + (st.i + 1) + ' : ' + (st.mode === 'flag' ? 'drapeau à reconnaître' : st.mode === 'cap' ? 'capitale de ' + q.c.name : 'pays dont la capitale est ' + q.c.cap) + '. Réponses : ' + q.ch.map((x, i) => (i + 1) + ' ' + label(q, x)).join(', ') + '.'); }
  }
  function info() {
    const k = save.mode + '|' + (save.zone || 'monde');
    $('geStats').replaceChildren(...[['Record (ce choix)', (save.best[k] || 0) + ' / 10'], ['Bonnes réponses', save.right], ['Séries', save.series], ['Pays à revoir', Object.values(save.miss).filter(Boolean).length]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
  }
  const restart = () => { save.mode = $('geMode').value; save.zone = $('geZone').value; keep(); info(); start(); };
  $('geMode').onchange = restart; $('geZone').onchange = restart;
  $('geNew').onclick = () => { restart(); $('geNew').blur(); };
  document.addEventListener('keydown', e => {
    if (!on() || !st || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key;
    if (st.done) { if (k === 'Enter' || k === ' ') { e.preventDefault(); start(); } return; }
    if (/^[1-4]$/.test(k)) { st.sel = +k - 1; answer(st.sel); return; }
    const mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -2, ArrowDown: 2 }[k];
    if (mv) { e.preventDefault(); st.sel = (st.sel + mv + 4) % 4; return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); if (st.fx) next(); else answer(st.sel); }
  });
  { const cv = $('geCanvas'), at = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * W, (e.clientY - b.top) / b.height * H]; };
    const hit = ([x, y]) => [0, 1, 2, 3].find(i => { const [bx, by, bw, bh] = box(i); return x >= bx && x < bx + bw && y >= by && y < by + bh; });
    cv.onpointermove = e => { if (st && !st.done && !st.fx) { const i = hit(at(e)); if (i !== undefined) st.sel = i; } };
    cv.onpointerdown = e => { e.preventDefault(); if (!st) return; if (st.done) { start(); return; } if (st.fx) { next(); return; } const i = hit(at(e)); if (i !== undefined) answer(i); };
  }
  padKeys();
  {  // vérification : pas deux fois le même code ni le même nom, chaque série a 10 questions à 4 réponses différentes dont la bonne, dans chaque mode et chaque continent
    const bad = [], keepS = JSON.stringify(save);
    if (new Set(C.map(c => c.iso)).size !== C.length || new Set(C.map(c => c.name)).size !== C.length) bad.push('doublon');
    if (C.some(c => !/^[a-z]{2}$/.test(c.iso) || !GE_ZONES.some(z => z[0] === c.zone))) bad.push('code ou continent');
    for (const [m] of GE_MODES) for (const [z] of GE_ZONES) { save.mode = m; save.zone = z; const qs = series();
      if (qs.length !== N) bad.push(m + ' ' + z + ' : ' + qs.length + ' questions');
      for (const q of qs) if (new Set(q.ch).size !== 4 || !q.ch.includes(q.c) || (m !== 'flag' && q.ch.some(x => !x.cap))) { bad.push(m + ' ' + z + ' : réponses ' + q.c.name); break; } }
    Object.keys(save).forEach(k => delete save[k]); Object.assign(save, JSON.parse(keepS));
    console.assert(!bad.length, 'geo', bad); view.dataset.selfcheck = bad.join(' | ') || 'ok';
  }
  start(); info();
  let raf = 0; const frame = () => { if (!on()) { raf = 0; return; } raf = requestAnimationFrame(frame); draw(); };
  ctx.onOpen(() => { g ??= $('geCanvas').getContext('2d'); if (!raf) raf = requestAnimationFrame(frame); });
  $('geCanvas').__q = () => st.done ? -1 : st.qs[st.i].ch.indexOf(st.qs[st.i].c);
}
