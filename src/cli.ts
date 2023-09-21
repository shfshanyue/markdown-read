#!/usr/bin/env node

import { markdown } from '.'
import yargs from 'yargs'

const argv = yargs
  .scriptName('markdown')
  .command('$0 <url>', 'Turn URL to markdown', yargs => {
    return yargs.positional('url', {
      describe: 'URL to markdown',
      type: 'string'
    })
  })
  .options({
    debug: {
      type: 'boolean',
      default: false
    },
    header: {
      type: 'array',
      default: [],
    }
  })
  .demandOption(['url'])
  // .check(argv => {
  //   if (!argv.url.startsWith('http')) {
  //     console.log(argv.url)
  //     throw new Error('URL must start with http')
  //   }
  // })
  .help('help')
  .parseSync()

markdown(argv.url as string, {
  headers: (argv.header as string[]).reduce((acc, header)=> {
    const [k, v] = header.split('=')
    acc[k] = v
    return acc
  }, {} as Record<string, string>)
}).then(content => {
  process.stdout.write(content?.markdown || '')
})
