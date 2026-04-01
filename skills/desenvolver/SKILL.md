---
name: desenvolver
description: Constroi a pagina completa seguindo layout.md. Copia efeitos da biblioteca, aplica design system, valida fidelidade via subagent QA.
---

# Instrucoes

Voce vai construir a pagina completa seguindo a especificacao do `layout.md`. Seu trabalho e EXECUTAR fielmente o que foi planejado, sem simplificar ou omitir nada.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/optimize.md` — regras de performance que devem ser seguidas durante a construcao

## Escopo

Esta skill APENAS:
- Implementa todas as secoes especificadas no `layout.md`
- Usa efeitos da biblioteca como base
- Valida fidelidade via subagent QA
- Abre preview para validacao visual

Esta skill NAO:
- Cria copy ou altera textos
- Muda o design system
- Faz deploy ou otimizacao de performance

---

## Etapa 1: Carregar a Especificacao

### Identificar a Pasta da Pagina

Localize a pasta da pagina. Pastas `_backup_` sao versoes antigas — IGNORE.

### Arquivos Necessarios

1. **layout.md** — especificacao completa de todas as secoes
2. **index.html + style.css** — design aprovado (hero + primeira secao)
3. **copy.md** — textos (para referencia)

Se o `layout.md` nao existir, informe ao usuario que ele precisa usar `gerar-layout` primeiro.

### Planejar a Execucao

Antes de comecar a codar, liste:
1. Quantas secoes serao construidas
2. Quais efeitos da biblioteca serao usados
3. Bibliotecas externas necessarias (CDN)
4. Ordem de execucao

---

## Etapa 2: Construir Secao por Secao

### Processo para cada secao

1. **Releia a especificacao** da secao no `layout.md`
2. **Copie o efeito da biblioteca** referenciado (se houver)
3. **Adapte parametros** ao design system (usar `var(--...)`)
4. **Implemente o HTML** seguindo a estrutura
5. **Implemente o CSS** com TODOS os valores especificados
6. **Implemente interatividade** (hover, animacoes, scroll effects)
7. **Checklist de fidelidade** antes de avancar

### Usar Efeitos da Biblioteca

Quando o `layout.md` referencia um efeito de `references/effects/`:

1. Leia o arquivo do efeito
2. Copie o codigo (HTML, CSS, JS)
3. Adapte cores para tokens do projeto (`var(--color-primary)`, etc.)
4. Adapte tamanhos e espacamentos para tokens (`var(--space-xl)`, etc.)
5. Adapte timings para tokens (`var(--duration-slow)`, `var(--ease-dramatic)`, etc.)
6. Adapte textos conforme a copy
7. NAO reinvente efeitos que ja existem na biblioteca

### Checklist de Fidelidade por Secao

Apos cada secao implementada, verifique contra o `layout.md`:

- [ ] Arquetipo/composicao respeitado?
- [ ] Constraints criativos aplicados?
- [ ] Efeito da biblioteca aplicado conforme especificado?
- [ ] DNA Visual presente (elemento recorrente, tratamento de midia, etc.)?
- [ ] Valores exatos corretos (cores, tamanhos, espacamentos)?
- [ ] Design system tokens usados (`var(--...)` em vez de valores hardcoded)?
- [ ] Todos os estados implementados (hover, active, focus)?
- [ ] Animacoes com duracao, delay e easing corretos?
- [ ] Responsividade implementada?

Se detectar simplificacao em relacao ao `layout.md`, corrija antes de avancar.

### Regras de Implementacao

#### HTML
- Semantica correta (section, article, figure, etc.)
- `data-aos` onde especificado (NUNCA no hero)
- Classes descritivas e consistentes
- Atributos de acessibilidade

#### CSS
- Siga EXATAMENTE os valores do `layout.md`
- Use tokens do design system para tudo (`var(--color-*)`, `var(--space-*)`, etc.)
- Implemente TODOS os estados (hover, active, focus)
- Responsividade completa (mobile-first)
- `prefers-reduced-motion` respeitado

#### JavaScript
- Adicione funcoes no `script.js` existente
- Bibliotecas pesadas via Dynamic Import + IntersectionObserver (consulte `references/optimize.md`)
- NUNCA linke modulos pesados no HTML (Three.js, GSAP pesado)

#### Imagens
- SEMPRE via Netlify CDN: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`
- width/height NUMERICOS (nunca "auto")
- Hero: `loading="eager"` + `fetchpriority="high"`
- Demais: `loading="lazy"`
- Pasta `/images/` na RAIZ do projeto

### O que NUNCA fazer

