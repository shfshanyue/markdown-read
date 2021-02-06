# Markdown Read

Read Markdown from URL

## Usage

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

## Suport Platform

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
const { readMd, readHtml, readMdFromText } = require('markdown-read')

// read markdown from url
await readMd('https://www.example.com')

// read readbility content from url
await readHtml('https://www.example.com')

// read markdown from html
const md = readMdFromText('<h1>hello, world</h1>')
```
