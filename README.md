# JinjaPlay

<img src="assets/jinja-logo.svg" alt="Jinja" width="72" height="72">

Interactive [Jinja2](https://jinja.palletsprojects.com/) playground that runs **real Python Jinja2** in your browser. No server, no account, no data leaves the machine.

**Live:** [jinjaplay.shantanukhond.me](https://jinjaplay.shantanukhond.me)

Built by [Shantanu Khond](https://shantanukhond.me).

## Features

- Three panes: JSON context, Jinja template, live rendered output
- Actual CPython + the `jinja2` package, via [Pyodide](https://pyodide.org/) (WebAssembly)
- Built-in examples and six Learn lessons (same page, same editors)
- Copy output / reset to default
- 100% client-side

The first visit downloads the Python runtime (~10 MB). After that it is cached.

## Run locally

This is a static site. From the project root:

```bash
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765). Use the **Examples** / **Learn** toggle in the header.

## Deploy (GitHub Pages)

Pushes to `main` deploy through [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

One-time GitHub setup:

1. Create the repository and push this project to `main`.
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions.

Custom domain `jinjaplay.shantanukhond.me` is set in [`CNAME`](CNAME). At your DNS provider, add:

| Type  | Name       | Target                   |
| ----- | ---------- | ------------------------ |
| CNAME | `jinjaplay` | `shantanukhond.github.io` |

Then enable **Enforce HTTPS** in the Pages settings once the certificate is ready.

`.nojekyll` is included so GitHub Pages does not run Jekyll (the playground HTML contains `{{ }}` / `{% %}`).

## Project layout

```
index.html      Playground + Learn UI
app.js          Editors, examples, lessons, Jinja2 render via Pyodide
lessons.js      Lesson catalog
styles.css      Editor / tab / lesson styling
assets/         Official Jinja logo, favicon, share icons
CNAME           Custom domain
.github/workflows/deploy-pages.yml
```

## Credits

Jinja logo © [Pallets](https://palletsprojects.com/) / [Jinja](https://github.com/pallets/jinja). Rendering uses the real [jinja2](https://jinja.palletsprojects.com/) package in-browser.
