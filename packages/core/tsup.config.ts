import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', '@nexui/utils', '@nexui/themes'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    return options;
  },
});
