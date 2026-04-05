# Checklist Hero — Validacao Ativa

Este checklist e OBRIGATORIO antes de apresentar o hero ao usuario. Se qualquer item falhar, REESCREVER o hero antes de continuar.

## Checklist

- [ ] **Layout nao e coluna centralizada simples?** O hero DEVE ter: layout assimetrico, split, off-grid, OU elementos visuais alem de texto (canvas, video, imagem, 3D, formas SVG)
- [ ] **Tem efeito interativo/animado FUNCIONANDO?** Nao conta: fade-in de texto, opacity transitions. Conta: particulas, shaders, parallax layers, kinetic type, spotlight, 3D objects, gradient mesh animado
- [ ] **O codigo do efeito veio da biblioteca?** Compare com o arquivo original em `references/effects/`. Se o JS tem menos de 70% das linhas do original, foi simplificado — recopiar
- [ ] **Hero NAO tem animacao de ENTRADA?** (opacity:0, fade-in, data-aos no hero = PROIBIDO). Animacoes pos-carregamento (particulas, gradientes, movimento continuo) sao OK e encorajadas
- [ ] **Nao e fundo chapado + texto branco?** Deve haver profundidade visual: gradientes animados, particulas, camadas, texturas, elementos decorativos

## Se falhar

1. Releia o arquivo do efeito da biblioteca escolhido
2. Copie o codigo LITERALMENTE (HTML, CSS, JS)
3. Adapte APENAS os tokens CSS (var(--color-*), var(--space-*))
4. Ajuste o layout para nao ser centralizado simples
5. Revalide o checklist
