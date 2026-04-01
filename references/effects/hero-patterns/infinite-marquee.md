# Infinite Marquee

## Quando usar
Texto ou logos em scroll infinito horizontal — como um "ticker" contínuo. Ideal para social proof (logos de clientes), frases de impacto, skills/tecnologias, testimonials curtos. Tom dinâmico e moderno. Popular em sites de agências e portfólios premium.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--im-speed` | `30s` | Duração de um ciclo completo |
| `--im-gap` | `3rem` | Espaço entre itens |
| `--im-font-size` | `clamp(2rem, 5vw, 4rem)` | Tamanho do texto (modo texto) |
| `--im-color` | `rgba(255,255,255,0.15)` | Cor do texto (geralmente sutil) |
| `--im-hover-color` | `#ffffff` | Cor no hover |
| `--im-direction` | `normal` | Direção (normal = esquerda, reverse = direita) |
| `--im-separator` | `·` | Caractere separador entre itens |

## Dependências
- CSS puro + JS mínimo — nenhuma dependência externa

## HTML

```html
<!-- Marquee de Texto -->
<div class="im-marquee" data-direction="left" aria-label="Scrolling text">
  <div class="im-marquee__track">
    <div class="im-marquee__content">
      <span class="im-marquee__item">Strategy</span>
      <span class="im-marquee__sep" aria-hidden="true">·</span>
      <span class="im-marquee__item">Design</span>
      <span class="im-marquee__sep" aria-hidden="true">·</span>
      <span class="im-marquee__item">Development</span>
      <span class="im-marquee__sep" aria-hidden="true">·</span>
      <span class="im-marquee__item">Branding</span>
      <span class="im-marquee__sep" aria-hidden="true">·</span>
      <span class="im-marquee__item">Growth</span>
      <span class="im-marquee__sep" aria-hidden="true">·</span>
    </div>
    <!-- Duplicado para loop seamless (JS faz isso automaticamente) -->
  </div>
</div>

<!-- Marquee de Logos -->
<div class="im-marquee im-marquee--logos" data-direction="right" aria-label="Client logos">
  <div class="im-marquee__track">
    <div class="im-marquee__content">
      <img class="im-marquee__logo" src="assets/logo-1.svg" alt="Client 1" loading="lazy" />
      <img class="im-marquee__logo" src="assets/logo-2.svg" alt="Client 2" loading="lazy" />
      <img class="im-marquee__logo" src="assets/logo-3.svg" alt="Client 3" loading="lazy" />
      <img class="im-marquee__logo" src="assets/logo-4.svg" alt="Client 4" loading="lazy" />
      <img class="im-marquee__logo" src="assets/logo-5.svg" alt="Client 5" loading="lazy" />
      <img class="im-marquee__logo" src="assets/logo-6.svg" alt="Client 6" loading="lazy" />
    </div>
  </div>
</div>
```

## CSS

```css
.im-marquee {
  --im-speed: 30s;
  --im-gap: 3rem;
  --im-font-size: clamp(2rem, 5vw, 4rem);
  --im-color: rgba(255, 255, 255, 0.15);
  --im-hover-color: var(--color-text, #ffffff);
  --im-direction: normal;

  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.im-marquee__track {
  display: flex;
  width: max-content;
  animation: im-scroll var(--im-speed) linear infinite;
  animation-direction: var(--im-direction);
}

.im-marquee[data-direction="right"] {
  --im-direction: reverse;
}

.im-marquee__content {
  display: flex;
  align-items: center;
  gap: var(--im-gap);
  padding-right: var(--im-gap);
}

.im-marquee__item {
  font-size: var(--im-font-size);
  font-weight: 700;
  color: var(--im-color);
  white-space: nowrap;
  transition: color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.im-marquee__item:hover {
  color: var(--im-hover-color);
}

.im-marquee__sep {
  font-size: calc(var(--im-font-size) * 0.6);
  color: var(--im-color);
  opacity: 0.5;
}

/* Logo variant */
.im-marquee--logos {
  --im-speed: 25s;
  --im-gap: 4rem;
}

.im-marquee__logo {
  height: clamp(1.5rem, 3vw, 2.5rem);
  width: auto;
  opacity: 0.4;
  filter: grayscale(100%) brightness(2);
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.im-marquee__logo:hover {
  opacity: 1;
  filter: grayscale(0%) brightness(1);
}

@keyframes im-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Pause on hover */
.im-marquee:hover .im-marquee__track {
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .im-marquee {
    --im-font-size: clamp(1.5rem, 6vw, 2.5rem);
    --im-gap: 2rem;
  }
  .im-marquee--logos {
    --im-gap: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .im-marquee__track {
    animation: none;
  }
  .im-marquee__content {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

## JavaScript

```javascript
(function () {
  document.querySelectorAll('.im-marquee').forEach((marquee) => {
    const track = marquee.querySelector('.im-marquee__track');
    const content = marquee.querySelector('.im-marquee__content');
    if (!track || !content) return;

    /* Duplicate content for seamless loop */
    const clone = content.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();
```

## Integração
O JS clona automaticamente o conteúdo para criar o loop infinito (a animação translada -50%, exatamente metade — onde o clone começa). O mask-image cria fade nas bordas. Pausar no hover é cortesia UX. Em reduced-motion, o track vira layout estático com wrap. Múltiplos marquees na mesma página com direções opostas criam efeito dinâmico.

## Variações

### Variação 1: Stroke Text (Texto Outline)
Texto em outline com preenchimento no hover. Muito usado em agências.
```css
.im-marquee__item {
  -webkit-text-stroke: 2px var(--im-color);
  color: transparent;
  transition: color 0.3s ease, -webkit-text-stroke-color 0.3s ease;
}
.im-marquee__item:hover {
  -webkit-text-stroke-color: var(--im-hover-color);
  color: var(--im-hover-color);
}
```

### Variação 2: Vertical Marquee (Scroll Vertical)
Itens scrollam verticalmente em vez de horizontalmente.
```css
.im-marquee--vertical {
  height: 200px;
  width: auto;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    to bottom, transparent 0%, black 15%, black 85%, transparent 100%
  );
  mask-image: linear-gradient(
    to bottom, transparent 0%, black 15%, black 85%, transparent 100%
  );
}
.im-marquee--vertical .im-marquee__track {
  flex-direction: column;
  animation-name: im-scroll-vertical;
}
.im-marquee--vertical .im-marquee__content {
  flex-direction: column;
  padding-right: 0;
  padding-bottom: var(--im-gap);
}
@keyframes im-scroll-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}
```

### Variação 3: Speed Variation on Hover
Marquee acelera no hover em vez de pausar. Visual mais energético.
```css
.im-marquee:hover .im-marquee__track {
  animation-play-state: running;
  animation-duration: calc(var(--im-speed) / 3);
}
.im-marquee__track {
  transition: animation-duration 0.5s ease;
}
```
