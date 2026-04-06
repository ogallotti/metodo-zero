# Horizontal Scroll Section

## Quando usar
Seção que transforma scroll vertical em scroll horizontal — painéis de conteúdo passam horizontalmente enquanto a seção fica pinada. Ideal para portfolios, case studies, timeline, galeria de projetos. Tom cinematográfico e imersivo. Permite mostrar muito conteúdo sem scroll infinito vertical.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--hs-bg` | `#0a0a0a` | Cor de fundo |
| `--hs-panel-width` | `80vw` | Largura de cada painel |
| `--hs-panel-gap` | `3rem` | Espaço entre painéis |
| `--hs-panel-count` | `4` | Número de painéis (via HTML) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="hs-section" id="horizontalScrollSection">
  <div class="hs-section__track" id="hsTrack">
    <article class="hs-section__panel">
      <div class="hs-section__panel-img">
        <img src="assets/project-1.webp" alt="" loading="lazy" />
      </div>
      <div class="hs-section__panel-text">
        <span class="hs-section__panel-num">01</span>
        <h3 class="hs-section__panel-title">Project Alpha</h3>
        <p class="hs-section__panel-desc">A brief description of the project and the results achieved.</p>
      </div>
    </article>
    <article class="hs-section__panel">
      <div class="hs-section__panel-img">
        <img src="assets/project-2.webp" alt="" loading="lazy" />
      </div>
      <div class="hs-section__panel-text">
        <span class="hs-section__panel-num">02</span>
        <h3 class="hs-section__panel-title">Project Beta</h3>
        <p class="hs-section__panel-desc">A brief description of the project and the results achieved.</p>
      </div>
    </article>
    <article class="hs-section__panel">
      <div class="hs-section__panel-img">
        <img src="assets/project-3.webp" alt="" loading="lazy" />
      </div>
      <div class="hs-section__panel-text">
        <span class="hs-section__panel-num">03</span>
        <h3 class="hs-section__panel-title">Project Gamma</h3>
        <p class="hs-section__panel-desc">A brief description of the project and the results achieved.</p>
      </div>
    </article>
    <article class="hs-section__panel">
      <div class="hs-section__panel-img">
        <img src="assets/project-4.webp" alt="" loading="lazy" />
      </div>
      <div class="hs-section__panel-text">
        <span class="hs-section__panel-num">04</span>
        <h3 class="hs-section__panel-title">Project Delta</h3>
        <p class="hs-section__panel-desc">A brief description of the project and the results achieved.</p>
      </div>
    </article>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.hs-section {
  --hs-bg: var(--color-bg, #0a0a0a);
  --hs-panel-width: 80vw;
  --hs-panel-gap: 3rem;

  position: relative;
  background: var(--hs-bg);
  overflow: hidden;
}

.hs-section__track {
  display: flex;
  gap: var(--hs-panel-gap);
  padding: 0 10vw;
  height: 100vh;
  align-items: center;
  will-change: transform;
}

.hs-section__panel {
  flex-shrink: 0;
  width: var(--hs-panel-width);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.hs-section__panel-img {
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 16/10;
}

.hs-section__panel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hs-section__panel-num {
  display: inline-block;
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 700;
  color: var(--color-primary, #6366f1);
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.hs-section__panel-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.15;
}

.hs-section__panel-desc {
  font-size: clamp(0.875rem, 1.5vw, 1.0625rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .hs-section__panel {
    --hs-panel-width: 85vw;
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hs-section__track {
    flex-wrap: wrap;
    height: auto;
    padding: 3rem 5vw;
    gap: 2rem;
    will-change: auto;
  }
  .hs-section__panel {
    width: 100%;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('horizontalScrollSection');
  const track = document.getElementById('hsTrack');
  if (!section || !track) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

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

    const panels = track.querySelectorAll('.hs-section__panel');
    const totalWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + totalWidth,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });
})();
```

## Integração
A seção pina automaticamente e calcula a distância total de scroll baseada na largura do conteúdo. Adicionar/remover painéis no HTML ajusta o scroll automaticamente. Em reduced-motion, vira layout vertical com wrap. O `scrub: 1` cria um leve smoothing no scroll. `invalidateOnRefresh` recalcula posições ao resize.

## Variações

### Variação 1: Full-Bleed Panels (Sem Cards)
Painéis ocupam a tela inteira sem estilo card.
```css
.hs-section__panel {
  width: 100vw;
  background: none;
  border: none;
  border-radius: 0;
  padding: 0 10vw;
}
.hs-section__track {
  gap: 0;
  padding: 0;
}
```

### Variação 2: Progress Counter
Adicionar contador de progresso (ex: "02 / 04").
```html
<div class="hs-section__counter" id="hsCounter">
  <span id="hsCurrent">01</span> / <span id="hsTotal">04</span>
</div>
```
```css
.hs-section__counter {
  position: absolute;
  bottom: 2rem;
  right: 3rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-muted, rgba(255,255,255,0.5));
  z-index: 10;
  font-variant-numeric: tabular-nums;
}
```
```javascript
// Adicionar ao onUpdate do ScrollTrigger:
const counter = document.getElementById('hsCurrent');
onUpdate: (self) => {
  const index = Math.min(
    Math.floor(self.progress * panels.length) + 1,
    panels.length
  );
  counter.textContent = String(index).padStart(2, '0');
}
```

### Variação 3: Stacked Entry (Painéis entram com stagger)
Painéis aparecem com animação staggered ao entrar na viewport.
```javascript
panels.forEach((panel) => {
  gsap.fromTo(panel,
    { opacity: 0.3, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: panel,
        containerAnimation: gsap.getById ? undefined : undefined,
        start: 'left 80%',
        end: 'left 30%',
        scrub: true,
        horizontal: true,
      },
    }
  );
});
```
