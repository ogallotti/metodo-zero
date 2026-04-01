# Curtain Reveal

## Quando usar
Transição de seção onde "cortinas" se abrem (duas metades deslizam para lados opostos) revelando o conteúdo por trás. Ideal para reveals dramáticos, lançamentos de produto, convites para evento, premiações. Tom teatral e memorável. Alta carga emocional.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cr-bg-curtain` | `#0a0a0a` | Cor das cortinas |
| `--cr-bg-reveal` | `#111827` | Cor do conteúdo revelado |
| `--cr-accent` | `#6366f1` | Cor de destaque |
| `--cr-speed` | `1.5` | Duração relativa ao scroll (via JS) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="cr-section" id="curtainRevealSection">
  <div class="cr-section__curtains" id="crCurtains">
    <div class="cr-section__curtain cr-section__curtain--left">
      <span class="cr-section__curtain-text">Scroll to</span>
    </div>
    <div class="cr-section__curtain cr-section__curtain--right">
      <span class="cr-section__curtain-text">Reveal</span>
    </div>
  </div>
  <div class="cr-section__reveal">
    <div class="cr-section__reveal-content">
      <h2 class="cr-section__title">The Big Reveal</h2>
      <p class="cr-section__text">What was hidden is now unveiled. This is the moment you've been waiting for.</p>
      <a href="#" class="cr-section__cta">Discover More</a>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.cr-section {
  --cr-bg-curtain: var(--color-bg, #0a0a0a);
  --cr-bg-reveal: var(--color-bg-alt, #111827);
  --cr-accent: var(--color-primary, #6366f1);

  position: relative;
  height: 200vh;
}

.cr-section__curtains {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  z-index: 2;
  overflow: hidden;
}

.cr-section__curtain {
  width: 50%;
  height: 100%;
  background: var(--cr-bg-curtain);
  display: flex;
  align-items: center;
  will-change: transform;
}

.cr-section__curtain--left {
  justify-content: flex-end;
  padding-right: clamp(1rem, 3vw, 2rem);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.cr-section__curtain--right {
  justify-content: flex-start;
  padding-left: clamp(1rem, 3vw, 2rem);
}

.cr-section__curtain-text {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-text-muted, rgba(255, 255, 255, 0.3));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cr-section__reveal {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cr-bg-reveal);
  z-index: 1;
}

.cr-section__reveal-content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.cr-section__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1.25rem;
  line-height: 1.05;
}

.cr-section__text {
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0 0 2rem;
}

.cr-section__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--cr-accent);
  color: #ffffff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cr-section__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .cr-section {
    height: auto;
  }
  .cr-section__curtains {
    display: none;
  }
  .cr-section__reveal {
    position: relative;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('curtainRevealSection');
  const curtains = document.getElementById('crCurtains');
  if (!section || !curtains) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const leftCurtain = curtains.querySelector('.cr-section__curtain--left');
  const rightCurtain = curtains.querySelector('.cr-section__curtain--right');

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '80% bottom',
        scrub: true,
        pin: false,
      },
    });

    tl.to(leftCurtain, {
      xPercent: -100,
      ease: 'power2.inOut',
    }, 0);

    tl.to(rightCurtain, {
      xPercent: 100,
      ease: 'power2.inOut',
    }, 0);

    /* Fade out curtain text */
    tl.to('.cr-section__curtain-text', {
      opacity: 0,
      duration: 0.3,
    }, 0);
  });
})();
```

## Integração
A seção tem `height: 200vh` para dar espaço ao scroll. As cortinas são sticky e deslizam para os lados. O conteúdo revelado fica atrás (z-index menor). Em reduced-motion, cortinas são escondidas e o conteúdo aparece diretamente. Os textos nas cortinas são opcionais (remover se não fizer sentido).

## Variações

### Variação 1: Vertical Curtains (Cima/Baixo)
Cortinas se abrem verticalmente em vez de horizontalmente.
```css
.cr-section__curtains {
  flex-direction: column;
}
.cr-section__curtain {
  width: 100%;
  height: 50%;
}
.cr-section__curtain--left {
  justify-content: center;
  align-items: flex-end;
  padding: 0 0 clamp(1rem, 3vw, 2rem) 0;
  border-right: none;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.cr-section__curtain--right {
  justify-content: center;
  align-items: flex-start;
  padding: clamp(1rem, 3vw, 2rem) 0 0 0;
}
```
```javascript
tl.to(leftCurtain, { yPercent: -100, ease: 'power2.inOut' }, 0);
tl.to(rightCurtain, { yPercent: 100, ease: 'power2.inOut' }, 0);
```

### Variação 2: Single Curtain (Cortina Única)
Uma cortina só que desliza para um lado.
```html
<div class="cr-section__curtains" id="crCurtains">
  <div class="cr-section__curtain cr-section__curtain--single">
    <span class="cr-section__curtain-text">Scroll to Reveal</span>
  </div>
</div>
```
```css
.cr-section__curtain--single { width: 100%; justify-content: center; }
```
```javascript
tl.to('.cr-section__curtain--single', {
  xPercent: -100,
  ease: 'power3.inOut',
}, 0);
```

### Variação 3: Curtains with Image Background
Cortinas com imagem de fundo dividida ao meio.
```css
.cr-section__curtain--left {
  background: url('assets/curtain-bg.webp') right center / cover;
}
.cr-section__curtain--right {
  background: url('assets/curtain-bg.webp') left center / cover;
}
.cr-section__curtain-text {
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  color: rgba(255,255,255,0.8);
}
```
