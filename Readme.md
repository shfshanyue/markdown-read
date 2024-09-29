# Markdown Read

[![npm version](https://img.shields.io/npm/v/markdown-read.svg)](https://www.npmjs.com/package/markdown-read)
[![GitHub issues](https://img.shields.io/github/issues/shfshanyue/markdown-read.svg)](https://github.com/shfshanyue/markdown-read/issues)
[![GitHub stars](https://img.shields.io/github/stars/shfshanyue/markdown-read.svg)](https://github.com/shfshanyue/markdown-read/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/markdown-read.svg)](https://www.npmjs.com/package/markdown-read)
[![TypeScript](https://img.shields.io/npm/types/markdown-read.svg)](https://www.npmjs.com/package/markdown-read)
[![node version](https://img.shields.io/node/v/markdown-read.svg)](https://www.npmjs.com/package/markdown-read)
[![code size](https://img.shields.io/github/languages/code-size/shfshanyue/markdown-read.svg)](https://github.com/shfshanyue/markdown-read)
[![install size](https://packagephobia.now.sh/badge?p=markdown-read)](https://packagephobia.now.sh/result?p=markdown-read)
[![npm bundle size](https://img.shields.io/bundlephobia/min/markdown-read.svg)](https://bundlephobia.com/result?p=markdown-read)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/markdown-read.svg)](https://bundlephobia.com/result?p=markdown-read)
[![dependencies](https://img.shields.io/badge/dependencies-2-brightgreen.svg)](https://github.com/shfshanyue/markdown-read/blob/master/package.json)
[![tree shaking](https://badgen.net/bundlephobia/tree-shaking/markdown-read)](https://bundlephobia.com/result?p=markdown-read)

Convert any URL to Markdown.

[Try it online: HTML To Markdown](https://devtool.tech/html-md)

## Tech Stack

+ `@mozilla/readability` for read meaning html
+ `turndown` for html to markdown
+ `jsdom` for parse html

## Usage

You will need Node.js installed on your system, then install it globally.

``` bash
$ npm i -g markdown-read

# Turn current page to markdown
$ markdown https://example.com
## Example Domain

This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.

[More information...](https://www.iana.org/domains/example)
```

### Options

- `--header`: Add custom headers to the request. This can be useful for setting user-agent strings or other HTTP headers required by the target website.

Example:

``` bash
$ markdown https://httpbin.org/get --header 'User-Agent: Markdown Reader'
```

## API Reference

### `markdown(url: string, options?: MarkdownOptions): Promise<MarkdownContent | null>`

Converts a web page to Markdown format.

- `url`: The URL of the web page to convert
- `options`: Optional settings for document retrieval and Markdown conversion
  - `headers`: Additional headers to include in the request
  - `fetcher`: Custom function to fetch the HTML content
  - All options from `TurndownOptions` are also supported

Returns a Promise that resolves to a `MarkdownContent` object or `null` if conversion fails.

#### MarkdownContent

The `MarkdownContent` object extends `ReadabilityContent` and includes:

- `markdown`: The converted Markdown content
- `length`: The length of the Markdown content
- `url`: The original URL of the web page

### `turndown(html: string, options?: TurndownOptions): string`

Converts HTML content to Markdown.

- `html`: The HTML string to convert
- `options`: Optional settings for Turndown conversion. These options will override the default settings.

Returns the Markdown representation of the input HTML.

#### Default Options

```javascript
{
  emDelimiter: '*',
  codeBlockStyle: 'fenced',
  fence: '```',
  headingStyle: 'atx',
  bulletListMarker: '+'
}
```

#### Example

```javascript
import { turndown } from 'markdown-read';

const html = '<h1>Hello</h1><em>World</em>';
const options = {
  headingStyle: 'setext',
  emDelimiter: '_'
};

const markdown = turndown(html, options);
console.log(markdown);
// Output:
// Hello
// =====
//
// _World_
```

For a full list of available options, please refer to the [Turndown Options documentation](https://github.com/mixmark-io/turndown#options).

## Advanced Features

- Handles lazy-loaded images by setting their `src` attribute.
- Extracts byline information from meta tags.
- Supports platform-specific processing for various websites.
- Uses Mozilla's Readability for content extraction.
- Allows custom fetching logic through the `fetcher` option.
