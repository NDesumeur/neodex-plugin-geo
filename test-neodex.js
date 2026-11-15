// lancé par le test « local » de NeoDex : vérification interne (cartes de chaque continent comprises), une série parfaite en mode drapeaux (touches 1 à 4),
// une série au mode carte avec deux erreurs (viseur au clavier et Entrée), l'écran de fin qui liste les erreurs, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('geCanvas').__ge, st = T.st(); ${code} })()`);
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('geCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('geCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'geo-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const pick = async (mode, zone) => pj(`(() => { const m = document.getElementById('geMode'), z = document.getElementById('geZone'); m.value = '${mode}'; z.value = '${zone}'; m.dispatchEvent(new Event('change')); return 0; })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pick('flag', ''); await sleep(1500); await shot('0-drapeau');
  for (let i = 0; i < 10; i++) { const k = await pj(`document.getElementById('geCanvas').__q()`); if (k < 0) throw new Error('série finie trop tôt'); await key(String(k + 1)); await sleep(80); await key('Enter'); await sleep(80); }
  await sleep(400);
  const l = await label(); if (!/Série finie : 10 sur 10/.test(l)) throw new Error('« ' + l + ' »');
  // le mode carte, monde entier puis Europe : le viseur va sur le pays (deux fois sur un autre), Entrée clique
  for (const zone of ['', 'eu']) {
    await pick('map', zone); await sleep(200); if (!zone) await shot('1-monde');
    for (let i = 0; i < 10; i++) {
      const wrong = i === 2 || i === 5;
      await C(`const m = T.map(st.zone), q = st.qs[st.i], k = T.idx(q.c); let o = k;
        if (${wrong}) o = [...m.count.keys()].find(j => j !== k && m.count[j] > 3 && m.mid[j] && Math.hypot(m.mid[j][0] - m.mid[k][0], m.mid[j][1] - m.mid[k][1]) < 40);
        const [x, y] = m.mid[o]; st.cur = [x, y + T.MY]; return 0;`);
      if (zone === 'eu' && i === 0) { await key('ArrowLeft'); await key('ArrowRight'); await sleep(60); await shot('2-europe-viseur'); }
      await key('Enter'); await sleep(60);
      if (zone === 'eu' && i === 2) { await sleep(200); await shot('3-europe-erreur'); }
      await key('Enter'); await sleep(60);
    }
    await sleep(300);
    const r = await C('return st.done + "|" + st.ok + "|" + st.missed.length;'); if (r !== 'true|8|2') throw new Error('série carte ' + (zone || 'monde') + ' : ' + r);
  }
  await sleep(1500); await shot('4-fin-carte');
  const fin = await label(); if (!/8 sur 10.*À revoir/.test(fin)) throw new Error('fin : « ' + fin + ' »');
  // l'écran de fin des capitales : erreurs avec la bonne capitale
  await pick('cap', 'eu'); await sleep(100);
  for (let i = 0; i < 10; i++) { const k = await pj(`document.getElementById('geCanvas').__q()`); await key(String((i < 4 ? k + 1 : k) % 4 + 1)); await sleep(60); await key('Enter'); await sleep(60); }
  await sleep(1200); await shot('5-fin-capitales');
  if (await C('return st.missed.length;') !== 4) throw new Error('quatre erreurs attendues');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('geFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('geCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('geCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('geCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  await pick('map', ''); await C('st.cur = [70, 60]; return 0;'); await sleep(200);  // on finit sur la carte, pour la capture
  return 'vérification ok · drapeaux 10/10 · carte monde et Europe 8/10 avec erreurs listées · capitales · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
