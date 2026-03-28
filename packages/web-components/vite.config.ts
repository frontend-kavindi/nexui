import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NexUIWebComponents',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['lit', '@nexui/utils', '@nexui/themes'],
    },
    sourcemap: true,
  },
});
