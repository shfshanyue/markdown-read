import TurndownService from 'turndown'
import { detectProgrammingLanguage } from './language'
import { TurndownError } from './lib/errors';

/**
 * Import the tables plugin from turndown-plugin-gfm.
 * This plugin adds support for GitHub Flavored Markdown tables.
 */
const { tables } = require('turndown-plugin-gfm')

/**
 * Recursively extract text content from an HTML element, preserving line breaks.
 * 
 * @param node - The HTML element to extract text from
 * @returns The text content with line breaks preserved
 */
function getTextWithLineBreaks(node: HTMLElement): string {
  let text = '';
  
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      // Extract text content
      text += childNode.textContent ?? '';
    } else if (childNode.nodeName === 'BR') {
      // Convert <br> elements to newlines
      text += '\n';
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      // Recursively process element nodes
      text += getTextWithLineBreaks(childNode as HTMLElement);
    }
  }
  
  return text;
}

/**
 * Adds custom rules to a TurndownService instance.
 * These rules handle code blocks with proper language detection and formatting.
 * 
 * @param service - The TurndownService instance to add rules to
 */
function addCustomRules(service: TurndownService): void {
  // Rule for code blocks with <code> elements inside <pre>
  service.addRule('fencedCodeBlockWithCodeElement', {
    filter(node, options) {
      return Boolean(
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      );
    },

    replacement(content, node, options) {
      try {
        const element = node as HTMLElement;
        const className = [element.className, element.firstElementChild?.className].join(' ');
        
        // Get code content for potential content-based detection
        const code = element.textContent ?? '';
        
        // Use comprehensive language detection that checks attributes, class names and content
        const language = detectProgrammingLanguage(className, code, element);
        
        const fence = options.fence as string;

        return (
          '\n\n' + fence + language + '\n' +
          code.replace(/\n$/, '') +
          '\n' + fence + '\n\n'
        );
      } catch (error) {
        // If rule application fails, provide detailed error context
        throw TurndownError.ruleApplicationFailed(
          'fencedCodeBlockWithCodeElement',
          (node as HTMLElement).outerHTML,
          error instanceof Error ? error : undefined
        );
      }
    }
  });

  // Rule for nested pre > pre > code structure
  service.addRule('nestedPreCodeBlock', {
    filter(node, options) {
      return Boolean(
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'PRE' &&
        node.firstChild.firstChild &&
        node.firstChild.firstChild.nodeName === 'CODE'
      );
    },

    replacement(content, node, options) {
      try {
        const element = node as HTMLElement;
        const preElement = element.firstChild as HTMLElement;
        const codeElement = preElement.firstChild as HTMLElement;
        
        // Collect class names from all elements in the structure
        const classNames = [
          element.className,
          preElement.className,
          codeElement.className
        ].join(' ');
        
        // Extract code text with line breaks preserved
        const code = getTextWithLineBreaks(codeElement) || '';
        
        // Use comprehensive language detection
        const language = detectProgrammingLanguage(classNames, code, element);
        
        const fence = options.fence as string;

        return (
          '\n\n' + fence + language + '\n' +
          code.replace(/\n$/, '') +
          '\n' + fence + '\n\n'
        );
      } catch (error) {
        // If rule application fails, provide detailed error context
        throw TurndownError.ruleApplicationFailed(
          'nestedPreCodeBlock',
          (node as HTMLElement).outerHTML,
          error instanceof Error ? error : undefined
        );
      }
    }
  });

  // Rule for code blocks without <code> elements directly in <pre>
  service.addRule('fencedCodeBlockWithoutCodeElement', {
    filter(node, options) {
      return Boolean(
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild?.nodeName !== 'CODE'
      );
    },

    replacement(content, node, options) {
      try {
        const element = node as HTMLElement;
        const className = [
          element.className, 
          element.firstElementChild?.className, 
          element.parentElement?.className
        ].join(' ');
        
        // Extract code text with line breaks preserved
        const code = getTextWithLineBreaks(element) || '';
        
        // Use comprehensive language detection that checks attributes, class names and content
        const language = detectProgrammingLanguage(className, code, element);
        
        const fence = options.fence as string;

        return (
          '\n\n' + fence + language + '\n' +
          code.replace(/\n$/, '') +
          '\n' + fence + '\n\n'
        );
      } catch (error) {
        // If rule application fails, provide detailed error context
        throw TurndownError.ruleApplicationFailed(
          'fencedCodeBlockWithoutCodeElement',
          (node as HTMLElement).outerHTML,
          error instanceof Error ? error : undefined
        );
      }
    }
  });
}

/**
 * Options for the turndown markdown conversion.
 * Extends the native TurndownService options.
 */
export type TurndownOptions = TurndownService.Options;

/**
 * Converts HTML text to Markdown.
 * 
 * @param html - The HTML content to convert to Markdown
 * @param options - Optional configuration for the Turndown conversion
 * @returns The converted Markdown text
 * @throws {TurndownError} When conversion fails
 * 
 * @example
 * ```typescript
 * try {
 *   const markdown = turndown('<h1>Hello World</h1><p>This is a paragraph</p>');
 *   console.log(markdown);
 * } catch (error) {
 *   console.error('Conversion failed:', error.message);
 * }
 * ```
 */
export function turndown(html: string, options?: TurndownOptions): string {
  if (!html || typeof html !== 'string') {
    throw TurndownError.invalidInput(html);
  }
  
  try {
    // Create a new TurndownService with default and custom options
    const customTurndownService = new TurndownService({
      emDelimiter: '*',
      codeBlockStyle: 'fenced',
      fence: '```',
      headingStyle: 'atx',
      bulletListMarker: '+',
      ...options
    });

    // Apply the tables plugin and custom rules
    customTurndownService.use([tables]);
    addCustomRules(customTurndownService);
    
    // Convert HTML to Markdown
    const result = customTurndownService.turndown(html);
    
    return result;
  } catch (error) {
    // If the error is already a TurndownError, rethrow it
    if (error instanceof TurndownError) {
      throw error;
    }
    
    // Otherwise, wrap it in a TurndownError with context
    throw TurndownError.conversionFailed(
      html,
      options as Record<string, unknown>,
      error instanceof Error ? error : undefined
    );
  }
}
