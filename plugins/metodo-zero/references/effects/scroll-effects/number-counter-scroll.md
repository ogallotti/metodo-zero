# Number Counter Scroll

## Quando usar
Números que contam de 0 até o valor final quando a seção entra na viewport. Ideal para seções de métricas, estatísticas, resultados, KPIs, social proof numérico ("10,000+ clientes"). Tom confiável e impactante. Prova tangível de resultados.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--nc-color` | `#ffffff` | Cor dos números |
| `--nc-accent` | `#6366f1` | Cor de destaque (labels) |
| `--nc-font-size` | `clamp(2.5rem, 6vw, 4rem)` | Tamanho dos números |
| `--nc-duration` | `2000` | Duração da contagem em ms (via JS) |
| `--nc-ease` | `easeOutExpo` | Easing da contagem (via JS) |
| `--nc-separator` | `,` | Separador de milhares (via JS) |

## Dependências
- IntersectionObserver + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<section class="nc-section" id="numberCounterSection">
  <div class="nc-section__container">
    <h2 class="nc-section__title">By the Numbers</h2>

    <div class="nc-section__grid">
      <div class="nc-section__stat">
        <span class="nc-section__number" data-nc-target="10000" data-nc-prefix="" data-nc-suffix="+">0</span>
        <span class="nc-section__label">Happy Clients</span>
      </div>
      <div class="nc-section__stat">
        <span class="nc-section__number" data-nc-target="98" data-nc-suffix="%">0</span>
        <span class="nc-section__label">Satisfaction Rate</span>
      </div>
      <div class="nc-section__stat">
        <span class="nc-section__number" data-nc-target="250" data-nc-suffix="M">0</span>
        <span class="nc-section__label">Revenue Generated</span>
      </div>
      <div class="nc-section__stat">
        <span class="nc-section__number" data-nc-target="15" data-nc-suffix="">0</span>
        <span class="nc-section__label">Years of Experience</span>
      </div>
    </div>
  </div>
</section>
```

## CSS

```css
.nc-section {
  --nc-color: var(--color-text, #ffffff);
  --nc-accent: var(--color-primary, #6366f1);
  --nc-font-size: clamp(2.5rem, 6vw, 4rem);

  background: var(--color-bg, #0a0a0a);
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.nc-section__container {
  width: min(90%, 72rem);
  margin: 0 auto;
}

.nc-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--nc-color);
  text-align: center;
  margin: 0 0 clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
}

.nc-section__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(1.5rem, 3vw, 3rem);
}

.nc-section__stat {
  text-align: center;
  padding: clamp(1rem, 2vw, 2rem);
}

.nc-section__number {
  display: block;
  font-size: var(--nc-font-size);
  font-weight: 800;
  color: var(--nc-color);
  line-height: 1;
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.nc-section__label {
  display: block;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: var(--nc-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .nc-section__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .nc-section__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nc-section__number {
    /* Numbers show final value immediately */
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('numberCounterSection');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = {
    duration: 2000,
    separator: ',',
  };

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatNumber(num, separator) {
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.ncTarget) || 0;
    const prefix = el.dataset.ncPrefix || '';
    const suffix = el.dataset.ncSuffix || '';
    const isDecimal = target % 1 !== 0;

    if (reducedMotion) {
      el.textContent = prefix + formatNumber(target, config.separator) + suffix;
      return;
    }

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / config.duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = target * easedProgress;

      if (isDecimal) {
        el.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + formatNumber(current, config.separator) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const numbers = section.querySelectorAll('.nc-section__number');
  let hasAnimated = false;

  if (reducedMotion) {
    numbers.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        numbers.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
})();
```

## Integração
Cada `.nc-section__number` define `data-nc-target` (valor final), `data-nc-prefix` e `data-nc-suffix`. A contagem inicia quando 30% da seção está visível. Anima uma vez só (não re-anima ao scroll back). Sem dependências externas — IntersectionObserver nativo. Em reduced-motion, mostra valores finais instantaneamente.

## Variações

### Variação 1: Scroll-Scrubbed Counter
Números contam conforme o scroll (scrub) em vez de animação automática.
```javascript
// Substituir IntersectionObserver por GSAP ScrollTrigger:
function waitForGSAP(cb) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return cb();
  const check = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(check); cb();
    }
  }, 50);
}
waitForGSAP(function () {
  gsap.registerPlugin(ScrollTrigger);
  numbers.forEach((el) => {
    const target = parseFloat(el.dataset.ncTarget) || 0;
    const prefix = el.dataset.ncPrefix || '';
    const suffix = el.dataset.ncSuffix || '';
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'center center',
      scrub: true,
      onUpdate: (self) => {
        const val = target * self.progress;
        el.textContent = prefix + formatNumber(val, config.separator) + suffix;
      },
    });
  });
});
```

### Variação 2: Animated Dividers
Cards com borda/divider entre os stats.
```css
.nc-section__stat {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.nc-section__stat:last-child {
  border-right: none;
}
@media (max-width: 768px) {
  .nc-section__stat {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .nc-section__stat:last-child { border-bottom: none; }
}
```

### Variação 3: Circular Progress + Number
Números dentro de SVG circular que preenche conforme conta.
```html
<div class="nc-section__stat">
  <div class="nc-section__ring">
    <svg viewBox="0 0 36 36" width="120" height="120">
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
      <circle class="nc-ring-fill" cx="18" cy="18" r="16" fill="none"
              stroke="var(--nc-accent)" stroke-width="2"
              stroke-dasharray="100.53" stroke-dashoffset="100.53"
              transform="rotate(-90 18 18)" />
    </svg>
    <span class="nc-section__number" data-nc-target="98" data-nc-suffix="%">0</span>
  </div>
  <span class="nc-section__label">Satisfaction</span>
</div>
```
```css
.nc-section__ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.nc-section__ring .nc-section__number { position: absolute; font-size: 1.5rem; }
.nc-ring-fill { transition: stroke-dashoffset 2s ease-out; }
```
```javascript
// Adicionar ao animateCounter:
const ring = el.closest('.nc-section__ring')?.querySelector('.nc-ring-fill');
if (ring) {
  const circumference = 2 * Math.PI * 16;
  ring.style.strokeDashoffset = circumference * (1 - target / 100);
}
```
