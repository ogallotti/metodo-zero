# Gradient Blend

## Quando usar
Transição suave entre seções usando gradientes que se fundem — a cor de fundo de uma seção gradualmente se mistura com a próxima criando um efeito contínuo. Ideal para storytelling, mood transitions, landing pages com fluxo narrativo, portfolios. Tom elegante e orgânico. Elimina cortes abruptos entre seções.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--gb-height` | `40vh` | Altura da zona de blend |
| `--gb-color-a` | `#0a0a0a` | Cor da seção superior |
| `--gb-color-b` | `#1e1b4b` | Cor da seção inferior |
| `--gb-angle` | `180deg` | Ângulo do gradiente |

## Dependências
- CSS puro (estático) / JavaScript para variação dinâmica — nenhuma dependência externa

## HTML

```html
<section class="gb-section" style="--gb-bg: #0a0a0a;">
  <div class="gb-section__content">
    <h2 class="gb-section__title">Chapter One</h2>
    <p class="gb-section__text">The story begins in darkness</p>
  </div>
</section>

<div class="gb-blend" style="--gb-color-a: #0a0a0a; --gb-color-b: #1e1b4b;"></div>

<section class="gb-section" style="--gb-bg: #1e1b4b;">
  <div class="gb-section__content">
    <h2 class="gb-section__title">Chapter Two</h2>
    <p class="gb-section__text">Color emerges from the void</p>
  </div>
</section>

<div class="gb-blend" style="--gb-color-a: #1e1b4b; --gb-color-b: #042f2e;"></div>

<section class="gb-section" style="--gb-bg: #042f2e;">
  <div class="gb-section__content">
    <h2 class="gb-section__title">Chapter Three</h2>
    <p class="gb-section__text">A new world takes shape</p>
  </div>
</section>
```

## CSS

```css
.gb-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gb-bg, #0a0a0a);
  position: relative;
}

.gb-section__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.gb-section__title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.gb-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
}

.gb-blend {
  --gb-height: 40vh;
  --gb-color-a: #0a0a0a;
  --gb-color-b: #1e1b4b;
  --gb-angle: 180deg;

  height: var(--gb-height);
  background: linear-gradient(
    var(--gb-angle),
    var(--gb-color-a),
    var(--gb-color-b)
  );
  position: relative;
}

/* Smooth edges with pseudo-element overlap */
.gb-blend::before,
.gb-blend::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20%;
  pointer-events: none;
}

.gb-blend::before {
  top: -1px;
  background: linear-gradient(var(--gb-color-a), transparent);
}

.gb-blend::after {
  bottom: -1px;
  background: linear-gradient(transparent, var(--gb-color-b));
}

@media (max-width: 768px) {
  .gb-blend { --gb-height: 25vh; }
}
```

## JavaScript

```javascript
(function () {
  const blends = document.querySelectorAll('.gb-blend');
  if (!blends.length) return;

  /* Optional: add animated gradient noise for organic feel */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  blends.forEach((blend) => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.03;pointer-events:none;mix-blend-mode:overlay;';
    blend.style.position = 'relative';
    blend.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      canvas.width = blend.offsetWidth * dpr;
      canvas.height = blend.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      drawNoise();
    }

    function drawNoise() {
      const w = blend.offsetWidth;
      const h = blend.offsetHeight;
      const imageData = ctx.createImageData(w, h);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
  });
})();
```

## Integração
Coloque um `<div class="gb-blend">` entre seções com `--gb-color-a` (cor da seção acima) e `--gb-color-b` (cor da seção abaixo). O CSS cria o gradiente de transição. O JS opcional adiciona noise sutil para textura orgânica. Não requer GSAP — funciona com CSS puro.

## Variações

### Variação 1: Animated Gradient Blend
O gradiente se move suavemente durante o scroll.
```css
.gb-blend--animated {
  background-size: 100% 200%;
  animation: gbShift 4s ease-in-out infinite alternate;
}
@keyframes gbShift {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}
```

### Variação 2: Multi-Stop Gradient
Transição com parada intermediária de cor.
```html
<div class="gb-blend gb-blend--multi" style="--gb-color-a:#0a0a0a; --gb-color-mid:#6366f1; --gb-color-b:#1e1b4b;"></div>
```
```css
.gb-blend--multi {
  background: linear-gradient(
    var(--gb-angle),
    var(--gb-color-a) 0%,
    var(--gb-color-mid) 50%,
    var(--gb-color-b) 100%
  );
}
```

### Variação 3: Radial Blend
Blend radial emanando do centro.
```css
.gb-blend--radial {
  background: radial-gradient(
    ellipse at center,
    var(--gb-color-b) 0%,
    var(--gb-color-a) 100%
  );
}
```
