# 3D Card Stack

## Quando usar
Stack de cards em perspectiva 3D que rotacionam/organizam ao scroll ou hover. Ideal para features, portfolio, pricing, app screenshots. Tom moderno e interativo. Cria profundidade visual com CSS 3D transforms.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--cs-perspective` | `1200px` | Perspectiva 3D |
| `--cs-card-width` | `300px` | Largura dos cards |
| `--cs-card-height` | `400px` | Altura dos cards |
| `--cs-rotation` | `25deg` | Rotação base dos cards |
| `--cs-gap` | `-60px` | Sobreposição entre cards |

## Dependências
- CSS 3D + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<section class="cs-hero" id="cardStackHero">
  <div class="cs-hero__content">
    <h1 class="cs-hero__title">Everything You Need</h1>
    <p class="cs-hero__subtitle">Three powerful tools, one platform</p>
  </div>
  <div class="cs-hero__stack" id="csStack">
    <div class="cs-hero__card" style="--card-accent: #6366f1;">
      <h3 class="cs-hero__card-title">Design</h3>
      <p class="cs-hero__card-text">Create stunning interfaces with our visual editor.</p>
    </div>
    <div class="cs-hero__card" style="--card-accent: #ec4899;">
      <h3 class="cs-hero__card-title">Develop</h3>
      <p class="cs-hero__card-text">Ship production code with built-in best practices.</p>
    </div>
    <div class="cs-hero__card" style="--card-accent: #06b6d4;">
      <h3 class="cs-hero__card-title">Deploy</h3>
      <p class="cs-hero__card-text">One-click deployment to any platform worldwide.</p>
    </div>
  </div>
</section>
```

## CSS

```css
.cs-hero {
  --cs-perspective: 1200px;
  --cs-card-width: clamp(250px, 30vw, 320px);
  --cs-card-height: clamp(300px, 40vw, 420px);

  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(2rem, 4vw, 4rem);
  background: var(--color-bg, #0a0a0a);
  padding: clamp(2rem, 5vw, 4rem);
}

.cs-hero__content {
  text-align: center;
  max-width: 40rem;
}

.cs-hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.cs-hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  margin: 0;
}

.cs-hero__stack {
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: var(--cs-perspective);
  gap: -60px;
}

.cs-hero__card {
  width: var(--cs-card-width);
  height: var(--cs-card-height);
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: clamp(1.5rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  margin: 0 -30px;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.5s ease;
  cursor: default;
  border-top: 3px solid var(--card-accent, var(--color-primary));
}

.cs-hero__card:nth-child(1) { transform: rotateY(-15deg) translateZ(-30px); z-index: 1; }
.cs-hero__card:nth-child(2) { transform: rotateY(0deg) translateZ(0px); z-index: 3; }
.cs-hero__card:nth-child(3) { transform: rotateY(15deg) translateZ(-30px); z-index: 1; }

.cs-hero__card:hover {
  transform: rotateY(0deg) translateZ(40px) scale(1.05);
  z-index: 10;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.cs-hero__card-title {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 700;
  color: var(--color-text, #ffffff);
  margin: 0 0 0.5rem;
}

.cs-hero__card-text {
  font-size: clamp(0.875rem, 1.3vw, 1rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .cs-hero__stack { flex-direction: column; perspective: none; gap: 1rem; }
  .cs-hero__card {
    margin: 0;
    transform: none !important;
    height: auto;
  }
  .cs-hero__card:hover { transform: scale(1.02) !important; }
}

@media (prefers-reduced-motion: reduce) {
  .cs-hero__card { transition: none; }
}
```

## JavaScript

```javascript
(function () {
  const stack = document.getElementById('csStack');
  if (!stack) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || window.innerWidth < 768) return;

  const cards = stack.querySelectorAll('.cs-hero__card');

  /* Subtle mouse-follow rotation on the entire stack */
  stack.addEventListener('mousemove', (e) => {
    const rect = stack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stack.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
  }, { passive: true });

  stack.addEventListener('mouseleave', () => {
    stack.style.transition = 'transform 0.5s ease';
    stack.style.transform = '';
    setTimeout(() => { stack.style.transition = ''; }, 500);
  });
})();
```

## Integração
Os cards usam CSS 3D transforms para perspectiva. O JS adiciona rotação sutil do stack inteiro seguindo o mouse. Em mobile, vira layout vertical sem 3D. Cada card tem `--card-accent` para personalizar a cor da borda superior.

## Variações

### Variação 1: Fan Layout (Leque)
Cards dispostos em leque como cartas de baralho.
```css
.cs-hero__card:nth-child(1) { transform: rotate(-10deg) translateX(-40px); z-index: 1; }
.cs-hero__card:nth-child(2) { transform: rotate(0deg); z-index: 2; }
.cs-hero__card:nth-child(3) { transform: rotate(10deg) translateX(40px); z-index: 1; }
.cs-hero__card:hover { transform: rotate(0deg) translateY(-20px) scale(1.05); }
```

### Variação 2: Vertical Stack (Empilhados)
Cards empilhados verticalmente com offset.
```css
.cs-hero__stack { flex-direction: column; gap: 0; perspective: none; }
.cs-hero__card { margin: -20px 0; }
.cs-hero__card:nth-child(1) { transform: scale(0.92); z-index: 1; }
.cs-hero__card:nth-child(2) { transform: scale(0.96); z-index: 2; }
.cs-hero__card:nth-child(3) { transform: scale(1); z-index: 3; }
```

### Variação 3: Screenshot Cards (Com Imagens)
Cards com screenshots de produto.
```html
<div class="cs-hero__card" style="--card-accent:#6366f1; padding: 0; overflow: hidden;">
  <img src="assets/screenshot-1.webp" alt="Design tool" style="width:100%;height:70%;object-fit:cover;" />
  <div style="padding: 1.25rem;">
    <h3 class="cs-hero__card-title">Design</h3>
    <p class="cs-hero__card-text">Visual editor</p>
  </div>
</div>
```
