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
  const lessonTabsEl = document.getElementById('lesson-tabs');
  const catalogToggleEl = document.getElementById('catalog-toggle');
  const pyodideStatus = document.getElementById('pyodide-status');
  const lessonBanner = document.getElementById('lesson-banner');
  const lessonBannerTitle = document.getElementById('lesson-banner-title');
  const lessonBannerSummary = document.getElementById('lesson-banner-summary');
  const lessonBannerPoints = document.getElementById('lesson-banner-points');
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

  const LESSON_TAB_LABELS = {
    basics: 'Basics',
    conditionals: 'Conditionals',
    loops: 'Loops',
    filters: 'Filters',
    tests: 'Tests',
    macros: 'Macros'
  };

  function setLessonQuery(id) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('lesson', id);
    else url.searchParams.delete('lesson');
    history.replaceState({}, '', url);
  }

  function setCatalogMode(mode) {
    catalogMode = mode;
    [...catalogToggleEl.querySelectorAll('.mode-btn')].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    exampleTabsEl.hidden = mode !== 'examples';
    lessonTabsEl.hidden = mode !== 'learn';
    requestAnimationFrame(() => {
      jsonEditor.refresh();
      templateEditor.refresh();
    });
  }

  function hideLessonBanner() {
    if (!lessonBanner) return;
    lessonBanner.classList.add('hidden');
  }

  function showLessonBanner(lesson) {
    if (!lessonBanner) return;
    lessonBannerTitle.textContent = `Lesson ${lesson.number} · ${lesson.title}`;
    lessonBannerSummary.textContent = lesson.summary;
    lessonBannerPoints.innerHTML = (lesson.points || []).map((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      return li.outerHTML;
    }).join('');
    const extraNames = Object.keys(lesson.extraTemplates || {});
    if (extraNames.length) {
      lessonBannerExtra.textContent = `Also loaded: ${extraNames.join(', ')} (imported by the template)`;
      lessonBannerExtra.classList.remove('hidden');
    } else {
      lessonBannerExtra.classList.add('hidden');
    }
    lessonBanner.classList.remove('hidden');
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
      })
      .catch((err) => {
        if (token !== renderToken) return;
        renderError.textContent = `⚠ Template Error: ${formatTemplateError(err)}`;
        renderError.classList.remove('hidden');
        statusPill.classList.add('hidden');
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
    currentExtraTemplates = {};
    hideLessonBanner();
    setLessonQuery(null);
    setCatalogMode('examples');
    jsonEditor.setValue(JSON.stringify(ex.json, null, 2));
    templateEditor.setValue(ex.template);
    [...exampleTabsEl.children].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.name === name);
    });
    [...lessonTabsEl.children].forEach((btn) => btn.classList.remove('active'));
    render();
  }

  function loadLesson(id) {
    const lesson = (window.JINJA_LESSONS || []).find((item) => item.id === id);
    if (!lesson) return false;
    activeExample = null;
    currentExtraTemplates = lesson.extraTemplates || {};
    jsonEditor.setValue(JSON.stringify(lesson.json, null, 2));
    templateEditor.setValue(lesson.template);
    [...exampleTabsEl.children].forEach((btn) => btn.classList.remove('active'));
    [...lessonTabsEl.children].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.id === lesson.id);
    });
    showLessonBanner(lesson);
    setCatalogMode('learn');
    setLessonQuery(lesson.id);
    render();
    return true;
  }

  function buildLessonTabs() {
    (window.JINJA_LESSONS || []).forEach((lesson) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'example-tab';
      btn.dataset.id = lesson.id;
      btn.textContent = `${lesson.number}. ${LESSON_TAB_LABELS[lesson.id] || lesson.title}`;
      btn.addEventListener('click', () => loadLesson(lesson.id));
      lessonTabsEl.appendChild(btn);
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
    loadExample(DEFAULT_EXAMPLE);
    flashButton(resetBtn, 'Reset!');
  });

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  jsonEditor.on('change', debouncedRender);
  templateEditor.on('change', debouncedRender);

  buildExampleTabs();
  buildLessonTabs();
  getPyodide(); // start downloading CPython + Jinja2 immediately
  const requestedLesson = new URLSearchParams(window.location.search).get('lesson');
  if (!requestedLesson || !loadLesson(requestedLesson)) {
    loadExample(activeExample);
  }

  // CodeMirror mismeasures panes hidden at init time (e.g. behind layout reflow).
  requestAnimationFrame(() => {
    jsonEditor.refresh();
    templateEditor.refresh();
  });
})();
