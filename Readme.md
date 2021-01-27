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
const mdRead = require('markdown-read')

mdRead('https://www.example.com').then(md => console.log(md))
```
