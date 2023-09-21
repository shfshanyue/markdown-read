import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['test/*'],
    globals: true,
    coverage: {
      reporter: ['text'] // https://vitest.dev/guide/coverage.html#coverage-setup
    }
  },
})