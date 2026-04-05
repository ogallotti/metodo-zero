# Local Server

Servidor de desenvolvimento local usando Netlify Dev.

---

## REGRA ABSOLUTA: Apenas Netlify Dev

**NUNCA** use alternativas como `python -m http.server`, `npx serve`, etc.

O Netlify Dev e obrigatorio porque:
- CDN de imagens (`/.netlify/images`) so funciona com ele
- Simula redirects do netlify.toml
- Testa formularios Netlify
- Mostra o site EXATAMENTE como vai ao ar

---

## Processo (SEMPRE seguir)

### 0. NUNCA RODE DENTRO DE SUBPASTAS (Regra do Root)
O servidor Netlify Dev **DEVE OBRIGATORIAMENTE** ser iniciado na RAIZ do projeto, onde o arquivo `netlify.toml` esta localizado.
Se voce acabou de criar uma pasta para uma pagina (ex: `/minha-pagina`) e esta trabalhando nela, **NAO** inicie o servidor de dentro dela. Volte para a raiz do projeto (onde fica o `netlify.toml`) e rode o comando la. As rotas no `.toml` cuidarao do redirecionamento.

### 1. Verificar se ja existe servidor NA RAIZ

```bash
lsof -i :8888 -i :8889 -i :8890 -i :3999 -i :4000 -i :4001 2>/dev/null | grep node
```

Se houver processos, verifique o diretorio de trabalho deles:

```bash
# Substitua PID pelo numero do processo encontrado
lsof -p PID 2>/dev/null | grep cwd
```

**Se o diretorio for a pasta atual:**
- O servidor ja esta rodando
- Apenas informe o link ao usuario (a porta esta na saida do primeiro comando)
- **NAO inicie outro servidor**

### 2. Se NAO houver servidor desta pasta

Verifique quais portas estao ocupadas e escolha o primeiro par livre:

- 8888 / 3999
- 8889 / 4000
- 8890 / 4001
- 8891 / 4002
- 8892 / 4003

### 3. Iniciar o servidor

```bash
netlify dev --port {PRINCIPAL} --functions-port {FUNCOES}
```

---

## Resumo do Fluxo

```
1. Verificar processos node nas portas 8888-8892 e 3999-4003
   |
   +-- Encontrou processo?
   |   |
   |   +-- E desta pasta? → Informar link existente, NAO criar novo
   |   |
   |   +-- E de outra pasta? → Escolher proximo par de portas livre
   |
   +-- Nenhum processo? → Usar portas padrao 8888/3999

2. Iniciar servidor (se necessario)

3. Informar URL ao usuario
```

---

## FALLBACK PROIBIDO

Se o Netlify Dev falhar por qualquer motivo (permissao, porta, erro), **NUNCA** use alternativas:
- **NUNCA** `python -m http.server`
- **NUNCA** `python3 -m http.server`
- **NUNCA** `npx serve`
- **NUNCA** `npx http-server`
- **NUNCA** qualquer outro servidor

Em vez disso, **corrija o problema** e tente `netlify dev` novamente. Se nao conseguir resolver, informe o erro ao usuario — mas NUNCA suba um servidor alternativo.

---

## Troubleshooting

### Erro de permissao (EACCES / Permission denied)

Problema comum em macOS quando o Netlify CLI foi instalado com `sudo`. Arquivos em `~/.npm` e/ou `~/Library/Preferences/netlify/` ficam com owner root, impedindo o `netlify dev` de funcionar.

**VOCE DEVE corrigir isso automaticamente. NUNCA peca ao usuario para rodar comandos no terminal.**

```bash
sudo chown -R $(whoami):$(id -gn) ~/.npm 2>/dev/null
sudo chown -R $(whoami):$(id -gn) ~/Library/Preferences/netlify 2>/dev/null
```

Apos corrigir as permissoes, tente `netlify dev` novamente.

Se o `sudo` pedir senha, informe ao usuario:
> "Preciso corrigir um problema de permissao. O sistema vai pedir sua senha de administrador do Mac — e a mesma que voce usa para desbloquear o computador."

### netlify: command not found

**IMPORTANTE:** NUNCA use `sudo npm install`. Isso causa o problema de permissao acima.

Se precisar instalar:

```bash
sudo chown -R $(whoami):$(id -gn) ~/.npm 2>/dev/null
npm install -g netlify-cli
```

Se mesmo apos corrigir permissoes o `npm install -g` falhar com EACCES, configure o diretorio global do npm:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g netlify-cli
```

### Servidor nao atualiza

Cache do navegador. Hard refresh:
- Mac: `Cmd+Shift+R`
- Windows: `Ctrl+Shift+R`

---

## Ao Finalizar

Informe a URL ao usuario:

> "Servidor iniciado. Acesse: http://localhost:{PORTA}"

Ou se ja existia:

> "Servidor ja esta rodando. Acesse: http://localhost:{PORTA}"

Apos fornecer o link:
1. Aguarde o usuario visualizar
2. **PARE COMPLETAMENTE E AGUARDE**

**NUNCA** continue para outras etapas automaticamente.
