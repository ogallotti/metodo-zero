# Custom Cursor Trail

## Quando usar
Cursor customizado com trail/rastro de partículas ou formas que seguem o movimento. Ideal para sites criativos, agências de design, portfólios artísticos, eventos, gaming. Tom lúdico, premium e memorável. O cursor em si pode ser customizado ou manter o default com apenas o trail.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ct-color` | `#6366f1` | Cor principal do trail |
| `--ct-size` | `8px` | Tamanho das partículas do trail |
| `--ct-trail-length` | `20` | Número de pontos no trail (via JS) |
| `--ct-fade-speed` | `0.92` | Velocidade do fade (0-1, mais alto = mais longo) |
| `--ct-blend-mode` | `screen` | Blend mode do trail |
| `--ct-dot-size` | `32px` | Tamanho do cursor dot principal |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<!-- Adicionar no body (antes do fechamento) -->
<div class="ct-cursor" id="customCursor" aria-hidden="true">
  <div class="ct-cursor__dot"></div>
</div>
<canvas class="ct-cursor__trail" id="cursorTrail" aria-hidden="true"></canvas>
```

## CSS

```css
.ct-cursor {
  --ct-color: var(--color-primary, #6366f1);
  --ct-dot-size: 32px;

  position: fixed;
  top: 0;
  left: 0;
  width: var(--ct-dot-size);
  height: var(--ct-dot-size);
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.ct-cursor__dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--ct-color);
  opacity: 0.8;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.ct-cursor.is-hovering .ct-cursor__dot {
  transform: scale(1.5);
  opacity: 0.5;
}

.ct-cursor.is-clicking .ct-cursor__dot {
  transform: scale(0.7);
}

.ct-cursor__trail {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99998;
}

/* Esconder em mobile e touch devices */
@media (hover: none), (pointer: coarse) {
  .ct-cursor,
  .ct-cursor__trail {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ct-cursor,
  .ct-cursor__trail {
    display: none !important;
  }
}

/* Esconder cursor nativo opcionalmente (classe no body) */
body.ct-custom-cursor,
body.ct-custom-cursor a,
body.ct-custom-cursor button,
body.ct-custom-cursor [role="button"] {
  cursor: none;
}
```

## JavaScript

```javascript
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (reducedMotion || isTouchDevice) return;

  const cursorEl = document.getElementById('customCursor');
  const canvas = document.getElementById('cursorTrail');
  if (!cursorEl || !canvas) return;

  const ctx = canvas.getContext('2d');

  const config = {
    trailLength: 20,
    fadeSpeed: 0.92,
    particleSize: 4,
    color: getComputedStyle(cursorEl).getPropertyValue('--ct-color').trim() || '#6366f1',
    lerpSpeed: 0.15,
  };

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let trail = [];
  let isVisible = false;

  /* Resize canvas */
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* Parse color to RGB */
  function parseColor(color) {
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    const match = computed.match(/(\d+)/g);
    return match ? { r: +match[0], g: +match[1], b: +match[2] } : { r: 99, g: 102, b: 241 };
  }

  const rgb = parseColor(config.color);

  /* Mouse tracking */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursorEl.style.opacity = '1';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursorEl.style.opacity = '0';
  });

  /* Hover state for interactive elements */
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
    cursorEl.classList.toggle('is-hovering', !!target);
  }, { passive: true });

  /* Click state */
  document.addEventListener('mousedown', () => {
    cursorEl.classList.add('is-clicking');
  });
  document.addEventListener('mouseup', () => {
    cursorEl.classList.remove('is-clicking');
  });

  /* Animation loop */
  function animate() {
    /* Lerp cursor position */
    cursorX += (mouseX - cursorX) * config.lerpSpeed;
    cursorY += (mouseY - cursorY) * config.lerpSpeed;

    /* Update custom cursor position */
    cursorEl.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`;

    /* Add to trail */
    trail.push({
      x: mouseX,
      y: mouseY,
      alpha: 1,
      size: config.particleSize,
    });

    /* Limit trail length */
    if (trail.length > config.trailLength) {
      trail.shift();
    }

    /* Draw trail */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const point = trail[i];
      point.alpha *= config.fadeSpeed;

      if (point.alpha < 0.01) continue;

      const progress = i / trail.length;
      const size = point.size * progress;

      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${point.alpha * 0.6})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  /* Optional: hide native cursor */
  document.body.classList.add('ct-custom-cursor');

  animate();
})();
```

## Integração
Adicionar o HTML antes do `</body>`. O JS é auto-contido. O trail usa Canvas para performance. O cursor customizado usa CSS `mix-blend-mode: difference` para funcionar sobre qualquer fundo. A classe `ct-custom-cursor` no body esconde o cursor nativo (remover se quiser manter ambos). Interactive elements (links, buttons) expandem o cursor automaticamente.

## Variações

### Variação 1: Glow Trail (Trilha Brilhante)
Trail com efeito de glow/neon. Mais dramático.
```javascript
// Substituir a seção de draw trail:
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.globalCompositeOperation = 'lighter';

for (let i = 0; i < trail.length; i++) {
  const point = trail[i];
  point.alpha *= 0.95;
  if (point.alpha < 0.01) continue;

  const progress = i / trail.length;
  const size = point.size * progress * 2;

  const gradient = ctx.createRadialGradient(
    point.x, point.y, 0,
    point.x, point.y, size * 3
  );
  gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${point.alpha * 0.8})`);
  gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

  ctx.beginPath();
  ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}
ctx.globalCompositeOperation = 'source-over';
```

### Variação 2: Connected Line Trail
Trail como uma linha conectada em vez de partículas. Visual mais clean.
```javascript
// Substituir draw trail:
ctx.clearRect(0, 0, canvas.width, canvas.height);

if (trail.length < 2) return;

ctx.beginPath();
ctx.moveTo(trail[0].x, trail[0].y);

for (let i = 1; i < trail.length; i++) {
  const point = trail[i];
  point.alpha *= config.fadeSpeed;

  const prev = trail[i - 1];
  const cpX = (prev.x + point.x) / 2;
  const cpY = (prev.y + point.y) / 2;
  ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
}

ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.stroke();
```

### Variação 3: Dot Ring Cursor (Sem Trail Canvas)
Cursor custom com anel + ponto, sem trail de partículas. Mais sutil e profissional.
```html
<!-- Substituir HTML por: -->
<div class="ct-cursor ct-cursor--ring" id="customCursor" aria-hidden="true">
  <div class="ct-cursor__dot"></div>
  <div class="ct-cursor__ring"></div>
</div>
```
```css
.ct-cursor--ring {
  --ct-dot-size: 6px;
  --ct-ring-size: 36px;
}
.ct-cursor--ring .ct-cursor__dot {
  width: var(--ct-dot-size);
  height: var(--ct-dot-size);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.ct-cursor--ring .ct-cursor__ring {
  width: var(--ct-ring-size);
  height: var(--ct-ring-size);
  border: 1.5px solid var(--ct-color);
  border-radius: 50%;
  opacity: 0.5;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s;
}
.ct-cursor--ring.is-hovering .ct-cursor__ring {
  transform: scale(1.8);
  opacity: 0.3;
}
```
```javascript
// Remover o canvas e trail logic, manter apenas cursor dot + ring seguindo mouse
```
