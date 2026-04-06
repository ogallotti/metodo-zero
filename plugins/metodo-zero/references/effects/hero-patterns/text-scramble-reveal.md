# Text Scramble Reveal

## Quando usar
Texto se revela com efeito de "scramble" — caracteres aleatórios que gradualmente resolvem para o texto final. Ideal para tech, hacking theme, SaaS, developer tools, mystery. Tom futurista e dinâmico. Cria suspense e interesse na revelação.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ts-color` | `#ffffff` | Cor do texto final |
| `--ts-scramble-color` | `#6366f1` | Cor durante o scramble |
| `--ts-font-size` | `clamp(2.5rem, 7vw, 5rem)` | Tamanho do texto |
| `--ts-speed` | `30` | Velocidade do scramble (ms por frame, via JS) |
| `--ts-chars` | diverso | Caracteres usados no scramble (via JS) |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<section class="ts-hero" id="textScrambleHero">
  <div class="ts-hero__content">
    <h1 class="ts-hero__title" data-ts-scramble>Welcome to the Future</h1>
    <p class="ts-hero__subtitle" data-ts-scramble data-ts-delay="800">Where code becomes art</p>
    <a href="#" class="ts-hero__cta" data-ts-scramble data-ts-delay="1400">Enter →</a>
  </div>
</section>
```

## CSS

```css
.ts-hero {
  --ts-color: var(--color-text, #ffffff);
  --ts-scramble-color: var(--color-primary, #6366f1);
  --ts-font-size: clamp(2.5rem, 7vw, 5rem);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #0a0a0a);
}

.ts-hero__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 55rem;
}

.ts-hero__title {
  font-size: var(--ts-font-size);
  font-weight: 800;
  color: var(--ts-color);
  margin: 0 0 1rem;
  line-height: 1.1;
  font-family: inherit;
}

.ts-hero__title .ts-char--scrambling {
  color: var(--ts-scramble-color);
}

.ts-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 2rem;
  font-weight: 300;
}

.ts-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  border: 1px solid var(--ts-color);
  color: var(--ts-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.05em;
  transition: background 0.3s, color 0.3s;
}

.ts-hero__cta:hover {
  background: var(--ts-color);
  color: var(--color-bg, #0a0a0a);
}

@media (prefers-reduced-motion: reduce) {
  .ts-hero__title .ts-char--scrambling { color: inherit; }
}
```

## JavaScript

```javascript
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~';

  function scrambleText(el, options = {}) {
    const original = el.textContent;
    const speed = options.speed || 30;
    const delay = parseInt(el.dataset.tsDelay) || 0;

    if (reducedMotion) return;

    el.textContent = '';
    let resolved = 0;
    const total = original.length;

    function step() {
      let display = '';
      for (let i = 0; i < total; i++) {
        if (original[i] === ' ') {
          display += ' ';
        } else if (i < resolved) {
          display += original[i];
        } else {
          display += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      el.textContent = display;

      if (resolved < total) {
        resolved += 0.5;
        setTimeout(step, speed);
      } else {
        el.textContent = original;
      }
    }

    setTimeout(step, delay);
  }

  const elements = document.querySelectorAll('[data-ts-scramble]');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      elements.forEach((el) => scrambleText(el));
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  if (elements.length) {
    observer.observe(elements[0].closest('section') || elements[0]);
  }
})();
```

## Integração
Adicionar `data-ts-scramble` a qualquer elemento de texto. `data-ts-delay` controla quando cada elemento começa (stagger manual). O scramble inicia quando a seção entra na viewport. Anima uma vez. Em reduced-motion, texto aparece instantaneamente.

## Variações

### Variação 1: Binary Scramble
Usar apenas 0 e 1 durante o scramble. Estilo "matrix/hacker".
```javascript
const scrambleChars = '01';
```

### Variação 2: Continuous Scramble (Loop)
Scramble contínuo que nunca resolve completamente — texto "vive".
```javascript
function continuousScramble(el) {
  const original = el.textContent;
  const total = original.length;

  setInterval(() => {
    let display = '';
    for (let i = 0; i < total; i++) {
      if (original[i] === ' ') { display += ' '; continue; }
      if (Math.random() > 0.1) {
        display += original[i];
      } else {
        display += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
    }
    el.textContent = display;
  }, 100);
}
```

### Variação 3: Character-by-Character Reveal
Cada caractere resolve um por um da esquerda para a direita (mais typing-like).
```javascript
function step() {
  let display = '';
  for (let i = 0; i < total; i++) {
    if (original[i] === ' ') { display += ' '; continue; }
    if (i < Math.floor(resolved)) {
      display += original[i];
    } else {
      display += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }
  }
  el.textContent = display;
  if (Math.floor(resolved) < total) {
    resolved += 1; // One char at a time
    setTimeout(step, speed * 2);
  }
}
```
