# Link Underline Animated

## Quando usar
Underline de links com animação sofisticada — não apenas aparecer/desaparecer, mas deslizar, expandir, mudar cor ou espessura. Ideal para navegações, links inline, menus, footers. Tom refinado e profissional. Detalhes que separam sites genéricos de premium.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--lu-color` | `#6366f1` | Cor do underline |
| `--lu-height` | `2px` | Espessura do underline |
| `--lu-offset` | `0` | Distância do underline ao texto |
| `--lu-transition` | `0.3s` | Velocidade da animação |
| `--lu-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Easing |

## Dependências
- CSS puro — nenhuma dependência externa

## HTML

```html
<!-- Estilo 1: Slide Left to Right -->
<a href="#" class="lu-link lu-link--slide">Slide Underline</a>

<!-- Estilo 2: Expand from Center -->
<a href="#" class="lu-link lu-link--center">Center Expand</a>

<!-- Estilo 3: Draw & Erase -->
<a href="#" class="lu-link lu-link--draw">Draw & Erase</a>

<!-- Estilo 4: Thick Highlight -->
<a href="#" class="lu-link lu-link--highlight">Highlight Effect</a>

<!-- Exemplo em navegação -->
<nav class="lu-nav">
  <a href="#" class="lu-link lu-link--slide">Home</a>
  <a href="#" class="lu-link lu-link--slide">About</a>
  <a href="#" class="lu-link lu-link--slide">Work</a>
  <a href="#" class="lu-link lu-link--slide">Contact</a>
</nav>
```

## CSS

```css
/* === Base === */
.lu-link {
  --lu-color: var(--color-primary, #6366f1);
  --lu-height: 2px;
  --lu-offset: 2px;
  --lu-transition: 0.3s;
  --lu-ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: relative;
  display: inline-block;
  color: var(--color-text, #ffffff);
  text-decoration: none;
  font-weight: 500;
  padding-bottom: var(--lu-offset);
}

/* === Estilo 1: Slide Left to Right === */
.lu-link--slide::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: var(--lu-height);
  background: var(--lu-color);
  transition: width var(--lu-transition) var(--lu-ease);
}

.lu-link--slide:hover::after {
  width: 100%;
}

/* === Estilo 2: Expand from Center === */
.lu-link--center::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0%;
  height: var(--lu-height);
  background: var(--lu-color);
  transition: width var(--lu-transition) var(--lu-ease),
              left var(--lu-transition) var(--lu-ease);
}

.lu-link--center:hover::after {
  width: 100%;
  left: 0%;
}

/* === Estilo 3: Draw & Erase (enter left, exit right) === */
.lu-link--draw::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--lu-height);
  background: var(--lu-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--lu-transition) var(--lu-ease);
}

.lu-link--draw:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* === Estilo 4: Thick Highlight === */
.lu-link--highlight {
  --lu-height: 40%;
}

.lu-link--highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -2%;
  width: 104%;
  height: 0%;
  background: var(--lu-color);
  opacity: 0.2;
  transition: height var(--lu-transition) var(--lu-ease);
  z-index: -1;
  border-radius: 2px;
}

.lu-link--highlight:hover::after {
  height: var(--lu-height);
}

/* === Navegação === */
.lu-nav {
  display: flex;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: center;
}

@media (prefers-reduced-motion: reduce) {
  .lu-link::after {
    transition: none;
  }
}
```

## JavaScript

```javascript
/* Efeito é 100% CSS — nenhum JavaScript necessário */
```

## Integração
Adicionar a classe `.lu-link` + modificador de estilo (`--slide`, `--center`, `--draw`, `--highlight`) a qualquer link. Funciona com qualquer texto e tamanho. Totalmente CSS, zero overhead de JavaScript. Customizar via CSS variables no seletor ou inline. Pode ser usado em navegações, links inline, ou qualquer texto clicável.

## Variações

### Variação 1: Gradient Underline
Underline com gradiente em vez de cor sólida.
```css
.lu-link--gradient::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg,
    var(--color-primary, #6366f1),
    var(--color-accent, #ec4899)
  );
  transition: width 0.4s var(--lu-ease);
}
.lu-link--gradient:hover::after {
  width: 100%;
}
```

### Variação 2: Double Line (Acima e Abaixo)
Dois underlines — um por cima e outro por baixo do texto.
```css
.lu-link--double::before,
.lu-link--double::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0%;
  height: var(--lu-height);
  background: var(--lu-color);
  transition: width var(--lu-transition) var(--lu-ease);
}
.lu-link--double::before {
  top: 0;
  transition-delay: 0.05s;
}
.lu-link--double::after {
  bottom: 0;
}
.lu-link--double:hover::before,
.lu-link--double:hover::after {
  width: 100%;
}
```

### Variação 3: Bounce Underline
Underline com efeito de "bounce" (overshoot).
```css
.lu-link--bounce::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: var(--lu-height);
  background: var(--lu-color);
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lu-link--bounce:hover::after {
  width: 100%;
}
```
