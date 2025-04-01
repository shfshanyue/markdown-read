/**
 * Supported language identifiers for syntax highlighting in Markdown
 */
export const LANGUAGES = [
  'apache',
  'shell',
  'bash',
  'sh',
  'zsh',
  'text',
  'c',
  'cpp',
  'csharp',
  'java',
  'kotlin',
  'swift',
  'scala',
  'clojure',
  'cobol',
  'coffeescript',
  'crystal',
  'css',
  'scss',
  'less',
  'd',
  'dart',
  'diff',
  'django',
  'dockerfile',
  'docker',
  'elixir',
  'elm',
  'erlang',
  'fortran',
  'gherkin',
  'graphql',
  'go',
  'golang',
  'groovy',
  'handlebars',
  'haskell',
  'html',
  'htmlmixed',
  'xml',
  'svg',
  'javascript',
  'js',
  'jsx',
  'typescript',
  'ts',
  'tsx',
  'julia',
  'katex',
  'latex',
  'tex',
  'stex',
  'commonlisp',
  'lua',
  'markdown',
  'md',
  'mathematica',
  'matlab',
  'octave',
  'mysql',
  'pgsql',
  'sql',
  'ntriples',
  'nginx',
  'nim',
  'objective-c',
  'ocaml',
  'mllike',
  'pascal',
  'perl',
  'php',
  'powershell',
  'python',
  'py',
  'r',
  'riscv',
  'ruby',
  'rb',
  'rust',
  'rs',
  'sass',
  'solidity',
  'sparql',
  'stylus',
  'tcl',
  'toml',
  'turtle',
  'twig',
  'vb',
  'vbnet',
  'verilog',
  'vhdl',
  'vue',
  'xquery',
  'yaml',
  'yml',
  'json',
  'jsonp'
];

/**
 * Language aliases mapping alternative names to standardized identifiers
 */
export const LANGUAGE_ALIASES: Record<string, string> = {
  'javascript': 'js',
  'typescript': 'ts',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'shell': 'bash',
  'sh': 'bash',
  'zsh': 'bash',
  'py': 'python',
  'rb': 'ruby',
  'golang': 'go',
  'yml': 'yaml',
  'md': 'markdown',
  'html': 'html',
  'css': 'css',
  'sass': 'sass',
  'scss': 'scss',
  'less': 'less',
  'rs': 'rust'
};

/**
 * Common class name patterns that indicate code languages
 */
const CLASS_NAME_PATTERNS = [
  // language-xxx or lang-xxx format (common in many libraries)
  /(?:language|lang)-(\S+)/i,
  
  // highlight-xxx format
  /highlight-(\S+)/i,
  
  // syntax-xxx format
  /syntax-(\S+)/i,
  
  // brush: xxx format (used in some syntax highlighters)
  /brush:\s*(\S+)/i,
  
  // prettyprint lang-xxx format (used by Google Code Prettify)
  /prettyprint\s+lang-(\S+)/i,
  
  // code-xxx format
  /code-(\S+)/i,
  
  // modes like "mode-xxx" (used in some editors)
  /mode-(\S+)/i
];

/**
 * Detects programming language from a class name
 * 
 * @param className - The class name to analyze
 * @returns The detected language identifier or empty string if none found
 */
export function detectLanguage(className: string): string {
  if (!className || typeof className !== 'string') {
    return '';
  }
  
  // Normalize the class name: lowercase and trim
  const normalizedClassName = className.toLowerCase().trim();
  
  // Try to match known class name patterns
  for (const pattern of CLASS_NAME_PATTERNS) {
    const match = normalizedClassName.match(pattern);
    if (match && match[1]) {
      const detectedLang = match[1].toLowerCase();
      
      // Check if it's a known language or has an alias
      if (LANGUAGES.includes(detectedLang)) {
        return LANGUAGE_ALIASES[detectedLang] || detectedLang;
      }
    }
  }
  
  // Direct search for language name in class
  for (const lang of LANGUAGES) {
    // Match whole word only to avoid partial matches
    if (new RegExp(`\\b${lang}\\b`, 'i').test(normalizedClassName)) {
      return LANGUAGE_ALIASES[lang] || lang;
    }
  }
  
  // Check for special cases and common patterns
  if (/\bjs\b|\bjavascript\b/i.test(normalizedClassName)) {
    return 'javascript';
  }
  if (/\bts\b|\btypescript\b/i.test(normalizedClassName)) {
    return 'typescript';
  }
  if (/\bruby\b|\brails\b/i.test(normalizedClassName)) {
    return 'ruby';
  }
  if (/\bpy\b|\bpython\b/i.test(normalizedClassName)) {
    return 'python';
  }
  if (/\bshell\b|\bbash\b|\bconsole\b|\bterminal\b/i.test(normalizedClassName)) {
    return 'bash';
  }
  
  // No language detected
  return '';
}

