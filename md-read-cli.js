#!/usr/bin/env node

const { readMd } = require('./dist')

const argv = require('yargs')
  .usage('$0 <url>', 'Turn page url to markdown', yargs => {
    yargs.positional('url', {
      describe: 'URL to markdown',
      type: 'string'
    })
  })
  .boolean('debug')
  .default('debug', false)
  .describe('debug', 'Debug mode')
  .array('header')
  .default('header', [])
  .describe('header', 'HTTP header')
  .check(argv => {
    if (!argv.url.startsWith('http')) {
      throw new Error('url must be URL!')
    }
    return true
  })
  .boolean('format-code')
  .describe('format-code', 'Use prettier to format block-code in markdown')
  .help('help')
  .argv



readMd(argv.url, {
  debug: argv.debug,
  headers: argv.header.reduce((acc, header)=> {
    const [k, v] = header.split('=')
    acc[k] = v
    return acc
  }, {}),
  formatCode: argv['format-code']
}).then(md => {
  process.stdout.write(md)
})
