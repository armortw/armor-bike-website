# ARMOR BIKE Design System

The shared visual language for the ARMOR BIKE storefront — tokens, components, and
brand guidelines sampled directly from the live retail UI. Consumers link a single
stylesheet and pull React components from the compiled bundle.

## What's inside

- **Tokens** (`tokens/`) — color ramps, typography, spacing/radius/shadow, motion, and
  fonts. All exposed as CSS custom properties. Always reference tokens (`var(--…)`)
  rather than hard-coded values.
- **Components** (`components/`) — React building blocks, grouped by domain:
  - `catalog/` — `ProductCard`, `Badge`, `ColorSwatch`, `FilterGroup`
  - `forms/` — `Button`, `Checkbox`, `SearchInput`
- **Guidelines** (`guidelines/`) — brand logo, color, type, spacing & shadow reference cards.

## Using the system

Link the global stylesheet (this is the only CSS entry point consumers need):

```html
<link rel="stylesheet" href="styles.css">
```

Then mount components from the compiled bundle:

```html
<script src="_ds_bundle.js"></script>
<script>
  const { Button, ProductCard } = window.BIKE24DesignSystem_2233bc;
  // …render with React
</script>
```

> The bundle's window namespace (`BIKE24DesignSystem_2233bc`) is an internal,
> auto-generated identifier and is intentionally left unchanged so existing
> consumers keep working.

## Brand basics

- **Name / wordmark:** ARMOR BIKE — `ARMOR` in the foreground color, `BIKE` in the
  brand accent. Logo lockups live in `assets/` (on-blue and on-light variants).
- **Signature colors:** brand blue (header bar, links, primary actions) and brand
  yellow (highlights, accents). See `guidelines/colors-*` and `tokens/colors.css`.
- **Type:** Archivo for display/headings/prices; Hanken Grotesk for UI and body.
  These are free substitutions — swap in the licensed webfonts when available.
- **Shape language:** mostly square corners (`--radius-sm`), with pills reserved for
  the search bar, filter chips, and color swatches. Shadows are restrained — lift on
  hover, flat at rest.

## Conventions

- Author components as React with inline-token styling; document each with a
  `.prompt.md` (usage snippet) and, where typed, a `.d.ts`.
- Add a `<!-- @dsCard group="…" -->` comment as the first line of any `.html` you want
  to surface in the Design System tab.
- The build artifacts (`_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`)
  are generated automatically — never edit them by hand.
