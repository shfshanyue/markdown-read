# Markdown Read

![Npm Version](https://badgen.net/npm/v/markdown-read)
![Open Issues](https://badgen.net/github/open-issues/shfshanyue/markdown-read)
![Star](https://badgen.net/github/stars/shfshanyue/markdown-read)
![Npm Month Downloads](https://badgen.net/npm/dw/markdown-read)
![Type Support](https://badgen.net/npm/types/markdown-read)
![Node Version](https://badgen.net/npm/node/markdown-read)
![Code Size](https://img.shields.io/github/languages/code-size/shfshanyue/markdown-read)
![Install Size](https://badgen.net/packagephobia/install/markdown-read)
![Publish Size](https://badgen.net/packagephobia/publish/markdown-read)
![Minified Size](https://badgen.net/bundlephobia/min/markdown-read)
![Gzip Size](https://badgen.net/bundlephobia/minzip/markdown-read)
![Dependency Count](https://badgen.net/bundlephobia/dependency-count/markdown-read)
![Tree Shaking Support](https://badgen.net/bundlephobia/tree-shaking/markdown-read)

Get mardown from ANY url.

Demo Preview: [HTML To Markdown](https://devtool.tech/html-md)

## Tech Stack

+ `@mozilla/readability` for read meaning html
+ `turndown` for html to markdown

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

## Support Plaforms

markdown-read includes special handling for various platforms, including:

1. 掘金
1. 知乎
1. 博客园
1. 微信公众号平台
1. Segmentfault
1. Github
1. dev.to
1. CSDN
1. MDN


## API Reference

### `markdown(url: string, options?: ReadOptions): Promise<MarkdownContent | null>`

Converts a web page to Markdown format.

- `url`: The URL of the web page to convert
- `options`: Optional settings for document retrieval
  - `headers`: Additional headers to include in the request
  - `fetcher`: Custom function to fetch the HTML content

Returns a Promise that resolves to a `MarkdownContent` object or `null` if conversion fails.

### `turndown(html: string): string`

Converts HTML content to Markdown.

- `html`: The HTML string to convert

Returns the Markdown representation of the input HTML.

## Advanced Features

- Handles lazy-loaded images by setting their `src` attribute.
- Extracts byline information from meta tags.
- Supports platform-specific processing for various websites.
- Uses Mozilla's Readability for content extraction.
- Allows custom fetching logic through the `fetcher` option.
