# Spotlight Cursor

## Quando usar
Efeito de "lanterna" que segue o cursor, revelando conteúdo escondido ou iluminando áreas da hero section. Ideal para landing pages de mystery, gaming, produtos premium, eventos. Tom intrigante e interativo. Convida exploração.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--sc-spotlight-size` | `250px` | Diâmetro do spotlight |
| `--sc-spotlight-color` | `rgba(255,255,255,0.15)` | Cor/brilho do spotlight |
| `--sc-bg` | `#0a0a0a` | Cor de fundo |
| `--sc-overlay-opacity` | `0.85` | Opacidade da camada escura |
| `--sc-blur` | `40px` | Blur nas bordas do spotlight |
| `--sc-transition-speed` | `0.15s` | Suavização do movimento |

## Dependências
- JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<section class="sc-hero" id="spotlightHero">
  <div class="sc-hero__bg">
    <img src="assets/hero-bg.webp" alt="" class="sc-hero__bg-img" loading="eager" />
  </div>
  <div class="sc-hero__spotlight" id="spotlightOverlay" aria-hidden="true"></div>
  <div class="sc-hero__content">
    <h1 class="sc-hero__title">Discover What's Hidden</h1>
    <p class="sc-hero__subtitle">Move your cursor to explore</p>
    <a href="#" class="sc-hero__cta">Reveal More</a>
  </div>
</section>
```

## CSS

```css
.sc-hero {
  --sc-spotlight-size: 250px;
  --sc-spotlight-color: rgba(255, 255, 255, 0.15);
  --sc-bg: var(--color-bg, #0a0a0a);
  --sc-overlay-opacity: 0.85;
  --sc-blur: 40px;
  --sc-transition-speed: 0.15s;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--sc-bg);
  cursor: none;
}

.sc-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.sc-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sc-hero__spotlight {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--sc-bg);
  opacity: var(--sc-overlay-opacity);
  transition: mask-position var(--sc-transition-speed) ease-out,
              -webkit-mask-position var(--sc-transition-speed) ease-out;
  -webkit-mask-image: radial-gradient(
    circle var(--sc-spotlight-size) at var(--sc-x, 50%) var(--sc-y, 50%),
    transparent 0%,
    transparent 40%,
    black 100%
  );
  mask-image: radial-gradient(
    circle var(--sc-spotlight-size) at var(--sc-x, 50%) var(--sc-y, 50%),
    transparent 0%,
    transparent 40%,
    black 100%
  );
  pointer-events: none;
}

.sc-hero__content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.sc-hero__title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.sc-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 2rem;
  line-height: 1.5;
}

.sc-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-primary, #6366f1);
  color: var(--color-bg, #0a0a0a);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sc-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .sc-hero {
    --sc-spotlight-size: 150px;
    cursor: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sc-hero {
    --sc-transition-speed: 0s;
    cursor: auto;
  }
  .sc-hero__spotlight {
    opacity: 0.4;
    -webkit-mask-image: none;
    mask-image: none;
  }
}
```

## JavaScript

```javascript
(function () {
  const hero = document.getElementById('spotlightHero');
  const overlay = document.getElementById('spotlightOverlay');
  if (!hero || !overlay) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let rafId = null;
  let targetX = 50;
  let targetY = 50;
  let currentX = 50;
  let currentY = 50;
  const lerp = 0.12;

  function updateSpotlight() {
    currentX += (targetX - currentX) * lerp;
    currentY += (targetY - currentY) * lerp;
    overlay.style.setProperty('--sc-x', currentX + '%');
    overlay.style.setProperty('--sc-y', currentY + '%');

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      rafId = requestAnimationFrame(updateSpotlight);
    } else {
      rafId = null;
    }
  }

  hero.addEventListener(
    'mousemove',
    (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
    },
    { passive: true }
  );

  hero.addEventListener('mouseleave', () => {
    targetX = 50;
    targetY = 50;
    if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
  }, { passive: true });

  /* Mobile: touch support */
  hero.addEventListener(
    'touchmove',
    (e) => {
      const touch = e.touches[0];
      const rect = hero.getBoundingClientRect();
      targetX = ((touch.clientX - rect.left) / rect.width) * 100;
      targetY = ((touch.clientY - rect.top) / rect.height) * 100;
      if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
    },
    { passive: true }
  );

  /* IntersectionObserver para pausar quando off-screen */
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(hero);
})();
```

## Integração
A imagem de fundo (`hero-bg.webp`) é revelada pelo spotlight. Sem a imagem, o efeito funciona revelando qualquer conteúdo atrás do overlay. O spotlight usa CSS `mask-image` — suportado em todos os browsers modernos. No mobile, funciona com touch. Em reduced-motion, o overlay fica semi-transparente sem o efeito de spotlight.

## Variações

### Variação 1: Multi-Spotlight (Vários Pontos de Luz)
Spotlight principal + 2 pontos fixos de luz adicional.
```css
.sc-hero__spotlight {
  -webkit-mask-image:
    radial-gradient(
      circle var(--sc-spotlight-size) at var(--sc-x, 50%) var(--sc-y, 50%),
      transparent 0%, transparent 40%, black 100%
    ),
    radial-gradient(circle 100px at 20% 30%, transparent 0%, transparent 50%, black 100%),
    radial-gradient(circle 80px at 80% 70%, transparent 0%, transparent 50%, black 100%);
  mask-image:
    radial-gradient(
      circle var(--sc-spotlight-size) at var(--sc-x, 50%) var(--sc-y, 50%),
      transparent 0%, transparent 40%, black 100%
    ),
    radial-gradient(circle 100px at 20% 30%, transparent 0%, transparent 50%, black 100%),
    radial-gradient(circle 80px at 80% 70%, transparent 0%, transparent 50%, black 100%);
  -webkit-mask-composite: intersect;
  mask-composite: intersect;
}
```

### Variação 2: Color Spotlight (Spotlight Colorido)
Em vez de revelar imagem, o spotlight emite cor sobre fundo escuro.
```css
/* Remover .sc-hero__bg e usar: */
.sc-hero__spotlight {
  background: radial-gradient(
    circle var(--sc-spotlight-size) at var(--sc-x, 50%) var(--sc-y, 50%),
    var(--color-primary, #6366f1) 0%,
    transparent 70%
  );
  opacity: 0.6;
  -webkit-mask-image: none;
  mask-image: none;
  mix-blend-mode: screen;
}
```

### Variação 3: Text Reveal (Texto Revelado pelo Spotlight)
O spotlight revela texto escondido em vez de uma imagem. Efeito de "easter egg".
```html
<!-- Adicionar camada de texto escondido -->
<div class="sc-hero__hidden-text" aria-hidden="true">
  <span style="position:absolute;top:20%;left:10%;font-size:clamp(1rem,3vw,2rem);color:rgba(255,255,255,0.4);">Secret message 1</span>
  <span style="position:absolute;top:60%;right:15%;font-size:clamp(1rem,2vw,1.5rem);color:rgba(255,255,255,0.3);">Hidden detail</span>
  <span style="position:absolute;bottom:25%;left:40%;font-size:clamp(0.8rem,2vw,1.2rem);color:rgba(255,255,255,0.2);">Easter egg</span>
</div>
```
```css
.sc-hero__hidden-text {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
```
