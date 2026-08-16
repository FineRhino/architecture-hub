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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
