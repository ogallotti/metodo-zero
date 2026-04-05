---
name: desenvolver
description: Constroi a pagina completa seguindo layout.md. Copia efeitos LITERALMENTE da biblioteca. Valida hero com checklist ativo. Build secao a secao com preview.
---

# Instrucoes

Voce vai construir a pagina completa seguindo a especificacao do `layout.md`. Seu trabalho e EXECUTAR fielmente, sem simplificar ou omitir nada.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/optimize.md` — regras de performance durante construcao

## Escopo

Esta skill APENAS:
- Implementa todas as secoes do `layout.md`
- Copia efeitos da biblioteca LITERALMENTE
- Valida hero com checklist ativo
- Mostra preview ao usuario em blocos

---

## Etapa 1: Carregar Especificacao

1. Localize a pasta da pagina. Ignore `_backup_*`
2. Leia `layout.md` (especificacao), `index.html` (hero ja aprovado), `copy.md` (referencia)
3. Se `layout.md` nao existir → informar ao usuario que precisa usar `gerar-layout` primeiro

### Planejar Execucao

Liste:
1. Secoes a construir (o hero ja existe, nao reconstruir)
2. Efeitos da biblioteca referenciados
3. Bibliotecas CDN necessarias
4. Ordem de execucao

---

## Etapa 2: Como Copiar Efeitos da Biblioteca

Quando o `layout.md` referencia um efeito de `references/effects/`:

### Passo 1: Ler o arquivo COMPLETO do efeito
```
Leia references/effects/[categoria]/[nome-do-efeito].md
```

### Passo 2: Copiar LITERALMENTE
- Copie o bloco HTML para o `index.html`
- Copie o bloco CSS para o `style.css`
- Copie o bloco JS para o `script.js`

### Passo 3: Adaptar APENAS tokens
Substitua variaveis CSS:
- Cores: `var(--color-primary)` etc. (NUNCA hex hardcoded)
- Espacamentos: `var(--space-xl)` etc.
- Duracoes: `var(--duration-slow)` etc.
- Textos: conforme copy.md

### O que NAO fazer
- NAO reescreva o efeito "com suas palavras"
- NAO simplifique removendo linhas
- NAO remova IntersectionObserver, Dynamic Import, requestAnimationFrame
- NAO substitua logica JS complexa por algo mais simples
- Se o efeito da biblioteca tem 200 linhas de JS, o codigo final DEVE ter ~200 linhas (com adaptacoes de tokens)

### Verificacao
Apos copiar, conte as linhas de JS do efeito original e do codigo gerado. Se o gerado tem menos de 70% das linhas do original, voce SIMPLIFICOU. Releia o arquivo e recopie.

---

## Etapa 3: Construir Secao por Secao

### Para cada secao:

1. Releia a especificacao no `layout.md`
2. Se referencia efeito da biblioteca → siga Etapa 2 (copiar literalmente)
3. Implemente HTML + CSS + JS
4. Checklist de fidelidade (abaixo)

### Checklist de Fidelidade por Secao

- [ ] Composicao/layout conforme especificado?
- [ ] Efeito da biblioteca copiado (nao simplificado)?
- [ ] DNA Visual presente (elemento recorrente, detalhe tipografico)?
- [ ] Cores via `var(--color-*)`, espacamentos via `var(--space-*)`?
- [ ] Todos os estados (hover, active, focus)?
- [ ] Animacoes com duracao/delay/easing corretos?
- [ ] Responsivo?

---

## CHECKLIST HERO — VALIDACAO ATIVA (OBRIGATORIO)

Leia e aplique `references/hero-checklist.md` INTEGRALMENTE. O hero e a secao mais critica. Se qualquer item falhar, PARE e REESCREVA antes de continuar.

---

## Etapa 4: Preview em Blocos

Nao pause para cada secao individual. Agrupe:

**Bloco 1:** Hero (ja existente) + secoes iniciais (problema, solucao)
- Salve os arquivos
- Netlify Dev atualiza automaticamente
- Informe URL ao usuario
- **PAUSA:** "Como esta ficando o primeiro bloco?"

**Bloco 2:** Secoes do meio (features, metricas, prova social, autoridade)
- **PAUSA:** feedback visual

**Bloco 3:** Secoes finais (preco, FAQ, CTA, formulario, footer)
- **PAUSA:** feedback visual

---

## Etapa 5: QA de Fidelidade (Subagent)

Apos TODOS os blocos aprovados, invoque subagent QA via ferramenta Agent:

```
Prompt: "Voce e o QA de Fidelidade. Leia [layout.md] e compare com [index.html] + [style.css] + [script.js].

Compare SECAO POR SECAO:
1. Composicao especificada foi implementada?
2. Efeitos da biblioteca estao presentes e completos (nao simplificados)?
3. DNA Visual consistente em todas as secoes?
4. Tokens CSS usados (nao hardcoded)?
5. Todos os estados (hover, active, focus)?
6. Responsividade?
7. Alguma secao simplificada ou omitida?

VEREDITO: APROVADO ou DIVERGENCIAS (com lista detalhada por secao)."
```

Corrigir divergencias CRITICAS e MODERADAS antes de finalizar.

---

## Etapa 6: Checklist Final

### Completude
- [ ] Todas as secoes do `layout.md` implementadas
- [ ] Nenhuma secao simplificada ou omitida
- [ ] Hero passou no checklist ativo

### Performance
- [ ] Hero SEM animacao de entrada
- [ ] AOS com `disableMutationObserver: true` e `once: true`
- [ ] Imagens via Netlify CDN com width/height numerico
- [ ] Scripts pesados via Dynamic Import
- [ ] `prefers-reduced-motion` respeitado

### Acessibilidade
- [ ] Foco visivel em links/botoes
- [ ] Alt text em imagens
- [ ] Hierarquia h1 → h2 → h3
- [ ] Formulario com labels

### Responsividade
- [ ] 375px, 768px, 1440px testados
- [ ] Nenhum overflow horizontal

---

## Etapa 7: Apresentacao Final

1. Informe URL do preview
2. Liste secoes construidas e efeitos aplicados
3. "A pagina esta completa. O que voce gostaria de ajustar?"
4. Itere quantas vezes o usuario precisar

Quando standalone: PARE apos ajustes. Sugira `otimizar` ou `publicar`.
Quando na pipeline: retorne controle ao orquestrador.

---

## Regras de Implementacao

### HTML
- Semantica correta (section, article, figure)
- `data-aos` onde especificado (NUNCA no hero)
- Atributos de acessibilidade

### CSS
- TUDO via tokens: `var(--color-*)`, `var(--space-*)`, `var(--text-*)`
- TODOS os estados (hover, active, focus)
- Mobile-first ou media queries
- `prefers-reduced-motion`

### JavaScript
- Funcoes no `script.js` existente
- Pesados via Dynamic Import + IntersectionObserver
- NUNCA linke modulos pesados no HTML

### Imagens
- Netlify CDN: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`
- width/height NUMERICOS
- Hero: `loading="eager"` + `fetchpriority="high"`
- Resto: `loading="lazy"`
- Pasta `/images/` na RAIZ do projeto

### NUNCA
- Omitir animacao porque "da trabalho"
- Simplificar efeito porque "e complexo"
- Pular responsividade
- Usar valores hardcoded quando existe token
- Remover elementos decorativos
