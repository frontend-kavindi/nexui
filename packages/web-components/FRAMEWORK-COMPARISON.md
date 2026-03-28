# NexUI: React vs Vue 3 vs Web Components

This note compares how teams consume **NexUI** (`@nexui/core`), **`@nexui/vue`**, and **`@nexui/web-components`** (Lit custom elements) in the same monorepo.

## Summary table

| Dimension | React (`@nexui/core`) | Vue 3 (`@nexui/vue`) | Web Components (Lit) |
| --- | --- | --- | --- |
| **Typical bundle cost** | Largest if the app is not otherwise React-free; tree-shaking works when importing named exports. | Moderate; pays for Vue runtime only once per app. | Small runtime (**Lit** ~5 KB gzipped) per surface; no framework VM if embedded in static HTML or non-Vue/React hosts. |
| **SSR / SSG** | First-class with Next.js, Remix, etc.; watch for hydration mismatches on interactive widgets. | First-class with Nuxt; similar hydration caveats for portals/modals. | **Declarative shadow DOM** and SSR stories vary by platform; many teams hydrate WC **only in the browser** or use thin wrappers. Modal/dialog behavior relies on **`<dialog>`** in evergreen browsers. |
| **Framework lock-in** | High inside React trees; none for token CSS. | High inside Vue SFCs; none for token CSS. | **Low** at integration boundaries—elements work in React, Vue, Angular, or CMS templates if **registered once**. |
| **Enterprise adoption pattern** | Default for greenfield React product teams and shared admin SPAs. | Common for Vue-centric lines of business or embedded micro-frontends that standardize on Vue. | Strong for **long-lived design systems**, embeddable widgets, **CMS / legacy shell** integration, or when multiple frameworks must share one visual language. |

## Shared tokens

All three stacks consume the same **design tokens** as CSS variables: load `@nexui/themes/css` (or your themed bundle) once on the page. Components reference `var(--nexui-*)` identically, so a React page and a Lit island can sit side-by-side without duplicate token definitions.

## Using multiple packages in one monorepo

1. **Single theme import** in the app shell or Storybook preview (see `apps/docs/.storybook/preview.tsx` for React).
2. **Framework-boundary rule**: use `@nexui/core` only inside React; `@nexui/vue` only inside Vue; use **`registerNexuiWebComponents()`** (or individual `registerNex*`) before rendering markup that contains `<nex-input>`, etc.
3. **Events**: React/Vue use props and callbacks; Web Components expose **DOM `CustomEvent`s** with typed `detail` (e.g. `nex-input`, `nex-change`, `nex-close`). Wrap them in framework-appropriate handlers (`addEventListener` or `onNexInput` wrappers).

## When should a company choose each?

- **Choose React** when the product is (or will be) overwhelmingly React, you need the richest ecosystem, and SSR with a mainstream meta-framework is a priority.
- **Choose Vue 3** when the org has committed to Vue/Nuxt, wants SFC ergonomics, and benefits from Vue’s reactivity for form-heavy UX.
- **Choose Web Components** when you must **ship the same UI into multiple runtimes**, embed into third-party pages, reduce long-term framework migration risk, or progressively enhance server-rendered HTML—at the cost of more explicit **registration**, **event naming**, and occasionally **polyfills** for older baselines.
