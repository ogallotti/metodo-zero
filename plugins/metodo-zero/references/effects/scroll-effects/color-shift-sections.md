# Color Shift Sections

## Quando usar
Cor de fundo da página muda suavemente conforme o scroll passa por diferentes seções — cada seção define sua paleta e a transição é gradual. Ideal para landing pages com múltiplas seções temáticas, stories, timelines, SaaS features. Tom fluido e coeso. Unifica seções visualmente.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cs-transition-zone` | `20%` | Proporção da seção dedicada à transição de cor |
| Cada seção define | — | `data-cs-bg` para cor de fundo |
| Cada seção define | — | `data-cs-text` para cor do texto |
| Cada seção define | — | `data-cs-accent` para cor de destaque |

## Dependências
- CSS `scroll-timeline` (com fallback GSAP)
- GSAP 3.12+ (fallback) — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger (fallback) — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<div class="cs-page" id="colorShiftPage">
  <section class="cs-section" data-cs-bg="#0a0a0a" data-cs-text="#ffffff" data-cs-accent="#6366f1">
    <div class="cs-section__content">
      <h2 class="cs-section__title">Welcome</h2>
      <p class="cs-section__text">Start your journey here with a dark, focused experience.</p>
    </div>
  </section>

  <section class="cs-section" data-cs-bg="#1e1b4b" data-cs-text="#e0e7ff" data-cs-accent="#818cf8">
    <div class="cs-section__content">
      <h2 class="cs-section__title">Discover</h2>
      <p class="cs-section__text">Explore our features in a deep indigo atmosphere.</p>
    </div>
  </section>

  <section class="cs-section" data-cs-bg="#042f2e" data-cs-text="#ccfbf1" data-cs-accent="#2dd4bf">
    <div class="cs-section__content">
      <h2 class="cs-section__title">Grow</h2>
      <p class="cs-section__text">Scale your business with confidence in a fresh teal environment.</p>
    </div>
  </section>

  <section class="cs-section" data-cs-bg="#fefce8" data-cs-text="#1c1917" data-cs-accent="#f59e0b">
    <div class="cs-section__content">
      <h2 class="cs-section__title">Succeed</h2>
      <p class="cs-section__text">Celebrate your results with warm, energetic tones.</p>
    </div>
  </section>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.cs-page {
  transition: background-color 0.1s linear, color 0.1s linear;
}

.cs-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cs-section__content {
  width: min(90%, 50rem);
  text-align: center;
  padding: clamp(2rem, 5vw, 4rem);
}

.cs-section__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: inherit;
  margin: 0 0 1rem;
  line-height: 1.1;
}

.cs-section__text {
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  color: inherit;
  opacity: 0.7;
  line-height: 1.6;
  margin: 0;
}

/* Accent color usada em elementos internos */
.cs-section__content a,
.cs-section__content .cs-accent {
  color: var(--cs-current-accent, inherit);
}

@media (prefers-reduced-motion: reduce) {
  .cs-page {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const page = document.getElementById('colorShiftPage');
  if (!page) return;

  const sections = page.querySelectorAll('.cs-section');
  if (!sections.length) return;

  /* Set initial colors */
  const firstSection = sections[0];
  page.style.backgroundColor = firstSection.dataset.csBg || '#0a0a0a';
  page.style.color = firstSection.dataset.csText || '#ffffff';

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 0, b: 0 };
  }

  function lerpColor(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t),
    };
  }

  function rgbToString(c) {
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
  }

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return cb();
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        clearInterval(check);
        cb();
      }
    }, 50);
  }

  waitForGSAP(function () {
    gsap.registerPlugin(ScrollTrigger);

    sections.forEach((section, i) => {
      if (i === 0) return;

      const prevSection = sections[i - 1];
      const fromBg = hexToRgb(prevSection.dataset.csBg || '#0a0a0a');
      const toBg = hexToRgb(section.dataset.csBg || '#0a0a0a');
      const fromText = hexToRgb(prevSection.dataset.csText || '#ffffff');
      const toText = hexToRgb(section.dataset.csText || '#ffffff');

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const bg = lerpColor(fromBg, toBg, progress);
          const text = lerpColor(fromText, toText, progress);
          page.style.backgroundColor = rgbToString(bg);
          page.style.color = rgbToString(text);
        },
      });
    });
  });
})();
```

## Integração
Cada seção define suas cores via `data-cs-*` attributes. O JS interpola entre cores adjacentes. A transição acontece nos 60% centrais entre seções (start: 80%, end: 20%). Funciona com qualquer número de seções. Para usar a cor accent em elementos internos, adicionar classe `.cs-accent` ou CSS custom property dinâmica.

## Variações

### Variação 1: Gradient Transition
Em vez de cor sólida, transição com gradiente intermediário.
```javascript
onUpdate: (self) => {
  const progress = self.progress;
  const bg1 = rgbToString(lerpColor(fromBg, toBg, Math.max(0, progress - 0.2)));
  const bg2 = rgbToString(lerpColor(fromBg, toBg, Math.min(1, progress + 0.2)));
  page.style.background = `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`;
  const text = lerpColor(fromText, toText, progress);
  page.style.color = rgbToString(text);
},
```

### Variação 2: Snap Colors (Sem Interpolação)
Cores mudam instantaneamente ao cruzar o meio de cada seção.
```javascript
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => {
      page.style.backgroundColor = section.dataset.csBg;
      page.style.color = section.dataset.csText;
    },
    onEnterBack: () => {
      page.style.backgroundColor = section.dataset.csBg;
      page.style.color = section.dataset.csText;
    },
  });
});
```
```css
.cs-page {
  transition: background-color 0.6s ease, color 0.6s ease;
}
```

### Variação 3: Side Indicator
Adicionar indicador lateral que mostra a cor da seção ativa.
```html
<nav class="cs-indicators" id="csIndicators" aria-label="Section colors">
  <div class="cs-indicator" style="--dot-color: #0a0a0a;"></div>
  <div class="cs-indicator" style="--dot-color: #1e1b4b;"></div>
  <div class="cs-indicator" style="--dot-color: #042f2e;"></div>
  <div class="cs-indicator" style="--dot-color: #fefce8;"></div>
</nav>
```
```css
.cs-indicators {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
}
.cs-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dot-color);
  border: 2px solid rgba(255,255,255,0.3);
  transition: transform 0.3s ease;
}
.cs-indicator.is-active {
  transform: scale(1.4);
  border-color: rgba(255,255,255,0.8);
}
```
