---
name: criar-pipeline
description: Pipeline orquestrada que encadeia todas as etapas automaticamente. Do briefing ao deploy com 3 pausas obrigatorias e 2 condicionais.
---

# Instrucoes

Voce e o orquestrador da pipeline completa de criacao de landing pages. Encadeia todas as etapas automaticamente, pausando apenas para decisoes reais do usuario.

## Antes de Comecar

Leia `rules.md` na raiz do plugin.

## Visao Geral do Fluxo

```
1. BRIEFING (interativo)
2. SCAFFOLD (skill iniciar)
3. COPY (skill gerar-copy + Critico de Copy) → PAUSA
4. DESIGN (skill gerar-design) → PAUSA
5. LAYOUT (skill gerar-layout + Diretor de Arte) → PAUSA
6. BUILD (skill desenvolver + QA de Fidelidade) → PAUSA
7. OTIMIZAR (condicional)
8. PUBLICAR (condicional)
```

## Caracteristicas

- **Sequencial:** Cada etapa depende da anterior
- **3 pausas obrigatorias:** copy, design (visual), pagina completa (visual)
- **2 pausas condicionais:** otimizar, publicar
- **Correcoes automaticas:** Subagents podem corrigir problemas sem envolver o usuario (com limite de iteracoes)
- **Autonomia total:** NUNCA peca para o usuario rodar comandos

---

## Etapa 1: Briefing

Colete do usuario em uma unica interacao:

1. **O que e o projeto?** Produto/servico, publico-alvo, objetivo da pagina
2. **Tem referencias visuais?** Links, prints, marcas de referencia
3. **Tem copy pronta ou precisa criar?** Se ja tem textos, onde estao
4. **Nome da pasta da pagina** (ex: "pagina-vendas", "lp-lancamento")

Nao faca perguntas individuais — apresente todas de uma vez e aguarde.

---

## Etapa 2: Scaffold

Execute a skill `iniciar` com o nome fornecido:
- Copiar templates
- Criar pasta da pagina
- Configurar redirect no netlify.toml
- Git init
- Iniciar Netlify Dev

Avancar automaticamente apos conclusao.

---

## Etapa 3: Copy

Execute a skill `gerar-copy`:
- Usar as informacoes do briefing como contexto
- A skill internamente invoca o Critico de Copy
- Correcoes automaticas se reprovado (max 2x)

**PAUSA OBRIGATORIA:** Apresente a copy ao usuario para feedback.

- Se o usuario aprovar → avancar para Etapa 4
- Se pedir ajustes → corrigir e reapresentar (quantas iteracoes forem necessarias)

---

## Etapa 4: Design

Execute a skill `gerar-design`:
- Usar referencias visuais do briefing (se fornecidas)
- A skill gera design system completo + hero + primeira secao
- Abre preview no browser

**PAUSA OBRIGATORIA:** O usuario avalia o hero VISUALMENTE no browser.

- Se aprovar → avancar para Etapa 5
- Se pedir ajustes → corrigir e reapresentar

---

## Etapa 5: Layout

Execute a skill `gerar-layout`:
- A skill cria especificacao completa de todas as secoes
- Internamente invoca o Diretor de Arte para validar coerencia
- Correcoes automaticas se necessario

**PAUSA OBRIGATORIA:** Apresente resumo das secoes ao usuario.

- Se aprovar → avancar para Etapa 6
- Se pedir ajustes → corrigir e reapresentar

---

## Etapa 6: Build

Execute a skill `desenvolver`:
- A skill constroi a pagina completa seguindo layout.md
- Usa efeitos da biblioteca
- Internamente invoca QA de Fidelidade
- Correcoes automaticas se divergencias

**PAUSA OBRIGATORIA:** O usuario avalia a pagina completa VISUALMENTE no browser.

- Se aprovar → avancar para Etapa 7
- Se pedir ajustes → corrigir e reapresentar

---

## Etapa 7: Otimizar (Condicional)

Pergunte ao usuario: "Quer otimizar a performance antes de publicar? (recomendado para PageSpeed 90+)"

- Se sim → execute a skill `otimizar` (mede antes/depois, aplica correcoes)
- Se nao → pular para Etapa 8

---

## Etapa 8: Publicar (Condicional)

Pergunte ao usuario: "Quer publicar agora?"

- Se sim → execute a skill `publicar` (deploy Netlify)
- Se nao → informe que o projeto esta pronto localmente e o usuario pode publicar quando quiser

---

## Regras da Pipeline

### Transicoes Automaticas
- De scaffold para copy: automatico
- De copy aprovada para design: automatico
- De design aprovado para layout: automatico
- De layout aprovado para build: automatico
- De build aprovado para otimizar: perguntar
- De otimizar para publicar: perguntar

### Tratamento de Erros
- Se uma etapa falhar, informe o erro e pergunte como prosseguir
- NUNCA pule uma etapa por causa de erro
- NUNCA continue para a proxima etapa se a atual nao foi concluida

### Formato das Pausas
Ao pausar para feedback:
1. Apresente o resultado da etapa
2. Forneca link do preview quando aplicavel (OBRIGATORIO em design e build)
3. Pergunte diretamente: "Aprovado? Ou quer ajustar algo?"
4. NAO faca perguntas extras desnecessarias
