import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

describe('CLI Integration Tests', () => {
  const outputFile = path.join(__dirname, 'tailwind-output.md')
  const cliPath = path.join(__dirname, '../dist/cli.js')
  
  // Clean up any output files after tests
  afterEach(() => {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
  })
  
  it('should convert URL to markdown using CLI command', () => {
    // This test will actually run the CLI command that was built
    try {
      // Note: This requires the CLI to be built first
      const output = execSync(
        `node ${cliPath} https://blog.shanyue.tech/posts/tailwindcss/ --header "User-Agent: Test-Agent" > ${outputFile}`,
        { encoding: 'utf8' }
      )
      
      // Check that the output file was created
      expect(fs.existsSync(outputFile)).to.be.true
      
      // Read the contents
      const fileContent = fs.readFileSync(outputFile, 'utf8')
      
      // Check that key content was converted correctly
      expect(fileContent).to.include('本文发布于 2021-01-29')
      expect(fileContent.length).to.be.greaterThan(1000)
    } catch (error) {
      console.error(`CLI execution failed: ${error}`)
      throw error
    }
  })
  
  it('should handle CLI errors gracefully', () => {
    // Test with invalid URL
    try {
      execSync(`node ${cliPath} https://nonexistent-website-that-should-fail/`, { encoding: 'utf8' })
      expect.fail('CLI should have thrown an error for invalid URL')
    } catch (error) {
      // We expect an error to be thrown, but we don't need to check its exact type
      // instead just verify it has a stderr property containing error information
      expect(error).to.be.an('Error')
      const errorOutput = (error as any).stderr || ''
      expect(errorOutput).to.include('Error')
    }
  })
}) 