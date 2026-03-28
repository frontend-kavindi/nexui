# @nexui/core

React component library for the NexUI design system.

## Installation

```bash
npm install @nexui/core
# or
pnpm add @nexui/core
# or
yarn add @nexui/core
```

## Usage

```jsx
import { NexuiButton, NexuiThemeProvider } from '@nexui/core';

function App() {
  return (
    <NexuiThemeProvider>
      <NexuiButton variant="primary" onClick={() => console.log('clicked')}>
        Click me
      </NexuiButton>
    </NexuiThemeProvider>
  );
}
```

## Components

### Buttons
- `NexuiButton` - Customizable button component with variants and sizes

### Forms
- `NexuiInput` - Text input with validation states
- `NexuiCheckbox` - Checkbox component
- `NexuiRadio` - Radio button group
- `NexuiSelect` - Dropdown select component

### Layout
- `NexuiCard` - Card container component
- `NexuiAccordion` - Collapsible accordion
- `NexuiTabs` - Tab navigation component

### Navigation
- `NexuiBreadcrumb` - Breadcrumb navigation
- `NexuiPagination` - Pagination component

### Data Display
- `NexuiTable` - Data table with sorting
- `NexuiDataGrid` - Advanced data grid
- `NexuiAvatar` - User avatar component
- `NexuiBadge` - Status badge component

### Feedback
- `NexuiModal` - Modal dialog
- `NexuiToast` - Toast notifications
- `NexuiSpinner` - Loading spinner
- `NexuiProgressBar` - Progress indicator

### Typography
- `NexuiThemeProvider` - Theme context provider

## Theming

The library uses CSS custom properties for theming. You can customize the theme by overriding the CSS variables:

```css
:root {
  --nexui-color-primary: #667eea;
  --nexui-color-secondary: #764ba2;
  --nexui-spacing-sm: 8px;
  --nexui-spacing-md: 16px;
  --nexui-font-family: 'Inter', sans-serif;
}
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

## Peer Dependencies

- React 19.0.0+
- React DOM 19.0.0+

## License

MIT
