# Magnetic Button

## Quando usar
Botão que "puxa" levemente em direção ao cursor quando o mouse se aproxima, como se fosse magnético. Ideal para CTAs principais, botões de hero section, links de navegação premium. Tom playful e sofisticado. Micro-interação sutil que aumenta engajamento.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--mb-bg` | `#6366f1` | Cor de fundo do botão |
| `--mb-color` | `#ffffff` | Cor do texto |
| `--mb-radius` | `0.5rem` | Border radius |
| `--mb-padding` | `1rem 2.5rem` | Padding interno |
| `--mb-strength` | `0.3` | Força do magnetismo (0-1, via JS) |
| `--mb-text-strength` | `0.15` | Força do movimento do texto (via JS) |
| `--mb-hover-area` | `1.5` | Multiplicador da área de detecção |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<a href="#" class="mb-btn" data-magnetic>
  <span class="mb-btn__text">Get Started</span>
</a>

<!-- Múltiplos botões: cada um funciona independentemente -->
<a href="#" class="mb-btn mb-btn--outline" data-magnetic>
  <span class="mb-btn__text">Learn More</span>
</a>
```

## CSS

```css
.mb-btn {
  --mb-bg: var(--color-primary, #6366f1);
  --mb-color: #ffffff;
  --mb-radius: 0.5rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  background: var(--mb-bg);
  color: var(--mb-color);
  text-decoration: none;
  border-radius: var(--mb-radius);
  font-weight: 600;
  font-size: 1.125rem;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  will-change: transform;
  transition: box-shadow 0.3s ease;
}

.mb-btn__text {
  display: inline-block;
  position: relative;
  z-index: 1;
  will-change: transform;
  pointer-events: none;
}

.mb-btn:hover {
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

.mb-btn--outline {
  background: transparent;
  border-color: var(--mb-bg);
  color: var(--mb-bg);
}

.mb-btn--outline:hover {
  background: var(--mb-bg);
  color: var(--mb-color);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.3);
}

@media (max-width: 768px) {
  .mb-btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mb-btn,
  .mb-btn__text {
    will-change: auto;
    transform: none !important;
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
    strength: 0.3,
    textStrength: 0.15,
    hoverArea: 1.5,
    lerpSpeed: 0.1,
  };

  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const textEl = btn.querySelector('.mb-btn__text');
    let rect;
    let isHovering = false;
    let rafId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let textCurrentX = 0;
    let textCurrentY = 0;
    let textTargetX = 0;
    let textTargetY = 0;

    function updateRect() {
      rect = btn.getBoundingClientRect();
    }

    function lerp(current, target, speed) {
      return current + (target - current) * speed;
    }

    function animate() {
      currentX = lerp(currentX, targetX, config.lerpSpeed);
      currentY = lerp(currentY, targetY, config.lerpSpeed);
      textCurrentX = lerp(textCurrentX, textTargetX, config.lerpSpeed);
      textCurrentY = lerp(textCurrentY, textTargetY, config.lerpSpeed);

      btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
      if (textEl) {
        textEl.style.transform = `translate(${textCurrentX}px, ${textCurrentY}px)`;
      }

      if (
        Math.abs(targetX - currentX) > 0.01 ||
        Math.abs(targetY - currentY) > 0.01
      ) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    function startAnimate() {
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    btn.addEventListener('mouseenter', () => {
      updateRect();
      isHovering = true;
    });

    btn.addEventListener('mousemove', (e) => {
      if (!isHovering || !rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      targetX = deltaX * config.strength;
      targetY = deltaY * config.strength;
      textTargetX = deltaX * config.textStrength;
      textTargetY = deltaY * config.textStrength;

      startAnimate();
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      textTargetX = 0;
      textTargetY = 0;
      startAnimate();
    });
  });
})();
```

## Integração
Adicionar `data-magnetic` a qualquer botão/link para ativar o efeito. O texto interno deve estar em `.mb-btn__text` para efeito de "inner movement" (texto move mais lento que o botão). Funciona com múltiplos botões independentemente. Em mobile/touch, o efeito é desabilitado automaticamente.

## Variações

### Variação 1: Stronger Pull (Atração Forte)
Magnetismo mais pronunciado — ideal para CTAs isolados e grandes.
```javascript
// Alterar config:
const config = {
  strength: 0.5,
  textStrength: 0.25,
  hoverArea: 2,
  lerpSpeed: 0.08,
};
```
```css
.mb-btn {
  padding: 1.25rem 3.5rem;
  font-size: 1.25rem;
  border-radius: 4rem;
}
```

### Variação 2: Magnetic + Scale
Botão escala levemente além do efeito magnético.
```javascript
// Adicionar ao mouseenter:
btn.addEventListener('mouseenter', () => {
  updateRect();
  isHovering = true;
  btn.style.transition = 'box-shadow 0.3s';
  btn.style.scale = '1.05';
});

btn.addEventListener('mouseleave', () => {
  isHovering = false;
  targetX = 0;
  targetY = 0;
  textTargetX = 0;
  textTargetY = 0;
  btn.style.scale = '1';
  startAnimate();
});
```
```css
.mb-btn {
  transition: box-shadow 0.3s ease, scale 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Variação 3: Magnetic with Background Follow
Background gradient segue o cursor dentro do botão.
```css
.mb-btn {
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%
  ), var(--mb-bg);
}
```
```javascript
// Adicionar ao mousemove handler:
btn.addEventListener('mousemove', (e) => {
  if (!isHovering || !rect) return;
  // ... existing code ...
  const localX = ((e.clientX - rect.left) / rect.width) * 100;
  const localY = ((e.clientY - rect.top) / rect.height) * 100;
  btn.style.setProperty('--mx', localX + '%');
  btn.style.setProperty('--my', localY + '%');
  startAnimate();
}, { passive: true });
```
