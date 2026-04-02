# Button Ripple

## Quando usar
Efeito ripple (ondulação) material-design-like ao clicar em botões — um círculo se expande do ponto de clique e faz fade out. Ideal para CTAs, nav buttons, cards clicáveis, qualquer elemento interativo. Tom responsivo e tátil. Feedback visual instantâneo de que a ação foi registrada.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--rp-color` | `rgba(255,255,255,0.3)` | Cor do ripple |
| `--rp-duration` | `0.6s` | Duração da animação |
| `--rp-scale` | `4` | Escala final do ripple |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<button class="rp-button" data-ripple>
  Get Started
</button>

<button class="rp-button rp-button--outline" data-ripple>
  Learn More
</button>

<a href="#" class="rp-button rp-button--ghost" data-ripple>
  Explore
</a>
```

## CSS

```css
.rp-button {
  --rp-color: rgba(255, 255, 255, 0.3);
  --rp-duration: 0.6s;

  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-primary, #6366f1);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.5;
  -webkit-user-select: none;
  user-select: none;
  transition: background 0.2s, transform 0.15s;
}

.rp-button:hover {
  filter: brightness(1.1);
}

.rp-button:active {
  transform: scale(0.98);
}

.rp-button--outline {
  background: transparent;
  border: 2px solid var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
  --rp-color: rgba(99, 102, 241, 0.2);
}

.rp-button--ghost {
  background: transparent;
  color: var(--color-text, #ffffff);
  --rp-color: rgba(255, 255, 255, 0.1);
}

.rp-ripple {
  position: absolute;
  border-radius: 50%;
  background: var(--rp-color);
  transform: scale(0);
  animation: rpExpand var(--rp-duration) ease-out forwards;
  pointer-events: none;
}

@keyframes rpExpand {
  to {
    transform: scale(var(--rp-scale, 4));
    opacity: 0;
  }
}

.rp-button:focus-visible {
  outline: 2px solid var(--color-primary, #6366f1);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .rp-ripple { animation: none; display: none; }
}
```

## JavaScript

```javascript
(function () {
  const buttons = document.querySelectorAll('[data-ripple]');
  if (!buttons.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'rp-ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (x - size / 2) + 'px';
      ripple.style.top = (y - size / 2) + 'px';

      button.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();
```

## Integração
Adicione `data-ripple` a qualquer botão ou elemento clicável. O elemento precisa de `position: relative` e `overflow: hidden` (já incluídos em `.rp-button`). O JS cria um `<span>` no ponto de clique que expande e faz fade. O span é removido automaticamente após a animação.

## Variações

### Variação 1: Centered Ripple
Ripple sempre expande do centro do botão.
```javascript
button.addEventListener('click', function () {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'rp-ripple';
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = (rect.width / 2 - size / 2) + 'px';
  ripple.style.top = (rect.height / 2 - size / 2) + 'px';
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});
```

### Variação 2: Hold Ripple (Press & Hold)
Ripple cresce enquanto o botão está pressionado.
```css
.rp-ripple--hold {
  animation: none;
  transition: transform 0.8s ease-out, opacity 0.3s;
}
.rp-ripple--hold.is-active { transform: scale(4); }
.rp-ripple--hold.is-releasing { opacity: 0; }
```
```javascript
button.addEventListener('mousedown', function (e) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'rp-ripple rp-ripple--hold';
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  button.appendChild(ripple);
  requestAnimationFrame(() => ripple.classList.add('is-active'));
  const release = () => {
    ripple.classList.add('is-releasing');
    ripple.addEventListener('transitionend', () => ripple.remove());
    document.removeEventListener('mouseup', release);
  };
  document.addEventListener('mouseup', release);
});
```

### Variação 3: Multi-Color Ripple
Cada clique gera uma cor diferente.
```javascript
const colors = ['rgba(99,102,241,0.3)', 'rgba(236,72,153,0.3)', 'rgba(6,182,212,0.3)', 'rgba(34,197,94,0.3)'];
let colorIndex = 0;
button.addEventListener('click', function (e) {
  /* ... same ripple creation ... */
  ripple.style.background = colors[colorIndex % colors.length];
  colorIndex++;
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});
```
