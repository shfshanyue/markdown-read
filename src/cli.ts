#!/usr/bin/env node

import { markdown } from '.'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

function parseArguments() {
  return yargs(hideBin(process.argv))
    .scriptName('markdown')
    .command('$0 <url>', 'Convert URL to markdown', yargs => {
      return yargs.positional('url', {
        describe: 'URL to convert to markdown',
        type: 'string',
        demandOption: true
      })
    })
    .options({
      debug: {
        type: 'boolean',
        default: false,
        describe: 'Enable debug mode'
      },
      header: {
        type: 'array',
        default: [],
        describe: 'Custom headers (format: key: value)'
      }
    })
    .check((argv): boolean => {
      if (typeof argv.url !== 'string' || !argv.url.startsWith('http')) {
        throw new Error('URL must be a string starting with http or https')
      }
      return true
    })
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'v')
    .parse()
}

function parseHeaders(headerArgs: string[]): Record<string, string> {
  return headerArgs.reduce((acc, header) => {
    const [key, ...value] = header.split(':')
    if (key && value.length > 0) {
      acc[key.trim()] = value.join(':').trim()
    }
    return acc
  }, {} as Record<string, string>)
}

async function convertUrlToMarkdown(url: string, headers: Record<string, string>) {
  try {
    const content = await markdown(url, { headers })
    if (content?.markdown) {
      console.log(content.markdown)
    } else {
      console.error('Failed to generate markdown content.')
    }
  } catch (error) {
    console.error('Error:', (error as Error).message)
    process.exit(1)
  }
}

async function main() {
  const argv = await parseArguments()
  const headers = parseHeaders(argv.header as string[])
  await convertUrlToMarkdown(argv.url as string, headers)
}

main().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
