# @nexui/web-components

Lit Web Components for the NexUI design system.

## Installation

```bash
npm install @nexui/web-components
# or
pnpm add @nexui/web-components
# or
yarn add @nexui/web-components
```

## Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexUI Web Components</title>
  <script type="module" src="node_modules/@nexui/web-components/dist/index.js"></script>
</head>
<body>
  <nex-button variant="primary" onclick="handleClick()">
    Click me
  </nex-button>
  
  <script>
    function handleClick() {
      console.log('clicked');
    }
  </script>
</body>
</html>
```

## Components

### Buttons
- `nex-button` - Customizable button component with variants and sizes

### Forms
- `nex-input` - Text input with validation states
- `nex-checkbox` - Checkbox component
- `nex-radio` - Radio button group
- `nex-select` - Dropdown select component

### Layout
- `nex-card` - Card container component
- `nex-accordion` - Collapsible accordion
- `nex-tabs` - Tab navigation component

### Navigation
- `nex-breadcrumb` - Breadcrumb navigation
- `nex-pagination` - Pagination component

### Data Display
- `nex-table` - Data table with sorting
- `nex-avatar` - User avatar component
- `nex-badge` - Status badge component

### Feedback
- `nex-modal` - Modal dialog
- `nex-spinner` - Loading spinner
- `nex-progress-bar` - Progress indicator

## Custom Events

Components emit custom events for user interactions:

```html
<nex-button id="myButton">Click me</nex-button>

<script>
  const button = document.getElementById('myButton');
  
  button.addEventListener('nex-click', (event) => {
    console.log('Button clicked!', event.detail);
  });
</script>
```

## Theming

The components use CSS custom properties for theming. You can customize the theme by overriding the CSS variables:

```css
:root {
  --nexui-color-primary: #667eea;
  --nexui-color-secondary: #764ba2;
  --nexui-spacing-sm: 8px;
  --nexui-spacing-md: 16px;
  --nexui-font-family: 'Inter', sans-serif;
}
```

## Framework Integration

### React

```jsx
import React from 'react';
import { defineCustomElements } from '@nexui/web-components';

defineCustomElements();

function App() {
  return <nex-button variant="primary">Click me</nex-button>;
}
```

### Vue

```vue
<template>
  <nex-button variant="primary" @nex-click="handleClick">
    Click me
  </nex-button>
</template>

<script setup>
import { defineCustomElements } from '@nexui/web-components';

defineCustomElements();

const handleClick = () => {
  console.log('clicked');
};
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { defineCustomElements } from '@nexui/web-components';

defineCustomElements();

@Component({
  selector: 'app-root',
  template: '<nex-button variant="primary">Click me</nex-button>'
})
export class AppComponent {}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build
```

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT
