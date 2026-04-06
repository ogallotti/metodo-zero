# Scroll Progress Indicator

## Quando usar
Barra de progresso visual que indica quanto da página/seção foi scrollada. Ideal para landing pages longas, artigos, case studies, documentação. Tom funcional e elegante. Ajuda orientação do usuário em conteúdo longo. CSS puro (progressive enhancement com JS fallback).

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--sp-color` | `#6366f1` | Cor da barra de progresso |
| `--sp-height` | `3px` | Altura da barra |
| `--sp-position` | `fixed` | Posição (fixed top ou dentro de seção) |
| `--sp-z-index` | `9999` | Z-index da barra |
| `--sp-bg` | `transparent` | Cor de fundo atrás da barra |
| `--sp-gradient` | `none` | Gradiente opcional para a barra |

## Dependências
- CSS `scroll-timeline` (com fallback JS para browsers sem suporte)
- Nenhuma dependência externa

## HTML

```html
<!-- Opção 1: Barra global (topo da página) -->
<div class="sp-bar" id="scrollProgressBar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Page scroll progress">
  <div class="sp-bar__fill"></div>
</div>

<!-- Opção 2: Barra dentro de uma seção específica -->
<section class="sp-section" id="scrollProgressSection">
  <div class="sp-section__progress">
    <div class="sp-section__progress-fill"></div>
  </div>
  <div class="sp-section__content">
    <h2>Your long content here</h2>
    <p>Content...</p>
  </div>
</section>
```

## CSS

```css
/* === OPÇÃO 1: Barra Global (topo da página) === */

.sp-bar {
  --sp-color: var(--color-primary, #6366f1);
  --sp-height: 3px;
  --sp-z-index: 9999;
  --sp-bg: transparent;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--sp-height);
  background: var(--sp-bg);
  z-index: var(--sp-z-index);
  pointer-events: none;
}

.sp-bar__fill {
  height: 100%;
  width: 0%;
  background: var(--sp-color);
  transform-origin: left;
  will-change: width;
}

/* CSS scroll-timeline approach (modern browsers) */
@supports (animation-timeline: scroll()) {
  .sp-bar__fill {
    width: 100%;
    animation: sp-fill-bar linear both;
    animation-timeline: scroll(root);
  }

  @keyframes sp-fill-bar {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
}

/* === OPÇÃO 2: Barra dentro de seção === */

.sp-section {
  position: relative;
  background: var(--color-bg, #0a0a0a);
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.sp-section__progress {
  --sp-color: var(--color-primary, #6366f1);
  --sp-height: 3px;

  position: sticky;
  top: 0;
  width: 100%;
  height: var(--sp-height);
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.sp-section__progress-fill {
  height: 100%;
  width: 0%;
  background: var(--sp-color);
  will-change: width;
}

.sp-section__content {
  width: min(90%, 55rem);
  margin: 0 auto;
  padding-top: 2rem;
}

.sp-section__content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1.5rem;
  line-height: 1.2;
}

.sp-section__content p {
  font-size: clamp(1rem, 1.8vw, 1.125rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .sp-bar__fill,
  .sp-section__progress-fill {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  /* === OPÇÃO 1: Global progress bar (JS fallback) === */
  const globalBar = document.getElementById('scrollProgressBar');
  if (globalBar) {
    const fill = globalBar.querySelector('.sp-bar__fill');
    const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

    if (!supportsScrollTimeline && fill) {
      let ticking = false;

      function updateGlobalProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        fill.style.width = progress + '%';
        globalBar.setAttribute('aria-valuenow', Math.round(progress));
        ticking = false;
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateGlobalProgress);
          ticking = true;
        }
      }, { passive: true });

      updateGlobalProgress();
    }
  }

  /* === OPÇÃO 2: Section progress bar === */
  const section = document.getElementById('scrollProgressSection');
  if (section) {
    const fill = section.querySelector('.sp-section__progress-fill');
    if (!fill) return;

    let ticking = false;

    function updateSectionProgress() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolledInSection = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const progress = Math.min(100, Math.max(0, (scrolledInSection / totalScrollable) * 100));

      fill.style.width = progress + '%';
      ticking = false;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          updateSectionProgress();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { threshold: 0 }
    );

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateSectionProgress);
        ticking = true;
      }
    }

    observer.observe(section);
  }
})();
```

## Integração
**Opção 1 (Global):** Colocar o HTML no início do `<body>`. A barra aparece no topo de toda a página. Usa CSS `scroll-timeline` nativamente com fallback JS para Safari/Firefox mais antigos.

**Opção 2 (Seção):** Colocar dentro da seção desejada. A barra fica sticky no topo da seção e indica progresso dentro daquela seção.

Ambas são independentes — usar uma ou outra, ou ambas simultaneamente sem conflito.

## Variações

### Variação 1: Gradient Progress
Barra com gradiente em vez de cor sólida.
```css
.sp-bar__fill {
  background: linear-gradient(90deg,
    var(--color-primary, #6366f1),
    #ec4899,
    #f59e0b
  );
}
```

### Variação 2: Circular Progress (Canto da Tela)
Indicador circular em vez de barra horizontal.
```html
<!-- Substituir o HTML global por: -->
<div class="sp-circle" id="scrollProgressCircle" aria-label="Scroll progress">
  <svg viewBox="0 0 36 36" class="sp-circle__svg">
    <circle class="sp-circle__track" cx="18" cy="18" r="16" fill="none" stroke-width="2" />
    <circle class="sp-circle__fill" id="spCircleFill" cx="18" cy="18" r="16" fill="none" stroke-width="2"
            stroke-dasharray="100.53" stroke-dashoffset="100.53" />
  </svg>
  <span class="sp-circle__text" id="spCircleText">0%</span>
</div>
```
```css
.sp-circle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sp-circle__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.sp-circle__track { stroke: rgba(255,255,255,0.1); }
.sp-circle__fill { stroke: var(--color-primary, #6366f1); transition: stroke-dashoffset 0.1s; }
.sp-circle__text {
  position: absolute;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-text, #ffffff);
}
```
```javascript
// Substituir JS global:
const circle = document.getElementById('scrollProgressCircle');
if (circle) {
  const fillCircle = document.getElementById('spCircleFill');
  const textEl = document.getElementById('spCircleText');
  const circumference = 2 * Math.PI * 16; // r=16
  let ticking = false;

  function updateCircle() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    fillCircle.style.strokeDashoffset = circumference * (1 - progress);
    textEl.textContent = Math.round(progress * 100) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateCircle); ticking = true; }
  }, { passive: true });
  updateCircle();
}
```

### Variação 3: Top + Bottom Dual Bar
Duas barras — uma no topo (progress) e uma no bottom (remaining).
```html
<div class="sp-bar sp-bar--top" id="scrollProgressBar">
  <div class="sp-bar__fill"></div>
</div>
<div class="sp-bar sp-bar--bottom">
  <div class="sp-bar__fill sp-bar__fill--remaining" id="spRemainingFill"></div>
</div>
```
```css
.sp-bar--bottom {
  top: auto;
  bottom: 0;
}
.sp-bar__fill--remaining {
  background: var(--color-accent, #ec4899);
  width: 100%;
}
```
```javascript
// Adicionar ao updateGlobalProgress:
const remainingFill = document.getElementById('spRemainingFill');
if (remainingFill) {
  remainingFill.style.width = (100 - progress) + '%';
}
```
