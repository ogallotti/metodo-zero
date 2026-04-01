# Guia de Design System

Como gerar design systems completos para landing pages. Define o que DEVE ser criado pela skill `gerar-design` antes de qualquer implementacao visual.

Um design system completo e o que separa uma pagina com "cara de IA" de uma pagina com identidade propria. Sem ele, cada secao toma decisoes visuais isoladas e o resultado e incoerente.

---

## Escala Tipografica

Definir TODOS os niveis com sizes mobile e desktop usando `clamp()`:

| Token | Uso | Exemplo clamp |
|-|-|-|
| `--text-display` | Hero headline, impacto maximo | `clamp(3rem, 6vw, 5rem)` |
| `--text-h1` | Titulos de secao principais | `clamp(2.5rem, 5vw, 4rem)` |
| `--text-h2` | Subtitulos de secao | `clamp(2rem, 4vw, 3rem)` |
| `--text-h3` | Subsecoes, card titles | `clamp(1.5rem, 3vw, 2rem)` |
| `--text-h4` | Subheadings menores | `clamp(1.25rem, 2vw, 1.5rem)` |
| `--text-body` | Texto corrido principal | `1rem` |
| `--text-body-sm` | Detalhes, texto secundario | `0.875rem` |
| `--text-caption` | Meta info, labels, footnotes | `0.75rem` |
| `--text-overline` | Badges, categorias, eyebrow text | `0.75rem` (uppercase, letter-spacing) |

**Regras:**
- NUNCA usar valores px fixos para headings — sempre `clamp(min, preferred, max)`
- Line-height: headings = 1.1-1.2, body = 1.5-1.7
- Letter-spacing: overlines e captions geralmente precisam de `0.05-0.1em`
- Font weights devem seguir o pairing escolhido da `creative-reference.md`

---

## Paleta de Cores

Definir TODAS as cores com variantes:

### Cores Principais

| Token | Uso |
|-|-|
| `--color-primary` | CTAs, links, acentos de interacao |
| `--color-primary-light` | Hover states, backgrounds sutis |
| `--color-primary-dark` | Active states, contraste |
| `--color-primary-muted` | Backgrounds com opacidade (usar hex com alpha ou rgba) |
| `--color-secondary` | Complemento, elementos de suporte |
| `--color-secondary-light` | Variante clara |
| `--color-secondary-dark` | Variante escura |
| `--color-accent` | Destaques pontuais, badges, alertas positivos |
| `--color-accent-light` | Variante clara |
| `--color-accent-dark` | Variante escura |

### Cores de Base

| Token | Uso |
|-|-|
| `--color-bg` | Fundo principal da pagina |
| `--color-surface` | Cards, secoes alternadas, elevacao sutil |
| `--color-surface-alt` | Variacao de surface para maior contraste |
| `--color-text` | Texto principal |
| `--color-text-muted` | Texto secundario, captions, placeholders |
| `--color-text-inverse` | Texto sobre fundos escuros/coloridos |
| `--color-border` | Linhas, separadores, inputs |
| `--color-border-light` | Bordas mais sutis |

### Cores Utilitarias

| Token | Uso |
|-|-|
| `--color-error` | Erros de validacao, alertas |
| `--color-success` | Confirmacao, estados positivos |

