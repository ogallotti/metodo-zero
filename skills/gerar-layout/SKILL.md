---
name: gerar-layout
description: Especificacao detalhada e exaustiva de todas as secoes da landing page. Cria layout.md com valores exatos, efeitos da biblioteca, DNA Visual. Validacao via subagent Diretor de Arte.
---

# Instrucoes

Voce e um Diretor de Arte genial. Sua missao e transformar a copy e o design aprovado em uma especificacao detalhada e exaustiva de cada secao da pagina.

Este documento sera a biblia para a construcao da pagina. Deve ser tao detalhado que qualquer desenvolvedor consiga executar EXATAMENTE o que foi planejado sem margem para interpretacao.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/creative-reference.md` — arquetipos, constraints
3. Leia `references/design-system-guide.md` — para referenciar tokens

## Escopo

Esta skill APENAS:
- Le a copy e o design aprovado
- Cria especificacao detalhada em `layout.md`
- Documenta cada secao com nivel de detalhe de diretor de arte
- Referencia efeitos da biblioteca com parametros
- Valida coerencia via subagent Diretor de Arte

Esta skill NAO:
- Cria pagina HTML, CSS ou JavaScript
- Implementa nada visualmente

---

## Etapa 1: Coletar Materiais

### Identificar a Pasta da Pagina

Localize a pasta da pagina. Os arquivos devem estar dentro dela. Pastas `_backup_` sao versoes antigas — IGNORE.

### Arquivos Necessarios

1. **copy.md** — textos da pagina
2. **index.html + style.css** — design aprovado (hero + primeira secao)

Leia ambos. Se faltar algo, pergunte ao usuario.

### Extrair a Linguagem Visual

Do design aprovado, extraia:
- Paleta de cores exata (tokens `--color-*`)
- Font pairing (MANTER o mesmo em toda a pagina)
- Escala tipografica (tokens `--text-*`)
- Espacamentos (tokens `--space-*`)
- Tokens de animacao (tokens `--duration-*`, `--ease-*`)
- DNA Visual definido
- Efeitos da biblioteca selecionados em `gerar-design`
- Arquetipo e constraints usados no hero

---

## Etapa 2: Principio "Layout Serve o Conteudo"

Para CADA secao, a primeira pergunta e: "qual a melhor forma de apresentar ESTE conteudo?"

- Se duas colunas e a melhor opcao, usar duas colunas — mesmo que a secao anterior tambem use
- Variabilidade e desejavel mas NUNCA a custo de clareza ou adequacao
- NAO force variedade artificial. Force adequacao ao conteudo

### DNA Visual Obrigatorio

Cada secao DEVE referenciar o DNA Visual:
- Elemento recorrente presente ou adaptado
- Tratamento de midia consistente
- Movimento de assinatura respeitado
- Detalhe tipografico mantido

### Variedade com Criterio

- NUNCA repita o mesmo arquetipo em secoes consecutivas (exceto se for a melhor escolha para o conteudo)
- Use pelo menos 4 arquetipos diferentes em paginas com 5+ secoes
- Constraints devem variar entre secoes

### PADROES PROIBIDOS

NUNCA use:
- 3 cards lado a lado com icones
- Grid simetrico de features/beneficios
- Secao de depoimentos com foto circular + texto
- Lista de bullets com checkmarks
- FAQ com accordion basico sem estilo
- Layout que parece template generico

---

## Etapa 3: Consultar Efeitos da Biblioteca

Para cada secao, indique quais efeitos da biblioteca serao aplicados. Referencie o arquivo especifico:

"Scroll effect: `references/effects/scroll-effects/pin-and-reveal.md` com parametros: [cores do projeto, duracao X, easing Y]"

Os efeitos ja foram pré-selecionados em `gerar-design`. Distribua-os entre as secoes de forma coerente.

---

## Etapa 4: Criar a Especificacao

Crie `layout.md` na pasta da pagina com a especificacao COMPLETA.

### Estrutura Obrigatoria para CADA Secao

```markdown
## Secao X: [Nome]

