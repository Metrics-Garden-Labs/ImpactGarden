import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalState } from '../../src/config/config';
import { Project, ProjectCount, SearchResult } from '../../src/types';
import Image from 'next/image';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import RenderStars from '../components/searchProjects/RenderStars';
import ProjectModal from '../components/searchProjects/ProjectModal';

interface Props {
  projects: (Project | ProjectCount)[];
  query: string;
  filter: string;
  sortOrder: string;
  searchResults: SearchResult[];
}

export default function ProjectList({ 
  projects,
  query,
  filter,
  sortOrder,
  searchResults,
}: Props) {
  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>('selectedProject', null);
  const [selectedProjectName, setSelectedProjectName] = useGlobalState('selectedProjectName');
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);

  // console.log("Received projects:", projects);
  console.log("Current sortOrder:", sortOrder);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (query && !project.projectName?.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [projects, query]);

  const sortedProjects = useMemo(() => {
    console.log("Sorting projects with sortOrder:", sortOrder);
    let sorted = [...filteredProjects];
    switch (sortOrder) {
      case 'Most Attested':
        sorted.sort((a, b) => {
          const aCount = 'attestationCount' in a ? Number(a.attestationCount) : 0;
          const bCount = 'attestationCount' in b ? Number(b.attestationCount) : 0;
          if (aCount === bCount) {
            // If attestation counts are equal, sort alphabetically
            return (a.projectName || '').localeCompare(b.projectName || '', undefined, { sensitivity: 'base' });
          }
          return bCount - aCount;
        });
        break;
      case 'Recently Added':
        sorted.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
      case 'Z-A':
        sorted.sort((a, b) => (b.projectName || '').localeCompare(a.projectName || '', undefined, { sensitivity: 'base' }));
        break;
      case 'A-Z':
      default:
        sorted.sort((a, b) => (a.projectName || '').localeCompare(b.projectName || '', undefined, { sensitivity: 'base' }));
    }
    // console.log("Sorted projects:", sorted);
    return sorted;
  }, [filteredProjects, sortOrder]);

  const openModal = (project: Project | ProjectCount) => {
    console.log('Opening modal for project:', project);
    setSelectedProject(project);
    setSelectedProjectName(project.projectName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const loadMoreProjects = () => {
    setVisibleProjects((prev) => prev + 12);
  };

  const urlHelper = (url: string) => {
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-4 mx-3 md:grid-cols-3 md:mx-8 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {sortedProjects.slice(0, visibleProjects).map((project) => (
          <div
            key={project.id}
            className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-md w-full h-66 shadow-xl"
            onClick={() => openModal(project)}
          >
            <div className="rounded-md bg-gray-300 w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
              {project.logoUrl ? (
                <Image
                  src={project.logoUrl}
                  alt="Project Logo"
                  width={64}
                  height={64}
                  style={{ height: "auto" }}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  {/* Add optional placeholder content if needed */}
                </div>
              )}
            </div>
            <h3 className="mb-2 text-xl font-semibold truncate max-w-full">{project.projectName}</h3>
            <p className="mb-2 text-md text-gray-500 text-center truncate max-w-full">{project.oneliner}</p>
            {sortOrder === 'Most Attested' && 'attestationCount' in project && Number(project.attestationCount) > 0 && (
              <p className="mb-2 text-md text-gray-500 text-center truncate max-w-full">
                Attestations: {project.attestationCount}
              </p>
            )}
          </div>
        ))}
      </div>
      {visibleProjects < sortedProjects.length && (
        <div className="flex justify-center my-8">
          <button onClick={loadMoreProjects} className="btn bg-[#353436] text-white hover:text-black">
            Load More
          </button>
        </div>
      )}
      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        project={selectedProject}
        checkwebsiteUrl={urlHelper}
      />
    </div>
  );
}