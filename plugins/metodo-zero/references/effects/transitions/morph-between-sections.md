# Morph Between Sections

## Quando usar
Elemento compartilhado que "morphs" entre seções — uma forma, card ou imagem transiciona suavemente de uma posição/tamanho para outra ao scrollar. Ideal para product showcases, storytelling, case studies, feature tours. Tom fluido e conectado. Cria continuidade visual entre seções.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--mbs-radius-start` | `50%` | Border-radius inicial |
| `--mbs-radius-end` | `0.75rem` | Border-radius final |
| `--mbs-bg` | `#6366f1` | Cor do elemento morphing |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="mbs-section mbs-section--start" id="mbsSectionStart">
  <div class="mbs-section__content">
    <h2 class="mbs-section__title">The Idea</h2>
    <p class="mbs-section__text">It starts as a simple concept</p>
  </div>
  <div class="mbs-morph" id="mbsMorph">
    <span class="mbs-morph__label">Evolving</span>
  </div>
</section>

<section class="mbs-section mbs-section--end" id="mbsSectionEnd">
  <div class="mbs-section__content">
    <h2 class="mbs-section__title">The Product</h2>
    <p class="mbs-section__text">And becomes something real</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.mbs-section {
  --mbs-radius-start: 50%;
  --mbs-radius-end: 0.75rem;
  --mbs-bg: var(--color-primary, #6366f1);

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--color-bg, #0a0a0a);
}

.mbs-section__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 40rem;
  z-index: 1;
}

.mbs-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
}

.mbs-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
}

.mbs-morph {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: var(--mbs-radius-start);
  background: var(--mbs-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, width, height, border-radius;
  z-index: 2;
}

.mbs-morph__label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .mbs-morph { width: 80px; height: 80px; }
  .mbs-morph__label { font-size: 0.625rem; }
}

@media (prefers-reduced-motion: reduce) {
  .mbs-morph {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    border-radius: var(--mbs-radius-end) !important;
    padding: 2rem;
  }
}
```

## JavaScript

```javascript
(function () {
  const sectionStart = document.getElementById('mbsSectionStart');
  const sectionEnd = document.getElementById('mbsSectionEnd');
  const morph = document.getElementById('mbsMorph');
  if (!sectionStart || !sectionEnd || !morph) return;

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

    /* Reparent morph to body for fixed positioning during animation */
    const rect = morph.getBoundingClientRect();
    morph.style.position = 'fixed';
    morph.style.top = rect.top + 'px';
    morph.style.left = rect.left + 'px';
    document.body.appendChild(morph);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionStart,
        start: 'center center',
        endTrigger: sectionEnd,
        end: 'center center',
        scrub: true,
        pin: false,
      },
    });

    tl.to(morph, {
      width: '100vw',
      height: '60vh',
      borderRadius: '0.75rem',
      top: '20vh',
      left: '0',
      ease: 'none',
    });

    tl.to(morph.querySelector('.mbs-morph__label'), {
      fontSize: '2rem',
      ease: 'none',
    }, 0);
  });
})();
```

## Integração
O elemento `.mbs-morph` inicia como um círculo pequeno na primeira seção e se transforma em um bloco grande na segunda. O GSAP ScrollTrigger controla a morphing via scrub. O elemento é reparentado ao body para permitir posicionamento fixo durante a transição.

## Variações

### Variação 1: Image Morph
Imagem que morfa de thumbnail para hero.
```html
<div class="mbs-morph" id="mbsMorph">
  <img src="assets/product.webp" alt="Product" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />
</div>
```
```javascript
tl.to(morph, {
  width: 'min(90%, 60rem)',
  height: '70vh',
  borderRadius: '1rem',
  top: '15vh',
  left: '50%',
  xPercent: -50,
  ease: 'none',
});
```

### Variação 2: Shape Morph (Circle → Square → Diamond)
Múltiplas etapas de transformação.
```javascript
const tl = gsap.timeline({ scrollTrigger: { trigger: sectionStart, start: 'top top', endTrigger: sectionEnd, end: 'bottom bottom', scrub: true } });
tl.to(morph, { borderRadius: '0%', width: '200px', height: '200px', duration: 0.5 })
  .to(morph, { rotation: 45, width: '160px', height: '160px', duration: 0.5 });
```

### Variação 3: Color Transition Morph
Elemento troca de cor durante a morphing.
```javascript
tl.to(morph, {
  width: '80vw',
  height: '50vh',
  borderRadius: '1rem',
  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
  ease: 'none',
});
```
