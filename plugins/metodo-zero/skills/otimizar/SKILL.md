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

Extraia e apresente os scores:

```bash
node -e "
const d=require('./lighthouse-desktop-antes.json');
const m=require('./lighthouse-mobile-antes.json');
const fmt=(r,label)=>{const c=r.categories.performance.score*100;const a=r.audits;return label+': '+c.toFixed(0)+' | LCP: '+a['largest-contentful-paint'].displayValue+' | TBT: '+a['total-blocking-time'].displayValue+' | CLS: '+a['cumulative-layout-shift'].displayValue+' | FCP: '+a['first-contentful-paint'].displayValue};
console.log(fmt(d,'DESKTOP'));
console.log(fmt(m,'MOBILE'));
"
```

Apresente os resultados ao usuario antes de prosseguir. Se o site ja esta publicado, substitua `http://localhost:8888/CAMINHO` pela URL de producao.

---

## FASE 1: AUDITORIA (OBRIGATORIA)

NUNCA corrija antes de completar a auditoria.

### Passo 1: Ler Todos os Arquivos

Leia COMPLETAMENTE: `index.html`, `style.css`, `script.js` e qualquer CSS/JS linkado.

### Passo 2: Identificar TODOS os Problemas

Siga o checklist completo de auditoria em `references/optimize.md`:

- **Imagens**: Para CADA `<img>`: Netlify CDN? width/height numericos? loading correto?
- **Hero/LCP (CRITICO)**: opacity:0? data-aos? Animacao de entrada? transform inicial? min-height fixo?
- **AOS**: `disableMutationObserver: true`? `once: true`? Inicializa no DOMContentLoaded?
- **Fontes**: Quantos weights? (max 3) `display=swap`? `preconnect`?
- **Resource Hints**: preconnect fonts? dns-prefetch analytics? preload hero?
- **Scripts**: Para CADA `<script>`: tem defer? Modulos pesados com import estatico? Linkados no HTML?
- **Third-Party**: Analytics/pixels carregam imediatamente? Deveriam usar requestIdleCallback.
- **JS Runtime**: Multiplos RAF loops? Scroll sem throttle? Nao pausa off-screen?
- **Videos/Iframes**: Videos sem poster/preload="none"? Iframes sem loading="lazy"?

### Passo 3: Classificar e Apresentar

Classifique cada problema:
- **SEGURO** = correcao que SEMPRE melhora (imagens, hero, AOS config, resource hints)
- **CONDICIONAL** = correcao que PODE melhorar se feita corretamente (Dynamic Import, content-visibility)

**IMPORTANTE: Verificar se alguma "otimizacao" perigosa JA foi aplicada:**
- CSS com `media="print" onload` SEM `<style>` inline critico? -> REVERTER para sincrono OU adicionar critical CSS inline
- Google Fonts com `media="print" onload`? -> REVERTER para sincrono com preconnect
- AOS inicializado via Interaction Trigger? -> REVERTER para init normal no DOMContentLoaded
- `contain: layout paint` em secoes com overflow? -> REMOVER

Apresente o relatorio completo. **Aguarde aprovacao antes de corrigir.**

---

## FASE 2: CORRECOES SEGURAS

Estas mudancas SEMPRE melhoram a nota. Aplicar TODAS. Consulte `references/optimize.md` para os patterns corretos.

### Regras

1. Corrigir TODAS as imagens, nao algumas
2. Remover biblioteca = CSS + JS + codigo + classes HTML
3. width/height = NUMEROS (nunca "auto", "100%")
4. **NUNCA desabilitar recursos - otimizar para que funcionem**

### Itens

1. **Imagens** - CDN com `q=80`, width/height numerico, hero `loading="eager"` + `fetchpriority="high"`, resto `loading="lazy"`
2. **Hero/LCP** - Remover opacity:0, data-aos, animacoes de entrada, transform inicial. Adicionar min-height fixo. Texto e CTAs visiveis no primeiro frame.
3. **AOS** - `disableMutationObserver: true`, `once: true`, init no DOMContentLoaded. NUNCA adiar com Interaction Trigger.
4. **Resource Hints** - preconnect fonts, dns-prefetch analytics, preload hero image
5. **Fontes** - Sincronas com preconnect + display=swap. Max 2-3 weights.
6. **Scripts** - defer. Modulos pesados NAO no HTML, so Dynamic Import.
7. **Videos/Iframes** - poster, preload=none, loading=lazy
8. **Acessibilidade** - prefers-reduced-motion media query

---

## FASE 3: CORRECOES CONDICIONAIS

Estas mudancas PODEM ajudar, mas exigem cuidado. Aplicar uma de cada vez e verificar resultado. Consulte `references/optimize.md` para detalhes e codigo:

