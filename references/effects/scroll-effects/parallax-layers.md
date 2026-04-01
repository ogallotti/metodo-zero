# Parallax Layers

## Quando usar
Seções de conteúdo com elementos que se movem em velocidades diferentes ao scrollar, criando profundidade visual. Diferente do hero parallax — este é para seções de conteúdo no meio da página. Ideal para features sections, about, portfolios. Tom premium e profissional.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--pl-bg` | `#0a0a0a` | Cor de fundo |
| `--pl-speed-slow` | `-50` | Offset Y para elementos lentos (px) |
| `--pl-speed-medium` | `-100` | Offset Y para velocidade média (px) |
| `--pl-speed-fast` | `-150` | Offset Y para elementos rápidos (px) |
| `--pl-section-padding` | `6rem` | Padding vertical da seção |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="pl-section" id="parallaxLayers">
  <div class="pl-section__container">
    <div class="pl-section__grid">
      <div class="pl-section__col pl-section__col--text">
        <span class="pl-section__label" data-pl-speed="slow">Features</span>
        <h2 class="pl-section__heading" data-pl-speed="medium">Built for Performance</h2>
        <p class="pl-section__text" data-pl-speed="fast">
          Every detail is optimized for speed, accessibility, and visual impact.
          Our approach combines cutting-edge techniques with battle-tested patterns.
        </p>
      </div>
      <div class="pl-section__col pl-section__col--visual">
        <div class="pl-section__card pl-section__card--back" data-pl-speed="slow">
          <img src="assets/feature-1.webp" alt="" class="pl-section__card-img" loading="lazy" />
        </div>
        <div class="pl-section__card pl-section__card--front" data-pl-speed="fast">
          <img src="assets/feature-2.webp" alt="" class="pl-section__card-img" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
  <div class="pl-section__deco pl-section__deco--1" data-pl-speed="slow" aria-hidden="true"></div>
  <div class="pl-section__deco pl-section__deco--2" data-pl-speed="fast" aria-hidden="true"></div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.pl-section {
  --pl-bg: var(--color-bg, #0a0a0a);
  --pl-section-padding: clamp(4rem, 10vw, 8rem);

  position: relative;
  background: var(--pl-bg);
  padding: var(--pl-section-padding) 0;
  overflow: hidden;
}

.pl-section__container {
  width: min(90%, 72rem);
  margin: 0 auto;
}

.pl-section__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

.pl-section__col--text {
  padding-right: clamp(1rem, 3vw, 2rem);
}

.pl-section__col--visual {
  position: relative;
  min-height: 400px;
}

.pl-section__label {
  display: inline-block;
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 700;
  color: var(--color-primary, #6366f1);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
}

.pl-section__heading {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1.5rem;
  line-height: 1.15;
}

.pl-section__text {
  font-size: clamp(1rem, 1.8vw, 1.125rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.7;
  margin: 0;
}

.pl-section__card {
  position: absolute;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.pl-section__card--back {
  width: 75%;
  top: 0;
  left: 0;
  z-index: 1;
}

.pl-section__card--front {
  width: 60%;
  bottom: 0;
  right: 0;
  z-index: 2;
}

.pl-section__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  aspect-ratio: 4/3;
}

.pl-section__deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.pl-section__deco--1 {
  width: clamp(100px, 20vw, 300px);
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--color-primary, rgba(99, 102, 241, 0.15)), transparent 70%);
  top: 10%;
  left: -5%;
}

.pl-section__deco--2 {
  width: clamp(80px, 15vw, 200px);
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--color-accent, rgba(236, 72, 153, 0.1)), transparent 70%);
  bottom: 10%;
  right: -3%;
}

@media (max-width: 768px) {
  .pl-section__grid {
    grid-template-columns: 1fr;
  }
  .pl-section__col--visual {
    min-height: 300px;
  }
  .pl-section__card--back {
    position: relative;
    width: 100%;
  }
  .pl-section__card--front {
    position: absolute;
    width: 50%;
    bottom: -1rem;
    right: -0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-pl-speed] {
    transform: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('parallaxLayers');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const speeds = {
    slow: -50,
    medium: -100,
    fast: -150,
  };

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

    const elements = section.querySelectorAll('[data-pl-speed]');

    elements.forEach((el) => {
      const speedKey = el.dataset.plSpeed;
      const yOffset = speeds[speedKey] || -50;

      gsap.to(el, {
        y: yOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });
})();
```

## Integração
Adicionar `data-pl-speed="slow|medium|fast"` a qualquer elemento dentro da seção para aplicar parallax. Quanto mais rápido, mais o elemento se move (sensação de proximidade). Os cards de imagem se sobrepõem criando profundidade. Os decorativos (deco) adicionam textura visual sutil. Layout se adapta para coluna única no mobile.

## Variações

### Variação 1: Opacity + Parallax
Elementos ganham/perdem opacidade conforme scrollam.
```javascript
elements.forEach((el) => {
  const speedKey = el.dataset.plSpeed;
  const yOffset = speeds[speedKey] || -50;

  gsap.fromTo(el,
    { y: -yOffset, opacity: 0 },
    {
      y: yOffset,
      opacity: 1,
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
```

### Variação 2: Horizontal Drift
Elementos se movem lateralmente em vez de verticalmente.
```javascript
const hSpeeds = { slow: -30, medium: -60, fast: -90 };
elements.forEach((el) => {
  const speedKey = el.dataset.plSpeed;
  const xOffset = hSpeeds[speedKey] || -30;

  gsap.to(el, {
    x: xOffset,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```

### Variação 3: Scale Parallax
Elementos mudam de escala conforme scrollam — cria efeito de "zoom".
```javascript
const scaleMap = { slow: 0.95, medium: 1.05, fast: 1.12 };
elements.forEach((el) => {
  const speedKey = el.dataset.plSpeed;
  const scaleEnd = scaleMap[speedKey] || 1;

  gsap.fromTo(el,
    { scale: 1 },
    {
      scale: scaleEnd,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
});
```
