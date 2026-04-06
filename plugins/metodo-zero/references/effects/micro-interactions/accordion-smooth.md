# Accordion Smooth

## Quando usar
Accordion/FAQ com animação suave de abertura/fechamento — sem o "jump" brusco padrão. Ideal para FAQs, features detalhadas, pricing breakdown, documentação. Tom organizado e polido. Experiência de usuário muito superior ao accordion padrão.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ac-bg` | `transparent` | Cor de fundo dos itens |
| `--ac-border` | `rgba(255,255,255,0.1)` | Cor da borda entre itens |
| `--ac-text-color` | `#ffffff` | Cor do título |
| `--ac-content-color` | `rgba(255,255,255,0.7)` | Cor do conteúdo |
| `--ac-accent` | `#6366f1` | Cor de destaque (ícone, borda ativa) |
| `--ac-transition` | `0.4s` | Velocidade da animação |
| `--ac-single-open` | `true` | Apenas um item aberto por vez (via JS) |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<div class="ac-accordion" id="smoothAccordion" role="list">
  <div class="ac-accordion__item" role="listitem">
    <button class="ac-accordion__trigger" aria-expanded="false" aria-controls="ac-panel-1">
      <span class="ac-accordion__title">What makes this different?</span>
      <span class="ac-accordion__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line class="ac-accordion__icon-h" x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line class="ac-accordion__icon-v" x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
    </button>
    <div class="ac-accordion__panel" id="ac-panel-1" role="region" hidden>
      <div class="ac-accordion__content">
        <p>Our approach combines cutting-edge techniques with battle-tested patterns. Every detail is optimized for speed, accessibility, and visual impact.</p>
      </div>
    </div>
  </div>

  <div class="ac-accordion__item" role="listitem">
    <button class="ac-accordion__trigger" aria-expanded="false" aria-controls="ac-panel-2">
      <span class="ac-accordion__title">How long does it take?</span>
      <span class="ac-accordion__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line class="ac-accordion__icon-h" x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line class="ac-accordion__icon-v" x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
    </button>
    <div class="ac-accordion__panel" id="ac-panel-2" role="region" hidden>
      <div class="ac-accordion__content">
        <p>Most projects launch within 2-4 weeks. We focus on rapid iteration with clear milestones so you see progress from day one.</p>
      </div>
    </div>
  </div>

  <div class="ac-accordion__item" role="listitem">
    <button class="ac-accordion__trigger" aria-expanded="false" aria-controls="ac-panel-3">
      <span class="ac-accordion__title">What's included in the price?</span>
      <span class="ac-accordion__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line class="ac-accordion__icon-h" x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line class="ac-accordion__icon-v" x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
    </button>
    <div class="ac-accordion__panel" id="ac-panel-3" role="region" hidden>
      <div class="ac-accordion__content">
        <p>Everything. Design, development, testing, deployment, and 30 days of post-launch support. No hidden fees, no surprises.</p>
      </div>
    </div>
  </div>
</div>
```

## CSS

```css
.ac-accordion {
  --ac-bg: transparent;
  --ac-border: rgba(255, 255, 255, 0.1);
  --ac-text-color: var(--color-text, #ffffff);
  --ac-content-color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  --ac-accent: var(--color-primary, #6366f1);
  --ac-transition: 0.4s;

  width: min(90%, 50rem);
  margin: 0 auto;
}

.ac-accordion__item {
  border-bottom: 1px solid var(--ac-border);
}

.ac-accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 1.5rem) 0;
  background: var(--ac-bg);
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--ac-text-color);
  font-family: inherit;
  transition: color var(--ac-transition) ease;
}

.ac-accordion__trigger:hover {
  color: var(--ac-accent);
}

.ac-accordion__title {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  line-height: 1.3;
}

.ac-accordion__icon {
  flex-shrink: 0;
  color: var(--ac-content-color);
  transition: color var(--ac-transition) ease;
}

