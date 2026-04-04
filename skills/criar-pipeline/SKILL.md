---
name: criar-pipeline
description: Pipeline interativa para criar landing pages de alto impacto. Cada decisao criativa e apresentada ao usuario com opcoes visuais no browser. Do briefing ao deploy, passo a passo.
---

# Instrucoes

Voce e o orquestrador de uma pipeline INTERATIVA de criacao de landing pages. O principio central: **o LLM nunca toma decisoes criativas sozinho.** Voce gera opcoes, renderiza no browser, e o usuario escolhe. Voce executa.

## Antes de Comecar

Leia `rules.md` na raiz do plugin.

## Fluxo Geral

```
1. BRIEFING — Coletar informacoes do produto
2. SCAFFOLD — Criar projeto + iniciar servidor
3. COPY — Gerar copy, usuario aprova/ajusta
4. DIRECAO VISUAL — Apresentar 3 opcoes de paleta no browser, usuario escolhe
5. TIPOGRAFIA — Apresentar 3 opcoes de font pairing no browser, usuario escolhe
6. HERO — Apresentar 3 opcoes de hero pattern no browser, usuario escolhe
7. DESIGN SYSTEM — Consolidar escolhas + gerar tokens CSS
8. LAYOUT — Especificar cada secao, usuario aprova
9. BUILD SECAO A SECAO — Cada secao renderizada no browser, usuario aprova antes da proxima
10. AJUSTES FINAIS — Usuario ve pagina completa e pede refinamentos
11. OTIMIZAR (opcional)
12. PUBLICAR (opcional)
```

---

## Etapa 1: Briefing

Colete do usuario:

1. **O que e o produto/servico?** O que faz, para quem
2. **Qual o objetivo da pagina?** Vender, captar lead, inscrever, etc.
3. **Tem alguma preferencia visual?** Cores da marca, referencias, tom. Se nao tiver, tudo bem — vamos descobrir juntos
4. **Nome da pasta do projeto**

---

## Etapa 2: Scaffold

Execute a skill `iniciar`:
- Copiar templates para pasta do projeto
- Criar pasta da pagina com nome fornecido
- Configurar redirect no netlify.toml
- Git init + primeiro commit
- Iniciar Netlify Dev

Informar URL ao usuario. Avancar automaticamente.

---

## Etapa 3: Copy

Execute a skill `gerar-copy` com informacoes do briefing.

**PAUSA:** Apresente a copy ao usuario.
- Se aprovar → avancar
- Se pedir ajustes → corrigir e reapresentar

---

## Etapa 4: Direcao Visual (3 opcoes no browser)

Este e o primeiro ponto de decisao criativa. NAO escolha sozinho.

### Processo

1. Leia `references/creative-reference.md` e `references/design-system-guide.md`
2. Analise a copy e o tipo de produto
3. Gere 3 direcoes visuais DISTINTAS. Cada direcao deve ter:
   - Nome curto (ex: "Minimalista Claro", "Tech Escuro", "Vibrante Colorido")
   - Paleta completa (background, primary, secondary, accent, text)
   - Modo (light ou dark)
   - Tom geral (descricao em 1 frase)

4. **Renderize as 3 opcoes no browser:**

Crie um arquivo temporario `_opcoes-visual.html` na pasta da pagina com as 3 paletas lado a lado. Cada opcao mostra:
- Background na cor real
- Headline na fonte do sistema (a fonte sera escolhida depois) com a cor real
- Paragrafo com cor de texto real
- Botao com cor primary real
- Card com cor surface real

Nao precisa ser bonito — precisa mostrar as CORES ao vivo.

5. Informe a URL ao usuario (ex: `http://localhost:8888/pagina-vendas/_opcoes-visual.html`)

**PAUSA:** "Qual direcao visual voce prefere? 1, 2 ou 3?"

6. Apos escolha, remover `_opcoes-visual.html`. Guardar paleta escolhida.

---

## Etapa 5: Tipografia (3 opcoes no browser)

### Processo

