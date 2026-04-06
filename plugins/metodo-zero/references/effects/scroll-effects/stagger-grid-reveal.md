# Stagger Grid Reveal

## Quando usar
Grid de cards/itens que aparecem com animação staggered (escalonada) ao entrar na viewport. Ideal para portfolios, features grid, team, testimonials, product showcase. Tom organizado e dinâmico. Cria sensação de riqueza e abundância de conteúdo.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--sg-bg` | `#0a0a0a` | Cor de fundo |
| `--sg-card-bg` | `rgba(255,255,255,0.05)` | Cor de fundo dos cards |
| `--sg-card-border` | `rgba(255,255,255,0.1)` | Borda dos cards |
| `--sg-columns` | `3` | Número de colunas |
| `--sg-gap` | `1.5rem` | Espaçamento entre cards |
| `--sg-stagger` | `0.1` | Delay entre cada card (s, via JS) |
| `--sg-duration` | `0.8` | Duração da animação (s, via JS) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="sg-section" id="staggerGridSection">
  <div class="sg-section__container">
    <div class="sg-section__header">
      <h2 class="sg-section__title">Our Work</h2>
      <p class="sg-section__subtitle">Selected projects that define our approach</p>
    </div>
    <div class="sg-section__grid" id="sgGrid">
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-1.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project One</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-2.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project Two</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-3.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project Three</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-4.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project Four</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-5.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project Five</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
      <div class="sg-section__card">
        <div class="sg-section__card-img">
          <img src="assets/project-6.webp" alt="" loading="lazy" />
        </div>
        <h3 class="sg-section__card-title">Project Six</h3>
        <p class="sg-section__card-text">Brief description of the project</p>
      </div>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.sg-section {
  --sg-bg: var(--color-bg, #0a0a0a);
  --sg-card-bg: rgba(255, 255, 255, 0.05);
  --sg-card-border: rgba(255, 255, 255, 0.1);
  --sg-columns: 3;
  --sg-gap: 1.5rem;

  background: var(--sg-bg);
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.sg-section__container {
  width: min(90%, 72rem);
  margin: 0 auto;
}

.sg-section__header {
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 4rem);
}

.sg-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.sg-section__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0;
  line-height: 1.5;
}

.sg-section__grid {
  display: grid;
  grid-template-columns: repeat(var(--sg-columns), 1fr);
  gap: var(--sg-gap);
}

.sg-section__card {
  background: var(--sg-card-bg);
  border: 1px solid var(--sg-card-border);
  border-radius: 0.75rem;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  transition: box-shadow 0.3s ease;
}

.sg-section__card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.sg-section__card-img {
  aspect-ratio: 16/10;
  overflow: hidden;
}

.sg-section__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.sg-section__card:hover .sg-section__card-img img {
  transform: scale(1.05);
}

.sg-section__card-title {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 600;
  color: var(--color-text, #ffffff);
  margin: 1rem 1.25rem 0.5rem;
  line-height: 1.3;
}

.sg-section__card-text {
  font-size: clamp(0.875rem, 1.2vw, 1rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 1.25rem 1.25rem;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .sg-section { --sg-columns: 2; }
}

@media (max-width: 640px) {
  .sg-section { --sg-columns: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .sg-section__card {
    opacity: 1;
    transform: none;
  }
  .sg-section__card-img img {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('staggerGridSection');
  const grid = document.getElementById('sgGrid');
  if (!section || !grid) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const config = {
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
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

    const cards = grid.querySelectorAll('.sg-section__card');

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
})();
```

## Integração
Adicionar quantos cards forem necessários ao grid. O JS anima todos os filhos `.sg-section__card`. As colunas se ajustam responsivamente (3 → 2 → 1). O stagger funciona na ordem do DOM. A animação dispara uma vez (toggleActions: play none none none) — não re-anima ao scrollar de volta.

## Variações

### Variação 1: Scale Up Entrance
Cards entram escalando de 80% para 100%. Visual mais "pop".
```javascript
gsap.fromTo(
  cards,
  { opacity: 0, scale: 0.8, y: 20 },
  {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: grid,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  }
);
```

### Variação 2: Diagonal Stagger
Cards animam na diagonal (canto superior esquerdo → inferior direito) em vez de sequencial.
```javascript
// Calcular delay baseado na posição no grid
const cols = parseInt(getComputedStyle(section).getPropertyValue('--sg-columns')) || 3;
cards.forEach((card, i) => {
  const row = Math.floor(i / cols);
  const col = i % cols;
  const delay = (row + col) * 0.1;

  gsap.fromTo(card,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
});
```

### Variação 3: Batch Reveal (Linha por Linha)
Cada linha de cards aparece junto, depois a próxima.
```javascript
const cols = parseInt(getComputedStyle(section).getPropertyValue('--sg-columns')) || 3;
const rows = [];
cards.forEach((card, i) => {
  const rowIdx = Math.floor(i / cols);
  if (!rows[rowIdx]) rows[rowIdx] = [];
  rows[rowIdx].push(card);
});

rows.forEach((row, rowIdx) => {
  gsap.fromTo(row,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: row[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
});
```
