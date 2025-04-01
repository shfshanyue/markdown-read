import { describe, it, expect } from 'vitest'
import { markdown, MarkdownOptions } from '../src'

const TAILWIND_BLOG_URL = 'https://blog.shanyue.tech/posts/tailwindcss/'

describe('TailwindCSS Blog Conversion', () => {
  it('should convert Tailwind blog to markdown correctly', async () => {
    const result = await markdown(TAILWIND_BLOG_URL)
    
    // Check that the conversion worked and returned content
    expect(result).not.to.be.null
    expect(result?.markdown).to.be.a('string')
    expect(result?.markdown.length).to.be.greaterThan(1000)
    
    // Check that the length property reflects the actual length
    expect(result?.length).to.equal(result?.markdown.length)
    
    // Check key content elements are present in the markdown
    expect(result?.markdown).to.include('本文发布于 2021-01-29')
    expect(result?.markdown).to.include('TailwindCSS 因为一个 `class` 代表一个 CSS 属性这种原子化 CSS')
    
    // Check that the title was extracted correctly
    expect(result?.title).to.include('简述流行 CSS 框架 TailwindCSS 的优缺点')
  })
  
  it('should include code blocks from the Tailwind blog', async () => {
    const result = await markdown(TAILWIND_BLOG_URL)
    
    // Check that code blocks are preserved and formatted correctly
    expect(result?.markdown).to.include('```')
    expect(result?.markdown).to.match(/<div.*>Click<\/div>/);
  })
  
  it('should convert Tailwind blog with custom TurndownOptions', async () => {
    // Define custom options
    const options: MarkdownOptions = {
      bulletListMarker: '*',
      codeBlockStyle: 'indented'
    }
    
    const result = await markdown(TAILWIND_BLOG_URL, options)
    
    // Verify content was converted
    expect(result).not.to.be.null
    expect(result?.markdown).to.be.a('string')
    
    // Check for bullet list marker (should be * instead of default +)
    // This finds bullet lists in the markdown - need to use a regex for partial match
    // because the actual content might change
    const hasBulletLists = result?.markdown.match(/\*\s+\S+/);
    expect(hasBulletLists).not.to.be.null;
    
    // Verify code blocks use indented style (4 spaces) instead of fenced (```)
    // In indented style, code blocks don't have ```
    // Looking for patterns with 4 spaces starting a line
    const hasIndentedCode = result?.markdown.match(/    \S+/);
    expect(hasIndentedCode).not.to.be.null;
  })
  
  it('should handle errors for invalid URLs', async () => {
    const invalidUrl = 'https://blog.shanyue.tech/nonexistent-page/'
    
    try {
      await markdown(invalidUrl)
      // If we reach here, the test should fail
      expect.fail('Expected an error to be thrown for invalid URL')
    } catch (error) {
      // Check that we got an error as expected
      expect(error).to.be.an('Error')
      // The error should contain the invalid URL in its message
      expect((error as Error).message).to.include(invalidUrl)
    }
  })
})

// Create a snapshot test for the Tailwind blog - use more robust checking instead
describe('TailwindCSS Blog Snapshot', () => {
  it('should convert Tailwind blog with expected content structure', async () => {
    const result = await markdown(TAILWIND_BLOG_URL)
    
    // Check content structure instead of using snapshots
    expect(result?.markdown).to.include('本文发布于 2021-01-29')
    
    // Check for section headers
    expect(result?.markdown).to.include('## 谈一谈对 TailwindCSS 的看法')
    
    // Look for code blocks
    const codeExamples = result?.markdown.match(/```[\s\S]*?```/g) || []
    expect(codeExamples.length).to.be.greaterThan(0)
    
    // Find lists
    const lists = result?.markdown.match(/\+\s+.*$/gm) || []
    expect(lists.length).to.be.greaterThan(0)
    
    // Check for links
    expect(result?.markdown).to.include('](')
    
    // Check for images
    expect(result?.markdown).to.include('![')
  })
}) 