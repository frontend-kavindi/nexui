import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NexUIVue',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@nexui/utils', '@nexui/themes'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
  },
});
