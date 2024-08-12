'use client';

import { useState } from 'react';
import { Contribution, Project } from '../../../src/types';
import FramePreview from '../../components/frames/framePreview';

interface FrameCustomizationPageProps {
  contribution: Contribution;
  project: Project;
}

const FrameCustomizationPage: React.FC<FrameCustomizationPageProps> = ({ contribution, project }) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('rgb(254, 228, 255)');

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="flex-1 overflow-auto p-4">
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
        <FramePreview 
          contribution={contribution} 
          project={project}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  );
};

export default FrameCustomizationPage;
