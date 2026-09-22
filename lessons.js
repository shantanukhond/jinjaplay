window.JINJA_LESSONS = [
  {
    id: 'basics',
    number: 1,
    title: 'Variables, Comments & Expressions',
    summary: 'Print values with {{ }}, hide notes with {# #}, and use Python-like expressions.',
    points: [
      '{{ value }} prints a variable. Use dots for nested fields: user.name.',
      '{# this is a comment #} never appears in the output.',
      'Expressions can add, concatenate with ~, and use inline if/else.',
      'Avoid JSON keys named items, keys, or values on dicts — they collide with Python methods.'
    ],
    json: {
      user: { name: 'Ada Lovelace', role: 'Senior Data Engineer' },
      environment: 'production',
      version: 2
    },
    template: `{# Greet the operator — comments never reach the output #}
Hello, {{ user.name }}!

Role : {{ user.role }}
Env  : {{ environment }}
Math : {{ 2 + 3 }}
Concat: {{ (user.name.split() | first) ~ " · v" ~ version }}
Inline if: {{ "prod" if environment == "production" else "other" }}`
  },
  {
    id: 'conditionals',
    number: 2,
    title: 'Control Structures: Conditionals',
    summary: 'Branch with if, elif, and else. Comparisons and boolean logic work like Python.',
    points: [
      '{% if %}, {% elif %}, {% else %}, {% endif %} wrap blocks of template text.',
      'Use and, or, not, ==, !=, >, <, and parentheses.',
      'Empty lists, empty strings, 0, none, and false are all falsy.'
    ],
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
VIP customer — apply 10% loyalty discount.
{% elif order.total > 200 %}
Eligible for free shipping.
{% elif order.item_count == 0 %}
Empty cart.
{% else %}
Standard order.
{% endif %}`
  },
  {
    id: 'loops',
    number: 3,
    title: 'Control Structures: Loops',
    summary: 'Iterate with for. loop.index / loop.last give position. Use namespace to mutate across iterations.',
    points: [
      '{% for item in list %} … {% endfor %} is the main loop.',
      'loop.index (1-based), loop.index0, loop.first, loop.last, loop.length are available inside the loop.',
      'A normal {% set %} inside a loop does not leak out. Use namespace() to accumulate values.'
    ],
    json: {
      services: [
        { name: 'api-gateway', port: 8080, healthy: true },
        { name: 'auth-service', port: 8081, healthy: true },
        { name: 'billing-service', port: 8082, healthy: false }
      ]
    },
    template: `{% set ns = namespace(down=0) %}
Service Health Report
{% for svc in services %}
- {{ loop.index }}/{{ loop.length }}. {{ svc.name }} (:{{ svc.port }}) -> {{ "OK" if svc.healthy else "DOWN" }}{{ " [first]" if loop.first else "" }}{{ " [last]" if loop.last else "" }}
{% if not svc.healthy %}{% set ns.down = ns.down + 1 %}{% endif %}
{% else %}
No services in the list.
{% endfor %}

Down: {{ ns.down }}   Total: {{ services | length }}`
  },
  {
    id: 'filters',
    number: 4,
    title: 'Built-in Filters',
    summary: 'Pipe values through filters to transform them inline: {{ value | filter }}.',
    points: [
      'Chain filters: {{ name | trim | upper }}.',
      'Common ones: upper, lower, title, replace, join, sort, unique, length, first, last, round, default, tojson.',
      'Some filters take arguments: {{ price | round(2) }}, {{ names | join(", ") }}.'
    ],
    json: {
      name: '  ada lovelace  ',
      tags: ['gold', 'ingest', 'gold', 'etl'],
      price: 19.999,
      extras: null,
      payload: { retries: 3, region: 'ap-south-1' }
    },
    template: `Title   : {{ name | trim | title }}
Tags    : {{ tags | unique | sort | join(", ") }}
Count   : {{ tags | length }}
Price   : {{ price | round(2) }}
Fallback: {{ extras | default("none provided") }}
JSON    : {{ payload | tojson }}`
  },
  {
    id: 'tests',
    number: 5,
    title: 'Tests & Whitespace Control',
    summary: 'Ask questions with is (none, defined, number…). Trim extra newlines with {%- and -%}.',
    points: [
      'Tests sit after is: value is none, items is sequence, n is even, env is defined.',
      'A minus sign on a tag eats adjacent whitespace: {%- if -%} / {{- value -}}. ',
      'JinjaPlay also enables trim_blocks and lstrip_blocks (common in real projects).'
    ],
    json: {
      env: 'production',
      retries: 4,
      owner: null,
      regions: ['ap-south-1', 'us-east-1']
    },
    template: `env defined? {{ env is defined }}
owner none?  {{ owner is none }}
retries even? {{ retries is even }}
regions seq? {{ regions is sequence }}

Tight loop (whitespace stripped with -):
{%- for r in regions -%}
- {{ r }}
{% endfor %}

Loose loop (keep the newlines around the tags):
{% for r in regions %}
- {{ r }}
{% endfor %}`
  },
  {
    id: 'macros',
    number: 6,
    title: 'Macros, Imports & Reusability',
    summary: 'Define callable snippets with macro. Import them from another template with from / import.',
    points: [
      '{% macro name(args) %} … {% endmacro %} is a reusable template function.',
      '{% from "file.j2" import name %} pulls macros from another template (this lesson ships helpers.j2).',
      '{{ name(args) }} calls a macro. Macros are the usual way to DRY header/row/badge markup.'
    ],
    extraTemplates: {
      'helpers.j2': `{% macro pill(ok) -%}
{{ "OK" if ok else "DOWN" }}
{%- endmacro %}

{% macro svc_line(svc, i) %}
{{ i }}. {{ svc.name }} (:{{ svc.port }}) -> {{ pill(svc.healthy) }}
{% endmacro %}`
    },
    json: {
      services: [
        { name: 'api-gateway', port: 8080, healthy: true },
        { name: 'auth-service', port: 8081, healthy: true },
        { name: 'billing-service', port: 8082, healthy: false }
      ]
    },
    template: `{% from "helpers.j2" import pill, svc_line %}
Health
{% for svc in services %}
{{ svc_line(svc, loop.index) }}
{% endfor %}

Summary: {{ services | selectattr("healthy") | list | length }}/{{ services | length }} {{ pill(true) }}`
  }
];
