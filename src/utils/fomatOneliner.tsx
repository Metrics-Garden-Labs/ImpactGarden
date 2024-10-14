import React from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export function formatOneliner(oneliner: string): React.ReactNode {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;

  const applyFormatting = (text: string): React.ReactNode => {
    // Header: # text (multiple # supported)
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    text = text.replace(headerRegex, (_, hashes, content) => {
      const level = hashes.length;
      return `<h${level} class="text-${7-level}xl font-bold mt-4 mb-2">${content}</h${level}>`;
    });

    // Bold and Italic
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline Code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 rounded px-1">$1</code>');

    // Sanitize the formatted HTML
    const sanitizedText = DOMPurify.sanitize(text);

    return <span dangerouslySetInnerHTML={{ __html: sanitizedText }} />;
  };

  const cleanUrl = (url: string): string => {
    let cleanedUrl = url;
    const trailingPunctuationRegex = /[),.:;!?]+$/;
    const match = cleanedUrl.match(trailingPunctuationRegex);
    if (match) {
      const punctuation = match[0];
      const openParenCount = (cleanedUrl.match(/\(/g) || []).length;
      const closeParenCount = (cleanedUrl.match(/\)/g) || []).length;
      if (closeParenCount > openParenCount) {
        cleanedUrl = cleanedUrl.slice(0, -punctuation.length);
      }
    }
    return cleanedUrl;
  };

  // Split content into paragraphs
  const paragraphs = oneliner.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        if (paragraph.trim().startsWith('- ')) {
          // Handle lists
          const listItems = paragraph
            .split('\n')
            .map((item, i) => (
              <li key={i}>{applyFormatting(item.replace(/^-\s+/, ''))}</li>
            ));
          return <ul key={index} className="list-disc ml-6 mb-4">{listItems}</ul>;
        } else {
          // Handle regular paragraphs
          const lines = paragraph.split('\n');
          return (
            <p key={index} className="mb-4">
              {lines.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line.split(urlRegex).map((part, partIndex) => {
                    if (part.match(/^https?:\/\//)) {
                      const cleanedUrl = cleanUrl(part);
                      return (
                        <Link key={partIndex} href={cleanedUrl} target="_blank" rel="noopener noreferrer">
                          <span className="text-gray-500 underline hover:text-[#2C3F2D] transition-colors duration-200">
                            {cleanedUrl}
                          </span>
                        </Link>
                      );
                    }
                    return <React.Fragment key={partIndex}>{applyFormatting(part)}</React.Fragment>;
                  })}
                  {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }
      })}
    </>
  );
}
/**
 * Splits a string of links into an array of URLs.
 * @param links - A space-separated string of links.
 * @returns An array of cleaned URL strings.
 */
export const splitLinks = (links: string): string[] => {
  return links.split(/\s+(?=https?:\/\/)/).filter((link) => link.trim() !== '');
};
