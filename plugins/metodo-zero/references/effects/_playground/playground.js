/**
 * Effects Library Playground — Método Zero
 * Zero build, zero deps, pure vanilla JS
 */

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────────
  let effects = [];
  let categories = {};
  let activeEffect = null;
  let currentParams = {};
  let activeTag = null;
  let searchQuery = '';

  // ─── DOM refs ─────────────────────────────────────────────────
  const app = document.getElementById('app');
  const sidebar = document.getElementById('sidebar');
  const catalog = document.getElementById('catalog');
  const catalogGrid = document.getElementById('catalogGrid');
  const preview = document.getElementById('preview');
  const previewFrame = document.getElementById('previewFrame');
  const previewTitle = document.getElementById('previewTitle');
  const controlsBody = document.getElementById('controlsBody');
  const copyBtn = document.getElementById('copyBtn');
  const tagFilters = document.getElementById('tagFilters');
  const viewportBtns = document.getElementById('viewportBtns');
  const searchInput = document.getElementById('searchInput');

  // ─── Category display names ───────────────────────────────────
  const categoryNames = {
    'backgrounds': 'Backgrounds',
    'text-effects': 'Text Effects',
    'cards': 'Cards',
    'buttons': 'Buttons',
    'borders': 'Borders',
    'scroll': 'Scroll',
    'transitions': 'Transitions',
    'decorative': 'Decorative',
    'media': 'Media',
    'layout': 'Layout',
    'components': 'Components'
  };

  // ─── Dependency badge labels ──────────────────────────────────
  const depLabels = {
    'vanilla': null,
    'gsap': 'GSAP',
    'three': 'Three',
    'lenis': 'Lenis',
    'canvas': 'Canvas'
  };

  // ─── Init ─────────────────────────────────────────────────────
  async function init() {
    await loadEffects();
    buildSidebar();
    buildCatalog();
    buildTagFilters();
  }

  // ─── Load all effects meta.json ───────────────────────────────
  async function loadEffects() {
    try {
      const response = await fetch('effects-index.json');
      effects = await response.json();
    } catch {
      // Fallback: scan for meta.json files
      effects = [];
      console.warn('effects-index.json not found. Run build-index to generate it.');
      return;
    }

    // Build category map
    categories = {};
    for (const effect of effects) {
      const cat = effect.category || 'uncategorized';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(effect);
    }
  }

  // ─── Sidebar ──────────────────────────────────────────────────
  function buildSidebar() {
    let html = '';
    const orderedCats = Object.keys(categoryNames);

    for (const cat of orderedCats) {
      const items = categories[cat];
      if (!items || items.length === 0) continue;

      html += `
        <div class="pg-category" data-category="${cat}">
          <div class="pg-category-header" onclick="this.parentElement.classList.toggle('collapsed')">
            <span>${categoryNames[cat]}</span>
            <span class="count">${items.length}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div class="pg-category-items">
            ${items.map(e => `
              <div class="pg-effect-item" data-slug="${e.slug}" onclick="selectEffect('${e.slug}')">
                <span>${e.name}</span>
                ${getDependencyBadge(e)}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    sidebar.innerHTML = html;
  }

  function getDependencyBadge(effect) {
    const deps = effect.dependencies || [];
    if (deps.length === 0 || (deps.length === 1 && deps[0] === 'vanilla')) return '';
    return deps
      .filter(d => d !== 'vanilla')
      .map(d => `<span class="dep-icon ${d}">${depLabels[d] || d}</span>`)
      .join('');
  }

  // ─── Catalog Grid ─────────────────────────────────────────────
  function buildCatalog() {
    const filtered = getFilteredEffects();

    if (filtered.length === 0) {
      catalogGrid.innerHTML = '<p style="color:var(--pg-text-dim);grid-column:1/-1;text-align:center;padding:48px">Nenhum efeito encontrado</p>';
      return;
    }

    catalogGrid.innerHTML = filtered.map(e => `
      <div class="pg-catalog-card" onclick="selectEffect('${e.slug}')">
        <div class="pg-catalog-card-preview">
          <iframe src="../${e.category}/${e.slug}/demo.html" loading="lazy" sandbox="allow-scripts allow-same-origin" title="${e.name}"></iframe>
        </div>
        <div class="pg-catalog-card-info">
          <div class="pg-catalog-card-name">${e.name}</div>
          <div class="pg-catalog-card-desc">${e.description || ''}</div>
          <div class="pg-catalog-card-tags">
            ${(e.tags || []).slice(0, 4).map(t => `<span class="pg-tag">${t}</span>`).join('')}
            ${getDependencyBadge(e)}
          </div>
        </div>
      </div>
    `).join('');
  }

  function getFilteredEffects() {
    let filtered = effects;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.tags || []).some(t => t.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
      );
    }

    if (activeTag) {
      filtered = filtered.filter(e =>
        (e.tags || []).includes(activeTag) ||
        (e.dependencies || []).includes(activeTag)
      );
    }

    return filtered;
  }

  // ─── Tag Filters ──────────────────────────────────────────────
  function buildTagFilters() {
    const tagCounts = {};
    for (const e of effects) {
      for (const t of (e.tags || [])) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }

    const sorted = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    tagFilters.innerHTML = sorted
      .map(([tag]) => `<button class="pg-tag" data-tag="${tag}" onclick="toggleTag('${tag}')">${tag}</button>`)
      .join('');
  }

  // ─── Select Effect ────────────────────────────────────────────
  window.selectEffect = function (slug) {
    const effect = effects.find(e => e.slug === slug);
    if (!effect) return;

    activeEffect = effect;
    currentParams = {};

    // Merge default values
    if (effect.params) {
      for (const [key, config] of Object.entries(effect.params)) {
        currentParams[key] = config.default;
      }
    }
    if (effect.jsParams) {
      for (const [key, config] of Object.entries(effect.jsParams)) {
        currentParams[key] = config.default;
      }
    }

    // Switch to detail view
    app.classList.remove('catalog-view');
    viewportBtns.style.display = 'flex';

    // Update sidebar active state
    document.querySelectorAll('.pg-effect-item').forEach(el => el.classList.remove('active'));
    const sidebarItem = document.querySelector(`.pg-effect-item[data-slug="${slug}"]`);
    if (sidebarItem) sidebarItem.classList.add('active');

    // Load preview
    previewTitle.textContent = effect.name;
    previewFrame.src = `../${effect.category}/${effect.slug}/demo.html`;

    // Build controls
    buildControls(effect);
  };

  // ─── Build Controls ───────────────────────────────────────────
  function buildControls(effect) {
    let html = '';

    // CSS Params
    if (effect.params && Object.keys(effect.params).length > 0) {
      html += `<div class="pg-controls-section">
        <div class="pg-controls-section-title">CSS Variables</div>
        ${Object.entries(effect.params).map(([key, config]) => buildControl(key, config, 'css')).join('')}
      </div>`;
    }

    // JS Params
    if (effect.jsParams && Object.keys(effect.jsParams).length > 0) {
      html += `<div class="pg-controls-section">
        <div class="pg-controls-section-title">JavaScript</div>
        ${Object.entries(effect.jsParams).map(([key, config]) => buildControl(key, config, 'js')).join('')}
      </div>`;
    }

    controlsBody.innerHTML = html || '<div class="pg-controls-section"><p style="color:var(--pg-text-dim);font-size:12px">Nenhum parâmetro customizável</p></div>';
  }

  function buildControl(key, config, scope) {
    const id = `ctrl-${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const value = currentParams[key] ?? config.default;

    switch (config.type) {
      case 'color':
        return `
          <div class="pg-control">
            <div class="pg-control-label">
              <span>${config.label || key}</span>
              <span class="pg-control-value">${value}</span>
            </div>
            <div class="pg-color-input">
              <input type="color" class="pg-color-swatch" id="${id}" value="${normalizeColor(value)}"
                onchange="updateParam('${key}', this.value, '${scope}')">
              <input type="text" class="pg-color-hex" value="${value}"
                onchange="updateParam('${key}', this.value, '${scope}')">
            </div>
          </div>`;

      case 'boolean':
        return `
          <div class="pg-control">
            <div class="pg-control-label">
              <span>${config.label || key}</span>
              <div class="pg-toggle ${value ? 'active' : ''}" id="${id}"
                onclick="this.classList.toggle('active'); updateParam('${key}', this.classList.contains('active'), '${scope}')">
              </div>
            </div>
          </div>`;

      case 'select':
        return `
          <div class="pg-control">
            <div class="pg-control-label"><span>${config.label || key}</span></div>
            <select class="pg-select" id="${id}" onchange="updateParam('${key}', this.value, '${scope}')">
              ${(config.options || []).map(o => `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          </div>`;

      case 'duration':
      case 'number':
      case 'size': {
        const numVal = parseFloat(value);
        const unit = typeof value === 'string' ? value.replace(/[\d.-]/g, '') : '';
        const min = config.min ?? 0;
        const max = config.max ?? (config.type === 'duration' ? 2000 : config.type === 'size' ? 200 : 100);
        const step = config.step ?? (config.type === 'duration' ? 10 : config.type === 'size' ? 1 : 0.1);
        return `
          <div class="pg-control">
            <div class="pg-control-label">
              <span>${config.label || key}</span>
              <span class="pg-control-value">${value}</span>
            </div>
            <input type="range" class="pg-slider" id="${id}"
              min="${min}" max="${max}" step="${step}" value="${numVal}"
              oninput="updateParam('${key}', this.value + '${unit}', '${scope}'); this.previousElementSibling.querySelector('.pg-control-value').textContent = this.value + '${unit}'">
          </div>`;
      }

      default: // string
        return `
          <div class="pg-control">
            <div class="pg-control-label"><span>${config.label || key}</span></div>
            <input type="text" class="pg-text-input" id="${id}" value="${value}"
              onchange="updateParam('${key}', this.value, '${scope}')">
          </div>`;
    }
  }

  // ─── Update Param ─────────────────────────────────────────────
  window.updateParam = function (key, value, scope) {
    currentParams[key] = value;

    // Send to iframe
    if (previewFrame.contentWindow) {
      previewFrame.contentWindow.postMessage({
        type: 'update-param',
        scope: scope,
        key: key,
        value: value
      }, '*');
    }
  };

  // ─── Reset Params ─────────────────────────────────────────────
  window.resetParams = function () {
    if (!activeEffect) return;
    currentParams = {};

    if (activeEffect.params) {
      for (const [key, config] of Object.entries(activeEffect.params)) {
        currentParams[key] = config.default;
      }
    }
    if (activeEffect.jsParams) {
      for (const [key, config] of Object.entries(activeEffect.jsParams)) {
        currentParams[key] = config.default;
      }
    }

    buildControls(activeEffect);

    // Reload iframe to reset
    previewFrame.src = previewFrame.src;
  };

  // ─── Copy Prompt ──────────────────────────────────────────────
  window.copyPrompt = function () {
    if (!activeEffect) return;

    const lines = [`Use o efeito "${activeEffect.name}" da categoria ${activeEffect.category} com os seguintes ajustes:`];

    const allParams = { ...(activeEffect.params || {}), ...(activeEffect.jsParams || {}) };
    let hasChanges = false;

    for (const [key, config] of Object.entries(allParams)) {
      const current = currentParams[key];
      const def = config.default;
      if (current !== undefined && String(current) !== String(def)) {
        lines.push(`- ${config.label || key}: ${current}`);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      lines.push('- (valores padrão, sem ajustes)');
    }

    const prompt = lines.join('\n');

    navigator.clipboard.writeText(prompt).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Copiado!
      `;
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar Prompt
        `;
      }, 2000);
    });
  };

  // ─── Show Catalog ─────────────────────────────────────────────
  window.showCatalog = function () {
    app.classList.add('catalog-view');
    viewportBtns.style.display = 'none';
    activeEffect = null;
    document.querySelectorAll('.pg-effect-item').forEach(el => el.classList.remove('active'));
    previewFrame.src = 'about:blank';
  };

  // ─── Viewport ─────────────────────────────────────────────────
  window.setViewport = function (viewport) {
    document.querySelectorAll('.pg-viewport-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.viewport === viewport);
    });

    previewFrame.classList.remove('viewport-tablet', 'viewport-mobile');
    if (viewport !== 'desktop') {
      previewFrame.classList.add(`viewport-${viewport}`);
    }
  };

  // ─── Search ───────────────────────────────────────────────────
  window.handleSearch = function (query) {
    searchQuery = query;
    buildCatalog();
    updateSidebarVisibility();
  };

  function updateSidebarVisibility() {
    const filtered = getFilteredEffects();
    const slugs = new Set(filtered.map(e => e.slug));

    document.querySelectorAll('.pg-effect-item').forEach(el => {
      el.style.display = slugs.has(el.dataset.slug) ? '' : 'none';
    });

    document.querySelectorAll('.pg-category').forEach(cat => {
      const visibleItems = cat.querySelectorAll('.pg-effect-item:not([style*="display: none"])');
      cat.style.display = visibleItems.length > 0 ? '' : 'none';
    });
  }

  // ─── Tag Toggle ───────────────────────────────────────────────
  window.toggleTag = function (tag) {
    if (activeTag === tag) {
      activeTag = null;
    } else {
      activeTag = tag;
    }

    document.querySelectorAll('.pg-tag-filters .pg-tag').forEach(el => {
      el.classList.toggle('active', el.dataset.tag === activeTag);
    });

    buildCatalog();
    updateSidebarVisibility();
  };

  // ─── Helpers ──────────────────────────────────────────────────
  function normalizeColor(value) {
    if (!value || typeof value !== 'string') return '#6366f1';
    if (value.startsWith('#') && (value.length === 7 || value.length === 4)) return value;
    // Try to parse rgba/rgb to hex
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return '#6366f1';
  }

  // ─── Keyboard shortcuts ───────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl+K → focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    // Escape → back to catalog
    if (e.key === 'Escape') {
      if (!app.classList.contains('catalog-view')) {
        showCatalog();
      } else {
        searchInput.value = '';
        searchQuery = '';
        activeTag = null;
        document.querySelectorAll('.pg-tag-filters .pg-tag').forEach(el => el.classList.remove('active'));
        buildCatalog();
        updateSidebarVisibility();
      }
    }
  });

  // ─── Boot ─────────────────────────────────────────────────────
  init();
})();
