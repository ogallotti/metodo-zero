# Método Zero

Plugin para Claude Code que cria landing pages de alto impacto visual com HTML/CSS/JS puro. Zero build step, zero dependências, hospedagem Netlify.

## O que faz

O Método Zero automatiza o processo completo de criação de landing pages com qualidade visual de nível awwwards. A filosofia central: **o LLM nunca toma decisões criativas sozinho** -- ele gera opções, renderiza no browser, e o usuário escolhe.

- **HTML/CSS/JS puro** -- sem frameworks, sem bundlers, sem npm install
- **Pipeline interativa** -- cada decisão criativa (paleta, tipografia, hero) é apresentada com 3 opções visuais no browser
- **Biblioteca de 55 efeitos testados** -- copiados literalmente para o projeto, nunca reescritos ou simplificados
- **Do briefing ao deploy** -- coleta de informações, copy, design, build, otimização, publicação
- **Autonomia total** -- o agente executa todos os comandos; o usuário nunca precisa abrir o terminal

## Instalação

### Via Plugin Marketplace (recomendado)

No Claude Code, registre o marketplace:

```
/plugin marketplace add ogallotti/metodo-zero
```

Depois instale o plugin:

```
/plugin install metodo-zero@metodo-zero-marketplace
```

### Via interface visual

1. Execute `/plugin`
2. Vá em **Discover**
3. Encontre **metodo-zero**
4. Selecione o escopo de instalação (User, Project ou Local)

## Quick Start

No Claude Code, execute:

```
/metodo-zero:criar-pipeline
```

O agente vai guiar você pelo processo completo: coletar briefing, gerar copy, apresentar opções visuais no browser, construir seção a seção, e publicar na Netlify.

## Skills

O plugin tem 13 skills organizadas em 3 grupos.

### Pipelines (ponto de entrada)

| Skill | Descrição |
|-|-|
| **criar-pipeline** | Pipeline interativa: briefing ao deploy com escolhas visuais no browser |
| **criar-agentes** | Agent Team com 5 especialistas coordenados (Orquestrador, Copywriter, Diretor de Arte, Developer, QA) |

### Skills individuais

| Skill | Descrição |
|-|-|
| **iniciar** | Scaffold de projeto novo (pasta, templates, git init, Netlify Dev) |
| **gerar-copy** | Copy persuasiva com validação anti-IA via subagent Crítico de Copy |
| **gerar-design** | Identidade visual interativa: paleta, tipografia e hero escolhidos no browser |
| **gerar-layout** | Especificação exaustiva de todas as seções com efeitos da biblioteca |
| **desenvolver** | Build seção a seção com cópia literal de efeitos e checklist de hero |
| **otimizar** | Performance para PageSpeed 90+ com medição antes/depois via Lighthouse |
| **publicar** | Deploy para produção via GitHub + Netlify CI/CD |
| **previsualizar** | Deploy Preview via Pull Request para testar antes de ir ao ar |
| **visualizar-local** | Servidor de desenvolvimento local com Netlify Dev |

### Utilitários

| Skill | Descrição |
|-|-|
| **debug** | Investigação sistemática: coletar info, hipóteses, testar, corrigir, prevenir |
| **configurar-tracking** | GTM + Meta Pixel: coleta IDs, instala snippets, configura eventos |

## Fluxo da Pipeline

A `criar-pipeline` conduz o usuário por 12 etapas. Decisões criativas (marcadas com **PAUSA**) exigem escolha do usuário; etapas mecânicas avançam automaticamente.

```
Briefing
  |
Scaffold (iniciar + Netlify Dev)
  |
Copy (gerar-copy) .................. PAUSA: aprovar/ajustar
  |
Direção Visual (3 paletas) ........ PAUSA: escolher 1, 2 ou 3
  |
Tipografia (3 font pairings) ...... PAUSA: escolher 1, 2 ou 3
  |
Hero (3 patterns no browser) ...... PAUSA: escolher 1, 2 ou 3
  |
Design System (consolidação automática)
  |
Layout (gerar-layout) ............. PAUSA: aprovar/ajustar seções
  |
Build seção a seção ............... PAUSA: feedback por bloco
  |   Bloco 1: Hero + primeira seção
  |   Bloco 2: Seções do meio
  |   Bloco 3: Seções finais
  |
Ajustes Finais .................... PAUSA: iterações livres
  |
Otimizar (opcional)
  |
Publicar (opcional)
```

## Biblioteca de Efeitos

55 efeitos visuais testados e prontos para produção, organizados em 4 categorias com sistema de tiers (1 = alto impacto, 3 = nicho).

| Categoria | Qtd | Exemplos |
|-|-|-|
| Hero Patterns | 20 | particle-field, kinetic-typography, parallax-depth-hero, noise-distortion |
| Scroll Effects | 15 | pin-and-reveal, parallax-layers, horizontal-scroll-section, sticky-cards-stack |
| Transitions | 10 | section-clip-path, wave-divider-animated, curtain-reveal, morph-between-sections |
| Micro-interactions | 10 | magnetic-button, hover-card-3d-tilt, custom-cursor-trail, text-hover-reveal |

