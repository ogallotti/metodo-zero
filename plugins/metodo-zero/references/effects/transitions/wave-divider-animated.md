# Wave Divider Animated

## Quando usar
Divisor ondulado animado entre seções — substitui a linha reta por uma onda orgânica SVG com animação sutil. Ideal para seções de features, pricing, testimonials, footer. Tom fluido, friendly e premium. Evita a monotonia de seções retangulares empilhadas.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--wd-color` | `#111827` | Cor do wave (deve ser a cor de fundo da seção de BAIXO) |
| `--wd-height` | `80px` | Altura da onda |
| `--wd-speed` | `8s` | Velocidade da animação |
| `--wd-amplitude` | `20` | Amplitude da onda (variação via viewBox) |
| `--wd-position` | `bottom` | Posição (top ou bottom da seção) |

## Dependências
- SVG inline + CSS — nenhuma dependência externa

## HTML

```html
<!-- Wave no bottom da seção (transição para a próxima seção) -->
<section class="wd-section wd-section--dark" id="waveDividerSection">
  <div class="wd-section__content">
    <h2 class="wd-section__title">Section Title</h2>
    <p class="wd-section__text">Section content goes here.</p>
  </div>

  <div class="wd-divider wd-divider--bottom" aria-hidden="true">
    <svg class="wd-divider__svg" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path class="wd-divider__wave wd-divider__wave--1"
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" />
      <path class="wd-divider__wave wd-divider__wave--2"
            d="M0,80 C240,20 480,100 720,40 C960,100 1200,20 1440,80 L1440,120 L0,120 Z" />
      <path class="wd-divider__wave wd-divider__wave--3"
            d="M0,100 C240,60 480,120 720,80 C960,40 1200,100 1440,60 L1440,120 L0,120 Z" />
    </svg>
  </div>
</section>

<section class="wd-section wd-section--light">
  <div class="wd-section__content">
    <h2 class="wd-section__title">Next Section</h2>
    <p class="wd-section__text">Content of the following section.</p>
  </div>
</section>
```

## CSS

```css
.wd-section {
  position: relative;
  padding: clamp(4rem, 10vw, 8rem) 0;
}

.wd-section--dark {
  background: var(--color-bg, #0a0a0a);
  padding-bottom: calc(clamp(4rem, 10vw, 8rem) + var(--wd-height, 80px));
}

.wd-section--light {
  background: var(--color-bg-alt, #111827);
}

.wd-section__content {
  width: min(90%, 55rem);
  margin: 0 auto;
  text-align: center;
}

.wd-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.wd-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0;
}

/* === Wave Divider === */

.wd-divider {
  --wd-color: var(--color-bg-alt, #111827);
  --wd-height: 80px;
  --wd-speed: 8s;

  position: absolute;
  left: 0;
  width: 100%;
  height: var(--wd-height);
  overflow: hidden;
  line-height: 0;
}

.wd-divider--bottom {
  bottom: 0;
}

.wd-divider--top {
  top: 0;
  transform: rotate(180deg);
}

.wd-divider__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.wd-divider__wave {
  fill: var(--wd-color);
}

.wd-divider__wave--1 {
  opacity: 0.3;
  animation: wd-wave-shift var(--wd-speed) ease-in-out infinite alternate;
}

.wd-divider__wave--2 {
  opacity: 0.5;
  animation: wd-wave-shift var(--wd-speed) ease-in-out infinite alternate-reverse;
  animation-delay: calc(var(--wd-speed) * -0.3);
}

.wd-divider__wave--3 {
  opacity: 1;
  animation: wd-wave-shift-subtle calc(var(--wd-speed) * 1.5) ease-in-out infinite alternate;
  animation-delay: calc(var(--wd-speed) * -0.6);
}

@keyframes wd-wave-shift {
  0% { d: path("M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"); }
  100% { d: path("M0,80 C240,20 480,100 720,40 C960,100 1200,20 1440,80 L1440,120 L0,120 Z"); }
}

@keyframes wd-wave-shift-subtle {
  0% { d: path("M0,100 C240,60 480,120 720,80 C960,40 1200,100 1440,60 L1440,120 L0,120 Z"); }
  100% { d: path("M0,70 C240,100 480,40 720,90 C960,60 1200,110 1440,70 L1440,120 L0,120 Z"); }
}

@media (max-width: 768px) {
  .wd-divider {
    --wd-height: 50px;
  }
  .wd-section--dark {
    padding-bottom: calc(clamp(4rem, 10vw, 8rem) + 50px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wd-divider__wave {
    animation: none;
  }
}
```

## JavaScript

```javascript
/* Nenhum JavaScript necessário — efeito é 100% CSS + SVG
 *
 * Nota: A propriedade CSS `d` para animar SVG path é suportada em
 * Chrome 89+, Firefox 97+, Safari 13.1+. Para browsers mais antigos,
 * as ondas ficam estáticas (graceful degradation).
 *
 * Se precisar de suporte para browsers antigos, usar GSAP MorphSVG:
 * gsap.to('.wd-divider__wave--1', {
 *   attr: { d: "M0,80 C240,20 480,100 720,40..." },
 *   duration: 4,
 *   repeat: -1,
 *   yoyo: true,
 *   ease: 'sine.inOut'
 * });
 */
```

## Integração
O SVG wave é posicionado absolute no bottom da seção. A cor do wave (`--wd-color`) deve ser a cor de fundo da seção SEGUINTE para criar continuidade visual. A seção precisa de padding-bottom extra para acomodar a altura da onda. Múltiplos dividers podem coexistir (bottom de uma seção, top da próxima).

## Variações

### Variação 1: Single Smooth Wave (Minimalista)
Uma única onda suave sem camadas sobrepostas.
```html
<div class="wd-divider wd-divider--bottom" aria-hidden="true">
  <svg class="wd-divider__svg" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path class="wd-divider__wave wd-divider__wave--single"
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" />
  </svg>
</div>
```
```css
.wd-divider__wave--single {
  fill: var(--wd-color);
  opacity: 1;
  animation: wd-wave-single 10s ease-in-out infinite alternate;
}
@keyframes wd-wave-single {
  0% { d: path("M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z"); }
  100% { d: path("M0,50 C360,10 720,70 1080,30 C1260,50 1380,60 1440,40 L1440,80 L0,80 Z"); }
}
```

### Variação 2: Stacked Layers (Cores Diferentes)
Múltiplas camadas com cores distintas para efeito de profundidade.
```css
.wd-divider__wave--1 {
  fill: var(--color-primary, #6366f1);
  opacity: 0.2;
}
.wd-divider__wave--2 {
  fill: var(--color-accent, #ec4899);
  opacity: 0.15;
}
.wd-divider__wave--3 {
  fill: var(--wd-color);
  opacity: 1;
}
```

### Variação 3: Zigzag / Geometric Divider
Substitui ondas curvas por zigzag geométrico. Tom mais tech/moderno.
```html
<div class="wd-divider wd-divider--bottom" aria-hidden="true">
  <svg class="wd-divider__svg" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path class="wd-divider__wave wd-divider__wave--zigzag"
          d="M0,30 L120,0 L240,30 L360,0 L480,30 L600,0 L720,30 L840,0 L960,30 L1080,0 L1200,30 L1320,0 L1440,30 L1440,60 L0,60 Z" />
  </svg>
</div>
```
```css
.wd-divider__wave--zigzag {
  fill: var(--wd-color);
  opacity: 1;
  animation: none; /* Zigzag é estático */
}
```
