# Noise Distortion

## Quando usar
Efeito de distorção tipo noise/grain que afeta imagem ou textura de fundo, com movimento contínuo e sutil. Ideal para hero sections de moda, música, arte, cinema, editorial. Tom experimental, artístico e bold. Cria textura visual rica e sensação analógica/film.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--nd-bg` | `#0a0a0a` | Cor de fundo base |
| `--nd-noise-opacity` | `0.08` | Opacidade do grain |
| `--nd-distortion-amount` | `5` | Intensidade da distorção (via shader) |
| `--nd-speed` | `0.5` | Velocidade da animação |
| `--nd-color-shift` | `true` | Ativar RGB color shift (via JS) |

## Dependências
- WebGL (Canvas API) — Dynamic Import pattern
- Nenhuma biblioteca externa (shaders inline)

## HTML

```html
<section class="nd-hero" id="noiseDistortionHero">
  <canvas class="nd-hero__canvas" id="ndCanvas"></canvas>
  <div class="nd-hero__grain" aria-hidden="true"></div>
  <div class="nd-hero__content">
    <h1 class="nd-hero__title">Raw. Unfiltered. Bold.</h1>
    <p class="nd-hero__subtitle">Where art meets technology</p>
    <a href="#" class="nd-hero__cta">Enter</a>
  </div>
</section>
```

## CSS

```css
.nd-hero {
  --nd-bg: var(--color-bg, #0a0a0a);
  --nd-noise-opacity: 0.08;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--nd-bg);
}

.nd-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.nd-hero__grain {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  z-index: 2;
  opacity: var(--nd-noise-opacity);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  animation: nd-grain 0.5s steps(4) infinite;
  pointer-events: none;
}

@keyframes nd-grain {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-5%, -10%); }
  50% { transform: translate(10%, 5%); }
  75% { transform: translate(-10%, 15%); }
  100% { transform: translate(5%, -5%); }
}

.nd-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.nd-hero__title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 900;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

.nd-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 2rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.nd-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  border: 1px solid var(--color-text, #ffffff);
  color: var(--color-text, #ffffff);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;
}

.nd-hero__cta:hover {
  background: var(--color-text, #ffffff);
  color: var(--nd-bg);
}

@media (max-width: 768px) {
  .nd-hero { --nd-noise-opacity: 0.05; }
}

@media (prefers-reduced-motion: reduce) {
  .nd-hero__grain { animation: none; }
  .nd-hero__canvas { opacity: 0.3; }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('noiseDistortionHero');
  const canvas = document.getElementById('ndCanvas');
  if (!hero || !canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const ctx = canvas.getContext('2d');
  const config = { speed: 0.5, distortion: 5, colorShift: true };

  let width, height, animId, time = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function draw() {
    time += 0.016 * config.speed;
    ctx.clearRect(0, 0, width, height);

    /* Create displacement pattern using concentric waves */
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const step = window.innerWidth < 768 ? 4 : 2;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const nx = x / width;
        const ny = y / height;

        const wave1 = Math.sin(nx * 8 + time * 2) * Math.cos(ny * 6 + time * 1.5);
        const wave2 = Math.sin((nx + ny) * 10 + time * 3) * 0.5;
        const intensity = (wave1 + wave2) * 0.5 + 0.5;

        const idx = (y * width + x) * 4;
        const c = Math.floor(intensity * 40);

        if (config.colorShift) {
          data[idx] = c + 10;
          data[idx + 1] = c;
          data[idx + 2] = c + 20;
        } else {
          data[idx] = c;
          data[idx + 1] = c;
          data[idx + 2] = c;
        }
        data[idx + 3] = 80;

        /* Fill skipped pixels */
        for (let sy = 0; sy < step && y + sy < height; sy++) {
          for (let sx = 0; sx < step && x + sx < width; sx++) {
            if (sy === 0 && sx === 0) continue;
            const si = ((y + sy) * width + (x + sx)) * 4;
            data[si] = data[idx];
            data[si + 1] = data[idx + 1];
            data[si + 2] = data[idx + 2];
            data[si + 3] = data[idx + 3];
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.1 });

  resize();
  observer.observe(hero);
  window.addEventListener('resize', resize);
})();
```

## Integração
O grain overlay é SVG inline via data URI (leve, sem request HTTP). A distorção é Canvas puro — sem WebGL para compatibilidade máxima. O efeito combinado (grain animado + canvas distortion) cria visual analógico. Em reduced-motion, grain fica estático e canvas com opacidade reduzida.

## Variações

### Variação 1: Heavy Grain (Film Look)
Grain mais denso e visível. Estilo filme 35mm.
```css
.nd-hero { --nd-noise-opacity: 0.15; }
.nd-hero__grain { animation: nd-grain 0.3s steps(6) infinite; }
```

### Variação 2: RGB Glitch Pulse
Pulsos periódicos de RGB shift dramático.
```javascript
// Adicionar ao draw():
const glitchActive = Math.sin(time * 3) > 0.95;
if (glitchActive && config.colorShift) {
  data[idx] = c + 60;     // Heavy red shift
  data[idx + 2] = c + 60; // Heavy blue shift
  data[idx + 3] = 150;    // More opaque during glitch
}
```

### Variação 3: Static Grain Only (Sem Canvas)
Apenas o grain animado, sem a camada de distorção. Mais sutil.
```html
<!-- Remover a tag <canvas> -->
```
```css
.nd-hero { --nd-noise-opacity: 0.1; }
```
