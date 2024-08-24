import React from 'react';
import Link from 'next/link';

/**
 * Formats the oneliner by converting URLs into clickable links, preserving line breaks, and applying basic Markdown-like formatting.
 * @param oneliner - The oneliner text to format.
 * @returns A React node with formatted content.
 */
export function formatOneliner(oneliner: string): React.ReactNode {
  // Regular expression to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

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

  // Split the text by URLs, then map over each part
  const parts = oneliner.split(urlRegex).map((part, index) => {
    // If the part matches the URL regex, wrap it in a Link component
    if (urlRegex.test(part)) {
      return (
        <Link key={index} href={part} target="_blank" rel="noopener noreferrer">
          <span className="text-blue-500 underline">{part}</span>
        </Link>
      );
    }
    // Otherwise, apply formatting and replace \n with <br />
    return (
      <React.Fragment key={index}>
        {part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {applyFormatting(line)}
            <br />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });

  // Return the parts wrapped in a React fragment
  return <>{parts}</>;
}