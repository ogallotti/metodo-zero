# Parallax Depth Hero

## Quando usar
Hero com múltiplas camadas que se movem em velocidades diferentes ao fazer scroll, criando sensação de profundidade. Ideal para storytelling visual, landing pages de produto, portfólios imersivos, turismo. Tom cinematográfico e imersivo.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--pd-height` | `100vh` | Altura da hero section |
| `--pd-layer-count` | `3` | Número de camadas (via HTML) |
| `--pd-speed-back` | `0.3` | Velocidade parallax da camada mais distante |
| `--pd-speed-mid` | `0.6` | Velocidade parallax da camada intermediária |
| `--pd-speed-front` | `0.9` | Velocidade parallax da camada mais próxima |
| `--pd-overlay-color` | `rgba(0,0,0,0.3)` | Overlay sobre as camadas |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="pd-hero" id="parallaxDepthHero">
  <div class="pd-hero__layers">
    <div class="pd-hero__layer pd-hero__layer--back" data-pd-speed="0.3">
      <img src="assets/hero-bg-back.webp" alt="" class="pd-hero__img" loading="eager" />
    </div>
    <div class="pd-hero__layer pd-hero__layer--mid" data-pd-speed="0.6">
      <img src="assets/hero-bg-mid.webp" alt="" class="pd-hero__img" loading="eager" />
    </div>
    <div class="pd-hero__layer pd-hero__layer--front" data-pd-speed="0.9">
      <img src="assets/hero-bg-front.webp" alt="" class="pd-hero__img" loading="eager" />
    </div>
  </div>
  <div class="pd-hero__overlay" aria-hidden="true"></div>
  <div class="pd-hero__content" data-pd-speed="1.1">
    <h1 class="pd-hero__title">Your Headline Here</h1>
    <p class="pd-hero__subtitle">Supporting text goes here</p>
    <a href="#" class="pd-hero__cta">Explore</a>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.pd-hero {
  --pd-height: 100vh;
  --pd-overlay-color: rgba(0, 0, 0, 0.3);

  position: relative;
  width: 100%;
  height: var(--pd-height);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-hero__layers {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.pd-hero__layer {
  position: absolute;
  inset: -20% 0;
  width: 100%;
  height: 140%;
}

.pd-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pd-hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--pd-overlay-color);
  pointer-events: none;
}

.pd-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.pd-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.pd-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.85));
  margin: 0 0 2rem;
  line-height: 1.5;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
}

.pd-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: var(--color-bg, #ffffff);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pd-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .pd-hero__layer {
    inset: -10% 0;
    height: 120%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pd-hero__layer {
    inset: 0;
    height: 100%;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('parallaxDepthHero');
  if (!hero) return;

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

    const layers = hero.querySelectorAll('[data-pd-speed]');

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.pdSpeed) || 0.5;
      const movement = (1 - speed) * 40;

      gsap.to(layer, {
        yPercent: movement,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    const content = hero.querySelector('.pd-hero__content');
    if (content) {
      gsap.to(content, {
        yPercent: 50,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });
    }
  });
})();
```

## Integração
Precisa de 2-3 imagens de camada (back, mid, front). Idealmente imagens PNG com transparência para mid e front, ou imagens completas com composição pensada em camadas. O parallax é controlado pelo atributo `data-pd-speed` — valores menores = mais lento (mais distante). O conteúdo de texto faz fade-out ao scrollar para baixo.

## Variações

### Variação 1: Color Gradient Layers (Sem Imagens)
Usa gradientes CSS em vez de imagens. Ótimo quando não há assets visuais.
```html
<!-- Substituir as tags <img> por divs com background -->
<div class="pd-hero__layer pd-hero__layer--back" data-pd-speed="0.3"
     style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);"></div>
<div class="pd-hero__layer pd-hero__layer--mid" data-pd-speed="0.6"
     style="background: radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.3), transparent 70%);"></div>
<div class="pd-hero__layer pd-hero__layer--front" data-pd-speed="0.9"
     style="background: radial-gradient(ellipse at 70% 60%, rgba(236,72,153,0.2), transparent 60%);"></div>
```

### Variação 2: Horizontal Parallax
Camadas movem horizontalmente em vez de verticalmente. Efeito de "panorama".
```javascript
// No waitForGSAP callback, substituir:
layers.forEach((layer) => {
  const speed = parseFloat(layer.dataset.pdSpeed) || 0.5;
  const movement = (1 - speed) * 20;

  gsap.to(layer, {
    xPercent: movement,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```

### Variação 3: Scale + Fade Depth
Camadas mais próximas fazem zoom in ao scrollar. Efeito tipo "diver into scene".
```javascript
layers.forEach((layer) => {
  const speed = parseFloat(layer.dataset.pdSpeed) || 0.5;
  const scaleEnd = 1 + speed * 0.3;
  const opacityEnd = speed > 0.7 ? 0 : 1;

  gsap.to(layer, {
    scale: scaleEnd,
    opacity: opacityEnd,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```
