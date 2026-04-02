# Draw SVG on Scroll

## Quando usar
Linhas SVG que se "desenham" progressivamente conforme o scroll. Ideal para ilustrações, mapas, diagramas, fluxogramas, timelines visuais, assinaturas. Tom artesanal e narrativo. O usuário "desenha" ao scrollar.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ds-stroke-color` | `#6366f1` | Cor do traço |
| `--ds-stroke-width` | `2` | Espessura do traço |
| `--ds-fill` | `none` | Fill (geralmente none para contorno) |

## Dependências
- GSAP 3.12+ ou CSS scroll-timeline
- GSAP — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="ds-section" id="drawSvgSection">
  <div class="ds-section__container">
    <svg class="ds-section__svg" id="dsSvg" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="ds-section__path" d="M50,200 C150,50 250,350 400,200 C550,50 650,350 750,200" />
      <circle class="ds-section__path" cx="50" cy="200" r="8" />
      <circle class="ds-section__path" cx="400" cy="200" r="8" />
      <circle class="ds-section__path" cx="750" cy="200" r="8" />
    </svg>
    <div class="ds-section__labels">
      <span class="ds-section__label" style="left:5%;">Start</span>
      <span class="ds-section__label" style="left:47%;">Midpoint</span>
      <span class="ds-section__label" style="left:90%;">Goal</span>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.ds-section {
  --ds-stroke-color: var(--color-primary, #6366f1);
  --ds-stroke-width: 2;

  background: var(--color-bg, #0a0a0a);
  padding: clamp(6rem, 15vw, 12rem) 0;
}

.ds-section__container {
  width: min(90%, 60rem);
  margin: 0 auto;
  position: relative;
}

.ds-section__svg {
  width: 100%;
  height: auto;
}

.ds-section__path {
  stroke: var(--ds-stroke-color);
  stroke-width: var(--ds-stroke-width);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ds-section__path[cx] {
  fill: var(--ds-stroke-color);
  stroke: none;
}

.ds-section__labels {
  position: relative;
  display: flex;
  margin-top: 1rem;
}

.ds-section__label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: var(--color-text-muted, rgba(255, 255, 255, 0.5));
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (prefers-reduced-motion: reduce) {
  .ds-section__path {
    stroke-dashoffset: 0 !important;
    opacity: 1 !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('drawSvgSection');
  const svg = document.getElementById('dsSvg');
  if (!section || !svg) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const paths = svg.querySelectorAll('.ds-section__path');

  /* Set up stroke-dasharray for each path */
  paths.forEach((path) => {
    if (path.tagName === 'circle') {
      path.style.opacity = '0';
      return;
    }
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return cb();
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        clearInterval(check);
        cb();
      }
    }, 50);
  }

  waitForGSAP(function () {
    gsap.registerPlugin(ScrollTrigger);

    paths.forEach((path) => {
      if (path.tagName === 'circle') {
        gsap.to(path, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: true,
          },
        });
        return;
      }

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
        },
      });
    });
  });
})();
```

## Integração
Qualquer SVG path funciona — basta adicionar classe `.ds-section__path`. O JS calcula `getTotalLength()` automaticamente para cada path. Circles/formas com fill usam opacity em vez de strokeDashoffset. O SVG pode ser qualquer ilustração, ícone, mapa ou diagrama.

## Variações

### Variação 1: Multiple Colors
Paths com cores diferentes para seções do desenho.
```css
.ds-section__path:nth-child(1) { stroke: #6366f1; }
.ds-section__path:nth-child(2) { stroke: #ec4899; }
.ds-section__path:nth-child(3) { stroke: #06b6d4; }
```

### Variação 2: Glow Effect
Traço com efeito de neon/glow.
```css
.ds-section__path {
  filter: drop-shadow(0 0 6px var(--ds-stroke-color)) drop-shadow(0 0 12px var(--ds-stroke-color));
}
```

### Variação 3: Sequential Draw (Path by Path)
Cada path desenha após o anterior completar.
```javascript
let delay = 0;
paths.forEach((path, i) => {
  if (path.tagName === 'circle') return;
  const pct = 1 / paths.length;
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: `top ${60 - i * 10}%`,
      end: `top ${30 - i * 10}%`,
      scrub: true,
    },
  });
});
```
