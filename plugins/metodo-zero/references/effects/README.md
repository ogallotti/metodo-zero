# Effects Library — Método Zero

Biblioteca de 117 efeitos visuais interativos para landing pages. Código 100% original em vanilla JS/CSS, com suporte a GSAP, Three.js e Lenis quando necessário.

## Estrutura

```
effects/
  _playground/          ← Storybook interativo
  backgrounds/          ← 16 efeitos (aurora, particles, gradient-mesh, etc.)
  text-effects/         ← 16 efeitos (typewriter, scramble, split, etc.)
  cards/                ← 11 efeitos (3d-tilt, spotlight, glass, etc.)
  buttons/              ← 8 efeitos (magnetic, ripple, shimmer, etc.)
  borders/              ← 8 efeitos (beam, trail, glow, etc.)
  scroll/               ← 14 efeitos (parallax, pin-reveal, horizontal, etc.)
  transitions/          ← 6 efeitos (clip-path, wave, curtain, etc.)
  decorative/           ← 9 efeitos (cursor-trail, sparkles, meteors, etc.)
  media/                ← 8 efeitos (comparison, lens, parallax, etc.)
  layout/               ← 7 efeitos (bento-grid, masonry, marquee, etc.)
  components/           ← 14 efeitos (carousel, accordion, tabs, etc.)
```

## Cada efeito contém

| Arquivo | Função |
|-|-|
| `demo.html` | Preview executável — abre no browser |
| `style.css` | CSS real do efeito |
| `script.js` | JS real (IIFE, zero globals) |
| `meta.json` | Parâmetros, tags, dependências |
| `README.md` | Quando usar, integração, variações |

## Como a IA usa

1. **Escolher:** consultar `meta.json` (tags, categoria, descrição) para encontrar o efeito certo
2. **Ler:** `script.js` + `style.css` + markup do `demo.html`
3. **Copiar literalmente** para o projeto, adaptando apenas CSS vars ao design system
4. **Nunca simplificar** — se o JS do projeto tem <70% das linhas do original, recopiar

## Playground

Abrir `_playground/index.html` no navegador para:
- Navegar todos os efeitos por categoria
- Ver preview ao vivo de cada efeito
- Ajustar parâmetros (cores, velocidade, tamanho)
- Copiar prompt formatado para o chat da IA

## Padrões de qualidade

- `prefers-reduced-motion` em todos os efeitos
- `IntersectionObserver` para pausar fora da viewport
- `requestAnimationFrame` (nunca setInterval)
- Canvas com DPR awareness
- CSS custom properties para personalização
- Responsivo mobile-first
