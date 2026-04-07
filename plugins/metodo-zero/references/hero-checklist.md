# Checklist Hero — Validacao Ativa

Este checklist e OBRIGATORIO antes de apresentar o hero ao usuario. Se qualquer item falhar, REESCREVER o hero antes de continuar.

## Checklist

- [ ] **Layout nao e coluna centralizada simples?** O hero DEVE ter: layout assimetrico, split, off-grid, OU elementos visuais alem de texto (canvas, video, imagem, 3D, formas SVG)
- [ ] **Tem efeito interativo/animado FUNCIONANDO?** Nao conta: fade-in de texto, opacity transitions. Conta: particulas, shaders, parallax layers, kinetic type, spotlight, 3D objects, gradient mesh animado
- [ ] **O codigo do efeito veio da biblioteca?** Compare com o `script.js` original em `references/effects/{categoria}/{slug}/`. Se o JS integrado tem menos de 70% das linhas do original, foi simplificado — recopiar do arquivo real
- [ ] **Hero NAO tem animacao de ENTRADA?** (opacity:0, fade-in, data-aos no hero = PROIBIDO). Animacoes pos-carregamento (particulas, gradientes, movimento continuo) sao OK e encorajadas
- [ ] **Nao e fundo chapado + texto branco?** Deve haver profundidade visual: gradientes animados, particulas, camadas, texturas, elementos decorativos

## Se falhar

1. Navegue ate `references/effects/{categoria}/{slug}/`
2. Leia `script.js`, `style.css` e o HTML do `demo.html`
3. Copie o codigo LITERALMENTE para o projeto
4. Adapte APENAS os tokens CSS (var(--color-*), var(--space-*)) conforme o design system
5. Consulte o `meta.json` para parametros customizaveis e o `README.md` para integração
6. Ajuste o layout para nao ser centralizado simples
7. Revalide o checklist
