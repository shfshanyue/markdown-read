#!/usr/bin/env node

const mdRead = require('./md-read')

const argv = require('yargs')
  .usage('$0 <url>', 'Turn page url to markdown', yargs => {
    yargs.positional('url', {
      describe: 'URL to markdown',
      type: 'string'
    })
  })
  .check(argv => {
    if (!argv.url.startsWith('http')) {
      throw new Error('url must be URL!')
    }
    return true
  })
  .help('help')
  .argv

mdRead(argv.url).then(md => {
  process.stdout.write(md)
})
