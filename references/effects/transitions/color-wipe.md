# Color Wipe

## Quando usar
Transição entre seções usando um wipe de cor sólida que varre a tela antes de revelar o conteúdo seguinte. Ideal para mudanças de contexto, troca de tema, page transitions, loading states. Tom bold e intencional. Sinaliza uma mudança clara de seção.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cw-color` | `#6366f1` | Cor do wipe |
| `--cw-duration` | `0.6s` | Duração de cada fase (enter/exit) |
| `--cw-direction` | `left` | Direção do wipe (left, right, top, bottom) |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<section class="cw-section cw-section--dark" id="cwSection1">
  <div class="cw-section__content">
    <h2 class="cw-section__title">Section One</h2>
    <p class="cw-section__text">Scroll to see the color wipe transition</p>
  </div>
</section>

<div class="cw-trigger" data-cw-color="#6366f1" data-cw-direction="left"></div>

<section class="cw-section cw-section--light" id="cwSection2">
  <div class="cw-section__content">
    <h2 class="cw-section__title">Section Two</h2>
    <p class="cw-section__text">A bold transition separated us</p>
  </div>
</section>
```

## CSS

```css
.cw-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cw-section--dark {
  background: var(--color-bg, #0a0a0a);
  color: var(--color-text, #ffffff);
}

.cw-section--light {
  background: #111827;
  color: var(--color-text, #ffffff);
}

.cw-section__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.cw-section__title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0 0 1rem;
  line-height: 1.1;
}

.cw-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
}

.cw-trigger {
  position: relative;
  height: 0;
  overflow: visible;
}

.cw-wipe {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: left center;
}

.cw-wipe--left { transform: scaleX(0); transform-origin: left center; }
.cw-wipe--right { transform: scaleX(0); transform-origin: right center; }
.cw-wipe--top { transform: scaleY(0); transform-origin: center top; }
.cw-wipe--bottom { transform: scaleY(0); transform-origin: center bottom; }

.cw-wipe.is-entering {
  animation: cwEnter var(--cw-duration, 0.6s) cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.cw-wipe.is-exiting {
  animation: cwExit var(--cw-duration, 0.6s) cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes cwEnter {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@keyframes cwExit {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.cw-wipe--top.is-entering,
.cw-wipe--bottom.is-entering {
  animation-name: cwEnterY;
}

.cw-wipe--top.is-exiting,
.cw-wipe--bottom.is-exiting {
  animation-name: cwExitY;
}

@keyframes cwEnterY {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

@keyframes cwExitY {
  from { transform: scaleY(1); }
  to { transform: scaleY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .cw-wipe { display: none !important; }
}
```

## JavaScript

```javascript
(function () {
  const triggers = document.querySelectorAll('.cw-trigger');
  if (!triggers.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const trigger = entry.target;
        if (trigger.dataset.cwFired) return;
        trigger.dataset.cwFired = 'true';

        const color = trigger.dataset.cwColor || '#6366f1';
        const direction = trigger.dataset.cwDirection || 'left';
        const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cw-duration')) || 0.6;

        const wipe = document.createElement('div');
        wipe.className = `cw-wipe cw-wipe--${direction}`;
        wipe.style.background = color;
        wipe.style.setProperty('--cw-duration', duration + 's');
        document.body.appendChild(wipe);

        /* Phase 1: enter */
        wipe.classList.add('is-entering');

        wipe.addEventListener('animationend', function onEnter() {
          wipe.removeEventListener('animationend', onEnter);
          wipe.classList.remove('is-entering');

          /* Phase 2: exit (reverse origin) */
          const exitOrigins = {
            left: 'right center',
            right: 'left center',
            top: 'center bottom',
            bottom: 'center top',
          };
          wipe.style.transformOrigin = exitOrigins[direction] || 'right center';
          wipe.classList.add('is-exiting');

          wipe.addEventListener('animationend', function onExit() {
            wipe.removeEventListener('animationend', onExit);
            wipe.remove();
          });
        });
      });
    },
    { threshold: 0.5 }
  );

  triggers.forEach((t) => observer.observe(t));
})();
```

## Integração
Coloque um `<div class="cw-trigger">` entre seções. O JS cria um overlay fullscreen que faz scale de 0→1 (enter) e depois 1→0 com origin invertido (exit). Cada trigger dispara apenas uma vez. A cor e direção são configurados via data attributes.

## Variações

### Variação 1: Dual Color Wipe
Dois layers de cores diferentes em sequência.
```javascript
const colors = [color, trigger.dataset.cwColor2 || '#ec4899'];
colors.forEach((c, i) => {
  const w = document.createElement('div');
  w.className = `cw-wipe cw-wipe--${direction}`;
  w.style.background = c;
  w.style.animationDelay = (i * 0.15) + 's';
  w.classList.add('is-entering');
  document.body.appendChild(w);
  setTimeout(() => {
    w.classList.remove('is-entering');
    w.style.transformOrigin = 'right center';
    w.classList.add('is-exiting');
    w.addEventListener('animationend', () => w.remove());
  }, (duration + i * 0.15) * 1000);
});
```

### Variação 2: Diagonal Wipe
Wipe em ângulo diagonal usando clip-path.
```css
.cw-wipe--diagonal {
  transform: none;
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
}
.cw-wipe--diagonal.is-entering {
  animation: cwDiagEnter 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}
@keyframes cwDiagEnter {
  to { clip-path: polygon(-20% 0, 120% 0, 100% 100%, 0% 100%); }
}
.cw-wipe--diagonal.is-exiting {
  animation: cwDiagExit 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}
@keyframes cwDiagExit {
  from { clip-path: polygon(-20% 0, 120% 0, 100% 100%, 0% 100%); }
  to { clip-path: polygon(100% 0, 120% 0, 120% 100%, 100% 100%); }
}
```

### Variação 3: Pixel/Grid Wipe
Wipe com efeito de grid pixelada.
```javascript
const grid = document.createElement('div');
grid.style.cssText = 'position:fixed;inset:0;z-index:9999;display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(10,1fr);pointer-events:none;';
for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');
  cell.style.cssText = `background:${color};transform:scale(0);transition:transform 0.3s cubic-bezier(0.77,0,0.175,1);transition-delay:${(Math.random() * 0.4).toFixed(2)}s;`;
  grid.appendChild(cell);
}
document.body.appendChild(grid);
requestAnimationFrame(() => {
  grid.querySelectorAll('div').forEach(c => c.style.transform = 'scale(1)');
});
setTimeout(() => {
  grid.querySelectorAll('div').forEach(c => { c.style.transitionDelay = (Math.random() * 0.4).toFixed(2) + 's'; c.style.transform = 'scale(0)'; });
  setTimeout(() => grid.remove(), 800);
}, 700);
```
