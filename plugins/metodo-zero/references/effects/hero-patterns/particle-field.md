# Particle Field

## Quando usar
Campo de partículas interativo como fundo de hero section. Ideal para landing pages de tecnologia, SaaS, crypto, AI/ML. As partículas reagem ao mouse criando conexões dinâmicas (efeito "constellation"). Tom futurista e sofisticado.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--particle-color` | `rgba(255,255,255,0.8)` | Cor das partículas |
| `--particle-line-color` | `rgba(255,255,255,0.15)` | Cor das linhas de conexão |
| `--particle-count` | `80` | Quantidade de partículas (via JS) |
| `--particle-max-size` | `3` | Tamanho máximo das partículas (px) |
| `--particle-speed` | `0.5` | Velocidade de movimento base |
| `--particle-connect-distance` | `120` | Distância máxima para conexão (px) |
| `--particle-mouse-radius` | `150` | Raio de influência do mouse (px) |

## Dependências
- Canvas API (nativo)
- Nenhuma dependência externa

## HTML

```html
<section class="pf-hero" id="particleHero">
  <canvas class="pf-hero__canvas" id="particleCanvas"></canvas>
  <div class="pf-hero__content">
    <h1 class="pf-hero__title">Your Headline Here</h1>
    <p class="pf-hero__subtitle">Supporting text goes here</p>
    <a href="#" class="pf-hero__cta">Get Started</a>
  </div>
</section>
```

## CSS

```css
.pf-hero {
  --particle-color: rgba(255, 255, 255, 0.8);
  --particle-line-color: rgba(255, 255, 255, 0.15);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.pf-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pf-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.pf-hero__title {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.pf-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
  line-height: 1.5;
}

.pf-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: var(--color-bg, #0a0a0a);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pf-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .pf-hero__canvas {
    opacity: 0.3;
  }
}
```

## JavaScript

```javascript
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('particleHero');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = {
    particleCount: window.innerWidth < 768 ? 40 : 80,
    maxSize: 3,
    speed: reducedMotion ? 0 : 0.5,
    connectDistance: window.innerWidth < 768 ? 80 : 120,
    mouseRadius: 150,
    particleColor: getComputedStyle(hero).getPropertyValue('--particle-color').trim() || 'rgba(255,255,255,0.8)',
    lineColor: getComputedStyle(hero).getPropertyValue('--particle-line-color').trim() || 'rgba(255,255,255,0.15)',
  };

  let width, height, particles, mouse, animationId;
  mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * config.maxSize + 0.5,
      });
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = config.particleColor;
    ctx.fill();
  }

  function drawLine(p1, p2, dist) {
    const opacity = 1 - dist / config.connectDistance;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = config.lineColor.replace(/[\d.]+\)$/, opacity * 0.3 + ')');
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.mouseRadius) {
        const force = (config.mouseRadius - dist) / config.mouseRadius;
        p.vx -= (dx / dist) * force * 0.02;
        p.vy -= (dy / dist) * force * 0.02;
      }

      const maxV = config.speed * 2;
      p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
      p.vy = Math.max(-maxV, Math.min(maxV, p.vy));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      drawParticle(particles[i]);
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectDistance) {
          drawLine(particles[i], particles[j], dist);
        }
      }
    }
  }

  function animate() {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animationId) animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    { threshold: 0.1 }
  );

  function init() {
    resize();
    createParticles();
    observer.observe(hero);

    if (!reducedMotion) {
      hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      }, { passive: true });
    }

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  if (reducedMotion) {
    resize();
    createParticles();
    draw();
  } else {
    init();
  }
})();
```

## Integração
Colocar o bloco HTML no topo do `index.html` como primeira section. O Canvas se auto-dimensiona ao container. O JavaScript é auto-contido (IIFE) — sem poluição global. CSS variables herdam do design system do projeto.

## Variações

### Variação 1: Dense Network (Alta Densidade)
Mais partículas, mais conexões. Visual tipo "neural network".
```javascript
// Alterar config:
particleCount: window.innerWidth < 768 ? 60 : 150,
connectDistance: window.innerWidth < 768 ? 100 : 160,
maxSize: 2,
speed: 0.3,
```
```css
.pf-hero {
  --particle-color: rgba(99, 102, 241, 0.9);
  --particle-line-color: rgba(99, 102, 241, 0.2);
}
```

### Variação 2: Floating Dots (Sem Conexões)
Apenas partículas flutuantes sem linhas. Mais minimalista e sutil.
```javascript
// Remover o loop de drawLine no draw():
function draw() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    drawParticle(p);
  }
}
// E ajustar:
particleCount: window.innerWidth < 768 ? 30 : 60,
maxSize: 4,
speed: 0.3,
```

### Variação 3: Gravity Well (Atração ao Mouse)
Partículas são atraídas ao cursor em vez de repelidas.
```javascript
// No update(), inverter a força:
if (dist < config.mouseRadius) {
  const force = (config.mouseRadius - dist) / config.mouseRadius;
  p.vx += (dx / dist) * force * 0.03;
  p.vy += (dy / dist) * force * 0.03;
}
```
