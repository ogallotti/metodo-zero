# Effects Library — Design Spec

**Data:** 2026-04-06
**Status:** Aprovado
**Escopo:** Biblioteca de efeitos visuais interativos do plugin Método Zero

---

## Problema

A IA não consegue criar designs interativos, animados e modernos sozinha. A biblioteca atual de 55 efeitos em arquivos `.md` foi gerada pela própria IA — código não testado, genérico, sem base em implementações reais de produção. Resultado: landing pages com animações fracas e repetitivas.

## Solução

Criar uma biblioteca de efeitos visuais com:

- **Código real funcional** (não markdown com blocos) — cada efeito é uma pasta com arquivos executáveis
- **Código 100% original** inspirado em 5 bibliotecas open-source (Magic UI, Aceternity UI, Motion Primitives, Animate UI, React Bits), recriado em vanilla JS/CSS + GSAP/Three.js/Lenis
- **Playground interativo** estilo Storybook com controles de ajuste e botão "Copiar Prompt"
- **Organização híbrida** — categorias por tipo de elemento com tags de contexto

---

## Arquitetura

### Estrutura de Pastas

```
references/effects/
  _playground/                 ← Storybook do projeto
    index.html                 ← Página índice com navegação
    playground.js              ← Engine de controles + copy-prompt
    playground.css             ← Estilos do storybook
  backgrounds/                 ← Categoria
    gradient-mesh/             ← Efeito individual
      demo.html                ← Preview executável standalone
      style.css                ← CSS real do efeito
      script.js                ← JS real do efeito
      meta.json                ← Parâmetros, tags, deps, descrição
      README.md                ← Quando usar, integração, variações
    particle-field/
      ...
  text-effects/
  cards/
  buttons/
  borders/
  scroll/
  transitions/
  decorative/
  media/
  layout/
  components/
```

### meta.json — Schema

```json
{
  "name": "Nome do Efeito",
  "slug": "nome-do-efeito",
  "category": "categoria",
  "tags": ["hero", "continuous", "canvas"],
  "dependencies": ["gsap"],
  "description": "Descrição curta do efeito e quando usar",
  "params": {
    "--var-name": {
      "default": "valor",
      "type": "color | duration | size | number",
      "label": "Label legível"
    }
  },
  "jsParams": {
    "paramName": {
      "default": "valor",
      "type": "number | boolean | string | select",
      "label": "Label legível",
      "options": ["opção1", "opção2"]
    }
  }
}
```

**Tipos de controle gerados automaticamente:**
- `color` → color picker
- `duration` → slider (ms)
- `size` → slider com unidade (px/rem)
- `number` → slider numérico
- `boolean` → toggle
- `string` → text input
- `select` → dropdown

### Taxonomia — 11 Categorias

| Categoria | O que inclui | Exemplos |
|-|-|-|
| `backgrounds` | Fundos animados/interativos | Gradient mesh, particle field, aurora, dot pattern, noise, grid |
| `text-effects` | Animações em texto/headlines | Typewriter, scramble, gradient text, split reveal, blur fade, counting, marquee |
| `cards` | Cards com interação | 3D tilt, hover reveal, glass card, spotlight card, stack cards |
| `buttons` | Botões com micro-interações | Magnetic, ripple, glow, morph, shimmer, liquid |
| `borders` | Bordas animadas/decorativas | Glow border, gradient border, animated dash, pulse outline, neon |
| `scroll` | Efeitos acionados por scroll | Parallax, pin-and-reveal, horizontal scroll, stagger grid, clip-path reveal |
| `transitions` | Transições entre seções | Clip-path wipe, curtain, diagonal, wave divider, color wipe |
| `decorative` | Elementos visuais de suporte | Cursor trail, floating shapes, grid lines, light beams, sparkles, blob |
| `media` | Efeitos em imagens/vídeo | Before/after slider, image parallax, hover zoom, masked video, gallery |
| `layout` | Animações de layout | Bento grid reveal, masonry animate |
| `components` | Componentes interativos funcionais | Carrossel, accordion, tabs, toggle, modal, drawer, tooltip, FAQ, pricing table, testimonial slider |

### Tags de Contexto

**Uso:** `hero`, `section`, `hover`, `scroll-trigger`, `continuous`, `click`, `cursor`, `mobile-friendly`

**Performance:** `performance-heavy`, `css-only`, `lightweight`

**Dependência:** `vanilla`, `gsap`, `three`, `lenis`, `canvas`

---

## Playground

Aplicação HTML/CSS/JS pura (zero build) que serve como catálogo navegável e ferramenta de customização.

### Funcionalidades

1. **Catálogo** — lista todos os efeitos por categoria, com busca e filtro por tags
2. **Preview ao vivo** — cada efeito renderiza em iframe isolado (o `demo.html`)
3. **Painel de controles** — gerado automaticamente a partir do `meta.json`
4. **Botão "Copiar Prompt"** — gera texto formatado para o chat da IA

### Fluxo do Usuário

