(() => {
  'use strict';

  // ---------------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------------
  const output = document.getElementById('output');
  const jsonStatus = document.getElementById('json-status');
  const jsonError = document.getElementById('json-error');
  const renderError = document.getElementById('render-error');
  const statusPill = document.getElementById('status-pill');
  const copyBtn = document.getElementById('copy-btn');
  const resetBtn = document.getElementById('reset-btn');
  const exampleTabsEl = document.getElementById('example-tabs');
  const exampleTabsRow = document.getElementById('example-tabs-row');
  const lessonNavEl = document.getElementById('lesson-nav');
  const learnSidenav = document.getElementById('learn-sidenav');
  const catalogToggleEl = document.getElementById('catalog-toggle');
  const pyodideStatus = document.getElementById('pyodide-status');
  const lessonBanner = document.getElementById('lesson-banner');
  const lessonBannerTitle = document.getElementById('lesson-banner-title');
  const lessonBannerSummary = document.getElementById('lesson-banner-summary');
  const lessonSubsectionsEl = document.getElementById('lesson-subsections');
  const lessonCatalogEl = document.getElementById('lesson-catalog');
  const lessonCatalogLabel = document.getElementById('lesson-catalog-label');
  const lessonCatalogHint = document.getElementById('lesson-catalog-hint');
  const lessonCatalogItems = document.getElementById('lesson-catalog-items');
  const lessonBannerExtra = document.getElementById('lesson-banner-extra');

  // ---------------------------------------------------------------------
  // Syntax-highlighted editors (CodeMirror)
  // ---------------------------------------------------------------------
  const cmSharedOptions = {
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    tabSize: 2,
    indentUnit: 2
  };

  const jsonEditor = CodeMirror.fromTextArea(document.getElementById('json-input'), {
    ...cmSharedOptions,
    mode: 'application/json'
  });

  const templateEditor = CodeMirror.fromTextArea(document.getElementById('template-input'), {
    ...cmSharedOptions,
    mode: 'jinja2'
  });

  // Let the editors fill the flex-column panes they live in.
  [jsonEditor, templateEditor].forEach((cm) => {
    cm.getWrapperElement().classList.add('flex-1', 'min-h-0', 'cm-pane');
  });

  // ---------------------------------------------------------------------
  // Real Jinja2 engine (actual CPython + the jinja2 package, via Pyodide)
  // ---------------------------------------------------------------------
  let pyodidePromise = null;

  async function getPyodide() {
    if (!pyodidePromise) {
      pyodidePromise = (async () => {
        pyodideStatus.classList.remove('hidden');
        pyodideStatus.classList.add('flex');
        const pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
        await pyodide.loadPackage('jinja2');
        pyodideStatus.classList.add('hidden');
        pyodideStatus.classList.remove('flex');
        return pyodide;
      })();
    }
    return pyodidePromise;
  }

  async function renderWithJinja2(templateStr, context) {
    const pyodide = await getPyodide();
    pyodide.globals.set('__template_str', templateStr);
    pyodide.globals.set('__context_json', JSON.stringify(context));
    pyodide.globals.set('__extra_templates_json', JSON.stringify(currentExtraTemplates || {}));
    return pyodide.runPythonAsync(`
def __render_jinja2():
    import json
    from jinja2 import DictLoader, Environment, TemplateError

    try:
        templates = json.loads(__extra_templates_json)
        templates['main.j2'] = __template_str
        env = Environment(
            loader=DictLoader(templates),
            trim_blocks=True,
            lstrip_blocks=True,
        )
        template = env.get_template('main.j2')
        context = json.loads(__context_json)
        return template.render(**context)
    except TemplateError as e:
        raise Exception(f"{type(e).__name__}: {e}") from None

__render_jinja2()
`);
  }

  // ---------------------------------------------------------------------
  // Examples
  // ---------------------------------------------------------------------
  const EXAMPLES = {
    'Basic Variables': {
      json: {
        user: {
          name: 'Ada Lovelace',
          role: 'Senior Data Engineer',
          active: true
        },
        environment: 'production'
      },
      template: `Hello, {{ user.name }}!

Role       : {{ user.role }}
Environment: {{ environment | upper }}
Status     : {{ "Active" if user.active else "Inactive" }}`
    },
    'For Loops': {
      json: {
        services: [
          { name: 'api-gateway', port: 8080, healthy: true },
          { name: 'auth-service', port: 8081, healthy: true },
          { name: 'billing-service', port: 8082, healthy: false }
        ]
      },
      template: `Service Health Report
{% for svc in services %}
- {{ loop.index }}. {{ svc.name }} (:{{ svc.port }}) -> {{ "OK" if svc.healthy else "DOWN" }}
{% endfor %}
Total services: {{ services | length }}`
    },
    'Data Pipeline Config': {
      json: {
        pipeline: {
          name: 'daily-ingest',
          schedule: '0 2 * * *',
          retries: 3,
          sources: ['s3://raw-events', 's3://user-uploads'],
          destination: 'warehouse.events_raw',
          tags: { team: 'data-platform', tier: 'gold' }
        }
      },
      template: `# Auto-generated pipeline config
name: {{ pipeline.name }}
schedule: "{{ pipeline.schedule }}"
retries: {{ pipeline.retries }}

sources:
{% for src in pipeline.sources %}
  - {{ src }}
{% endfor %}

destination: {{ pipeline.destination }}

tags:
{% for key, value in pipeline.tags.items() %}
  {{ key }}: {{ value }}
{% endfor %}`
    },
    'Conditionals': {
      json: {
        order: {
          id: 'ORD-10432',
          total: 249.5,
          currency: 'USD',
          item_count: 4,
          vip_customer: true
        }
      },
      template: `Order #{{ order.id }}
Items: {{ order.item_count }}
Total: {{ order.total | round(2) }} {{ order.currency }}

{% if order.vip_customer %}
🎉 VIP customer — apply 10% loyalty discount.
{% elif order.total > 200 %}
Standard customer — eligible for free shipping.
{% else %}
Standard order.
{% endif %}`
    }
  };

  const DEFAULT_EXAMPLE = 'Basic Variables';
  let activeExample = DEFAULT_EXAMPLE;
  let currentExtraTemplates = {};
  let catalogMode = 'examples';
  let currentLessonId = null;
  let currentPartId = null;
  let currentTryName = null;

  function setLessonQuery(id, part, tryName) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('lesson', id);
    else url.searchParams.delete('lesson');
    if (id && part) url.searchParams.set('part', part);
    else url.searchParams.delete('part');
    if (id && tryName) url.searchParams.set('try', tryName);
    else url.searchParams.delete('try');
    history.replaceState({}, '', url);
  }

  function setCatalogMode(mode) {
    catalogMode = mode;
    document.body.classList.toggle('is-learn', mode === 'learn');
    [...catalogToggleEl.querySelectorAll('.mode-btn')].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    exampleTabsRow.hidden = mode !== 'examples';
    learnSidenav.hidden = mode !== 'learn';
    requestAnimationFrame(() => {
      jsonEditor.refresh();
      templateEditor.refresh();
    });
  }

  function hideLessonBanner() {
    if (!lessonBanner) return;
    lessonBanner.classList.add('hidden');
  }

  function showLessonBanner(lesson, partId, tryName) {
    if (!lessonBanner) return;
    const part = (lesson.subsections || []).find((item) => item.id === partId);
    const heading = part
      ? `Lesson ${lesson.number} · ${lesson.title} · ${part.title}`
      : `Lesson ${lesson.number} · ${lesson.title}`;
    lessonBannerTitle.textContent = heading;
    lessonBannerSummary.textContent = lesson.summary;
    if (lessonSubsectionsEl) {
      lessonSubsectionsEl.innerHTML = '';
      lessonSubsectionsEl.classList.add('hidden');
    }

    renderLessonCatalog(lesson, partId, tryName);

    const extraSource = part && part.extraTemplates !== undefined
      ? part.extraTemplates
      : (lesson.extraTemplates || {});
    const extraNames = Object.keys(extraSource);
    if (extraNames.length) {
      lessonBannerExtra.textContent = `Also loaded: ${extraNames.join(', ')} (imported by the template)`;
      lessonBannerExtra.classList.remove('hidden');
    } else {
      lessonBannerExtra.classList.add('hidden');
    }
    lessonBanner.classList.remove('hidden');
  }

  function highlightLessonNav(lessonId, partId) {
    [...lessonNavEl.querySelectorAll('.learn-nav-link, .learn-nav-sublink')].forEach((btn) => {
      const sameLesson = btn.dataset.id === lessonId;
      const btnPart = btn.dataset.part || '';
      btn.classList.toggle('active', sameLesson && btnPart === (partId || ''));
    });
    [...lessonNavEl.querySelectorAll('.learn-nav-group')].forEach((group) => {
      group.classList.toggle('open', group.dataset.id === lessonId);
    });
  }

  function catalogRowsFor(lesson, partId) {
    const subs = lesson.subsections || [];
    const filterCatalog = window.JINJA_FILTER_CATALOG || [];
    if (!partId && lesson.id === 'filters') {
      return filterCatalog.map((item) => ({
        ...item,
        part: item.group === 'string' ? 'string-filters'
          : item.group === 'list' ? 'list-filters'
            : 'fallback-json',
        json: window.JINJA_FILTER_CONTEXT
      }));
    }
    const selected = partId ? subs.filter((sub) => sub.id === partId) : subs;
    const rows = [];
    selected.forEach((sub) => {
      if (sub.useFilterGroup) {
        filterCatalog.filter((item) => item.group === sub.useFilterGroup).forEach((item) => {
          rows.push({
            ...item,
            part: sub.id,
            json: window.JINJA_FILTER_CONTEXT
          });
        });
      }
      (sub.catalog || []).forEach((row) => {
        rows.push({
          ...row,
          part: sub.id,
          json: row.json || sub.json || lesson.json,
          extraTemplates: row.extraTemplates !== undefined
            ? row.extraTemplates
            : sub.extraTemplates
        });
      });
    });
    return rows;
  }

  function labeledPlayground(rows) {
    const width = rows.reduce((max, row) => Math.max(max, row.name.length), 0);
    return rows.map((row) => {
      const example = String(row.example).replace(/\n+$/, '');
      const lines = example.split('\n');
      const isPrint = /^\s*\{\{/.test(lines[0]);
      if (isPrint) {
        const head = `${row.name.padEnd(width)} : ${lines[0]}`;
        return lines.length > 1 ? [head, ...lines.slice(1)].join('\n') : head;
      }
      const safe = String(row.name).replace(/#}/g, '# }');
      return `{# ${safe} #}\n${example}`;
    }).join('\n');
  }

  function playgroundContext(lesson, part, rows) {
    const usesFilterCtx = (rows || []).some((row) => row.group || row.json === window.JINJA_FILTER_CONTEXT);
    if (usesFilterCtx || lesson.id === 'filters' || (part && part.useFilterGroup)) {
      return Object.assign({}, window.JINJA_FILTER_CONTEXT, lesson.json, (part && part.json) || {});
    }
    return (part && part.json) || lesson.json;
  }

  function renderLessonCatalog(lesson, partId, tryName) {
    const rows = catalogRowsFor(lesson, partId);
    if (!lessonCatalogEl || !rows.length) {
      if (lessonCatalogEl) lessonCatalogEl.classList.add('hidden');
      return;
    }
    const part = (lesson.subsections || []).find((item) => item.id === partId);
    lessonCatalogLabel.textContent = part ? part.title : `All in this section`;
    lessonCatalogHint.textContent = `${rows.length} row${rows.length === 1 ? '' : 's'}. Try loads the example into the editors.`;
    lessonCatalogItems.innerHTML = '';
    rows.forEach((item) => {
      const tr = document.createElement('tr');
      tr.dataset.name = item.name;
      if (tryName === item.name) tr.classList.add('active');

      const nameCell = document.createElement('td');
      const nameCode = document.createElement('code');
      nameCode.textContent = item.name;
      nameCell.appendChild(nameCode);

      const exampleCell = document.createElement('td');
      const exampleCode = document.createElement('code');
      exampleCode.textContent = item.example;
      exampleCell.appendChild(exampleCode);

      const actionCell = document.createElement('td');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lesson-try-btn';
      btn.textContent = 'Try';
      btn.addEventListener('click', () => loadCatalogTry(lesson.id, partId, item.name));
      actionCell.appendChild(btn);

      tr.append(nameCell, exampleCell, actionCell);
      lessonCatalogItems.appendChild(tr);
    });
    lessonCatalogEl.classList.remove('hidden');
  }

  function loadCatalogTry(lessonId, partId, name) {
    const lesson = (window.JINJA_LESSONS || []).find((entry) => entry.id === lessonId);
    if (!lesson) return false;
    const rows = catalogRowsFor(lesson, partId);
    const row = rows.find((entry) => entry.name === name);
    if (!row) return false;
    activeExample = null;
    currentLessonId = lesson.id;
    currentPartId = partId || null;
    currentTryName = row.name;
    const sub = (lesson.subsections || []).find((entry) => entry.id === (partId || row.part));
    currentExtraTemplates = row.extraTemplates !== undefined
      ? row.extraTemplates
      : (sub && sub.extraTemplates !== undefined ? sub.extraTemplates : (lesson.extraTemplates || {}));
    jsonEditor.setValue(JSON.stringify(row.json || lesson.json, null, 2));
    templateEditor.setValue(row.example);
    [...exampleTabsEl.children].forEach((btn) => btn.classList.remove('active'));
    highlightLessonNav(lesson.id, currentPartId);
    showLessonBanner(lesson, currentPartId, currentTryName);
    setCatalogMode('learn');
    setLessonQuery(lesson.id, currentPartId, currentTryName);
    render();
    requestAnimationFrame(() => {
      const activeRow = lessonCatalogItems.querySelector('tr.active');
      if (activeRow) activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return true;
  }

  function scrollLessonPart() {
    if (lessonCatalogEl && !lessonCatalogEl.classList.contains('hidden')) {
      lessonCatalogEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // ---------------------------------------------------------------------
  // Rendering pipeline
  // ---------------------------------------------------------------------
  let debounceTimer = null;
  let renderToken = 0; // guards against out-of-order async renders

  function debounce(fn, delay) {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn(...args), delay);
    };
  }

  function refreshEditors() {
    requestAnimationFrame(() => {
      jsonEditor.refresh();
      templateEditor.refresh();
    });
  }

  function validateJson() {
    const raw = jsonEditor.getValue().trim();
    if (!raw) {
      jsonError.classList.add('hidden');
      jsonStatus.textContent = 'Empty context';
      jsonStatus.className = 'text-xs font-medium text-slate-500';
      return {};
    }
    try {
      const data = JSON.parse(raw);
      jsonError.classList.add('hidden');
      jsonStatus.textContent = 'Valid JSON';
      jsonStatus.className = 'text-xs font-medium text-emerald-400';
      return data;
    } catch (err) {
      jsonStatus.textContent = 'Invalid JSON';
      jsonStatus.className = 'text-xs font-medium text-rose-400';
      jsonError.textContent = `⚠ ${err.message}`;
      jsonError.classList.remove('hidden');
      return null;
    }
  }

  function render() {
    const context = validateJson();

    if (context === null) {
      // Keep last good output visible but flag that context is broken.
      renderError.textContent = '⚠ Fix the JSON context errors above to re-render the template.';
      renderError.classList.remove('hidden');
      statusPill.classList.add('hidden');
      refreshEditors();
      return;
    }

    const token = ++renderToken;
    const templateStr = templateEditor.getValue();

    renderWithJinja2(templateStr, context)
      .then((result) => {
        if (token !== renderToken) return; // a newer keystroke already superseded this render
        output.textContent = result;
        renderError.classList.add('hidden');
        statusPill.classList.remove('hidden');
        refreshEditors();
      })
      .catch((err) => {
        if (token !== renderToken) return;
        renderError.textContent = `⚠ Template Error: ${formatTemplateError(err)}`;
        renderError.classList.remove('hidden');
        statusPill.classList.add('hidden');
        refreshEditors();
      });
  }

  function formatTemplateError(err) {
    const raw = (err && err.message) || String(err);
    const lines = raw.trim().split('\n').map((line) => line.trim()).filter(Boolean);
    const last = lines[lines.length - 1] || raw;
    return last.replace(/^(Exception|Error):\s*/, '');
  }

  const debouncedRender = debounce(render, 200);

  // ---------------------------------------------------------------------
  // Example tabs
  // ---------------------------------------------------------------------
  function loadExample(name) {
    const ex = EXAMPLES[name];
    if (!ex) return;
    activeExample = name;
    currentLessonId = null;
    currentPartId = null;
    currentTryName = null;
    currentExtraTemplates = {};
    hideLessonBanner();
    setLessonQuery(null);
    setCatalogMode('examples');
    jsonEditor.setValue(JSON.stringify(ex.json, null, 2));
    templateEditor.setValue(ex.template);
    [...exampleTabsEl.children].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.name === name);
    });
    highlightLessonNav(null, null);
    render();
  }

  function loadLesson(id, partId, tryName) {
    const lesson = (window.JINJA_LESSONS || []).find((item) => item.id === id);
    if (!lesson) return false;
    if (partId && String(partId).startsWith('filter:')) {
      const filterName = partId.slice('filter:'.length);
      const filter = (window.JINJA_FILTER_CATALOG || []).find((item) => item.name === filterName);
      const groupPart = filter
        ? (lesson.subsections || []).find((sub) => sub.useFilterGroup === filter.group)
        : null;
      return loadCatalogTry(id, groupPart ? groupPart.id : null, filterName);
    }
    const part = partId
      ? (lesson.subsections || []).find((item) => item.id === partId)
      : null;
    if (partId && !part) return false;
    if (tryName) return loadCatalogTry(id, part ? part.id : null, tryName);

    activeExample = null;
    currentLessonId = lesson.id;
    currentPartId = part ? part.id : null;
    currentTryName = null;
    currentExtraTemplates = (part && part.extraTemplates !== undefined)
      ? part.extraTemplates
      : (lesson.extraTemplates || {});
    const rows = catalogRowsFor(lesson, currentPartId);
    jsonEditor.setValue(JSON.stringify(playgroundContext(lesson, part, rows), null, 2));
    templateEditor.setValue(rows.length ? labeledPlayground(rows) : ((part && part.template) || lesson.template));
    [...exampleTabsEl.children].forEach((btn) => btn.classList.remove('active'));
    highlightLessonNav(lesson.id, currentPartId);
    showLessonBanner(lesson, currentPartId);
    setCatalogMode('learn');
    setLessonQuery(lesson.id, currentPartId);
    render();
    requestAnimationFrame(() => scrollLessonPart());
    return true;
  }

  function buildLessonNav() {
    (window.JINJA_LESSONS || []).forEach((lesson) => {
      const group = document.createElement('div');
      group.className = 'learn-nav-group';
      group.dataset.id = lesson.id;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'learn-nav-link';
      btn.dataset.id = lesson.id;
      btn.dataset.part = '';
      const num = document.createElement('span');
      num.className = 'learn-nav-num';
      num.textContent = String(lesson.number).padStart(2, '0');
      const copy = document.createElement('span');
      copy.className = 'learn-nav-copy';
      const title = document.createElement('span');
      title.className = 'learn-nav-title';
      title.textContent = lesson.title;
      const blurb = document.createElement('span');
      blurb.className = 'learn-nav-blurb';
      blurb.textContent = lesson.summary;
      copy.append(title, blurb);
      btn.append(num, copy);
      btn.addEventListener('click', () => loadLesson(lesson.id));

      const sub = document.createElement('div');
      sub.className = 'learn-nav-subs';
      (lesson.subsections || []).forEach((item) => {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'learn-nav-sublink';
        link.dataset.id = lesson.id;
        link.dataset.part = item.id;
        link.textContent = item.title;
        link.addEventListener('click', () => loadLesson(lesson.id, item.id));
        sub.appendChild(link);
      });

      group.append(btn, sub);
      lessonNavEl.appendChild(group);
    });
  }

  catalogToggleEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.mode-btn');
    if (!btn || btn.dataset.mode === catalogMode) return;
    if (btn.dataset.mode === 'learn') {
      const first = (window.JINJA_LESSONS || [])[0];
      if (first) loadLesson(first.id);
    } else {
      loadExample(activeExample || DEFAULT_EXAMPLE);
    }
  });

  function buildExampleTabs() {
    Object.keys(EXAMPLES).forEach((name) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'example-tab';
      btn.dataset.name = name;
      btn.textContent = name;
      btn.addEventListener('click', () => loadExample(name));
      exampleTabsEl.appendChild(btn);
    });
  }

  // ---------------------------------------------------------------------
  // Header actions
  // ---------------------------------------------------------------------
  function flashButton(btn, label) {
    const original = btn.querySelector('span:last-child').textContent;
    btn.querySelector('span:last-child').textContent = label;
    setTimeout(() => {
      btn.querySelector('span:last-child').textContent = original;
    }, 1200);
  }

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      flashButton(copyBtn, 'Copied!');
    } catch {
      flashButton(copyBtn, 'Copy failed');
    }
  });

  resetBtn.addEventListener('click', () => {
    if (catalogMode === 'learn' && currentLessonId) {
      loadLesson(currentLessonId, currentPartId);
    } else {
      loadExample(DEFAULT_EXAMPLE);
    }
    flashButton(resetBtn, 'Reset!');
  });

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  jsonEditor.on('change', debouncedRender);
  templateEditor.on('change', debouncedRender);

  buildExampleTabs();
  buildLessonNav();
  getPyodide(); // start downloading CPython + Jinja2 immediately
  const bootParams = new URLSearchParams(window.location.search);
  const requestedLesson = bootParams.get('lesson');
  const requestedPart = bootParams.get('part') || undefined;
  const requestedTry = bootParams.get('try') || undefined;
  if (requestedLesson) {
    if (!loadLesson(requestedLesson, requestedPart, requestedTry)) loadLesson(requestedLesson);
  } else {
    loadExample(activeExample);
  }

  // CodeMirror mismeasures panes hidden at init time (e.g. behind layout reflow).
  requestAnimationFrame(() => {
    jsonEditor.refresh();
    templateEditor.refresh();
  });
})();
