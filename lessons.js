window.JINJA_FILTER_CONTEXT = {
  name: '  ada lovelace  ',
  text: 'Ada Lovelace built the first algorithm. See https://jinja.palletsprojects.com/',
  html: '<b>bold</b> and <i>italic</i>',
  url: 'https://jinja.palletsprojects.com/templates/',
  tags: ['gold', 'ingest', 'gold', 'etl'],
  nums: [3, 1, 4, 1, 5],
  price: 19.999,
  bytes: 1234567,
  extras: null,
  payload: { retries: 3, region: 'ap-south-1' },
  people: [
    { name: 'Ada', role: 'eng' },
    { name: 'Grace', role: 'eng' },
    { name: 'Alan', role: 'ops' }
  ]
};

window.JINJA_FILTER_CATALOG = [
  { group: 'values', name: 'abs', note: 'absolute value', example: '{{ (-7) | abs }}' },
  { group: 'values', name: 'attr', note: 'getattr by name; JSON dicts use dots', example: '{{ people[0].name }}' },
  { group: 'list', name: 'batch', note: 'split into batches', example: '{{ tags | batch(2) | list }}' },
  { group: 'string', name: 'capitalize', note: 'first letter up, rest down', example: '{{ name | trim | capitalize }}' },
  { group: 'string', name: 'center', note: 'center in a width', example: '{{ "Ada" | center(12) }}' },
  { group: 'list', name: 'count', note: 'alias of length', example: '{{ tags | count }}' },
  { group: 'values', name: 'd', note: 'alias of default', example: '{{ extras | d("none", true) }}' },
  { group: 'values', name: 'default', note: 'fallback when undefined/none', example: '{{ extras | default("none provided", true) }}' },
  { group: 'values', name: 'dictsort', note: 'sort a dict by key', example: '{{ payload | dictsort }}' },
  { group: 'string', name: 'e', note: 'alias of escape', example: '{{ html | e }}' },
  { group: 'string', name: 'escape', note: 'HTML-escape & < >', example: '{{ html | escape }}' },
  { group: 'values', name: 'filesizeformat', note: 'human file size', example: '{{ bytes | filesizeformat }}' },
  { group: 'list', name: 'first', note: 'first item', example: '{{ tags | first }}' },
  { group: 'values', name: 'float', note: 'to float', example: '{{ "3.14" | float }}' },
  { group: 'string', name: 'forceescape', note: 'escape even if marked safe', example: '{{ html | forceescape }}' },
  { group: 'string', name: 'format', note: 'printf-style format', example: '{{ "v%s · %s" | format(3, payload.region) }}' },
  { group: 'list', name: 'groupby', note: 'group objects by attr', example: '{% for role, rows in people | groupby("role") %}{{ role }}: {{ rows | map(attribute="name") | join(", ") }}\n{% endfor %}' },
  { group: 'string', name: 'indent', note: 'indent each line', example: '{{ "a\\nb" | indent(2, true) }}' },
  { group: 'values', name: 'int', note: 'to integer', example: '{{ "19.9" | int }}' },
  { group: 'values', name: 'items', note: 'dict (key, value) pairs', example: '{{ payload | items | list }}' },
  { group: 'list', name: 'join', note: 'glue a sequence', example: '{{ tags | unique | join(", ") }}' },
  { group: 'list', name: 'last', note: 'last item', example: '{{ tags | last }}' },
  { group: 'list', name: 'length', note: 'size of a container', example: '{{ tags | length }}' },
  { group: 'list', name: 'list', note: 'to list', example: '{{ name | trim | list }}' },
  { group: 'string', name: 'lower', note: 'lowercase', example: '{{ name | trim | lower }}' },
  { group: 'list', name: 'map', note: 'map attr/filter over items', example: '{{ people | map(attribute="name") | list }}' },
  { group: 'list', name: 'max', note: 'largest item', example: '{{ nums | max }}' },
  { group: 'list', name: 'min', note: 'smallest item', example: '{{ nums | min }}' },
  { group: 'values', name: 'pprint', note: 'pretty-print for debug', example: '{{ payload | pprint }}' },
  { group: 'list', name: 'random', note: 'random item', example: '{{ tags | random }}' },
  { group: 'list', name: 'reject', note: 'drop items that pass a test', example: '{{ nums | reject("odd") | list }}' },
  { group: 'list', name: 'rejectattr', note: 'drop by attribute test', example: '{{ people | rejectattr("role", "eq", "ops") | map(attribute="name") | list }}' },
  { group: 'string', name: 'replace', note: 'replace substring', example: '{{ name | trim | replace("ada", "Ada") }}' },
  { group: 'list', name: 'reverse', note: 'reverse a sequence', example: '{{ tags | reverse | list }}' },
  { group: 'values', name: 'round', note: 'round a number', example: '{{ price | round(2) }}' },
  { group: 'string', name: 'safe', note: 'mark string as safe HTML', example: '{{ html | safe }}' },
  { group: 'list', name: 'select', note: 'keep items that pass a test', example: '{{ nums | select("odd") | list }}' },
  { group: 'list', name: 'selectattr', note: 'keep by attribute test', example: '{{ people | selectattr("role", "eq", "eng") | map(attribute="name") | list }}' },
  { group: 'list', name: 'slice', note: 'slice into N columns', example: '{{ tags | slice(2) | list }}' },
  { group: 'list', name: 'sort', note: 'sort', example: '{{ tags | unique | sort }}' },
  { group: 'values', name: 'string', note: 'to string', example: '{{ price | string }}' },
  { group: 'string', name: 'striptags', note: 'strip HTML tags', example: '{{ html | striptags }}' },
  { group: 'list', name: 'sum', note: 'sum a sequence', example: '{{ nums | sum }}' },
  { group: 'string', name: 'title', note: 'Title Case', example: '{{ name | trim | title }}' },
  { group: 'values', name: 'tojson', note: 'serialize to JSON', example: '{{ payload | tojson }}' },
  { group: 'string', name: 'trim', note: 'strip edges', example: '{{ name | trim }}' },
  { group: 'string', name: 'truncate', note: 'cut a string to length', example: '{{ text | truncate(32, true, "…") }}' },
  { group: 'list', name: 'unique', note: 'dedupe, keep order', example: '{{ tags | unique | list }}' },
  { group: 'string', name: 'upper', note: 'UPPERCASE', example: '{{ name | trim | upper }}' },
  { group: 'string', name: 'urlencode', note: 'encode for a URL', example: '{{ url | urlencode }}' },
  { group: 'string', name: 'urlize', note: 'URLs to <a> links', example: '{{ text | urlize }}' },
  { group: 'string', name: 'wordcount', note: 'count words', example: '{{ text | wordcount }}' },
  { group: 'string', name: 'wordwrap', note: 'wrap lines to a width', example: '{{ text | wordwrap(24) }}' },
  { group: 'values', name: 'xmlattr', note: 'dict to XML attributes', example: '{{ {"id": "n1", "class": "ok"} | xmlattr }}' }
];

