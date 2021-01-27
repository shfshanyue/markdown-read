const mdRead = require('./md-read')

const argv = require('yargs')
  .string('url')
  .describe('url', 'Page URL to markdown')
  .help('help')
  .argv

mdRead(argv.url).then(md => {
  process.stdout.write(md)
})