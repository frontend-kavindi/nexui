import type { Preview } from '@storybook/react';
import '@nexui/themes/css';
import { NexuiThemeProvider } from '@nexui/core';

const preview: Preview = {
  decorators: [
    (Story) => (
      <NexuiThemeProvider theme="light">
        <Story />
      </NexuiThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default preview;
