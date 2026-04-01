# Regras Globais — Metodo Zero

Estas regras se aplicam a TODAS as skills do plugin. Leia ANTES de executar qualquer skill.

## Comunicacao

- Todas as mensagens, explicacoes e respostas em Portugues do Brasil
- Termos tecnicos e codigo permanecem em ingles
- NUNCA usar emojis (exceto se solicitado explicitamente pelo usuario)

## Autonomia Total

Este framework e para leigos. O usuario NAO sabe usar terminal.

VOCE DEVE executar TODOS os comandos sozinho. NUNCA peca para o usuario:
- "Rode este comando no terminal"
- "Execute X manualmente"
- "Abra o terminal e faca Y"

Comandos interativos (netlify init, gh auth, etc.):
1. Execute o comando
2. Envie os inputs necessarios para cada prompt
3. Continue ate concluir

**Unica excecao:** OAuth no navegador — informe ao usuario que ele precisa clicar em "Autorizar" no navegador que abriu automaticamente.

Se algo falhar, tente resolver sozinho. So peca ajuda ao usuario em ultimo caso, e mesmo assim, nunca peca para ele executar comandos.

## Servidor Local

Use a reference `references/local-server.md` para gerenciar o servidor de desenvolvimento.

- NUNCA rode multiplas instancias do servidor para a mesma pasta
- NUNCA use servidores alternativos (`python -m http.server`, `npx serve`, etc.)
- Se o Netlify Dev falhar, corrija o problema seguindo o Troubleshooting da reference `local-server.md`
- NUNCA suba outro servidor como fallback — o CDN de imagens e redirects so funcionam com Netlify Dev

## Imagens via Netlify CDN

Formato obrigatorio: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`

- NUNCA use caminhos diretos para imagens
- A pasta `/images/` DEVE estar na RAIZ do projeto (junto ao `netlify.toml`), NUNCA dentro da pasta da pagina
- Ao baixar imagens, sempre navegue para a raiz do projeto antes de criar a pasta e salvar os arquivos

## Hero sem Animacao de Entrada

NUNCA adicione animacoes de entrada (AOS, fade, opacity:0, data-aos) no hero. O hero deve aparecer instantaneamente.

Animacoes pos-carregamento sao permitidas e encorajadas (particulas, gradientes, movimento continuo).

## AOS em Elementos de Scroll

- Use `data-aos="fade-up"` em elementos que aparecem no scroll. NUNCA no hero
- Ao inicializar AOS, SEMPRE use `disableMutationObserver: true` para evitar CLS

## Formularios

Use o formulario existente no template `templates/index.html` como base. Ele ja tem intl-tel-input e Netlify Forms configurados. Consulte `references/forms.md` para detalhes.

## Caminhos Absolutos

Comece TODOS os caminhos de arquivos com `/`. NUNCA use caminhos relativos como `./` ou `../`.

## Zero Pacotes

Este template nao tem build step. NUNCA rode npm, node, ou comandos de build. HTML/CSS/JS puros.

## Fontes

NUNCA use fontes overused: Montserrat, Poppins, Roboto, Lato, Playfair Display, Open Sans, Raleway, Oswald, Merriweather, Source Sans Pro.

Consulte `references/creative-reference.md` para font pairings curados.

## Padroes Visuais Proibidos

NUNCA gere padroes genericos:
- Hero centralizado com headline + subheadline + botao
- 3 cards lado a lado
- Grid simetrico de features
- Icones genericos + titulo + paragrafo repetido 3x

Consulte `references/creative-reference.md` para arquetipos de composicao e constraints criativos.

## Estrutura de Pastas e Versoes

Cada pagina do site fica em sua propria pasta. A versao ATIVA sempre fica na raiz da pasta da pagina.

```
projeto/
├── pagina-vendas/
│   ├── index.html          <- versao ATIVA
│   ├── style.css
│   ├── copy.md
│   ├── layout.md
│   ├── _backup_v1/         <- versao anterior
│   └── _backup_v2/
├── pagina-obrigado/
│   ├── index.html
│   └── style.css
├── images/                  <- NA RAIZ, nunca dentro de pasta de pagina
└── netlify.toml
```

Regras:
1. A skill `iniciar` cria a pasta da pagina com o nome fornecido
2. Versao ativa = SEMPRE na raiz da pasta da pagina
3. Ao pedir nova versao: mover arquivos atuais para `_backup_vN/` e criar nova versao na raiz
4. Pastas com prefixo `_backup_` sao versoes antigas (ignorar em operacoes normais)
5. Numeracao sequencial: `_backup_v1/`, `_backup_v2/`, etc.

## Fluxo entre Skills

- Cada skill tem escopo definido. Ao finalizar uma skill, PARE e aguarde instrucao
- Pausar para feedback real do usuario (aprovar copy, aprovar design, dar feedback visual)
- NAO pausar para comandos mecanicos quando dentro de uma pipeline orquestrada
- NUNCA inicie a proxima skill automaticamente (exceto quando rodando via `criar-pipeline` ou `criar-agentes`)