/**
 * Usage frequency ranking for programming languages (higher values = more common)
 * Based on typical web content and popularity metrics
 */
export const LANGUAGE_USAGE_RANK: Record<string, number> = {
  'javascript': 100,
  'html': 95,
  'css': 90,
  'typescript': 85,
  'json': 80,
  'python': 75,
  'markdown': 70,
  'bash': 65,
  'java': 60,
  'php': 55,
  'ruby': 50,
  'sql': 45,
  'cpp': 40,
  'c': 38,
  'csharp': 35,
  'go': 30,
  'xml': 25,
  'rust': 20,
  'swift': 15,
  'kotlin': 10,
  // default for others
  'default': 5
};

/**
 * Detects programming language based on code content analysis
 * Prioritizes high-usage languages for more efficient detection
 * 
 * @param code - The code content to analyze
 * @returns Detected language identifier or empty string if undetected
 */
export function detectLanguageFromContent(code: string): string {
  if (!code || typeof code !== 'string') {
    return '';
  }
  
  // Sample a portion of the code to improve performance for large blocks
  const sampleSize = 2000;
  const codeSample = code.length > sampleSize ? 
    code.substring(0, sampleSize/2) + code.substring(code.length - sampleSize/2) :
    code;
  
  // ---- HIGH FREQUENCY LANGUAGES ----
  
  // JavaScript/TypeScript (very common on the web)
  if (/\bconst\b|\blet\b|\bvar\b|\bfunction\b|\bclass\b|\bimport\b|\bexport\b/i.test(codeSample)) {
    // Check for TypeScript-specific features
    if (/\w+\s*:\s*(string|number|boolean|any|unknown|interface|type)\b|\<[\w\s,]+\>/i.test(codeSample)) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  // HTML (extremely common)
  if (/<\/?[a-z][\s\S]*>/i.test(codeSample) && !/<\?xml/i.test(codeSample.substring(0, 100))) {
    return 'html';
  }
  
  // CSS (very common)
  if (/\s*[\.\#]?[\w-]+\s*\{[\s\S]*\}/i.test(codeSample) && 
      /\s*(margin|padding|font|color|background|display):/i.test(codeSample)) {
    return 'css';
  }
  
  // JSON (common data format)
  if ((/^\s*\{\s*"[^"]+"\s*:/i.test(codeSample) || /^\s*\[\s*\{\s*"[^"]+"\s*:/i.test(codeSample)) &&
      !/<\/?[a-z][\s\S]*>/i.test(codeSample)) {
    return 'json';
  }
  
  // Markdown (common documentation format)
  if (/^\s*#{1,6}\s+|\*\*[\w\s]+\*\*|^\s*[*-]\s+/m.test(codeSample) && 
      !/^<\/?[a-z][\s\S]*>/i.test(codeSample.substring(0, 100))) {
    return 'markdown';
  }
  
  // Python (highly popular)
  if (/\bdef\b|\bimport\b|\bclass\b|\bif __name__ == ['"]__main__['"]:/.test(codeSample)) {
    return 'python';
  }
  
  // Bash/Shell scripts (common for automation)
  if (/^\s*(#!\/bin\/bash|#!\/bin\/sh)|\$\{[\w]+\}|\becho\b|\bexport\b/m.test(codeSample)) {
    return 'bash';
  }
  
  // ---- MEDIUM FREQUENCY LANGUAGES ----
  
  // SQL (common for database code)
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b[\s\S]*\b(FROM|INTO|TABLE|DATABASE|WHERE)\b/i.test(codeSample)) {
    return 'sql';
  }
  
  // PHP (common server-side language)
  if (/\<\?php|\becho\s*["']|\bfunction\b.*\$\w+/i.test(codeSample)) {
    return 'php'; 
  }
  
  // Java (popular enterprise language)
  if (/\bpublic\s+class\b|\bprivate\s+\w+\(|\bprotected\b|\bpackage\b.*\bimport\b/i.test(codeSample)) {
    return 'java';
  }
  
  // Ruby (popular for web development)
  if (/\bdef\b.*\bend\b|\bclass\b.*\bend\b|\brequire\b|['"].*['"]=>|\bdo\b\s*\|\w+\|/i.test(codeSample)) {
    return 'ruby';
  }
  
  // XML/SVG (structured data format)
  if (/^\s*<\?xml/i.test(codeSample) || /^\s*<\w+:[\w-]+/.test(codeSample) || 
      /<svg\s[^>]*xmlns/i.test(codeSample)) {
    return 'xml';
  }
  
  // ---- LOWER FREQUENCY LANGUAGES ----
  
  // C/C++ (systems programming)
  if (/\b(#include|#define)\b.*(stdio\.h|iostream)|void\s+main\s*\(/i.test(codeSample)) {
    if (/\bstd::|<vector>|<string>|::/i.test(codeSample)) {
      return 'cpp';
    }
    return 'c';
  }
  
  // C# (Microsoft ecosystem)
  if (/\bnamespace\b.*\{\s*\busing\b|\bpublic\s+class\b.*\bstatic\s+void\s+Main\b/i.test(codeSample)) {
    return 'csharp';
  }
  
  // Go (emerging systems language)
  if (/\bpackage\s+\w+\s*\bimport\b|\bfunc\s+\w+\s*\(|\btype\s+\w+\s+struct\b/i.test(codeSample)) {
    return 'go';
  }
  
  // Rust (emerging systems language)
  if (/\bfn\s+\w+\b|\blet\s+mut\b|\bImpl\b|\bpub\s+struct\b/i.test(codeSample)) {
    return 'rust';
  }
  
  // Swift (Apple ecosystem)
  if (/\bimport\s+Foundation\b|\bvar\s+\w+\s*:\s*\w+\b|\bfunc\s+\w+\s*\([^)]*\)\s*->\s*\w+/i.test(codeSample)) {
    return 'swift';
  }
  
  // Kotlin (Android development)
  if (/\bfun\s+\w+\s*\(|\bval\b|\bvar\b|\bclass\s+\w+(\(|\s*\{)|\bpackage\s+[\w.]+/i.test(codeSample) &&
      /\b(Int|String|Boolean|List|Map)\b/i.test(codeSample)) {
    return 'kotlin';
  }
  
  // Default fallback
  return '';
}

/**
 * Get ranking score for a particular language
 * Used for sorting languages by usage frequency
 * 
 * @param language - The language identifier to get ranking for
 * @returns The ranking score (higher = more common)
 */
export function getLanguageRank(language: string): number {
  if (!language) return 0;
  const normalizedLang = language.toLowerCase();
  return LANGUAGE_USAGE_RANK[normalizedLang] || LANGUAGE_USAGE_RANK.default;
}

/**
 * Comprehensive language detection that combines class-based and content-based detection
 * 
 * @param className - The class name to analyze
 * @param content - Optional code content to analyze if class-based detection fails
 * @param element - Optional HTML element to check for data attributes
 * @returns The detected language identifier or empty string
 */
export function detectProgrammingLanguage(
  className: string, 
  content?: string,
  element?: HTMLElement
): string {
  // Check for direct dataset attributes if element is provided
  if (element) {
    // Common data attributes for language
    const dataLang = element.dataset?.language ?? 
                     element.dataset?.lang ?? 
                     element.getAttribute('data-language') ?? 
                     element.getAttribute('data-lang');
                     
    if (dataLang) {
      // Check if it's a known language or has an alias
      if (LANGUAGES.includes(dataLang.toLowerCase())) {
        return LANGUAGE_ALIASES[dataLang.toLowerCase()] || dataLang.toLowerCase();
      }
      return dataLang;
    }
  }
  
  // Try to detect from class name
  const classBasedLang = detectLanguage(className);
  if (classBasedLang) {
    return classBasedLang;
  }
  
  // If that fails and content is provided, analyze the content
  if (content) {
    return detectLanguageFromContent(content);
  }
  
  return '';
}
