# Gradient Mesh Animated

## Quando usar
Background animado com gradientes orgânicos que se movem suavemente. Perfeito para landing pages de design, criatividade, wellness, fintech. CSS puro — zero dependências, carregamento instantâneo. Tom elegante e contemporâneo.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--gm-color-1` | `#6366f1` | Primeira cor do mesh |
| `--gm-color-2` | `#ec4899` | Segunda cor do mesh |
| `--gm-color-3` | `#06b6d4` | Terceira cor do mesh |
| `--gm-color-4` | `#8b5cf6` | Quarta cor do mesh |
| `--gm-bg` | `#0a0a0a` | Cor de fundo base |
| `--gm-speed` | `20s` | Duração do ciclo de animação |
| `--gm-blur` | `80px` | Intensidade do blur nos blobs |
| `--gm-opacity` | `0.6` | Opacidade dos blobs |

## Dependências
- CSS puro — nenhuma dependência externa

## HTML

```html
<section class="gm-hero" id="gradientMeshHero">
  <div class="gm-hero__mesh" aria-hidden="true">
    <div class="gm-hero__blob gm-hero__blob--1"></div>
    <div class="gm-hero__blob gm-hero__blob--2"></div>
    <div class="gm-hero__blob gm-hero__blob--3"></div>
    <div class="gm-hero__blob gm-hero__blob--4"></div>
  </div>
  <div class="gm-hero__content">
    <h1 class="gm-hero__title">Your Headline Here</h1>
    <p class="gm-hero__subtitle">Supporting text goes here</p>
    <a href="#" class="gm-hero__cta">Get Started</a>
  </div>
</section>
```

## CSS

```css
.gm-hero {
  --gm-color-1: #6366f1;
  --gm-color-2: #ec4899;
  --gm-color-3: #06b6d4;
  --gm-color-4: #8b5cf6;
  --gm-bg: var(--color-bg, #0a0a0a);
  --gm-speed: 20s;
  --gm-blur: 80px;
  --gm-opacity: 0.6;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--gm-bg);
}

.gm-hero__mesh {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  filter: blur(var(--gm-blur));
  z-index: 1;
}

.gm-hero__blob {
  position: absolute;
  border-radius: 50%;
  opacity: var(--gm-opacity);
  will-change: transform;
}

.gm-hero__blob--1 {
  width: 45%;
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--gm-color-1), transparent 70%);
  top: -10%;
  left: -5%;
  animation: gm-float-1 var(--gm-speed) ease-in-out infinite;
}

.gm-hero__blob--2 {
  width: 40%;
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--gm-color-2), transparent 70%);
  top: 50%;
  right: -10%;
  animation: gm-float-2 var(--gm-speed) ease-in-out infinite;
  animation-delay: calc(var(--gm-speed) * -0.25);
}

.gm-hero__blob--3 {
  width: 35%;
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--gm-color-3), transparent 70%);
  bottom: -5%;
  left: 20%;
  animation: gm-float-3 var(--gm-speed) ease-in-out infinite;
  animation-delay: calc(var(--gm-speed) * -0.5);
}

.gm-hero__blob--4 {
  width: 30%;
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--gm-color-4), transparent 70%);
  top: 20%;
  left: 50%;
  animation: gm-float-4 var(--gm-speed) ease-in-out infinite;
  animation-delay: calc(var(--gm-speed) * -0.75);
}

@keyframes gm-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(10%, 15%) scale(1.1); }
  50% { transform: translate(5%, 25%) scale(0.95); }
  75% { transform: translate(-5%, 10%) scale(1.05); }
}

@keyframes gm-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-15%, -10%) scale(1.05); }
  50% { transform: translate(-10%, 5%) scale(1.1); }
  75% { transform: translate(5%, -15%) scale(0.95); }
}

@keyframes gm-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(15%, -10%) scale(0.95); }
  50% { transform: translate(-5%, -20%) scale(1.1); }
  75% { transform: translate(10%, -5%) scale(1.05); }
}

@keyframes gm-float-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-10%, 20%) scale(1.1); }
  50% { transform: translate(10%, 10%) scale(0.95); }
  75% { transform: translate(-15%, -5%) scale(1.05); }
}

.gm-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.gm-hero__title {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.gm-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
  line-height: 1.5;
}

.gm-hero__cta {
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

.gm-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .gm-hero {
    --gm-blur: 50px;
  }
  .gm-hero__blob--1 { width: 60%; }
  .gm-hero__blob--2 { width: 55%; }
  .gm-hero__blob--3 { width: 50%; }
  .gm-hero__blob--4 { width: 45%; }
}

@media (prefers-reduced-motion: reduce) {
  .gm-hero__blob {
    animation: none;
  }
}
```

## JavaScript

```javascript
/* Nenhum JavaScript necessário — efeito é 100% CSS */
```

## Integração
Bloco HTML direto na hero section. Zero JavaScript, zero dependências. As cores dos blobs devem ser ajustadas para combinar com a paleta do projeto. O `filter: blur()` cria a fusão entre os gradientes. Em dispositivos mobile o blur é reduzido para performance.

## Variações

### Variação 1: Warm Sunset (Tons Quentes)
Paleta quente para projetos de lifestyle, food, wellness.
```css
.gm-hero {
  --gm-color-1: #f97316;
  --gm-color-2: #ef4444;
  --gm-color-3: #eab308;
  --gm-color-4: #f472b6;
  --gm-bg: #1a0a00;
  --gm-speed: 25s;
  --gm-opacity: 0.5;
}
```

### Variação 2: Monochrome Depth (Monocromático)
Variação sutil com tons de uma única cor. Elegante e sofisticado.
```css
.gm-hero {
  --gm-color-1: #3b82f6;
  --gm-color-2: #1d4ed8;
  --gm-color-3: #60a5fa;
  --gm-color-4: #2563eb;
  --gm-bg: #030712;
  --gm-blur: 100px;
  --gm-opacity: 0.4;
  --gm-speed: 30s;
}
```

### Variação 3: Neon Vivid (Alto Contraste)
Cores vibrantes e neon para projetos de gaming, entertainment, nightlife.
```css
.gm-hero {
  --gm-color-1: #00ff88;
  --gm-color-2: #ff0080;
  --gm-color-3: #00ccff;
  --gm-color-4: #ffcc00;
  --gm-bg: #000000;
  --gm-blur: 60px;
  --gm-opacity: 0.7;
  --gm-speed: 15s;
}
```
