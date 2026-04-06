---
name: iniciar
description: Scaffold de projeto novo para landing page. Cria pasta, copia templates, git init, configura netlify.toml, inicia Netlify Dev.
---

# Instrucoes

Voce vai preparar o ambiente para um novo projeto de landing page.

## Antes de Comecar

Leia `rules.md` na raiz do plugin para garantir que todas as regras globais serao respeitadas.

## Escopo

Esta skill APENAS:
- Cria a estrutura de pastas do projeto
- Copia os templates base
- Inicializa git
- Configura o redirect da home no netlify.toml
- Inicia o Netlify Dev

Esta skill NAO:
- Cria copy
- Faz design
- Implementa paginas
- Configura tracking ou deploy

## Processo

### 1. Coletar Nome da Pagina

Pergunte ao usuario qual sera o nome da pasta da pagina (ex: "pagina-vendas", "lp-lancamento", "pagina-obrigado").

O nome deve ser:
- Lowercase
- Sem espacos (usar hifens)
- Sem caracteres especiais ou acentos

### 2. Criar Estrutura do Projeto

Se o projeto ainda nao tem a estrutura base, copie os templates:

```
projeto/
├── NOME-DA-PAGINA/         <- pasta da pagina
│   └── (vazio por enquanto, sera preenchido nas proximas skills)
├── images/                  <- pasta de imagens na RAIZ
├── index.html               <- copiado de templates/index.html
├── style.css                <- copiado de templates/style.css
├── script.js                <- copiado de templates/script.js
└── netlify.toml             <- copiado de templates/netlify.toml
```

Copie os arquivos de `templates/` para a raiz do projeto:
- `templates/index.html` → `./index.html`
- `templates/style.css` → `./style.css`
- `templates/script.js` → `./script.js`
- `templates/netlify.toml` → `./netlify.toml`

Crie a pasta `images/` na raiz.
Crie a pasta com o nome da pagina fornecido pelo usuario.

Se o projeto ja tem esses arquivos (nao e a primeira pagina), apenas crie a nova pasta da pagina.

### 3. Configurar Redirect da Home

Verifique no `netlify.toml` se ja existe um redirect da home (um `[[redirects]]` com `from = "/"`).

Se NAO existir nenhum redirect da home, descomente e configure o redirect no `netlify.toml`:

```toml
# Redirect da home para a pagina principal
[[redirects]]
  from = "/"
  to = "/NOME-DA-PAGINA/"
  status = 302
  force = true
```

Substitua `NOME-DA-PAGINA` pelo nome real da pasta criada.

Se ja existir um redirect da home, NAO altere.

### 4. Inicializar Git

Se o projeto ainda nao tem git:

```bash
git init
git add .
git commit -m "Scaffold inicial"
```

Se ja tem git, faca um commit com as alteracoes:

```bash
git add .
git commit -m "Adicionar pasta NOME-DA-PAGINA"
```

### 5. Iniciar Netlify Dev

Consulte `references/local-server.md` para o processo completo de inicializacao do servidor.

Resumo:
1. Verificar se ja existe servidor rodando
2. Se nao, iniciar na RAIZ do projeto: `netlify dev --port 8888 --functions-port 3999`
3. Informar a URL ao usuario

## Ao Finalizar

Informe ao usuario:
1. Estrutura criada com sucesso
2. URL do servidor local
3. Proxima etapa: usar `gerar-copy` para criar os textos da pagina

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario.
