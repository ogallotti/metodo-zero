# Biblioteca de Efeitos - Metodo Zero

Efeitos visuais testados e prontos para producao. Cada arquivo contem codigo completo (HTML + CSS + JS) que pode ser copiado e adaptado.

## Como Usar

1. Escolha um efeito da categoria apropriada
2. Leia a secao "Parametros customizaveis" para saber o que adaptar
3. Copie HTML para o index.html, CSS para o style.css, JS para o script.js
4. Substitua variaveis CSS (var(--color-primary), etc.) pelos tokens do design system do projeto
5. Teste no Netlify Dev

## Formato de Cada Efeito

Todo arquivo .md de efeito segue esta estrutura:

```
# [Nome do Efeito]

## Quando usar
[Contexto onde brilha: tipo de conteudo, tom, nicho]

## Parametros customizaveis
[Variaveis que devem ser adaptadas: cores, velocidades, tamanhos]

## Dependencias
[CDN links necessarios, containers especificos]
[Ex: GSAP + ScrollTrigger, Three.js, CSS puro]

## HTML
[Estrutura HTML com classes e IDs]

## CSS
[Estilos completos incluindo responsivo e reduced-motion]

## JavaScript
[Codigo JS completo e funcional]

## Integracao
[Como encaixar na estrutura do Metodo Zero]

## Variacoes
[2-3 variacoes parametricas do mesmo efeito]
```

## Principios

- Todo codigo usa variaveis CSS do projeto (`var(--color-primary)`, etc.), nunca valores hardcoded
- Todo efeito inclui versao mobile responsiva
- Todo efeito respeita `prefers-reduced-motion`
- Efeitos pesados (Three.js, Canvas) usam Dynamic Import + IntersectionObserver
- Cada efeito e independente (combinar multiplos nao causa conflito)
- Variacoes sao parametricas (mudar valores), nao estruturais

## Indice

### Hero Patterns (20)

| Efeito | Deps | Tier |
|-|-|-|
| particle-field | Canvas | 1 |
| gradient-mesh-animated | CSS puro | 1 |
| kinetic-typography | GSAP + SplitText | 1 |
| parallax-depth-hero | GSAP + ScrollTrigger | 1 |
| spotlight-cursor | JS vanilla | 1 |
| 3d-floating-objects | Three.js | 2 |
| aurora-background | CSS + Canvas | 2 |
| split-screen-animated | GSAP | 2 |
| infinite-marquee | CSS + JS | 2 |
| scroll-zoom-reveal | GSAP + ScrollTrigger | 2 |
| noise-distortion | WebGL | 3 |
| liquid-distortion | WebGL | 3 |
| glitch-reveal | CSS + JS | 3 |
| video-masked-text | CSS mask | 3 |
| morphing-shapes | SVG + GSAP | 3 |
| dot-grid-interactive | Canvas | 3 |
| text-scramble-reveal | JS vanilla | 3 |
| 3d-card-stack | CSS 3D + JS | 3 |
| wave-animation | SVG + CSS | 3 |
| counter-cinematic | GSAP + ScrollTrigger | 3 |

### Scroll Effects (15)

| Efeito | Deps | Tier |
|-|-|-|
| pin-and-reveal | GSAP + ScrollTrigger | 1 |
| parallax-layers | GSAP + ScrollTrigger | 1 |
| text-highlight-on-scroll | CSS scroll-timeline / GSAP | 1 |
| stagger-grid-reveal | GSAP + ScrollTrigger | 1 |
| scroll-progress-indicator | CSS scroll-timeline | 1 |
| horizontal-scroll-section | GSAP + ScrollTrigger | 2 |
| sticky-cards-stack | GSAP + ScrollTrigger | 2 |
| color-shift-sections | CSS scroll-timeline / GSAP | 2 |
| number-counter-scroll | IntersectionObserver + JS | 2 |
| image-sequence-scrub | Canvas + ScrollTrigger | 3 |
| draw-svg-on-scroll | GSAP / CSS | 3 |
| clip-path-reveal | CSS scroll-timeline | 3 |
| scale-on-scroll | GSAP + ScrollTrigger | 3 |
| scroll-snap-sections | CSS scroll-snap | 3 |
| before-after-slider | JS vanilla | 3 |

### Transitions (10)

| Efeito | Deps | Tier |
|-|-|-|
| section-clip-path | CSS + GSAP | 1 |
| wave-divider-animated | SVG + CSS | 1 |
| diagonal-reveal | CSS clip-path + scroll | 2 |
| curtain-reveal | GSAP + ScrollTrigger | 2 |
| overlap-slide | GSAP + ScrollTrigger | 2 |
| color-wipe | CSS + GSAP | 3 |
| morph-between-sections | SVG + GSAP | 3 |
| gradient-blend | CSS | 3 |
| skew-transition | CSS transform + scroll | 3 |
| zoom-through | GSAP + ScrollTrigger | 3 |

### Micro-interactions (10)

| Efeito | Deps | Tier |
|-|-|-|
| magnetic-button | JS vanilla | 1 |
| hover-card-3d-tilt | JS vanilla | 1 |
| custom-cursor-trail | JS vanilla | 1 |
| text-hover-reveal | CSS + JS | 2 |
| link-underline-animated | CSS puro | 2 |
| accordion-smooth | CSS + JS | 2 |
| button-ripple | CSS + JS | 3 |
| image-hover-parallax | JS vanilla | 3 |
| tooltip-animated | CSS + JS | 3 |
| form-input-animated | CSS puro | 3 |
