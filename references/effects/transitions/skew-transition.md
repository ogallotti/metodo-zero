# Skew Transition

## Quando usar
Transição entre seções com skew/inclinação — uma seção sai com um skew enquanto a próxima entra com skew oposto, criando uma troca dinâmica e angular. Ideal para sites criativos, agências, portfolios, landing pages com energia. Tom ousado e moderno. Adiciona dinamismo ao fluxo de navegação.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--st-angle` | `-3deg` | Ângulo do skew |
| `--st-overlap` | `4rem` | Sobreposição entre seções |
| `--st-bg-a` | `#0a0a0a` | Cor da seção A |
| `--st-bg-b` | `#111827` | Cor da seção B |

## Dependências
- CSS puro (estático) / GSAP para versão animada
- GSAP — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="st-section st-section--a">
  <div class="st-section__content">
    <h2 class="st-section__title">Dynamic Entry</h2>
    <p class="st-section__text">Angular transitions create momentum</p>
  </div>
  <div class="st-section__skew"></div>
</section>

<section class="st-section st-section--b">
  <div class="st-section__content">
    <h2 class="st-section__title">Bold Direction</h2>
    <p class="st-section__text">Each section slides in with purpose</p>
  </div>
  <div class="st-section__skew"></div>
</section>

<section class="st-section st-section--a">
  <div class="st-section__content">
    <h2 class="st-section__title">Keep Moving</h2>
    <p class="st-section__text">The flow never stops</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.st-section {
  --st-angle: -3deg;
  --st-overlap: 4rem;

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.st-section--a { background: var(--st-bg-a, #0a0a0a); }
.st-section--b { background: var(--st-bg-b, #111827); }

.st-section__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
  z-index: 1;
}

.st-section__title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.st-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
}

.st-section__skew {
  position: absolute;
  bottom: calc(var(--st-overlap) * -1);
  left: -5%;
  right: -5%;
  height: calc(var(--st-overlap) * 2);
  z-index: 2;
  transform: skewY(var(--st-angle));
}

.st-section--a .st-section__skew {
  background: var(--st-bg-b, #111827);
}

.st-section--b .st-section__skew {
  background: var(--st-bg-a, #0a0a0a);
}

/* Push content above skew */
.st-section { padding-bottom: var(--st-overlap); }

@media (max-width: 768px) {
  .st-section { --st-angle: -2deg; --st-overlap: 2.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .st-section__content { opacity: 1 !important; transform: none !important; }
}
```

## JavaScript

```javascript
(function () {
  const sections = document.querySelectorAll('.st-section');
  if (!sections.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

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

    sections.forEach((section, i) => {
      const content = section.querySelector('.st-section__content');
      if (!content) return;

      const direction = i % 2 === 0 ? -1 : 1;

      gsap.fromTo(content,
        {
          x: direction * 80,
          opacity: 0,
          skewX: direction * 3,
        },
        {
          x: 0,
          opacity: 1,
          skewX: 0,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  });
})();
```

## Integração
O efeito skew é criado por pseudo-divs `.st-section__skew` posicionadas no bottom de cada seção, com `skewY` aplicado. Isso gera a transição angular entre as cores de fundo. O JS anima o conteúdo com um skewX + translate na entrada. Alterne entre `--a` e `--b` para cores de seções consecutivas.

## Variações

### Variação 1: Double Skew (V-Shape)
Duas linhas de skew criando um V entre seções.
```css
.st-section__skew--double::before,
.st-section__skew--double::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
}
.st-section__skew--double::before {
  left: 0;
  transform: skewY(3deg);
  background: inherit;
}
.st-section__skew--double::after {
  right: 0;
  transform: skewY(-3deg);
  background: inherit;
}
.st-section__skew--double { transform: none; background: transparent; }
```

### Variação 2: Animated Skew on Scroll
O ângulo do skew muda dinamicamente com o scroll.
```javascript
gsap.to(section.querySelector('.st-section__skew'), {
  skewY: '3deg',
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Variação 3: Alternating Directions
Skews alternados (esquerda/direita) a cada seção.
```css
.st-section:nth-child(odd) .st-section__skew { transform: skewY(var(--st-angle)); }
.st-section:nth-child(even) .st-section__skew { transform: skewY(calc(var(--st-angle) * -1)); }
```
