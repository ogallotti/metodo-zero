---
name: otimizar
description: Otimizacao de performance para PageSpeed 90+. Mede antes/depois com Lighthouse, audita, corrige problemas seguramente.
---

# Instrucoes

Meta: **Score 90+ no PageSpeed** (Desktop E Mobile) e **60 FPS constantes**.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/optimize.md` — contem TODAS as tecnicas, checklists e armadilhas

## REGRA DE OURO

**Medir ANTES, medir DEPOIS. Se piorou, reverter.**

---

## FASE 0: MEDIR ANTES (OBRIGATORIO)

NUNCA pule esta fase. Sem a nota inicial, nao da para saber se as mudancas ajudaram.

Garanta que o servidor local esta rodando (consulte `references/local-server.md`). Depois meça:

```bash
# Desktop
npx lighthouse http://localhost:8888/CAMINHO --chrome-flags="--headless=new" --preset=desktop --output=json --output-path=./lighthouse-desktop-antes.json --quiet

# Mobile
npx lighthouse http://localhost:8888/CAMINHO --chrome-flags="--headless=new" --output=json --output-path=./lighthouse-mobile-antes.json --quiet
```

Extraia e apresente os scores antes de prosseguir. Se o site esta publicado, use a URL de producao.

---

## FASE 1: AUDITORIA (OBRIGATORIA)

NUNCA corrija antes de completar a auditoria. Leia TODOS os arquivos (index.html, style.css, script.js) e identifique TODOS os problemas.

Siga o checklist completo de auditoria em `references/optimize.md`:
- Imagens, Hero/LCP, AOS, Fontes, Resource Hints, Scripts, Third-Party, Runtime, Videos/Iframes

Classifique cada problema como SEGURO ou CONDICIONAL.

Verifique se alguma "otimizacao" perigosa ja foi aplicada (CSS async sem inline, fontes async, AOS via Interaction Trigger).

**Apresente relatorio completo e aguarde aprovacao antes de corrigir.**

---

## FASE 2: CORRECOES SEGURAS

Estas SEMPRE melhoram. Aplicar TODAS. Consulte `references/optimize.md` para os patterns corretos:
1. Imagens (CDN, width/height numerico, loading correto)
2. Hero/LCP (sem opacity:0, sem data-aos, min-height fixo)
3. AOS (disableMutationObserver, once, DOMContentLoaded)
4. Resource Hints (preconnect, dns-prefetch, preload hero)
5. Fontes (sincronas com preconnect + display=swap, max 2-3 weights)
6. Scripts (defer, modulos pesados NAO no HTML)
7. Videos/Iframes (poster, preload=none, loading=lazy)
8. Acessibilidade (prefers-reduced-motion)

---

## FASE 3: CORRECOES CONDICIONAIS

Estas PODEM melhorar se feitas corretamente. Aplicar uma de cada vez. Consulte `references/optimize.md`:
- Dynamic Import + IntersectionObserver para modulos pesados
- Third-party via requestIdleCallback
- Critical CSS Inline + CSS Async (SOMENTE com inline completo)
- content-visibility (SOMENTE em secoes abaixo do fold com altura conhecida)

---

## NUNCA FAZER

Consulte a lista completa em `references/optimize.md`. Principais:
1. CSS async SEM critical CSS inline
2. Google Fonts async
3. AOS via Interaction Trigger
4. contain: layout paint em secoes com overflow
5. Interaction Trigger com fallback < 20s

---

## FASE 4: VALIDACAO

Medir novamente com Lighthouse. Comparar ANTES vs DEPOIS.

Se a nota CAIU, identificar qual mudanca causou e reverter.

Apresentar tabela comparativa ao usuario. Limpar arquivos temporarios do Lighthouse.

## Ao Finalizar

Apresente a tabela comparativa. PARE e aguarde instrucao do usuario.
