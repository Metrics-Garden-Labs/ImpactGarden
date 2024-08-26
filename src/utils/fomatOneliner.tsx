import React from 'react';
import Link from 'next/link';

/**
 * Formats the oneliner by converting URLs into clickable links, preserving line breaks, and applying basic Markdown-like formatting.
 * @param oneliner - The oneliner text to format.
 * @returns A React node with formatted content.
 */
export function formatOneliner(oneliner: string): React.ReactNode {
  // Regular expression to detect URLs, including those potentially enclosed in parentheses
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;

  // Function to apply Markdown-like formatting
  const applyFormatting = (text: string): React.ReactNode => {
    // Header: **text** at the start of a line
    const headerRegex = /^(\*\*(.+?)\*\*)/;
    const headerMatch = text.match(headerRegex);
    if (headerMatch) {
      return (
        <React.Fragment>
          <h3 className="text-xl font-bold mt-4 mb-2">{headerMatch[2]}</h3>
          {applyFormatting(text.slice(headerMatch[0].length))}
        </React.Fragment>
      );
    }

    // Bold: **text** or __text__ (not at the start of a line)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Italic: *text* or _text_
    text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    // Inline Code: `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert the HTML string to React elements
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  // Function to clean up URLs
  const cleanUrl = (url: string): string => {
    // Remove trailing punctuation that's not part of the URL
    let cleanedUrl = url;
    const trailingPunctuationRegex = /[),.:;!?]+$/;
    const match = cleanedUrl.match(trailingPunctuationRegex);
    if (match) {
      const punctuation = match[0];
      // Only remove the punctuation if it's unbalanced
      const openParenCount = (cleanedUrl.match(/\(/g) || []).length;
      const closeParenCount = (cleanedUrl.match(/\)/g) || []).length;
      if (closeParenCount > openParenCount) {
        cleanedUrl = cleanedUrl.slice(0, -punctuation.length);
      }
    }
    return cleanedUrl;
  };

  // Split the text by URLs, then map over each part
  const parts = oneliner.split(urlRegex).map((part, index) => {
    if (part === undefined) return null;

    // Check if this part is a URL
    if (part.match(/^https?:\/\//)) {
      const cleanedUrl = cleanUrl(part);
      return (
        <Link key={index} href={cleanedUrl} target="_blank" rel="noopener noreferrer">
          <span className="text-gray-500 underline hover:text-[#2C3F2D] transition-colors duration-200">
            {cleanedUrl}
          </span>
        </Link>
      );
    }

    // Otherwise, apply formatting and replace \n with <br />
    return (
      <React.Fragment key={index}>
        {part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {applyFormatting(line)}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });

  // Return the parts wrapped in a React fragment
  return <>{parts.filter(Boolean)}</>;
}

export const splitLinks = (links: string): string[] => {
  return links.split(/\s+(?=https?:\/\/)/).filter((link) => link.trim() !== '');
}