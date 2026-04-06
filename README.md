# Metodo Zero

Plugin para Claude Code que cria landing pages de alto impacto visual com HTML/CSS/JS puro. Zero build step, zero dependencias, hospedagem Netlify.

## O que faz

O Metodo Zero automatiza o processo completo de criacao de landing pages com qualidade visual de nivel awwwards. A filosofia central: **o LLM nunca toma decisoes criativas sozinho** -- ele gera opcoes, renderiza no browser, e o usuario escolhe.

- **HTML/CSS/JS puro** -- sem frameworks, sem bundlers, sem npm install
- **Pipeline interativa** -- cada decisao criativa (paleta, tipografia, hero) e apresentada com 3 opcoes visuais no browser
- **Biblioteca de 55 efeitos testados** -- copiados literalmente para o projeto, nunca reescritos ou simplificados
- **Do briefing ao deploy** -- coleta de informacoes, copy, design, build, otimizacao, publicacao
- **Autonomia total** -- o agente executa todos os comandos; o usuario nunca precisa abrir o terminal

## Instalacao

Clone o repositorio e crie um symlink para a pasta de skills do Claude Code:

```bash
git clone https://github.com/ogallotti/metodo-zero-claude.git ~/dev/metodo-zero-claude
ln -s ~/dev/metodo-zero-claude ~/.claude/skills/metodo-zero
```

Reinicie o Claude Code. As skills ficarao disponiveis automaticamente.

## Quick Start

No Claude Code, execute:

```
/metodo-zero:criar-pipeline
```

O agente vai guiar voce pelo processo completo: coletar briefing, gerar copy, apresentar opcoes visuais no browser, construir secao a secao, e publicar na Netlify.

## Skills

O plugin tem 13 skills organizadas em 3 grupos.

### Pipelines (ponto de entrada)

| Skill | Descricao |
|-|-|
| **criar-pipeline** | Pipeline interativa: briefing ao deploy com escolhas visuais no browser |
| **criar-agentes** | Agent Team com 5 especialistas coordenados (Orquestrador, Copywriter, Diretor de Arte, Developer, QA) |

### Skills individuais

| Skill | Descricao |
|-|-|
| **iniciar** | Scaffold de projeto novo (pasta, templates, git init, Netlify Dev) |
| **gerar-copy** | Copy persuasiva com validacao anti-IA via subagent Critico de Copy |
| **gerar-design** | Identidade visual interativa: paleta, tipografia e hero escolhidos no browser |
| **gerar-layout** | Especificacao exaustiva de todas as secoes com efeitos da biblioteca |
| **desenvolver** | Build secao a secao com copia literal de efeitos e checklist de hero |
| **otimizar** | Performance para PageSpeed 90+ com medicao antes/depois via Lighthouse |
| **publicar** | Deploy para producao via GitHub + Netlify CI/CD |
| **previsualizar** | Deploy Preview via Pull Request para testar antes de ir ao ar |
| **visualizar-local** | Servidor de desenvolvimento local com Netlify Dev |

### Utilitarios

| Skill | Descricao |
|-|-|
| **debug** | Investigacao sistematica: coletar info, hipoteses, testar, corrigir, prevenir |
| **configurar-tracking** | GTM + Meta Pixel: coleta IDs, instala snippets, configura eventos |

## Fluxo da Pipeline

A `criar-pipeline` conduz o usuario por 12 etapas. Decisoes criativas (marcadas com **PAUSA**) exigem escolha do usuario; etapas mecanicas avancem automaticamente.

```
Briefing
  |
Scaffold (iniciar + Netlify Dev)
  |
Copy (gerar-copy) .................. PAUSA: aprovar/ajustar
  |
Direcao Visual (3 paletas) ........ PAUSA: escolher 1, 2 ou 3
  |
Tipografia (3 font pairings) ...... PAUSA: escolher 1, 2 ou 3
  |
Hero (3 patterns no browser) ...... PAUSA: escolher 1, 2 ou 3
  |
Design System (consolidacao automatica)
  |
Layout (gerar-layout) ............. PAUSA: aprovar/ajustar secoes
  |
Build secao a secao ............... PAUSA: feedback por bloco
  |   Bloco 1: Hero + primeira secao
  |   Bloco 2: Secoes do meio
  |   Bloco 3: Secoes finais
  |
Ajustes Finais .................... PAUSA: iteracoes livres
  |
Otimizar (opcional)
  |
Publicar (opcional)
```

## Biblioteca de Efeitos

55 efeitos visuais testados e prontos para producao, organizados em 4 categorias com sistema de tiers (1 = alto impacto, 3 = nicho).

