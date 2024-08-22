// src/utils/formattingUtils.ts

import React from 'react';
import Link from 'next/link';

/**
 * Formats the oneliner by converting URLs into clickable links and preserving line breaks.
 * @param oneliner - The oneliner text to format.
 * @returns A React node with formatted content.
 */
export function formatOneliner(oneliner: string): React.ReactNode {
  // Regular expression to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

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
    // Otherwise, replace \n with <br /> and return the text
    return (
      <React.Fragment key={index}>
        {part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });

  // Return the parts wrapped in a React fragment
  return <>{parts}</>;
}
