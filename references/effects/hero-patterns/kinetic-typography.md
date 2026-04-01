# Kinetic Typography

## Quando usar
Animação de texto com entrada dramática — letras/palavras aparecendo com movimento. Ideal para hero sections de agências criativas, portfolios, marcas premium. O texto é o protagonista. Tom impactante, artístico, memorável.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--kt-color` | `#ffffff` | Cor do texto principal |
| `--kt-accent` | `#6366f1` | Cor de destaque (palavras marcadas) |
| `--kt-stagger` | `0.05` | Delay entre cada caractere (s, via JS) |
| `--kt-duration` | `1` | Duração da animação por caractere (s, via JS) |
| `--kt-ease` | `power3.out` | Easing da animação (GSAP) |
| `--kt-y-offset` | `80` | Deslocamento Y inicial (px, via JS) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`

## HTML

```html
<section class="kt-hero" id="kineticHero">
  <div class="kt-hero__content">
    <h1 class="kt-hero__title" data-kt-animate="chars">
      We Build Digital Experiences
    </h1>
    <p class="kt-hero__subtitle" data-kt-animate="words">
      Strategy. Design. Development. Results.
    </p>
    <div class="kt-hero__cta-wrap" data-kt-animate="fade">
      <a href="#" class="kt-hero__cta">Start Your Project</a>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
```

## CSS

```css
.kt-hero {
  --kt-color: var(--color-text, #ffffff);
  --kt-accent: var(--color-primary, #6366f1);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.kt-hero__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 60rem;
}

.kt-hero__title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  color: var(--kt-color);
  margin: 0 0 1.5rem;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.kt-hero__title .kt-char {
  display: inline-block;
  opacity: 0;
}

.kt-hero__title .kt-word {
  display: inline-block;
  white-space: nowrap;
}

.kt-hero__subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.75rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 2.5rem;
  line-height: 1.4;
  font-weight: 300;
}

.kt-hero__subtitle .kt-word-item {
  display: inline-block;
  opacity: 0;
}

.kt-hero__cta-wrap {
  opacity: 0;
}

.kt-hero__cta {
  display: inline-block;
  padding: 1rem 3rem;
  background: var(--kt-accent);
  color: var(--color-bg, #0a0a0a);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kt-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .kt-hero__title .kt-char,
  .kt-hero__subtitle .kt-word-item,
  .kt-hero__cta-wrap {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('kineticHero');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    hero.querySelectorAll('[data-kt-animate]').forEach((el) => {
      el.style.opacity = '1';
      el.querySelectorAll('.kt-char, .kt-word-item').forEach((child) => {
        child.style.opacity = '1';
      });
    });
    return;
  }

  const config = {
    stagger: 0.05,
    duration: 1,
    ease: 'power3.out',
    yOffset: 80,
  };

  function splitIntoChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    const words = text.split(/(\s+)/);
    words.forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        el.appendChild(document.createTextNode(segment));
        return;
      }
      const wordSpan = document.createElement('span');
      wordSpan.className = 'kt-word';
      for (const char of segment) {
        const charSpan = document.createElement('span');
        charSpan.className = 'kt-char';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      }
      el.appendChild(wordSpan);
    });
  }

  function splitIntoWords(el) {
    const text = el.textContent;
    el.innerHTML = '';
    const words = text.split(/(\s+)/);
    words.forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        el.appendChild(document.createTextNode(segment));
        return;
      }
      const wordSpan = document.createElement('span');
      wordSpan.className = 'kt-word-item';
      wordSpan.textContent = segment;
      el.appendChild(wordSpan);
    });
  }

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined') return cb();
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        clearInterval(check);
        cb();
      }
    }, 50);
  }

  waitForGSAP(function () {
    const titleEl = hero.querySelector('[data-kt-animate="chars"]');
    const subtitleEl = hero.querySelector('[data-kt-animate="words"]');
    const ctaEl = hero.querySelector('[data-kt-animate="fade"]');

    if (titleEl) splitIntoChars(titleEl);
    if (subtitleEl) splitIntoWords(subtitleEl);

    const tl = gsap.timeline({ defaults: { ease: config.ease } });

    if (titleEl) {
      const chars = titleEl.querySelectorAll('.kt-char');
      tl.from(chars, {
        y: config.yOffset,
        opacity: 0,
        rotateX: -40,
        duration: config.duration,
        stagger: config.stagger,
      });
    }

    if (subtitleEl) {
      const words = subtitleEl.querySelectorAll('.kt-word-item');
      tl.from(
        words,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        '-=0.4'
      );
    }

    if (ctaEl) {
      tl.from(
        ctaEl,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.3'
      );
    }
  });
})();
```

## Integração
Incluir o script GSAP com `defer` antes do script do efeito. O atributo `data-kt-animate` controla o tipo de animação: `chars` (por caractere), `words` (por palavra), `fade` (fade simples). O JS faz o split automaticamente — não precisa alterar HTML manualmente. Funciona com qualquer texto.

## Variações

### Variação 1: Slide From Bottom (Linha por Linha)
Cada linha sobe de baixo. Mais contido e editorial.
```javascript
// Substituir a animação do título:
if (titleEl) {
  // Não fazer splitIntoChars, manter texto como está
  tl.from(titleEl, {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
  });
}
// Subtitulo aparece por palavra com mais delay
if (subtitleEl) {
  const words = subtitleEl.querySelectorAll('.kt-word-item');
  tl.from(words, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
  }, '-=0.5');
}
```

### Variação 2: Typewriter Reveal
Caracteres aparecem um a um como se fossem digitados. Sem movement Y, apenas opacidade.
```javascript
// Substituir a animação do título:
if (titleEl) {
  const chars = titleEl.querySelectorAll('.kt-char');
  tl.from(chars, {
    opacity: 0,
    duration: 0.05,
    stagger: 0.04,
    ease: 'none',
  });
}
// Cursor piscante opcional:
const cursor = document.createElement('span');
cursor.style.cssText = 'display:inline-block;width:2px;height:1em;background:currentColor;margin-left:4px;animation:kt-blink 0.7s step-end infinite;vertical-align:text-bottom;';
titleEl.appendChild(cursor);
// Adicionar ao CSS:
// @keyframes kt-blink { 0%,100%{opacity:1} 50%{opacity:0} }
```

### Variação 3: Scale & Rotate Entrance
Caracteres entram com escala e rotação. Visual mais dramático.
```javascript
// Substituir a animação do título:
if (titleEl) {
  const chars = titleEl.querySelectorAll('.kt-char');
  tl.from(chars, {
    scale: 0,
    rotation: gsap.utils.wrap([-15, 15]),
    opacity: 0,
    duration: 0.8,
    stagger: 0.03,
    ease: 'back.out(2)',
    transformOrigin: '50% 100%',
  });
}
```
