# Form Input Animated

## Quando usar
Inputs de formulário com labels flutuantes e bordas animadas — o label sobe ao focar/preencher, a borda faz uma animação de highlight, e validação visual é aplicada automaticamente. Ideal para forms de contato, login, checkout, signup, qualquer formulário. Tom profissional e polido. Melhora a UX de formulários sem dependências.

## Parâmetros customizáveis
| Variável | Default | Descrição |
|-|-|-|
| `--fi-accent` | `#6366f1` | Cor de destaque (focus/active) |
| `--fi-error` | `#ef4444` | Cor de erro |
| `--fi-success` | `#22c55e` | Cor de sucesso |
| `--fi-bg` | `transparent` | Background do input |
| `--fi-border` | `rgba(255,255,255,0.2)` | Cor da borda default |
| `--fi-radius` | `0.5rem` | Border-radius |

## Dependências
- CSS + JavaScript vanilla — nenhuma dependência externa

## HTML

```html
<form class="fi-form" id="animatedForm" novalidate>
  <div class="fi-field">
    <input type="text" class="fi-field__input" id="fiName" required placeholder=" " autocomplete="name" />
    <label class="fi-field__label" for="fiName">Full Name</label>
    <div class="fi-field__bar"></div>
    <span class="fi-field__message"></span>
  </div>

  <div class="fi-field">
    <input type="email" class="fi-field__input" id="fiEmail" required placeholder=" " autocomplete="email" />
    <label class="fi-field__label" for="fiEmail">Email Address</label>
    <div class="fi-field__bar"></div>
    <span class="fi-field__message"></span>
  </div>

  <div class="fi-field">
    <textarea class="fi-field__input fi-field__input--textarea" id="fiMessage" required placeholder=" " rows="4"></textarea>
    <label class="fi-field__label" for="fiMessage">Message</label>
    <div class="fi-field__bar"></div>
    <span class="fi-field__message"></span>
  </div>

  <button type="submit" class="fi-form__submit">Send Message</button>
</form>
```

## CSS

```css
.fi-form {
  --fi-accent: var(--color-primary, #6366f1);
  --fi-error: #ef4444;
  --fi-success: #22c55e;
  --fi-bg: transparent;
  --fi-border: rgba(255, 255, 255, 0.2);
  --fi-radius: 0.5rem;

  width: min(90%, 32rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(2rem, 5vw, 4rem) 0;
}

.fi-field {
  position: relative;
}

.fi-field__input {
  width: 100%;
  padding: 1rem 0.875rem 0.5rem;
  font-size: 1rem;
  color: var(--color-text, #ffffff);
  background: var(--fi-bg);
  border: 1.5px solid var(--fi-border);
  border-radius: var(--fi-radius);
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.fi-field__input--textarea {
  resize: vertical;
  min-height: 6rem;
}

.fi-field__label {
  position: absolute;
  left: 0.875rem;
  top: 0.875rem;
  font-size: 1rem;
  color: var(--color-text-muted, rgba(255, 255, 255, 0.5));
  pointer-events: none;
  transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  transform-origin: left top;
}

/* Float label on focus or when filled */
.fi-field__input:focus ~ .fi-field__label,
.fi-field__input:not(:placeholder-shown) ~ .fi-field__label {
  transform: translateY(-0.625rem);
  font-size: 0.75rem;
  color: var(--fi-accent);
}

/* Animated underline bar */
.fi-field__bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--fi-accent);
  border-radius: 0 0 var(--fi-radius) var(--fi-radius);
  transition: width 0.3s ease, left 0.3s ease;
}

.fi-field__input:focus ~ .fi-field__bar {
  width: 100%;
  left: 0;
}

/* Focus border */
.fi-field__input:focus {
  border-color: var(--fi-accent);
}

/* Validation states */
.fi-field--error .fi-field__input { border-color: var(--fi-error); }
.fi-field--error .fi-field__label { color: var(--fi-error); }
.fi-field--error .fi-field__bar { background: var(--fi-error); }
.fi-field--error .fi-field__message { color: var(--fi-error); display: block; }

.fi-field--success .fi-field__input { border-color: var(--fi-success); }
.fi-field--success .fi-field__bar { background: var(--fi-success); }

.fi-field__message {
  display: none;
  font-size: 0.75rem;
  margin-top: 0.375rem;
  padding-left: 0.875rem;
}

/* Submit button */
.fi-form__submit {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: var(--fi-accent);
  border: none;
  border-radius: var(--fi-radius);
  cursor: pointer;
  transition: filter 0.2s, transform 0.15s;
}

.fi-form__submit:hover { filter: brightness(1.1); }
.fi-form__submit:active { transform: scale(0.98); }

.fi-form__submit:focus-visible {
  outline: 2px solid var(--fi-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .fi-field__label { transition: none; }
  .fi-field__bar { transition: none; }
}
```

