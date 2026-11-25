// Geração das alternativas erradas (leituras e kanjis parecidos)
// Tabela de kana para gerar leituras "parecidas"
const ROWS = ["あいうえお","かきくけこ","がぎぐげご","さしすせそ","ざじずぜぞ","たちつてと","だぢづでど","なにぬねの","はひふへほ","ばびぶべぼ","ぱぴぷぺぽ","まみむめも","や_ゆ_よ","らりるれろ","わ___を"];
const NEAR = {1:[2],2:[1],3:[4,5],4:[3,6],5:[6,3],6:[5],8:[9,10],9:[8,10],10:[9,8],7:[11,13],11:[7],13:[7,11],0:[12],12:[0]};
const pos = c => { for (let i = 0; i < ROWS.length; i++) { const j = ROWS[i].indexOf(c); if (j >= 0) return [i, j]; } return null; };
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const SMALL = { "ゃ":"や","ゅ":"ゆ","ょ":"よ" };

function mutate(s) {
  const ch = [...s], i = rnd(ch.length), c = ch[i], p = pos(c), t = rnd(5);
  if (t === 0 && p) { // muda a vogal
    const opts = [...ROWS[p[0]]].filter((x, j) => x !== "_" && j !== p[1]); ch[i] = pick(opts);
  } else if (t === 1 && p) { // muda a consoante (som parecido)
    const rows = (NEAR[p[0]] || []).concat(rnd(3) ? [] : [rnd(ROWS.length)]);
    const r = ROWS[pick(rows.length ? rows : [rnd(ROWS.length)])][p[1]]; if (r && r !== "_") ch[i] = r;
  } else if (t === 2) { // alonga
    if (p && (p[1] === 4 || p[1] === 2) && ch[i + 1] !== "う") ch.splice(i + 1, 0, "う");
    else if (p && (p[1] === 3 || p[1] === 1) && ch[i + 1] !== "い") ch.splice(i + 1, 0, "い");
    else if (i > 0 && p && [1,3,5,10].includes(p[0]) && ch[i - 1] !== "っ") ch.splice(i, 0, "っ");
    else ch.push("ん");
  } else if (t === 3) { // encurta
    const k = ch.findIndex((x, j) => j > 0 && "うっんい".includes(x));
    if (k > 0) ch.splice(k, 1); else if (ch.length > 2) ch.splice(rnd(ch.length - 1) + 1, 1);
  } else { // kana pequeno
    const k = ch.findIndex(x => SMALL[x]);
    if (k >= 0) ch[k] = rnd(2) ? SMALL[k] || SMALL[ch[k]] : pick(Object.keys(SMALL).filter(x => x !== ch[k]));
    else if (p && p[1] === 1 && p[0] > 0) ch.splice(i + 1, 0, pick(["ゃ","ゅ","ょ"]));
    else ch[i] = pick([...ROWS[p ? p[0] : 0]].filter(x => x !== "_"));
  }
  return ch.join("");
}
const okKana = s => s && !"っんゃゅょー".includes(s[0]) && !/っ$/.test(s) && !/(^|[^きぎしじちぢにひびぴみり])[ゃゅょ]/.test(s) && !/[あいうえおなにぬねのまみむめもやゆよらりるれろわをん]っ/.test(s);

function readingOptions(w) {
  const bad = validReadings(w), out = new Set();
  let n = 0;
  while (out.size < 2 && n++ < 200) { const m = mutate(rnd(4) ? w.r : mutate(w.r)); if (okKana(m) && !bad.has(m)) out.add(m); }
  const len = [...w.r].length;
  const real = shuffle(POOL.filter(x => !bad.has(x.r) && Math.abs([...x.r].length - len) <= 1).map(x => x.r));
  for (const r of real) { if (out.size >= 3) break; out.add(r); }
  while (out.size < 3) { const m = mutate(w.r); if (okKana(m) && !bad.has(m)) out.add(m); }
  return shuffle([w.r, ...out]);
}

// Kanjis visualmente parecidos
const GROUPS = ["木林森本休","大犬天太人入八火","日目白田百月耳早","土王玉千十正","右左石名","貝見目","子字学","早草花","口中田円","男町田力","青赤白","上下正","小水川","手竹","夕名","出山","立音文","雨空天","先生年","金玉"];
const kanjiChars = s => [...s].filter(c => /[一-鿿]/.test(c));
const tail = s => s.replace(/^[一-鿿]+/, "");
function kanjiOptions(w) {
  const cs = kanjiChars(w.k);
  const scored = POOL.filter(x => x.k !== w.k && x.r !== w.r && !validReadings(x).has(w.r)).map(x => {
    const xs = kanjiChars(x.k); let s = Math.random() * 2.5;
    if (GROUPS.some(g => cs.some(c => g.includes(c)) && xs.some(c => g.includes(c) && !cs.includes(c)))) s += 3;
    if (xs.some(c => cs.includes(c))) s += 2;
    if (tail(x.k) && tail(x.k) === tail(w.k)) s += 2.5;
    if (xs.length === cs.length) s += 1;
    if ([...x.k].length === [...w.k].length) s += .5;
    return [s, x.k];
  }).sort((a, b) => b[0] - a[0]);
  return shuffle([w.k, ...scored.slice(0, 3).map(x => x[1])]);
}
