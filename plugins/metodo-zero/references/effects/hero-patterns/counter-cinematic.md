# Counter Cinematic

## Quando usar
Contagem regressiva ou contagem com animação cinematográfica — números grandes com efeito de flip, scale ou morphing. Ideal para launches, eventos, product reveals, milestones. Tom dramático e antecipante. Cria urgência ou celebração.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cc-color` | `#ffffff` | Cor dos números |
| `--cc-accent` | `#6366f1` | Cor de destaque |
| `--cc-font-size` | `clamp(4rem, 12vw, 10rem)` | Tamanho dos números |
| `--cc-target` | `2500` | Número alvo (via data attribute) |
| `--cc-duration` | `3000` | Duração da animação (ms, via JS) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="cc-hero" id="counterCinematicHero">
  <div class="cc-hero__content">
    <div class="cc-hero__counter" id="ccCounter" data-cc-target="2500" data-cc-suffix="+">
      <span class="cc-hero__number">0</span>
    </div>
    <p class="cc-hero__label">Projects Delivered</p>
    <p class="cc-hero__subtitle">And counting. Every one a story of transformation.</p>
    <a href="#" class="cc-hero__cta">Start Yours</a>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.cc-hero {
  --cc-color: var(--color-text, #ffffff);
  --cc-accent: var(--color-primary, #6366f1);
  --cc-font-size: clamp(4rem, 12vw, 10rem);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #0a0a0a);
}

.cc-hero__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.cc-hero__counter {
  position: relative;
  overflow: hidden;
}

.cc-hero__number {
  display: block;
  font-size: var(--cc-font-size);
  font-weight: 900;
  color: var(--cc-color);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.cc-hero__label {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--cc-accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  margin: 1rem 0 1.5rem;
}

.cc-hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
  margin: 0 0 2rem;
  max-width: 35rem;
  margin-left: auto;
  margin-right: auto;
}

.cc-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--cc-accent);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.cc-hero__cta:hover { transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .cc-hero__number { transform: none !important; }
}
```

## JavaScript

```javascript
(function () {
  const counter = document.getElementById('ccCounter');
  if (!counter) return;

  const numberEl = counter.querySelector('.cc-hero__number');
  const target = parseInt(counter.dataset.ccTarget) || 0;
  const suffix = counter.dataset.ccSuffix || '';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatNum(n) {
    return Math.floor(n).toLocaleString('en-US');
  }

  if (reducedMotion) {
    numberEl.textContent = formatNum(target) + suffix;
    return;
  }

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

    const obj = { val: 0 };

    /* Number scale-in entrance */
    gsap.from(numberEl, {
      scale: 0.5,
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    /* Count animation */
    gsap.to(obj, {
      val: target,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        numberEl.textContent = formatNum(obj.val) + suffix;
      },
    });
  });
})();
```

## Integração
O counter combina animação de entrada (scale + opacity) com contagem numérica. `data-cc-target` define o número final. `data-cc-suffix` adiciona texto após o número. Dispara ao entrar na viewport. GSAP garante easing cinematográfico na contagem.

## Variações

### Variação 1: Scroll-Scrubbed Count
Número conta conforme o scroll em vez de automático.
```javascript
gsap.to(obj, {
  val: target,
  ease: 'none',
  scrollTrigger: {
    trigger: counter,
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  },
  onUpdate: () => { numberEl.textContent = formatNum(obj.val) + suffix; },
});
```

### Variação 2: Multiple Counters Grid
Múltiplos contadores em grid.
```html
<div class="cc-hero__grid">
  <div class="cc-hero__counter" data-cc-target="10000" data-cc-suffix="+">
    <span class="cc-hero__number">0</span>
    <span class="cc-hero__label">Users</span>
  </div>
  <div class="cc-hero__counter" data-cc-target="98" data-cc-suffix="%">
    <span class="cc-hero__number">0</span>
    <span class="cc-hero__label">Uptime</span>
  </div>
  <div class="cc-hero__counter" data-cc-target="50" data-cc-suffix="M+">
    <span class="cc-hero__number">0</span>
    <span class="cc-hero__label">API Calls</span>
  </div>
</div>
```
```css
.cc-hero__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.cc-hero__grid .cc-hero__number {
  font-size: clamp(2.5rem, 6vw, 5rem);
}
```

### Variação 3: Countdown (Regressiva)
Contagem regressiva até um evento.
```javascript
const targetDate = new Date('2026-06-01T00:00:00');
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  numberEl.textContent = `${days}d ${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}
setInterval(updateCountdown, 1000);
updateCountdown();
```
