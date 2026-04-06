# Deploy

GitHub + Netlify com CI/CD automatico. Cada push para main = deploy automatico.

---

## REGRA DE OURO: Autonomia Total

**VOCE DEVE fazer tudo sozinho. NUNCA peca para o usuario executar comandos manualmente.**

### Comandos Interativos

Quando um comando for interativo (como `netlify init`), VOCE deve:
1. Executar o comando
2. Enviar os inputs necessarios para responder aos prompts
3. Continuar ate concluir

**NUNCA:**
- Peca para o usuario "rodar X no terminal"
- Diga que "requer autenticacao interativa"
- Desista porque o comando e interativo

**SEMPRE:**
- Execute voce mesmo
- Envie os inputs corretos para cada prompt
- So informe o usuario quando ele precisar autorizar algo no navegador (OAuth)

---

## IMPORTANTE: Integracao GitHub + Netlify

O deploy DEVE ser feito com integracao Git automatica. NUNCA use:
- `netlify init --manual` (cria conexao manual que requer configuracao extra)
- `netlify sites:create` (cria site sem integracao Git)
- `netlify deploy --prod` (deploy direto sem Git, perde historico)

O correto e usar `netlify init` (sem flags) que configura OAuth automaticamente.

---

## Primeiro: Identificar o Cenario

Antes de fazer qualquer coisa, execute estas verificacoes:

```bash
git remote -v
netlify status
```

### Interpretacao dos Resultados

- Git vazio + Netlify nao linkado → **Cenario A** (Configuracao inicial completa)
- Git com URL GitHub + Netlify nao linkado → **Cenario B** (Apenas conectar Netlify)
- Git com URL GitHub + Site linkado sem CI/CD → **Cenario C** (Configurar integracao Git)
- Git com URL GitHub + Site linkado com CI/CD → **Cenario D** (Apenas fazer push)

---

## Cenario A: Configuracao Inicial Completa

### Passo 1: Inicializar Git

```bash
git init
git add .
git commit -m "Versao inicial"
```

### Passo 2: Criar repositorio no GitHub

```bash
gh repo create nome-do-projeto --public --source=. --push
```

### Passo 3: Conectar ao Netlify (COM integracao GitHub)

```bash
netlify init
```

**ATENCAO nas opcoes:**

1. "What would you like to do?": Selecione **"Create & configure a new site"**
2. Selecione o time do usuario
3. "Site name": Digite o nome desejado (sera a URL: nome.netlify.app)
4. "Your build command": Deixe VAZIO (apenas pressione Enter)
5. "Directory to deploy": Digite `.` (ponto)
6. O Netlify vai pedir autorizacao OAuth com GitHub — abrira o navegador para autorizar

Ao final, deve aparecer: `Success! Netlify CI/CD Configured!`

### Verificar se esta conectado

```bash
netlify status
```

Deve mostrar informacoes do site com "Linked to" apontando para o repositorio GitHub.

```bash
netlify open:admin
```

No painel, va em **"Site configuration"** > **"Build & deploy"** > **"Continuous deployment"**. Deve mostrar o repositorio GitHub conectado.

---

## Cenario B: Git OK, Falta Netlify

O repositorio ja esta no GitHub. Apenas conecte ao Netlify:

```bash
netlify init
```

Selecione **"Create & configure a new site"** e siga os passos do Cenario A (Passo 3 em diante).

---

## Cenario C: Falta Integracao CI/CD

O site existe no Netlify mas nao esta com deploy automatico. Configure:

```bash
netlify open:admin
```

No painel:
1. Va em **"Site configuration"** > **"Build & deploy"** > **"Continuous deployment"**
2. Clique em **"Link site to Git"**
3. Selecione **GitHub** e autorize
4. Selecione o repositorio correto
5. Configure: Branch = `main`, Build command = (vazio), Publish directory = `.`
6. Confirme

Depois faca um push para testar:

```bash
git add .
git commit -m "Testar CI/CD"
git push origin main
```

---

## Cenario D: Tudo Configurado - Apenas Push

### Verificacoes Pre-Deploy

Antes de subir, verifique:

- [ ] **Redirect da home configurado** no `netlify.toml` (`from = "/"` apontando para a pagina principal)
- [ ] Todas as imagens usam Netlify CDN (`/.netlify/images?url=`)
- [ ] Imagens tem width, height e alt
- [ ] Hero nao tem animacao de entrada
- [ ] CSS critico inline no head
- [ ] Formulario funcionando (teste o envio)
- [ ] Site responsivo (teste no mobile)
- [ ] Console sem erros
- [ ] Links funcionando

