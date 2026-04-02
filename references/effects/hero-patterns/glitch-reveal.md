# Glitch Reveal

## Quando usar
Texto/conteúdo do hero aparece com efeito glitch — distorção digital, color split, flickering. Ideal para tech, gaming, cyberpunk, hackathons, music events. Tom rebelde, digital e high-energy. O glitch pode ser na entrada ou contínuo sutil.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--gr-color` | `#ffffff` | Cor do texto |
| `--gr-glitch-1` | `#ff0040` | Primeira cor de glitch (red) |
| `--gr-glitch-2` | `#00ffff` | Segunda cor de glitch (cyan) |
| `--gr-intensity` | `medium` | Intensidade (low, medium, high) |
| `--gr-speed` | `3s` | Intervalo entre glitches |

## Dependências
- CSS + JS vanilla — nenhuma dependência externa

## HTML

```html
<section class="gr-hero" id="glitchRevealHero">
  <div class="gr-hero__content">
    <h1 class="gr-hero__title" data-gr-text="Break the System">Break the System</h1>
    <p class="gr-hero__subtitle">Disruption is our default mode</p>
    <a href="#" class="gr-hero__cta">Enter the Matrix</a>
  </div>
</section>
```

## CSS

```css
.gr-hero {
  --gr-color: var(--color-text, #ffffff);
  --gr-glitch-1: #ff0040;
  --gr-glitch-2: #00ffff;
  --gr-speed: 3s;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0a0a0a);
}

.gr-hero__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 60rem;
}

.gr-hero__title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 900;
  color: var(--gr-color);
  margin: 0 0 1rem;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
}

/* Glitch pseudo-elements */
.gr-hero__title::before,
.gr-hero__title::after {
  content: attr(data-gr-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gr-hero__title::before {
  color: var(--gr-glitch-1);
  clip-path: inset(0 0 65% 0);
  animation: gr-glitch-top var(--gr-speed) steps(2) infinite;
  animation-delay: calc(var(--gr-speed) * -0.5);
}

.gr-hero__title::after {
  color: var(--gr-glitch-2);
  clip-path: inset(60% 0 0 0);
  animation: gr-glitch-bottom var(--gr-speed) steps(3) infinite;
}

@keyframes gr-glitch-top {
  0%, 90%, 100% { transform: translate(0); opacity: 0; }
  92% { transform: translate(-4px, -2px); opacity: 0.8; }
  94% { transform: translate(4px, 1px); opacity: 0.6; }
  96% { transform: translate(-2px, 3px); opacity: 0.9; }
  98% { transform: translate(3px, -1px); opacity: 0; }
}

@keyframes gr-glitch-bottom {
  0%, 88%, 100% { transform: translate(0); opacity: 0; }
  90% { transform: translate(3px, 2px); opacity: 0.7; }
  93% { transform: translate(-3px, -1px); opacity: 0.8; }
  95% { transform: translate(5px, 0); opacity: 0.5; }
  97% { transform: translate(-2px, 2px); opacity: 0; }
}

.gr-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 2rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.gr-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  border: 1px solid var(--gr-color);
  color: var(--gr-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;
}

.gr-hero__cta:hover {
  background: var(--gr-color);
  color: var(--color-bg, #0a0a0a);
}

@media (prefers-reduced-motion: reduce) {
  .gr-hero__title::before,
  .gr-hero__title::after {
    animation: none;
    display: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('glitchRevealHero');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  /* Scanline overlay */
  const scanline = document.createElement('div');
  scanline.setAttribute('aria-hidden', 'true');
  scanline.style.cssText = `
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
  `;
  hero.appendChild(scanline);

  /* Random intense glitch burst */
  const title = hero.querySelector('.gr-hero__title');
  if (!title) return;

  function glitchBurst() {
    title.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 4}px)`;
    title.style.filter = 'hue-rotate(' + Math.random() * 30 + 'deg)';

    setTimeout(() => {
      title.style.transform = '';
      title.style.filter = '';
    }, 80 + Math.random() * 120);
  }

  setInterval(glitchBurst, 3000 + Math.random() * 4000);
})();
```

## Integração
O `data-gr-text` attribute no título deve conter o mesmo texto do `textContent` — é usado pelos pseudo-elements para o efeito de split. As scanlines CSS são sutis e opcionais. O JS adiciona "bursts" periódicos de distorção mais intensa. Em reduced-motion, o efeito inteiro é desativado.

## Variações

### Variação 1: Entrance Glitch Only
Glitch apenas na entrada — depois fica estático. Mais profissional.
```css
.gr-hero__title::before { animation: gr-glitch-top 1s steps(2) forwards; }
.gr-hero__title::after { animation: gr-glitch-bottom 1s steps(3) forwards; }
```
```javascript
// Remover o setInterval de glitchBurst
// Adicionar apenas um burst na entrada:
setTimeout(glitchBurst, 500);
setTimeout(glitchBurst, 700);
setTimeout(glitchBurst, 1100);
```

### Variação 2: Heavy Glitch (Alta Intensidade)
Glitch mais frequente e pronunciado. Estilo cyberpunk pesado.
```css
.gr-hero { --gr-speed: 1.5s; }
@keyframes gr-glitch-top {
  0%, 80%, 100% { transform: translate(0); opacity: 0; }
  82% { transform: translate(-8px, -4px); opacity: 1; }
  85% { transform: translate(8px, 2px); opacity: 0.8; }
  88% { transform: translate(-6px, 5px); opacity: 1; }
  92% { transform: translate(10px, -3px); opacity: 0.6; }
  95% { transform: translate(-4px, 4px); opacity: 0; }
}
```

### Variação 3: Text Scramble Entrance
Texto aparece com caracteres aleatórios que resolvem gradualmente.
```javascript
// Substituir JS inteiro:
const title = hero.querySelector('.gr-hero__title');
const original = title.textContent;
const chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let iteration = 0;

const interval = setInterval(() => {
  title.textContent = original
    .split('')
    .map((char, i) => {
      if (i < iteration) return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    })
    .join('');
  if (iteration >= original.length) clearInterval(interval);
  iteration += 1 / 2;
}, 30);
```
