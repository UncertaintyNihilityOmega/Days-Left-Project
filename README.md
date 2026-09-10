# Days Left

A personal project, built with [Claude Code](https://claude.com/claude-code): a themeable countdown clock with three moods — Solarpunk, Cyberpunk, and *Decensus Ad Nihilum* (a black-hole theme) — that switches automatically based on time of day, or manually via the hidden button in the top-right corner (hover to reveal it).

New to the code? [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) explains every file and every concept from scratch, no prior coding knowledge assumed.

## Structure

```
days-left/
  index.html              markup only
  css/
    base.css               shared layout: card shell, clock/medallion, countdown text, quotes, theme toggle (with per-theme color overrides inline)
    solar.css               solarpunk-only: lotus leaf + flower, background gears/leaves, touch/hold effects (spinning gear, generative spiral, screen crack)
    cyber.css                cyberpunk-only: night skyline, moon, grid, motorcycle, red digit zones, green digit rain
    blackhole.css            Decensus Ad Nihilum-only: event horizon, accretion disk, void motes, gravity well
  js/
    theme.js                theme cycle (solar -> cyber -> blackhole -> solar), time-of-day default, countdown date math, motivational quotes
    scene-shapes.js          procedurally-drawn decorations: clock bezel ticks, drifting leaves, lotus petals, night-sky stars, motorcycle wheel spokes
    solar-effects.js         solar touch/hold effects + the shared "typewriter overlay" helper used by all three themes
    cyber-effects.js         cyberpunk red-zone / green-rain ambient systems
    blackhole-effects.js     void-mote ambient system
    interactions.js          pointer down/up wiring for all three themes' hold effects, blood moon, quasar flare, and ambient pool upkeep
```

## Editing

- **Target date**: `js/theme.js`, look for `targetDate`.
- **Motivational quotes**: `js/theme.js`, the `quotesSolar` / `quotesCyber` / `quotesBlackhole` arrays.
- **Theme colors**: CSS custom properties at the top of `css/base.css`.

## Hosting on GitHub Pages + embedding in Notion

1. Push this folder to a GitHub repo (this `README.md` and `index.html` can sit at the repo root, or under a subfolder — just keep `css/` and `js/` alongside `index.html`).
2. In the repo settings, enable **GitHub Pages** for the branch/folder containing `index.html`.
3. Once GitHub Pages gives you a URL (e.g. `https://<user>.github.io/<repo>/`), paste that URL into Notion using the `/embed` command.

No build step, no dependencies — it's plain HTML/CSS/JS, so it works as-is once served over HTTP(S).

## License

Public domain ([Unlicense](LICENSE)) — do whatever you want with it, no credit required.
