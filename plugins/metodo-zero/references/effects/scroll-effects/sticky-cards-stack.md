# Sticky Cards Stack

## Quando usar
Cards que empilham uns sobre os outros conforme o scroll — cada novo card "sobe" e sobrepõe o anterior, que fica parcialmente visível atrás. Ideal para pricing, features, comparações, storytelling sequencial. Tom organizado e premium. Cria hierarquia visual natural.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--scs-bg` | `#0a0a0a` | Cor de fundo |
| `--scs-card-bg` | `#111827` | Cor de fundo dos cards |
| `--scs-card-radius` | `1rem` | Border radius dos cards |
| `--scs-stack-offset` | `20px` | Offset vertical entre cards empilhados |
| `--scs-scale-factor` | `0.04` | Quanto cada card por trás encolhe |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="scs-section" id="stickyCardsSection">
  <div class="scs-section__header">
    <h2 class="scs-section__title">How It Works</h2>
    <p class="scs-section__subtitle">Simple steps to get started</p>
  </div>
  <div class="scs-section__cards" id="scsCards">
    <div class="scs-section__card" style="--card-color: #6366f1;">
      <span class="scs-section__card-num">01</span>
      <h3 class="scs-section__card-title">Sign Up</h3>
      <p class="scs-section__card-text">Create your account in under a minute. No credit card required.</p>
    </div>
    <div class="scs-section__card" style="--card-color: #ec4899;">
      <span class="scs-section__card-num">02</span>
      <h3 class="scs-section__card-title">Configure</h3>
      <p class="scs-section__card-text">Set up your workspace with our guided onboarding experience.</p>
    </div>
    <div class="scs-section__card" style="--card-color: #06b6d4;">
      <span class="scs-section__card-num">03</span>
      <h3 class="scs-section__card-title">Launch</h3>
      <p class="scs-section__card-text">Go live and start seeing results from day one.</p>
    </div>
    <div class="scs-section__card" style="--card-color: #f59e0b;">
      <span class="scs-section__card-num">04</span>
      <h3 class="scs-section__card-title">Scale</h3>
      <p class="scs-section__card-text">Grow with confidence. Our platform scales with your ambitions.</p>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.scs-section {
  --scs-bg: var(--color-bg, #0a0a0a);
  --scs-card-bg: #111827;
  --scs-card-radius: 1rem;
  --scs-stack-offset: 20px;
  --scs-scale-factor: 0.04;

  background: var(--scs-bg);
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.scs-section__header {
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  width: min(90%, 55rem);
  margin-left: auto;
  margin-right: auto;
}

.scs-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.scs-section__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0;
}

.scs-section__cards {
  width: min(90%, 50rem);
  margin: 0 auto;
  position: relative;
}

.scs-section__card {
  position: sticky;
  top: 15vh;
  background: var(--scs-card-bg);
  border-radius: var(--scs-card-radius);
  padding: clamp(2rem, 4vw, 3rem);
  margin-bottom: 2rem;
  border-top: 3px solid var(--card-color, var(--color-primary, #6366f1));
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  will-change: transform;
}

.scs-section__card-num {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--card-color, var(--color-primary, #6366f1));
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.scs-section__card-title {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

.scs-section__card-text {
  font-size: clamp(0.875rem, 1.5vw, 1.0625rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .scs-section__card {
    top: 10vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scs-section__card {
    position: relative;
    top: 0;
    transform: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('stickyCardsSection');
  if (!section) return;

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

    const cards = section.querySelectorAll('.scs-section__card');
    const stackOffset = 20;
    const scaleFactor = 0.04;

    cards.forEach((card, i) => {
      const isLast = i === cards.length - 1;
      if (isLast) return;

      ScrollTrigger.create({
        trigger: card,
        start: 'top 15vh',
        end: 'bottom 15vh',
        endTrigger: cards[cards.length - 1],
        pin: false,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const scale = 1 - scaleFactor * (cards.length - 1 - i) * progress;
          const yOffset = -stackOffset * (cards.length - 1 - i) * progress;
          card.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
          card.style.opacity = String(1 - progress * 0.15);
        },
      });
    });
  });
})();
```

## Integração
Os cards usam `position: sticky` nativo do CSS como base. O GSAP adiciona o efeito de scale down e opacity nos cards que passam. Cada card precisa de `margin-bottom` para dar espaço de scroll entre eles. A cor de destaque de cada card é definida via `--card-color` inline. Adicionar/remover cards no HTML basta — o JS se adapta.

## Variações

### Variação 1: Dark to Light Gradient
Cards ficam progressivamente mais claros conforme o stack.
```css
.scs-section__card:nth-child(1) { --scs-card-bg: #0f172a; }
.scs-section__card:nth-child(2) { --scs-card-bg: #1e293b; }
.scs-section__card:nth-child(3) { --scs-card-bg: #334155; }
.scs-section__card:nth-child(4) { --scs-card-bg: #475569; }
```

### Variação 2: Full-Width Image Cards
Cards maiores com imagem de fundo.
```html
<div class="scs-section__card" style="--card-color:#6366f1; background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(assets/step-1.webp); background-size: cover;">
  ...
</div>
```
```css
.scs-section__cards { max-width: 64rem; }
.scs-section__card { min-height: 300px; display: flex; flex-direction: column; justify-content: flex-end; }
```

### Variação 3: Horizontal Stack (Cards Empilham da Esquerda)
Cards deslizam da direita e empilham, com offset horizontal.
```javascript
onUpdate: (self) => {
  const progress = self.progress;
  const scale = 1 - scaleFactor * (cards.length - 1 - i) * progress;
  const xOffset = -15 * (cards.length - 1 - i) * progress;
  card.style.transform = `scale(${scale}) translateX(${xOffset}px)`;
  card.style.opacity = String(1 - progress * 0.1);
},
```
