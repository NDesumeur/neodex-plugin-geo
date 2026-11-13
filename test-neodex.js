// lancé par le test « local » de NeoDex : vérification interne, une série parfaite en mode drapeaux (touches 1 à 4), et un drapeau bien chargé
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await sleep(1500);
  for (let i = 0; i < 10; i++) { const k = await pj(`document.getElementById('geCanvas').__q()`); if (k < 0) throw new Error('série finie trop tôt'); await key(String(k + 1)); await sleep(80); await key('Enter'); await sleep(80); }
  await sleep(400);
  const l = await pj(`document.getElementById('geCanvas').getAttribute('aria-label')`);
  if (!/Série finie : 10 sur 10/.test(l)) throw new Error('« ' + l + ' »');
  return l;
};
