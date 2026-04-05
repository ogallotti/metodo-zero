---
name: previsualizar
description: Cria um Deploy Preview via Pull Request no Netlify para testar alteracoes antes de ir para producao.
---

# Instrucoes

O usuario quer criar um Deploy Preview (PR) para testar antes de ir para producao.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Consulte `references/deploy.md` para detalhes de configuracao Netlify

## REGRA DE OURO: Autonomia Total

**VOCE DEVE fazer tudo sozinho. NUNCA peca para o usuario executar comandos manualmente.**

Se o Netlify nao estiver configurado com CI/CD, configure voce mesmo antes de criar o PR.

---

## Por Que Usar Preview?

- Commits para `main` = deploy de producao
- Pull Requests = Deploy Preview (link temporario para testar)

O Deploy Preview e ideal para:
- Testar alteracoes antes de aprovar
- Mostrar para cliente revisar

---

## Pre-requisito: Identificar Contexto

### Identificar a Pasta da Pagina

Identifique em qual pasta da pagina voce esta trabalhando. Use os arquivos da pasta da pagina (ex: `pagina-vendas/`).

**IMPORTANTE:** Pastas com prefixo `_backup_` sao versoes antigas - NAO inclua no commit/PR.

### Verificar CI/CD

**ANTES de criar o PR**, verifique se o Netlify esta configurado com CI/CD:

```bash
netlify status
```

### Se NAO mostrar um site linkado ou se nao tiver integracao Git:

**VOCE deve configurar o CI/CD primeiro.** Execute `netlify init` e responda aos prompts:

```bash
netlify init
```

Respostas para os prompts interativos:
1. **"What would you like to do?"** - Envie: `1` (Create & configure a new site)
2. **"Team"** - Envie: `1` (primeiro time)
3. **"Site name"** - Envie: nome desejado
4. **"Build command"** - Envie: Enter (vazio)
5. **"Directory to deploy"** - Envie: `.`
6. **OAuth** - Informe ao usuario que ele precisa autorizar no navegador que abriu

**Se o site ja existe mas nao tem CI/CD:**
```bash
netlify unlink
netlify init
```

So prossiga para criar o PR apos ver: `Success! Netlify CI/CD Configured!`

Consulte `references/deploy.md` para detalhes completos dos cenarios de configuracao.

---

## Processo Completo

### 1. Criar branch e PR

```bash
# Criar branch
git checkout -b preview/alteracoes

# Commitar alteracoes
git add .
git commit -m "Preview: Descricao das alteracoes"

# Push e criar PR
git push -u origin preview/alteracoes
gh pr create --title "Preview: Descricao" --body "Alteracoes para revisao"
```

### 2. Aguardar o Deploy Preview

Apos criar o PR, aguarde o Netlify processar:

```bash
gh pr checks {NUMERO_PR} --watch
```

Este comando aguarda ate todos os checks completarem.

### 3. Obter o link do Deploy Preview

Apos os checks completarem, extraia o link:

```bash
gh pr checks {NUMERO_PR} --json name,link --jq '.[] | select(.name | contains("netlify")) | .link'
```

Se o comando acima nao retornar nada, tente:

```bash
gh pr checks {NUMERO_PR}
```

E procure a linha do Netlify - o link estara na coluna final.

### 4. Informar ao usuario

Forneca:
- O link do Deploy Preview (URL do Netlify)
- O link do PR no GitHub (para referencia)

---

## Resumo do Fluxo

```
1. Criar branch e PR
2. Aguardar checks: gh pr checks {PR} --watch
3. Extrair link: gh pr checks {PR} (procurar URL do Netlify)
4. Informar o link do PREVIEW ao usuario (nao so o link do PR)
```

**IMPORTANTE:** O valor para o usuario e o **link do preview**, nao o link do PR.

---

## Para Aprovar (quando o usuario solicitar)

```bash
gh pr merge {NUMERO_PR} --merge
```

---

## Troubleshooting

### Deploy Preview nao aparece no PR

**Causa mais comum:** O CI/CD nao esta configurado corretamente.

Verifique:
```bash
netlify status
```

Se nao mostrar "Linked to" com o repositorio GitHub, configure:
```bash
netlify unlink
netlify init
```

E responda aos prompts interativos (veja secao "Pre-requisito").

Depois, faca um push para a branch do PR:
```bash
git push origin preview/alteracoes
```

### Comando `gh pr checks` nao mostra Netlify

O CI/CD pode nao estar configurado. Siga os passos acima.

### OAuth nao completa

Se o navegador nao abrir ou a autorizacao nao completar:
```bash
netlify logout
netlify login
netlify init
```

**IMPORTANTE:** Mesmo com erros, VOCE deve tentar resolver. So peca ajuda ao usuario em ultimo caso.

---

## Ao Finalizar

Apos fornecer o link do Deploy Preview:
1. **PARE COMPLETAMENTE E AGUARDE**

**NUNCA** faca merge automaticamente.
