# Section Clip-Path

## Quando usar
Transição entre seções usando clip-path animado — a nova seção "revela" por cima da anterior com formas geométricas (círculo expandindo, diagonal, curtain, etc.). Ideal para transições de seção dramáticas, landing pages premium, storytelling visual. Tom cinematográfico e elegante.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--scp-bg-from` | `#0a0a0a` | Cor de fundo da seção de origem |
| `--scp-bg-to` | `#111827` | Cor de fundo da seção revelada |
| `--scp-shape` | `circle` | Tipo de clip-path (circle, inset, polygon) |
| `--scp-duration` | `1.2` | Duração da animação (s, via JS) |
| `--scp-ease` | `power2.inOut` | Easing da transição (GSAP) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="scp-from" id="scpFrom">
  <div class="scp-from__content">
    <h2 class="scp-from__title">Section One</h2>
    <p class="scp-from__text">Content of the first section.</p>
  </div>
</section>

<section class="scp-to" id="scpTo">
  <div class="scp-to__content">
    <h2 class="scp-to__title">Section Two</h2>
    <p class="scp-to__text">Content revealed with clip-path transition.</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.scp-from {
  --scp-bg-from: var(--color-bg, #0a0a0a);

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--scp-bg-from);
  z-index: 1;
}

.scp-from__content,
.scp-to__content {
  width: min(90%, 50rem);
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.scp-from__title,
.scp-to__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.scp-from__text,
.scp-to__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0;
}

.scp-to {
  --scp-bg-to: #111827;

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--scp-bg-to);
  z-index: 2;
  clip-path: circle(0% at 50% 0%);
}

@media (prefers-reduced-motion: reduce) {
  .scp-to {
    clip-path: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const fromSection = document.getElementById('scpFrom');
  const toSection = document.getElementById('scpTo');
  if (!fromSection || !toSection) return;

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

    /* Circle reveal: clip-path: circle(0% at 50% 0%) → circle(150% at 50% 50%) */
    gsap.to(toSection, {
      clipPath: 'circle(150% at 50% 50%)',
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: fromSection,
        start: 'bottom bottom',
        end: '+=80%',
        scrub: true,
        pin: fromSection,
      },
    });
  });
})();
```

## Integração
As duas seções ficam uma após a outra no HTML. O scroll "pina" a primeira seção enquanto o clip-path da segunda expande. Após a transição, o scroll continua normalmente. A seção "to" deve ter z-index maior para ficar por cima. Adaptar cores de fundo para que a transição crie contraste visual.

## Variações

### Variação 1: Diagonal Wipe
Revelação diagonal de canto a canto.
```css
.scp-to {
  clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
}
```
```javascript
gsap.to(toSection, {
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: fromSection,
    start: 'bottom bottom',
    end: '+=80%',
    scrub: true,
    pin: fromSection,
  },
});
```

### Variação 2: Inset Reveal (Retângulo Expandindo)
Retângulo que se expande do centro para as bordas.
```css
.scp-to {
  clip-path: inset(50% 50% 50% 50%);
}
```
```javascript
gsap.to(toSection, {
  clipPath: 'inset(0% 0% 0% 0%)',
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: fromSection,
    start: 'bottom bottom',
    end: '+=80%',
    scrub: true,
    pin: fromSection,
  },
});
```

### Variação 3: Vertical Curtain (De Cima para Baixo)
Revelação vertical — como uma cortina descendo.
```css
.scp-to {
  clip-path: inset(0 0 100% 0);
}
```
```javascript
gsap.to(toSection, {
  clipPath: 'inset(0 0 0% 0)',
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: fromSection,
    start: 'bottom bottom',
    end: '+=60%',
    scrub: true,
    pin: fromSection,
  },
});
```
