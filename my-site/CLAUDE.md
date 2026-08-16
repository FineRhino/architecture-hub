## Project

AI Architecture Hub — an Astro content site with four content collections
(`blog`, `patterns`, `tools`, `guides`, defined in `src/content.config.ts`).
Each non-blog collection has an `index.astro` listing page and a
`[...slug].astro` detail page under `src/pages/<collection>/`, both built on
`src/layouts/ContentPage.astro`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

If component styles don't seem to reflect a recent edit, the dev server's
HMR cache can go stale — restart it (`astro dev stop` then
`astro dev --background`) before assuming the CSS itself is wrong.

Run `npm run build` before considering a change done. Dev mode's HMR can
mask routing and type errors that only surface at build time.

## Content collections gotcha

This project uses Astro's Content Layer API (`glob()` loader, Astro 7).
Collection entries expose `.id` and a standalone `render(entry)` imported
from `astro:content` — **not** the legacy `.slug` / `entry.render()` API.
Using the legacy API doesn't error; it silently produces an empty slug,
which collapses every detail page onto its collection's index route. If you
add a new collection, base its `[...slug].astro` on an existing one (e.g.
`src/pages/patterns/[...slug].astro`) rather than writing it from memory.

## Design system

- `src/styles/global.css` defines all color/spacing/shadow tokens (brand
  gradient, per-collection accent colors, radius/shadow scale) plus shared
  classes (`.entry-card`, `.icon-badge`, `.page-hero`, `.button`, etc.) used
  across listing and detail pages. Prefer these over new inline styles.
- `src/components/Icon.astro` is a small hand-built line-icon set (no
  external icon library, no emoji). Add new icons there.
- `@tailwindcss/vite` is installed and wired into `astro.config.mjs`, but
  it is **not imported in any CSS file**, so it has no effect. Don't assume
  Tailwind utility classes work — all styling here is hand-written CSS.

## Search

`npm run build` runs `astro build && pagefind --site dist`, which indexes
the built HTML into `dist/pagefind/`. The search page (`src/pages/search.astro`)
loads `/pagefind/pagefind-ui.js` at runtime, so **search only works after a
build** (`npm run build && npm run preview`) — it does nothing under
`npm run dev`, since that index doesn't exist yet. `data-pagefind-ignore` is
set on `<header>`, `<aside class="sidebar">`, and `<footer>` so repeated nav
chrome doesn't pollute every result's snippet.

## Astro scoped-style specificity gotcha

Astro compiles scoped `<style>` selectors by appending a `data-astro-cid-*`
attribute to every element in the selector, not just the last one — so
`nav a { ... }` becomes `nav[data-astro-cid-x] a[data-astro-cid-x]`. That
selector's specificity is (0, 2, 2) (two attributes, two elements). A later
rule like `.my-link { ... }` compiles to `.my-link[data-astro-cid-x]`, which
is only (0, 2, 0) — **fewer elements, so it loses**, even though it looks
more specific by ordinary CSS instincts and comes later in the file. This
silently broke a header icon button's padding override for a while. If a
style override on an element nested inside a broader selector (e.g. an `<a>`
inside `<nav>`) doesn't seem to apply, check compiled specificity in
`dist/_astro/*.css` rather than assuming source order will win — match or
exceed the original selector's element count (e.g. `nav a.my-link { ... }`).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
