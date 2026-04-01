# Overlap Slide

## Quando usar
Seção seguinte desliza por cima da anterior enquanto essa encolhe/recua, criando efeito de "cards empilhando". Ideal para transições entre seções de conteúdo diferente (hero → features, features → pricing). Tom fluido e contínuo. Dá sensação de profundidade entre seções.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--os-bg-under` | `#0a0a0a` | Cor da seção que fica por baixo |
| `--os-bg-over` | `#111827` | Cor da seção que desliza por cima |
| `--os-shadow` | `0 -10px 40px rgba(0,0,0,0.4)` | Sombra da seção que desliza |
| `--os-scale-under` | `0.92` | Quanto a seção de baixo encolhe |
| `--os-radius-under` | `1.5rem` | Border-radius da seção de baixo ao encolher |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="os-under" id="osUnder">
  <div class="os-under__content">
    <h2 class="os-under__title">First Section</h2>
    <p class="os-under__text">This section will scale down as the next section slides over it.</p>
  </div>
</section>

<section class="os-over" id="osOver">
  <div class="os-over__content">
    <h2 class="os-over__title">Second Section</h2>
    <p class="os-over__text">This section slides up and overlaps the previous one.</p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.os-under {
  --os-bg-under: var(--color-bg, #0a0a0a);

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--os-bg-under);
  z-index: 1;
  will-change: transform, border-radius;
}

.os-under__content,
.os-over__content {
  width: min(90%, 50rem);
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.os-under__title,
.os-over__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.os-under__text,
.os-over__text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  line-height: 1.6;
  margin: 0;
}

.os-over {
  --os-bg-over: var(--color-bg-alt, #111827);
  --os-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4);

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--os-bg-over);
  z-index: 2;
  box-shadow: var(--os-shadow);
  border-radius: 1.5rem 1.5rem 0 0;
}

@media (prefers-reduced-motion: reduce) {
  .os-under {
    transform: none !important;
    border-radius: 0 !important;
    opacity: 1 !important;
  }
  .os-over {
    border-radius: 0;
  }
}
```

## JavaScript

```javascript
(function () {
  const under = document.getElementById('osUnder');
  const over = document.getElementById('osOver');
  if (!under || !over) return;

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

    gsap.to(under, {
      scale: 0.92,
      borderRadius: '1.5rem',
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: under,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
      },
    });
  });
})();
```

## Integração
A seção "under" é pinada e encolhe conforme o scroll. A seção "over" naturalmente sobe e cobre a anterior. O `border-radius` na seção over (top corners) e na seção under (ao encolher) cria efeito de "card". A sombra na seção over reforça a profundidade. Funciona com qualquer conteúdo. Pode ser repetido entre múltiplas seções.

## Variações

### Variação 1: Subtle Overlap (Menos Dramático)
Scale mínimo, mais profissional.
```javascript
gsap.to(under, {
  scale: 0.96,
  borderRadius: '0.75rem',
  opacity: 0.8,
  ease: 'none',
  scrollTrigger: {
    trigger: under,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true,
  },
});
```
```css
.os-over {
  border-radius: 0.75rem 0.75rem 0 0;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
}
```

### Variação 2: Color Tint on Recede
A seção de baixo ganha um tint de cor conforme recua.
```javascript
gsap.to(under, {
  scale: 0.92,
  borderRadius: '1.5rem',
  filter: 'brightness(0.5) saturate(0.5)',
  ease: 'none',
  scrollTrigger: {
    trigger: under,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true,
  },
});
```

### Variação 3: Cascading Overlap (Múltiplas Seções)
Aplicar o efeito em série — cada seção sobrepõe a anterior.
```javascript
const sections = document.querySelectorAll('.os-cascading');
sections.forEach((section, i) => {
  if (i === sections.length - 1) return;
  gsap.to(section, {
    scale: 0.92 - (i * 0.02),
    borderRadius: '1.5rem',
    opacity: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      pin: true,
    },
  });
});
```
