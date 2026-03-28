# @nexui/themes

Theme tokens and CSS custom properties for the NexUI design system.

## Installation

```bash
npm install @nexui/themes
# or
pnpm add @nexui/themes
# or
yarn add @nexui/themes
```

## Usage

### CSS Import

```css
/* Import all theme tokens */
@import '@nexui/themes/dist/index.css';

/* Or import specific themes */
@import '@nexui/themes/dist/light.css';
@import '@nexui/themes/dist/dark.css';
```

### JavaScript Import

```javascript
// Import theme CSS
import '@nexui/themes/dist/index.css';

// Import theme tokens for programmatic use
import { lightTheme, darkTheme } from '@nexui/themes';

console.log(lightTheme.colors.primary); // '#667eea'
```

## Available Themes

### Light Theme (Default)
```css
[data-theme="light"] {
  --nexui-color-primary: #667eea;
  --nexui-color-secondary: #764ba2;
  --nexui-color-success: #48bb78;
  --nexui-color-error: #f56565;
  --nexui-color-warning: #ed8936;
  --nexui-color-neutral: #718096;
  --nexui-color-background: #ffffff;
  --nexui-color-surface: #f8f9fa;
  --nexui-color-text: #2d3748;
  --nexui-color-text-secondary: #718096;
}
```

### Dark Theme
```css
[data-theme="dark"] {
  --nexui-color-primary: #667eea;
  --nexui-color-secondary: #764ba2;
  --nexui-color-success: #48bb78;
  --nexui-color-error: #f56565;
  --nexui-color-warning: #ed8936;
  --nexui-color-neutral: #a0aec0;
  --nexui-color-background: #1a202c;
  --nexui-color-surface: #2d3748;
  --nexui-color-text: #f7fafc;
  --nexui-color-text-secondary: #a0aec0;
}
```

## Theme Switching

### HTML Attribute
```html
<html data-theme="dark">
  <!-- Your app content -->
</html>
```

### JavaScript
```javascript
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Toggle themes
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}
```

### React Hook
```jsx
import { useState, useEffect } from 'react';

function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}
```

### Vue Composable
```vue
<script setup>
import { ref, watchEffect } from 'vue';

const theme = ref('light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
});

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <button @click="toggleTheme">
    Switch to {{ theme === 'light' ? 'dark' : 'light' }} theme
  </button>
</template>
```

## Token Categories

### Colors
- Primary, secondary, success, error, warning
- Neutral colors (text, background, surface)
- Semantic colors

### Spacing
- Scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Semantic spacing: xs, sm, md, lg, xl, 2xl, 3xl

### Typography
- Font families: Inter, system fonts
- Font sizes: 12px, 14px, 16px, 20px, 24px, 32px
- Font weights: 400, 500, 600, 700
- Line heights: 1.2, 1.3, 1.4, 1.5

### Shadows
- Subtle, medium, strong shadows
- Colored shadows for depth

### Border Radius
- Scale: 0px, 2px, 4px, 6px, 8px, 12px

## Custom Themes

Create your own theme by extending the base tokens:

```css
/* custom-theme.css */
[data-theme="custom"] {
  --nexui-color-primary: #ff6b6b;
  --nexui-color-secondary: #4ecdc4;
  --nexui-color-background: #f8f9fa;
  /* Override other tokens as needed */
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build themes
pnpm build

# Watch for changes
pnpm dev
```

## License

MIT
