# Clip-Path Reveal

## Quando usar
Conteúdo se revela progressivamente via clip-path conforme o scroll — imagens, cards ou seções inteiras "aparecem" com formas geométricas animadas. Ideal para portfolios, galerias, storytelling, about sections. Tom dramático e editorial.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cpr-shape` | `inset` | Tipo de clip (inset, circle, polygon) |
| `--cpr-direction` | `bottom` | Direção da revelação |

## Dependências
- CSS scroll-timeline (com fallback GSAP)
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="cpr-section" id="clipPathRevealSection">
  <div class="cpr-section__container">
    <div class="cpr-section__item" data-cpr="inset-bottom">
      <img src="assets/gallery-1.webp" alt="Project 1" class="cpr-section__img" loading="lazy" />
      <h3 class="cpr-section__caption">Project Alpha</h3>
    </div>
    <div class="cpr-section__item" data-cpr="circle">
      <img src="assets/gallery-2.webp" alt="Project 2" class="cpr-section__img" loading="lazy" />
      <h3 class="cpr-section__caption">Project Beta</h3>
    </div>
    <div class="cpr-section__item" data-cpr="inset-left">
      <img src="assets/gallery-3.webp" alt="Project 3" class="cpr-section__img" loading="lazy" />
      <h3 class="cpr-section__caption">Project Gamma</h3>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.cpr-section {
  background: var(--color-bg, #0a0a0a);
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.cpr-section__container {
  width: min(90%, 72rem);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.cpr-section__item {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
}

.cpr-section__img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
}

.cpr-section__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  color: var(--color-text, #ffffff);
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .cpr-section__item { clip-path: none !important; }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('clipPathRevealSection');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const items = section.querySelectorAll('[data-cpr]');

  const clipMap = {
    'inset-bottom': { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
    'inset-left': { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    'inset-top': { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    'circle': { from: 'circle(0% at 50% 50%)', to: 'circle(100% at 50% 50%)' },
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

    items.forEach((item) => {
      const type = item.dataset.cpr || 'inset-bottom';
      const clip = clipMap[type] || clipMap['inset-bottom'];

      item.style.clipPath = clip.from;

      gsap.to(item, {
        clipPath: clip.to,
        ease: 'power2.out',
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  });
})();
```

## Integração
Adicionar `data-cpr="tipo"` a qualquer elemento. Tipos disponíveis: `inset-bottom`, `inset-left`, `inset-top`, `circle`. O JS aplica clip-path inicial e anima ao entrar na viewport. Funciona com imagens, cards, divs ou qualquer elemento.

## Variações

### Variação 1: Scrub Reveal
Clip-path é controlado pelo scroll em vez de toggle.
```javascript
gsap.to(item, {
  clipPath: clip.to,
  ease: 'none',
  scrollTrigger: {
    trigger: item,
    start: 'top 80%',
    end: 'top 30%',
    scrub: true,
  },
});
```

### Variação 2: Staggered Grid Reveal
Itens da grid revelam em sequência com delay.
```javascript
items.forEach((item, i) => {
  const clip = clipMap[item.dataset.cpr || 'inset-bottom'];
  item.style.clipPath = clip.from;
  gsap.to(item, {
    clipPath: clip.to,
    ease: 'power2.out',
    duration: 1,
    delay: i * 0.15,
    scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' },
  });
});
```

### Variação 3: Diagonal Clip Reveal
Revelação diagonal personalizada.
```javascript
const diagonalClip = {
  from: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
  to: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
};
```
