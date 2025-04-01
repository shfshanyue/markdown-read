# markdown-read Tests

This directory contains test files for the markdown-read library.

## Test Organization

The tests are organized by functionality:

- `markdown.spec.ts`: Tests for core markdown conversion functionality
- `tailwind.spec.ts`: Tests for converting blog content from Tailwind CSS's blog
- `cli.spec.ts`: Integration tests for the CLI functionality

## Running Tests

You can run all tests using:

```bash
npx vitest run
```

Or run specific test files:

```bash
npx vitest run tests/tailwind.spec.ts
npx vitest run tests/cli.spec.ts 
npx vitest run tests/markdown.spec.ts
```

For development with watch mode:

```bash
npx vitest
```

## Test Notes

- The CLI tests require the CLI to be built first
- Some tests may report CSS stylesheet parsing errors, which are warnings from JSDOM and can be ignored
- Some tests use snapshot testing to verify markdown output
- There may be some failing tests in `markdown.spec.ts` related to:
  - HTTP connectivity errors when fetching example URLs
  - Language detection specifics (e.g., 'js' vs 'javascript')
  - Turndown rule application with "Node is not defined" errors 