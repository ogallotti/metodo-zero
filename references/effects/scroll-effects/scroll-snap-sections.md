# Scroll Snap Sections

## Quando usar
Seções full-screen com scroll snap — cada seção "encaixa" na viewport ao scrollar. Ideal para landing pages com poucas seções, apresentações, portfolios, onboarding. Tom controlado e focado. Cada seção recebe atenção total do usuário.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--ss-snap-type` | `y mandatory` | Tipo de snap (mandatory ou proximity) |
| `--ss-transition` | `0.3s` | Transição de conteúdo entre seções |

## Dependências
- CSS `scroll-snap` — nenhuma dependência externa

## HTML

```html
<div class="sns-container" id="scrollSnapContainer">
  <section class="sns-section" style="background: var(--color-bg, #0a0a0a);">
    <div class="sns-section__content">
      <h2 class="sns-section__title">Welcome</h2>
      <p class="sns-section__text">Scroll down to explore each section</p>
    </div>
  </section>
  <section class="sns-section" style="background: #111827;">
    <div class="sns-section__content">
      <h2 class="sns-section__title">Features</h2>
      <p class="sns-section__text">Discover what makes us different</p>
    </div>
  </section>
  <section class="sns-section" style="background: #1e1b4b;">
    <div class="sns-section__content">
      <h2 class="sns-section__title">Results</h2>
      <p class="sns-section__text">Numbers that speak for themselves</p>
    </div>
  </section>
  <section class="sns-section" style="background: #042f2e;">
    <div class="sns-section__content">
      <h2 class="sns-section__title">Get Started</h2>
      <p class="sns-section__text">Join thousands of happy customers</p>
    </div>
  </section>
</div>
```

## CSS

```css
.sns-container {
  --ss-snap-type: y mandatory;

  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: var(--ss-snap-type);
  scroll-behavior: smooth;
}

.sns-section {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sns-section__content {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  max-width: 50rem;
}

.sns-section__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: var(--color-text, #ffffff);
  margin: 0 0 1rem;
  line-height: 1.05;
}

.sns-section__text {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
  margin: 0;
  line-height: 1.5;
}

/* Navigation dots */
.sns-nav {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
}

.sns-nav__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, transform 0.3s;
}

.sns-nav__dot.is-active {
  background: var(--color-primary, #6366f1);
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .sns-container { --ss-snap-type: y proximity; }
  .sns-nav { right: 0.75rem; }
}

@media (prefers-reduced-motion: reduce) {
  .sns-container { scroll-behavior: auto; }
}
```

## JavaScript

```javascript
(function () {
  const container = document.getElementById('scrollSnapContainer');
  if (!container) return;

  const sections = container.querySelectorAll('.sns-section');

  /* Create navigation dots */
  const nav = document.createElement('nav');
  nav.className = 'sns-nav';
  nav.setAttribute('aria-label', 'Section navigation');

  sections.forEach((section, i) => {
    const dot = document.createElement('button');
    dot.className = 'sns-nav__dot';
    dot.setAttribute('aria-label', `Go to section ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });

  document.body.appendChild(nav);
  const dots = nav.querySelectorAll('.sns-nav__dot');

  /* Track active section */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(sections).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
        }
      });
    },
    { root: container, threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
})();
```

## Integração
O container é o scroll parent com `scroll-snap-type`. Cada seção é `scroll-snap-align: start`. A navegação por dots é criada automaticamente via JS. `mandatory` snap força o encaixe, `proximity` é mais permissivo. Em mobile, usar proximity para melhor UX.

## Variações

### Variação 1: Horizontal Snap
Seções snap horizontalmente.
```css
.sns-container { overflow-x: scroll; overflow-y: hidden; scroll-snap-type: x mandatory; display: flex; }
.sns-section { min-width: 100vw; height: 100vh; flex-shrink: 0; scroll-snap-align: start; }
.sns-nav { flex-direction: row; top: auto; bottom: 2rem; right: 50%; transform: translateX(50%); }
```

### Variação 2: Proximity Snap (Suave)
Snap mais gentil — encaixa apenas se estiver perto o suficiente.
```css
.sns-container { --ss-snap-type: y proximity; }
```

### Variação 3: With Progress Bar
Barra de progresso entre seções.
```javascript
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--color-primary,#6366f1);z-index:9999;transition:width 0.3s;';
document.body.appendChild(progressBar);
container.addEventListener('scroll', () => {
  const progress = container.scrollTop / (container.scrollHeight - container.clientHeight);
  progressBar.style.width = (progress * 100) + '%';
}, { passive: true });
```