1. Leia `references/creative-reference.md` secao FONT PAIRINGS CURADOS
2. Baseado no tipo de produto E na direcao visual escolhida, filtre 3 font pairings de CATEGORIAS DIFERENTES. Cada opcao deve vir de uma categoria distinta (ex: uma Editorial, uma Brutalist, uma Agnostic)

**FONTES PROIBIDAS (individualmente):** Fraunces, Playfair Display, Montserrat, Poppins, Roboto, Lato, Raleway, Lora, Open Sans, Inter, Merriweather, Source Sans Pro.

3. **Renderize as 3 opcoes no browser:**

Crie `_opcoes-fontes.html` com as 3 opcoes usando o BACKGROUND E CORES da paleta ja escolhida. Cada opcao mostra:
- Heading com a fonte heading no peso indicado (tamanho grande)
- Subheading com a fonte heading em peso mais leve
- Paragrafo de corpo com a fonte body
- Overline/caption com a fonte body em peso diferente

Carregue as fontes via Google Fonts no `<head>` do arquivo.

4. Informe URL ao usuario.

**PAUSA:** "Qual tipografia voce prefere? 1, 2 ou 3?"

5. Apos escolha, remover `_opcoes-fontes.html`. Guardar font pairing.

---

## Etapa 6: Hero (3 opcoes no browser)

Este e o ponto criativo mais importante. O hero define a primeira impressao.

### Processo

1. Leia `references/effects/README.md` (indice da biblioteca de efeitos)
2. Selecione 3 hero patterns que encaixem no produto. Priorize efeitos de ALTO IMPACTO (particulas, shaders, kinetic typography, parallax, etc.). EVITE gradient-mesh-animated (e o mais generico).
3. Para cada opcao, leia o arquivo completo do efeito em `references/effects/hero-patterns/`

4. **Renderize as 3 opcoes no browser:**

Para CADA opcao, crie um arquivo separado (`_hero-opcao-1.html`, `_hero-opcao-2.html`, `_hero-opcao-3.html`) na pasta da pagina. Cada arquivo e uma pagina completa com:
- A paleta ja escolhida (tokens CSS)
- A tipografia ja escolhida (Google Fonts carregada)
- A headline da copy (do copy.md, secao Hero)
- O efeito do hero COPIADO LITERALMENTE do arquivo da biblioteca
- Parametros do efeito adaptados para os tokens CSS do projeto
- Layout do hero que NAO seja coluna centralizada simples (usar split, assimetrico, ou off-grid)

**REGRA CRITICA:** Copie o codigo HTML, CSS e JS do efeito LITERALMENTE do arquivo da biblioteca. Substitua APENAS as variaveis CSS. NAO reescreva, NAO simplifique, NAO "adapte a estrutura". Se o efeito tem 200 linhas de JS, copie as 200 linhas.

5. Informe as 3 URLs ao usuario.

**PAUSA:** "Qual hero voce prefere? 1, 2 ou 3?"

6. Apos escolha, mover o hero escolhido para o `index.html` principal. Remover os 3 arquivos temporarios. Guardar efeito escolhido.

---

## Etapa 7: Design System Consolidado

Agora voce tem: paleta + tipografia + hero pattern escolhidos pelo usuario.

1. Leia `references/design-system-guide.md`
2. Gere o design system COMPLETO:
   - Escala tipografica (h1-h6, body, caption, overline com clamp)
   - Paleta expandida (todas as variantes light/dark/muted)
   - Sombras (3 niveis)
   - Espacamento (escala 4/8px)
   - Tokens de animacao (duracoes + easings)
3. Defina o DNA Visual (elemento recorrente, tratamento de midia, movimento de assinatura, detalhe tipografico)
4. Salve tudo como variaveis CSS no `:root` do `style.css`
5. Selecione efeitos complementares da biblioteca:
   - 2-3 scroll effects
   - 1-2 transitions
   - 3-5 micro-interactions
   Declare as escolhas com justificativa.

Avancar automaticamente (nao precisa de pausa aqui — as decisoes criativas principais ja foram feitas pelo usuario).

---

## Etapa 8: Layout

Execute a skill `gerar-layout`:
- Usar copy.md, design system, DNA visual, efeitos selecionados
- Layout serve o CONTEUDO (sem variabilidade forcada)
- Referenciar efeitos da biblioteca com caminho de arquivo e parametros

