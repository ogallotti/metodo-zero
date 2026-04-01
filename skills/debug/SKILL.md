---
name: debug
description: Investigacao sistematica de problemas em landing pages. Coletar info, hipoteses, testar, corrigir, prevenir.
---

# Instrucoes

O usuario encontrou um problema e precisa de ajuda para investigar e resolver.

## Antes de Comecar

1. Leia `rules.md` na raiz do plugin

## Processo de Investigacao Sistematica

### 1. Coletar Informacoes

Antes de qualquer coisa, entenda o problema:

- **O que esta acontecendo?** (sintoma)
- **O que deveria acontecer?** (comportamento esperado)
- **Quando comecou?** (mudancas recentes)
- **Ha mensagem de erro?** (console, terminal)

Se o usuario nao forneceu essas informacoes, pergunte.

### 2. Formar Hipoteses

Liste as possiveis causas, ordenadas por probabilidade:

```
1. [Causa mais provavel]
2. [Segunda possibilidade]
3. [Menos provavel]
```

### 3. Investigar Sistematicamente

Teste cada hipotese, uma por vez:

- Verifique o codigo relacionado
- Cheque o console do navegador
- Verifique o terminal do servidor
- Use eliminacao: descarte hipoteses ate encontrar a causa

### 4. Corrigir e Prevenir

Apos identificar a causa:
- Aplique a correcao
- Explique por que o problema ocorreu
- Sugira como prevenir no futuro (se aplicavel)

## Formato de Resposta

```
## Investigacao: [Problema]

### Sintoma
[O que esta acontecendo]

### Informacoes Coletadas
- Erro: [mensagem]
- Arquivo: [caminho]
- Linha: [numero]

### Hipoteses
1. [Causa mais provavel]
2. [Segunda possibilidade]

### Investigacao
Hipotese 1: [O que verifiquei] → [Resultado]
Hipotese 2: [O que verifiquei] → [Resultado]

### Causa Raiz
[Explicacao]

### Correcao
[O que foi feito]

### Prevencao
[Como evitar no futuro]
```

## Problemas Comuns em Landing Pages

- Imagem nao aparece → Caminho errado, falta CDN Netlify, arquivo nao existe
- Layout quebrado no mobile → Falta media query, overflow, largura fixa
- Formulario nao envia → Falta `data-netlify="true"`, action errado, `form-name` hidden divergente
- Animacao nao funciona → AOS nao inicializado, classe errada
- Fonte nao carrega → URL errada, CORS, fallback nao definido
- CLS alto → Imagem sem width/height, AOS sem disableMutationObserver
- LCP lento → Imagem grande, hero sem `loading="eager"` ou sem preload

## Ferramentas de Diagnostico

- **Console do Navegador** (F12): Erros JS, 404s, warnings
- **DevTools Network**: Recursos que falharam, tempos, tamanhos
- **Lighthouse** (DevTools): Score, problemas, sugestoes

## Principios

1. Pergunte antes de assumir — colete contexto completo
2. Teste hipoteses — nao adivinhe aleatoriamente
3. Explique o porque — nao apenas o que corrigir
4. Previna recorrencia — sugira melhorias

## Ao Finalizar

1. Confirme que esta funcionando
2. Explique a causa raiz
3. PARE e aguarde instrucao do usuario
