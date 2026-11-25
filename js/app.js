// Estado do teste e interface
// Estado
const $ = id => document.getElementById(id);
let mode = "kanji", unit = "Todas", deck = [], idx = 0, ok = 0, ng = 0, missed = [], locked = false, timer;
const UNITS = ["Todas", ...Object.keys(RAW)];
$("units").innerHTML = UNITS.map(u => `<button data-u="${u}" aria-pressed="${u === unit}">${u === "Todas" ? "Todas" : "Unid. " + u}</button>`).join("");

function wordsFor(u) {
  const list = u === "Todas" ? WORDS : WORDS.filter(w => w.u === u);
  return [...new Map(list.map(w => [w.k, w])).values()];
}
function start(list) {
  clearTimeout(timer);
  deck = shuffle(list); idx = 0; ok = 0; ng = 0; missed = [];
  $("quiz").hidden = false; $("end").hidden = true;
  render();
}
function fit(text) {
  const n = [...text].length;
  return `calc(var(--cell) * ${Math.min(0.62, 0.84 / n).toFixed(3)})`;
}
function render() {
  const w = deck[idx]; locked = false;
  const q = mode === "kanji" ? w.k : w.r;
  $("q").textContent = q; $("q").style.fontSize = fit(q);
  $("q-mean").textContent = mode === "kanji" ? meaning(w.k) : "";
  $("q-unit").textContent = "Unidades " + w.u;
  $("ask").textContent = mode === "kanji" ? "Qual é a leitura em hiragana?" : "Qual é o kanji?";
  const opts = mode === "kanji" ? readingOptions(w) : kanjiOptions(w);
  const box = $("opts"); box.textContent = "";
  opts.forEach((o, i) => {
    const b = document.createElement("button");
    b.className = "opt jp"; b.dataset.v = o;
    const sm = document.createElement("small"); sm.textContent = i + 1;
    b.append(sm, document.createTextNode(o));
    if (mode === "kana") { const m = document.createElement("span"); m.className = "mean"; m.textContent = meaning(o); b.append(m); }
    b.addEventListener("click", () => answer(b));
    box.append(b);
  });
  $("fb").textContent = ""; $("fb").className = "fb";
  updateScore();
}
function updateScore() {
  $("s-ok").textContent = ok; $("s-ng").textContent = ng;
  $("s-pos").textContent = `${Math.min(idx + 1, deck.length)} / ${deck.length}`;
  $("s-bar").style.width = (idx / deck.length * 100) + "%";
}
function answer(b) {
  if (locked) return; locked = true;
  const w = deck[idx], right = mode === "kanji" ? w.r : w.k, hit = b.dataset.v === right;
  for (const x of $("opts").children) { x.disabled = true; if (x.dataset.v === right) x.classList.add("right"); }
  if (hit) ok++; else { ng++; b.classList.add("wrong"); missed.push(w); }
  const fb = $("fb");
  fb.className = "fb " + (hit ? "ok" : "ng");
  fb.textContent = (hit ? "Certo! " : "Errou — ") + `${w.k} = ${w.r} (${meaning(w.k)})`;
  idx++; updateScore();
  timer = setTimeout(() => idx < deck.length ? render() : finish(), hit ? 800 : 1700);
}
function finish() {
  $("quiz").hidden = true; $("end").hidden = false;
  const total = ok + ng;
  $("e-pct").textContent = Math.round(ok / total * 100) + "%";
  $("e-txt").textContent = `${ok} acertos e ${ng} erros em ${total} palavras.`;
  $("e-miss").hidden = !missed.length;
  $("e-list").innerHTML = "";
  for (const w of missed) {
    const li = document.createElement("li"); li.className = "jp"; li.textContent = w.k;
    const s = document.createElement("span"); s.textContent = w.r; li.append(s);
    const m = document.createElement("em"); m.className = "mean"; m.textContent = meaning(w.k); li.append(m); $("e-list").append(li);
  }
}
function setMode(m) {
  mode = m;
  $("m-kanji").setAttribute("aria-pressed", m === "kanji");
  $("m-kana").setAttribute("aria-pressed", m === "kana");
  start(wordsFor(unit));
}
$("m-kanji").addEventListener("click", () => setMode("kanji"));
$("m-kana").addEventListener("click", () => setMode("kana"));
$("units").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  unit = b.dataset.u;
  for (const x of $("units").children) x.setAttribute("aria-pressed", x === b);
  start(wordsFor(unit));
});
$("e-again").addEventListener("click", () => start(wordsFor(unit)));
$("e-miss").addEventListener("click", () => start(missed));
document.addEventListener("keydown", e => {
  const n = +e.key; if (n >= 1 && n <= 4 && !$("quiz").hidden) { const b = $("opts").children[n - 1]; if (b && !b.disabled) b.click(); }
});
start(wordsFor(unit));