1. Abre `_playground/index.html` no navegador
2. Navega pelas categorias, vê previews em miniatura
3. Clica num efeito → view detalhada com controles
4. Ajusta parâmetros em tempo real
5. Clica "Copiar Prompt" → clipboard recebe:

```
Use o efeito "Typewriter" da categoria text-effects com os seguintes ajustes:
- Velocidade por caractere: 120ms
- Cor do cursor: #6366f1
- Largura do cursor: 3px
- Loop infinito: sim
```

### Comunicação Playground ↔ Efeito

- O `playground.js` lê o `meta.json` do efeito selecionado
- Gera controles por tipo
- Cada mudança envia `postMessage` ao iframe do `demo.html`
- O `demo.html` escuta mensagens e aplica via `element.style.setProperty()` (CSS vars) ou atualização direta de config JS
- Cada `demo.html` inclui um listener padrão para isso

### Navegação

- Sidebar com categorias colapsáveis
- Busca por nome ou tag
- Cards na listagem: nome, mini-preview, tags, ícone de dependência

---

## Processo de Recriação

### Fontes de Referência

1. **Magic UI** — https://magicui.design/
2. **Aceternity UI** — https://ui.aceternity.com/
3. **Motion Primitives** — https://motion-primitives.com/
4. **Animate UI** — https://animate-ui.com/
5. **React Bits** — https://reactbits.dev/

### Regras de Recriação

- **Código 100% original** — mesma sensação visual, implementação própria
- **Vanilla + libs permitidas** — CSS + JS vanilla como base; GSAP, Three.js, Lenis quando necessário
- **Responsivo obrigatório** — mobile-first
- **`prefers-reduced-motion` obrigatório** — todo efeito deve respeitar acessibilidade
- **Prefixo CSS por efeito** — evitar colisão (ex: `.tw-` typewriter, `.pf-` particle field)
- **Performance** — `will-change`, `IntersectionObserver` para pausar fora da viewport, `requestAnimationFrame`
- **IIFE** — cada script.js encapsulado em IIFE, sem poluição global
- **Qualidade > quantidade** — só entra o que é realmente bom

### Processo por Efeito

1. Estudar o original — entender a técnica visual e abordagem matemática/CSS (não o código React)
2. Escrever do zero em vanilla
3. Parametrizar — expor knobs úteis no `meta.json`
4. Testar no playground — validar visualmente, responsividade, reduced-motion
5. Documentar — `README.md` com "quando usar", integração, variações

---

## Integração com o Plugin

### Skills que Consomem a Biblioteca

**`gerar-design`** — consulta `meta.json` e `README.md` para escolher efeitos adequados ao contexto (nicho, tom, tipo de conteúdo)

**`desenvolver`** — lê `style.css` e `script.js` reais do efeito e integra no projeto. Código copiado literalmente, adaptando apenas CSS vars ao design system

### Influência do Usuário via Playground

- Antes ou durante o pipeline, o usuário abre o playground, explora e tuna efeitos
- Cola o prompt copiado no chat
- A IA respeita os ajustes, aplicando valores customizados em vez dos defaults

### Hero Checklist

Validação atualizada: comparar o `script.js` integrado contra o original da biblioteca. Linhas-chave removidas = falha.

### Descoberta de Efeitos pela IA

A IA consulta `meta.json` programaticamente:
- Nicho tech/SaaS → filtrar por tags `hero, canvas, vanilla`
- Landing de evento → filtrar por `hero, continuous`, excluir `performance-heavy`
- Seção de depoimentos → categoria `components`, tag `testimonial`

---

## Fases de Execução

### Fase 1 — Mapeamento e Catálogo
- Pesquisar as 5 bibliotecas
- Catalogar todos os efeitos/componentes encontrados
- Classificar nas 11 categorias, deduplicar, atribuir prioridade
- Resultado: documento de decisão com o que entra

### Fase 2 — Infraestrutura do Playground
- Construir `_playground/` (index.html, playground.js, playground.css)
- Engine de controles dinâmicos a partir de `meta.json`
- Navegação, busca, filtro por tags
- Botão "Copiar Prompt"
- Testar com 2-3 efeitos piloto

### Fase 3 — Recriação dos Efeitos
- Recriar efeitos priorizados, categoria por categoria
- Migrar os 55 existentes que tiverem qualidade
- Recriar os fracos, eliminar redundantes

### Fase 4 — Integração com o Plugin
- Atualizar skills `gerar-design` e `desenvolver`
- Atualizar hero-checklist
- Documentação final

Cada fase é um ciclo independente — executada, validada e commitada antes da próxima.

---

## Migração dos Efeitos Existentes

Os 55 efeitos atuais em `.md`:
- **Bons:** extrair do markdown, criar pasta com arquivos reais, parametrizar, validar no playground
- **Fracos:** recriar do zero usando referências das bibliotecas pesquisadas
- **Redundantes:** eliminar

Os arquivos `.md` antigos são removidos após migração completa.