### Redirect da Home (obrigatorio)

Verifique se o `netlify.toml` tem um redirect `from = "/"`. A raiz do site contem apenas o template base e mostra uma pagina em branco sem este redirect.

Se NAO existir, identifique a pagina principal (pasta com `index.html` que nao seja a raiz) e adicione:

```toml
# Redirect da home para a pagina principal
[[redirects]]
  from = "/"
  to = "/nome-da-pagina/"
  status = 302
  force = true
```

### Commit e Push

```bash
git status
git add .
git commit -m "Descricao das alteracoes"
git push origin main
```

O Netlify inicia o deploy automaticamente.

---

## Deploy Previews (Economizar minutos de build)

**O Netlify cobra por minutos de build.** Para evitar custos:

- Commits para `main` = deploy de producao (usa minutos)
- Pull Requests = Deploy Preview (link temporario para testar)

### Fluxo para alteracoes

```bash
git checkout -b preview/descricao-da-alteracao
git add .
git commit -m "Descricao das alteracoes"
git push -u origin preview/descricao-da-alteracao
gh pr create --title "Preview: Descricao" --body "Alteracoes para revisao"
```

O Netlify automaticamente cria um Deploy Preview com URL tipo:
`deploy-preview-123--nome-do-site.netlify.app`

### Aprovar e ir para producao

Apos testar o preview:

```bash
gh pr merge --merge
```

Isso faz merge para main e dispara o deploy de producao automaticamente.

---

## URL para Compartilhar com o Usuario

Ao informar que o site esta no ar, SEMPRE forneca o link direto para a pagina principal, NAO o link raiz.

**Como identificar a pagina principal:**
1. Verifique o redirect `from = "/"` no `netlify.toml` — o campo `to` indica a pagina principal
2. Caso nao exista redirect, procure as pastas na raiz que contenham `index.html` (ignorar a raiz e pastas `_backup_*`)

**Exemplo correto:**
- "Seu site esta no ar: https://nome.netlify.app/pagina-vendas/"

**ERRADO (nunca faca isso):**
- "Seu site esta no ar: https://nome.netlify.app/"

A raiz do site contem apenas o template base do framework e mostra uma pagina em branco. O usuario vai achar que o deploy falhou se receber o link raiz.

---

## Comandos Uteis

**Git:**
- `git status` - ver status
- `git add .` - adicionar tudo
- `git commit -m "msg"` - commitar
- `git push` - enviar para GitHub (dispara deploy)

**GitHub CLI:**
- `gh repo create nome --public --source=. --push` - criar repositorio
- `gh pr create --title "x" --body "y"` - criar PR
- `gh pr merge --merge` - fazer merge do PR

**Netlify CLI:**
- `netlify dev` - servidor local (porta 8888)
- `netlify status` - status do site
- `netlify open` - abrir site no navegador
- `netlify open:admin` - abrir painel administrativo

---

## Troubleshooting

### "Site nao atualiza apos push"

Verifique se a integracao esta ativa:
```bash
netlify open:admin
```
Va em **"Site configuration"** > **"Build & deploy"** > **"Continuous deployment"**.

Se nao mostrar o repositorio GitHub conectado, siga o **Cenario C**.

### "netlify status mostra site mas nao mostra repo"

O site foi criado com `--manual` ou `sites:create`. Precisa reconfigurar. Siga o **Cenario C**.

### "Netlify init nao pede autorizacao GitHub"

Se ja estiver logado, pode pular a autorizacao. Verifique com:
```bash
netlify status
```

Se precisar reautorizar:
```bash
netlify logout
netlify login
netlify init
```

### "Deploy falhou no Netlify"

Verifique os logs:
```bash
netlify open:admin
```
Va em **"Deploys"** e clique no deploy com erro para ver os logs.

Erros comuns:
- Arquivo com nome invalido
- Imagem muito grande (>25MB)
- Erro de sintaxe no netlify.toml

---

## Dominio Personalizado

No dashboard do Netlify: Site configuration > Domain management > Add custom domain

DNS necessario:
- A Record: @ → 75.2.60.5
- CNAME: www → seu-site.netlify.app
