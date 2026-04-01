# Aurora Background

## Quando usar
Fundo animado que simula aurora boreal com faixas de luz colorida ondulando suavemente. Ideal para landing pages de wellness, tecnologia, crypto, fintech, educação. Tom etéreo, calmo e futurista. Combina CSS animations com Canvas overlay para profundidade.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ab-color-1` | `#6366f1` | Primeira cor da aurora |
| `--ab-color-2` | `#06b6d4` | Segunda cor da aurora |
| `--ab-color-3` | `#8b5cf6` | Terceira cor da aurora |
| `--ab-bg` | `#030712` | Cor de fundo (deve ser escura) |
| `--ab-speed` | `12s` | Velocidade da animação CSS |
| `--ab-opacity` | `0.5` | Opacidade geral da aurora |
| `--ab-blur` | `60px` | Blur das faixas |

## Dependências
- CSS + Canvas API — nenhuma dependência externa

## HTML

```html
<section class="ab-hero" id="auroraHero">
  <div class="ab-hero__aurora" aria-hidden="true">
    <div class="ab-hero__band ab-hero__band--1"></div>
    <div class="ab-hero__band ab-hero__band--2"></div>
    <div class="ab-hero__band ab-hero__band--3"></div>
  </div>
  <canvas class="ab-hero__stars" id="auroraStars" aria-hidden="true"></canvas>
  <div class="ab-hero__content">
    <h1 class="ab-hero__title">Your Headline Here</h1>
    <p class="ab-hero__subtitle">Supporting text goes here</p>
    <a href="#" class="ab-hero__cta">Get Started</a>
  </div>
</section>
```

## CSS

```css
.ab-hero {
  --ab-color-1: #6366f1;
  --ab-color-2: #06b6d4;
  --ab-color-3: #8b5cf6;
  --ab-bg: #030712;
  --ab-speed: 12s;
  --ab-opacity: 0.5;
  --ab-blur: 60px;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ab-bg);
}

.ab-hero__aurora {
  position: absolute;
  inset: 0;
  z-index: 1;
  filter: blur(var(--ab-blur));
  opacity: var(--ab-opacity);
}

.ab-hero__band {
  position: absolute;
  width: 200%;
  height: 40%;
  left: -50%;
  border-radius: 50%;
}

.ab-hero__band--1 {
  top: 5%;
  background: radial-gradient(ellipse at center, var(--ab-color-1), transparent 70%);
  animation: ab-drift-1 var(--ab-speed) ease-in-out infinite alternate;
}

.ab-hero__band--2 {
  top: 15%;
  background: radial-gradient(ellipse at center, var(--ab-color-2), transparent 70%);
  animation: ab-drift-2 var(--ab-speed) ease-in-out infinite alternate;
  animation-delay: calc(var(--ab-speed) * -0.33);
}

.ab-hero__band--3 {
  top: 25%;
  background: radial-gradient(ellipse at center, var(--ab-color-3), transparent 70%);
  animation: ab-drift-3 var(--ab-speed) ease-in-out infinite alternate;
  animation-delay: calc(var(--ab-speed) * -0.66);
}

@keyframes ab-drift-1 {
  0% { transform: translateX(-10%) translateY(0) scaleY(1); }
  50% { transform: translateX(15%) translateY(-5%) scaleY(1.3); }
  100% { transform: translateX(-5%) translateY(3%) scaleY(0.8); }
}

@keyframes ab-drift-2 {
  0% { transform: translateX(10%) translateY(0) scaleY(0.9); }
  50% { transform: translateX(-10%) translateY(5%) scaleY(1.2); }
  100% { transform: translateX(5%) translateY(-3%) scaleY(1.1); }
}

@keyframes ab-drift-3 {
  0% { transform: translateX(5%) translateY(3%) scaleY(1.1); }
  50% { transform: translateX(-15%) translateY(-2%) scaleY(0.9); }
  100% { transform: translateX(10%) translateY(5%) scaleY(1.3); }
}

.ab-hero__stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.ab-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.ab-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.ab-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
  line-height: 1.5;
}

.ab-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ab-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .ab-hero {
    --ab-blur: 40px;
    --ab-opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ab-hero__band {
    animation: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const canvas = document.getElementById('auroraStars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const starCount = isMobile ? 60 : 150;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  const stars = [];
  function createStars() {
    stars.length = 0;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  let animId;
  function draw(time) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (const star of stars) {
      const twinkle = reducedMotion
        ? 0.7
        : 0.3 + 0.7 * Math.abs(Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    },
    { threshold: 0.1 }
  );

  resize();
  createStars();
  observer.observe(canvas.parentElement);

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
})();
```

## Integração
A aurora é 100% CSS (bands com gradientes + blur + animação). As estrelas são Canvas overlay leve. O efeito composto é rico mas performa bem. Cores da aurora devem harmonizar com o design system. Fundo escuro é obrigatório para o efeito funcionar. Em reduced-motion, aurora fica estática e estrelas não piscam.

## Variações

### Variação 1: Northern Lights (Verde/Ciano)
Paleta clássica de aurora boreal.
```css
.ab-hero {
  --ab-color-1: #10b981;
  --ab-color-2: #06b6d4;
  --ab-color-3: #34d399;
  --ab-bg: #020617;
  --ab-speed: 16s;
  --ab-opacity: 0.6;
}
```

### Variação 2: Sunset Aurora (Tons Quentes)
Aurora com paleta quente — raro na natureza, impactante no design.
```css
.ab-hero {
  --ab-color-1: #f97316;
  --ab-color-2: #ef4444;
  --ab-color-3: #eab308;
  --ab-bg: #0c0a09;
  --ab-speed: 15s;
  --ab-opacity: 0.45;
}
```

### Variação 3: Minimal Aurora (Sem Estrelas)
Versão mais limpa sem o canvas de estrelas. Foco apenas nas faixas de luz.
```html
<!-- Remover a tag <canvas> do HTML -->
```
```css
.ab-hero {
  --ab-blur: 100px;
  --ab-opacity: 0.35;
  --ab-speed: 20s;
}
```
