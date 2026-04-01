# Pin and Reveal

## Quando usar
Seção fica "pinada" (fixa) enquanto o conteúdo se revela progressivamente durante o scroll. Ideal para storytelling sequencial, apresentação de features, comparações before/after, timelines. Tom narrativo e controlado. O usuário descobre conteúdo no próprio ritmo.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--pr-bg` | `#0a0a0a` | Cor de fundo da seção |
| `--pr-text-color` | `#ffffff` | Cor do texto |
| `--pr-accent` | `#6366f1` | Cor de destaque |
| `--pr-panel-count` | `4` | Número de painéis (via HTML) |
| `--pr-scrub-duration` | `300%` | Scroll distance total para completar (via JS) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="pr-section" id="pinRevealSection">
  <div class="pr-section__wrapper">
    <div class="pr-section__panel pr-section__panel--1 is-active">
      <div class="pr-section__panel-content">
        <span class="pr-section__step">01</span>
        <h2 class="pr-section__heading">First Feature</h2>
        <p class="pr-section__text">Description of the first feature or story point goes here.</p>
      </div>
    </div>
    <div class="pr-section__panel pr-section__panel--2">
      <div class="pr-section__panel-content">
        <span class="pr-section__step">02</span>
        <h2 class="pr-section__heading">Second Feature</h2>
        <p class="pr-section__text">Description of the second feature or story point goes here.</p>
      </div>
    </div>
    <div class="pr-section__panel pr-section__panel--3">
      <div class="pr-section__panel-content">
        <span class="pr-section__step">03</span>
        <h2 class="pr-section__heading">Third Feature</h2>
        <p class="pr-section__text">Description of the third feature or story point goes here.</p>
      </div>
    </div>
    <div class="pr-section__panel pr-section__panel--4">
      <div class="pr-section__panel-content">
        <span class="pr-section__step">04</span>
        <h2 class="pr-section__heading">Fourth Feature</h2>
        <p class="pr-section__text">Description of the fourth feature or story point goes here.</p>
      </div>
    </div>
  </div>
  <div class="pr-section__progress" aria-hidden="true">
    <div class="pr-section__progress-bar" id="prProgressBar"></div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.pr-section {
  --pr-bg: var(--color-bg, #0a0a0a);
  --pr-text-color: var(--color-text, #ffffff);
  --pr-accent: var(--color-primary, #6366f1);

  position: relative;
  background: var(--pr-bg);
}

.pr-section__wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.pr-section__panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}

.pr-section__panel.is-active {
  opacity: 1;
  visibility: visible;
}

.pr-section__panel-content {
  max-width: 45rem;
  padding: clamp(1.5rem, 5vw, 3rem);
  text-align: center;
}

.pr-section__step {
  display: inline-block;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 700;
  color: var(--pr-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.pr-section__heading {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--pr-text-color);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.pr-section__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0;
}

.pr-section__progress {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 30vh;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  z-index: 10;
}

.pr-section__progress-bar {
  width: 100%;
  height: 0%;
  background: var(--pr-accent);
  border-radius: 2px;
  transition: height 0.1s linear;
}

@media (max-width: 768px) {
  .pr-section__progress {
    right: 1rem;
    height: 20vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pr-section__panel {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('pinRevealSection');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    const wrapper = section.querySelector('.pr-section__wrapper');
    const panels = section.querySelectorAll('.pr-section__panel');
    const progressBar = document.getElementById('prProgressBar');
    const panelCount = panels.length;

    if (reducedMotion) {
      panels.forEach((p) => {
        p.classList.remove('is-active');
        p.style.opacity = '1';
        p.style.visibility = 'visible';
        p.style.position = 'relative';
      });
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=' + window.innerHeight * panelCount,
      pin: wrapper,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.min(
          Math.floor(progress * panelCount),
          panelCount - 1
        );

        panels.forEach((panel, i) => {
          panel.classList.toggle('is-active', i === activeIndex);
        });

        if (progressBar) {
          progressBar.style.height = (progress * 100) + '%';
        }
      },
    });
  });
})();
```

## Integração
A seção "pina" o wrapper na viewport enquanto o scroll alterna entre os painéis. A duração do pin é `panelCount * 100vh` — ajustar conforme necessário. O progress bar lateral indica posição relativa. Os painéis podem conter qualquer conteúdo (imagens, vídeos, gráficos). A estrutura é modular — adicionar/remover painéis no HTML basta.

## Variações

### Variação 1: Slide Up Transition
Painéis entram de baixo para cima em vez de fade.
```javascript
// Substituir onUpdate:
onUpdate: (self) => {
  const progress = self.progress;
  const activeIndex = Math.min(
    Math.floor(progress * panelCount),
    panelCount - 1
  );
  const subProgress = (progress * panelCount) % 1;

  panels.forEach((panel, i) => {
    if (i === activeIndex) {
      panel.style.opacity = '1';
      panel.style.visibility = 'visible';
      panel.style.transform = 'translateY(0)';
    } else if (i === activeIndex + 1) {
      panel.style.opacity = String(subProgress);
      panel.style.visibility = 'visible';
      panel.style.transform = `translateY(${(1 - subProgress) * 30}%)`;
    } else {
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
      panel.style.transform = 'translateY(30%)';
    }
  });

  if (progressBar) progressBar.style.height = (progress * 100) + '%';
},
```

### Variação 2: Split Content (Imagem + Texto)
Layout lado a lado com imagem fixa e texto alternando.
```html
<!-- Substituir cada pr-section__panel-content por: -->
<div class="pr-section__panel-content" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;max-width:70rem;">
  <div>
    <img src="assets/feature-1.webp" alt="" style="width:100%;border-radius:1rem;" />
  </div>
  <div>
    <span class="pr-section__step">01</span>
    <h2 class="pr-section__heading">Feature</h2>
    <p class="pr-section__text">Description</p>
  </div>
</div>
```
```css
@media (max-width: 768px) {
  .pr-section__panel-content {
    grid-template-columns: 1fr !important;
    text-align: center;
  }
}
```

### Variação 3: Progress Dots
Substituir barra de progresso por dots clicáveis.
```html
<!-- Substituir .pr-section__progress por: -->
<nav class="pr-section__dots" aria-label="Section navigation">
  <button class="pr-section__dot is-active" data-index="0" aria-label="Go to section 1"></button>
  <button class="pr-section__dot" data-index="1" aria-label="Go to section 2"></button>
  <button class="pr-section__dot" data-index="2" aria-label="Go to section 3"></button>
  <button class="pr-section__dot" data-index="3" aria-label="Go to section 4"></button>
</nav>
```
```css
.pr-section__dots {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
}
.pr-section__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, border-color 0.3s;
}
.pr-section__dot.is-active {
  background: var(--pr-accent);
  border-color: var(--pr-accent);
}
```
