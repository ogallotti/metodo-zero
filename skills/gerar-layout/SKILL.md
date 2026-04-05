---
name: gerar-layout
description: Especificacao detalhada e exaustiva de todas as secoes da landing page. Cria layout.md com valores exatos, efeitos da biblioteca com file paths, DNA Visual em cada secao. Validacao via subagent Diretor de Arte.
---

# Instrucoes

Voce vai transformar a copy e o design aprovado em uma especificacao exaustiva de cada secao da pagina. Este documento sera a biblia para a skill `desenvolver` — tao detalhado que outro modelo executa EXATAMENTE o que foi planejado sem margem para interpretacao.

## Principio Central: Layout Serve o Conteudo

Para CADA secao, a primeira pergunta e: **"qual a melhor forma de apresentar ESTE conteudo?"**

- Se duas colunas e a melhor opcao, use duas colunas — mesmo que a secao anterior tambem use
- Se o conteudo pede um layout vertical denso, use — mesmo que "quebre a variedade"
- Variabilidade e desejavel mas NUNCA a custo de clareza ou adequacao ao conteudo
- NAO force variedade artificial. Force adequacao

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/creative-reference.md` — arquetipos, constraints
3. Leia `references/effects/README.md` — indice da biblioteca de efeitos
4. Os tokens do design system ja estao definidos no `style.css` da pagina (gerados por `gerar-design`). Consulte o `:root` do CSS, nao releia `design-system-guide.md`

## Escopo

Esta skill APENAS:
- Le a copy e o design aprovado
- Cria especificacao detalhada em `layout.md`
- Documenta cada secao com nivel de detalhe de diretor de arte
- Referencia efeitos da biblioteca com file path e parametros exatos
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
- DNA Visual definido em `gerar-design`
- Efeitos da biblioteca selecionados em `gerar-design`
- Arquetipo e constraints usados no hero

---

## Etapa 2: Especificar Cada Secao

### DNA Visual Obrigatorio

Cada secao DEVE referenciar o DNA Visual definido em `gerar-design`:
- Elemento recorrente presente ou adaptado ao contexto da secao
- Tratamento de midia consistente
- Movimento de assinatura respeitado
- Detalhe tipografico mantido

O DNA Visual e o fio condutor. Se uma secao nao o referencia, parece de outro site.

### Variedade com Criterio

Variedade entre secoes e desejavel — mas e consequencia de adaptar o layout ao conteudo, nao um objetivo em si.

- Avalie CADA secao pelo merito do conteudo, nao por quotas de variedade
- Se duas secoes consecutivas pedem layouts similares, use layouts similares
- Se o conteudo pede algo radicalmente diferente da secao anterior, use sem medo

### PADROES PROIBIDOS

NUNCA use:
- 3 cards lado a lado com icones genericos
- Grid simetrico de features/beneficios
- Secao de depoimentos com foto circular + texto
- Lista de bullets com checkmarks
- FAQ com accordion basico sem estilo
- Layout que parece template generico

---

## Etapa 3: Referenciar Efeitos da Biblioteca

Para cada secao que usa efeito da biblioteca, especifique com file path EXATO e parametros:

```
Efeito: references/effects/scroll-effects/pin-and-reveal.md
Variacao: [nome da variacao, se houver]
Parametros:
  - Cores: var(--color-primary), var(--color-surface)
  - Duracao: var(--duration-slow)
  - Easing: var(--ease-dramatic)
  - Trigger: 20% viewport
  - Elementos: [quais elementos da secao participam]
```

Os efeitos foram pre-selecionados em `gerar-design`. Distribua-os entre as secoes de forma coerente com o conteudo.

### Instrucao Critica para a Skill Desenvolver

A skill `desenvolver` vai COPIAR o codigo do efeito LITERALMENTE do arquivo da biblioteca. Por isso, o layout.md DEVE especificar:
1. O **file path exato** do efeito (ex: `references/effects/scroll-effects/stagger-grid-reveal.md`)
2. Qual **variacao** usar (se o efeito tem multiplas)
3. Quais **tokens CSS** substituir e com quais valores
4. Como o efeito se **integra** ao conteudo da secao

Se o file path estiver errado ou vago, o `desenvolver` nao consegue copiar. Seja preciso.

---

## Etapa 4: Criar a Especificacao

Crie `layout.md` na pasta da pagina com a especificacao COMPLETA.

### Estrutura Obrigatoria para CADA Secao

```markdown
## Secao X: [Nome]

