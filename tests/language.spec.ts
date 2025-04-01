import { describe, it, expect } from 'vitest'
import { 
  LANGUAGES, 
  LANGUAGE_ALIASES, 
  detectLanguage, 
  detectLanguageFromContent, 
  getLanguageRank,
  detectProgrammingLanguage 
} from '../src/lib/language'

describe('Language detection module', () => {
  describe('detectLanguage', () => {
    it('should detect language from class names', () => {
      expect(detectLanguage('language-javascript')).toBe('js')
      expect(detectLanguage('lang-python')).toBe('python')
      expect(detectLanguage('highlight-css')).toBe('css')
      expect(detectLanguage('syntax-ruby')).toBe('ruby')
      expect(detectLanguage('code-rust')).toBe('rust')
    })

    it('should handle language aliases', () => {
      expect(detectLanguage('language-js')).toBe('js')
      expect(detectLanguage('lang-py')).toBe('python')
      expect(detectLanguage('highlight-yml')).toBe('yaml')
    })

    it('should return empty string for unknown languages', () => {
      expect(detectLanguage('unknown-language')).toBe('')
      expect(detectLanguage('')).toBe('')
      expect(detectLanguage(null as any)).toBe('')
    })
  })

  describe('detectLanguageFromContent', () => {
    it('should detect JavaScript', () => {
      const code = `
        const add = (a, b) => a + b;
        let result = add(5, 10);
        console.log(result);
      `
      expect(detectLanguageFromContent(code)).toBe('javascript')
    })

    it('should detect TypeScript', () => {
      const code = `
        interface User {
          id: number;
          name: string;
        }
        const getUser = (id: number): User => {
          return { id, name: 'John' };
        };
      `
      expect(detectLanguageFromContent(code)).toBe('typescript')
    })

    it('should detect HTML', () => {
      const code = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Page</title>
          </head>
          <body>
            <h1>Hello World</h1>
          </body>
        </html>
      `
      expect(detectLanguageFromContent(code)).toBe('html')
    })

    it('should detect Python', () => {
      const code = `
        def fibonacci(n):
            a, b = 0, 1
            for i in range(n):
                a, b = b, a + b
            return a
            
        if __name__ == "__main__":
            print(fibonacci(10))
      `
      expect(detectLanguageFromContent(code)).toBe('python')
    })

    it('should return empty string for unrecognized content', () => {
      expect(detectLanguageFromContent('Lorem ipsum dolor sit amet')).toBe('')
      expect(detectLanguageFromContent('')).toBe('')
      expect(detectLanguageFromContent(null as any)).toBe('')
    })
  })

  describe('getLanguageRank', () => {
    it('should return correct rank for known languages', () => {
      expect(getLanguageRank('javascript')).toBe(100)
      expect(getLanguageRank('html')).toBe(95)
      expect(getLanguageRank('python')).toBe(75)
    })

    it('should return default rank for unknown languages', () => {
      expect(getLanguageRank('cobol')).toBe(5)
      expect(getLanguageRank('unknown')).toBe(5)
    })

    it('should return 0 for empty input', () => {
      expect(getLanguageRank('')).toBe(0)
    })
  })

  describe('detectProgrammingLanguage', () => {
    it('should prioritize class-based detection', () => {
      const className = 'language-javascript'
      const content = 'def python_function(): pass'
      
      expect(detectProgrammingLanguage(className, content)).toBe('js')
    })

    it('should fall back to content-based detection', () => {
      const className = 'code-block'
      const content = 'const x = 42; console.log(x);'
      
      expect(detectProgrammingLanguage(className, content)).toBe('javascript')
    })

    it('should get language from data attributes when element is provided', () => {
      const mockElement = {
        dataset: { language: 'python' },
        getAttribute: (attr: string) => null
      } as unknown as HTMLElement
      
      expect(detectProgrammingLanguage('', '', mockElement)).toBe('python')
    })

    it('should return empty string when no language is detected', () => {
      expect(detectProgrammingLanguage('', '')).toBe('')
    })
  })
}) 