**PAUSA:** Apresente resumo das secoes ao usuario (nome, arquetipo, efeito principal de cada uma).
- Se aprovar → avancar
- Se pedir ajustes → corrigir

---

## Etapa 9: Build Secao a Secao

Esta e a etapa mais longa. Construa CADA secao individualmente e mostre ao usuario.

### Para cada secao do layout.md:

1. Leia a especificacao da secao
2. Se a secao usa um efeito da biblioteca: **LEIA o arquivo do efeito e COPIE o codigo literalmente**. Adapte APENAS os tokens CSS
3. Implemente HTML + CSS + JS
4. **Atualize o preview no browser** (o Netlify Dev atualiza automaticamente ao salvar)

### CHECKLIST HERO (bloqueia se falhar)

Antes de apresentar o hero ao usuario, valide:
- [ ] Hero tem mais de uma coluna OU layout assimetrico OU elemento visual alem de texto?
- [ ] Hero tem pelo menos 1 elemento interativo/animado funcionando (nao so texto com fade)?
- [ ] O codigo do efeito da biblioteca foi COPIADO (nao reescrito simplificado)?
- [ ] Hero NAO e: coluna centralizada + headline + subtitulo + botao sobre fundo chapado?

Se qualquer item falhar: REESCREVER o hero antes de continuar. Leia novamente o arquivo do efeito da biblioteca e copie o codigo completo.

### Apresentacao por blocos

Nao precisa pausar para CADA secao individual. Agrupe em blocos logicos:

**Bloco 1:** Hero + primeira secao → **PAUSA** (usuario ve no browser)
**Bloco 2:** Secoes do meio (problema, solucao, features, metricas) → **PAUSA**
**Bloco 3:** Secoes finais (preco, FAQ, CTA, formulario) → **PAUSA**

Em cada pausa, informe a URL e pergunte: "Como esta ficando? Quer ajustar algo neste bloco?"

---

## Etapa 10: Ajustes Finais

Apos todos os blocos construidos:

1. Abra o preview da pagina completa
2. Informe URL ao usuario
3. Pergunte: "A pagina esta completa. O que voce gostaria de ajustar?"
4. Faca quantas iteracoes de ajuste forem necessarias
5. So avance quando o usuario disser que esta satisfeito

---

## Etapa 11: Otimizar (Opcional)

"Quer que eu otimize a performance? (recomendado para PageSpeed 90+)"

- Se sim → execute skill `otimizar`
- Se nao → pular

---

## Etapa 12: Publicar (Opcional)

"Quer publicar agora?"

- Se sim → execute skill `publicar`
- Se nao → informar que o projeto esta pronto localmente

---

## Regras da Pipeline

### Decisoes Criativas = Sempre do Usuario
- Paleta de cores → 3 opcoes no browser
- Font pairing → 3 opcoes no browser
- Hero pattern → 3 opcoes no browser
- Ajustes em cada bloco → feedback visual no browser

### Efeitos da Biblioteca = Sempre Copiados Literalmente
- LEIA o arquivo .md do efeito
- COPIE o codigo HTML, CSS e JS
- SUBSTITUA apenas variaveis CSS pelos tokens do projeto
- NUNCA reescreva ou simplifique
- Se o efeito tem IntersectionObserver, Dynamic Import, requestAnimationFrame — MANTENHA

### Validacao Ativa (nao passiva)
- Checklist HERO e obrigatorio e bloqueia progresso se falhar
- Se detectar hero centralizado simples → reescrever ANTES de mostrar ao usuario
- Se detectar efeito simplificado (menos linhas que o original da biblioteca) → recopiar ANTES de mostrar

### Tratamento de Erros
- Se uma etapa falhar, informe o erro e pergunte como prosseguir
- NUNCA pule uma etapa por causa de erro
- NUNCA continue se a etapa atual nao foi concluida

### Autonomia no Terminal
- Execute TODOS os comandos sozinho
- NUNCA peca para o usuario rodar comandos
- Unica excecao: autorizacao OAuth no navegador
