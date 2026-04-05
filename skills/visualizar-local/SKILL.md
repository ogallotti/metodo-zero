---
name: visualizar-local
description: Inicia servidor de desenvolvimento local com Netlify Dev para visualizar a pagina no navegador.
---

# Instrucoes

O usuario quer visualizar a pagina no navegador localmente.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/local-server.md` e siga as instrucoes detalhadas — contem toda a logica necessaria

## A REGRA DO ROOT (Diretorio de Execucao)

**O servidor Netlify Dev DEVE OBRIGATORIAMENTE ser iniciado na RAIZ do projeto**, onde o arquivo `netlify.toml` esta localizado.
Se voce estiver trabalhando dentro da pasta de uma pagina especifica (ex: `/minha-pagina`), **VOLTE PARA A RAIZ** (`cd ..` ou similar dependendo da profundidade) antes de rodar qualquer comando do Netlify ou checar portas.

## REGRA ABSOLUTA: Apenas Netlify Dev

**NUNCA** use alternativas como `python -m http.server`, `npx serve`, etc.

O Netlify Dev e **OBRIGATORIO** porque:
1. CDN de imagens (`/.netlify/images`) so funciona com ele
2. Redirects do netlify.toml sao simulados
3. Formularios Netlify funcionam
4. Mostra o site EXATAMENTE como vai ao ar

## Processo

Siga `references/local-server.md` que cobre:
- Verificacao de servidor existente
- Portas disponiveis
- Iniciar o servidor
- Troubleshooting (permissoes, command not found, cache)

## Ao Finalizar

Informe a URL ao usuario e:
1. Aguarde o usuario visualizar
2. **PARE COMPLETAMENTE E AGUARDE**

**NUNCA** continue para outras etapas automaticamente.
