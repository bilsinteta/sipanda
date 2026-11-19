// Polyfill Map.groupBy for Node < 21
if (typeof Map.groupBy !== 'function') {
  Map.groupBy = function (items: Iterable<any>, keySelector: (item: any, index: number) => any) {
    const map = new Map();
    let index = 0;
    for (const item of items) {
      const key = keySelector(item, index++);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    }
    return map;
  };
}

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

