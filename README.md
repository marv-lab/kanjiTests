# Teste de Kanji — Meu Amigo Kanji I (漢字テスト)

Treino de leitura e escrita dos kanjis das unidades 1 a 20 do livro *Meu Amigo Kanji I*. O app mostra uma palavra num quadrado de caderno de caligrafia e você escolhe a resposta certa entre quatro alternativas.

*Kanji* (漢字) são os ideogramas da escrita japonesa, e *tesuto* (テスト) quer dizer "teste".

## Para que serve

As alternativas erradas não são sorteadas ao acaso: elas imitam os erros que se cometem de verdade numa prova de kanji. No teste de leitura aparecem leituras quase certas, com a vogal trocada, um som parecido (か/が, は/ば/ぱ), uma vogal longa ou um っ a mais ou a menos, ou o kana pequeno errado (しゃ/しょ). No teste de escrita aparecem kanjis visualmente parecidos (木/林/森, 日/目/白, 右/左/石). Este projeto dá repetição rápida, sem cadastro e sem instalar nada, para fixar as 80 palavras dos testes do livro.

## Como usar

1. Acesse https://marv-lab.github.io/kanjiTests/
2. Escolha o **tipo de teste**:
   - **Teste de kanji:** aparece a palavra em kanji e você escolhe a leitura em hiragana.
   - **Teste de hiragana:** aparece a leitura em hiragana e você escolhe o kanji.
3. Escolha as **unidades**: **Todas** ou um bloco (1–5, 6–10, 11–15, 16–20). As palavras vêm embaralhadas.
4. Se quiser, ligue **Mostrar tradução** para ver o significado em português embaixo de cada kanji. A escolha fica salva no navegador.
5. Clique na alternativa certa ou use as teclas `1` a `4`.
   - Se acertar, a alternativa fica azul e o app passa para a próxima palavra.
   - Se errar, sua escolha fica riscada em vermelho, a certa é destacada e a resposta aparece embaixo.
6. A parte de cima mostra acertos (正), erros (誤) e o progresso no teste.
7. No fim aparecem o percentual de acertos e a lista das palavras que você errou, com a leitura. **Treinar só os erros** faz um novo teste só com elas, e **Recomeçar** repete o teste inteiro.

Leituras alternativas válidas (por exemplo, し e よ para 四, ou にち para 日) nunca aparecem como alternativa errada.

### Atalhos de teclado

| Ação | Tecla |
|---|---|
| Escolher a alternativa 1, 2, 3 ou 4 | `1` `2` `3` `4` |

## Requisitos

Um navegador atualizado (Chrome, Edge, Firefox ou Safari). Não há áudio nem nada para instalar.

A página usa fontes do Google Fonts, então precisa de internet para carregá-las. O layout se adapta a celular, tablet e desktop, e acompanha o tema claro ou escuro do sistema.

O placar não é salvo: ao recarregar a página, o teste recomeça.

## Estrutura do projeto

| Arquivo | Função |
|---|---|
| `kanji.html` | Página do teste (fonte), usa os arquivos de `css/` e `js/` |
| `css/style.css` | Estilos |
| `js/data.js` | Vocabulário das unidades e leituras alternativas válidas |
| `js/options.js` | Geração das alternativas erradas (leituras e kanjis parecidos) |
| `js/app.js` | Estado do teste, placar e interface |
| `index.html` | Versão minificada para publicar, usa os arquivos `.min` |
| `css/style.min.css` / `js/kanji.min.js` | CSS e JS minificados (os três scripts juntos, na ordem certa) |

Para publicar são necessários só `index.html`, `css/style.min.css` e `js/kanji.min.js`.

Os scripts precisam ser carregados nessa ordem (`data.js`, `options.js`, `app.js`), porque cada um usa o que o anterior define.

## Desenvolvimento

Edite sempre `kanji.html`, `css/style.css` e os arquivos de `js/`, e abra o `kanji.html` para testar. Depois gere de novo os arquivos minificados:

```sh
npx terser js/data.js js/options.js js/app.js --compress --mangle -o js/kanji.min.js
npx clean-css-cli -o css/style.min.css css/style.css
sed -e '/src="js\/data.js"\|src="js\/options.js"/d' -e 's#src="js/app.js"#src="js/kanji.min.js"#' -e 's#href="css/style.css"#href="css/style.min.css"#' kanji.html | npx html-minifier-terser --collapse-whitespace --remove-comments --collapse-boolean-attributes -o index.html
```

Para acrescentar palavras, edite o objeto `RAW` em `js/data.js`. Cada unidade é uma linha com pares `kanji:leitura` separados por espaço. Se a palavra tiver outras leituras válidas, acrescente em `ALT`, para que elas não apareçam como alternativa errada.

Não há dependências nem build: é HTML, CSS e JavaScript puros.

## Licença

[MIT](LICENSE)
