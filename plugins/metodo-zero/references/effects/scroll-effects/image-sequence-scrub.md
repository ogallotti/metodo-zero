# Image Sequence Scrub

## Quando usar
Sequência de imagens que avança frame-by-frame conforme o scroll — tipo Apple AirPods Pro page. Ideal para product reveals, storytelling visual, demos, behind-the-scenes. Tom premium e cinematográfico. O scroll controla o "vídeo".

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--is-frame-count` | `60` | Número total de frames (via JS) |
| `--is-src-pattern` | `assets/seq/frame-{n}.webp` | Pattern de URL dos frames (via JS) |
| `--is-scroll-height` | `300vh` | Distância de scroll para toda a sequência |

## Dependências
- Canvas + GSAP ScrollTrigger
- GSAP 3.12+ — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- ScrollTrigger — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`

## HTML

```html
<section class="is-section" id="imageSequenceSection">
  <canvas class="is-section__canvas" id="isCanvas"></canvas>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

## CSS

```css
.is-section {
  position: relative;
  height: 300vh;
  background: var(--color-bg, #0a0a0a);
}

.is-section__canvas {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .is-section { height: 100vh; }
}
```

## JavaScript

```javascript
(function () {
  const section = document.getElementById('imageSequenceSection');
  const canvas = document.getElementById('isCanvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config = {
    frameCount: 60,
    srcPattern: (i) => `assets/seq/frame-${String(i).padStart(4, '0')}.webp`,
  };

  const images = [];
  let loadedCount = 0;
  let currentFrame = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    drawFrame(currentFrame);
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  }

  function preloadImages() {
    for (let i = 0; i < config.frameCount; i++) {
      const img = new Image();
      img.src = config.srcPattern(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) drawFrame(0);
      };
      images[i] = img;
    }
  }

  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return cb();
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        clearInterval(check);
        cb();
      }
    }, 50);
  }

  resize();
  preloadImages();
  window.addEventListener('resize', resize);

  if (reducedMotion) {
    drawFrame(Math.floor(config.frameCount / 2));
    return;
  }

  waitForGSAP(function () {
    gsap.registerPlugin(ScrollTrigger);

    const obj = { frame: 0 };
    gsap.to(obj, {
      frame: config.frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
      onUpdate: () => {
        currentFrame = Math.round(obj.frame);
        drawFrame(currentFrame);
      },
    });
  });
})();
```

## Integração
Requer pré-preparar sequência de imagens (ex: exportar vídeo como frames). Imagens devem ser optimizadas (WebP, resolução adequada). O Canvas faz cover-fit automático. `snap: 'frame'` garante que cada frame é exibido nitidamente. Em reduced-motion, mostra frame do meio.

## Variações

### Variação 1: With Text Overlay
Texto que aparece em frames específicos.
```html
<div class="is-section__overlay" id="isOverlay">
  <p class="is-section__caption" data-is-frame-start="10" data-is-frame-end="25">Step 1: Design</p>
  <p class="is-section__caption" data-is-frame-start="30" data-is-frame-end="50">Step 2: Build</p>
</div>
```
```css
.is-section__overlay { position:sticky;top:0;height:100vh;z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center; }
.is-section__caption { position:absolute;font-size:clamp(1.5rem,4vw,3rem);color:#fff;font-weight:700;opacity:0;transition:opacity 0.3s; }
.is-section__caption.is-visible { opacity:1; }
```

### Variação 2: Video Scrub (Instead of Images)
Usar vídeo real em vez de sequência de imagens.
```html
<video class="is-section__video" id="isVideo" src="assets/hero-scrub.mp4" muted playsinline preload="auto"></video>
```
```javascript
const video = document.getElementById('isVideo');
gsap.to(video, {
  currentTime: video.duration,
  ease: 'none',
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true },
});
```

### Variação 3: Lazy Loading Frames
Carregar frames sob demanda (para sequências muito grandes).
```javascript
function loadFrame(index) {
  if (images[index]) return;
  const img = new Image();
  img.src = config.srcPattern(index);
  images[index] = img;
}
// No onUpdate, pre-load próximos frames:
onUpdate: () => {
  currentFrame = Math.round(obj.frame);
  loadFrame(currentFrame);
  loadFrame(Math.min(currentFrame + 5, config.frameCount - 1));
  drawFrame(currentFrame);
}
```
