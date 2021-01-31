# Markdown Read

Read Markdown from URL

## Usage

``` bash
$ npm i -g markdown-read

# Turn current page to markdown
$ markdown https://www.example.com
```

## API

``` js
const { readMd, readHtml, readMdFromText } = require('markdown-read')

// read markdown from url
readMd('https://www.example.com').then(md => console.log(md))

// read readbility content from url
readHtml('https://www.example.com').then(md => console.log(html))

// read markdown from html
const md = readMdFromText('<h1>hello, world</h1>')
```