- **Dynamic Import + IntersectionObserver** para modulos pesados (Three.js, GSAP, particulas). NUNCA Interaction Trigger com fallback.
- **Third-party** via requestIdleCallback
- **Critical CSS Inline + CSS Async** - SOMENTE com inline completo cobrindo TODO o above-fold. Verificar CLS apos aplicar.
- **content-visibility** - SOMENTE em secoes BEM abaixo do fold com altura conhecida
- **JS Runtime** - Unico RAF loop, throttle no scroll, pausar off-screen/tab inativa

---

## NUNCA FAZER

Consulte a lista completa em `references/optimize.md` (secao NUNCA FAZER e ERROS COMUNS DO AGENTE). Principais:

1. CSS async SEM critical CSS inline
2. Google Fonts async (media="print")
3. AOS via Interaction Trigger
4. contain: layout paint em secoes com overflow
5. Interaction Trigger com fallback < 20s

**Se alguma dessas ja foi aplicada, REVERTER como parte da otimizacao.**

---

## FASE 4: VALIDACAO

### Passo 1: Verificar cada correcao

Confirmar que cada problema da auditoria foi corrigido.
Relatorio: CORRIGIDO / NAO CORRIGIDO / NAO APLICAVEL

### Passo 2: Verificar no DevTools

- **Network Tab:** Modulos pesados NAO aparecem no carregamento inicial, SO apos scroll ate a secao.
- **Console:** Zero erros.

### Passo 3: Medir DEPOIS

Rodar Lighthouse novamente (mesma URL, mesmo servidor):

```bash
# Desktop
npx lighthouse http://localhost:8888/CAMINHO --chrome-flags="--headless=new" --preset=desktop --output=json --output-path=./lighthouse-desktop-depois.json --quiet

# Mobile
npx lighthouse http://localhost:8888/CAMINHO --chrome-flags="--headless=new" --output=json --output-path=./lighthouse-mobile-depois.json --quiet
```

Comparar ANTES vs DEPOIS:

```bash
node -e "
const da=require('./lighthouse-desktop-antes.json');
const dd=require('./lighthouse-desktop-depois.json');
const ma=require('./lighthouse-mobile-antes.json');
const md=require('./lighthouse-mobile-depois.json');
const g=(r,k)=>r.audits[k].displayValue;
const s=(r)=>(r.categories.performance.score*100).toFixed(0);
console.log('            | ANTES | DEPOIS | DIFF');
console.log('Desktop     |  '+s(da)+'   |  '+s(dd)+'    | '+(s(dd)-s(da)>0?'+':'')+(s(dd)-s(da)));
console.log('Mobile      |  '+s(ma)+'   |  '+s(md)+'    | '+(s(md)-s(ma)>0?'+':'')+(s(md)-s(ma)));
console.log('LCP Desktop | '+g(da,'largest-contentful-paint')+' | '+g(dd,'largest-contentful-paint'));
console.log('LCP Mobile  | '+g(ma,'largest-contentful-paint')+' | '+g(md,'largest-contentful-paint'));
console.log('CLS Desktop | '+g(da,'cumulative-layout-shift')+' | '+g(dd,'cumulative-layout-shift'));
console.log('CLS Mobile  | '+g(ma,'cumulative-layout-shift')+' | '+g(md,'cumulative-layout-shift'));
console.log('TBT Desktop | '+g(da,'total-blocking-time')+' | '+g(dd,'total-blocking-time'));
console.log('TBT Mobile  | '+g(ma,'total-blocking-time')+' | '+g(md,'total-blocking-time'));
"
```

**Se a nota CAIU:** Identificar qual mudanca causou a queda e reverter. As correcoes SEGURAS nunca causam queda - o problema esta nas CONDICIONAIS ou em algo que entrou na lista NUNCA FAZER.

### Passo 4: Limpar arquivos temporarios

```bash
rm -f lighthouse-desktop-antes.json lighthouse-desktop-depois.json lighthouse-mobile-antes.json lighthouse-mobile-depois.json
```

---

## REGRAS

- **NUNCA** corrija sem auditoria completa
- **NUNCA** corrija parcialmente (todas as imagens, nao algumas)
- **NUNCA** use import estatico para bibliotecas pesadas
- **NUNCA** linke modulos pesados no HTML
- **NUNCA** torne CSS async SEM critical CSS inline
- **NUNCA** torne fontes async
- **NUNCA** adie AOS com Interaction Trigger
- **NUNCA** desabilite recursos - otimize para que funcionem
- **NUNCA** deploy sem comparar nota antes/depois
- **NUNCA** prossiga automaticamente - aguarde comando explicito

## Ao Finalizar

Apresente a tabela comparativa. PARE e aguarde instrucao do usuario.
