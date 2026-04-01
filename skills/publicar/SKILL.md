---
name: publicar
description: Deploy da landing page para producao via GitHub + Netlify CI/CD. Cobre primeiro deploy, atualizacoes, verificacoes pre-deploy.
---

# Instrucoes

O usuario quer fazer deploy para producao. Consulte `references/deploy.md` para toda a logica detalhada.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/deploy.md` — contem cenarios A/B/C/D, troubleshooting, e verificacoes

## REGRA DE OURO: Autonomia Total

VOCE DEVE fazer tudo sozinho. NUNCA peca para o usuario executar comandos manualmente.

Quando um comando for interativo (como `netlify init`), VOCE deve executar e enviar os inputs para cada prompt. So informe o usuario quando ele precisar autorizar OAuth no navegador.

## Processo

### 1. Identificar Cenario

Execute:
```bash
git remote -v
netlify status
```

Interprete os resultados conforme `references/deploy.md` (Cenarios A/B/C/D).

### 2. Verificar Redirect da Home

Antes do push, verifique se o `netlify.toml` tem redirect `from = "/"`. Se nao existir, identifique a pagina principal e adicione:

```toml
[[redirects]]
  from = "/"
  to = "/nome-da-pagina/"
  status = 302
  force = true
```

### 3. Verificacoes Pre-Deploy

- [ ] Redirect da home configurado
- [ ] Imagens via Netlify CDN
- [ ] Imagens com width, height e alt
- [ ] Hero sem animacao de entrada
- [ ] Formulario funcional
- [ ] Site responsivo
- [ ] Console sem erros

### 4. Deploy

Siga o cenario identificado conforme `references/deploy.md`.

## Ao Finalizar

1. Informe que o site esta no ar
2. Forneca link DIRETO para a pagina principal (NUNCA o link raiz)
3. PARE e aguarde instrucao do usuario
