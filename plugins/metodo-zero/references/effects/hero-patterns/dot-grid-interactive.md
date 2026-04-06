# Dot Grid Interactive

## Quando usar
Grid de pontos que reage ao cursor — pontos próximos ao mouse mudam tamanho, cor ou se conectam. Ideal para tech, data visualization, AI/ML, developer tools. Tom minimal, técnico e interativo. Visual tipo "matrix" ou "data field".

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--dg-dot-color` | `rgba(255,255,255,0.2)` | Cor dos dots inativos |
| `--dg-active-color` | `#6366f1` | Cor dos dots ativos (perto do mouse) |
| `--dg-dot-size` | `2` | Tamanho base dos dots (px, via JS) |
| `--dg-spacing` | `30` | Espaçamento entre dots (px, via JS) |
| `--dg-mouse-radius` | `120` | Raio de influência do mouse (px, via JS) |

## Dependências
- Canvas API — nenhuma dependência externa

## HTML

```html
<section class="dg-hero" id="dotGridHero">
  <canvas class="dg-hero__canvas" id="dgCanvas"></canvas>
  <div class="dg-hero__content">
    <h1 class="dg-hero__title">Data-Driven Design</h1>
    <p class="dg-hero__subtitle">Intelligence meets aesthetics</p>
    <a href="#" class="dg-hero__cta">Learn More</a>
  </div>
</section>
```

## CSS

```css
.dg-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.dg-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.dg-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.dg-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.dg-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
}

.dg-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.dg-hero__cta:hover { transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .dg-hero__canvas { opacity: 0.3; }
}
```

## JavaScript

```javascript
(function () {
  const canvas = document.getElementById('dgCanvas');
  const hero = document.getElementById('dotGridHero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  const config = {
    spacing: isMobile ? 40 : 30,
    dotSize: 2,
    mouseRadius: isMobile ? 80 : 120,
    activeColor: { r: 99, g: 102, b: 241 },
    inactiveColor: { r: 255, g: 255, b: 255 },
    inactiveAlpha: 0.15,
  };

  let width, height, dots, mouse = { x: -9999, y: -9999 }, animId;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    createDots();
  }

  function createDots() {
    dots = [];
    for (let x = config.spacing / 2; x < width; x += config.spacing) {
      for (let y = config.spacing / 2; y < height; y += config.spacing) {
        dots.push({ x, y });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const { r: ar, g: ag, b: ab } = config.activeColor;
    const { r: ir, g: ig, b: ib } = config.inactiveColor;

    for (const dot of dots) {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / config.mouseRadius);

      const size = config.dotSize + influence * 4;
      const r = Math.round(ir + (ar - ir) * influence);
      const g = Math.round(ig + (ag - ig) * influence);
      const b = Math.round(ib + (ab - ib) * influence);
      const alpha = config.inactiveAlpha + influence * 0.85;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  if (!reducedMotion) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { if (!animId) animId = requestAnimationFrame(draw); }
    else { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0.1 });

  resize();
  observer.observe(hero);
  window.addEventListener('resize', resize);

  if (reducedMotion) { draw(); cancelAnimationFrame(animId); animId = null; }
})();
```

## Integração
Canvas se auto-dimensiona. Grid de dots se recria no resize. Mouse tracking com passive listener. IntersectionObserver pausa quando off-screen. Zero dependências.

## Variações

### Variação 1: Wave Animation (Sem Mouse)
Dots ondulam autonomamente, sem interação do mouse.
```javascript
// No draw(), substituir cálculo de influence:
const time = performance.now() * 0.001;
const wave = Math.sin(dot.x * 0.02 + time * 2) * Math.cos(dot.y * 0.02 + time * 1.5);
const influence = (wave + 1) * 0.5;
```

### Variação 2: Connected Dots (Grid Network)
Dots próximos ao mouse se conectam com linhas.
```javascript
// Após desenhar todos os dots, adicionar:
const activeDots = dots.filter(d => {
  const dist = Math.sqrt((mouse.x - d.x) ** 2 + (mouse.y - d.y) ** 2);
  return dist < config.mouseRadius;
});
activeDots.forEach((d1, i) => {
  activeDots.slice(i + 1).forEach(d2 => {
    const dist = Math.sqrt((d1.x - d2.x) ** 2 + (d1.y - d2.y) ** 2);
    if (dist < config.spacing * 1.5) {
      ctx.beginPath();
      ctx.moveTo(d1.x, d1.y);
      ctx.lineTo(d2.x, d2.y);
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.15)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  });
});
```

### Variação 3: Cross Pattern (Em Vez de Dots)
Cruzes em vez de círculos. Visual mais técnico.
```javascript
// Substituir ctx.arc por cruzes:
const half = size;
ctx.beginPath();
ctx.moveTo(dot.x - half, dot.y);
ctx.lineTo(dot.x + half, dot.y);
ctx.moveTo(dot.x, dot.y - half);
ctx.lineTo(dot.x, dot.y + half);
ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
ctx.lineWidth = 1;
ctx.stroke();
```
