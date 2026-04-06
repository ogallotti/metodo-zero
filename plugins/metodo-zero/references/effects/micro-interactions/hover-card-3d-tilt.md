# Hover Card 3D Tilt

## Quando usar
Card que rotaciona em 3D acompanhando a posição do cursor, com efeito de luz/reflexo dinâmico. Ideal para cards de produto, pricing, testimonials, team members, feature cards. Tom premium e interativo. Cria sensação de fisicalidade e profundidade.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--tc-bg` | `rgba(255,255,255,0.05)` | Cor de fundo do card |
| `--tc-border` | `rgba(255,255,255,0.1)` | Cor da borda |
| `--tc-radius` | `1rem` | Border radius |
| `--tc-max-rotation` | `15` | Graus máximos de rotação (via JS) |
| `--tc-perspective` | `800px` | Perspectiva 3D |
| `--tc-glare-opacity` | `0.15` | Opacidade do efeito de glare |
| `--tc-transition` | `0.6s` | Velocidade de retorno à posição original |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<div class="tc-grid">
  <div class="tc-card" data-tilt>
    <div class="tc-card__glare" aria-hidden="true"></div>
    <div class="tc-card__content">
      <div class="tc-card__icon">🚀</div>
      <h3 class="tc-card__title">Feature One</h3>
      <p class="tc-card__text">Description of the feature with relevant details for the user.</p>
    </div>
  </div>

  <div class="tc-card" data-tilt>
    <div class="tc-card__glare" aria-hidden="true"></div>
    <div class="tc-card__content">
      <div class="tc-card__icon">⚡</div>
      <h3 class="tc-card__title">Feature Two</h3>
      <p class="tc-card__text">Description of another feature with relevant details.</p>
    </div>
  </div>

  <div class="tc-card" data-tilt>
    <div class="tc-card__glare" aria-hidden="true"></div>
    <div class="tc-card__content">
      <div class="tc-card__icon">🎯</div>
      <h3 class="tc-card__title">Feature Three</h3>
      <p class="tc-card__text">Description of one more feature with relevant details.</p>
    </div>
  </div>
</div>
```

## CSS

```css
.tc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: min(90%, 72rem);
  margin: 0 auto;
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.tc-card {
  --tc-bg: rgba(255, 255, 255, 0.05);
  --tc-border: rgba(255, 255, 255, 0.1);
  --tc-radius: 1rem;
  --tc-perspective: 800px;
  --tc-transition: 0.6s;

  position: relative;
  background: var(--tc-bg);
  border: 1px solid var(--tc-border);
  border-radius: var(--tc-radius);
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: var(--tc-perspective);
  transition: transform var(--tc-transition) cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow var(--tc-transition) ease;
  will-change: transform;
}

.tc-card:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.tc-card__glare {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(
    circle at var(--glare-x, 50%) var(--glare-y, 50%),
    rgba(255, 255, 255, var(--tc-glare-opacity, 0.15)),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}

.tc-card:hover .tc-card__glare {
  opacity: 1;
}

.tc-card__content {
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 3vw, 2rem);
  transform: translateZ(20px);
}

.tc-card__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.tc-card__title {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  font-weight: 600;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.3;
}

.tc-card__text {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .tc-card {
    --tc-perspective: 600px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tc-card {
    transform: none !important;
    transition: box-shadow 0.3s ease;
  }
  .tc-card__glare {
    display: none;
  }
  .tc-card__content {
    transform: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const config = {
    maxRotation: 15,
    lerpSpeed: 0.08,
  };

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const glare = card.querySelector('.tc-card__glare');
    let rect;
    let rafId = null;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;

    function updateRect() {
      rect = card.getBoundingClientRect();
    }

    function lerp(current, target, speed) {
      return current + (target - current) * speed;
    }

    function animate() {
      currentRotateX = lerp(currentRotateX, targetRotateX, config.lerpSpeed);
      currentRotateY = lerp(currentRotateY, targetRotateY, config.lerpSpeed);

      card.style.transform =
        `perspective(${getComputedStyle(card).getPropertyValue('--tc-perspective').trim() || '800px'}) ` +
        `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

      if (
        Math.abs(targetRotateX - currentRotateX) > 0.01 ||
        Math.abs(targetRotateY - currentRotateY) > 0.01
      ) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    function startAnimate() {
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    card.addEventListener('mouseenter', () => {
      updateRect();
      card.style.transition = 'box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetRotateX = (0.5 - y) * config.maxRotation;
      targetRotateY = (x - 0.5) * config.maxRotation;

      if (glare) {
        glare.style.setProperty('--glare-x', (x * 100) + '%');
        glare.style.setProperty('--glare-y', (y * 100) + '%');
      }

      startAnimate();
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transition =
        `transform ${getComputedStyle(card).getPropertyValue('--tc-transition').trim() || '0.6s'} cubic-bezier(0.22, 1, 0.36, 1), ` +
        'box-shadow 0.3s ease';

      targetRotateX = 0;
      targetRotateY = 0;
      startAnimate();
    });
  });
})();
```

## Integração
Adicionar `data-tilt` a qualquer card para ativar o efeito. O `.tc-card__glare` é opcional (remover se não quiser o efeito de luz). O `transform: translateZ(20px)` no content cria parallax interno sutil entre card e conteúdo. Funciona com múltiplos cards independentes. Desabilitado em touch devices.

## Variações

### Variação 1: Subtle Tilt (Menos Dramático)
Rotação mais sutil — ideal para cards de conteúdo denso onde o tilt não deve distrair.
```javascript
const config = {
  maxRotation: 6,
  lerpSpeed: 0.06,
};
```
```css
.tc-card__content {
  transform: translateZ(8px);
}
.tc-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

### Variação 2: Border Glow (Borda Brilhante)
Borda que brilha na direção do cursor. Efeito "holográfico".
```css
.tc-card {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--tc-bg), var(--tc-bg)) padding-box,
    linear-gradient(
      calc(var(--border-angle, 0) * 1deg),
      var(--color-primary, #6366f1),
      transparent 40%,
      transparent 60%,
      var(--color-accent, #ec4899)
    ) border-box;
}
```
```javascript
// Adicionar ao mousemove:
const angle = Math.atan2(
  e.clientY - (rect.top + rect.height / 2),
  e.clientX - (rect.left + rect.width / 2)
) * (180 / Math.PI) + 180;
card.style.setProperty('--border-angle', angle);
```

### Variação 3: Inner Shadow Depth
Sombra interna que segue o cursor, criando sensação de profundidade concava.
```css
.tc-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, var(--shadow-intensity, 0));
  pointer-events: none;
  z-index: 1;
  transition: box-shadow 0.3s ease;
}
.tc-card:hover::after {
  --shadow-intensity: 0.3;
}
```