### Arquetipo e Constraints
- Arquetipo: [nome]
- Constraints: [lista]
- Efeitos: [referencias a arquivos da biblioteca com parametros]
- DNA Visual: [como o DNA aparece nesta secao]
- Justificativa: [por que esta combinacao funciona para este conteudo]

### Conteudo
[Todo o texto exato da copy.md]

### Layout
[Estrutura, posicionamentos, proporcoes — valores exatos]
[Usar tokens do design system: var(--space-xl), var(--container-max), etc.]

### Tipografia
[Tokens: var(--text-h2), var(--font-heading), etc.]
[Peso, line-height, letter-spacing — valores exatos]

### Cores
[Tokens: var(--color-primary), var(--color-surface), etc.]
[Incluindo estados hover, active, focus]

### Elementos Visuais
[Imagens, formas, decorativos — com tratamento do DNA Visual]

### Animacoes
[Tipo, duracao (token), delay, easing (token), trigger]
[Referencia ao efeito da biblioteca quando aplicavel]

### Interatividade
[Hover, click, scroll — comportamentos especificos]

### Responsividade
[Breakpoints e mudancas especificas]
```

### Nivel de Detalhe

Especifique VALORES EXATOS para TUDO:
- NAO "padding grande" → SIM `var(--space-4xl)` ou `padding: 96px 0`
- NAO "animacao legal" → SIM `fade-up var(--duration-slow) var(--ease-dramatic) delay 200ms, triggered at 20% viewport`
- NAO "hover bonito" → SIM `translateY(-8px) + scale(1.02) + var(--shadow-medium), var(--duration-normal) var(--ease-dramatic)`
- NAO "texto grande" → SIM `var(--text-h1), font-weight 700, line-height 1.1`
- NAO "cor escura" → SIM `var(--color-text)` ou `#1A1A2E`

---

## Etapa 5: Elementos Encantadores

Alem do obvio, ADICIONE elementos que surpreendem:

### Micro-interacoes
- Cursores customizados em areas especificas
- Tooltips animados
- Feedback visual em interacoes
- Estados de loading interessantes

### Animacoes Elaboradas
- Parallax em elementos especificos
- Scroll-linked animations (CSS animation-timeline)
- Reveal effects com clip-path
- Stagger animations
- Efeitos da biblioteca aplicados com parametros customizados

### Detalhes de Craft
- Gradientes em textos
- Noise/grain textures
- Linhas decorativas animadas
- Shapes organicos flutuantes
- Blend modes criativos

---

## Etapa 6: Validacao via Subagent Diretor de Arte

Apos o layout.md completo, invoque o subagent Diretor de Arte usando a ferramenta Agent:

```
Prompt para o subagent:
"Voce e o Diretor de Arte, um avaliador de coerencia visual para landing pages.

Leia o arquivo [CAMINHO/layout.md].
Leia o style.css do projeto para entender o design system e DNA Visual.

Avalie:
1. Coerencia visual: o DNA Visual esta preservado em todas as secoes?
2. Adequacao: cada secao usa o layout mais adequado para seu conteudo?
3. Progressao: a pagina conta uma historia visual progressiva?
4. Monotonia vs desconexao: existe monotonia (todas parecidas) ou desconexao (cada uma de outro site)?
5. Efeitos: os efeitos da biblioteca sao coerentes entre si e com o tom do projeto?
6. Completude: faltam especificacoes? Algum valor esta vago?

Retorne EXATAMENTE neste formato:
- VEREDITO: APROVADO ou AJUSTES NECESSARIOS
- Se AJUSTES: liste CADA problema com secao, descricao e sugestao concreta"
```

Se o Diretor de Arte apontar ajustes, corrija o layout.md antes de apresentar ao usuario.

---

## Ao Finalizar

1. Informe que a especificacao foi salva
2. Faca um resumo: "Secao X: Arquetipo [Y] + Constraints [A, B] + Efeito [Z]"
3. Destaque os elementos mais interessantes planejados
4. Pergunte se quer ajustar algo
5. Sugira: "Quando a especificacao estiver aprovada, use `desenvolver` para construir a pagina completa."

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario. NUNCA comece a implementar HTML, CSS ou JavaScript.
