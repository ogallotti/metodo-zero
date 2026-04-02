# Scale on Scroll

## Quando usar
Elementos que escalam (zoom in ou zoom out) conforme o scroll. Imagens crescem de pequeno a full-screen, ou texto diminui ao sair da viewport. Ideal para hero transitions, image reveals, seções de impacto, product showcase. Tom cinematográfico e imersivo.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--sos-scale-start` | `0.6` | Escala inicial (via JS) |
| `--sos-scale-end` | `1` | Escala final (via JS) |
| `--sos-radius-start` | `2rem` | Border-radius inicial |
| `--sos-radius-end` | `0` | Border-radius final |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="sos-section" id="scaleOnScrollSection">
  <div class="sos-section__media" id="sosMedia">
    <img src="assets/showcase.webp" alt="Product showcase" class="sos-section__img" loading="lazy" />
    <div class="sos-section__overlay">
      <h2 class="sos-section__title">See It Full Screen</h2>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.sos-section {
  background: var(--color-bg, #0a0a0a);
  padding: clamp(4rem, 10vw, 8rem) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150vh;
}

.sos-section__media {
  width: 60%;
  border-radius: 2rem;
  overflow: hidden;
  position: sticky;
  top: 10vh;
  will-change: transform, border-radius;
}

.sos-section__img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}

.sos-section__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.sos-section__title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .sos-section__media { width: 85%; }
}

@media (prefers-reduced-motion: reduce) {
  .sos-section__media { transform: none !important; border-radius: 0 !important; width: 100% !important; }
  .sos-section { min-height: auto; padding: 2rem 0; }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('scaleOnScrollSection');
  const media = document.getElementById('sosMedia');
  if (!section || !media) return;

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

    gsap.fromTo(media,
      { scale: 0.6, borderRadius: '2rem' },
      {
        scale: 1,
        width: '100%',
        borderRadius: '0rem',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        },
      }
    );
  });
})();
```

## Integração
A imagem começa pequena (60% width, scale 0.6, rounded) e cresce para full-width conforme o scroll. Sticky positioning mantém o elemento visível durante a animação. A seção precisa de min-height extra para dar espaço de scroll.

## Variações

### Variação 1: Scale Out (Zoom Out)
Imagem começa grande e encolhe ao scrollar.
```javascript
gsap.fromTo(media,
  { scale: 1.3, borderRadius: '0rem' },
  { scale: 1, borderRadius: '1.5rem', ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } }
);
```

### Variação 2: Scale + Fade Content
Texto faz fade conforme a imagem escala.
```javascript
gsap.to(media.querySelector('.sos-section__overlay'), {
  opacity: 0,
  ease: 'none',
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'center center', scrub: true },
});
```

### Variação 3: Multi-Element Scale
Vários elementos escalam com velocidades diferentes.
```html
<div class="sos-section__grid">
  <div data-sos-scale="0.5">...</div>
  <div data-sos-scale="0.7">...</div>
  <div data-sos-scale="0.3">...</div>
</div>
```
```javascript
section.querySelectorAll('[data-sos-scale]').forEach(el => {
  const start = parseFloat(el.dataset.sosScale);
  gsap.fromTo(el, { scale: start }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 30%', scrub: true }
  });
});
```
