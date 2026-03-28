# NexUI Vue vs React prop and event differences

This document compares `@nexui/vue` Single File Components with `@nexui/core` React components for the first ten ported controls. It explains **why** APIs differ (Vue idioms vs React idioms), confirms **shared design tokens**, and shows how a **monorepo consumer** can ship both frameworks side by side.

---

## Shared design tokens (identical in React and Vue)

All components style themselves with **CSS variables** such as `var(--nexui-color-primary-600)`, `var(--nexui-spacing-4)`, `var(--nexui-z-index-modal)`, etc. Those variables are defined by `@nexui/themes` and applied by `NexuiThemeProvider` (React) or `NexuiThemeProvider` (Vue) calling `applyNexuiTheme`. **The same token file drives both packages**, so a host page can load one theme once and render React *and* Vue islands with matching visuals—as long as both trees sit under a subtree where the variables are defined (typically `:root` or a shared layout wrapper).

---

## Button

| Aspect | React (`NexuiButton`) | Vue (`NexuiButton`) |
| --- | --- | --- |
| **Icons** | `iconLeft` / `iconRight` as `ReactNode` props | Named slots `icon-left` / `icon-right` (avoids `h()` in consumer code) |
| **v-model** | N/A (not a text input) | N/A |
| **Semantics / ARIA** | Native `<button>`, `aria-busy` when loading | Same |

**Why:** Vue favors **slots** for optional markup; React favors **props** for trees. Behavior and tokens match.

---

## Input

| Aspect | React | Vue |
| --- | --- | --- |
| **Value** | `value` + `onChange` or uncontrolled `defaultValue` | `v-model` (`modelValue` / `update:modelValue`) |
| **Clear** | `onClear` callback | `clear` emit (parent typically clears `v-model`; same contract as a callback) |
| **Extra attrs** | `...rest` spread onto `<input>` | Explicit props (`name`, `placeholder`, `autocomplete`, …) + `useAttrs()` passthrough for the input (excluding `class` / `style` merged on the shell) |

**Why:** `v-model` is the idiomatic controlled pattern in Vue 3.4+ (`defineModel`). Clear still needs an **event** so parents can reset related state in one place.

---

## Modal

| Aspect | React | Vue |
| --- | --- | --- |
| **Open state** | `open` + `onOpenChange` | `v-model:open` (`open` / `update:open`) |
| **Title** | `title` prop (`ReactNode`) | `title` **slot** (supports rich content without prop typing pain) |
| **Focus** | `focus-trap-react` | `focus-trap` (imperative, same underlying library family) |

**Why:** Named `v-model` maps cleanly to boolean overlays. Slots replace `ReactNode` title for flexibility.

---

## Select

| Aspect | React | Vue |
| --- | --- | --- |
| **Value** | `value` / `defaultValue` + `onChange` | `v-model` (`modelValue` is `string` or `string[]` when `multiple`) |
| **Change notification** | `onChange` callback | `update:modelValue` (listen with `@update:model-value` if you need a side-effect, mirroring React’s callback) |
| **Filter field** | Unlabeled unless consumer adds label | `aria-label="Filter options"` on the search input (matches React) |

**Why:** Multi-select values are naturally `string[]` in both; Vue binds them with a single `v-model`.

---

## Toast

| Aspect | React | Vue |
| --- | --- | --- |
| **API surface** | `NexuiToastProvider` + `useNexuiToast()` | `NexuiToastProvider` + `useNexuiToast()` |
| **State** | Context value `{ toasts, push, dismiss }` | `provide` / `inject` with the same shape; `toasts` is a **`Ref`** for reactivity |

**Why:** Vue has no React Context; **provide/inject** is the nearest equivalent. Exposing `toasts` as a `Ref` makes `<template>` bindings trivial (`toasts.length` auto-unwraps).

---

## Checkbox

| Aspect | React | Vue |
| --- | --- | --- |
| **Checked** | `checked` + `onChange` or uncontrolled | `v-model` boolean |
| **Label** | `label` as `ReactNode` | `label` as `string` (simplify; use slot later if rich labels are required) |

**Why:** Native checkbox semantics are preserved; `v-model` replaces controlled `checked` wiring.

---

## Radio

| Aspect | React | Vue |
| --- | --- | --- |
| **Group value** | `NexuiRadioGroup` with `value` / `defaultValue` + `onValueChange` | `NexuiRadioGroup` with `v-model` (`modelValue` string) |
| **Options** | `NexuiRadio` children consume Context | Same nesting; **provide/inject** instead of React Context |

**Why:** One group model is the natural `v-model` target; radios stay native for keyboard and SR support.

---

## Switch

| Aspect | React | Vue |
| --- | --- | --- |
| **State** | `checked` / `defaultChecked` + `onCheckedChange` | `v-model` boolean |
| **Label** | `ReactNode` | `string` prop + `aria-labelledby` wiring identical to React |

**Why:** Toggle state maps 1:1 to a boolean `v-model`.

---

## Badge

| Aspect | React | Vue |
| --- | --- | --- |
| **Content** | `children` | Default **slot** |
| **Live region** | `live` adds `role="status"` + `aria-live="polite"` | Same |

**Why:** Slot vs `children` is the standard React/Vue split; ARIA is unchanged.

---

## Avatar

| Aspect | React | Vue |
| --- | --- | --- |
| **Fallback** | `ReactNode` `fallback` | `string` `fallback` (+ slot extension possible later) |
| **Custom attrs on `<img>`** | `...rest` | `useAttrs()` passthrough to `<img>` (wrapper `class` / `style` merge on the shell) |
| **ARIA when image hidden** | `aria-label` hyphen prop | `ariaLabel` **camelCase prop** (avoids awkward `:aria-label` binding in every SFC caller) |

**Why:** Hyphenated global attributes are annoying as Vue props; **camelCase `ariaLabel`** is a deliberate ergonomics trade with the same runtime attribute on the host.

---

## Using React and Vue together in one monorepo

1. **Install** both `@nexui/core` and `@nexui/vue` in the workspace (or in specific apps).
2. **Apply the theme once** per document (or per shadow root): either wrap with React `NexuiThemeProvider` *or* Vue `NexuiThemeProvider`, or call `applyNexuiTheme` from a small bootstrap script if you mount mixed micro-frontends.
3. **Bundle separately**: Vue components require a Vue 3 app instance; React components require React 18+. Typical patterns: Vue widget in one island, React app in another, both reading the **same** `--nexui-*` variables from `themes/build/css`.

---

## Commands (exact order)

From the repository root (`D:\nexui`):

```bash
pnpm install
pnpm --filter @nexui/vue run build
pnpm --filter @nexui/vue run test
pnpm --filter @nexui/vue run lint
```

To verify types only inside the Vue package:

```bash
cd packages/vue
pnpm exec vue-tsc --noEmit
```
