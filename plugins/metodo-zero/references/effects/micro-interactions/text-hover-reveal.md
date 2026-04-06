# Text Hover Reveal

## Quando usar
Texto que revela conteúdo diferente (outra cor, imagem de fundo, tradução) ao hover. Ideal para menus de navegação, portfolios, links de destaque, seções de skills/serviços. Tom lúdico e sofisticado. Convida exploração e cria surprise-and-delight.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--thr-color` | `rgba(255,255,255,0.3)` | Cor do texto no estado normal |
| `--thr-hover-color` | `#ffffff` | Cor do texto no hover |
| `--thr-accent` | `#6366f1` | Cor de destaque/underline |
| `--thr-font-size` | `clamp(2rem, 5vw, 4rem)` | Tamanho do texto |
| `--thr-transition` | `0.4s` | Velocidade da transição |
| `--thr-clip-direction` | `bottom` | Direção do reveal (via clip-path) |

## Dependências
- CSS + JS minimal — nenhuma dependência externa

## HTML

```html
<nav class="thr-list" id="textHoverReveal">
  <a href="#" class="thr-item" data-thr-reveal>
    <span class="thr-item__default">Strategy</span>
    <span class="thr-item__reveal">We plan your growth</span>
  </a>
  <a href="#" class="thr-item" data-thr-reveal>
    <span class="thr-item__default">Design</span>
    <span class="thr-item__reveal">We shape your brand</span>
  </a>
  <a href="#" class="thr-item" data-thr-reveal>
    <span class="thr-item__default">Development</span>
    <span class="thr-item__reveal">We build your product</span>
  </a>
  <a href="#" class="thr-item" data-thr-reveal>
    <span class="thr-item__default">Growth</span>
    <span class="thr-item__reveal">We scale your reach</span>
  </a>
</nav>
```

## CSS

```css
.thr-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: min(90%, 60rem);
  margin: 0 auto;
}

.thr-item {
  --thr-color: rgba(255, 255, 255, 0.3);
  --thr-hover-color: var(--color-text, #ffffff);
  --thr-accent: var(--color-primary, #6366f1);
  --thr-font-size: clamp(2rem, 5vw, 4rem);
  --thr-transition: 0.4s;

  position: relative;
  display: block;
  text-decoration: none;
  padding: clamp(1rem, 2vw, 1.5rem) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  cursor: pointer;
}

.thr-item__default,
.thr-item__reveal {
  display: block;
  font-size: var(--thr-font-size);
  font-weight: 700;
  line-height: 1.2;
  transition: transform var(--thr-transition) cubic-bezier(0.22, 1, 0.36, 1),
              opacity var(--thr-transition) ease;
}

.thr-item__default {
  color: var(--thr-color);
}

.thr-item__reveal {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(20%);
  opacity: 0;
  color: var(--thr-hover-color);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
}

/* Hover state */
.thr-item:hover .thr-item__default {
  transform: translateY(-100%);
  opacity: 0;
}

.thr-item:hover .thr-item__reveal {
  transform: translateY(-50%);
  opacity: 1;
}

/* Active indicator */
.thr-item::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--thr-accent);
  transition: width var(--thr-transition) cubic-bezier(0.22, 1, 0.36, 1);
}

.thr-item:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .thr-item {
    --thr-font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .thr-item__default,
  .thr-item__reveal {
    transition: none;
  }
  .thr-item::after {
    transition: none;
  }
}
```

## JavaScript

```javascript
/* CSS-only effect — JS apenas para touch support e acessibilidade */
(function () {
  const items = document.querySelectorAll('[data-thr-reveal]');
  if (!items.length) return;

  /* Keyboard support: mostrar reveal ao focar */
  items.forEach((item) => {
    item.addEventListener('focus', () => {
      item.classList.add('is-focused');
    });
    item.addEventListener('blur', () => {
      item.classList.remove('is-focused');
    });
  });
})();
```

## Integração
Efeito é primariamente CSS com JS mínimo para acessibilidade. Cada `.thr-item` tem dois textos — `__default` (visível) e `__reveal` (escondido até hover). A estrutura funciona como navegação, lista de serviços ou qualquer lista de itens com detalhe expandido. A underline animada dá feedback visual adicional.

## Variações

### Variação 1: Image Reveal on Hover
Hover revela uma imagem de fundo em vez de texto alternativo.
```html
<a href="#" class="thr-item" data-thr-reveal>
  <span class="thr-item__default">Strategy</span>
  <div class="thr-item__img-reveal">
    <img src="assets/strategy.webp" alt="" />
  </div>
</a>
```
```css
.thr-item__img-reveal {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}
.thr-item__img-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thr-item:hover .thr-item__img-reveal {
  opacity: 0.3;
}
.thr-item:hover .thr-item__default {
  color: var(--thr-hover-color);
  transform: none;
  opacity: 1;
  position: relative;
  z-index: 1;
}
```

### Variação 2: Color Fill (Preenchimento de Cor)
Texto se "preenche" de cor da esquerda para a direita via clip-path.
```html
<a href="#" class="thr-item thr-item--fill" data-thr-reveal>
  <span class="thr-item__default">Strategy</span>
  <span class="thr-item__colored" aria-hidden="true">Strategy</span>
</a>
```
```css
.thr-item--fill .thr-item__colored {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: var(--thr-hover-color);
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  font-size: var(--thr-font-size);
  font-weight: 700;
}
.thr-item--fill:hover .thr-item__colored {
  clip-path: inset(0 0% 0 0);
}
.thr-item--fill:hover .thr-item__default {
  transform: none;
  opacity: 1;
}
```

### Variação 3: Number + Arrow Reveal
Número do item e seta aparecem no hover. Estilo editorial.
```css
.thr-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.thr-item__num {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--thr-accent);
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--thr-transition) ease;
  min-width: 2rem;
}
.thr-item:hover .thr-item__num {
  opacity: 1;
  transform: translateX(0);
}
.thr-item__arrow {
  margin-left: auto;
  font-size: 1.5rem;
  color: var(--thr-accent);
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--thr-transition) ease;
}
.thr-item:hover .thr-item__arrow {
  opacity: 1;
  transform: translateX(0);
}
```
