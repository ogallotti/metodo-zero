# Video Masked Text

## Quando usar
Texto grande que serve como máscara para um vídeo ou imagem de fundo — o conteúdo visual aparece dentro das letras. Ideal para hero sections de agências criativas, produtoras, marcas bold, entretenimento. Tom cinematográfico e impactante. O texto se torna o visual.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--vm-bg` | `#0a0a0a` | Cor de fundo (visível ao redor do texto) |
| `--vm-font-size` | `clamp(4rem, 15vw, 12rem)` | Tamanho do texto-máscara |
| `--vm-font-weight` | `900` | Peso do texto |
| `--vm-line-height` | `0.9` | Altura de linha |

## Dependências
- CSS `background-clip: text` — nenhuma dependência externa

## HTML

```html
<section class="vm-hero" id="videoMaskedHero">
  <div class="vm-hero__mask-container">
    <video class="vm-hero__video" autoplay muted loop playsinline preload="metadata">
      <source src="assets/hero-video.mp4" type="video/mp4" />
    </video>
    <div class="vm-hero__text-mask" aria-hidden="true">
      <span class="vm-hero__masked-text">BOLD</span>
    </div>
    <h1 class="vm-hero__sr-title">Bold Creative Agency</h1>
  </div>
  <div class="vm-hero__below">
    <p class="vm-hero__subtitle">Where vision meets execution</p>
    <a href="#" class="vm-hero__cta">View Our Work</a>
  </div>
</section>
```

## CSS

```css
.vm-hero {
  --vm-bg: var(--color-bg, #0a0a0a);
  --vm-font-size: clamp(4rem, 15vw, 12rem);
  --vm-font-weight: 900;
  --vm-line-height: 0.9;

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--vm-bg);
}

.vm-hero__mask-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vm-hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.vm-hero__text-mask {
  position: relative;
  z-index: 2;
  mix-blend-mode: screen;
  background: var(--vm-bg);
  width: 100%;
  text-align: center;
  padding: clamp(2rem, 5vw, 4rem) 0;
}

.vm-hero__masked-text {
  font-size: var(--vm-font-size);
  font-weight: var(--vm-font-weight);
  line-height: var(--vm-line-height);
  color: var(--vm-bg);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  display: block;
  /* Alternative method using background-clip */
  background: transparent;
  -webkit-text-stroke: 0;
}

/* Screen readers: texto real acessível */
.vm-hero__sr-title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.vm-hero__below {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: clamp(1.5rem, 3vw, 2rem);
}

.vm-hero__subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0 0 1.5rem;
  font-weight: 300;
}

.vm-hero__cta {
  display: inline-block;
  padding: 0.875rem 2.5rem;
  border: 1px solid var(--color-text, #ffffff);
  color: var(--color-text, #ffffff);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;
}

.vm-hero__cta:hover {
  background: var(--color-text, #ffffff);
  color: var(--vm-bg);
}

@media (max-width: 768px) {
  .vm-hero {
    --vm-font-size: clamp(3rem, 20vw, 6rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vm-hero__video {
    display: none;
  }
  .vm-hero__text-mask {
    mix-blend-mode: normal;
    background: transparent;
  }
  .vm-hero__masked-text {
    color: var(--color-text, #ffffff);
  }
}
```

## JavaScript

```javascript
/* Efeito é primariamente CSS (mix-blend-mode: screen).
   JS apenas para lazy-load do vídeo via IntersectionObserver. */
(function () {
  const hero = document.getElementById('videoMaskedHero');
  const video = hero?.querySelector('.vm-hero__video');
  if (!hero || !video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, { threshold: 0.1 });

  observer.observe(hero);
})();
```

## Integração
O truque é `mix-blend-mode: screen` sobre fundo escuro — o texto (mesma cor do fundo) fica transparente e revela o vídeo. O fundo do `.vm-hero__text-mask` DEVE ser a mesma cor do `--vm-bg`. Funciona com vídeo ou imagem. Um `<h1>` oculto garante acessibilidade. Em reduced-motion, mostra texto normal sem vídeo.

## Variações

### Variação 1: Image Instead of Video
Usar imagem estática com parallax sutil em vez de vídeo.
```html
<!-- Substituir <video> por: -->
<img src="assets/hero-bg.webp" alt="" class="vm-hero__video" loading="eager" />
```

### Variação 2: Multi-Line Text Mask
Múltiplas linhas de texto como máscara.
```html
<div class="vm-hero__masked-text">
  <span style="display:block">WE</span>
  <span style="display:block">CREATE</span>
  <span style="display:block">BOLD</span>
</div>
```
```css
.vm-hero { --vm-font-size: clamp(3rem, 12vw, 8rem); --vm-line-height: 0.95; }
```

### Variação 3: Outlined Text (Stroke Only)
Texto em outline, vídeo visível pela página inteira, texto como moldura.
```css
.vm-hero__text-mask {
  mix-blend-mode: normal;
  background: transparent;
  position: relative;
  z-index: 2;
}
.vm-hero__masked-text {
  color: transparent;
  -webkit-text-stroke: 2px var(--color-text, #ffffff);
}
```