## JavaScript

```javascript
(function () {
  const form = document.getElementById('animatedForm');
  if (!form) return;

  const fields = form.querySelectorAll('.fi-field');

  function validateField(field) {
    const input = field.querySelector('.fi-field__input');
    const message = field.querySelector('.fi-field__message');
    if (!input) return true;

    field.classList.remove('fi-field--error', 'fi-field--success');
    message.textContent = '';

    if (!input.value.trim() && input.required) {
      field.classList.add('fi-field--error');
      message.textContent = 'This field is required';
      return false;
    }

    if (input.type === 'email' && input.value) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (!emailValid) {
        field.classList.add('fi-field--error');
        message.textContent = 'Please enter a valid email';
        return false;
      }
    }

    if (input.value.trim()) {
      field.classList.add('fi-field--success');
    }

    return true;
  }

  /* Validate on blur */
  fields.forEach((field) => {
    const input = field.querySelector('.fi-field__input');
    if (!input) return;

    input.addEventListener('blur', () => {
      if (input.value.trim()) validateField(field);
    });

    /* Clear error on input */
    input.addEventListener('input', () => {
      if (field.classList.contains('fi-field--error')) {
        field.classList.remove('fi-field--error');
        field.querySelector('.fi-field__message').textContent = '';
      }
    });
  });

  /* Submit validation */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    fields.forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (valid) {
      const btn = form.querySelector('.fi-form__submit');
      btn.textContent = 'Sent!';
      btn.style.background = 'var(--fi-success)';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        form.reset();
        fields.forEach(f => f.classList.remove('fi-field--success'));
      }, 2000);
    }
  });
})();
```

## Integração
Cada `.fi-field` contém input, label flutuante, barra animada e mensagem de validação. O label flutua via CSS `:focus` e `:not(:placeholder-shown)` — requer `placeholder=" "` no input. A validação roda no blur (campos preenchidos) e no submit. Sem dependências, acessível via teclado, funciona com qualquer tipo de input.

## Variações

### Variação 1: Outlined Style (Material-like)
Label flutua para cima cortando a borda.
```css
.fi-field--outlined .fi-field__label {
  background: var(--color-bg, #0a0a0a);
  padding: 0 0.25rem;
}
.fi-field--outlined .fi-field__input:focus ~ .fi-field__label,
.fi-field--outlined .fi-field__input:not(:placeholder-shown) ~ .fi-field__label {
  transform: translateY(-1.5rem);
}
.fi-field--outlined .fi-field__bar { display: none; }
```

### Variação 2: Underline Only (Minimal)
Apenas borda inferior, estilo minimalista.
```css
.fi-field--minimal .fi-field__input {
  border: none;
  border-bottom: 1.5px solid var(--fi-border);
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.fi-field--minimal .fi-field__label { left: 0; }
.fi-field--minimal .fi-field__bar {
  border-radius: 0;
  height: 2px;
}
```

### Variação 3: With Character Counter
Input com contador de caracteres animado.
```html
<div class="fi-field">
  <input type="text" class="fi-field__input" maxlength="100" data-fi-counter placeholder=" " />
  <label class="fi-field__label">Username</label>
  <div class="fi-field__bar"></div>
  <span class="fi-field__counter">0/100</span>
</div>
```
```css
.fi-field__counter {
  position: absolute;
  right: 0.875rem;
  bottom: -1.25rem;
  font-size: 0.6875rem;
  color: var(--color-text-muted, rgba(255,255,255,0.4));
  transition: color 0.2s;
}
.fi-field--near-limit .fi-field__counter { color: var(--fi-error); }
```
```javascript
form.querySelectorAll('[data-fi-counter]').forEach(input => {
  const counter = input.closest('.fi-field').querySelector('.fi-field__counter');
  const max = input.maxLength;
  input.addEventListener('input', () => {
    const len = input.value.length;
    counter.textContent = `${len}/${max}`;
    input.closest('.fi-field').classList.toggle('fi-field--near-limit', len > max * 0.9);
  });
});
```
