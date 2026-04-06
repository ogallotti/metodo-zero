# Morphing Shapes

## Quando usar
Formas SVG que se transformam (morph) continuamente de uma forma para outra como background decorativo. Ideal para hero sections de branding, agências, startups, wellness. Tom orgânico, fluido e moderno. As formas criam visual único e memorável.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ms-color-1` | `#6366f1` | Cor da primeira forma |
| `--ms-color-2` | `#ec4899` | Cor da segunda forma |
| `--ms-opacity` | `0.3` | Opacidade das formas |
| `--ms-speed` | `8s` | Duração do ciclo de morphing |
| `--ms-blur` | `0` | Blur opcional |

## Dependências
- CSS `d` property animation ou GSAP MorphSVG (fallback)
- GSAP 3.12+ (opcional) — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`

## HTML

```html
<section class="ms-hero" id="morphingShapesHero">
  <div class="ms-hero__shapes" aria-hidden="true">
    <svg class="ms-hero__svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
      <path class="ms-hero__shape ms-hero__shape--1"
            d="M400,100 C550,100 700,250 700,400 C700,550 550,700 400,700 C250,700 100,550 100,400 C100,250 250,100 400,100Z" />
      <path class="ms-hero__shape ms-hero__shape--2"
            d="M400,150 C520,80 720,200 680,400 C640,580 480,720 350,680 C200,640 80,500 120,350 C160,200 280,120 400,150Z" />
    </svg>
  </div>
  <div class="ms-hero__content">
    <h1 class="ms-hero__title">Shape the Future</h1>
    <p class="ms-hero__subtitle">Organic innovation for modern brands</p>
    <a href="#" class="ms-hero__cta">Get Started</a>
  </div>
</section>
```

## CSS

```css
.ms-hero {
  --ms-color-1: var(--color-primary, #6366f1);
  --ms-color-2: var(--color-accent, #ec4899);
  --ms-opacity: 0.3;
  --ms-speed: 8s;
  --ms-blur: 0px;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.ms-hero__shapes {
  position: absolute;
  inset: 0;
  z-index: 1;
  filter: blur(var(--ms-blur));
}

.ms-hero__svg {
  width: 100%;
  height: 100%;
}

.ms-hero__shape {
  opacity: var(--ms-opacity);
}

.ms-hero__shape--1 {
  fill: var(--ms-color-1);
  animation: ms-morph-1 var(--ms-speed) ease-in-out infinite alternate;
}

.ms-hero__shape--2 {
  fill: var(--ms-color-2);
  animation: ms-morph-2 var(--ms-speed) ease-in-out infinite alternate;
  animation-delay: calc(var(--ms-speed) * -0.5);
}

@keyframes ms-morph-1 {
  0% { d: path("M400,100 C550,100 700,250 700,400 C700,550 550,700 400,700 C250,700 100,550 100,400 C100,250 250,100 400,100Z"); }
  33% { d: path("M420,80 C600,120 720,280 680,420 C640,560 500,700 380,680 C220,660 80,520 100,380 C120,220 260,60 420,80Z"); }
  66% { d: path("M380,120 C520,60 740,220 700,380 C660,540 520,720 360,700 C200,680 60,540 80,360 C100,200 240,140 380,120Z"); }
  100% { d: path("M400,100 C550,100 700,250 700,400 C700,550 550,700 400,700 C250,700 100,550 100,400 C100,250 250,100 400,100Z"); }
}

@keyframes ms-morph-2 {
  0% { d: path("M400,150 C520,80 720,200 680,400 C640,580 480,720 350,680 C200,640 80,500 120,350 C160,200 280,120 400,150Z"); }
  33% { d: path("M380,130 C560,100 700,240 680,380 C660,520 540,680 380,660 C220,640 100,480 140,340 C180,180 280,100 380,130Z"); }
  66% { d: path("M420,140 C580,110 740,260 700,420 C660,580 500,740 340,700 C180,660 60,500 100,340 C140,180 280,120 420,140Z"); }
  100% { d: path("M400,150 C520,80 720,200 680,400 C640,580 480,720 350,680 C200,640 80,500 120,350 C160,200 280,120 400,150Z"); }
}

.ms-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.ms-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.ms-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
}

.ms-hero__cta {
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

.ms-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .ms-hero__shape { animation: none; }
}
```

## JavaScript

```javascript
/* Efeito é 100% CSS via d path animation.
   CSS `d` property animation: Chrome 89+, Firefox 97+, Safari 13.1+.
   Para browsers mais antigos, as formas ficam estáticas (graceful degradation). */
```

## Integração
SVG morphing via CSS `d` property — sem JavaScript necessário. As formas devem ter o MESMO número de pontos de controle para o morphing funcionar suavemente. O SVG usa `preserveAspectRatio="xMidYMid slice"` para cobrir toda a área. Opacidade baixa mantém o texto legível.

## Variações

### Variação 1: Blurred Shapes (Gradient Feel)
Formas com blur intenso, visual de gradient mesh.
```css
.ms-hero { --ms-blur: 60px; --ms-opacity: 0.5; }
```

### Variação 2: Outlined Shapes (Wireframe)
Formas com stroke em vez de fill. Estilo técnico.
```css
.ms-hero__shape { fill: none; stroke-width: 2; opacity: 0.4; }
.ms-hero__shape--1 { stroke: var(--ms-color-1); }
.ms-hero__shape--2 { stroke: var(--ms-color-2); }
```

### Variação 3: Multiple Small Shapes
Muitas formas menores espalhadas.
```html
<svg class="ms-hero__svg" viewBox="0 0 800 800">
  <path class="ms-hero__shape ms-hero__shape--1" style="transform:translate(100px,100px) scale(0.3);" d="..." />
  <path class="ms-hero__shape ms-hero__shape--2" style="transform:translate(500px,200px) scale(0.25);" d="..." />
  <path class="ms-hero__shape ms-hero__shape--1" style="transform:translate(200px,500px) scale(0.2);" d="..." />
  <path class="ms-hero__shape ms-hero__shape--2" style="transform:translate(600px,550px) scale(0.35);" d="..." />
</svg>
```
