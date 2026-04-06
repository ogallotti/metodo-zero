# Wave Animation

## Quando usar
Ondas SVG animadas como background ou divisor no hero. Diferente do wave-divider (que é transição entre seções) — aqui as ondas são o fundo decorativo principal. Ideal para ocean/water themes, music, wellness, flow/productivity. Tom calmo, fluido e dinâmico.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--wa-color-1` | `#6366f1` | Cor da primeira onda |
| `--wa-color-2` | `#818cf8` | Cor da segunda onda |
| `--wa-color-3` | `#a5b4fc` | Cor da terceira onda |
| `--wa-speed` | `6s` | Velocidade da animação |
| `--wa-height` | `40%` | Altura que as ondas ocupam (de baixo) |
| `--wa-opacity` | `0.15` | Opacidade base |

## Dependências
- SVG + CSS — nenhuma dependência externa

## HTML

```html
<section class="wa-hero" id="waveAnimHero">
  <div class="wa-hero__waves" aria-hidden="true">
    <svg class="wa-hero__svg" viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path class="wa-hero__wave wa-hero__wave--1"
            d="M0,300 C240,200 480,350 720,280 C960,210 1200,330 1440,300 L1440,400 L0,400 Z" />
      <path class="wa-hero__wave wa-hero__wave--2"
            d="M0,320 C240,260 480,370 720,310 C960,250 1200,350 1440,320 L1440,400 L0,400 Z" />
      <path class="wa-hero__wave wa-hero__wave--3"
            d="M0,340 C240,300 480,380 720,340 C960,300 1200,370 1440,340 L1440,400 L0,400 Z" />
    </svg>
  </div>
  <div class="wa-hero__content">
    <h1 class="wa-hero__title">Ride the Wave</h1>
    <p class="wa-hero__subtitle">Smooth experiences that flow naturally</p>
    <a href="#" class="wa-hero__cta">Dive In</a>
  </div>
</section>
```

## CSS

```css
.wa-hero {
  --wa-color-1: var(--color-primary, #6366f1);
  --wa-color-2: #818cf8;
  --wa-color-3: #a5b4fc;
  --wa-speed: 6s;
  --wa-opacity: 0.15;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.wa-hero__waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 40%;
  z-index: 1;
}

.wa-hero__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.wa-hero__wave--1 {
  fill: var(--wa-color-1);
  opacity: var(--wa-opacity);
  animation: wa-drift var(--wa-speed) ease-in-out infinite alternate;
}

.wa-hero__wave--2 {
  fill: var(--wa-color-2);
  opacity: calc(var(--wa-opacity) * 1.5);
  animation: wa-drift var(--wa-speed) ease-in-out infinite alternate-reverse;
  animation-delay: calc(var(--wa-speed) * -0.3);
}

.wa-hero__wave--3 {
  fill: var(--wa-color-3);
  opacity: calc(var(--wa-opacity) * 2);
  animation: wa-drift calc(var(--wa-speed) * 0.8) ease-in-out infinite alternate;
  animation-delay: calc(var(--wa-speed) * -0.6);
}

@keyframes wa-drift {
  0% { d: path("M0,300 C240,200 480,350 720,280 C960,210 1200,330 1440,300 L1440,400 L0,400 Z"); }
  100% { d: path("M0,280 C240,340 480,220 720,300 C960,350 1200,240 1440,280 L1440,400 L0,400 Z"); }
}

.wa-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.wa-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.wa-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
}

.wa-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.wa-hero__cta:hover { transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .wa-hero__wave--1, .wa-hero__wave--2, .wa-hero__wave--3 { animation: none; }
}
```

## JavaScript

```javascript
/* Efeito é 100% CSS + SVG — nenhum JavaScript necessário */
```

## Integração
Ondas SVG com animação CSS de morphing via `d` property. Width 200% com overflow hidden para simular drift horizontal. Três camadas com opacidades diferentes criam profundidade. Cores devem harmonizar com a paleta do projeto.

## Variações

### Variação 1: Ocean Gradient (Azul Profundo)
```css
.wa-hero {
  --wa-color-1: #0369a1;
  --wa-color-2: #0284c7;
  --wa-color-3: #38bdf8;
  --wa-opacity: 0.2;
  background: linear-gradient(180deg, #0c4a6e 0%, #082f49 100%);
}
```

### Variação 2: Top Waves (Ondas no Topo)
Ondas no topo da seção em vez do bottom.
```css
.wa-hero__waves { top: 0; bottom: auto; transform: rotate(180deg); }
```

### Variação 3: Full Height Waves
Ondas ocupam toda a altura como background.
```css
.wa-hero__waves { height: 100%; }
.wa-hero { --wa-opacity: 0.08; }
```
