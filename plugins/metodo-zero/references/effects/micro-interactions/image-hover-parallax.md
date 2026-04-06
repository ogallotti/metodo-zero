# Image Hover Parallax

## Quando usar
Imagem que se move sutilmente na direção oposta ao cursor ao fazer hover, criando um efeito de profundidade parallax. Ideal para galerias, cards de produto, portfolios, hero images, thumbnails. Tom sofisticado e imersivo. Convida à exploração e dá profundidade a imagens estáticas.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ihp-intensity` | `20` | Intensidade do deslocamento (px) |
| `--ihp-scale` | `1.1` | Escala da imagem no hover |
| `--ihp-duration` | `0.4s` | Duração da transição |
| `--ihp-radius` | `0.75rem` | Border-radius do container |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<div class="ihp-grid">
  <div class="ihp-card" data-ihp>
    <div class="ihp-card__media">
      <img src="assets/project-1.webp" alt="Project 1" class="ihp-card__img" loading="lazy" />
    </div>
    <h3 class="ihp-card__title">Alpine Vista</h3>
  </div>

  <div class="ihp-card" data-ihp>
    <div class="ihp-card__media">
      <img src="assets/project-2.webp" alt="Project 2" class="ihp-card__img" loading="lazy" />
    </div>
    <h3 class="ihp-card__title">Ocean Depths</h3>
  </div>

  <div class="ihp-card" data-ihp>
    <div class="ihp-card__media">
      <img src="assets/project-3.webp" alt="Project 3" class="ihp-card__img" loading="lazy" />
    </div>
    <h3 class="ihp-card__title">Urban Light</h3>
  </div>
</div>
```

## CSS

```css
.ihp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  width: min(90%, 72rem);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) 0;
}

.ihp-card {
  --ihp-scale: 1.1;
  --ihp-duration: 0.4s;
  --ihp-radius: 0.75rem;

  position: relative;
}

.ihp-card__media {
  overflow: hidden;
  border-radius: var(--ihp-radius);
  position: relative;
}

.ihp-card__img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  display: block;
  transform: scale(var(--ihp-scale));
  transition: transform var(--ihp-duration) ease-out;
  will-change: transform;
}

.ihp-card__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  color: var(--color-text, #ffffff);
}

@media (hover: none) {
  .ihp-card__img { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .ihp-card__img {
    transform: scale(1) !important;
    transition: none !important;
  }
}
```

## JavaScript

```javascript
(function () {
  const cards = document.querySelectorAll('[data-ihp]');
  if (!cards.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  /* No hover on touch devices */
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach((card) => {
    const img = card.querySelector('.ihp-card__img');
    if (!img) return;

    const intensity = parseInt(card.dataset.ihpIntensity) || 20;
    const scale = parseFloat(card.dataset.ihpScale) || 1.1;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      /* Move opposite to cursor for parallax depth */
      const tx = -x * intensity;
      const ty = -y * intensity;

      img.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = `scale(${scale}) translate(0, 0)`;
    });
  });
})();
```

## Integração
Adicione `data-ihp` a qualquer container. O JS detecta a posição do cursor e desloca a imagem na direção oposta. A imagem é escalada (1.1x) para ter margem de deslocamento sem mostrar bordas. `overflow: hidden` no container corta o excesso. Touch devices são ignorados.

## Variações

### Variação 1: Lerp Smooth Movement
Movimento suavizado com interpolação linear (lerp).
```javascript
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
let rafId;

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  targetX = -((e.clientX - rect.left) / rect.width - 0.5) * intensity;
  targetY = -((e.clientY - rect.top) / rect.height - 0.5) * intensity;
  if (!rafId) animate();
});

function animate() {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;
  img.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
  if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
    rafId = requestAnimationFrame(animate);
  } else { rafId = null; }
}

card.addEventListener('mouseleave', () => {
  targetX = 0; targetY = 0;
  if (!rafId) animate();
});
```

### Variação 2: Multi-Layer Parallax
Múltiplas layers com velocidades diferentes.
```html
<div class="ihp-card" data-ihp>
  <div class="ihp-card__media">
    <img src="assets/bg.webp" class="ihp-card__img ihp-card__img--bg" data-ihp-speed="0.5" />
    <img src="assets/fg.webp" class="ihp-card__img ihp-card__img--fg" data-ihp-speed="1.5" />
  </div>
</div>
```
```javascript
const layers = card.querySelectorAll('[data-ihp-speed]');
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  layers.forEach(layer => {
    const speed = parseFloat(layer.dataset.ihpSpeed) || 1;
    layer.style.transform = `scale(${scale}) translate(${-x * intensity * speed}px, ${-y * intensity * speed}px)`;
  });
});
```

### Variação 3: Tilt + Parallax Combo
Combina tilt 3D do container com parallax da imagem.
```javascript
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  img.style.transform = `scale(${scale}) translate(${-x * intensity}px, ${-y * intensity}px)`;
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  img.style.transform = `scale(${scale}) translate(0, 0)`;
});
```