window.JINJA_LESSONS = [
  {
    id: 'basics',
    number: 1,
    title: 'Variables, Comments & Expressions',
    summary: 'Print values with {{ }}, hide notes with {# #}, use expressions, and index lists.',
    json: {
      user: { name: 'Ada Lovelace', role: 'Senior Data Engineer' },
      environment: 'production',
      version: 2,
      count: 7,
      ready: true,
      tags: ['gold', 'ingest', 'gold', 'etl'],
      nums: [3, 1, 4, 1, 5],
      people: [
        { name: 'Ada', role: 'eng' },
        { name: 'Grace', role: 'ops' }
      ]
    },
    template: `{# Greet the operator — comments never reach the output #}
Hello, {{ user.name }}!

Role : {{ user.role }}
Env  : {{ environment }}
Math : {{ 2 + 3 }}
Concat: {{ (user.name.split() | first) ~ " · v" ~ version }}
Tags : {{ tags | join(", ") }}
First: {{ tags[0] }}`,
    subsections: [
      {
        id: 'variables',
        title: 'Variables',
        catalog: [
          { name: '{{ user }}', example: '{{ user }}' },
          { name: '{{ user.name }}', example: '{{ user.name }}' },
          { name: '{{ user["role"] }}', example: '{{ user["role"] }}' },
          { name: '{{ environment }}', example: '{{ environment }}' }
        ],
        template: `{{ user.name }}
{{ user.role }}
{{ user["name"] }}
{{ environment }}`
      },
      {
        id: 'comments',
        title: 'Comments',
        catalog: [
          { name: '{# comment #}', example: '{# hidden #}\nVisible' },
          { name: '{# multi-line #}', example: '{#\n  multi\n#}\nAfter' }
        ],
        template: `{# this never prints #}
Visible line
{#
  multi-line comment
#}
After comment`
      },
      {
        id: 'operators',
        title: 'Operators',
        catalog: [
          { name: '+', example: '{{ 2 + 3 }}', sample: true },
          { name: '-', example: '{{ 10 - 4 }}' },
          { name: '*', example: '{{ 3 * 4 }}' },
          { name: '/', example: '{{ 7 / 2 }}' },
          { name: '//', example: '{{ 7 // 2 }}' },
          { name: '%', example: '{{ 7 % 2 }}' },
          { name: '**', example: '{{ 2 ** 3 }}' },
          { name: '==', example: '{{ version == 2 }}', sample: true, gap: true },
          { name: '!=', example: '{{ version != 2 }}' },
          { name: '>', example: '{{ version > 1 }}' },
          { name: '<', example: '{{ version < 1 }}' },
          { name: '>=', example: '{{ version >= 2 }}' },
          { name: '<=', example: '{{ version <= 1 }}', sample: true },
          { name: 'in', example: '{{ "Ada" in user.name }}', sample: true, gap: true },
          { name: 'and', example: '{{ ready and environment == "production" }}', sample: true, gap: true },
          { name: 'or', example: '{{ ready or false }}', sample: true },
          { name: 'not', example: '{{ not ready }}', sample: true },
          { name: '~', example: '{{ user.name ~ " · v" ~ version }}', sample: true, gap: true }
        ],
        template: `+   : {{ 2 + 3 }}

==  : {{ version == 2 }}
<=  : {{ version <= 1 }}

in  : {{ "Ada" in user.name }}

and : {{ ready and environment == "production" }}
or  : {{ ready or false }}
not : {{ not ready }}

~   : {{ user.name ~ " · v" ~ version }}`
      },
      {
        id: 'expressions',
        title: 'Expressions',
        catalog: [
          { name: '| upper', example: '{{ user.name | upper }}', sample: true },
          { name: '| lower', example: '{{ user.name | lower }}' },
          { name: '| title', example: '{{ user.name | title }}' },
          { name: '| capitalize', example: '{{ user.role | capitalize }}' },
          { name: '| trim', example: '{{ "  hello  " | trim }}' },
          { name: '| replace', example: '{{ user.name | replace(" ", "-") }}' },
          { name: '| length', example: '{{ user.name | length }}', sample: true, gap: true },
          { name: '| wordcount', example: '{{ user.role | wordcount }}', sample: true },
          { name: '| first', example: '{{ user.name.split() | first }}', sample: true, gap: true },
          { name: '| last', example: '{{ user.name.split() | last }}' },
          { name: '| join', example: '{{ user.name.split() | join(" · ") }}', sample: true },
          { name: '| default', example: '{{ missing | default("n/a") }}', sample: true, gap: true },
          { name: '| round', example: '{{ 19.999 | round(2) }}', sample: true, gap: true },
          { name: '| truncate', example: '{{ user.role | truncate(12, true, "…") }}', sample: true },
          { name: '( )', example: '{{ (2 + 3) * 4 }}' },
          { name: '{% set %}', example: '{% set first = user.name.split() | first %}\n{{ first }}' }
        ],
        template: `| upper      : {{ user.name | upper }}

| length     : {{ user.name | length }}
| wordcount  : {{ user.role | wordcount }}

| first      : {{ user.name.split() | first }}
| join       : {{ user.name.split() | join(" · ") }}

| default    : {{ missing | default("n/a") }}

| round      : {{ 19.999 | round(2) }}
| truncate   : {{ user.role | truncate(12, true, "…") }}`
      },
      {
        id: 'arrays',
        title: 'Arrays',
        catalog: [
          { name: 'list[0]', example: '{{ tags[0] }}', sample: true },
          { name: 'list[-1]', example: '{{ tags[-1] }}' },
          { name: 'list[1:3]', example: '{{ tags[1:3] }}', sample: true },
          { name: 'list[:2]', example: '{{ tags[:2] }}' },
          { name: 'list[1:]', example: '{{ tags[1:] }}' },
          { name: 'nested[0].key', example: '{{ people[0].name }}', sample: true, gap: true },
          { name: '| length', example: '{{ tags | length }}', sample: true },
          { name: '| count', example: '{{ tags | count }}' },
          { name: '| first', example: '{{ tags | first }}' },
          { name: '| last', example: '{{ tags | last }}' },
          { name: '| min', example: '{{ nums | min }}' },
          { name: '| max', example: '{{ nums | max }}' },
          { name: '| sum', example: '{{ nums | sum }}' },
          { name: '| sort', example: '{{ nums | sort }}' },
          { name: '| unique', example: '{{ tags | unique | list }}', sample: true, gap: true },
          { name: '| reverse', example: '{{ tags | reverse | list }}', sample: true },
          { name: '| join', example: '{{ tags | unique | join(", ") }}', sample: true },
          { name: '| map', example: '{{ people | map(attribute="name") | list }}', sample: true, gap: true },
          { name: '| batch', example: '{{ tags | unique | batch(2) | list }}', sample: true },
          { name: 'in', example: '{{ "gold" in tags }}', sample: true }
        ],
        template: `list[0]       : {{ tags[0] }}
list[1:3]     : {{ tags[1:3] }}

nested[0].key : {{ people[0].name }}
| length      : {{ tags | length }}

| unique      : {{ tags | unique | list }}
| reverse     : {{ tags | reverse | list }}
| join        : {{ tags | unique | join(", ") }}

| map         : {{ people | map(attribute="name") | list }}
| batch       : {{ tags | unique | batch(2) | list }}
in            : {{ "gold" in tags }}`
      }
    ]
  },
  {
    id: 'conditionals',
    number: 2,
    title: 'Control Structures: Conditionals',
    summary: 'Branch with if, elif, and else. Comparisons and boolean logic work like Python.',
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
{% endif %}

Kind: {{ "VIP" if order.vip_customer else "standard" }}`,
    subsections: [
      {
        id: 'if-endif',
        title: 'if / endif',
        catalog: [
          { name: '{% if %}', example: '{% if order.vip_customer %}\nVIP order\n{% endif %}' },
          { name: '{% endif %}', example: '{% if order.vip_customer %}\nVIP order\n{% endif %}' }
        ],
        template: `{% if order.vip_customer %}
VIP order
{% endif %}`
      },
      {
        id: 'elif-else',
        title: 'elif / else',
        catalog: [
          { name: '{% elif %}', example: '{% if order.vip_customer %}\nVIP\n{% elif order.total > 200 %}\nFree shipping\n{% else %}\nStandard\n{% endif %}' },
          { name: '{% else %}', example: '{% if order.item_count == 0 %}\nEmpty cart\n{% else %}\nHas items\n{% endif %}' }
        ],
        template: `{% if order.vip_customer %}
VIP
{% elif order.total > 200 %}
Free shipping
{% else %}
Standard
{% endif %}`
      },
      {
        id: 'inline-if',
        title: 'Inline if',
        catalog: [
          { name: 'a if cond else b', example: '{{ "VIP" if order.vip_customer else "standard" }}' }
        ],
        template: `{{ "VIP" if order.vip_customer else "standard" }}
{{ "free ship" if order.total > 200 else "paid ship" }}`
      },
      {
        id: 'comparisons',
        title: 'Comparisons',
        catalog: [
          { name: '==', example: '{{ order.item_count == 4 }}' },
          { name: '!=', example: '{{ order.currency != "EUR" }}' },
          { name: '>', example: '{{ order.total > 200 }}' },
          { name: '<', example: '{{ order.total < 50 }}' },
          { name: '>=', example: '{{ order.total >= 249.5 }}' },
          { name: '<=', example: '{{ order.item_count <= 4 }}' }
        ],
        template: `{{ order.total > 200 }}
{{ order.item_count == 0 }}
{{ order.currency != "EUR" }}`
      },
      {
        id: 'logic-truth',
        title: 'Logic & truthiness',
        catalog: [
          { name: 'and', example: '{% if order.vip_customer and order.total > 100 %}\nVIP + high value\n{% endif %}' },
          { name: 'or', example: '{% if order.vip_customer or order.item_count == 0 %}\nReview\n{% endif %}' },
          { name: 'not', example: '{% if not order.vip_customer %}\nStandard\n{% else %}\nVIP\n{% endif %}' }
        ],
        template: `{% if order.vip_customer and order.total > 100 %}
VIP + high value
{% endif %}
{% if not order.vip_customer or order.item_count == 0 %}
Review cart
{% else %}
Ready
{% endif %}`
      }
    ]
  },
  {
    id: 'loops',
    number: 3,
    title: 'Control Structures: Loops',
    summary: 'Iterate with for. loop.index / loop.last give position. Use namespace to mutate across iterations.',
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

Down: {{ ns.down }}   Total: {{ services | length }}`,
    subsections: [
      {
        id: 'for-endfor',
        title: 'for / endfor',
        catalog: [
          { name: '{% for %}', example: '{% for svc in services %}\n- {{ svc.name }}\n{% endfor %}' },
          { name: '{% endfor %}', example: '{% for svc in services %}\n- {{ svc.name }}\n{% endfor %}' }
        ],
        template: `{% for svc in services %}
- {{ svc.name }} (:{{ svc.port }})
{% endfor %}`
      },
      {
        id: 'for-else',
        title: 'for else',
        catalog: [
          { name: '{% else %}', example: '{% for svc in [] %}\n- {{ svc.name }}\n{% else %}\nNo services in the list.\n{% endfor %}' }
        ],
        template: `{% for svc in services %}
- {{ svc.name }}
{% else %}
No services in the list.
{% endfor %}`
      },
      {
        id: 'loop-helpers',
        title: 'loop.* helpers',
        catalog: [
          { name: 'loop.index', example: '{% for svc in services %}{{ loop.index }}. {{ svc.name }}\n{% endfor %}' },
          { name: 'loop.index0', example: '{% for svc in services %}{{ loop.index0 }}. {{ svc.name }}\n{% endfor %}' },
          { name: 'loop.first', example: '{% for svc in services %}{{ svc.name }}{{ " [first]" if loop.first else "" }}\n{% endfor %}' },
          { name: 'loop.last', example: '{% for svc in services %}{{ svc.name }}{{ " [last]" if loop.last else "" }}\n{% endfor %}' },
          { name: 'loop.length', example: '{% for svc in services %}{{ loop.index }}/{{ loop.length }} {{ svc.name }}\n{% endfor %}' }
        ],
        template: `{% for svc in services %}
{{ loop.index }}/{{ loop.length }} {{ svc.name }}{{ " [first]" if loop.first else "" }}{{ " [last]" if loop.last else "" }}
{% endfor %}`
      },
      {
        id: 'namespace',
        title: 'namespace',
        catalog: [
          { name: 'namespace()', example: '{% set ns = namespace(down=0) %}\n{% for svc in services %}\n{% if not svc.healthy %}{% set ns.down = ns.down + 1 %}{% endif %}\n{% endfor %}\nDown: {{ ns.down }}' }
        ],
        template: `{% set ns = namespace(down=0) %}
{% for svc in services %}
{% if not svc.healthy %}{% set ns.down = ns.down + 1 %}{% endif %}
{% endfor %}
Down: {{ ns.down }}`
      }
    ]
  },
  {
    id: 'filters',
    number: 4,
    title: 'Built-in Filters',
    summary: 'Pipe values through filters to transform them inline: {{ value | filter }}.',
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
Fallback: {{ extras | default("none provided", true) }}
JSON    : {{ payload | tojson }}`,
    subsections: [
      {
        id: 'pipe-chain',
        title: 'Pipe & chain',
        catalog: [
          { name: '| filter', example: '{{ name | trim }}' },
          { name: '| a | b', example: '{{ name | trim | title }}' },
          { name: '| filter(args)', example: '{{ price | round(2) }}' }
        ],
        template: `{{ name | trim | title }}
{{ price | round(2) }}`
      },
      {
        id: 'string-filters',
        title: 'String',
        useFilterGroup: 'string',
        template: `{{ name | trim }}
{{ name | trim | upper }}
{{ name | trim | lower }}
{{ name | trim | title }}
{{ name | trim | capitalize }}
{{ name | trim | replace("ada", "Ada") }}
{{ name | trim | truncate(8, true, "…") }}`
      },
      {
        id: 'list-filters',
        title: 'List',
        useFilterGroup: 'list',
        template: `{{ tags | unique | sort | join(", ") }}
{{ tags | length }}
{{ tags | first }} / {{ tags | last }}`
      },
      {
        id: 'fallback-json',
        title: 'Values & fallback',
        useFilterGroup: 'values',
        template: `{{ extras | default("none provided", true) }}
{{ payload | tojson }}
{{ price | round(2) }}`
      }
    ]
  },
  {
    id: 'tests',
    number: 5,
    title: 'Tests & Whitespace Control',
    summary: 'Ask questions with is (none, defined, number…). Trim extra newlines with {%- and -%}.',
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
{% endfor %}`,
    subsections: [
      {
        id: 'is-tests',
        title: 'is tests',
        catalog: [
          { name: 'is defined', example: '{{ env is defined }}' },
          { name: 'is undefined', example: '{{ missing is undefined }}' },
          { name: 'is none', example: '{{ owner is none }}' },
          { name: 'is even', example: '{{ retries is even }}' },
          { name: 'is odd', example: '{{ retries is odd }}' },
          { name: 'is number', example: '{{ retries is number }}' },
          { name: 'is sequence', example: '{{ regions is sequence }}' },
          { name: 'is string', example: '{{ env is string }}' }
        ],
        template: `{{ env is defined }}
{{ owner is none }}
{{ retries is even }}
{{ retries is number }}
{{ regions is sequence }}`
      },
      {
        id: 'whitespace',
        title: 'Whitespace',
        catalog: [
          { name: '{%- -%}', example: 'Tight:\n{%- for r in regions -%}\n- {{ r }}\n{% endfor %}' },
          { name: '{{- -}}', example: 'A{{- "B" -}}C' }
        ],
        template: `Tight:
{%- for r in regions -%}
- {{ r }}
{% endfor %}

Loose:
{% for r in regions %}
- {{ r }}
{% endfor %}`
      }
    ]
  },
  {
    id: 'macros',
    number: 6,
    title: 'Macros, Imports & Reusability',
    summary: 'Define callable snippets with macro. Import them from another template with from / import.',
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

Summary: {{ services | selectattr("healthy") | list | length }}/{{ services | length }} {{ pill(true) }}`,
    subsections: [
      {
        id: 'macro-def',
        title: 'macro',
        extraTemplates: {},
        catalog: [
          { name: '{% macro %}', example: '{% macro pill(ok) -%}{{ "OK" if ok else "DOWN" }}{%- endmacro %}\n{{ pill(true) }}' },
          { name: '{{ name(args) }}', example: '{% macro pill(ok) -%}{{ "OK" if ok else "DOWN" }}{%- endmacro %}\n{{ pill(false) }}' }
        ],
        template: `{% macro pill(ok) -%}{{ "OK" if ok else "DOWN" }}{%- endmacro %}
{% for svc in services %}
{{ svc.name }} -> {{ pill(svc.healthy) }}
{% endfor %}`
      },
      {
        id: 'from-import',
        title: 'from / import',
        catalog: [
          { name: '{% from import %}', example: '{% from "helpers.j2" import pill %}\n{{ pill(true) }}' }
        ],
        template: `{% from "helpers.j2" import pill, svc_line %}
{% for svc in services %}
{{ svc_line(svc, loop.index) }}
{% endfor %}
{{ pill(true) }}`
      }
    ]
  }
];