### Arquetipo e Constraints
- Arquetipo: [nome]
- Constraints: [lista]
- Justificativa: [por que esta combinacao funciona para ESTE conteudo]

### DNA Visual nesta Secao
- Elemento recorrente: [como aparece aqui]
- Tratamento de midia: [se aplicavel]
- Movimento de assinatura: [como se manifesta]
- Detalhe tipografico: [como se manifesta]

### Efeitos da Biblioteca
- Efeito: [file path exato em references/effects/]
- Variacao: [qual]
- Parametros: [tokens, trigger, elementos]
(ou "Nenhum efeito de biblioteca nesta secao" — e valido)

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

O nivel de detalhe deve ser tal que outro modelo consiga executar EXATAMENTE o que voce planejou, pixel por pixel, sem interpretar ou improvisar.

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

Apos o layout.md completo, invoque o subagent Diretor de Arte usando a ferramenta Agent com o seguinte prompt:

```
Voce e o Diretor de Arte, um avaliador critico de coerencia visual e narrativa para landing pages de alto impacto.

## Sua Missao

Avaliar o layout.md como um diretor de arte exigente avaliaria um storyboard antes da producao. Nada passa sem justificativa.

## Arquivos para Ler

1. [CAMINHO/layout.md] — a especificacao completa
2. [CAMINHO/style.css] — o design system com tokens e DNA Visual
3. [CAMINHO/copy.md] — a copy aprovada

## Criterios de Avaliacao

Avalie CADA secao em 6 dimensoes:

### 1. Coerencia Visual (DNA Visual)
O DNA Visual (elemento recorrente, tratamento de midia, movimento de assinatura, detalhe tipografico) esta presente e adaptado em TODAS as secoes? Alguma secao parece desconectada do todo?

### 2. Adequacao ao Conteudo
Cada secao usa o layout mais adequado para SEU conteudo especifico? Existe algum caso onde o layout foi escolhido por "variedade" e nao por adequacao? O principio "layout serve o conteudo" esta sendo respeitado?

### 3. Progressao Visual
A pagina conta uma historia visual progressiva? Existe um arco — abertura impactante, desenvolvimento com ritmo, climax visual, fechamento forte? Ou e uma sequencia plana sem dinamica?

### 4. Monotonia vs Desconexao
Existe monotonia (todas as secoes parecem iguais, mesmo ritmo, mesma estrutura)? Existe desconexao (cada secao parece de um site diferente)? O equilibrio esta correto?

### 5. Efeitos da Biblioteca
Os efeitos referenciados sao coerentes entre si e com o tom do projeto? Os file paths estao corretos? Os parametros estao especificados? Algum efeito esta sendo usado de forma que contradiz o DNA Visual?

### 6. Completude da Especificacao
Faltam especificacoes em alguma secao? Algum valor esta vago ("padding grande", "animacao legal")? Todos os estados estao descritos? Responsividade esta coberta?

## Formato de Resposta

VEREDITO: APROVADO ou AJUSTES NECESSARIOS

Se AJUSTES NECESSARIOS, para CADA problema:
- Secao: [numero e nome]
- Dimensao: [qual dos 6 criterios]
- Problema: [descricao concreta]
- Sugestao: [ajuste especifico com valores, nao generico]
```

Se o Diretor de Arte apontar ajustes, corrija o layout.md ANTES de apresentar ao usuario. Se necessario, rode a validacao novamente ate obter APROVADO.

---

## Ao Finalizar

1. Informe que a especificacao foi salva
2. Faca um resumo: "Secao X: Arquetipo [Y] + Constraints [A, B] + Efeito [Z]"
3. Destaque os elementos mais interessantes planejados
4. Pergunte se quer ajustar algo
5. Sugira: "Quando a especificacao estiver aprovada, use `desenvolver` para construir a pagina completa."

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario. NUNCA comece a implementar HTML, CSS ou JavaScript.
