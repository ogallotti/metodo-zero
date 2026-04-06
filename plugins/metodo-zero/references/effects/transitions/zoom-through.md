# Zoom Through

## Quando usar
Transição que simula um "zoom through" — a seção atual escala para dentro (como se o usuário mergulhasse nela) e a próxima seção emerge por trás. Ideal para landing pages imersivas, product demos, storytelling narrativo, game-like experiences. Tom cinematográfico e envolvente. Sensação de profundidade e progressão.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--zt-scale-max` | `3` | Escala máxima antes de fade out |
| `--zt-blur-max` | `10px` | Blur máximo na saída |
| `--zt-overlap` | `50vh` | Espaço de overlap para o efeito |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<div class="zt-wrapper" id="zoomThroughWrapper">
  <section class="zt-section" data-zt-bg="#0a0a0a">
    <div class="zt-section__inner">
      <h2 class="zt-section__title">Welcome</h2>
      <p class="zt-section__text">Dive deeper into our world</p>
    </div>
  </section>

  <section class="zt-section" data-zt-bg="#111827">
    <div class="zt-section__inner">
      <h2 class="zt-section__title">Explore</h2>
      <p class="zt-section__text">Every scroll takes you further</p>
    </div>
  </section>

  <section class="zt-section" data-zt-bg="#1e1b4b">
    <div class="zt-section__inner">
      <h2 class="zt-section__title">Discover</h2>
      <p class="zt-section__text">The journey never ends</p>
    </div>
  </section>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.zt-wrapper {
  position: relative;
}

.zt-section {
  height: 200vh;
  position: relative;
  overflow: hidden;
}

.zt-section__inner {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity, filter;
}

.zt-section__title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.zt-section__text {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
}

/* Background applied via JS or inline */
.zt-section__inner::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
}

@media (max-width: 768px) {
  .zt-section { height: 150vh; }
}

@media (prefers-reduced-motion: reduce) {
  .zt-section { height: auto; min-height: 100vh; }
  .zt-section__inner {
    position: relative;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const wrapper = document.getElementById('zoomThroughWrapper');
  if (!wrapper) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const sections = wrapper.querySelectorAll('.zt-section');

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

    sections.forEach((section) => {
      const inner = section.querySelector('.zt-section__inner');
      const bg = section.dataset.ztBg || '#0a0a0a';
      inner.style.background = bg;

      gsap.to(inner, {
        scale: 3,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power1.in',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: false,
        },
      });
    });

    /* Last section stays put */
    const lastInner = sections[sections.length - 1].querySelector('.zt-section__inner');
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === sections[sections.length - 1]) {
        st.kill();
      }
    });
    gsap.set(lastInner, { scale: 1, opacity: 1, filter: 'none' });
  });
})();
```

## Integração
Cada seção tem `200vh` de altura com conteúdo `sticky`. Ao scrollar, o conteúdo escala de 1→3 enquanto faz fade+blur, simulando um "zoom through". A próxima seção aparece por baixo naturalmente. Última seção não anima para funcionar como destino final. Cores de fundo via `data-zt-bg`.

## Variações

### Variação 1: Zoom Through com Portal
Adiciona um "portal" circular que se expande.
```css
.zt-section__portal {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
```
```javascript
gsap.to(section.querySelector('.zt-section__portal'), {
  width: '200vmax',
  height: '200vmax',
  opacity: 0,
  borderWidth: 0,
  ease: 'power1.in',
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
});
```

### Variação 2: Zoom com Image Background
Imagens de fundo que fazem zoom through.
```html
<section class="zt-section">
  <div class="zt-section__inner" style="background:url('assets/bg1.webp') center/cover;">
    <h2 class="zt-section__title">Explore</h2>
  </div>
</section>
```

### Variação 3: Reverse Zoom (Zoom Out)
Seções aparecem "de dentro" — scale grande para normal.
```javascript
sections.forEach((section, i) => {
  if (i === 0) return;
  const inner = section.querySelector('.zt-section__inner');
  gsap.fromTo(inner,
    { scale: 0.3, opacity: 0, filter: 'blur(8px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: true } }
  );
});
```
