//mglspinner.svg
// SpinnerIcon.js or SpinnerIcon.tsx
import React from 'react';

const SpinnerIcon = (props:any) => (
  <svg
    width="97"
    height="96"
    viewBox="0 0 97 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className} // This allows you to pass additional classes
  >
    <path
      d="M23.2384 78.9488C23.149 78.8713 23.0477 78.7938 22.9523 78.7223C22.0224 77.9473 21.1045 77.1128 20.2461 76.2545C4.67037 60.6787 4.67037 35.3332 20.2461 19.7575C35.8218 4.18173 61.1733 4.17577 76.7491 19.7515C92.3248 35.3272 92.3248 60.6728 76.7491 76.2485C68.3025 84.695 56.6252 88.8975 44.7214 87.7708C44.5902 87.7589 44.4651 87.741 44.3458 87.7291L44.3399 95.818C58.5148 97.0459 72.3798 92.0031 82.4417 81.9411C101.159 63.224 101.159 32.776 82.4417 14.0589C63.7246 -4.65822 33.2765 -4.65822 14.5594 14.0589C-4.15766 32.776 -4.15766 63.224 14.5594 81.9411C15.5072 82.8889 16.5027 83.8009 17.5339 84.6652L23.2504 78.9488L23.2384 78.9488Z"
      fill="#2C3F2D"
    />
  </svg>
);

export default SpinnerIcon;
