# Contributing to NexUI

Thank you for your interest in contributing to NexUI! This guide will help you get started with contributing to our design system.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 9.x or higher (recommended package manager)
- **Git** for version control

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/nexui.git
   cd nexui
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/frontend-kavindi/nexui.git
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Start development**
   ```bash
   # Start all packages in development mode
   pnpm dev
   ```

5. **Verify setup**
   ```bash
   # Run tests to ensure everything is working
   pnpm test
   ```

## 📁 Project Structure

```
nexui/
├── packages/
│   ├── core/                 # React components
│   │   ├── src/
│   │   │   ├── components/    # Component files
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── utils/         # Utilities
│   │   │   └── index.ts       # Public API
│   │   ├── stories/           # Storybook stories
│   │   └── tests/             # Test files
│   ├── vue/                   # Vue 3 components
│   ├── web-components/        # Lit Web Components
│   ├── themes/                # Design tokens & CSS
│   └── utils/                 # Shared utilities
├── apps/
│   └── docs/                  # Storybook documentation
├── .github/
│   └── workflows/            # CI/CD pipelines
└── tools/                     # Build tools and scripts
```

## 🏗️ Development Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
```

### 2. Development

```bash
# Start development server
pnpm dev

# Or work on a specific package
pnpm --filter @nexui/core dev
```

### 3. Adding Components

#### For React (`@nexui/core`)

1. **Create component file**:
   ```typescript
   // packages/core/src/components/NexuiComponent/NexuiComponent.tsx
   import { forwardRef } from 'react';
   import { classNames } from '@nexui/utils';
   
   export interface NexuiComponentProps {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     children?: React.ReactNode;
   }
   
   export const NexuiComponent = forwardRef<HTMLDivElement, NexuiComponentProps>(
     ({ variant = 'primary', size = 'md', children, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={classNames(
             'nexui-component',
             `nexui-component--${variant}`,
             `nexui-component--${size}`
           )}
           {...props}
         >
           {children}
         </div>
       );
     }
   );
   
   NexuiComponent.displayName = 'NexuiComponent';
   ```

2. **Add styles**:
   ```css
   /* packages/core/src/components/NexuiComponent/NexuiComponent.css */
   .nexui-component {
     /* Base styles */
   }
   
   .nexui-component--primary {
     /* Primary variant styles */
   }
   ```

3. **Create tests**:
   ```typescript
   // packages/core/src/components/NexuiComponent/NexuiComponent.test.tsx
   import { render, screen } from '@testing-library/react';
   import { NexuiComponent } from './NexuiComponent';
   
   describe('NexuiComponent', () => {
     it('renders correctly', () => {
       render(<NexuiComponent>Test</NexuiComponent>);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
   });
   ```

4. **Create Storybook story**:
   ```typescript
   // packages/core/stories/NexuiComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { NexuiComponent } from '../src/components/NexuiComponent';
   
   const meta: Meta<typeof NexuiComponent> = {
     title: 'Components/NexuiComponent',
     component: NexuiComponent,
     parameters: {
       layout: 'centered',
     },
   };
   
   export default meta;
   type Story = StoryObj<typeof meta>;
   
   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Component',
     },
   };
   ```

5. **Export from index**:
   ```typescript
   // packages/core/src/index.ts
   export { NexuiComponent, type NexuiComponentProps } from './components/NexuiComponent';
   ```

#### For Vue 3 (`@nexui/vue`)

Similar structure, but using Vue 3 Composition API:

```vue
<!-- packages/vue/src/components/NexuiComponent/NexuiComponent.vue -->
<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
});

const classes = computed(() => [
  'nexui-component',
  `nexui-component--${props.variant}`,
  `nexui-component--${props.size}`,
]);
</script>
```

#### For Web Components (`@nexui/web-components`)

```typescript
// packages/web-components/src/components/NexuiComponent.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators';