.ac-accordion__icon-v {
  transition: transform var(--ac-transition) cubic-bezier(0.22, 1, 0.36, 1),
              opacity var(--ac-transition) ease;
  transform-origin: center;
}

.ac-accordion__trigger[aria-expanded="true"] .ac-accordion__icon-v {
  transform: rotate(90deg);
  opacity: 0;
}

.ac-accordion__trigger[aria-expanded="true"] .ac-accordion__icon {
  color: var(--ac-accent);
}

/* Panel animation */
.ac-accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--ac-transition) cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.ac-accordion__panel[hidden] {
  display: grid;
  grid-template-rows: 0fr;
}

.ac-accordion__panel.is-open {
  grid-template-rows: 1fr;
}

.ac-accordion__content {
  min-height: 0;
  overflow: hidden;
}

.ac-accordion__content p {
  padding: 0 0 clamp(1rem, 2vw, 1.5rem);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  color: var(--ac-content-color);
  line-height: 1.7;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ac-accordion__panel {
    transition: none;
  }
  .ac-accordion__icon-v {
    transition: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const accordion = document.getElementById('smoothAccordion');
  if (!accordion) return;

  const singleOpen = true;
  const triggers = accordion.querySelectorAll('.ac-accordion__trigger');

  function openPanel(trigger) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');

    /* Force reflow before adding class for transition */
    panel.offsetHeight;
    panel.classList.add('is-open');
  }

  function closePanel(trigger) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');

    /* Wait for transition to complete before hiding */
    const duration = parseFloat(getComputedStyle(accordion).getPropertyValue('--ac-transition')) * 1000 || 400;
    setTimeout(() => {
      if (trigger.getAttribute('aria-expanded') === 'false') {
        panel.setAttribute('hidden', '');
      }
    }, duration);
  }

  function toggle(trigger) {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    if (singleOpen && !isOpen) {
      triggers.forEach((t) => {
        if (t !== trigger && t.getAttribute('aria-expanded') === 'true') {
          closePanel(t);
        }
      });
    }

    if (isOpen) {
      closePanel(trigger);
    } else {
      openPanel(trigger);
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => toggle(trigger));
  });

  /* Keyboard: Enter and Space already handled by <button> */
})();
```

## Integração
O accordion usa `grid-template-rows: 0fr → 1fr` para animação suave de altura (técnica moderna sem `max-height` hack). Cada item é acessível com `aria-expanded`, `aria-controls` e `role`. O `hidden` attribute é gerenciado via JS para screen readers. Funciona com qualquer conteúdo dentro de `.ac-accordion__content`. A variável `singleOpen` controla se múltiplos itens podem ficar abertos.

## Variações

### Variação 1: Multi-Open (Todos Podem Ficar Abertos)
Apenas mudar a flag no JS.
```javascript
const singleOpen = false;
```

### Variação 2: Bordered Cards
Itens como cards com borda visível em vez de separadores.
```css
.ac-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.ac-accordion__item {
  border: 1px solid var(--ac-border);
  border-radius: 0.75rem;
  padding: 0 clamp(1rem, 2vw, 1.5rem);
  transition: border-color var(--ac-transition) ease;
}
.ac-accordion__item:has(.ac-accordion__trigger[aria-expanded="true"]) {
  border-color: var(--ac-accent);
}
```

### Variação 3: Arrow Icon (Em Vez de Plus/Minus)
Ícone de chevron que rotaciona.
```html
<span class="ac-accordion__icon ac-accordion__icon--arrow" aria-hidden="true">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <polyline points="6,8 10,12 14,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>
```
```css
.ac-accordion__icon--arrow svg {
  transition: transform var(--ac-transition) cubic-bezier(0.22, 1, 0.36, 1);
}
.ac-accordion__trigger[aria-expanded="true"] .ac-accordion__icon--arrow svg {
  transform: rotate(180deg);
}
```
