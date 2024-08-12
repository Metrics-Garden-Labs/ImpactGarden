'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Contribution, Project } from '../../../src/types';
import Image from 'next/image';

interface FrameCustomizationProps {
  contribution: Contribution;
  project: Project;
}

const framesData = [
  {
    id: 'Screen 1',
    content: (
        contribution: Contribution, 
        logoUrl: string, 
        fontSize: string, 
        adjustFontSize: boolean,
        handleScreenChange: (screenId: string) => void
    ) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'inherit',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          fontSize: fontSize,
        }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <h2 style={{ fontSize: '1.5em' }}>{contribution.projectName}</h2>
        <p style={{ fontSize: adjustFontSize ? 'calc(1em + 1vw)' : fontSize, textAlign: 'center', overflowWrap: 'break-word' }}>{contribution.desc}</p>
        {contribution.link && (
          <a
            href={contribution.link}
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            {contribution.link}
          </a>
        )}
      </div>
    ),
  },
  {
    id: 'Screen 2',
    content: (
        contribution: Contribution, 
        logoUrl: string, 
        fontSize: string,
        adjustFontSize: boolean,
        handleScreenChange: (screenId: string) => void
        ) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: 'inherit',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          fontSize: fontSize,
        }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <p>{contribution.desc}</p>
        <p>How would you rate the contribution?</p>
        <p>1 = Very bad; 5 = Very Good</p>
        <input type="text" placeholder="Your input here" style={{ marginTop: '10px', padding: '5px', fontSize: '1em' }} />
      </div>
    ),
  },
  {
    id: 'Screen 3',
    content: (
        contribution: Contribution, 
        logoUrl: string, 
        fontSize: string,
        adjustFontSize: boolean,
        handleScreenChange: (screenId: string) => void
    ) => (
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: 'inherit',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          fontSize: fontSize,
        }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <p>Are you a Delegate in the Ecosystem?</p>
      </div>
    ),
  },
  {
    id: 'Screen 4',
    content: (
        contribution: Contribution, 
        logoUrl: string, 
        fontSize: string,
        adjustFontSize: boolean,
        handleScreenChange: (screenId: string) => void
    ) => (
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: 'inherit',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          fontSize: fontSize,
        }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <p>Please leave some feedback on the Contribution!!</p>
        </div>
    ),
  },
];

const FrameCustomization: React.FC<FrameCustomizationProps> = ({ contribution, project }) => {
  const [selectedFrame, setSelectedFrame] = useState(framesData[0].id);
  const [backgroundColor, setBackgroundColor] = useState<string>('rgb(254, 228, 255)');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1'); // Aspect ratio state
  const [fontSize, setFontSize] = useState<{ [key: string]: string }>({
    frame1: '1em',
    frame2: '1em',
    frame3: '1em',
    frame4: '1em',
  }); // Font size state
  const [adjustFontSize, setAdjustFontSize] = useState<boolean>(false); // Adjust font size state
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
        setAdjustFontSize(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [contribution.desc, fontSize[selectedFrame]]);

  const handleFrameChange = (frameId: string) => {
    setSelectedFrame(frameId);
  };

  const handleFontSizeChange = (frameId: string, size: string) => {
    setFontSize((prevFontSize) => ({
      ...prevFontSize,
      [frameId]: size,
    }));
  };

  const handleScreenChange = (screenId: string) => {
    setSelectedFrame(screenId);
  };

  const selectedFrameContent = framesData.find((frame) => frame.id === selectedFrame)?.content(
    contribution,
    project.logoUrl || 'https://i.imgur.com/2Mfg3YA.jpg',
    fontSize[selectedFrame],
    adjustFontSize,
    handleScreenChange
  );

  const aspectRatioStyles = aspectRatio === '1:1' ? { paddingBottom: '100%' } : { paddingBottom: '52.35%' };

  return (
    <div className="flex flex-row min-h-screen bg-white text-black">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Customize Your Frame</h1>
        <label className="block mb-4">
          Background Color:
          <input 
            type="color" 
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="ml-2"
          />
        </label>
        <label className="block mb-4">
          Aspect Ratio:
          <select 
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="ml-2"
          >
            <option value="1:1">1:1</option>
            <option value="1.91:1">1.91:1</option>
          </select>
        </label>
        <label className="block mb-4">
          Font Size:
          <select 
            value={fontSize[selectedFrame]}
            onChange={(e) => handleFontSizeChange(selectedFrame, e.target.value)}
            className="ml-2"
          >
            <option value='0.4em'>Extra Small</option>
            <option value="0.8em">Small</option>
            <option value="1em">Medium</option>
            <option value="1.2em">Large</option>
          </select>
        </label>
        <div className="frame-preview" style={{ position: 'relative', width: '90%', backgroundColor }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 0,
              ...aspectRatioStyles,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor,
                boxSizing: 'border-box',
              }}
            >
              <div ref={textRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                {selectedFrameContent}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          {selectedFrame === 'Screen 1' && (
            <div>
              <button className='btn btn-primary' onClick={() => handleScreenChange('Screen 2')}>
                Next
              </button>
            </div>
          )}
          {selectedFrame === 'Screen 2' && (
            <>
              <input type="text" placeholder="Your input here" style={{ marginBottom: '10px', padding: '5px', fontSize: '1em' }} />
              <div>
                <button className='btn btn-primary' onClick={() => handleScreenChange('Screen 1')}>
                  Back
                </button>
                <button className='btn btn-primary ml-2' onClick={() => handleScreenChange('Screen 3')}>
                  Next
                </button>
              </div>
            </>
          )}
          {selectedFrame === 'Screen 3' && (
            <>
            <div>
              <button className='btn btn-primary' onClick={() => handleScreenChange('Screen 3')}>
                Back
              </button>
              <button className='btn btn-primary ml-2' onClick={() => alert('You clicked Yes!')}>
                Yes
              </button>
              <button className='btn btn-primary ml-2' onClick={() => alert('You clicked No!')}>
                No
              </button>
            </div>
          </>
          )}
          {selectedFrame === 'Screen 4' && (
            
             <>
             <input type="text" placeholder="Your feedback here" style={{ marginBottom: '10px', padding: '5px', fontSize: '1em' }} />
             <div>
               <button className='btn btn-primary' onClick={() => handleScreenChange('Screen 2')}>
                 Back
               </button>
               <button className='btn btn-primary ml-2' onClick={() => handleScreenChange('Screen 4')}>
                 Next
               </button>
             </div>
           </>
          )}
        </div>
      </div>
      <div className="w-1/4 p-4 border-l border-gray-300">
        <h2 className="text-xl font-bold mb-4">Select Frame</h2>
        <ul className="space-y-2">
          {framesData.map((frame) => (
            <li key={frame.id}>
              <button 
                className={`p-2 w-full text-left ${frame.id === selectedFrame ? 'bg-gray-200' : ''}`}
                onClick={() => handleFrameChange(frame.id)}
              >
                {frame.id}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FrameCustomization;