**Regras:**
- Contraste WCAG AA minimo entre texto e background
- Cores primarias NUNCA devem ser genericas (nao usar #6366f1 sem justificativa)
- A paleta deve derivar do briefing/nicho, nao ser arbitraria
- Variantes -light, -dark, -muted sao obrigatorias para as 3 cores principais

---

## Sistema de Sombras

3 niveis de elevacao:

| Token | Uso | Exemplo |
|-|-|-|
| `--shadow-subtle` | Elevacao minima, cards em repouso | `0 1px 3px rgba(0,0,0,0.06)` |
| `--shadow-medium` | Cards em hover, dropdowns | `0 4px 12px rgba(0,0,0,0.08)` |
| `--shadow-dramatic` | Modais, popovers, elementos flutuantes | `0 12px 40px rgba(0,0,0,0.15)` |

**Regras:**
- Sombras devem usar a cor de fundo/texto como base (nao preto puro em dark mode)
- Para dark mode: usar sombras mais sutis e borders em vez de sombras pesadas
- Cada nivel deve ter diferenca perceptivel do anterior

---

## Sistema de Espacamento

Escala baseada em multiplos de 4px (0.25rem):

| Token | Valor | Uso tipico |
|-|-|-|
| `--space-xs` | 0.25rem (4px) | Gaps minimos, icon padding |
| `--space-sm` | 0.5rem (8px) | Padding interno pequeno |
| `--space-md` | 1rem (16px) | Padding padrao, gaps de form |
| `--space-lg` | 1.5rem (24px) | Espacamento entre elementos |
| `--space-xl` | 2rem (32px) | Separacao de grupos |
| `--space-2xl` | 3rem (48px) | Separacao de blocos |
| `--space-3xl` | 4rem (64px) | Margem interna de secoes |
| `--space-4xl` | 6rem (96px) | Padding vertical de secoes |
| `--space-5xl` | 8rem (128px) | Espacamento generoso, hero |

**Regras:**
- NUNCA usar valores magicos (37px, 53px). Sempre multiplos de 4 ou 8
- Section padding usa `clamp()` para responsividade: `--section-py: clamp(4rem, 10vw, 8rem)`
- Container padding lateral: `--container-px: clamp(1rem, 5vw, 2rem)`

---

## Tokens de Animacao

### Duracoes

| Token | Valor | Uso |
|-|-|-|
| `--duration-fast` | 150ms | Hovers, toggles, micro-interactions |
| `--duration-normal` | 300ms | Transicoes de estado, reveals |
| `--duration-slow` | 600ms | Animacoes de entrada, scroll effects |
| `--duration-cinematic` | 1000ms+ | Hero effects, transicoes de secao |

### Easings

| Token | Valor | Uso |
|-|-|-|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Uso geral, transicoes suaves |
| `--ease-dramatic` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll animations, entradas com presenca |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Micro-interactions divertidas |
| `--ease-snap` | `cubic-bezier(0.7, 0, 0.3, 1)` | Transicoes rapidas e decisivas |

**Regras:**
- Todos os efeitos devem usar os tokens de animacao, NAO valores hardcoded
- Efeitos da biblioteca (`references/effects/`) adaptam seus timings para usar esses tokens
- `prefers-reduced-motion` respeita SEMPRE — duracoes vao para 0.01ms

---

## DNA Visual / Elementos de Assinatura

O DNA Visual e o que torna ESTA pagina visualmente unica. Deve ser definido explicitamente e referenciado em todas as secoes do layout.

### O que o DNA Visual define

- **Elemento recorrente**: Qual elemento visual se repete para criar coerencia entre secoes. Exemplos: textura noise em backgrounds, linhas diagonais como separador, gradiente mesh como decoracao recorrente, borda arredondada especifica (border-radius: 24px), pattern geometrico sutil
- **Tratamento de midia**: Como fotos/videos sao tratados nesta pagina. Exemplos: duotone, saturacao alta, grain overlay, recorte em formas geometricas, moldura com margem interna
- **Movimento de assinatura**: Qual tipo de movimento define a personalidade da pagina. Exemplos: tudo desliza da esquerda, elementos "respiram", micro-rotacoes sutis no hover, parallax em camadas com profundidade marcada
- **Detalhe tipografico**: Algum tratamento tipografico que se repete. Exemplos: overlines sempre em uppercase com tracking largo, headlines com gradiente, corpo do texto com indent na primeira linha, numeros de secao em display gigante

### Regras do DNA Visual

1. DEVE ser definido antes de qualquer secao de layout
2. DEVE ser concreto e especifico (nao "visual moderno e clean")
3. DEVE aparecer em TODAS as secoes, adaptado ao contexto de cada uma
4. NAO precisa ser complexo — um unico elemento bem executado e melhor que 5 mal integrados
5. DEVE ser compativel com os efeitos selecionados da biblioteca

---

## Output Esperado

A skill `gerar-design` deve produzir:

1. **Font pairing** selecionado (da `creative-reference.md`) com justificativa
2. **Bloco `:root`** completo com TODOS os tokens acima definidos para o projeto
3. **DNA Visual** descrito em texto (sera referenciado no layout.md)
4. **Efeitos selecionados** da biblioteca (`references/effects/`) com justificativa
5. **Hero implementado** com o design system aplicado + efeito da biblioteca
6. **Preview no browser** (Netlify Dev) para validacao visual

Tudo salvo como variaveis CSS no `:root` do `style.css` do projeto.
