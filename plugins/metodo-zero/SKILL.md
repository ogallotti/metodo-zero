---
name: metodo-zero
description: Cria landing pages de alto impacto visual com HTML/CSS/JS puro. Zero build step, zero dependencia, hospedagem Netlify. Pipeline automatizada da copy ao deploy.
---

# Metodo Zero

Plugin para criacao de landing pages profissionais com qualidade visual de nivel awwwards. HTML/CSS/JS puro, zero build step, hospedagem Netlify.

## Antes de Qualquer Coisa

Leia `rules.md` neste diretorio para as regras globais do framework.

## Skills Disponiveis

### Pipeline Completa (ponto de entrada principal)
- `metodo-zero:criar-pipeline` - Pipeline orquestrada: briefing ao deploy automatico
- `metodo-zero:criar-agentes` - Agent Team: especialistas coordenados

### Consulta e Inspiração
- `metodo-zero:referencias` - Modo consultor: navega efeitos no playground, font pairings, paletas, arquétipos e regras de copy. Use para projetos existentes

### Skills Individuais (uso avulso)
- `metodo-zero:iniciar` - Scaffold de novo projeto
- `metodo-zero:gerar-copy` - Geracao de copy persuasiva
- `metodo-zero:gerar-design` - Design system + hero + primeira secao
- `metodo-zero:gerar-layout` - Especificacao visual completa de todas as secoes
- `metodo-zero:desenvolver` - Construcao da pagina completa
- `metodo-zero:publicar` - Deploy Netlify (GitHub + CI/CD)
- `metodo-zero:previsualizar` - Deploy Preview via Pull Request
- `metodo-zero:visualizar-local` - Servidor local (Netlify Dev)
- `metodo-zero:otimizar` - Performance (PageSpeed 90+)
- `metodo-zero:debug` - Investigacao de problemas
- `metodo-zero:configurar-tracking` - GTM + Meta Pixel

## Fluxo Principal

```
/metodo-zero:criar-pipeline  ou  /metodo-zero:criar-agentes
    |
    v
Briefing → Copy → Design System → Layout Spec → Build → Otimizar → Publicar
```

## References

O diretorio `references/` contem documentacao tecnica consultada pelas skills:
- `creative-reference.md` - 70+ arquetipos, 100+ constraints, 35+ font pairings
- `copy-rules.md` - Regras anti-IA para copy
- `design-system-guide.md` - Como gerar design systems completos
- `effects/` - Biblioteca de 55 efeitos visuais testados (hero, scroll, transitions, micro)
- `forms.md` - Formularios Netlify + intl-tel-input
- `tracking.md` - GTM + Meta Pixel
- `deploy.md` - GitHub + Netlify CI/CD
- `local-server.md` - Netlify Dev
- `optimize.md` - Checklist de performance