- NUNCA omitir uma animacao porque "da trabalho"
- NUNCA simplificar um efeito porque "e complexo"
- NUNCA pular a responsividade
- NUNCA ignorar estados de hover/focus
- NUNCA usar valores hardcoded quando existe token
- NUNCA mudar medidas especificadas
- NUNCA remover elementos decorativos

---

## Etapa 3: Bibliotecas Permitidas (CDN)

Se a especificacao pedir, usar via CDN:

```html
<!-- Icones -->
<script src="https://unpkg.com/@phosphor-icons/web" defer></script>

<!-- GSAP (se necessario — preferir Dynamic Import para pesados) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

Para bibliotecas pesadas (Three.js, GSAP com muitos plugins), usar Dynamic Import:

```javascript
lazyLoadModule('#secao-3d', async () => {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js');
  initScene(THREE);
});
```

---

## Etapa 4: Subagent QA de Fidelidade

Apos a pagina completa, invoque o subagent QA de Fidelidade usando a ferramenta Agent:

```
Prompt para o subagent:
"Voce e o QA de Fidelidade, um verificador meticuloso de implementacao de landing pages.

Leia o arquivo [CAMINHO/layout.md] (especificacao).
Leia o arquivo [CAMINHO/index.html] (implementacao).
Leia o arquivo [CAMINHO/style.css] (estilos).
Leia o script.js se houver codigo adicionado.

Compare SECAO POR SECAO:
1. O arquetipo especificado foi implementado fielmente?
2. Os constraints foram aplicados?
3. Os efeitos da biblioteca estao presentes e funcionais?
4. O DNA Visual esta consistente em todas as secoes?
5. Valores exatos (cores, tamanhos, espacamentos) estao corretos?
6. Tokens do design system estao sendo usados (nao hardcoded)?
7. Todos os estados (hover, active, focus) foram implementados?
8. Animacoes tem duracao, delay e easing corretos?
9. Responsividade esta implementada?
10. Alguma secao foi simplificada ou omitida?

Retorne EXATAMENTE neste formato:
- VEREDITO: APROVADO ou DIVERGENCIAS ENCONTRADAS
- Se DIVERGENCIAS: liste CADA uma com:
  - Secao
  - O que o layout.md especifica
  - O que foi implementado
  - Severidade (CRITICA / MODERADA / MENOR)"
```

Se o QA encontrar divergencias:
- CRITICAS: corrija imediatamente
- MODERADAS: corrija antes de apresentar ao usuario
- MENORES: corrija se possivel, documente se nao

---

## Etapa 5: Checklist de Finalizacao

### Completude
- [ ] Todas as secoes do `layout.md` implementadas
- [ ] Nenhuma secao simplificada ou omitida
- [ ] Todos os elementos decorativos presentes

### Fidelidade Criativa
- [ ] Cada secao implementa o arquetipo especificado
- [ ] DNA Visual consistente em toda a pagina
- [ ] Font pairing mantido em toda a pagina
- [ ] Nenhum padrao generico introduzido

### Performance (consulte `references/optimize.md`)
- [ ] Hero SEM animacao de entrada (opacity:0, fade-in, data-aos)
- [ ] AOS com `disableMutationObserver: true` e `once: true`
- [ ] Imagens via Netlify CDN com width/height numerico
- [ ] Scripts pesados via Dynamic Import
- [ ] `prefers-reduced-motion` respeitado

### Acessibilidade
- [ ] Links/botoes com foco visivel
- [ ] Imagens com alt text
- [ ] Contraste de cores adequado
- [ ] Hierarquia de headings correta (h1 → h2 → h3)
- [ ] Formulario com labels corretos

### Responsividade
- [ ] Testado em 375px (mobile)
- [ ] Testado em 768px (tablet)
- [ ] Testado em 1440px (desktop)
- [ ] Nenhum overflow horizontal

### Validacao Final
- [ ] Console sem erros
- [ ] Network sem 404
- [ ] Formulario configurado e funcional

---

## Etapa 6: Preview e Apresentacao

### Abrir no Browser

Consulte `references/local-server.md` para iniciar Netlify Dev. Informe a URL ao usuario.

### Apresentar

1. Informe que a pagina esta pronta
2. Liste as secoes construidas
3. Destaque funcionalidades especiais
4. Forneca link para preview (OBRIGATORIO)
5. Peca feedback

## Ao Finalizar

Sugira proximos passos: "Quando estiver satisfeito, use `publicar` para deploy ou `otimizar` para melhorar performance."

Quando rodando standalone (fora de pipeline), PARE e aguarde instrucao do usuario. NUNCA faca deploy ou otimizacao automaticamente.
