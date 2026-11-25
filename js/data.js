// Vocabulário das unidades e leituras alternativas válidas
const RAW = {
  "1–5":   "一:いち 六:ろく 上:うえ 火:ひ 森:もり 川:かわ 十:じゅう 五:ご 二:に 七:なな 中:なか 水:みず 林:はやし 山:やま 九:きゅう 四:よん 三:さん 八:はち 下:した 木:き",
  "6–10":  "口:くち 石:いし 男:おとこ 王さま:おうさま 町:まち 犬:いぬ 力:ちから 虫:むし 目:め 足:あし 女:おんな 人:ひと 村:むら 小さい:ちいさい 田:た 手:て 耳:みみ 糸:いと 大きい:おおきい 車:くるま",
  "11–15": "先生:せんせい 字:じ 夕がた:ゆうがた 白:しろ 子ども:こども 月:つき 青:あお 花:はな 一年生:いちねんせい 学校:がっこう 早い:はやい 名まえ:なまえ 日:ひ 赤:あか 休みます:やすみます 入ります:はいります 立ちます:たちます 出ます:でます 大きい:おおきい 小さい:ちいさい",
  "16–20": "左:ひだり 千:せん 土:つち 本:ほん 空:そら 文:ぶん 草:くさ 百:ひゃく 右:みぎ 円:えん 竹:たけ 天気:てんき 雨:あめ 正しい:ただしい お金:おかね 貝:かい 見ます:みます 玉:たま 音:おと 車:くるま"
};
const WORDS = [];
for (const [u, s] of Object.entries(RAW)) for (const p of s.split(" ")) { const [k, r] = p.split(":"); WORDS.push({ k, r, u }); }
const POOL = [...new Map(WORDS.map(w => [w.k, w])).values()];

// Significado em português de cada palavra
const MEAN = {一:"um",六:"seis",上:"em cima",火:"fogo",森:"floresta",川:"rio",十:"dez",五:"cinco",二:"dois",七:"sete",中:"dentro, meio",水:"água",林:"bosque",山:"montanha",九:"nove",四:"quatro",三:"três",八:"oito",下:"embaixo",木:"árvore",
  口:"boca",石:"pedra",男:"homem",王さま:"rei",町:"cidade",犬:"cachorro",力:"força",虫:"inseto",目:"olho",足:"pé, perna",女:"mulher",人:"pessoa",村:"vila",小さい:"pequeno",田:"arrozal",手:"mão",耳:"orelha",糸:"fio, linha",大きい:"grande",車:"carro",
  先生:"professor",字:"letra",夕がた:"entardecer",白:"branco",子ども:"criança",月:"lua, mês",青:"azul",花:"flor",一年生:"aluno do 1º ano",学校:"escola",早い:"cedo, rápido",名まえ:"nome",日:"sol, dia",赤:"vermelho",休みます:"descansar",入ります:"entrar",立ちます:"ficar de pé",出ます:"sair",
  左:"esquerda",千:"mil",土:"terra",本:"livro",空:"céu",文:"frase, texto",草:"grama",百:"cem",右:"direita",円:"iene, círculo",竹:"bambu",天気:"tempo (clima)",雨:"chuva",正しい:"correto",お金:"dinheiro",貝:"concha",見ます:"ver",玉:"bola, joia",音:"som"};
const meaning = k => MEAN[k] || "";

// Outras leituras válidas: nunca aparecem como alternativa errada
const ALT = {四:"し よ",七:"しち",九:"く",日:"にち か",一:"ひと",人:"じん にん",月:"げつ がつ",水:"すい",火:"か",木:"もく こ",土:"ど と",目:"もく",口:"こう",本:"もと",下:"か げ しも",上:"じょう かみ",中:"ちゅう",円:"まる",白:"はく",山:"さん",三:"み",十:"とお",二:"ふた",五:"いつ",六:"む",八:"や よう",千:"ち",川:"せん",石:"せき",男:"だん",女:"じょ",力:"りょく",田:"でん",手:"しゅ",車:"しゃ",文:"もん",音:"おん",花:"か",空:"くう から",右:"う",左:"さ",竹:"ちく",玉:"ぎょく",貝:"ばい",虫:"ちゅう",犬:"けん",町:"ちょう",村:"そん",字:"あざ",青:"せい",赤:"せき",早い:"",森:"しん",林:"りん",耳:"じ",糸:"し",足:"そく",百:"もも",草:"そう",雨:"う",金:"きん"};
const validReadings = w => new Set([w.r, ...(ALT[w.k] || "").split(" ").filter(Boolean)]);
