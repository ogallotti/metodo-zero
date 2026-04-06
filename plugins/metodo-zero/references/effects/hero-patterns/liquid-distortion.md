# Liquid Distortion

## Quando usar
Efeito de distorção líquida sobre imagem de fundo — a imagem ondula como se estivesse debaixo d'água ou vista através de vidro ondulado. Ideal para hero sections de moda, beleza, arte, luxury brands. Tom orgânico, premium e hipnotizante.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ld-bg` | `#0a0a0a` | Cor de fundo fallback |
| `--ld-intensity` | `20` | Intensidade da distorção (px, via JS) |
| `--ld-speed` | `0.003` | Velocidade da animação (via JS) |
| `--ld-frequency` | `3` | Frequência das ondas (via JS) |

## Dependências
- SVG Filter + JavaScript — nenhuma dependência externa

## HTML

```html
<section class="ld-hero" id="liquidDistortionHero">
  <svg class="ld-hero__filter" aria-hidden="true">
    <defs>
      <filter id="ldDistortion">
        <feTurbulence id="ldTurbulence" type="fractalNoise" baseFrequency="0.01 0.01"
                      numOctaves="3" seed="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <div class="ld-hero__bg" id="ldBg">
    <img src="assets/hero-bg.webp" alt="" class="ld-hero__img" loading="eager" />
  </div>
  <div class="ld-hero__overlay" aria-hidden="true"></div>
  <div class="ld-hero__content">
    <h1 class="ld-hero__title">Fluid Motion</h1>
    <p class="ld-hero__subtitle">Where elegance meets innovation</p>
    <a href="#" class="ld-hero__cta">Explore</a>
  </div>
</section>
```

## CSS

```css
.ld-hero {
  --ld-bg: var(--color-bg, #0a0a0a);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ld-bg);
}

.ld-hero__filter {
  position: absolute;
  width: 0;
  height: 0;
}

.ld-hero__bg {
  position: absolute;
  inset: -5%;
  width: 110%;
  height: 110%;
  z-index: 1;
  filter: url(#ldDistortion);
}

.ld-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ld-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.ld-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.ld-hero__title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
  font-style: italic;
}

.ld-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0 0 2rem;
  font-weight: 300;
}

.ld-hero__cta {
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

.ld-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .ld-hero__bg {
    filter: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('liquidDistortionHero');
  const turbulence = document.getElementById('ldTurbulence');
  if (!hero || !turbulence) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const config = { speed: 0.003, baseFreqX: 0.01, baseFreqY: 0.01 };
  let time = 0;
  let animId;

  function animate() {
    time += config.speed;
    const fx = config.baseFreqX + Math.sin(time) * 0.005;
    const fy = config.baseFreqY + Math.cos(time * 0.7) * 0.005;
    turbulence.setAttribute('baseFrequency', `${fx} ${fy}`);
    animId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.1 });

  observer.observe(hero);
})();
```

## Integração
Usa SVG `feTurbulence` + `feDisplacementMap` — suportado em todos os browsers modernos. O JS anima o `baseFrequency` do turbulence para criar o efeito líquido. A imagem de fundo é expandida 110% para evitar bordas visíveis durante a distorção. Sem dependências externas. Em reduced-motion, imagem fica normal.

## Variações

### Variação 1: Mouse-Reactive Distortion
Intensidade da distorção muda com posição do mouse.
```javascript
let mouseIntensity = 20;
hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  const y = (e.clientY - rect.top) / rect.height;
  mouseIntensity = 10 + y * 30;
  document.querySelector('#ldDistortion feDisplacementMap').setAttribute('scale', mouseIntensity);
}, { passive: true });
```

### Variação 2: Slow Morphing (Ultra Sutil)
Distorção muito lenta e sutil. Quase imperceptível, mas cria sensação de vida.
```javascript
const config = { speed: 0.001, baseFreqX: 0.005, baseFreqY: 0.005 };
// E no HTML, reduzir scale:
// <feDisplacementMap ... scale="10" ...>
```

### Variação 3: Color Channel Split
Aplicar distorção diferente para cada canal de cor (chromatic aberration).
```html
<filter id="ldDistortion">
  <feTurbulence id="ldTurbulence" type="fractalNoise" baseFrequency="0.01 0.01"
                numOctaves="3" seed="2" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="B" result="distorted" />
  <feOffset in="SourceGraphic" dx="3" dy="0" result="redShift" />
  <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
  <feBlend in="distorted" in2="red" mode="screen" />
</filter>
```
