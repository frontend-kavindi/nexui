# NexUI

[![Tests](https://img.shields.io/github/actions/workflow/status/frontend-kavindi/nexui/ci.svg?label=tests)](https://github.com/frontend-kavindi/nexui/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-live-ff69b4.svg)](https://frontend-kavindi.github.io/nexui)

A modern, accessible, and comprehensive design system built for React, Vue 3, and Web Components. NexUI provides a complete set of UI components with built-in accessibility, theming, and developer experience.

## ✨ Features

- 🎨 **Beautiful Components** - 25+ carefully crafted components
- 🌈 **Theming System** - CSS custom properties with light/dark themes
- ♿ **Accessibility First** - WCAG 2.1 AA compliant out of the box
- 🔧 **Framework Agnostic** - React, Vue 3, and Web Components support
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **TypeScript Native** - Full type safety, zero `any` types
- 🚀 **Modern Tooling** - Vitest, ESLint, Storybook, Changesets
- 📦 **Tree Shakable** - Optimal bundle sizes
- 🎭 **Storybook** - Interactive component documentation

## 🚀 Quick Start

### React

```bash
npm install @nexui/core @nexui/themes
# or
pnpm add @nexui/core @nexui/themes
```

```jsx
import { NexuiButton, NexuiThemeProvider } from '@nexui/core';
import '@nexui/themes/dist/index.css';

function App() {
  return (
    <NexuiThemeProvider>
      <NexuiButton variant="primary">Click me</NexuiButton>
    </NexuiThemeProvider>
  );
}
```

### Vue 3

```bash
npm install @nexui/vue @nexui/themes
# or
pnpm add @nexui/vue @nexui/themes
```

```vue
<template>
  <NexuiThemeProvider>
    <NexuiButton variant="primary" @click="handleClick">
      Click me
    </NexuiButton>
  </NexuiThemeProvider>
</template>

<script setup>
import { NexuiButton, NexuiThemeProvider } from '@nexui/vue';
import '@nexui/themes/dist/index.css';

const handleClick = () => console.log('clicked');
</script>
```

### Web Components

```bash
npm install @nexui/web-components @nexui/themes
# or
pnpm add @nexui/web-components @nexui/themes
```

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="node_modules/@nexui/web-components/dist/index.js"></script>
  <link rel="stylesheet" href="node_modules/@nexui/themes/dist/index.css">
</head>
<body>
  <nex-button variant="primary">Click me</nex-button>
</body>
</html>
```

## 📚 Documentation

Visit our **[Storybook](https://frontend-kavindi.github.io/nexui)** for interactive component documentation, examples, and design guidelines.

## 🎯 Framework Comparison

| Feature | React | Vue 3 | Web Components |
|---------|--------|-------|----------------|
| **Component Count** | 25 | 10 | 6 |
| **Bundle Size** | ~30KB | ~20KB | ~15KB |
| **TypeScript** | ✅ Full | ✅ Full | ✅ Full |
| **SSR Support** | ✅ Next.js | ✅ Nuxt | ❌ |
| **Tree Shaking** | ✅ | ✅ | ✅ |
| **IE Support** | ❌ | ❌ | ❌ |
| **Custom Elements** | ✅ | ✅ | ✅ Native |
| **Reactivity** | ✅ Hooks | ✅ Composition API | ✅ Lit |
| **DevTools** | ✅ | ✅ | ✅ |

## 🎨 Theming

NexUI uses CSS custom properties for flexible theming:

```css
:root {
  --nexui-color-primary: #667eea;
  --nexui-color-secondary: #764ba2;
  --nexui-spacing-sm: 8px;
  --nexui-spacing-md: 16px;
  --nexui-font-family: 'Inter', sans-serif;
}
```

### Theme Switching

```javascript
// Switch to dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Switch to light theme
document.documentElement.setAttribute('data-theme', 'light');
```

## 🧩 Components

### Forms & Inputs
- **Button** - Variants, sizes, loading states
- **Input** - Text, number, email with validation
- **Checkbox** - Custom styled checkboxes
- **Radio** - Radio button groups
- **Select** - Dropdown select component

### Layout
- **Card** - Content containers
- **Accordion** - Collapsible sections
- **Tabs** - Tab navigation
- **Modal** - Dialog overlays

### Data Display
- **Table** - Sortable data tables
- **DataGrid** - Advanced grid with virtualization
- **Avatar** - User avatars with fallbacks
- **Badge** - Status indicators
- **Spinner** - Loading indicators

### Navigation
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation

### Feedback
- **Toast** - Notification messages
- **ProgressBar** - Progress indicators

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/frontend-kavindi/nexui.git
cd nexui

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Commands

```bash
# Development
pnpm dev              # Start all packages in dev mode
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Run linting
pnpm storybook        # Start Storybook

# Individual packages
pnpm --filter @nexui/core dev
pnpm --filter @nexui/vue dev
pnpm --filter @nexui/web-components dev
```

### Project Structure

```
nexui/
├── packages/
│   ├── core/                 # React components
│   ├── vue/                  # Vue 3 components
│   ├── web-components/       # Lit Web Components
│   ├── themes/               # Design tokens & CSS
│   └── utils/                # Shared utilities
├── apps/
│   └── docs/                 # Storybook documentation
├── .github/
│   └── workflows/            # CI/CD pipelines
└── tools/                    # Build tools and scripts
```

## 🧪 Testing

We use Vitest for unit testing with comprehensive coverage:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## 📦 Publishing

This project uses Changesets for automated publishing:

1. **Create a changeset**:
   ```bash
   pnpm changeset add
   ```

2. **Version packages**:
   ```bash
   pnpm changeset version
   ```

3. **Publish to NPM**:
   ```bash
   pnpm release
   ```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

### Quick Checklist

- [ ] Follow the existing code style
- [ ] Add tests for new features
- [ ] Update documentation
- [ ] Ensure all tests pass
- [ ] Add a changeset if applicable

## 📄 License

MIT © [NexUI Contributors](LICENSE)

## 🙏 Acknowledgments

- [Lit](https://lit.dev/) - Web Components library
- [Vite](https://vitejs.dev/) - Build tool
- [Storybook](https://storybook.js.org/) - Component documentation
- [Vitest](https://vitest.dev/) - Testing framework
- [Changesets](https://github.com/changesets/changesets) - Version management

---

**Built with ❤️ by the NexUI team**
