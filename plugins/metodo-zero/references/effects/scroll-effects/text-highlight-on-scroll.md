# Text Highlight on Scroll

## Quando usar
Texto que vai sendo "iluminado" (highlighted) conforme o usuário scrolla. Palavras ou linhas ganham cor/opacidade progressivamente. Ideal para manifesto, proposta de valor, missão/visão, seções de storytelling. Tom editorial e impactante. Força leitura atenta.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--th-color-inactive` | `rgba(255,255,255,0.15)` | Cor do texto inativo |
| `--th-color-active` | `#ffffff` | Cor do texto ativo (highlighted) |
| `--th-accent` | `#6366f1` | Cor de destaque opcional |
| `--th-font-size` | `clamp(1.5rem, 4vw, 3rem)` | Tamanho do texto |
| `--th-line-height` | `1.5` | Altura de linha |
| `--th-section-padding` | `20vh` | Padding da seção (scroll room) |

## Dependências
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="th-section" id="textHighlightSection">
  <div class="th-section__container">
    <p class="th-section__text" id="thText">
      We believe design is not just how it looks, but how it works. Every pixel
      serves a purpose. Every interaction tells a story. We craft digital
      experiences that move people — literally and emotionally. This is not
      decoration. This is communication at its finest.
    </p>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.th-section {
  --th-color-inactive: rgba(255, 255, 255, 0.15);
  --th-color-active: var(--color-text, #ffffff);
  --th-accent: var(--color-primary, #6366f1);
  --th-font-size: clamp(1.5rem, 4vw, 3rem);
  --th-line-height: 1.5;
  --th-section-padding: 20vh;

  position: relative;
  background: var(--color-bg, #0a0a0a);
  padding: var(--th-section-padding) 0;
}

.th-section__container {
  width: min(90%, 55rem);
  margin: 0 auto;
}

.th-section__text {
  font-size: var(--th-font-size);
  line-height: var(--th-line-height);
  font-weight: 500;
  color: var(--th-color-inactive);
  margin: 0;
}

.th-section__text .th-word {
  display: inline;
  transition: color 0.1s ease;
}

.th-section__text .th-word.is-highlighted {
  color: var(--th-color-active);
}

@media (max-width: 768px) {
  .th-section {
    --th-font-size: clamp(1.25rem, 5vw, 1.75rem);
    --th-section-padding: 10vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .th-section__text {
    color: var(--th-color-active);
  }
  .th-section__text .th-word {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('textHighlightSection');
  const textEl = document.getElementById('thText');
  if (!section || !textEl) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  /* Split text into words */
  const originalText = textEl.textContent.trim();
  const words = originalText.split(/\s+/);
  textEl.innerHTML = words
    .map((word) => `<span class="th-word">${word}</span>`)
    .join(' ');

  const wordEls = textEl.querySelectorAll('.th-word');

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

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeCount = Math.floor(progress * wordEls.length);

        wordEls.forEach((word, i) => {
          word.classList.toggle('is-highlighted', i < activeCount);
        });
      },
    });
  });
})();
```

## Integração
Colocar o texto no `<p>` do HTML. O JS faz o split automaticamente em palavras. A seção precisa de padding generoso (20vh) para ter "room" de scroll. Funciona com qualquer quantidade de texto. Para textos muito longos, considerar dividir em múltiplas seções.

## Variações

### Variação 1: Background Highlight (Marca-texto)
Em vez de mudar a cor, aplicar um background highlight amarelo estilo marca-texto.
```css
.th-section {
  --th-color-inactive: var(--color-text, #ffffff);
}
.th-section__text .th-word {
  transition: background-size 0.3s ease;
  background: linear-gradient(to right, var(--th-accent) 100%, transparent 0);
  background-size: 0% 40%;
  background-repeat: no-repeat;
  background-position: 0 85%;
}
.th-section__text .th-word.is-highlighted {
  background-size: 100% 40%;
  color: var(--th-color-inactive);
}
```

### Variação 2: Line-by-Line Reveal
Revelar linha por linha em vez de palavra por palavra. Mais fluido para textos longos.
```javascript
// Substituir o split por linhas:
// Após split em palavras, agrupar por "linha visual" usando offsetTop
waitForGSAP(function () {
  gsap.registerPlugin(ScrollTrigger);

  // Agrupar palavras por linha (mesmo offsetTop)
  const lines = [];
  let currentLine = [];
  let currentTop = wordEls[0]?.offsetTop;

  wordEls.forEach((word) => {
    if (word.offsetTop !== currentTop) {
      lines.push(currentLine);
      currentLine = [];
      currentTop = word.offsetTop;
    }
    currentLine.push(word);
  });
  if (currentLine.length) lines.push(currentLine);

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: true,
    onUpdate: (self) => {
      const activeLineCount = Math.floor(self.progress * lines.length);
      lines.forEach((line, i) => {
        line.forEach((word) => {
          word.classList.toggle('is-highlighted', i < activeLineCount);
        });
      });
    },
  });
});
```

### Variação 3: Fade In (Opacidade Gradual)
Cada palavra recebe opacidade incremental ao invés de toggle on/off.
```javascript
// Substituir onUpdate:
onUpdate: (self) => {
  const progress = self.progress;
  wordEls.forEach((word, i) => {
    const wordProgress = (progress * wordEls.length - i);
    const opacity = Math.min(1, Math.max(0.15, wordProgress));
    word.style.color = '';
    word.style.opacity = opacity;
  });
},
```
```css
/* Ajustar CSS: */
.th-section__text .th-word {
  opacity: 0.15;
  color: var(--th-color-active);
  transition: opacity 0.15s ease;
}
.th-section__text .th-word.is-highlighted {
  color: var(--th-color-active);
}
```
