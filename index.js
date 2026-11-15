// Géo : quiz des pays, des capitales et des drapeaux, par continent. Les drapeaux viennent de flagcdn.com et sont dessinés en pixels.
// Son canvas garde ses vraies couleurs (filter:none) : la teinte du thème de NeoDex fausserait les drapeaux. Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Géo</span><span class="hint">1 à 4 ou flèches et Entrée pour répondre · clic · manette</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="geCanvas" width="240" height="136" role="img" aria-label="Géo"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="geStats"></div></div>
      <div class="row"><select class="gSel" id="geMode"></select><select class="gSel" id="geZone"></select></div>
      <div class="row"><button class="btn main" id="geNew">NOUVELLE SÉRIE</button><button class="btn" id="geFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Dix questions par série, quatre réponses à chaque fois, prises sur le même continent. Drapeaux : trouve le pays. Capitales : trouve la capitale d'un pays. Pays : trouve le pays d'une capitale. Carte : clique sur le pays demandé (flèches et Entrée au clavier ou à la manette). Les pays ratés reviennent plus souvent, et la fin de série montre tes erreurs avec la bonne réponse.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto}
.gameBox canvas{width:min(calc(100vw - 140px),calc((100vh - 190px) * 240 / 136),1400px);height:auto;aspect-ratio:240/136;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none;filter:none}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 240 / 136))}
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
const GE_MODES = [['flag', 'Drapeaux'], ['cap', 'Capitales'], ['land', 'Pays d’une capitale'], ['map', 'Carte']];
// la carte du monde, dessinée à la main : les côtes en longitude,latitude (« ! » : terre sans pays du quiz, « ~ » : mer intérieure)
const GE_LAND = [
  // Amérique du Nord, baie d'Hudson comprise
  '-168,66 -162,70 -156,71.3 -140,69.6 -128,70 -115,68.5 -95,68 -90,69 -82,69 -80,63 -94,59 -92,57 -82,55 -79,51 -77,56 -78,62 -72,62 -65,60 -61,56 -56,52 -60,47 -66,45 -70,43 -70,41.5 -74,40.5 -76,37 -75.5,35 -81,31 -80,27 -80.5,25 -82,26.5 -83,29.5 -89,30 -94,29.5 -97,27.5 -97.5,22 -95,18.5 -91,18.5 -90.5,21 -87,21.5 -88,16 -83.5,15 -83.5,11 -81.5,9 -79,9.5 -77.5,8.5 -78,7 -80,7.5 -83,8.5 -86,11 -88,13.3 -92,14.5 -95,16 -98,16.2 -102,17.9 -105.5,20 -105.5,23 -109,25.5 -112.5,29 -114.8,31.5 -112.7,28.5 -110,23 -112,24.8 -114,28 -115.5,30.4 -117,32.5 -118.5,34 -121,35 -122.5,37.5 -124,40.5 -124,46 -124.5,48.3 -123,49 -127,51 -130,54.5 -134,57.5 -137,59 -142,60 -146,60.8 -150,59.5 -154,57.5 -158,56.5 -162,55 -158,58.5 -162,59.8 -165,62.5 -164.5,64.5 -168,65.6',
  '!-73,78 -60,82 -30,83.5 -18,81 -20,75 -22,70 -32,68 -40,65 -43,60 -48,61 -52,65 -54,69 -58,75.5 -68,76.5',  // Groenland
  '-80,73 -72,71 -62,67 -65,63 -72,64 -78,64.5 -75,68 -85,70 -88,73', '-90,77 -75,79 -62,82 -85,83 -95,80', '-118,71 -105,73.5 -100,69 -115,69',
  '-85,21.8 -82,23.2 -77,22.3 -74.2,20.2 -77.5,19.8 -80,21.6', '-74.5,18.5 -72.5,19.9 -68.5,18.6 -70,18.2 -72,18', '-78.3,18.4 -76.2,18 -77,17.8',
  // Amérique du Sud et Terre de Feu
  '-77.5,8.5 -76,9.5 -72,12 -71,11 -68,10.5 -64,10.5 -61,10.5 -60,8.5 -57,6 -52,5 -50,1.5 -50,0 -48,-1 -44,-2.5 -40,-2.8 -35,-5.5 -35,-9 -38.5,-13 -39,-17.5 -40.5,-21 -43,-23 -48,-25.5 -48.5,-28 -51,-31 -53,-34 -55,-35 -57.5,-34.5 -57,-36.5 -58,-38.5 -62,-39 -65,-41 -64,-42.5 -65.5,-45 -67.5,-46.5 -66,-48 -68.5,-50.5 -68.5,-52.5 -71,-54 -74.5,-52 -75.5,-47 -74,-44 -73.5,-39 -72,-34 -71.5,-30 -70.3,-24 -70.3,-18.5 -72,-17 -76,-14 -78.5,-9 -81.2,-5.5 -80,-2.5 -80.5,0 -79,2 -77.5,4 -77.5,7',
  '-68.5,-52.7 -65,-55 -71,-55 -70,-53',
  // Europe et Asie
  '-9,43 -8,43.7 -2,43.4 -1.5,46 -2.5,47.3 -4.7,48.4 -1.5,48.7 1.5,50 2.5,51 4,51.8 5,53.4 8.5,53.6 8.6,55.5 8.2,57 10.5,57.7 10.5,56 12.5,56 12.3,54.5 14,54 18.5,54.8 21,55.2 21,57 22,57.6 23.5,57 24.3,58.3 23.5,59.2 28,59.5 30,60 29,61 22,60.3 21.5,61.5 21.2,63 25.3,65 22,65.8 21.3,64.6 19,63.5 17.5,62 17.2,60.7 19,59.8 17.8,59 16.5,57 14.5,56 13,55.4 12.7,56.2 11.9,57.7 11,59 9.5,59 8,58 6,58.1 5,60 5,62 7,63 10,64 12.5,66 14,67.5 16,68.7 19,70 24,71 28,71 31,70 33,69.3 40,67.8 41,66.5 37,66 34.8,64.5 37,63.8 40.4,64.5 44,66 44,68.5 46,68 53.5,68.8 58,68.7 60,69.8 65,69.5 68,71.5 69,73 72.5,72.8 73,71 75,72.5 80,72.5 83,70.5 87,74 98,76 104,77.7 112,75 113,73.5 127,73.5 131,71 140,72.5 150,71.5 160,70 170,70 180,68.8 190,66 186,65 180,65 178,64.5 179,62.5 174,61.8 170,60 163,59.8 163,57.5 162,54.8 160,53 156.5,51 156,57 155,59 152,59.2 149,59.4 143,59.3 137,54 140.5,52 141,48.5 138,46 135,43.5 132,43 130,42.5 129.5,41 128,40 127.5,39.5 129,37 129,35.2 126.5,34.5 126.3,37 125,37.7 125,39.6 121.5,39 121.5,40.8 118,39.2 119.5,37.5 122.5,37.3 120.5,36 119,35 120.8,32.5 122,31 121.5,28.5 119.5,25.8 116.5,23 113.5,22.3 110.5,21.2 110,20.3 108.5,21.6 106.7,20.7 105.6,18.8 108,16 109.2,12 107,10.4 105,8.6 104.8,10.3 103.5,10.6 102.6,12.2 100.9,13.4 100,12 99.2,9.5 100.4,7.3 101.5,6.8 103.3,5.2 103.5,2.8 104.2,1.4 103.4,1.3 101,2.9 100.4,5.3 98.5,8.1 98.6,10 97.8,16.4 94.5,16 94.4,19 92.3,20.6 91,22.5 88.7,22 87,21.5 86.5,20 84.5,18.5 82.3,16.6 80.3,15.5 79.8,10.3 78.2,8.9 77.5,8.1 76.5,8.9 75.4,11.8 74.4,14.5 73,19 72.7,21.5 70.5,20.8 69,22.4 70,22.9 68.4,23.6 66.7,25.4 61.6,25.2 57.3,25.8 56.4,27.2 54.7,26.5 51.5,27.9 50.1,30.1 48.6,29.9 47.8,28.8 48.6,28 50.2,26.3 50.8,24.8 51.2,26.1 51.6,25.2 51.6,24.3 54,24.1 56,26 56.3,24.9 57.4,23.9 59.8,22.5 58.5,20.4 57.7,19.5 55.3,17.6 52.2,15.6 49,14 45,12.8 43.5,12.7 42.7,15.7 42.8,16.4 40.5,19.8 39,21.8 38.5,23.6 36.6,25.8 35,28.1 34.9,29.5 34.3,27.9 32.6,29.9 32.3,31.3 34.2,31.3 35.5,33.9 36,35.8 36,36.8 34.6,36.8 32.5,36.1 30.5,36.5 28.2,36.7 27.3,37.4 26.3,38.3 26.2,39.4 26.6,40.3 26,40.8 24,40.8 23,40.3 22.6,40.2 23.3,39.2 22.6,38.2 24,38.2 23,37.4 23,36.5 22.4,36.4 21.7,36.9 21.1,37.8 21.3,38.4 20.2,39.6 19.4,40.4 19.4,41.8 18.5,42.5 16,43.5 15,44.6 14,45 13.6,45.7 12.3,45.3 12.3,44.6 13.6,43.5 14.7,42 16.1,41.5 18.5,40.2 18.4,39.8 17,39.4 17.1,38.9 16.6,38.4 15.7,37.9 15.7,38.2 16.2,38.9 15.7,40 14.9,40.2 14,41 12.4,41.6 11.2,42.4 10.5,42.9 10.2,43.9 8.8,44.4 7.5,43.8 6.5,43.1 4.5,43.4 3.1,43.1 3.2,41.9 0.8,41 -0.3,39.5 0.2,38.7 -0.7,37.6 -2.1,36.7 -4.4,36.7 -5.6,36 -6.4,36.8 -7.4,37.2 -8.9,37 -8.9,38.5 -9.5,38.8 -8.8,40.7 -8.8,42 -9.3,42.9',
  '~27.6,42.2 28,43.3 28.6,44.3 29.7,45.3 30.7,46.5 31.7,46.5 33.5,46 32.5,45.4 33.5,44.5 35.5,45 36.5,45.3 37.5,46.9 39.2,47 38.3,46 37.5,44.7 39,43.9 41.5,42 40,41 37,41.1 35.2,42 33,42 31.2,41.1 29,41.2',  // mer Noire
  '~47,44.8 47.5,43.1 48.6,41.8 49.6,40.3 49.1,38.5 48.9,37.6 50.3,37.1 51.8,36.6 54,36.9 53.9,38.9 53.1,39.3 53.3,40.5 52.8,41.2 54.2,42.4 52.5,42.8 51.3,43.2 50.6,44.4 51.4,45.3 53.2,46.4 51.2,47 49.2,46.4 48.6,45.8',  // mer Caspienne
  '-5.7,50 1.4,51.2 1.7,52.7 0.2,53.4 -1.5,55 -2,55.9 -1.8,57.6 -3.3,58.6 -5,58.6 -6.2,57.3 -5.6,55.7 -4.9,54.8 -3.2,54.6 -3,53.3 -4.7,52.8 -4.7,51.6 -3.3,51.4',
  '-6,52.1 -6.1,54 -5.7,54.6 -7.3,55.3 -8.5,54.4 -10,54.2 -9.9,51.8 -8.3,51.7', '-22.5,64 -24,65.5 -22,66.4 -16,66.5 -13.6,65.2 -15,64.3 -18.7,63.4',
  '12.4,38 15.6,38.3 15.1,36.7', '8.4,41 9.8,41 9.6,39.1 8.4,39', '9.4,43 9.6,42.2 9.2,41.4 8.6,41.9', '23.5,35.6 26.3,35.3 24.5,34.9', '32.3,35 34.6,35.6 33.9,34.6 32.4,34.7',
  '52,71.5 57,70.6 60,74 68,76.8 62,76 55,73', '!11,78.5 17,80 27,80 21,77.5 15,76.8',
  // Japon, îles d'Asie, Insulinde
  '130.9,34 132.5,35.5 136,36 137.3,37.5 139.5,38.5 140,40.7 141.5,41.3 142,39.5 141,37.5 140.7,35.8 139.8,35 138.8,34.6 136.8,34.3 135,33.5 132,33.8', '129.7,33.3 131.2,33.9 131.6,31.5 130.2,31', '140,41.5 141.3,45.4 145.5,43.3 143.3,42 141,42.4',
  '142,46 143.5,46.8 143,49.3 142.7,54.3 142.2,51.5 141.8,48', '120.1,23 121,25.2 121.9,24.9 120.8,21.9', '108.6,19.3 110,20.1 111,19.6 109.5,18.2', '79.8,6.2 79.9,9.7 81.9,7.4 81.3,6.2',
  '120,16 120.6,18.5 122.2,18.5 122,16 124,14 121,13.8', '122,7 125.5,9.8 126.5,7.2 125.4,5.6 123.5,7.5', '122,10 124.5,12.3 125.5,11 123.5,9.5',
  '109,1.8 111.5,2.5 113,3.2 115.4,5.3 117,7 119,5 118,3.5 118,1 116.5,-1.5 116,-3.8 114.5,-4 111.7,-3.4 110.2,-2.9 109,-0.5',
  '95.2,5.6 97.5,5.3 100.5,2 103.7,-1 106,-3.1 105.8,-5.8 104.5,-5.9 101.5,-3 98.6,1.6 96,3.7', '105.2,-6.8 106.5,-6 110,-6.9 112.7,-6.9 114.5,-7.8 110.5,-8.2 106.5,-7.4',
  '119.3,-5.5 118.8,-2.8 119.8,0 120.5,0.9 124.9,1.5 122,0.4 121,-1 123.3,-1 121.6,-1.9 122.8,-4.8 121.3,-4.6 120.4,-2.9 120.4,-5.6', '124,-10.2 125.2,-8.6 127.3,-8.4 124.5,-9.9', '116,-8.2 119,-8.3 122.5,-8.2 122.5,-8.9 119,-8.9 116,-8.9',
  '131,-1.5 134,-0.9 135.5,-3.4 138,-1.7 141,-2.6 144.5,-3.9 146,-5.5 147.5,-6 147,-6.8 148.2,-8.1 150.7,-10.5 147.5,-10.1 146,-8 143.3,-9 143,-9.3 141,-9.1 139,-8.1 137.7,-5.3 135,-4.4 133.3,-4 132,-2.9 132.6,-2.1',
  '148.3,-5.5 152,-4 151,-6', '156,-7 160,-8.5 162,-10.5 159,-9.5',
  // Afrique et Madagascar
  '-5.9,35.8 -2,35.1 1,36.5 3,36.8 8.6,36.9 10.2,37.2 11,36.9 10.6,35.7 11.1,35.2 10.1,34.3 11.3,33.1 13.2,32.9 15.3,32.3 15.7,31.4 19,30.3 20.1,31 20,32.1 21.5,32.8 23,32.6 25,31.7 29,30.9 31,31.6 32.3,31.3 32.4,29.6 33.5,27.2 35,24 37.2,21 37.4,18.5 38.5,17.9 39.7,15.1 41.2,14.5 43.3,12.5 43.1,11.5 44,10.4 46,10.7 49,11.3 51.1,11.9 51.1,10.4 50.5,9 48.6,5.3 46.6,2.8 43.2,-0.3 41.6,-1.7 40.2,-2.8 39.2,-4.7 38.8,-6.5 39.3,-8.2 40.4,-10.5 40.6,-14.3 40.1,-16.4 37.4,-17.6 35.3,-20.5 35.5,-24 32.9,-26 32.6,-28.6 30.9,-30.3 28,-33 25.7,-34 22.6,-33.9 20,-34.8 18.4,-34.1 17.8,-32.3 16.4,-28.6 15.2,-26.9 14.4,-22.6 11.8,-17.8 11.6,-16.2 12.2,-14.3 13.6,-12 13.2,-9 12.3,-6.1 11.9,-5 10.1,-2.9 9.3,-0.4 9.6,1.1 9.8,3.1 8.5,4.5 6.8,4.3 5.4,5.4 4.3,6.3 1.9,6.1 -1,5 -2.9,5 -4.6,5.2 -7.5,4.4 -9.1,5.4 -11.4,6.9 -13.2,8.7 -14.6,10.2 -16.7,12.4 -17.2,14.7 -16.5,16 -16.3,19.1 -16.9,21.3 -15.9,23.7 -13.6,27.6 -11.3,28.3 -9.8,29.9 -9.7,32.1 -6.9,34.1 -6.2,35.4',
  '49.3,-12 50.5,-15.5 49.4,-17.8 47.4,-24.9 45.2,-25.5 43.6,-23 44.3,-20 44.4,-16.2 47,-15.6 48.7,-13.4',
  // Australie, Tasmanie, Nouvelle-Zélande
  '113.4,-22 114.2,-26.3 115,-29.5 115.6,-33.5 115.1,-34.3 118,-35 123.5,-33.9 126,-32.3 131,-31.5 134.3,-32.7 135.6,-34.8 137.8,-33.5 137.6,-35.6 139.6,-36.4 140.6,-38 144,-38.6 146.3,-39.1 150,-37.5 150.1,-36 151.3,-33.8 153.1,-30.4 153.1,-27.2 150.9,-22.6 149.5,-21.5 146.3,-19 145.4,-15 143.6,-14 142.5,-10.7 141.6,-12.9 141.5,-15.8 140.6,-17.5 139.3,-17.4 136,-15.5 135.7,-12.3 136.9,-12.3 134.4,-11.9 132.6,-11.5 131,-12.2 129.4,-14.9 128,-14.9 126.1,-14.3 124.4,-16.3 123.5,-17.4 122.2,-17.9 121,-19.6 118.8,-20.3 116.7,-20.6 114.6,-21.8',
  '144.7,-40.7 148.3,-40.9 148,-43.2 146.5,-43.6 145.2,-42.3', '172.7,-34.4 174.4,-35.8 175.9,-37.4 178.5,-37.7 177,-39.3 175.2,-41.6 174.6,-39.9 173.8,-39.2 174.6,-37.3', '172.6,-40.5 174.3,-41.7 173,-43.8 171.2,-44.5 169,-46.6 166.5,-46 168.3,-44 171,-42.3'];