| Categoria | Qtd | Exemplos |
|-|-|-|
| Hero Patterns | 20 | particle-field, kinetic-typography, parallax-depth-hero, noise-distortion |
| Scroll Effects | 15 | pin-and-reveal, parallax-layers, horizontal-scroll-section, sticky-cards-stack |
| Transitions | 10 | section-clip-path, wave-divider-animated, curtain-reveal, morph-between-sections |
| Micro-interactions | 10 | magnetic-button, hover-card-3d-tilt, custom-cursor-trail, text-hover-reveal |

Cada efeito e um arquivo `.md` com codigo completo (HTML + CSS + JS), parametros customizaveis, versao mobile responsiva e suporte a `prefers-reduced-motion`. Dependencias variam de CSS puro a GSAP, Three.js e WebGL.

Regra fundamental: efeitos sao **copiados literalmente** para o projeto. O agente substitui apenas variaveis CSS pelos tokens do design system. Nunca reescreve, nunca simplifica.

## References

O diretorio `references/` contem 10 documentos tecnicos consultados pelas skills:

| Documento | Conteudo |
|-|-|
| `creative-reference.md` | 70+ arquetipos de composicao, 100+ constraints criativos, 35+ font pairings curados |
| `copy-rules.md` | Regras anti-IA para copy (tom, estrutura, validacao) |
| `design-system-guide.md` | Guia completo para gerar design systems (escala tipografica, paleta, sombras, tokens) |
| `hero-checklist.md` | Checklist obrigatorio que bloqueia progresso se o hero falhar |
| `effects/` | Biblioteca de 55 efeitos visuais (ver secao acima) |
| `forms.md` | Formularios Netlify + intl-tel-input |
| `tracking.md` | GTM + Meta Pixel (instalacao, eventos, testes) |
| `deploy.md` | GitHub + Netlify CI/CD (primeiro deploy e atualizacoes) |
| `local-server.md` | Netlify Dev (configuracao, troubleshooting) |
| `optimize.md` | Checklist de performance para PageSpeed 90+ |

## Pre-requisitos

- **Claude Code** com skills habilitadas
- **Netlify CLI** (`npm install -g netlify-cli`) -- para servidor local e deploy
- **GitHub CLI** (`gh`) -- para criar repositorio e deploy
- **Google Fonts** -- acesso via internet para carregar tipografia
- **Git** -- versionamento de cada etapa

## Estrutura do Projeto

```
metodo-zero-claude/
  SKILL.md              -- Entry point do plugin (lista de skills)
  rules.md              -- Regras globais (comunicacao, autonomia, padroes visuais)
  skills/
    criar-pipeline/     -- Pipeline interativa principal
    criar-agentes/      -- Pipeline via Agent Team
    iniciar/            -- Scaffold
    gerar-copy/         -- Copy persuasiva
    gerar-design/       -- Identidade visual interativa
    gerar-layout/       -- Especificacao de secoes
    desenvolver/        -- Build secao a secao
    otimizar/           -- Performance
    publicar/           -- Deploy producao
    previsualizar/      -- Deploy Preview
    visualizar-local/   -- Servidor local
    debug/              -- Investigacao de problemas
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
    index.html          -- Template base com formulario Netlify
    style.css           -- CSS base com reset e variaveis
    script.js           -- JS base (AOS, intl-tel-input, scroll)
    netlify.toml        -- Configuracao Netlify (redirects, image CDN)
```

## Decisoes de Design

### Escolhas interativas no browser

O LLM nao escolhe paleta, tipografia ou hero sozinho. Gera 3 opcoes, renderiza como HTML temporario, e o usuario ve no browser e decide. Isso elimina o problema de "outputs genericos" que plagueiam geradores de IA.

### Copia literal de efeitos

Efeitos da biblioteca sao copiados na integra. Se um efeito tem 200 linhas de JavaScript, as 200 linhas vao para o projeto. O agente substitui apenas tokens CSS. Isso garante que efeitos complexos (particulas, WebGL, scroll-triggered animations) funcionem exatamente como testados.

### Hero checklist ativo

O checklist de hero nao e uma sugestao -- e um gate que bloqueia progresso. Se qualquer item falhar (hero centralizado simples, animacao de entrada, efeito simplificado), o hero e reescrito antes de continuar.

### Regras anti-IA para copy

O subagent Critico de Copy valida que o texto nao soa como "IA generica": sem bullet points previsíveis, sem superlativos vazios, sem estrutura mecanica. A copy deve soar como se um redator humano tivesse escrito.

### Fontes proibidas

Montserrat, Poppins, Roboto, Inter e outras fontes overused sao explicitamente banidas. O `creative-reference.md` oferece 35+ font pairings curados organizados por categoria (Editorial, Brutalist, Agnostic, etc.).

### Zero build step

Sem npm, sem bundler, sem transpilacao. HTML/CSS/JS puros servidos diretamente. Isso simplifica o deploy, elimina dependencias de build, e permite que qualquer pessoa edite o codigo depois.

## Licenca

MIT
