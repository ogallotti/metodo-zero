---
name: gerar-copy
description: Geracao de copy persuasiva para landing pages. Cria textos completos com validacao anti-IA via subagent Critico de Copy.
---

# Instrucoes

Voce vai criar a copy (textos) da landing page. Seu objetivo e gerar textos persuasivos que NAO parecam gerados por IA.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin para garantir que todas as regras globais serao respeitadas
2. Leia `references/copy-rules.md` INTEGRALMENTE — esta e sua referencia principal para tom, voz, proibicoes e criterios de avaliacao

## Escopo

Esta skill APENAS:
- Cria ou melhora os textos da landing page
- Salva a copy estruturada no arquivo `copy.md` (UTF-8, sempre com acentuacao correta)
- Valida a copy via subagent Critico de Copy

Esta skill NAO:
- Cria pagina HTML, CSS ou JavaScript
- Faz design ou layout
- Implementa nada visualmente

## Processo

### 1. Criar Pasta da Pagina (se necessario)

Se a pasta da pagina ainda nao existir, pergunte ao usuario o nome e crie-a na raiz do projeto.

Apos criar a pasta, verifique no `netlify.toml` se ja existe um redirect da home (`from = "/"`). Se NAO existir, adicione:

```toml
[[redirects]]
  from = "/"
  to = "/NOME-DA-PAGINA/"
  status = 302
  force = true
```

### 2. Entender o Contexto

Colete do usuario:
- O que e o produto/servico?
- Quem e o publico-alvo?
- Qual o objetivo da pagina? (gerar leads, vender, captar inscritos)
- Qual o diferencial principal?
- Ha textos existentes que devem ser mantidos?
- Ha referencias ou tom de voz especificos?

Se ja existir um `index.html` na pasta, leia para ver textos existentes.

### 3. Gerar a Copy

Ao escrever, siga RIGOROSAMENTE as regras de `references/copy-rules.md`:

**Principio Fundamental:** Toda pagina tem objetivo comercial. Copy constroi desejo E conduz a acao.

**Tom:** Densidade narrativa, tom elevado, substancia textual, variacao de ritmo, progressao narrativa.

**Proibicoes:** Consulte a lista completa em `references/copy-rules.md`. As principais:
- Zero anaforas e paralelismo excessivo
- Zero formulas "Nao e X... e Y" ou variacoes
- Zero vocabulario da lista proibida (O jogo, Invisivel, Poderosas, Experiencia, Proposito, etc.)
- Zero emojis
- Maximo 3 adjetivos por paragrafo
- Zero falsas promessas de brevidade

**Estrutura recomendada:**
- Hero: headline de impacto (max 10 palavras) + subheadline + CTA
- Problema/dor do publico
- Solucao/beneficios (com substancia, nao bullets estereis)
- Prova social (depoimentos, numeros)
- Como funciona (se aplicavel)
- FAQ (objecoes comuns)
- CTA final

**Principios obrigatorios:**
1. Abertura com impacto e clareza imediata sobre a oferta
2. Pontos de acao distribuidos ao longo da pagina
3. Cada secao com composicao textual distinta
4. Copy de folego — argumentacoes completas, nao resumos

### 4. Salvar o copy.md

Salve em `NOME-DA-PAGINA/copy.md`:

```markdown
# Copy - [Nome do Projeto]

## SEO
- Title: [max 60 caracteres]
- Meta Description: [max 155 caracteres]
- OG Title: [titulo para compartilhamento]
- OG Description: [descricao para compartilhamento]

## Hero
- Headline: ...
- Subheadline: ...
- CTA: ...

## Secao: [Nome Descritivo]
- Titulo: ...
- Conteudo: ...
- CTA: ... (se aplicavel)

## Depoimentos
- Nome: ...
  Cargo/Contexto: ...
  Texto: ...

## FAQ
- Pergunta: ...
  Resposta: ...

## CTA Final
- Titulo: ...
- Texto: ...
- CTA: ...
```

### 5. Validacao via Subagent Critico de Copy

Apos salvar o copy.md, invoque o subagent Critico de Copy usando a ferramenta Agent:

```
Prompt para o subagent:
"Voce e o Critico de Copy, um avaliador implacavel de textos para landing pages.

Leia o arquivo [CAMINHO/copy.md].
Leia as regras em references/copy-rules.md.

Avalie o copy.md contra TODOS os criterios de avaliacao:
1. Padroes repetitivos: mesma estrutura sintatica em 2+ secoes?
2. Anaforas: 3+ paragrafos comecam com mesma palavra?
3. Estruturas recicladas: formulas proibidas aparecem?
4. Vocabulario generico: palavras da lista proibida aparecem?
5. Progressao narrativa: conta uma historia ou e lista disfaracada?
6. Densidade: paragrafos podem ser deletados sem perda?
7. Variacao de ritmo: todas as secoes tem mesma cadencia?
8. Tom: soa como humano culto ou como gerador de texto?

Retorne EXATAMENTE neste formato:
- VEREDITO: APROVADO ou REPROVADO
- Se REPROVADO: liste CADA trecho problematico com:
  - Secao onde esta
  - Trecho exato
  - Qual regra viola
  - Sugestao de direcao (sem reescrever)"
```

### 6. Loop de Correcao

Se o Critico reprovar:
1. Corrija os trechos apontados no copy.md
2. Resubmeta ao Critico (max 2 iteracoes automaticas)
3. Se apos 2 correcoes o Critico ainda reprovar, apresente o estado atual ao usuario com os pontos pendentes e peca feedback

Se o Critico aprovar, prossiga para o passo 7.

## Ao Finalizar

1. Informe ao usuario que a copy foi salva e aprovada pelo Critico
2. Apresente um resumo das secoes criadas
3. Pergunte se quer ajustar algo na copy
4. Sugira a proxima etapa: "Quando a copy estiver aprovada, use `gerar-design` para definir a identidade visual."

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario. NUNCA inicie a proxima skill automaticamente.
