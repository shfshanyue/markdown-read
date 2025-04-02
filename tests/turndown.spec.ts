import { turndown, TurndownOptions } from '../src'
import { describe, it, expect } from 'vitest'

describe('turndown', () => {
  describe('fencedCodeBlockWithoutCodeElement', () => {
    it('should convert pre tag without code tag to markdown code block', async () => {
      const html = '<pre>console.log("Hello, world!");</pre>'
      const result = turndown(html)
      expect(result).to.eq('```\nconsole.log("Hello, world!");\n```')
    })

    it('should detect language from pre tag class', async () => {
      const html = '<pre class="language-javascript">const greeting = "Hello, world!";</pre>'
      const result = turndown(html)
      expect(result).to.eq('```js\nconst greeting = "Hello, world!";\n```')
    })

    it('should detect language from pre tag data attribute', async () => {
      const html = '<pre data-lang="python">print("Hello, world!")</pre>'
      const result = turndown(html)
      expect(result).to.eq('```python\nprint("Hello, world!")\n```')
    })

    it('should detect language from parent element class', async () => {
      const html = '<div class="highlight-ruby"><pre>puts "Hello, world!"</pre></div>'
      const result = turndown(html)
      expect(result).to.eq('```ruby\nputs "Hello, world!"\n```')
    })

    it('should handle pre tag with nested elements', async () => {
      const html = '<pre><span class="keyword">const</span> x = 5;</pre>'
      const result = turndown(html)
      expect(result).to.eq('```javascript\nconst x = 5;\n```')
    })

    it('should preserve line breaks in pre tag content', async () => {
      const html = '<pre>line1\nline2\nline3</pre>'
      const result = turndown(html)
      expect(result).to.eq('```\nline1\nline2\nline3\n```')
    })

    it('should handle pre tag with br elements', async () => {
      const html = '<pre>line1<br>line2<br />line3</pre>'
      const result = turndown(html)
      expect(result).to.eq('```\nline1\nline2\nline3\n```')
    })

    it('should handle complex pre tag with nested elements and classes', async () => {
      const html = `<div class="highlight highlight-source-js notranslate position-relative overflow-auto" dir="auto"><pre><span class="pl-k">import</span> <span class="pl-kos">{</span> <span class="pl-s1">sum</span> <span class="pl-kos">}</span> <span class="pl-k">from</span> <span class="pl-s">'midash'</span>

<span class="pl-en">sum</span><span class="pl-kos">(</span><span class="pl-kos">[</span><span class="pl-c1">1</span><span class="pl-kos">,</span> <span class="pl-c1">3</span><span class="pl-kos">,</span> <span class="pl-c1">5</span><span class="pl-kos">,</span> <span class="pl-c1">7</span><span class="pl-kos">,</span> <span class="pl-c1">9</span><span class="pl-kos">]</span><span class="pl-kos">)</span></pre></div>`
      const result = turndown(html)
      expect(result).to.eq("```js\nimport { sum } from 'midash'\n\nsum([1, 3, 5, 7, 9])\n```")
    })

    it('should handle nested pre tags', async () => {
      const html = `<body><pre><pre style="color: black; background: transparent; text-shadow: white 0px 1px; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; font-size: 1em; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none; padding: 0px; margin: 0px; overflow: auto;"><code class="language-jsx" style="white-space: pre; color: black; background: none; text-shadow: white 0px 1px; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; font-size: 1em; text-align: left; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none;"><span><span class="token" style="color: slategray;">// React Component Example</span><span>
</span></span><span><span></span><span class="token" style="color: rgb(0, 119, 170);">function</span><span> </span><span class="token maybe-class-name" style="color: rgb(221, 74, 104);">Counter</span><span class="token" style="color: rgb(153, 153, 153);">(</span><span class="token" style="color: rgb(153, 153, 153);">)</span><span> </span><span class="token" style="color: rgb(153, 153, 153);">{</span><span>
</span></span><span><span>  </span><span class="token" style="color: rgb(0, 119, 170);">const</span><span> </span><span class="token" style="color: rgb(153, 153, 153);">[</span><span>count</span><span class="token" style="color: rgb(153, 153, 153);">,</span><span> setCount</span><span class="token" style="color: rgb(153, 153, 153);">]</span><span> </span><span class="token" style="color: rgb(154, 110, 58); background: rgba(255, 255, 255, 0.5);">=</span><span> </span><span class="token" style="color: rgb(221, 74, 104);">useState</span><span class="token" style="color: rgb(153, 153, 153);">(</span><span class="token" style="color: rgb(153, 0, 85);">0</span><span class="token" style="color: rgb(153, 153, 153);">)</span><span class="token" style="color: rgb(153, 153, 153);">;</span><span>
</span></span><span>  
</span><span><span>  </span><span class="token control-flow" style="color: rgb(0, 119, 170);">return</span><span> </span><span class="token" style="color: rgb(153, 153, 153);">(</span><span>
</span></span><span><span>    </span><span class="token" style="color: rgb(153, 153, 153);">&lt;</span><span class="token" style="color: rgb(153, 0, 85);">div</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span class="token plain-text">
</span></span><span><span class="token plain-text">      </span><span class="token" style="color: rgb(153, 153, 153);">&lt;</span><span class="token" style="color: rgb(153, 0, 85);">p</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span class="token plain-text">Count: </span><span class="token" style="color: rgb(153, 153, 153);">{</span><span>count</span><span class="token" style="color: rgb(153, 153, 153);">}</span><span class="token" style="color: rgb(153, 153, 153);">&lt;/</span><span class="token" style="color: rgb(153, 0, 85);">p</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span class="token plain-text">
</span></span><span><span class="token plain-text">      </span><span class="token" style="color: rgb(153, 153, 153);">&lt;</span><span class="token" style="color: rgb(153, 0, 85);">button</span><span class="token" style="color: rgb(153, 0, 85);"> </span><span class="token" style="color: rgb(102, 153, 0);">onClick</span><span class="token script language-javascript script-punctuation" style="color: rgb(153, 0, 85);">=</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">{</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">(</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">)</span><span class="token script language-javascript" style="color: rgb(153, 0, 85);"> </span><span class="token script language-javascript arrow" style="color: rgb(153, 0, 85);">=&gt;</span><span class="token script language-javascript" style="color: rgb(153, 0, 85);"> </span><span class="token script language-javascript" style="color: rgb(221, 74, 104);">setCount</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">(</span><span class="token script language-javascript" style="color: rgb(153, 0, 85);">count </span><span class="token script language-javascript" style="color: rgb(154, 110, 58); background: rgba(255, 255, 255, 0.5);">+</span><span class="token script language-javascript" style="color: rgb(153, 0, 85);"> </span><span class="token script language-javascript" style="color: rgb(153, 0, 85);">1</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">)</span><span class="token script language-javascript" style="color: rgb(153, 153, 153);">}</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span class="token plain-text">
</span></span><span class="token plain-text">        Increment
</span><span><span class="token plain-text">      </span><span class="token" style="color: rgb(153, 153, 153);">&lt;/</span><span class="token" style="color: rgb(153, 0, 85);">button</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span class="token plain-text">
</span></span><span><span class="token plain-text">    </span><span class="token" style="color: rgb(153, 153, 153);">&lt;/</span><span class="token" style="color: rgb(153, 0, 85);">div</span><span class="token" style="color: rgb(153, 153, 153);">&gt;</span><span>
</span></span><span><span>  </span><span class="token" style="color: rgb(153, 153, 153);">)</span><span class="token" style="color: rgb(153, 153, 153);">;</span><span>
</span></span><span><span></span><span class="token" style="color: rgb(153, 153, 153);">}</span></span></code></pre></pre></body>`
      const result = turndown(html)
      expect(result).to.eq(`\`\`\`jsx
// React Component Example
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\``)
    })
  })

  describe('options', () => {
    it('should use custom options when provided', () => {
      const html = '<h1>Hello</h1><em>World</em>'
      const options: TurndownOptions = {
        headingStyle: 'setext',
        emDelimiter: '_'
      }
      const result = turndown(html, options)
      expect(result).to.eq('Hello\n=====\n\n_World_')
    })

    it('should override default options', () => {
      const html = '<h2>Test</h2><ul><li>Item 1</li><li>Item 2</li></ul>'
      const options: TurndownOptions = {
        headingStyle: 'setext',
        bulletListMarker: '*'
      }
      const result = turndown(html, options)
      expect(result).to.eq('Test\n----\n\n*   Item 1\n*   Item 2')
    })

    it('should use default options when not provided', () => {
      const html = '<h2>Default</h2><ul><li>Item 1</li><li>Item 2</li></ul>'
      const result = turndown(html)
      expect(result).to.eq('## Default\n\n+   Item 1\n+   Item 2')
    })
  })
}) 