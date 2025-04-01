import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['tests/**/*.ts'],
    globals: true,
    coverage: {
      reporter: ['text'] // https://vitest.dev/guide/coverage.html#coverage-setup
    },
    testTimeout: 20000,
  },
})