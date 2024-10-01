import React from 'react';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { Project } from '../../../src/types';
import { formatOneliner } from '../../../src/utils/fomatOneliner';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  checkwebsiteUrl: (url: string) => string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, checkwebsiteUrl }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <div
        className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-2/3 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center pt-8 p-2">
          <h2 className="text-xl font-bold mb-4">{project.projectName}</h2>
        </div>
        <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
        <div className="mb-4 items-center py-3">
          <h3 className="font-semibold text-center">Description</h3>
          <p className="text-left font-sm text-[#A6A6A6] leading-relaxed">
            {formatOneliner(project.oneliner || "")}
            </p>
        </div>
        {project.websiteUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Website</h3>
            <p className="text-left font-sm text-[#A6A6A6] leading-relaxed  overflow-wrap break-words max-w-full mx-auto truncate">
              <Link href={`${checkwebsiteUrl(project.websiteUrl)}`}>
                <span className="text-left font-sm text-[#A6A6A6] leading-relaxed hover:text-[#2C3F2D] visited:text-indigo-600">
                  {project.websiteUrl}
                </span>
              </Link>
            </p>
          </div>
        )}
        {project.twitterUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Twitter</h3>
            <p className="text-left font-sm text-[#A6A6A6] hover:text-[#2C3F2D] leading-relaxed">
              <Link href={project.twitterUrl} target="_blank" rel="noopener noreferrer">
                {project.twitterUrl}
              </Link>
            </p>
          </div>
        )}
        {project.githubUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Github</h3>
            <p className="text-left font-sm text-[#A6A6A6] hover:text-[#2C3F2D] leading-relaxed">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                {project.githubUrl}
              </Link>
            </p>
          </div>
        )}
        <div className="mb-4 text-center">
          <Link href={`/projects/${encodeURIComponent(project?.primaryprojectuid || '')}`}>
            <button className='btn bg-[#353436] text-white hover:text-black'>
              View Project Profile
            </button>
          </Link>
        </div>
        <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectModal;