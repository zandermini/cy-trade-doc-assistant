import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    api: 'src/api/index.ts',
    web: 'src/web/main.tsx',
  },
  outDir: 'dist',
  targets: ['chrome-mv3-prod'],
  apiTargets: ['node18'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
