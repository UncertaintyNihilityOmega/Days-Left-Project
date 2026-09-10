# How This Project Works — A Beginner's Guide

You don't need to know how to code to read this. Every idea is explained from scratch, and every example is copied straight out of this project's real files, so you can open the file, find the line, and see it with your own eyes.

## Table of Contents

1. [The Big Picture: Three Languages, One Page](#1-the-big-picture-three-languages-one-page)
2. [How the Files Are Wired Together](#2-how-the-files-are-wired-together)
3. [Reading HTML: Tags, Attributes, IDs, and Classes](#3-reading-html-tags-attributes-ids-and-classes)
4. [A Crash Course in SVG](#4-a-crash-course-in-svg)
5. [Touring `index.html`](#5-touring-indexhtml)
6. [CSS Fundamentals](#6-css-fundamentals)
7. [Touring the CSS Files](#7-touring-the-css-files)
8. [JavaScript Fundamentals](#8-javascript-fundamentals)
9. [Touring the JavaScript Files](#9-touring-the-javascript-files)
10. [Where to Look First If You Want to Change Something](#10-where-to-look-first-if-you-want-to-change-something)

---

## 1. The Big Picture: Three Languages, One Page

Every website you've ever visited is built from the same three ingredients, and this project is no exception:

| Language | Job | House analogy |
|---|---|---|
| **HTML** | The content and structure — what elements exist, and in what order | The walls, rooms, doors, and windows |
| **CSS** | The appearance — colors, sizes, positions, animations | The paint, furniture, and lighting |
| **JavaScript (JS)** | The behavior — what happens when you click, wait, or interact | The electricity, plumbing, and people moving through the house |

A browser reads all three and combines them into what you see on screen. Change the HTML and you change *what exists*. Change the CSS and you change *how it looks*. Change the JS and you change *what it does*.

This project used to be a single giant file with all three mixed together. It's now split so each language lives in its own files — that's the "properly organized project" structure:

```
days-left/
  index.html              <- HTML only
  css/
    base.css              <- CSS: shared styling for the clock, quotes, toggle button
    solar.css             <- CSS: Solarpunk-only decorations and effects
    cyber.css             <- CSS: Cyberpunk-only decorations and effects
    blackhole.css         <- CSS: Decensus Ad Nihilum-only decorations and effects
  js/
    theme.js               <- JS: theme switching, the countdown math, quotes
    scene-shapes.js         <- JS: draws decorative shapes (leaves, stars, bezel ticks...)
    solar-effects.js        <- JS: what happens when you touch/hold in Solarpunk
    cyber-effects.js        <- JS: the red zones and green digit rain
    blackhole-effects.js    <- JS: the particles falling into the black hole
    interactions.js         <- JS: wires touch/hold events to all three themes
```

---

## 2. How the Files Are Wired Together

Open `index.html` and look near the top and bottom.

**Near the top**, inside `<head>`, four lines connect the CSS files:

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/solar.css">
<link rel="stylesheet" href="css/cyber.css">
<link rel="stylesheet" href="css/blackhole.css">
```

`<link rel="stylesheet" href="...">` tells the browser "go fetch this CSS file and apply its rules to this page." All four are loaded — the browser doesn't know or care which theme is currently active; it just has *all* the styling rules available, and (as you'll see in the CSS section) most of those rules only "turn on" when a certain condition is true.

**Near the bottom**, just before `</body>`, six lines connect the JavaScript files:

```html
<script src="js/theme.js"></script>
<script src="js/scene-shapes.js"></script>
<script src="js/solar-effects.js"></script>
<script src="js/cyber-effects.js"></script>
<script src="js/blackhole-effects.js"></script>
<script src="js/interactions.js"></script>
```

Two important details:

- **They're placed at the bottom, not the top.** JavaScript that tries to grab an HTML element (like the countdown number) has to wait until that element actually exists. Putting `<script>` tags after all the HTML guarantees the whole page has been read by the browser first.
- **The order matters.** These aren't independent modules — they're plain scripts that all share one common space (in programming this is called the "global scope"). `interactions.js` (loaded last) calls functions like `spawnHoldGear` and `ensureRedZones` that are *defined* in `solar-effects.js` and `cyber-effects.js` (loaded earlier). If you loaded `interactions.js` first, the browser would complain that those functions don't exist yet. Think of it like a recipe: you can't fold in the egg whites before you've whipped them.

---

## 3. Reading HTML: Tags, Attributes, IDs, and Classes

HTML is made of **elements**, written as tags:

```html
<p class="eyebrow" id="eyebrowText">counting down to</p>
```

- `<p>` and `</p>` are the **opening and closing tags**. Everything between them (`counting down to`) is the element's content.
- `class="eyebrow"` and `id="eyebrowText"` are **attributes** — extra information attached to the tag, written as `name="value"`.

### class vs. id

- **`class`** is like a label you can stick on *many* elements. In CSS you target it with a dot: `.eyebrow`. Several elements in this project share the class `cyber-only`, for instance — every one of them gets hidden together when a single CSS rule matches that class.
- **`id`** is meant to be *unique* — only one element on the page should ever have a given id. In CSS you target it with a hash: `#quoteText`. JavaScript uses ids constantly to grab one specific element: `document.getElementById('dayCount')` reaches into the page and hands back exactly the element with `id="dayCount"` (the big number in the clock).

### `data-*` attributes — the whole theme system hinges on this one

Look at the very first real tag in `index.html`:

```html
<html lang="en" data-theme="solar">
```

`data-theme` is a **custom data attribute**. HTML lets you invent your own attributes as long as they start with `data-`, and both CSS and JavaScript can read them. This project stores the *currently active theme* — `"solar"`, `"cyber"`, or `"blackhole"` — as this one attribute on the `<html>` tag.

- CSS rules like `[data-theme="cyber"] .count{ ... }` mean "only apply this style when the `<html>` tag's `data-theme` attribute equals `cyber`."
- JavaScript reads it with `root.getAttribute('data-theme')` and changes it with `root.setAttribute('data-theme', 'blackhole')`.

Change that one attribute, and the CSS rules that reference it snap into a completely different look, instantly, with zero extra code. That single attribute is the entire theme-switching mechanism.

### A few more attributes you'll see everywhere

- **`aria-hidden="true"`** — tells screen readers (software that reads the page aloud for visually-impaired visitors) to skip this element, because it's purely decorative (a background gear, a starfield). It does nothing visually.
- **`aria-label="..."`** — gives screen readers a text description for something that has no readable text of its own, like the theme toggle button (an icon with no words).
- **`tabindex="0"`** — lets an element (like the quote box, which isn't naturally a button or link) be reached by pressing the Tab key, so keyboard-only users can select it.
- **`role="button"`** — tells assistive technology "treat this like a button," even though it's really a `<div>`.

---

## 4. A Crash Course in SVG

A huge amount of this project's visuals — gears, leaves, the motorcycle, the lotus, the bezel ticks — are drawn with **SVG** (Scalable Vector Graphics) instead of image files. Where a photo (`.jpg`/`.png`) is a fixed grid of colored dots that gets blurry when you zoom in, an SVG is a *set of mathematical instructions* ("draw a circle here, a line there") that the browser re-draws perfectly sharp at any size.

### The coordinate system: `viewBox`

```html
<svg viewBox="0 0 100 100">
```

This says "this drawing's internal coordinate grid goes from `0,0` (top-left) to `100,100` (bottom-right)," regardless of how big the `<svg>` is actually displayed on the page. All the shapes inside are positioned using that 0–100 grid, and the browser stretches or shrinks the whole thing to fit. It's like designing on a fixed sheet of graph paper and then photocopying it at 200% or 50% — the drawing on the paper never changes, only the size of the printout.

### The basic shapes

```html
<circle cx="50" cy="50" r="30"/>        <!-- center x, center y, radius -->
<rect x="45" y="2" width="10" height="16"/>  <!-- top-left x, top-left y, width, height -->
<ellipse cx="195" cy="187" rx="190" ry="14"/> <!-- like a circle, but with separate x/y radii -->
<line x1="50" y1="6" x2="50" y2="16"/>   <!-- a straight line from point 1 to point 2 -->
```

### `<path>` — drawing with a pen

The most flexible shape is `<path>`, which uses a `d` (data) attribute containing a tiny language of pen commands:

```html
<path d="M50 4 C82 18 92 56 66 86 ... Z"/>
```

- `M x y` — **M**ove the pen to a point without drawing (lift the pen up, place it down here).
- `L x y` — draw a straight **L**ine to a point.
- `C x1 y1 x2 y2 x y` — draw a **C**urve (a "cubic Bézier curve") to the point `x,y`, using the two other points to control how the curve bends. This is how every rounded leaf, petal, and gear tooth in this project is shaped.
- `Z` — close the path (draw a final straight line back to where `M` started).

You'll see JavaScript in this project literally *build these path strings* by gluing numbers together — for example the lotus petals and the screen-crack lines are both paths assembled piece by piece in code (more on that in Section 9).

### `fill` and `stroke`

- **`fill`** is the color painted *inside* a shape.
- **`stroke`** is the color/width of the *outline* around a shape.

```html
<circle cx="88" cy="150" r="42" fill="#0b0710" stroke="#37f2ff" stroke-width="4"/>
```
This draws a dark, almost-black circle (the motorcycle's wheel) with a thick cyan outline.

### `currentColor` — letting CSS choose the color

Several shapes in this project use `fill="currentColor"` instead of a fixed color:

```html
<path fill="currentColor" d="M50 4 C82 18 ..."/>
```

`currentColor` means "whatever the CSS `color` property is, on this element (or its closest ancestor that sets one)." So a single leaf shape can be drawn once and then re-colored endlessly just by changing CSS: `.leaf-left{ color:var(--fern); }` makes it green, `svg.style.color = 'var(--sun)'` (set from JavaScript) makes another copy gold. This is exactly how the background leaves in `scene-shapes.js` end up in three different shades using only one drawn shape.

### `<defs>`, `<symbol>`, and `<use>` — draw once, stamp it out many times

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="gearShape" viewBox="0 0 100 100">
      <!-- the whole gear shape drawn here, once -->
    </symbol>
  </defs>
</svg>
```

`<defs>` (definitions) is a place to declare shapes *without drawing them on screen yet*. `<symbol>` is a reusable template — like a rubber stamp you carve once. Then anywhere else in the page:

```html
<svg class="leaf-left"><use href="#leafShape"></use></svg>
<svg class="bg-gear g-tl-big"><use href="#gearShape"></use></svg>
```

`<use href="#gearShape">` means "stamp a copy of the `gearShape` symbol right here." This project draws one gear shape and one leaf shape, then stamps out well over a dozen independently-sized, independently-colored, independently-animated copies of each. That's a big part of how the page stays lightweight despite having so many moving decorations.

### Gradients

```html
<linearGradient id="lotusGrad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#9FC088"/>
  <stop offset="55%" stop-color="#5B8C5A"/>
  <stop offset="100%" stop-color="#2F5233"/>
</linearGradient>
```

A gradient is a smooth blend between colors. You declare `<stop>` points along the way (0% = the start, 100% = the end, and anything in between) and the browser blends smoothly between them. `x1/y1` to `x2/y2` sets the direction the gradient flows in (here, straight down, since x never changes but y goes from 0 to 1). Once declared, a shape uses it with `fill="url(#lotusGrad)"` — a URL pointing at an ID, the same way a link points at a web address.

---

## 5. Touring `index.html`

With those tools in hand, here's what's actually in the file, top to bottom:

1. **The theme toggle `<button>`** — contains three `<svg>` icons (cyber-styled, solar-styled, blackhole-styled). CSS shows exactly one of the three at a time, based on which theme is currently active (Section 7 explains how).
2. **The invisible `<svg>` full of `<defs>`** — this is the "shape library": `gearShape` and `leafShape`, defined once, referenced everywhere else via `<use>`.
3. **The lotus leaf + flower** — a big decorative `<svg>` pinned to the bottom of the page. Notice `<g id="petalsOuter"></g>` and `<g id="petalsInner"></g>` are *empty* in the HTML — `<g>` just means "group." JavaScript (in `scene-shapes.js`) fills these empty groups with `<path>` petals at runtime. The HTML only sets up the container; the drawing itself happens in code.
4. **`#bgLayer`** — another empty-ish container (six `<use>` gears with no leaves yet) that JavaScript fills with 15 randomly-placed drifting leaves.
5. **`#cyberScene`** — the night-time backdrop: an empty `#cyberStars` div (filled by JS), the moon (with four `<span class="moon-crater">` positioned by inline `style="..."` percentages), an empty skyline container, the perspective grid, and the fully hand-drawn motorcycle `<svg>` (every wheel, wire, and body panel you saw in Section 4's shape vocabulary).
6. **`#blackholeScene`** — the void: an empty starfield container and the `.event-horizon` (two `<div class="accretion-disk">` plus a `<div class="horizon-core">` — these are drawn with pure CSS gradients, no SVG at all, which Section 7 explains).
7. **`.card`** — the actual countdown clock. Inside `.medallion` sits `.medallion-face`, which holds the small leaf/gear icon row and then the countdown numbers themselves (`#dayCount`, `#labelText`, `#breakdown`, `#untilLine`) — all given `id`s so JavaScript can update their text every time the countdown recalculates. Below the medallion sits the quote box (`#quoteBox` / `#quoteText`), a separate element that keeps its own visible background regardless of theme.

Notice a recurring pattern: several containers exist in the HTML but start out **empty**, with an `id` for JavaScript to find them later, and get their real content generated in code. This is deliberate — it means changing "how many leaves drift by" or "how many stars twinkle" is a one-line number change in JavaScript, not a chore of copy-pasting more HTML tags by hand.

---

## 6. CSS Fundamentals

A CSS **rule** looks like this:

```css
.count {
  font-family: 'Fraunces', serif;
  color: var(--moss);
}
```

- `.count` is the **selector** — which element(s) this rule applies to.
- Everything inside `{ }` is a list of **declarations**: `property: value;` pairs.

### Selectors used in this project

| Selector | Meaning | Example from the code |
|---|---|---|
| `.name` | any element with `class="name"` | `.card { ... }` |
| `#name` | the one element with `id="name"` | `#quoteText { ... }` |
| `[attr="value"]` | any element whose attribute matches | `[data-theme="cyber"] { ... }` |
| `A B` (space) | any `B` *inside* an `A`, however deep | `.quote-divider svg { ... }` |
| `A, B` | applies the same rule to both `A` and `B` | `.leaf-left,.leaf-right { ... }` |
| `A.b` (no space) | an element that is both `A` and has class `b` | `.hold-gear.intro { ... }` |

The **attribute selector**, `[data-theme="cyber"]`, is the single most important selector in this project. Combined with descendant selectors, `[data-theme="cyber"] .count { ... }` reads as "any `.count` element that lives inside something with `data-theme="cyber"`" — and because that attribute lives on the outermost `<html>` tag, *every single element on the page* counts as being "inside" it. This is how one attribute switch re-themes the entire page: dozens of rules like this are just sitting there, ready, and only "win" when the theme matches.

### CSS variables (custom properties)

```css
:root {
  --moss: #2F5233;
  --cyber-pink: #ff2bd6;
}
```

`:root` targets the top of the whole document. Anything declared here with a name starting in `--` is a **custom property** — a named value you can reuse anywhere with `var(--name)`:

```css
color: var(--moss);
```

Why bother? Because `--moss` is used in dozens of places across four CSS files. If you want to nudge the whole Solarpunk theme toward a slightly different green, you change **one line** in `base.css`, and every gear, leaf, and text label that referenced `var(--moss)` updates automatically. Without variables, you'd have to hunt down and edit every single `#2F5233` by hand.

### Box model basics

```css
* { box-sizing: border-box; }
```

Every element on a webpage is secretly a rectangle ("the box model") with content, padding, and a border. By default, if you say `width: 100px` and then add `padding: 10px`, the *actual* rendered box becomes 120px wide (padding is added on top). `box-sizing: border-box` changes the rule so that `width: 100px` really means 100px total, padding included — much less surprising, and the near-universal choice in modern CSS. The `*` selector means "every single element," so this one line fixes the box model everywhere, once.

### Positioning: where things sit, and what stacks on top

```css
position: relative | absolute | fixed;
```

- **`static`** (the default) — the element just sits in normal document flow.
- **`relative`** — still sits in normal flow, but you *can* nudge it and it becomes an "anchor" for any `absolute` children.
- **`absolute`** — pulled out of normal flow entirely, positioned relative to its nearest ancestor that has `position: relative/absolute/fixed` (or the whole page if none exists).
- **`fixed`** — like `absolute`, but anchored to the *browser window* itself, so it stays put even if the page scrolls. Nearly every background decoration in this project (`.bg-gear`, `.moon`, `.cyber-bike`, `.event-horizon`) uses `position: fixed` so it stays glued to a spot on screen.

```css
z-index: 9999;
```

When elements overlap, `z-index` decides which one paints on top — higher numbers win. This project uses it deliberately as a "layer plan": background gears sit at `z-index: 1`, the countdown card at `2`, the touch-effect gear/zone at `9999` (always on top), and the "Welcome" typewriter overlay at `10000` (above literally everything, since it should cover the whole screen).

### Flexbox — the easy way to arrange things in a row or column

```css
display: flex;
align-items: center;
justify-content: center;
```

`display: flex` turns an element into a "flex container" — its direct children automatically line up in a row (or, with `flex-direction: column`, a column), and `align-items`/`justify-content` center or space them out without any manual pixel math. `.icon-row { display:flex; align-items:center; justify-content:center; gap:6px; }` is why the leaf–gear–leaf icon trio sits perfectly centered with even spacing (`gap`) between them, regardless of screen size.

### Useful units

| Unit | Meaning | Example |
|---|---|---|
| `px` | a fixed pixel | `width: 74px;` |
| `%` | a percentage of the parent | `inset: 8%;` |
| `vw` / `vh` | 1% of the browser window's width / height | `top: 6%;` combined with `width: min(320px,58vw)` |
| `rem` | a multiple of the page's base font size | `font-size: .74rem;` |
| `min(a, b)` | uses whichever of the two is *smaller* | `width: min(360px, 86vw);` |
| `clamp(min, preferred, max)` | never goes below `min`, never above `max` | `font-size: clamp(1.9rem, 9vw, 3.2rem);` |

`min(360px, 86vw)` is a neat trick you'll see constantly: on a huge desktop monitor, 86% of the window width would be enormous, so it caps at 360px; on a tiny phone screen, 360px might not even fit, so it shrinks to 86% of the width instead. One line handles both extremes.

### Gradients (in CSS, not just SVG)

```css
background: linear-gradient(90deg, transparent, var(--sun), transparent);
```
A straight-line blend — here, invisible → gold → invisible, at a 90° angle (left to right), used for the thin decorative divider lines.

```css
background: radial-gradient(circle, rgba(217,164,65,.35), transparent 70%);
```
A blend radiating outward from a center point — used for every soft "glow" behind the clock and behind the moon.

```css
background: conic-gradient(from 0deg, transparent 0deg, rgba(255,182,119,.85) 40deg, ...);
```
A blend that sweeps *around* a circle, like the hands of a clock painting colors as they go — this is what makes the black hole's accretion disk look like it has bright and dark patches (explained fully in Section 7).

### Transforms

```css
transform: translate(-50%, -50%) rotate(45deg) scale(1.2);
```

`transform` moves, spins, or resizes an element *visually*, without affecting the layout of anything around it.

- `translate(x, y)` — shifts the element.
- `rotate(deg)` — spins it.
- `scale(n)` — grows or shrinks it (1 = normal size).

**The `translate(-50%, -50%)` trick, explained** (this one recurs *everywhere* in this project, and it's worth truly understanding): normally, if you set `left: 400px; top: 300px;` on a `position: fixed` element, the browser puts that element's **top-left corner** at the point (400, 300) — so the element balloons out to the bottom-right of where you actually wanted it centered. `translate(-50%, -50%)` shifts the element backward by *half of its own width and height*, which perfectly re-centers it on that point instead. Every glowing gear, every red digit zone, every gravity well in this project is centered on your exact click position using this one-line trick.

> **A real bug this project actually had:** the touch-effect gear briefly appeared shifted to the bottom-right of the click for a split second. The cause was exactly this: an animation was setting `transform: scale(...)` *without* including the `translate(-50%,-50%)` part, so for a moment the element reverted to being anchored by its corner instead of its center. The fix was making sure `translate(-50%,-50%)` is always present, either baked into the base (non-animated) style or included in every single keyframe of every animation that touches `transform`. It's a good lesson: `transform` is one property, and setting it anywhere (an animation, a hover state, plain CSS) *completely replaces* whatever value it had before — the different pieces (translate, rotate, scale) don't merge together automatically. You have to write out everything you want, every time.

### `@keyframes` and `animation` — motion that runs on its own

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.gear-front-big {
  animation: spin 6s linear infinite;
}
```

`@keyframes` defines a *name* (`spin`) for a sequence of styles over time — here, just a start (`from`) and end (`to`), but you can add any number of in-between stops using percentages (`0%`, `40%`, `100%`, etc. — see `holdGearIntro` in `solar.css` for an animation with three stops). The `animation` property then plays it: `spin 6s linear infinite` means "play the `spin` keyframes, taking 6 seconds per loop, at a constant (`linear`) speed, looping forever (`infinite`)." Swap `infinite` for a number like `1` and it plays once and stops.

`animation-fill-mode: forwards` (often just written as an extra word after the timing, e.g. `.8s ease-out forwards`) means "when the animation finishes, keep showing the very last frame" instead of snapping back to the un-animated style. You'll see this on the `hold-gear.intro` animation — without `forwards`, the gear would flicker back to invisible the instant its one-time spin-up finished.

### `transition` — the simpler cousin of `animation`

```css
.card {
  transition: background .5s ease, border-color .5s ease;
}
```

Where `@keyframes`/`animation` plays a pre-written sequence on its own, `transition` just says "whenever this property's *value* changes for any reason (theme switch, hover, JavaScript setting a class), smoothly glide to the new value over this much time" instead of snapping instantly. It's why switching themes fades the colors in rather than flashing.

### Pseudo-classes and pseudo-elements

```css
.quotes:hover { background: rgba(245,241,224,.72); }
.quotes:active { transform: scale(.98); }
#themeToggle:focus-visible { opacity: 1; }
```

A **pseudo-class** (single colon) matches an element in a certain *state*: `:hover` while the mouse is over it, `:active` while it's being clicked, `:focus-visible` while it's selected via keyboard.

```css
.medallion::before {
  content: "";
  position: absolute;
  inset: -9%;
  background: radial-gradient(circle, rgba(217,164,65,.35), transparent 70%);
}
```

A **pseudo-element** (double colon) lets a single HTML element grow an *extra*, invisible-to-HTML box you can style separately — `::before` inserts one right before the element's own content, `::after` right after. This project uses `::before` constantly to add a soft background glow behind the clock without needing an extra `<div>` in the HTML, and `::after` for the blinking text cursor after the "Welcome" message finishes typing (`.welcome-text.done::after { content:'▌'; ... }`).

### Masking — cutting a hole with a gradient

```css
mask-image: radial-gradient(circle, transparent 34%, black 36%, black 62%, transparent 64%);
```

A **mask** uses a gradient's brightness to decide what parts of an element are visible: anywhere the mask is `transparent`, the real element disappears; anywhere it's fully opaque (`black` here just means "fully visible" — the *color* black is irrelevant to a mask, only its opacity matters), the element shows normally. This gradient is transparent in the very center, opaque in a ring from 36%–62%, then transparent again outside — so applying it to a solid conic-gradient circle carves out a **ring / donut shape**, which is exactly how the accretion disk gets its shape from a plain square gradient.

### `filter`

```css
filter: drop-shadow(0 0 15px var(--glow)) blur(1px) brightness(1.35);
```

`filter` applies a whole-element visual effect: `drop-shadow` (a glow/shadow that follows the actual drawn shape, not just its rectangular box — unlike `box-shadow`), `blur`, and `brightness` are the ones used here, often stacked together.

### The reduced-motion media query

```css
@media (prefers-reduced-motion: reduce) {
  .bg-gear, .bg-leaf, /* ...more selectors... */ { animation: none !important; }
}
```

A `@media` query applies its rules only when a condition is true — usually about screen size, but here about an *accessibility setting*: some visitors' operating systems are configured to request less motion (to avoid discomfort or motion sickness). This block detects that preference and turns off every purely decorative animation. `!important` forces this rule to win over any other conflicting rule, no matter how specific — a deliberate, sparingly-used override to guarantee the accessibility promise actually holds.

---

## 7. Touring the CSS Files

### `css/base.css` — the shared clock, wearing different outfits

This file starts with the `@import` line (pulling in Google Fonts), the `:root` variable list, and the `box-sizing`/`body` basics from Section 6.

Then come the three **hide rules** that make theme-only decorations disappear:

```css
[data-theme="cyber"] .solar-only, [data-theme="blackhole"] .solar-only { display: none !important; }
```

Any element with class `solar-only` (the lotus, the background gears) vanishes the instant the theme isn't `solar`. Cyber and blackhole decorations have matching rules for their own `-only` classes.

The rest of the file is the **clock itself** — `.card`, `.medallion`, `.medallion-face`, and the countdown text (`.eyebrow`, `.count`, `.label`, `.divider`, `.breakdown`, `.until`) plus the quote box. Notice the *pattern* repeated for almost every one of these: a plain rule for the Solarpunk look (the default, since no `[data-theme=...]` condition is attached), immediately followed by a `[data-theme="cyber"]` version and a `[data-theme="blackhole"]` version overriding just the colors/fonts. For example:

```css
.count { font-family:'Fraunces', serif; color: var(--moss); ... }
[data-theme="cyber"] .count { font-family:'Orbitron',sans-serif; background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-pink)); -webkit-background-clip:text; color:transparent; }
```

That `background-clip: text` trick paints a gradient and then clips it to the exact shape of the text characters, which is how the countdown number gets a two-color gradient running across the digits in Cyberpunk and Decensus Ad Nihilum.

The **theme toggle button** section explains itself once you know two things: `opacity: 0` by default (invisible) with `opacity: 1` on `:hover`/`:focus-visible` (that's the "hidden until you hover over it" behavior), and three `.btn-icon-*` classes that get selectively shown per theme so the button always previews *the next theme in the cycle* rather than the current one.

### `css/solar.css` — leaves, gears, and a three-act touch effect

The lotus leaf/flower and the six drifting `.bg-gear` elements use the `spin`/`spinReverse` keyframes from `base.css` at different `animation-duration`s (some as slow as 130 seconds!) so they feel like a living, breathing background without ever distracting from the clock.

The most interesting part here is `.hold-gear`, which has **three animation states**, like a play in three acts:

```css
.hold-gear.intro { animation: holdGearIntro .8s ease-out forwards; }
.hold-gear.loop  { animation: holdGearLoop .5s linear infinite; }
.hold-gear.leaving { animation: holdGearLeave .35s ease-in forwards; }
```

1. **`intro`** plays once — the gear spins up from tiny and dim to full-size and glowing (0.8 seconds).
2. **`loop`** then takes over and spins forever, for as long as you keep holding down the mouse/finger.
3. **`leaving`** plays once you let go — a final spin-and-fade before the element is removed.

JavaScript is the one that swaps between these three classes at the right moments (see `spawnHoldGear` in Section 9) — the CSS just defines what each *act* looks like.

### `css/cyber.css` — borders made of shadow, and a layered night sky

You asked at one point to remove the red digit zones' visible border and replace it with a glow on just the left and right edges. Here's how that's done:

```css
.cyber-zone {
  box-shadow:
    inset 10px 0 16px -6px var(--cyber-red),
    inset -10px 0 16px -6px var(--cyber-red),
    0 0 10px rgba(255,43,74,.32);
}
```

`box-shadow` normally draws a shadow *outside* an element; the `inset` keyword flips it to draw *inside* instead. The four numbers are `horizontal-offset vertical-offset blur spread`. The first shadow (`10px 0 16px -6px`) is pushed 10px to the *right* with *no* vertical offset, so it only glows in from the left edge; the second (`-10px 0 ...`) is the mirror image, glowing in from the right. Because neither shadow has any vertical offset, the top and bottom edges stay dark — exactly the "left and right glow, no border, no top/bottom" look that was asked for.

The night scene stacks several `position: fixed` layers, each pinned to a different `z-index`, to build up depth: stars and skyline at the very back (`z-index: 1`), the perspective grid just above them (`z-index: 2`, using `transform: perspective(320px) rotateX(62deg)` to tilt a flat grid pattern into what looks like a road vanishing into the distance), the motorcycle sitting on top of that, and a `.cyber-scanlines` layer at `z-index: 6` overlaying everything with a subtle repeating stripe pattern (`mix-blend-mode: overlay` makes it blend into whatever's underneath rather than sitting as a flat, opaque layer, to fake an old CRT-monitor texture).

The falling green digits (`.cyber-column`) use the same masking idea from Section 6 — a `mask-image` that's transparent at the top of the column and fully visible at the bottom — so each falling column has a fading "comet tail" instead of a hard-edged block of text.

### `css/blackhole.css` — gradients pretending to be 3D objects

The accretion disk is the best example in this whole project of "faking" a complex shape using only gradients and masks:

```css
.accretion-disk {
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255,182,119,.85) 40deg, rgba(185,140,255,.6) 140deg, transparent 200deg, transparent 360deg);
  mask: radial-gradient(circle, transparent 34%, black 36%, black 62%, transparent 64%);
  animation: diskSpin 14s linear infinite;
}
```

Step by step: the `conic-gradient` paints a full square with color sweeping around like a color wheel (transparent → orange → violet → transparent → transparent, all the way around). The `mask` then punches a transparent hole in the middle and trims the outer edge, leaving only a **ring**. Finally, `animation: diskSpin` just rotates that ring continuously. Two of these (`.disk-2` is slightly smaller and spins the opposite direction, using `reverse`) layered together create the illusion of a genuinely three-dimensional, churning disk of matter — with zero actual 3D involved.

`.void-mote` is a single glowing dot whose *destination* isn't fixed in the CSS at all:

```css
@keyframes moteInfall {
  100% { transform: translate(var(--dx), var(--dy)) rotate(var(--spin)) scale(.15); opacity: 0; }
}
```

`var(--dx)`, `var(--dy)`, and `var(--spin)` are CSS custom properties again — but this time they're not declared once in `:root`; they're set **individually, per element, from JavaScript** (`mote.style.setProperty('--dx', ...)`, shown in Section 9). That's what lets one single keyframe animation produce hundreds of motes, each traveling a different distance in a different direction, without needing hundreds of different `@keyframes` blocks.

---

## 8. JavaScript Fundamentals

### Variables and functions

```js
var count = 5;
function addOne(n) {
  return n + 1;
}
```

`var name = value;` stores a value under a name you can reuse. `function name(parameters) { ... }` packages up a block of instructions you can run (or "call") later by writing `name(arguments)`. This project sticks to the older `var` keyword and plain `function` syntax everywhere (rather than newer `let`/`const`/arrow-function syntax) — purely a style choice for maximum compatibility, not a requirement.

### Running a function immediately: the `(function(){ ... })()` pattern

You'll see this shape repeatedly, e.g. in `scene-shapes.js`:

```js
(function initBezel(){
  // ...code...
})();
```

Wrapping a function in parentheses and adding `()` right after it **defines and immediately runs it, once**, without leaving its name lying around to accidentally clash with anything else. It's a tidy way to say "run this setup code now, then forget about it" — used here for all the one-time "draw the decorations" functions that only ever need to run once when the page loads.

### Arrays and objects

```js
var quotesSolar = [ "Small steps...", "You are allowed..." ];   // an array: an ordered list
var themeStrings = { solar: { eyebrow: "counting down to" } }; // an object: named fields
```

An **array** (square brackets) is an ordered list — you reach an item by its position (`quotesSolar[0]` is the first quote). An **object** (curly braces) is a collection of named fields — you reach a value by its name (`themeStrings.solar.eyebrow` or `themeStrings['solar'].eyebrow`). This project uses `themeStrings` as a lookup table so that "what text says on the clock" is just one line of data per theme, not a tangle of `if` statements sprinkled everywhere.

### Talking to the page: the DOM

The **DOM** (Document Object Model) is JavaScript's live, moving picture of the HTML — every tag becomes an object you can inspect and change.

```js
document.getElementById('dayCount')       // find the one element with this id
document.querySelector('.card')           // find the first element matching this CSS selector
document.querySelectorAll('.cyber-zone-bit') // find every matching element, as a list

el.textContent = '478';                   // change the visible text inside an element
el.style.left = '400px';                  // change one inline CSS property
el.style.setProperty('--dx', '20px');     // change a CSS *variable* on this one element
el.classList.add('leaving');              // add a class (triggers whatever CSS targets .leaving)
el.classList.remove('intro');             // remove a class
el.classList.toggle('active', someBool);  // add it if someBool is true, remove it if false
el.setAttribute('aria-label', 'Hello');   // set any HTML attribute
```

```js
document.createElement('div');                          // build a brand-new, blank <div> in memory
document.createElementNS(svgNS, 'circle');               // build an SVG element (needs the special
                                                          // "namespace" string because SVG tags share
                                                          // names like <use> or <a> with plain HTML,
                                                          // and the browser needs to know which "dialect"
                                                          // you mean)
parent.appendChild(newElement);                          // actually insert it into the visible page
element.remove();                                        // take it back out
```

Nothing you create with `createElement` appears anywhere until you `appendChild` it into something that's already on the page — this project's whole "spawn a glowing gear / red zone / falling star" trick is always the same three steps: **create → configure (classes, styles, text) → appendChild**.

### Listening for events

```js
document.addEventListener('pointerdown', function(e){
  console.log(e.clientX, e.clientY); // where the pointer went down
});
```

`addEventListener(eventName, handlerFunction)` says "whenever this event happens, run this function." This project listens for:
- `pointerdown` / `pointerup` / `pointercancel` — a unified event type that covers mouse clicks, finger taps, and stylus presses all at once, which is why the touch/hold effects work the same on a phone or a desktop.
- `click` and `keydown` — used on the quote box, so it responds both to a mouse click and to pressing Enter/Space while focused (a keyboard accessibility requirement).
- `blur` on `window` — fires if the browser tab/window loses focus, used here as a safety net to cancel any in-progress hold effect if you switch away mid-hold.

The `e` parameter is the **event object** — it carries details about what happened, like `e.clientX`/`e.clientY` (the pointer's pixel position) or `e.key` (which key was pressed).

### Timers

```js
var id = setTimeout(function(){ console.log('later'); }, 1000);  // run once, after 1000ms (1 second)
clearTimeout(id);                                                 // cancel it before it fires

var id2 = setInterval(function(){ console.log('again'); }, 500);  // run every 500ms, forever
clearInterval(id2);                                                // stop it
```

Both functions **immediately return an ID number** representing "the timer you just scheduled." If you don't keep that ID in a variable, you have no way to cancel the timer later — which is exactly why this project has so many `var xyzTimeout = null;` declarations sitting alongside functions that later do `if (xyzTimeout){ clearTimeout(xyzTimeout); xyzTimeout = null; }`. It's bookkeeping: "remember what we started, so we can politely stop it."

### Math you'll see a lot of

```js
Math.random()          // a random decimal between 0 (inclusive) and 1 (exclusive)
Math.floor(x)           // round down to the nearest whole number
Math.random() * 10       // a random decimal between 0 and 10
Math.floor(Math.random() * 10)  // a random *whole number* from 0 to 9 — used constantly for
                                 // "pick a random size / position / delay"
Math.PI                  // the mathematical constant π (~3.14159), a full circle in "radians"
Math.cos(angle), Math.sin(angle) // given an angle (in radians), return x/y coordinates around a circle —
                                  // used anywhere something needs to be placed "around" a center point
Math.exp(x)               // e (~2.718) raised to the power of x — used once, in the generative spiral
Math.min(a, b), Math.max(a, b), Math.abs(x) // smallest, largest, and "distance from zero" (always positive)
```

### `localStorage`

```js
localStorage.setItem('daysleft-theme', 'cyber');   // save a small piece of text, permanently, in this browser
var saved = localStorage.getItem('daysleft-theme'); // read it back (returns null if never set)
```

`localStorage` is a tiny, permanent (until manually cleared) storage box that belongs to this website in this specific browser. It's how your manually-picked theme survives a page refresh or a browser restart. It's wrapped in `try { ... } catch(e) { }` throughout this project because a small number of browser configurations block storage entirely, and without the `try/catch` that would crash the whole script instead of just silently skipping the "remember my choice" feature.

### `requestAnimationFrame`

```js
requestAnimationFrame(function(){
  svg.style.clipPath = full;
});
```

This asks the browser "run this function right before your next repaint." It's used once, in the screen-crack effect, for a subtle but important reason: if you set a starting CSS value and the *final* value in the same instant, the browser has no "before" and "after" to transition between, so nothing appears to animate. Asking for one real frame to pass in between guarantees the browser actually registers the starting position first, so the following `transition` genuinely animates from empty to fully-grown instead of just snapping straight to the end.

---

## 9. Touring the JavaScript Files

### `js/theme.js` — the control center

- **`restoreTheme`** (an immediately-run function, Section 8) checks `localStorage` first; if nothing was saved, it looks at `new Date().getHours()` (the current hour, 0–23) and picks Solarpunk (6am–12pm), Decensus Ad Nihilum (12pm–6pm), or Cyberpunk (6pm–6am) — then writes that choice onto `<html data-theme="...">`.
- **`currentTheme()`** just reads that attribute back. **`nextTheme()`** looks up the current theme's position in the `THEME_CYCLE` array and returns whichever theme comes right after it, wrapping back to the start with the `%` (remainder/"modulo") operator — `(idx + 1) % THEME_CYCLE.length` is a standard trick for "advance by one, and loop back to zero after the last item."
- **`updateCounter()`** is the real math of the countdown. It subtracts today's date from the target date to get years/months/days remaining, with a bit of careful adjustment (if today's day-of-month is later than the target's, borrow a month; if the month is negative, borrow a year) — this is the same logic you'd use counting on your fingers "how many years, months, and days until my birthday," just written out as explicit `if` statements. It then looks up the right phrasing from `themeStrings` and writes the results into the page with `textContent`.
- **`nextQuote()`** picks a random quote but uses a `do { ... } while (idx === lastQuoteIndex);` loop — "keep re-rolling the random number for as long as it matches the one we just showed" — which is exactly how "never repeat the same line twice in a row" is enforced.
- **`changeQuote()`** adds the `changing` class (which CSS fades to `opacity: 0`), waits 220 milliseconds with `setTimeout` for that fade to finish, swaps the text, then removes the class so CSS fades it back in. That's the entire "smooth text swap" effect — no animation library involved, just a class, a CSS transition, and a well-timed `setTimeout`.
- **`setTheme()`** is the one function that actually changes themes: it sets the attribute, saves it, refreshes all the on-screen text, shows a fresh quote, and — this is a nice bit of tidiness — immediately tops up that theme's ambient effects (`ensureRedZones()`, `ensureVoidMotes()`, etc.) so switching into Cyberpunk doesn't leave you staring at an empty screen waiting for the first red zone to spawn naturally.

### `js/scene-shapes.js` — everything "drawn in code"

Every function here follows the same shape: figure out how many copies to make, loop that many times, and for each one, roll random numbers for size/position/timing/color, then build and insert the element. For example, `initBezel` draws the clock's 24 tick marks by looping `for (var i = 0; i < 24; i++)` and computing `var angle = i * 15;` (since 24 × 15 = 360, this spaces them perfectly around the circle), then uses SVG's own `transform="rotate(angle 100 100)"` attribute to spin each tick line into position around the center point `(100,100)`.

`initLotusFlower`'s `petalPath` function is a great example of *code describing a shape mathematically* rather than an artist drawing it by hand: it computes the coordinates of a symmetric, pointed petal shape from just two numbers — `len` (how long) and `width` (how wide) — using the Bézier curve commands from Section 4, then that one function is called twelve times at twelve different rotation angles (`rotate(i * 60)` and `rotate(j * 60 + 30)`) to build a complete, symmetric flower.

### `js/solar-effects.js` — touch effects and two small feats of generative art

`spawnHoldGear` creates the gear element already carrying the `intro` class (so it immediately starts the "spin up" animation from `solar.css`), then attaches a **one-time** event listener:

```js
gear.addEventListener('animationend', function onIntroEnd(){
  gear.removeEventListener('animationend', onIntroEnd);
  gear.classList.remove('intro');
  gear.classList.add('loop');
});
```

`animationend` fires automatically the moment a CSS animation finishes — no timer needed, no guessing how long 0.8 seconds "really" takes with rendering overhead. The handler swaps `intro` for `loop`, handing control to the second "act" from Section 7's three-act structure, and immediately removes itself (`removeEventListener`) so it doesn't accidentally fire again later. This same pattern is genuinely useful any time you want "run something exactly once, right when an animation naturally finishes."

**The generative spiral** (`createSpiralSvg` / `updateSpiralPath`) draws the mathematical curve `x = cos³(t)·eᵏᵗ`, `y = sin³(t)·eᵏᵗ` for `t` running from 0 all the way to 60π (a huge number of loops around a circle). In plain language, the code:

1. Walks through 900 tiny steps of `t` from 0 to 60π.
2. At each step, computes an `(x, y)` point using that formula, and remembers the single largest coordinate seen so far (`maxMag`).
3. Once every point is computed, works out a `scale` factor so that the *largest* point ends up exactly 200 pixels from the center, and multiplies every point by that same scale.
4. Joins all 900 scaled points into one long string like `"12.3,-4.5 12.9,-3.1 ..."` and hands it to an SVG `<polyline>`'s `points` attribute, which just means "draw straight lines connecting all of these dots in order."

Step 3 (the rescaling) is the important trick: the raw formula can produce numbers that are astronomically larger at the end of the curve than at the beginning, which would make 99% of the drawing invisibly tiny. Scaling everything down by the same ratio keeps the *shape* of the curve intact while making it fit neatly inside the screen. `k` (how tightly the spiral winds) is passed in from `interactions.js`, increasing very slightly every time the function re-runs — which is why the pattern visibly evolves the longer you hold.

**The screen crack** (`buildCrackPattern`) builds a starburst of jagged lines from the click point outward: for each of ~12–17 "rays," it walks outward in several short, randomly-angled segments (`angle += small random amount` before each step) so the line looks broken and irregular rather than a perfectly straight ray, and occasionally branches off a shorter side-crack partway along. `startScreenCrack` then reveals the whole, already-drawn pattern using the `clip-path: circle(0px at ...)` → `circle(150vmax at ...)` growth trick from Section 6/8, so it looks like the cracks are spreading outward from your touch point over five real seconds, even though every line was actually finished and just sitting invisible before the reveal began.

**`startWelcomeTyping`** (used by *all three* themes, which is why it lives here but is really shared) uses a `setInterval` ticking every 85 milliseconds; each tick, it reveals one more character of the target message using `fullText.slice(0, i)` ("give me the first `i` characters of this text"), and stops itself once `i` reaches the full length — the classic "typewriter" text effect.

### `js/cyber-effects.js` — the self-replacing pool pattern

`pickZonePosition` tries a random spot up to 12 times, and only *accepts* it if it doesn't overlap the clock's actual on-screen position (found live with `getBoundingClientRect()`, which returns an element's real current pixel position and size). This trial-and-error approach — "guess, check, guess again" — is called **rejection sampling**, a simple and very common technique any time "pick something random, but not in this forbidden zone" is hard to solve with a neat formula.

The real heart of this file is a pattern repeated for both the red zones and the green rain:

```js
function spawnRedZone(){
  if (currentTheme() !== 'cyber') return;
  activeRedZones++;
  // ...build the element, insert it...
  var stay = 3000 + Math.random() * 3000;
  setTimeout(function(){
    // ...fade it out, then remove it...
    activeRedZones--;
    spawnRedZone();   // <-- immediately spawn its own replacement
  }, stay);
}
function ensureRedZones(){
  if (reduceMotion || currentTheme() !== 'cyber') return;
  while (activeRedZones < MIN_RED_ZONES){ spawnRedZone(); }
}
```

Every zone, right as it disappears, spawns a brand-new one to take its place — that's the entire trick behind "there are always at least 3 on screen." `ensureRedZones()` is a safety net called at page load, every four seconds, and right when you switch into the theme, which simply tops the count back up to the minimum if anything ever drifted below it (for instance, right after switching *away* from Cyberpunk and back, since zones stop replacing themselves the instant `currentTheme() !== 'cyber'` becomes true — a one-line guard at the top of the function that quietly lets the whole system idle down without needing any separate "pause/resume" logic).

### `js/blackhole-effects.js` — passing custom data from JS into a CSS animation

`createInfallMote` is short, but demonstrates a genuinely important idea:

```js
mote.style.setProperty('--dx', (targetX - startX) + 'px');
mote.style.setProperty('--dy', (targetY - startY) + 'px');
```

The CSS `@keyframes moteInfall` (Section 7) references `var(--dx)` and `var(--dy))`, but never says what number they actually are — that's decided **individually, per mote, from JavaScript**, at the moment each one is created. This is how a single shared animation can send a thousand different particles off in a thousand different directions and distances: the *behavior* (fly outward while shrinking and fading) lives once in CSS, and the *specifics* (how far, which way) are injected from JS each time.

### `js/interactions.js` — tying all three themes' hold effects together

This file starts with the simplest recurring effect in the whole project:

```js
setInterval(function(){
  document.querySelectorAll('.cyber-zone-bit, .cyber-column span').forEach(function(el){
    el.textContent = el.textContent === '0' ? '1' : '0';
  });
}, 500);
```

Every half a second, *every* currently-visible binary digit on the page flips its own value — that's the "spark/blink" effect. `? :` here is a **ternary operator**, a compact `if/else` you can use directly inside an expression: `condition ? valueIfTrue : valueIfFalse`.

**The blood moon's two-flag system** is a small but genuinely clever piece of logic. Both a 2-minute timer *and* holding the mouse for 15+ seconds should be able to turn the moon red — but if you were holding it red, and the timer's independent event happened to end at that exact same moment, a careless implementation would flip it back to normal even though you're still holding. The fix is two separate `true`/`false` flags:

```js
var bloodMoonAmbientActive = false;
var bloodMoonHoldActive = false;
function updateBloodMoonVisual(){
  var on = bloodMoonAmbientActive || bloodMoonHoldActive;
  moon.classList.toggle('blood', on);
}
```

The moon is only ever told to go back to normal-colored when **both** flags are false at once (`||` means "or" — `on` is true if *either* flag is true). Each system only ever touches its *own* flag and then asks `updateBloodMoonVisual()` to recompute the honest, combined answer. The Decensus Ad Nihilum theme doesn't need this trick for its quasar flare, since nothing else competes to control it, but the blood moon needed exactly this to be correct.

**The hold-effect functions** (`startSolarHold`/`clearSolarHold`, `startBlackholeHold`/`clearBlackholeHold`, and cyberpunk's inline equivalent inside the `pointerdown` listener) all follow one shape: a `start...` function that kicks off several `setTimeout`s (for the effects that should only happen after holding a while) and `setInterval`s (for effects that should repeat throughout the hold), carefully saving every single timer ID and every created element into a `var`; and a matching `clear...` function that checks each of those variables and, if it exists, cancels the timer / fades and removes the element / resets it to `null`. Writing "remember everything, then carefully undo everything" as a matched pair of functions like this is a extremely common and reliable pattern any time you're coordinating multiple things that all need to stop together.

Finally, **one single `pointerdown` listener** decides which of the three `start...Hold` paths to run, based on `currentTheme()` — and **one single `releaseHold()`** function, attached to `pointerup`, `pointercancel`, and even `window`'s `blur` event (in case you switch browser tabs mid-hold), calls *all three* `clear...` functions unconditionally. Since each `clear` function safely does nothing if its own effect was never started (every check is guarded by `if (someVariable){ ... }`), it's always safe to call all three "just in case," rather than needing to remember which theme was active when the hold began.

The very last block in the file is the **bootstrapping** — the handful of top-level function calls and `setInterval`s that actually get the ambient systems (red zones, green rain, void motes, blood moon, quasar flare) running in the first place when the page loads.

---

## 10. Where to Look First If You Want to Change Something

| I want to... | Go to... |
|---|---|
| Change the target date | `js/theme.js`, the `targetDate` line near the top |
| Add/edit motivational quotes | `js/theme.js`, the `quotesSolar` / `quotesCyber` / `quotesBlackhole` arrays |
| Change a theme's colors | `css/base.css`, the `:root` variables at the very top |
| Change how many background leaves/stars/zones there are | Look for a `count`/`n`/`MIN_...` variable near the top of the relevant function in `js/scene-shapes.js` or `js/cyber-effects.js` |
| Change how long you have to hold before something happens | `js/interactions.js`, search for the number of milliseconds (`15000` = 15 seconds, `30000` = 30 seconds) inside `startSolarHold`, `startBlackholeHold`, or the cyberpunk branch of the `pointerdown` listener |
| Change the "Welcome" messages | Search each file for `startWelcomeTyping('...')` — the text is the argument in quotes |

The safest way to experiment: change one small thing, save, and refresh the page in your browser. If something breaks, open your browser's **Developer Tools** (usually `F12` or right-click → *Inspect*) and check the **Console** tab — JavaScript will print a red error message telling you which file and line it got confused on. That error message is not a punishment; it's the most helpful clue you'll get.
