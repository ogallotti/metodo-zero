# Split Screen Animated

## Quando usar
Hero dividida em duas metades (ou mais) que animam independentemente — uma lado com texto, outra com visual (imagem, vídeo, ilustração). As metades podem deslizar, revelar ou interagir ao scroll/hover. Ideal para comparações, before/after, dual CTAs, produto + texto. Tom sofisticado e equilibrado.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ss-bg-left` | `#0a0a0a` | Cor de fundo do lado esquerdo |
| `--ss-bg-right` | `#111827` | Cor de fundo do lado direito |
| `--ss-split` | `50%` | Posição do split (ajustável) |
| `--ss-gap` | `0` | Gap entre as metades |
| `--ss-animation-duration` | `1.2s` | Duração da animação de entrada |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`

## HTML

```html
<section class="ss-hero" id="splitScreenHero">
  <div class="ss-hero__left">
    <div class="ss-hero__left-content">
      <span class="ss-hero__label">New Release</span>
      <h1 class="ss-hero__title">Crafted with Precision</h1>
      <p class="ss-hero__text">Every detail designed to perfection. Experience the difference quality makes.</p>
      <a href="#" class="ss-hero__cta">Explore Now</a>
    </div>
  </div>
  <div class="ss-hero__right">
    <div class="ss-hero__right-media">
      <img src="assets/hero-visual.webp" alt="Product visual" class="ss-hero__img" loading="eager" />
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
```

## CSS

```css
.ss-hero {
  --ss-bg-left: var(--color-bg, #0a0a0a);
  --ss-bg-right: var(--color-bg-alt, #111827);
  --ss-split: 50%;
  --ss-gap: 0px;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--ss-split) 1fr;
  gap: var(--ss-gap);
  overflow: hidden;
}

.ss-hero__left {
  background: var(--ss-bg-left);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
  clip-path: inset(0);
}

.ss-hero__left-content {
  max-width: 30rem;
}

.ss-hero__label {
  display: inline-block;
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 700;
  color: var(--color-primary, #6366f1);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.ss-hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1.25rem;
  line-height: 1.1;
}

.ss-hero__text {
  font-size: clamp(1rem, 1.8vw, 1.125rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0 0 2rem;
}

.ss-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ss-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

.ss-hero__right {
  background: var(--ss-bg-right);
  position: relative;
  overflow: hidden;
  clip-path: inset(0);
}

.ss-hero__right-media {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ss-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .ss-hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto 50vh;
    min-height: auto;
  }
  .ss-hero__left {
    padding: clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 3rem);
  }
  .ss-hero__left-content {
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ss-hero__left,
  .ss-hero__right,
  .ss-hero__left-content,
  .ss-hero__right-media {
    clip-path: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('splitScreenHero');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined') return cb();
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined') { clearInterval(check); cb(); }
    }, 50);
  }

  waitForGSAP(function () {
    const left = hero.querySelector('.ss-hero__left');
    const right = hero.querySelector('.ss-hero__right');
    const leftContent = hero.querySelector('.ss-hero__left-content');
    const rightMedia = hero.querySelector('.ss-hero__right-media');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1.2 },
    });

    /* Left side slides in from left */
    tl.from(left, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power4.inOut',
    });

    /* Right side slides in from right */
    tl.from(right, {
      clipPath: 'inset(0 0 0 100%)',
      duration: 1,
      ease: 'power4.inOut',
    }, '<0.15');

    /* Content fades in */
    tl.from(leftContent.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
    }, '-=0.5');

    /* Image scales in */
    tl.from(rightMedia, {
      scale: 1.2,
      opacity: 0,
      duration: 1,
    }, '-=0.8');
  });
})();
```

## Integração
O layout é CSS Grid, facilitando ajustar a proporção do split via `--ss-split`. O lado esquerdo é texto, o direito é visual — inverter no HTML se necessário. Em mobile, vira coluna única. O clip-path animation cria o efeito de "cortinas abrindo". A imagem deve preencher todo o lado direito.

## Variações

### Variação 1: Diagonal Split
Divisão diagonal em vez de reta vertical.
```css
.ss-hero {
  grid-template-columns: 1fr;
  position: relative;
}
.ss-hero__left {
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%);
  z-index: 2;
}
.ss-hero__right {
  min-height: 100vh;
}
```

### Variação 2: Hover Shift Split
A linha de divisão move-se sutilmente ao passar o mouse.
```javascript
// Adicionar após a timeline:
hero.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const split = 45 + x * 10; // 45% to 55%
  hero.style.setProperty('--ss-split', split + '%');
}, { passive: true });

hero.addEventListener('mouseleave', () => {
  gsap.to(hero, {
    '--ss-split': '50%',
    duration: 0.6,
    ease: 'power2.out',
  });
});
```

### Variação 3: Triple Split
Três colunas em vez de duas.
```html
<section class="ss-hero ss-hero--triple" id="splitScreenHero">
  <div class="ss-hero__panel">...</div>
  <div class="ss-hero__panel">...</div>
  <div class="ss-hero__panel">...</div>
</section>
```
```css
.ss-hero--triple {
  grid-template-columns: 1fr 1fr 1fr;
}
@media (max-width: 768px) {
  .ss-hero--triple { grid-template-columns: 1fr; }
}
```