// où se trouve chaque pays sur la carte : un ou plusieurs points (les grands pays en ont plusieurs) ; chaque terre va au point le plus proche.
// Les micro-États (Andorre, Monaco, Saint-Marin, Vatican, Liechtenstein, Luxembourg) n'y sont pas : trop petits pour être cliqués.
const GE_PIN = `al:20,41.1;at:14.5,47.6;by:28,53.5;be:4.6,50.6;ba:17.8,44.2;bg:25.3,42.7;hr:16,45.6 15.8,44;cy:33.2,35;cz:15.3,49.8;dk:9.3,56 12,55.5;ee:25.8,58.7;fi:26,62 26,66.5;fr:2.4,46.6 0,47.8 0.5,44.3 5.5,44;de:10.4,51.2 11,49 9,53;gr:22,39.5 22.3,37.5 24.5,35.2;hu:19.4,47.2;is:-18.6,64.9;ie:-8,53.2;it:12.5,42.8 10.5,45.2 16,40 14,37.5 9,40;lv:24.8,56.9;lt:23.9,55.3;mt:14.4,35.9;md:28.5,47.2;me:19.3,42.8;nl:5.5,52.2;mk:21.7,41.6;no:8.5,61 14,66 22,69.8;pl:19.3,52;pt:-8,39.6;ro:25,45.9;ru:38,55 34,58 45,61 60,62 80,63 100,64 120,63 140,64 160,66 135,48 50,52 21,54.7 58,73 180,67;rs:20.8,44;sk:19.6,48.7;si:14.9,46.1;es:-4.5,40.5 -1.5,41.5 -5.5,37.5 -6.5,42.6;se:15,59.5 17,64 20,67;ch:8.2,46.8;ua:31.5,49 25.5,49 34,45.3;gb:-2,53 -4,56.8
af:66,33.9;am:45,40.2;az:47.7,40.3;bh:50.55,26.05;bd:90.3,23.7;bt:90.4,27.4;bn:114.7,4.5;kh:104.9,12.6;cn:104,35 88,40 88,31 113,28 116,40 126,45 112,42 110,19.2 100,24;ge:43.4,42.3;in:79,22 77,13 76,29 88,25 93,26;id:102,-1 110,-7.5 114,-1 120.5,-2 136,-3.5 139,-5 121,-8.7;ir:54,32.5 59,35 49,34;iq:43.7,33.2;il:34.9,31.2;jp:138.5,36.5 131,32.5 142.8,43.3;jo:36.2,30.9;kz:67,48 76,47 55,48;kw:47.6,29.3;kg:74.8,41.3;la:102.5,19.5 105.5,16;lb:35.8,33.9;my:102,4 113.5,2.5 117,5.2;mv:73.4,3.2;mn:103,46.8 112,47;mm:96,21.5 98.5,13;np:84,28.3;kp:127,40;om:57,21;pk:69.5,29.5 72,33.5;ph:121,16 124,11 125,7.5;qa:51.2,25.3;sa:45,24 40,27 49,20;sg:103.8,1.35;kr:127.8,36.3;lk:80.7,7.8;sy:38.5,35;tj:71,38.8;th:101,15.5 100,8.5;tl:125.8,-8.8;tr:35,39 28,40 41,39;tm:59.5,39;ae:54.5,24;uz:64,41.5;vn:106,21 108,14 105.8,10.5;ye:47.5,15.5 44,14.5
dz:3,28 3,34.5;ao:17.5,-12.3;bj:2.3,9.3;bw:24,-22.3;bf:-1.6,12.3;bi:29.9,-3.4;cv:-23.6,15.1;cm:12.4,6 10.5,4;cf:20.9,6.6;td:18.7,15.5;km:43.9,-11.9;cd:23.6,-2.9 25,-9 21,1.5;cg:15.2,-0.7;ci:-5.5,7.6;dj:42.6,11.8;eg:30.8,26.8;gq:10.3,1.6;er:39,15.4;sz:31.5,-26.5;et:39.6,8.6;ga:11.6,-0.8;gm:-15.4,13.45;gh:-1,7.9;gn:-10.9,10.4;gw:-15,12;ke:37.9,0.2;ls:28.2,-29.6;lr:-9.4,6.4;ly:17.2,26.3;mg:46.8,-19;mw:34.3,-13.2;ml:-2,17.5 -7,13;mr:-10.9,20.3;mu:57.55,-20.25;ma:-6.5,32 -12,26;mz:35.5,-18.7 38,-13.5;na:17.5,-22.5;ne:9.4,17;ng:8.1,9.5;rw:29.9,-2;st:6.6,0.3;sn:-14.5,14.5;sc:55.5,-4.6;sl:-11.8,8.5;so:46,6 49,10 43,2.5;za:24,-30 29,-25;ss:30,7.5;sd:30,15.5;tz:35,-6.4;tg:1,8.6;tn:9.5,34;ug:32.4,1.3;zm:27.8,-13.5;zw:29.9,-19
ag:-61.8,17.1;bs:-77.5,24.5;bb:-59.55,13.2;bz:-88.7,17.2;ca:-100,56 -115,60 -75,50 -125,54 -90,68 -110,71 -70,58 -65,47 -78,70 -82,80 -133,65;cr:-84.2,10;cu:-79,21.8 -76,20.3;dm:-61.35,15.4;do:-70.3,18.8;sv:-88.9,13.75;gd:-61.7,12.1;gt:-90.3,15.5;ht:-72.7,18.9;hn:-86.6,14.8;jm:-77.3,18.1;mx:-102,23.5 -99,19 -112,29.5 -89,20 -94,17 -112,25;ni:-85,12.9;pa:-80.2,8.5;kn:-62.75,17.3;lc:-60.97,13.9;vc:-61.2,13.25;tt:-61.3,10.45;us:-98,39 -112,40 -120,38 -85,37 -77,41 -82,30 -152,64 -160,60 -120,46 -95,31 -70,44
ar:-64,-34 -66,-26 -68,-46;bo:-64.5,-17;br:-52,-10 -63,-4 -42,-8 -48,-20 -52,-28 -55,-15 -50,1;cl:-71,-33 -69.5,-23 -72.5,-45 -71,-52;co:-73.5,4;ec:-78.4,-1.5;gy:-58.9,5;py:-58,-23.5;pe:-75,-10 -76,-4 -71,-14;sr:-55.9,4.1;uy:-56,-32.8;ve:-66,7.5
au:134,-25 122,-26 146,-22 145,-36 131,-15 147,-42;fj:178,-17.8;ki:173,1.4;mh:171.2,7.1;fm:158.2,6.9;nr:166.93,-0.52;nz:175.5,-39 171,-43.5 168.5,-45.5;pw:134.6,7.5;pg:143.5,-5 146.5,-7 151,-5;ws:-172,-13.8;sb:160,-9.4;to:-175.2,-21.2;tv:179.2,-8.5;vu:167.7,-16`;
// le cadre de la carte pour chaque continent : longitudes et latitudes à montrer
const GE_VIEW = { '': [-170, 190, -56, 82], eu: [-25, 45, 34, 71], af: [-20, 55, -36, 38], as: [25, 150, -11, 56], na: [-170, -55, 6, 72], sa: [-85, -32, -56, 13], oc: [110, 190, -48, 10] };
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
  const MY = 14, MH = 110, IDX = new Map(C.map((c, i) => [c, i]));
  const pins = new Map(GE_PIN.split(/[;\n]/).map(t => { const [iso, p] = t.split(':'); return [iso, p.split(' ').map(q => q.split(',').map(Number))]; }));
  const TONES = [['#5a9a4a', '#3a6a30'], ['#7fae5a', '#4f7a36'], ['#a0a85a', '#6a7034'], ['#6e9c3e', '#466a26'], ['#8ab86a', '#557a3e'], ['#b0a060', '#78683a']];
  const maps = {};
  function geoMap(zone) {
    if (maps[zone]) return maps[zone];
    const [l0, l1, b0, b1] = GE_VIEW[zone], cos = zone ? Math.cos((b0 + b1) / 2 * Math.PI / 180) : 1;
    const sc = Math.max((b1 - b0) / MH, (l1 - l0) * cos / W), lc = (l0 + l1) / 2, bc = (b0 + b1) / 2;
    const P = (lon, lat) => [W / 2 + ((lon < -169 ? lon + 360 : lon) - lc) * cos / sc, MH / 2 - (lat - bc) / sc];  // le Pacifique reste d'un seul tenant
    const land = new Int8Array(W * MH), owner = new Int16Array(W * MH).fill(-1);  // 0 mer, 1 terre, 2 terre sans pays du quiz
    for (const poly of GE_LAND) {
      const t = poly[0] === '!' ? 2 : poly[0] === '~' ? 0 : 1, pts = poly.replace(/^[!~]/, '').split(' ').map(q => P(...q.split(',').map(Number)));
      for (let y = 0; y < MH; y++) { const yc = y + .5, xs = [];
        for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]; if ((ay <= yc) !== (by <= yc)) xs.push(ax + (yc - ay) / (by - ay) * (bx - ax)); }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.max(0, Math.ceil(xs[k] - .5)); x < Math.min(W, Math.ceil(xs[k + 1] - .5)); x++) land[y * W + x] = t; }
    }
    const an = []; for (const c of C) for (const [lon, lat] of pins.get(c.iso) || []) { const [x, y] = P(lon, lat); an.push([x, y, IDX.get(c)]); }
    // les petites îles (Malte, Maurice, les Antilles…) : une tache de terre là où la côte est trop loin
    const r = Math.max(0, Math.round(.5 / sc)), near = (x, y, d) => { for (let j = -d; j <= d; j++) for (let i = -d; i <= d; i++) if (land[(y + j) * W + x + i] === 1) return true; return false; };
    for (const [x, y] of an) { const ix = Math.floor(x), iy = Math.floor(y); if (ix < 3 || iy < 3 || ix >= W - 3 || iy >= MH - 3 || near(ix, iy, 2)) continue;
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) land[(iy + j) * W + ix + i] = 1; }
    const count = new Int32Array(C.length), sum = C.map(() => [0, 0]);
    for (let p = 0; p < W * MH; p++) { if (land[p] !== 1) continue; const x = p % W + .5, y = Math.floor(p / W) + .5; let b = 1e9, o = -1;
      for (const [ax, ay, k] of an) { const d = (ax - x) ** 2 + (ay - y) ** 2; if (d < b) { b = d; o = k; } }
      owner[p] = o; if (o >= 0) { count[o]++; sum[o][0] += x; sum[o][1] += y; } }
    const img = new ImageData(W, MH), put = (p, hex) => { const v = parseInt(hex.slice(1), 16); img.data.set([v >> 16, v >> 8 & 255, v & 255, 255], p * 4); };
    for (let p = 0; p < W * MH; p++) { const x = p % W, y = Math.floor(p / W), l = land[p];
      const nb = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < MH - 1 ? p + W : -1].filter(q => q >= 0);
      if (!l) put(p, nb.some(q => land[q]) ? '#1a4a64' : (x + y * 3) % 7 === 0 ? '#0f2e44' : '#0b2436');
      else if (l === 2) put(p, nb.some(q => !land[q]) ? '#8a98a8' : '#c8d2dc');
      else { const o = owner[p], [a, dark] = TONES[(o * 7 + (o >> 2)) % TONES.length]; put(p, nb.some(q => !land[q] || (land[q] === 1 && owner[q] !== o && q > p)) ? dark : a); }
    }
    // le centre d'un pays : son pixel le plus proche de la moyenne (un pays en deux morceaux, comme la Thaïlande, a sa moyenne hors de ses terres)
    const mid = sum.map(([x, y], k) => count[k] ? [x / count[k], y / count[k], 1e9] : null);
    for (let p = 0; p < W * MH; p++) { const m = mid[owner[p]]; if (!m || owner[p] < 0) continue; const x = p % W + .5, y = Math.floor(p / W) + .5, d = (x - m[0]) ** 2 + (y - m[1]) ** 2; if (d < m[2]) { m[2] = d; m[3] = x; m[4] = y; } }
    return maps[zone] = { owner, count, img, mid: mid.map(m => m && [m[3], m[4]]) };
  }
  // le pays cliqué : la terre sous le pointeur, ou la plus proche à 4 pixels près (pour les petites îles)
  const hitMap = (zone, x, y) => { const m = geoMap(zone), mx = Math.floor(x), my = Math.floor(y - MY);
    for (let d = 0; d <= 4; d++) { let b = 1e9, o = -1; for (let j = -d; j <= d; j++) for (let i = -d; i <= d; i++) { const px2 = mx + i, py2 = my + j; if (px2 < 0 || py2 < 0 || px2 >= W || py2 >= MH) continue; const k = m.owner[py2 * W + px2]; if (k >= 0 && i * i + j * j < b) { b = i * i + j * j; o = k; } } if (o >= 0) return o; }
    return -1; };
  const flags = new Map();  // les images des drapeaux, chargées à la demande (et la suivante à l'avance)
  const flag = iso => { let f = flags.get(iso); if (!f) { f = new Image(); f.crossOrigin = 'anonymous'; f.src = 'https://flagcdn.com/w80/' + iso + '.png'; f.onerror = () => { f.bad = true; }; flags.set(iso, f); } return f; };
  const pick = (list, n, not) => { const out = []; const pool = list.filter(x => !not.includes(x)); while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]); return out; };
  // la série : les pays ratés avant ont plus de chances de revenir
  function series() {
    const mode = save.mode, cnt = mode === 'map' && geoMap(save.zone).count, pool = C.filter(c => (!save.zone || c.zone === save.zone) && (mode === 'map' ? cnt[IDX.get(c)] > 0 : mode === 'flag' || c.cap)), qs = [], used = new Set();
    while (qs.length < Math.min(N, pool.length)) {
      const w = pool.map(c => used.has(c) ? 0 : 1 + 3 * (save.miss[c.iso] || 0)), tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot, c = pool[0];
      for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0 && w[i]) { c = pool[i]; break; } }
      if (used.has(c)) continue; used.add(c);
      if (mode === 'map') { qs.push({ c, ch: [] }); continue; }
      const near = pool.filter(x => x.zone === c.zone), wrong = pick(near.length >= 4 ? near : pool, 3, [c]);
      qs.push({ c, ch: [c, ...wrong].sort(() => Math.random() - .5) });
    }
    return qs;
  }
  let g = null, st = null, tick = 0;
  const start = () => { st = { mode: save.mode, zone: save.zone, qs: series(), i: 0, ok: 0, sel: 0, fx: null, done: false, dead: 0, res: [], missed: [], cur: [W / 2, MY + MH / 2], hov: -1 }; for (const q of st.qs.slice(0, 3)) if (st.mode === 'flag') flag(q.c.iso); };
  const label = (q, x) => st.mode === 'cap' ? x.cap : x.name;
  function answer(k) {
    if (!st || st.done || st.fx) return; const q = st.qs[st.i], got = st.mode === 'map' ? C[k] : q.ch[k], good = got === q.c;
    st.fx = { k, got, good, t: good ? (st.mode === 'map' ? 60 : 40) : (st.mode === 'map' ? 130 : 90) }; st.res.push(good);
    if (!good) { st.missed.push({ c: q.c, got }); flag(q.c.iso); }
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
    for (let i = 0; i < st.qs.length; i++) px(g, i < st.res.length ? (st.res[i] ? '#5ad08a' : '#ff4a3a') : '#20382a', W - 4 - (st.qs.length - i) * 6, 5, 4, 4);
    if (st.fx && --st.fx.t <= 0) next();
    if (!st.done && st.mode === 'map') {
      const q = st.qs[st.i], m = geoMap(st.zone), ti = IDX.get(q.c); g.putImageData(m.img, 0, MY);
      const paint = (k, color) => { for (let p = 0; p < W * MH; p++) if (m.owner[p] === k) px(g, color, p % W, MY + Math.floor(p / W)); };
      if (!st.fx && st.hov >= 0) paint(st.hov, '#d8f0a0');
      if (st.fx) { if (!st.fx.good) paint(st.fx.k, '#ff4a3a'); if (tick % 20 < 14) paint(ti, '#ffd84a');
        const [cx, cy] = m.mid[ti]; g.strokeStyle = '#ffd84a'; for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; px(g, '#ffd84a', cx + Math.cos(t) * 7, MY + cy + Math.sin(t) * 7); } }
      else { const [x, y] = st.cur.map(Math.round); for (const [dx, dy] of [[-3, 0], [-2, 0], [2, 0], [3, 0], [0, -3], [0, -2], [0, 2], [0, 3]]) { px(g, '#05010b', x + dx + 1, y + dy + 1); px(g, '#ffffff', x + dx, y + dy); } }
      px(g, '#06100a', 0, MY + MH, W, H - MY - MH);
      const t = st.fx ? (st.fx.good ? 'Bravo : ' + q.c.name : 'Non : ' + st.fx.got.name + ' · ' + q.c.name + ' clignote') : 'Où est : ' + q.c.name + ' ?';
      PXK.fill(g, PXK.layout(t).w > W - 8 ? (st.fx && !st.fx.good ? 'Non : ' + st.fx.got.name : t) : t, W / 2, H - 3, st.fx ? (st.fx.good ? '#7ee07a' : '#ff8a7a') : '#ffffff', 1, 'center');
    } else if (!st.done) {
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
    } else {  // la fin : le score, puis chaque erreur avec la bonne réponse (et ce que tu as répondu, si la place le permet)
      px(g, 'rgba(6,16,10,.9)', 0, MY, W, H - MY);
      PXK.fill(g, 'SÉRIE FINIE', 6, 31, '#5ad08a', 2); PXK.fill(g, st.ok + '/' + st.qs.length, W - 6, 31, '#ffd84a', 2, 'right');
      if (!st.missed.length) pxFont(g, 'Aucune erreur, bravo !', W / 2, 76, '#ffd84a', 8, 'center');
      const rows = st.missed.length > 9 ? st.missed.slice(0, 8) : st.missed;
      rows.forEach(({ c, got }, i) => { const y = 46 + i * 9, f = flag(c.iso);
        if (f.complete && f.naturalWidth) { g.imageSmoothingEnabled = true; g.drawImage(f, 6, y - 7, 11, 7); g.imageSmoothingEnabled = false; } else px(g, '#20382a', 6, y - 7, 11, 7);
        const main = st.mode === 'cap' ? c.name + ' → ' + c.cap : st.mode === 'land' ? c.cap + ' → ' + c.name : c.name;
        const said = got && (st.mode === 'cap' ? got.cap : got.name), full = main + (said ? '  (pas ' + said + ')' : '');
        let t = PXK.layout(full).w <= W - 28 ? full : main; while (PXK.layout(t).w > W - 28) t = t.slice(0, -2) + '…';
        PXK.fill(g, t, 21, y, '#ffffff', 1); });
      if (rows.length < st.missed.length) PXK.fill(g, 'et ' + (st.missed.length - rows.length) + ' autre' + (st.missed.length - rows.length > 1 ? 's' : ''), 21, 46 + 8 * 9, '#8ab0a0', 1);
      PXK.fill(g, (st.newBest ? 'Nouveau record ! · ' : '') + 'Entrée : une autre série', W / 2, H - 3, st.newBest ? '#ffd84a' : '#b8b0c8', 1, 'center');
    }
    if (tick % 15 === 0) { const q = st.qs[st.i]; g.canvas.setAttribute('aria-label', st.done ? 'Série finie : ' + st.ok + ' sur ' + st.qs.length + '.' + (st.missed.length ? ' À revoir : ' + st.missed.map(m => m.c.name).join(', ') + '.' : '') : st.mode === 'map' ? 'Question ' + (st.i + 1) + ' : où est ' + q.c.name + ' ? Clique sur la carte, ou flèches et Entrée.' : 'Question ' + (st.i + 1) + ' : ' + (st.mode === 'flag' ? 'drapeau à reconnaître' : st.mode === 'cap' ? 'capitale de ' + q.c.name : 'pays dont la capitale est ' + q.c.cap) + '. Réponses : ' + q.ch.map((x, i) => (i + 1) + ' ' + label(q, x)).join(', ') + '.'); }
  }
  function info() {
    const k = save.mode + '|' + (save.zone || 'monde');
    $('geStats').replaceChildren(...[['Record (ce choix)', (save.best[k] || 0) + ' / 10'], ['Bonnes réponses', save.right], ['Séries', save.series], ['Pays à revoir', Object.values(save.miss).filter(Boolean).length]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
  }
  const restart = () => { save.mode = $('geMode').value; save.zone = $('geZone').value; keep(); info(); start(); };
  $('geMode').onchange = restart; $('geZone').onchange = restart;
  $('geNew').onclick = () => { restart(); $('geNew').blur(); };
  $('geFs').onclick = () => { $('geFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('geCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
  document.addEventListener('keydown', e => {
    if (!on() || !st || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key;
    if (st.done) { if (k === 'Enter' || k === ' ') { e.preventDefault(); start(); } return; }
    if (st.mode === 'map') {
      const d = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] }[k];
      if (d) { e.preventDefault(); if (!st.fx) { st.cur = [Math.max(0, Math.min(W - 1, st.cur[0] + d[0])), Math.max(MY, Math.min(MY + MH - 1, st.cur[1] + d[1]))]; st.hov = hitMap(st.zone, ...st.cur); } return; }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); if (st.fx) next(); else { const o = hitMap(st.zone, ...st.cur); if (o >= 0) answer(o); } }
      return;
    }
    if (/^[1-4]$/.test(k)) { st.sel = +k - 1; answer(st.sel); return; }
    const mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -2, ArrowDown: 2 }[k];
    if (mv) { e.preventDefault(); st.sel = (st.sel + mv + 4) % 4; return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); if (st.fx) next(); else answer(st.sel); }
  });
  { const cv = $('geCanvas'), at = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * W, (e.clientY - b.top) / b.height * H]; };
    const hit = ([x, y]) => [0, 1, 2, 3].find(i => { const [bx, by, bw, bh] = box(i); return x >= bx && x < bx + bw && y >= by && y < by + bh; });
    cv.onpointermove = e => { if (!st || st.done || st.fx) return; if (st.mode === 'map') { st.cur = at(e); st.hov = hitMap(st.zone, ...st.cur); return; } const i = hit(at(e)); if (i !== undefined) st.sel = i; };
    cv.onpointerdown = e => { e.preventDefault(); if (!st) return; if (st.done) { start(); return; } if (st.fx) { next(); return; }
      if (st.mode === 'map') { st.cur = at(e); const o = hitMap(st.zone, ...st.cur); if (o >= 0) answer(o); return; }
      const i = hit(at(e)); if (i !== undefined) answer(i); };
  }
  padKeys();
  function geCheck() {  // vérification : pas deux fois le même code ni le même nom, chaque série a 10 questions à 4 réponses différentes dont la bonne, dans chaque mode et chaque continent ; en mode carte, chaque pays demandé se clique en son centre
    const bad = [], keepS = JSON.stringify(save);
    for (const iso of pins.keys()) if (!C.some(c => c.iso === iso)) bad.push('point inconnu ' + iso);
    if (C.filter(c => !pins.has(c.iso)).map(c => c.iso).join() !== 'ad,li,lu,mc,sm,va') bad.push('pays sans point : ' + C.filter(c => !pins.has(c.iso)).map(c => c.iso).join());
    for (const [z] of GE_ZONES) { const m = geoMap(z), mine = C.filter(c => (!z || c.zone === z) && m.count[IDX.get(c)] > 0);
      if (z && mine.length < C.filter(c => c.zone === z && pins.has(c.iso)).length * .9) bad.push('carte ' + (z || 'monde') + ' : ' + mine.length + ' pays visibles');
      for (const c of mine) { const [x, y] = m.mid[IDX.get(c)], o = hitMap(z, x, MY + y); if (o !== IDX.get(c) && m.owner[Math.floor(y) * W + Math.floor(x)] >= 0) { bad.push('carte ' + (z || 'monde') + ' : ' + c.name + ' au centre donne ' + C[o]?.name); break; } } }
    if (new Set(C.map(c => c.iso)).size !== C.length || new Set(C.map(c => c.name)).size !== C.length) bad.push('doublon');
    if (C.some(c => !/^[a-z]{2}$/.test(c.iso) || !GE_ZONES.some(z => z[0] === c.zone))) bad.push('code ou continent');
    for (const [m] of GE_MODES) for (const [z] of GE_ZONES) { save.mode = m; save.zone = z; const qs = series();
      if (qs.length !== N) bad.push(m + ' ' + z + ' : ' + qs.length + ' questions');
      for (const q of qs) if (m === 'map' ? geoMap(z).count[IDX.get(q.c)] < 1 : new Set(q.ch).size !== 4 || !q.ch.includes(q.c) || (m !== 'flag' && q.ch.some(x => !x.cap))) { bad.push(m + ' ' + z + ' : réponses ' + q.c.name); break; } }
    Object.keys(save).forEach(k => delete save[k]); Object.assign(save, JSON.parse(keepS));
    return bad.join(' | ') || 'ok';
  }
  { const c = geCheck(); console.assert(c === 'ok', 'geo', c); view.dataset.selfcheck = c; }
  start(); info();
  let raf = 0; const frame = () => { if (!on()) { raf = 0; return; } raf = requestAnimationFrame(frame); draw(); };
  ctx.onOpen(() => { g ??= $('geCanvas').getContext('2d'); if (!raf) raf = requestAnimationFrame(frame); });
  $('geCanvas').__q = () => st.done ? -1 : st.qs[st.i].ch.indexOf(st.qs[st.i].c);
  $('geCanvas').__ge = { st: () => st, check: geCheck, map: geoMap, idx: c => IDX.get(c), MY };
}
