import React from 'react';
import { Contribution, Project } from '../../../src/types';

interface FramePreviewProps {
  contribution: Contribution;
  project: Project;
  backgroundColor: string;
  content?: React.ReactNode;
}

const FramePreview: React.FC<FramePreviewProps> = ({ contribution, project, backgroundColor, content }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {content || (
        <>
          <img
            src={project.logoUrl || 'https://i.imgur.com/2Mfg3YA.jpg'}
            alt="Logo"
            width={200}
            height={200}
            className="pt-5"
          />
          <h2 style={{ fontSize: '24px' }}>{contribution.projectName}</h2>
          <p style={{ fontSize: '18px' }}>{contribution.desc}</p>
          {contribution.link && (
            <a
              href={contribution.link}
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {contribution.link}
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default FramePreview;