@customElement('nex-component')
export class NexComponent extends LitElement {
  @property({ reflect: true }) variant: 'primary' | 'secondary' = 'primary';
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div class="nexui-component nexui-component--${this.variant} nexui-component--${this.size}">
        <slot></slot>
      </div>
    `;
  }
}
```

### 4. Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @nexui/core test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### 5. Linting

```bash
# Run linting for all packages
pnpm lint

# Run linting for specific package
pnpm --filter @nexui/core lint

# Auto-fix linting issues
pnpm lint --fix
```

### 6. Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @nexui/core build
```

## 📝 Coding Standards

### TypeScript

- **No `any` types** - Always use proper typing
- **Strict mode** - All files must pass strict TypeScript checks
- **Explicit returns** - Use explicit return types for public APIs
- **Interface naming** - Use `PascalCase` for interfaces (e.g., `ComponentProps`)

### React

- **Functional components** - Use function components with hooks
- **Forward refs** - Use `forwardRef` for components that need ref forwarding
- **Props destructuring** - Destructure props in function signature
- **Display names** - Set `displayName` for all components

### Vue 3

- **Composition API** - Use `<script setup>` syntax
- **TypeScript** - Always use `lang="ts"`
- **Props definition** - Use `defineProps` with interfaces
- **Emits** - Use `defineEmits` for event definitions

### Web Components

- **Lit framework** - Use LitElement and decorators
- **Custom elements** - Use kebab-case for element names
- **Properties** - Use `@property` decorator with proper types
- **Slots** - Always provide default slot content

### CSS

- **CSS custom properties** - Use design tokens for all values
- **BEM methodology** - Use Block-Element-Modifier naming
- **Utility classes** - Use `classNames` utility for conditional classes
- **Responsive design** - Mobile-first approach with breakpoints

### Accessibility

- **WCAG 2.1 AA** - All components must meet accessibility standards
- **Semantic HTML** - Use appropriate HTML elements
- **ARIA attributes** - Add necessary ARIA attributes
- **Keyboard navigation** - Ensure keyboard accessibility
- **Screen readers** - Test with screen readers

## 🧪 Testing Guidelines

### Unit Tests

- **Coverage** - Aim for 80%+ test coverage
- **Test structure** - Use `describe`, `it`, and `expect` from Vitest
- **Assertions** - Test component behavior, not implementation
- **Mocking** - Mock external dependencies and APIs

### Component Testing

```typescript
// Example test structure
describe('NexuiButton', () => {
  it('renders with default props', () => {
    // Test default rendering
  });

  it('handles click events', () => {
    // Test event handling
  });

  it('applies variant classes correctly', () => {
    // Test CSS classes
  });

  it('supports accessibility attributes', () => {
    // Test a11y features
  });
});
```

### Visual Testing

- **Storybook** - Create stories for all component variations
- **Visual regression** - Use Chromatic for visual testing
- **Responsive testing** - Test at different breakpoints

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No TypeScript errors
- [ ] No `any` types used

### Documentation
- [ ] Component has proper JSDoc comments
- [ ] Storybook story created/updated
- [ ] README updated (if needed)
- [ ] Changeset added (if version bump needed)

### Testing
- [ ] Unit tests added for new features
- [ ] Existing tests updated
- [ ] Accessibility tests pass
- [ ] Visual regression tests pass

### Design System
- [ ] Follows design tokens
- [ ] Consistent with existing components
- [ ] Responsive design implemented
- [ ] Dark mode support

## 🔄 Release Process

### Changesets

We use Changesets for version management:

1. **Add a changeset**:
   ```bash
   pnpm changeset add
   ```

2. **Select affected packages** and describe changes:
   ```
   @nexui/core: Add new NexuiComponent
   @nexui/vue: Add new NexuiComponent
   ```

3. **Choose version bump**:
   - `patch` for bug fixes
   - `minor` for new features
   - `major` for breaking changes

### Version and Publish

The CI/CD pipeline handles versioning and publishing automatically when changes are merged to main.

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment** - OS, browser, framework version
2. **Reproduction** - Steps to reproduce the issue
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Code example** - Minimal reproduction example

## 💡 Feature Requests

When requesting features:

1. **Use case** - Describe the problem you're trying to solve
2. **Proposed solution** - How you envision the feature working
3. **Alternatives** - Any alternative solutions considered
4. **Additional context** - Any other relevant information

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** - Treat everyone with respect and kindness
- **Be inclusive** - Welcome contributors of all backgrounds
- **Be constructive** - Provide helpful, constructive feedback
- **Be patient** - Help others learn and grow

### Communication

- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For general questions and ideas
- **PRs** - For code contributions and reviews

## 📚 Resources

### Documentation
- [Storybook](https://frontend-kavindi.github.io/nexui) - Interactive component docs
- [API Reference](https://frontend-kavindi.github.io/nexui) - Complete API documentation

### Tools
- [Vitest](https://vitest.dev/) - Testing framework
- [Storybook](https://storybook.js.org/) - Component documentation
- [Changesets](https://github.com/changesets/changesets) - Version management
- [ESLint](https://eslint.org/) - Linting
- [TypeScript](https://www.typescriptlang.org/) - Type checking

### Design System Resources
- [Design Tokens](https://design-tokens.github.io/) - Design token specification
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines
- [Component Library Best Practices](https://component-odyssey.com/) - Component design patterns

## 🙏 Getting Help

If you need help:

1. **Check documentation** - Review existing docs and examples
2. **Search issues** - Look for similar issues in the repository
3. **Create discussion** - Start a GitHub discussion for questions
4. **Join community** - Connect with other contributors

---

Thank you for contributing to NexUI! Your contributions help make the design system better for everyone. 🚀