Cada efeito é um arquivo `.md` com código completo (HTML + CSS + JS), parâmetros customizáveis, versão mobile responsiva e suporte a `prefers-reduced-motion`. Dependências variam de CSS puro a GSAP, Three.js e WebGL.

Regra fundamental: efeitos são **copiados literalmente** para o projeto. O agente substitui apenas variáveis CSS pelos tokens do design system. Nunca reescreve, nunca simplifica.

## References

O diretório `references/` contém 10 documentos técnicos consultados pelas skills:

| Documento | Conteúdo |
|-|-|
| `creative-reference.md` | 70+ arquétipos de composição, 100+ constraints criativos, 35+ font pairings curados |
| `copy-rules.md` | Regras anti-IA para copy (tom, estrutura, validação) |
| `design-system-guide.md` | Guia completo para gerar design systems (escala tipográfica, paleta, sombras, tokens) |
| `hero-checklist.md` | Checklist obrigatório que bloqueia progresso se o hero falhar |
| `effects/` | Biblioteca de 55 efeitos visuais (ver seção acima) |
| `forms.md` | Formulários Netlify + intl-tel-input |
| `tracking.md` | GTM + Meta Pixel (instalação, eventos, testes) |
| `deploy.md` | GitHub + Netlify CI/CD (primeiro deploy e atualizações) |
| `local-server.md` | Netlify Dev (configuração, troubleshooting) |
| `optimize.md` | Checklist de performance para PageSpeed 90+ |

## Pré-requisitos

- **Claude Code** com skills habilitadas
- **Netlify CLI** (`npm install -g netlify-cli`) -- para servidor local e deploy
- **GitHub CLI** (`gh`) -- para criar repositório e deploy
- **Google Fonts** -- acesso via internet para carregar tipografia
- **Git** -- versionamento de cada etapa

## Estrutura do Repositório

```
ogallotti/metodo-zero/
  .claude-plugin/
    marketplace.json    -- Registro do marketplace
  plugins/
    metodo-zero/        -- O plugin em si (estrutura abaixo)
  README.md
```

### Estrutura do Plugin

```
plugins/metodo-zero/
  .claude-plugin/
    plugin.json         -- Metadata do plugin (nome, versão, autor)
  SKILL.md              -- Entry point do plugin (lista de skills)
  rules.md              -- Regras globais (comunicação, autonomia, padrões visuais)
  skills/
    criar-pipeline/     -- Pipeline interativa principal
    criar-agentes/      -- Pipeline via Agent Team
    iniciar/            -- Scaffold
    gerar-copy/         -- Copy persuasiva
    gerar-design/       -- Identidade visual interativa
    gerar-layout/       -- Especificação de seções
    desenvolver/        -- Build seção a seção
    otimizar/           -- Performance
    publicar/           -- Deploy produção
    previsualizar/      -- Deploy Preview
    visualizar-local/   -- Servidor local
    debug/              -- Investigação de problemas
    configurar-tracking/-- GTM + Meta Pixel
  references/
    creative-reference.md
    copy-rules.md
    design-system-guide.md
    hero-checklist.md
    effects/            -- 55 efeitos em 4 categorias
    forms.md
    tracking.md
    deploy.md
    local-server.md
    optimize.md
  templates/
    index.html          -- Template base com formulário Netlify
    style.css           -- CSS base com reset e variáveis
    script.js           -- JS base (AOS, intl-tel-input, scroll)
    netlify.toml        -- Configuração Netlify (redirects, image CDN)
```

## Decisões de Design

### Escolhas interativas no browser

O LLM não escolhe paleta, tipografia ou hero sozinho. Gera 3 opções, renderiza como HTML temporário, e o usuário vê no browser e decide. Isso elimina o problema de "outputs genéricos" que plagueiam geradores de IA.

### Cópia literal de efeitos

Efeitos da biblioteca são copiados na íntegra. Se um efeito tem 200 linhas de JavaScript, as 200 linhas vão para o projeto. O agente substitui apenas tokens CSS. Isso garante que efeitos complexos (partículas, WebGL, scroll-triggered animations) funcionem exatamente como testados.

### Hero checklist ativo

O checklist de hero não é uma sugestão -- é um gate que bloqueia progresso. Se qualquer item falhar (hero centralizado simples, animação de entrada, efeito simplificado), o hero é reescrito antes de continuar.

### Regras anti-IA para copy

O subagent Crítico de Copy valida que o texto não soa como "IA genérica": sem bullet points previsíveis, sem superlativos vazios, sem estrutura mecânica. A copy deve soar como se um redator humano tivesse escrito.

### Fontes proibidas

Montserrat, Poppins, Roboto, Inter e outras fontes overused são explicitamente banidas. O `creative-reference.md` oferece 35+ font pairings curados organizados por categoria (Editorial, Brutalist, Agnostic, etc.).

### Zero build step

Sem npm, sem bundler, sem transpilação. HTML/CSS/JS puros servidos diretamente. Isso simplifica o deploy, elimina dependências de build, e permite que qualquer pessoa edite o código depois.

## Licença

MIT
