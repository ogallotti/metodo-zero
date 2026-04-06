---
name: gerar-design
description: Define identidade visual da landing page com escolhas interativas. Apresenta opcoes de paleta, tipografia e hero no browser para o usuario escolher. Gera design system completo.
---

# Instrucoes

Voce vai definir a identidade visual da landing page. O principio central: **cada decisao criativa e apresentada como opcoes visuais no browser para o usuario escolher.** Voce NUNCA escolhe paleta, fonte ou hero sozinho.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/creative-reference.md` — arquetipos, constraints, font pairings
3. Leia `references/effects/README.md` — indice da biblioteca de efeitos
4. Leia `references/design-system-guide.md` APENAS na Etapa 5 (quando for gerar o design system)

## Escopo

Esta skill:
- Apresenta opcoes visuais de paleta, tipografia e hero para o usuario escolher
- Gera design system completo (tokens CSS) baseado nas escolhas
- Define DNA Visual
- Seleciona efeitos complementares da biblioteca
- Implementa Hero + primeira secao como demonstracao
- Abre preview no browser

---

## Etapa 1: Coletar Contexto

Localize a pasta da pagina. Leia `copy.md`. Se o usuario tiver fornecido referencias visuais, analise-as.

---

## Etapa 2: Opcoes de Paleta (3 no browser)

1. Analise o tipo de produto, publico e tom da copy
2. Gere 3 direcoes visuais DISTINTAS entre si:
   - Uma light/minimalista
   - Uma dark/tech
   - Uma com personalidade forte (colorida, contrastante, ousada)

   Cada direcao com: nome, background, primary, secondary, accent, text, surface.

3. Crie `_opcoes-visual.html` na pasta da pagina mostrando as 3 paletas lado a lado com cards de exemplo (heading, paragrafo, botao, card surface)
4. Informe URL ao usuario

**PAUSA:** "Qual direcao visual voce prefere? 1, 2 ou 3?"

Apos escolha, remover arquivo temporario.

---

## Etapa 3: Opcoes de Tipografia (3 no browser)

1. Leia `references/creative-reference.md` secao FONT PAIRINGS CURADOS
2. Filtre 3 pairings de CATEGORIAS DIFERENTES que encaixem no produto

**FONTES PROIBIDAS:** Consulte a lista completa em `rules.md` (secao Fontes). Inclui Inter, Montserrat, Poppins, Roboto, e outras overused.

3. Crie `_opcoes-fontes.html` usando a paleta ja escolhida. Mostre heading + body + overline para cada combo. Carregue fontes via Google Fonts
4. Informe URL ao usuario

**PAUSA:** "Qual tipografia voce prefere? 1, 2 ou 3?"

Apos escolha, remover arquivo temporario.

---

## Etapa 4: Opcoes de Hero (3 no browser)

1. Leia `references/effects/README.md` e selecione 3 hero patterns de ALTO IMPACTO
2. Para CADA opcao, leia o arquivo COMPLETO do efeito em `references/effects/hero-patterns/`
3. Crie 3 arquivos separados (`_hero-1.html`, `_hero-2.html`, `_hero-3.html`), cada um com:
   - Paleta escolhida como tokens CSS
   - Tipografia escolhida carregada
   - Headline da copy
   - Codigo do efeito COPIADO LITERALMENTE da biblioteca
   - Layout que NAO seja coluna centralizada simples

**REGRA CRITICA:** Copie o codigo do efeito LITERALMENTE. Substitua APENAS variaveis CSS. NAO reescreva, NAO simplifique.

4. Informe as 3 URLs ao usuario

**PAUSA:** "Qual hero voce prefere? 1, 2 ou 3?"

Apos escolha, remover temporarios. Mover hero escolhido para `index.html`.

---

## Etapa 5: Design System Completo

Com paleta + tipografia + hero escolhidos, gere o design system seguindo `references/design-system-guide.md`:

1. Escala tipografica (h1-h6, body, caption, overline com clamp)
2. Paleta expandida (variantes light/dark/muted de cada cor)
3. Sombras (3 niveis)
4. Espacamento (escala 4/8px: xs a 5xl)
5. Tokens de animacao (4 duracoes + easings)
6. Salvar TUDO como variaveis CSS no `:root` do `style.css`

---

## Etapa 6: DNA Visual + Efeitos Complementares

1. Defina o DNA Visual (elemento recorrente, tratamento de midia, movimento de assinatura, detalhe tipografico)
2. Selecione efeitos complementares da biblioteca:
   - 2-3 scroll effects
   - 1-2 transitions
   - 3-5 micro-interactions
3. Registre DNA Visual e efeitos como comentario no style.css

---

## Etapa 7: Implementar Primeira Secao

Alem do hero (ja implementado), construa a primeira secao da copy para demonstrar o design system em contexto.

---

## Etapa 8: Preview e Apresentacao

1. Abra Netlify Dev (consulte `references/local-server.md`)
2. Informe URL ao usuario
3. Apresente: design system, DNA visual, efeitos selecionados
4. Peca feedback: "O que achou? Quer ajustar algo?"

Quando rodando standalone: PARE apos feedback. Sugira `gerar-layout` como proximo passo.
Quando rodando na pipeline: retorne controle ao orquestrador.
