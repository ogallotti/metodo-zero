# Before/After Slider

## Quando usar
Slider interativo para comparar duas imagens (antes/depois) com um handle arrastável. Ideal para redesigns, reformas, tratamentos, edição de fotos, comparações de produto. Tom funcional e convincente. Prova visual direta.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ba-handle-color` | `#ffffff` | Cor do handle central |
| `--ba-handle-width` | `3px` | Largura da linha do handle |
| `--ba-radius` | `0.75rem` | Border radius do container |
| `--ba-initial` | `50` | Posição inicial do slider (%) |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<div class="ba-slider" id="beforeAfterSlider" data-ba-initial="50">
  <div class="ba-slider__before">
    <img src="assets/before.webp" alt="Before" loading="lazy" />
    <span class="ba-slider__label ba-slider__label--before">Before</span>
  </div>
  <div class="ba-slider__after">
    <img src="assets/after.webp" alt="After" loading="lazy" />
    <span class="ba-slider__label ba-slider__label--after">After</span>
  </div>
  <div class="ba-slider__handle" id="baHandle" role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Comparison slider" tabindex="0">
    <div class="ba-slider__handle-line"></div>
    <div class="ba-slider__handle-knob">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="8,4 4,12 8,20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <polyline points="16,4 20,12 16,20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</div>
```

## CSS

```css
.ba-slider {
  --ba-handle-color: #ffffff;
  --ba-handle-width: 3px;
  --ba-radius: 0.75rem;
  --ba-position: 50%;

  position: relative;
  width: min(90%, 50rem);
  margin: 0 auto;
  overflow: hidden;
  border-radius: var(--ba-radius);
  cursor: col-resize;
  user-select: none;
  -webkit-user-select: none;
}

.ba-slider__before,
.ba-slider__after {
  position: relative;
}

.ba-slider__after {
  position: absolute;
  inset: 0;
  clip-path: inset(0 0 0 var(--ba-position));
}

.ba-slider__before img,
.ba-slider__after img {
  width: 100%;
  display: block;
  aspect-ratio: 16/10;
  object-fit: cover;
}

.ba-slider__label {
  position: absolute;
  bottom: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0.25rem;
}

.ba-slider__label--before { left: 1rem; }
.ba-slider__label--after { right: 1rem; }

.ba-slider__handle {
  position: absolute;
  top: 0;
  left: var(--ba-position);
  transform: translateX(-50%);
  width: var(--ba-handle-width);
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ba-slider__handle-line {
  position: absolute;
  width: var(--ba-handle-width);
  height: 100%;
  background: var(--ba-handle-color);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.ba-slider__handle-knob {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--ba-handle-color);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.ba-slider__handle:focus {
  outline: none;
}

.ba-slider__handle:focus-visible .ba-slider__handle-knob {
  box-shadow: 0 0 0 3px var(--color-primary, #6366f1), 0 2px 8px rgba(0, 0, 0, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .ba-slider__handle { transition: none; }
}
```

## JavaScript

```javascript
(function () {
  const slider = document.getElementById('beforeAfterSlider');
  const handle = document.getElementById('baHandle');
  if (!slider || !handle) return;

  const initial = parseInt(slider.dataset.baInitial) || 50;
  let isDragging = false;

  function setPosition(percent) {
    const clamped = Math.min(100, Math.max(0, percent));
    slider.style.setProperty('--ba-position', clamped + '%');
    handle.setAttribute('aria-valuenow', Math.round(clamped));
  }

  function getPercent(clientX) {
    const rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  setPosition(initial);

  /* Mouse events */
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(getPercent(e.clientX));
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition(getPercent(e.clientX));
  });

  document.addEventListener('mouseup', () => { isDragging = false; });

  /* Touch events */
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: false });

  document.addEventListener('touchend', () => { isDragging = false; });

  /* Keyboard support */
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(slider.style.getPropertyValue('--ba-position')) || 50;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(current - 2); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(current + 2); }
  });
})();
```

## Integração
Ambas as imagens devem ter o mesmo aspect ratio e dimensões. A imagem "before" é a base, "after" fica por cima com clip-path. O handle é acessível via teclado (Arrow keys). Touch funciona em mobile. Zero dependências.

## Variações

### Variação 1: Vertical Slider
Comparação vertical (cima/baixo).
```css
.ba-slider { cursor: row-resize; }
.ba-slider__after { clip-path: inset(var(--ba-position) 0 0 0); }
.ba-slider__handle {
  top: var(--ba-position);
  left: 0;
  width: 100%;
  height: var(--ba-handle-width);
  transform: translateY(-50%);
  flex-direction: row;
}
.ba-slider__handle-line { width: 100%; height: var(--ba-handle-width); }
```

### Variação 2: Auto-Play (Animate on Load)
Slider anima automaticamente de 0 a 100 e volta.
```javascript
let direction = 1;
let pos = 0;
function autoPlay() {
  pos += direction * 0.3;
  if (pos >= 100 || pos <= 0) direction *= -1;
  setPosition(pos);
  requestAnimationFrame(autoPlay);
}
autoPlay();
// Parar auto-play ao interagir:
slider.addEventListener('mousedown', () => { autoPlay = () => {}; });
```

### Variação 3: Hover Reveal (Sem Handle)
A posição segue o mouse sem handle visível.
```css
.ba-slider__handle { display: none; }
.ba-slider { cursor: crosshair; }
```
```javascript
slider.addEventListener('mousemove', (e) => {
  setPosition(getPercent(e.clientX));
}, { passive: true });
```
