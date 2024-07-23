'use client';

import React, { useState } from 'react';
import { Contribution, Project } from '../../src/types';

interface FrameCustomizationProps {
  contribution: Contribution;
  project: Project;
}

const framesData = [
  {
    id: 'frame1',
    content: (contribution: Contribution, logoUrl: string, fontSize: string) => (
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
        <img
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <h2 style={{ fontSize: '1.5em' }}>{contribution.projectName}</h2>
        <p>{contribution.desc}</p>
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
    id: 'frame2',
    content: (contribution: Contribution, logoUrl: string, fontSize: string) => (
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
        <img
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <p>{contribution.desc}</p>
        <p>I hope to see you at the next office hours!</p>
      </div>
    ),
  },
  {
    id: 'frame3',
    content: (contribution: Contribution, logoUrl: string, fontSize: string) => (
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
        <img
          src={logoUrl}
          alt="Logo"
          width={200}
          height={200}
          className="pt-5"
        />
        <p>So excited that you could make it!</p>
        <p>How would you rate the session you attended on a scale of 1-5?</p>
        <p>1= Very bad; 5= Very good</p>
      </div>
    ),
  },
  // Add more frames as needed
];

const FrameCustomization: React.FC<FrameCustomizationProps> = ({ contribution, project }) => {
  const [selectedFrame, setSelectedFrame] = useState(framesData[0].id);
  const [backgroundColor, setBackgroundColor] = useState<string>('rgb(254, 228, 255)');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1'); // Aspect ratio state
  const [fontSize, setFontSize] = useState<string>('1em'); // Font size state

  const handleFrameChange = (frameId: string) => {
    setSelectedFrame(frameId);
  };

  const selectedFrameContent = framesData.find((frame) => frame.id === selectedFrame)?.content(contribution, project.logoUrl || 'https://i.imgur.com/2Mfg3YA.jpg', fontSize);

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
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="ml-2"
          >
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
              {selectedFrameContent}
            </div>
          </div>
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
