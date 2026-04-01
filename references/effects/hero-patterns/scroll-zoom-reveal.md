# Scroll Zoom Reveal

## Quando usar
Hero que começa com uma imagem/elemento fazendo zoom in enquanto o conteúdo é revelado durante o scroll. Cria efeito cinematográfico de "mergulhar" na cena. Ideal para portfolios, imobiliário, turismo, editorial. Tom imersivo e dramático.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--szr-bg` | `#0a0a0a` | Cor de fundo |
| `--szr-scale-start` | `1.3` | Escala inicial da imagem (via JS) |
| `--szr-scale-end` | `1` | Escala final da imagem (via JS) |
| `--szr-clip-start` | `inset(15%)` | Clip-path inicial (via JS) |
| `--szr-clip-end` | `inset(0%)` | Clip-path final (via JS) |
| `--szr-overlay-opacity` | `0.4` | Opacidade do overlay escuro |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="szr-hero" id="scrollZoomHero">
  <div class="szr-hero__media" id="szrMedia">
    <img src="assets/hero-bg.webp" alt="" class="szr-hero__img" loading="eager" />
    <div class="szr-hero__overlay" aria-hidden="true"></div>
  </div>
  <div class="szr-hero__content" id="szrContent">
    <h1 class="szr-hero__title">Immerse Yourself</h1>
    <p class="szr-hero__subtitle">Scroll to explore the experience</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.szr-hero {
  --szr-bg: var(--color-bg, #0a0a0a);
  --szr-overlay-opacity: 0.4;

  position: relative;
  width: 100%;
  height: 200vh;
  background: var(--szr-bg);
}

.szr-hero__media {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  clip-path: inset(15%);
  will-change: clip-path;
}

.szr-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.3);
  will-change: transform;
}

.szr-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, var(--szr-overlay-opacity));
  pointer-events: none;
}

.szr-hero__content {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  z-index: 2;
  pointer-events: none;
}

.szr-hero__title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.szr-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.8));
  margin: 0;
  line-height: 1.5;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .szr-hero {
    height: 100vh;
  }
  .szr-hero__media {
    position: absolute;
    clip-path: none;
  }
  .szr-hero__img {
    transform: none;
  }
  .szr-hero__content {
    position: relative;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('scrollZoomHero');
  const media = document.getElementById('szrMedia');
  const content = document.getElementById('szrContent');
  if (!hero || !media) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const img = media.querySelector('.szr-hero__img');

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    /* Zoom out image (scale 1.3 → 1) */
    tl.to(img, {
      scale: 1,
      ease: 'none',
    }, 0);

    /* Expand clip-path (inset 15% → inset 0%) */
    tl.to(media, {
      clipPath: 'inset(0%)',
      ease: 'none',
    }, 0);

    /* Fade in content */
    if (content) {
      tl.fromTo(content, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 0.3,
      }, 0.2);
    }
  });
})();
```

## Integração
A seção tem `height: 200vh` para dar espaço ao scroll animation. O media é `sticky` para ficar fixo enquanto a animação acontece. O clip-path cria a moldura que se abre. A imagem começa com scale maior e "assenta" no tamanho final. O conteúdo aparece sobre a imagem após a revelação. A imagem deve ser grande o suficiente para não perder qualidade com o scale.

## Variações

### Variação 1: Circle Reveal
Em vez de inset retangular, abre como um círculo.
```javascript
// Alterar clip-path values:
// Inicial no CSS: clip-path: circle(20% at 50% 50%);
tl.to(media, {
  clipPath: 'circle(100% at 50% 50%)',
  ease: 'none',
}, 0);
```
```css
.szr-hero__media {
  clip-path: circle(20% at 50% 50%);
}
```

### Variação 2: No Clip (Apenas Zoom)
Sem clip-path — apenas o efeito de zoom da imagem. Mais sutil.
```css
.szr-hero__media {
  clip-path: none;
}
.szr-hero__img {
  transform: scale(1.5);
}
```
```javascript
tl.to(img, { scale: 1, ease: 'none' }, 0);
// Adicionar overlay fade
tl.to(media.querySelector('.szr-hero__overlay'), {
  opacity: 0,
  ease: 'none',
}, 0);
```

### Variação 3: Split Zoom (Imagem Abre em Duas Metades)
A imagem se revela abrindo em duas metades horizontais.
```html
<div class="szr-hero__media" id="szrMedia">
  <div class="szr-hero__split szr-hero__split--top" style="clip-path: inset(0 0 50% 0);">
    <img src="assets/hero-bg.webp" alt="" class="szr-hero__img" loading="eager" />
  </div>
  <div class="szr-hero__split szr-hero__split--bottom" style="clip-path: inset(50% 0 0 0);">
    <img src="assets/hero-bg.webp" alt="" class="szr-hero__img" loading="eager" />
  </div>
</div>
```
```javascript
tl.to('.szr-hero__split--top', { y: '-20%', ease: 'none' }, 0);
tl.to('.szr-hero__split--bottom', { y: '20%', ease: 'none' }, 0);
```
