# Diagonal Reveal

## Quando usar
Transição entre seções com revelação diagonal — a nova seção aparece por trás de um corte diagonal que desliza conforme o scroll. Ideal para separar seções com tom diferente, transições de cor, antes/depois. Tom dinâmico e moderno. Quebra a monotonia de seções retangulares.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--dr-bg-from` | `#0a0a0a` | Cor da seção de origem |
| `--dr-bg-to` | `#111827` | Cor da seção revelada |
| `--dr-angle` | `8deg` | Ângulo da diagonal |
| `--dr-direction` | `left-to-right` | Direção da revelação (via clip-path) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="dr-from" id="drFrom">
  <div class="dr-from__content">
    <h2 class="dr-from__title">Before</h2>
    <p class="dr-from__text">Content of the first section goes here.</p>
  </div>
</section>

<section class="dr-to" id="drTo">
  <div class="dr-to__content">
    <h2 class="dr-to__title">After</h2>
    <p class="dr-to__text">Content revealed with diagonal transition.</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.dr-from {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #0a0a0a);
  z-index: 1;
}

.dr-to {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-alt, #111827);
  z-index: 2;
  clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
  margin-top: -15vh;
}

.dr-from__content,
.dr-to__content {
  width: min(90%, 50rem);
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.dr-from__title,
.dr-to__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.dr-from__text,
.dr-to__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .dr-to {
    clip-path: none;
    margin-top: 0;
  }
}
```

## JavaScript

```javascript
(function () {
  const fromSection = document.getElementById('drFrom');
  const toSection = document.getElementById('drTo');
  if (!fromSection || !toSection) return;

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

    /* Diagonal: polygon goes from right-side-hidden to full reveal with angled edge */
    gsap.to(toSection, {
      clipPath: 'polygon(-15% 0, 100% 0, 100% 100%, 0% 100%)',
      ease: 'none',
      scrollTrigger: {
        trigger: fromSection,
        start: '70% center',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
})();
```

## Integração
A seção "to" sobrepõe levemente a seção "from" (`margin-top: -15vh`) para que a transição aconteça durante a sobreposição. O clip-path diagonal cria o corte angulado. Em reduced-motion, as seções ficam sem overlap e sem clip-path.

## Variações

### Variação 1: Reverse Diagonal (Direita para Esquerda)
Diagonal invertida.
```css
.dr-to {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
}
```
```javascript
gsap.to(toSection, {
  clipPath: 'polygon(0 0, 115% 0, 100% 100%, 0 100%)',
  ease: 'none',
  scrollTrigger: {
    trigger: fromSection,
    start: '70% center',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Variação 2: Double Diagonal (V-Shape)
Duas diagonais se encontram formando um V no centro.
```css
.dr-to {
  clip-path: polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%);
}
```
```javascript
gsap.to(toSection, {
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: fromSection,
    start: '70% center',
    end: 'bottom top',
    scrub: true,
  },
});
```

### Variação 3: Zigzag Edge
Borda zigzag em vez de diagonal reta.
```css
.dr-to {
  clip-path: polygon(
    100% 0, 100% 0, 100% 100%, 100% 100%
  );
}
```
```javascript
// Animate para uma borda zigzag:
gsap.to(toSection, {
  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  ease: 'none',
  scrollTrigger: {
    trigger: fromSection,
    start: '70% center',
    end: 'bottom top',
    scrub: true,
  },
});
// Para zigzag visual real, usar SVG clipPath path em vez de polygon
```
