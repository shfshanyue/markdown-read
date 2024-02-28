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

## Screenshots

## Usage

You will need Node.js installed on your system，then install it globally.

``` bash
$ npm i -g markdown-read

# Turn current page to markdown
$ markdown https://shanyue.tech | head -10
## [#](#山月的琐碎博客记录) 山月的琐碎博客记录

关于平常工作中在前端，后端以及运维中遇到问题的一些文章总结。以后也会做系列文章进行输出，如前端高级进阶系列，个人服务器指南系列。

+   **[阿里云新人优惠服务器 (opens new window)](https://www.aliyun.com/1111/pintuan-share?ptCode=MTY5MzQ0Mjc1MzQyODAwMHx8MTE0fDE%3D&userCode=4sm8juxu)**
+   **[跟着山月管理个人服务器 (opens new window)](https://shanyue.tech/op/)**

## 名字由来
```

## Chrome Extensions



## Support Plaforms

1. 掘金
1. 知乎
1. 博客园
1. 微信公众号平台
1. Segmentfault
1. Github
1. dev.to
1. CSDN
1. MDN

## API

``` js
const { markdown, turndown } = require('markdown-read')

// read markdown from url
await markdown('https://www.example.com')

await turndown('<h1>hello, world</h1>')
```
