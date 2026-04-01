---
name: configurar-tracking
description: Configuracao de GTM e Meta Pixel em landing pages. Coleta IDs, instala snippets, configura eventos, testa.
---

# Instrucoes

O usuario quer configurar tracking (GTM e/ou Meta Pixel) na landing page. Consulte `references/tracking.md` para referencia tecnica completa.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin
2. Leia `references/tracking.md` — contem snippets, melhores praticas, troubleshooting

## REGRA DE OURO: Autonomia Total

VOCE DEVE implementar tudo sozinho. O usuario so precisa fornecer os IDs e dizer quais eventos quer rastrear.

---

## Etapa 1: Coletar Informacoes

### Identificar a Pasta da Pagina

Localize a pasta da pagina.

### Perguntar ao Usuario

Faca TODAS estas perguntas de uma vez:

1. **Quais plataformas de anuncio voce usa?**
   - Meta Ads (Facebook/Instagram)
   - Google Ads
   - Ambos
   - Outro

2. **IDs de tracking:**
   - Se Meta Ads: "Qual o ID do seu Pixel do Meta? (numero com ~15 digitos)"
   - Se Google Ads/GA4: "Qual o ID do seu container GTM? (formato GTM-XXXXXXX)"

3. **Alem do basico (PageView + Lead), quer rastrear mais alguma acao?**
   - Scroll depth
   - Cliques em CTAs
   - Conversao na pagina de obrigado
   - Outro

4. **Ja existe uma pagina de obrigado?** (se sim, qual o caminho)

---

## Etapa 2: Implementar

### Ordem de Insercao no `<head>`

1. **GTM** (se houver) — PRIMEIRO, logo apos metas iniciais
2. **Meta Pixel** (se houver) — SEGUNDO, apos GTM
3. Open Graph, Favicon, Fonts, CSS — DEPOIS
4. Scripts da pagina — POR ULTIMO

Consulte `references/tracking.md` para os snippets exatos.

### Para GTM
- Adicionar snippet `<head>` na posicao correta
- Adicionar `<noscript>` imediatamente apos abrir `<body>`
- Substituir `GTM-XXXXXXX` pelo ID real

### Para Meta Pixel
- Adicionar codigo base no `<head>` (apos GTM se houver)
- Substituir `PIXEL_ID_AQUI` pelo ID real
- Incluir `<noscript>` img tag

### Verificar script.js

O template ja envia `fbq('track', 'Lead')` e `dataLayer.push({ event: 'generate_lead' })` no submit. Verificar se estao presentes.

### Pagina de Obrigado

Se existir pagina de obrigado:
- Adicionar os MESMOS snippets (mesmos IDs)
- NAO adicionar evento Lead aqui (ja disparado no submit)

### Eventos Adicionais

Consulte `references/tracking.md` para snippets de scroll depth e CTA click tracking.

---

## Etapa 3: Apresentar Resumo

Informe ao usuario:

```
TRACKING CONFIGURADO
====================
GTM: [Sim/Nao] - Container: GTM-XXXXXXX
Meta Pixel: [Sim/Nao] - ID: XXXXXXXXXXXXXXX

EVENTOS ATIVOS
==============
- PageView (automatico ao carregar)
- Lead (automatico no submit do form)
[- Scroll Depth (se configurado)]
[- CTA Click (se configurado)]

PROXIMOS PASSOS NO DASHBOARD
=============================
[Instrucoes especificas conforme plataformas configuradas]

COMO TESTAR
============
1. Meta Pixel Helper (extensao Chrome)
2. GTM Preview Mode
3. Events Manager > Test Events
```

---

## Etapa 4: Testar

Faca verificacoes possiveis:
- Abrir site localmente (consulte `references/local-server.md`)
- Verificar console por erros
- Verificar snippets na posicao correta
- Verificar IDs substituidos

O teste completo (eventos chegando nos dashboards) so funciona com site publicado.

## Ao Finalizar

1. Informe o que foi configurado
2. Liste proximos passos no dashboard
3. Explique como testar
4. Sugira: "Use `publicar` para colocar o site no ar e testar o tracking."
5. PARE e aguarde instrucao do usuario
