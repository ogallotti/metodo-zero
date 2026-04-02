# Tooltip Animated

## Quando usar
Tooltips com animação de entrada/saída suaves — aparecem com scale + fade ao hover ou focus, com posicionamento automático. Ideal para ícones sem label, termos técnicos, botões de ação, feature hints. Tom informativo e acessível. Feedback contextual que não ocupa espaço visual permanente.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--tt-bg` | `#1f2937` | Cor de fundo do tooltip |
| `--tt-color` | `#ffffff` | Cor do texto |
| `--tt-radius` | `0.375rem` | Border-radius |
| `--tt-offset` | `8px` | Distância do elemento trigger |
| `--tt-duration` | `0.15s` | Duração da animação |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<div class="tt-demo">
  <button class="tt-trigger" data-tooltip="Save your progress" data-tooltip-position="top">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  </button>

  <button class="tt-trigger" data-tooltip="Delete permanently" data-tooltip-position="bottom">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  </button>

  <span class="tt-trigger" data-tooltip="Cascading Style Sheets" data-tooltip-position="right" tabindex="0" style="text-decoration:underline dotted;cursor:help;">
    CSS
  </span>
</div>
```

## CSS

```css
.tt-demo {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  padding: 4rem;
}

.tt-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: var(--color-text, #ffffff);
  cursor: pointer;
  transition: background 0.2s;
}

.tt-trigger:hover { background: rgba(255, 255, 255, 0.15); }

.tt-tooltip {
  --tt-bg: #1f2937;
  --tt-color: #ffffff;
  --tt-radius: 0.375rem;
  --tt-offset: 8px;
  --tt-duration: 0.15s;

  position: absolute;
  z-index: 9999;
  padding: 0.375rem 0.75rem;
  background: var(--tt-bg);
  color: var(--tt-color);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  border-radius: var(--tt-radius);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity var(--tt-duration) ease, transform var(--tt-duration) ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tt-tooltip.is-visible {
  opacity: 1;
  transform: scale(1);
}

/* Arrow */
.tt-tooltip::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--tt-bg);
  transform: rotate(45deg);
}

.tt-tooltip--top { bottom: 100%; left: 50%; transform: translateX(-50%) scale(0.95); margin-bottom: var(--tt-offset); }
.tt-tooltip--top.is-visible { transform: translateX(-50%) scale(1); }
.tt-tooltip--top::before { bottom: -4px; left: 50%; margin-left: -4px; }

.tt-tooltip--bottom { top: 100%; left: 50%; transform: translateX(-50%) scale(0.95); margin-top: var(--tt-offset); }
.tt-tooltip--bottom.is-visible { transform: translateX(-50%) scale(1); }
.tt-tooltip--bottom::before { top: -4px; left: 50%; margin-left: -4px; }

.tt-tooltip--left { right: 100%; top: 50%; transform: translateY(-50%) scale(0.95); margin-right: var(--tt-offset); }
.tt-tooltip--left.is-visible { transform: translateY(-50%) scale(1); }
.tt-tooltip--left::before { right: -4px; top: 50%; margin-top: -4px; }

.tt-tooltip--right { left: 100%; top: 50%; transform: translateY(-50%) scale(0.95); margin-left: var(--tt-offset); }
.tt-tooltip--right.is-visible { transform: translateY(-50%) scale(1); }
.tt-tooltip--right::before { left: -4px; top: 50%; margin-top: -4px; }

@media (prefers-reduced-motion: reduce) {
  .tt-tooltip { transition: none; }
}
```

## JavaScript

```javascript
(function () {
  const triggers = document.querySelectorAll('[data-tooltip]');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    const text = trigger.dataset.tooltip;
    const position = trigger.dataset.tooltipPosition || 'top';
    let tooltip = null;
    let showTimeout;

    function create() {
      tooltip = document.createElement('div');
      tooltip.className = `tt-tooltip tt-tooltip--${position}`;
      tooltip.textContent = text;
      tooltip.setAttribute('role', 'tooltip');
      trigger.style.position = trigger.style.position || 'relative';
      trigger.appendChild(tooltip);
    }

    function show() {
      if (!tooltip) create();
      showTimeout = setTimeout(() => {
        tooltip.classList.add('is-visible');
      }, 100);
    }

    function hide() {
      clearTimeout(showTimeout);
      if (!tooltip) return;
      tooltip.classList.remove('is-visible');
      tooltip.addEventListener('transitionend', () => {
        if (tooltip && !tooltip.classList.contains('is-visible')) {
          tooltip.remove();
          tooltip = null;
        }
      }, { once: true });
    }

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);

    /* Dismiss on Escape */
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });
  });
})();
```

## Integração
Adicione `data-tooltip="texto"` e opcionalmente `data-tooltip-position="top|bottom|left|right"` a qualquer elemento. O JS cria o tooltip on-demand e o remove após fade out. Funciona com hover e focus para acessibilidade. O tooltip é filho do trigger, então herda posicionamento relativo. Dismiss via Escape key.

## Variações

### Variação 1: Rich Tooltip (com HTML)
Tooltip com conteúdo rico (título + descrição).
```html
<button class="tt-trigger" data-tooltip-rich data-tooltip-title="Premium Plan" data-tooltip-desc="Includes all features, priority support, and unlimited storage." data-tooltip-position="top">
  Upgrade
</button>
```
```javascript
function create() {
  tooltip = document.createElement('div');
  tooltip.className = `tt-tooltip tt-tooltip--${position}`;
  tooltip.innerHTML = `<strong style="display:block;margin-bottom:2px;">${trigger.dataset.tooltipTitle}</strong><span style="opacity:0.8;font-size:0.75rem;">${trigger.dataset.tooltipDesc}</span>`;
  tooltip.style.whiteSpace = 'normal';
  tooltip.style.maxWidth = '220px';
  trigger.appendChild(tooltip);
}
```

### Variação 2: Follow Cursor
Tooltip segue o cursor em vez de posição fixa.
```javascript
trigger.addEventListener('mousemove', (e) => {
  if (!tooltip) return;
  tooltip.style.position = 'fixed';
  tooltip.style.left = (e.clientX + 12) + 'px';
  tooltip.style.top = (e.clientY - 30) + 'px';
  tooltip.style.margin = '0';
  tooltip.style.transform = 'none';
});
```

### Variação 3: Delayed Show + Instant Hide
Tooltip aparece após delay maior (útil para dicas não essenciais).
```javascript
function show() {
  if (!tooltip) create();
  showTimeout = setTimeout(() => {
    tooltip.classList.add('is-visible');
  }, 500); /* 500ms delay */
}
function hide() {
  clearTimeout(showTimeout);
  if (!tooltip) return;
  tooltip.remove();
  tooltip = null;
}
```
