'use client';

import React from 'react';

interface UserDropdownProps {
    onSignout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({onSignout}) => {
    return(
        <details className="dropdown">
        <summary className="btn bg-headerblack border-none flex items-center gap-2 text-white text-lg p-2">
        <div className=" w-12 h-12 h-full mr-6 flex items-center">
          <svg width="93" height="64" viewBox="0 0 93 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[60%] transform -translate-y-1/2">
            <g filter="url(#filter0_d_351_2429)">
            <rect x="12.8311" y="8" width="68.1689" height="40" rx="14" fill="white" shapeRendering="crispEdges"/>
            <rect x="28.8311" y="17.9155" width="20.1689" height="20.1689" rx="4.48199" fill="#855DCD"/>
            <path d="M34.0302 21.0529H43.8009V34.9471H42.3667V28.5827H42.3526C42.1941 26.8237 40.7158 25.4453 38.9155 25.4453C37.1153 25.4453 35.637 26.8237 35.4785 28.5827H35.4644V34.9471H34.0302V21.0529Z" fill="white"/>
            <path d="M31.4306 23.025L32.0133 24.9971H32.5063V32.975C32.2587 32.975 32.0581 33.1757 32.0581 33.4232V33.961H31.9684C31.7209 33.961 31.5202 34.1617 31.5202 34.4092V34.9471H36.5401V34.4092C36.5401 34.1617 36.3394 33.961 36.0919 33.961H36.0022V33.4232C36.0022 33.1757 35.8016 32.975 35.554 32.975H35.0162V23.025H31.4306Z" fill="white"/>
            <path d="M42.4563 32.975C42.2088 32.975 42.0081 33.1757 42.0081 33.4232V33.961H41.9185C41.6709 33.961 41.4703 34.1617 41.4703 34.4092V34.9471H46.4901V34.4092C46.4901 34.1617 46.2894 33.961 46.0419 33.961H45.9522V33.4232C45.9522 33.1757 45.7516 32.975 45.504 32.975V24.9971H45.9971L46.5797 23.025H42.9941V32.975H42.4563Z" fill="white"/>
            <circle cx="61" cy="28" r="4" fill="#04DF00"/>
            </g>
            <defs>
            <filter id="filter0_d_351_2429" x="0.831055" y="0" width="92.1689" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="6"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_351_2429"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_351_2429" result="shape"/>
            </filter>
            </defs>
          </svg>
        </div>
        </summary>
        <ul 
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
        >
            <li>
                <p onClick={onSignout} className='text-black'>Sign Out</p>
            </li>
        </ul>
        </details>

    )
}

export default UserDropdown;