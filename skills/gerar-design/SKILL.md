---
name: gerar-design
description: Define identidade visual completa da landing page. Gera design system, seleciona efeitos da biblioteca, define DNA Visual, implementa hero + primeira secao como demonstracao.
---

# Instrucoes

Voce vai definir a identidade visual completa da landing page. Isso inclui um design system robusto, selecao de efeitos da biblioteca, DNA visual, e uma demonstracao real (Hero + primeira secao).

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/creative-reference.md` — arquetipos, constraints, font pairings
3. Leia `references/design-system-guide.md` — guia completo de tokens

## Escopo

Esta skill APENAS:
- Coleta referencias visuais do usuario
- Gera design system completo (tokens CSS)
- Seleciona efeitos da biblioteca
- Define DNA Visual
- Implementa Hero + primeira secao como demonstracao
- Abre preview no browser para validacao

Esta skill NAO:
- Cria a pagina inteira
- Cria layout de todas as secoes
- Escreve copy

---

## Etapa 1: Coletar Informacoes

### Identificar a Pasta da Pagina

Localize a pasta da pagina (criada por `gerar-copy`). Leia o `copy.md` dentro dela.

### Versao Alternativa (se aplicavel)

Se o usuario pedir nova versao:
1. Criar `_backup_vN/` dentro da pasta da pagina
2. Mover `index.html` e `style.css` atuais para o backup
3. Nova versao fica na raiz da pasta

### Perguntar Referencias

"Voce tem alguma referencia visual para este projeto?
- Sites que gosta do estilo
- Marcas com identidade visual similar
- Cores da marca / logo
- Prints de inspiracao

Pode mandar links, imagens, ou descrever. Se nao tiver, vou criar algo baseado na copy e no nicho."

Se o usuario enviar sites de referencia, analise os padroes visuais. Se nao enviar, derive a direcao do nicho + copy.

---

## Etapa 2: Design System Completo

ANTES de qualquer implementacao visual, gere o design system completo seguindo `references/design-system-guide.md`.

### 2.1 Font Pairing

Consulte `references/creative-reference.md` e escolha:
- Categoria que encaixa no projeto (Editorial, Brutalist, Agnostic, Avant-Garde, Cinematic)
- Combo especifico com pesos indicados

**FONTES PROIBIDAS:** Fraunces, Playfair Display, Montserrat, Poppins, Roboto, Lato, Raleway, Lora, Open Sans, Merriweather, Source Sans Pro.

Declare: "Fontes: [Heading] (peso) + [Body] (peso) - [Categoria]"

### 2.2 Escala Tipografica

Defina TODOS os niveis com `clamp()`:
- `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-h4`
- `--text-body`, `--text-body-sm`, `--text-caption`, `--text-overline`

### 2.3 Paleta de Cores

Defina paleta derivada do briefing/nicho/referencias:
- Primary + light/dark/muted
- Secondary + light/dark
- Accent + light/dark
- Background, Surface, Surface-alt
- Text, Text-muted, Text-inverse
- Border, Border-light
- Error, Success

### 2.4 Sombras, Espacamento, Animacao

- 3 niveis de sombra (subtle, medium, dramatic)
- Escala de espacamento (xs a 5xl, multiplos de 4px)
- Tokens de animacao (4 duracoes + 4 easings)

### 2.5 Salvar Tokens no CSS

Atualize o `:root` do `style.css` da pagina com TODOS os tokens. Substitua os placeholders do template pelos valores reais do design system.

---

## Etapa 3: DNA Visual

Defina o DNA Visual — o que torna ESTA pagina unica. Siga `references/design-system-guide.md`:

1. **Elemento recorrente**: qual elemento visual se repete entre secoes
2. **Tratamento de midia**: como fotos/videos sao tratados
3. **Movimento de assinatura**: qual tipo de movimento define a pagina
4. **Detalhe tipografico**: tratamento tipografico que se repete

O DNA Visual deve ser concreto e especifico. Registre-o como comentario no `style.css` ou em um bloco no topo do arquivo para referencia futura.

---

## Etapa 4: Selecao de Efeitos

Consulte `references/effects/README.md` (indice da biblioteca) e selecione:

- **1 hero pattern** da categoria `hero-patterns/`
- **2-3 scroll effects** da categoria `scroll-effects/`
- **1-2 transitions** da categoria `transitions/`
- **3-5 micro-interactions** da categoria `micro-interactions/`

Para cada efeito selecionado, declare:
- Nome do efeito e caminho do arquivo
- Por que encaixa no tom do projeto
- Quais parametros serao customizados

Os efeitos serao referenciados no `layout.md` (gerado por `gerar-layout`) e implementados no `desenvolver`.

---

## Etapa 5: Escolhas Criativas para o Hero

### Arquetipo de Composicao

Escolha da `references/creative-reference.md`:
Declare: "Hero: Arquetipo [NOME] - [ESSENCIA]"

### Constraints Criativos

Escolha 2+ constraints de categorias DIFERENTES:
Declare: "Constraints: [A] (categoria), [B] (categoria)"

### PADROES PROIBIDOS

NUNCA use:
- Hero centralizado com headline + subheadline + botao
- 3 cards lado a lado com icones
- Grid simetrico de features
- Layout que parece template SaaS

---

## Etapa 6: Implementar Demonstracao

Crie o Hero + primeira secao real no `index.html` e `style.css` da pasta da pagina.

### Copiar Efeito da Biblioteca

Para o hero pattern selecionado:
1. Leia o arquivo do efeito em `references/effects/hero-patterns/`
2. Copie o codigo (HTML, CSS, JS)
3. Adapte parametros para o design system do projeto (usar `var(--...)`)
4. Integre no `index.html`

### Principios de Execucao

**Tipografia:** Hierarquia dramatica, contraste de pesos extremo, tamanho que cria impacto.
**Layout:** Espaco negativo intencional, relacao visual clara, assimetria com tensao.
**Cor:** Paleta com personalidade, gradientes sofisticados, contraste que serve a hierarquia.
**Movimento:** Animacoes com proposito, timing com ritmo, interatividade que surpreende.

### Regras Tecnicas

- Hero NUNCA tem animacao de ENTRADA (opacity:0, fade, data-aos). Animacoes pos-carregamento sao permitidas
- Todas as cores via `var(--color-...)`, espacamentos via `var(--space-...)`, etc.
- Fontes carregadas via Google Fonts com preconnect
- Responsivo (mobile-first ou com media queries adequadas)
- `prefers-reduced-motion` respeitado

### Recursos Disponiveis

- CSS moderno (grid, flexbox, clamp, container queries)
- CSS scroll-driven animations
- clip-path, mask-image, backdrop-filter, mix-blend-mode
- GSAP para animacoes complexas (Dynamic Import via IntersectionObserver)
- Three.js para 3D (Dynamic Import)
- Canvas/WebGL (Dynamic Import)

---

## Etapa 7: Preview e Apresentacao

### Abrir no Browser

Consulte `references/local-server.md` para iniciar o Netlify Dev (se nao estiver rodando). Informe a URL ao usuario.

### Apresentar ao Usuario

Informe:
1. Design system definido (font pairing, paleta, tokens)
2. DNA Visual escolhido
3. Efeitos selecionados da biblioteca (com justificativa)
4. Arquetipo e constraints do hero
5. URL para preview no browser

Peca feedback: "O que achou da direcao visual? Quer ajustar algo antes de prosseguir?"

---

## Ao Finalizar

1. Informe o que foi criado e as escolhas de design
2. Forneca link para preview (OBRIGATORIO)
3. Pergunte se quer ajustar algo
4. Se o usuario aprovar, sugira: "Use `gerar-layout` para criar a especificacao detalhada de todas as secoes."

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario. NUNCA crie mais secoes alem do Hero + primeira secao. NUNCA inicie a proxima skill automaticamente.
