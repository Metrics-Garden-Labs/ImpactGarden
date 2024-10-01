import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useGlobalState } from '@/src/config/config';
import { Project, ProjectCount, SearchResult } from '@/src/types';
import Image from 'next/image';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import ProjectModal from '@/app/components/searchProjects/ProjectModal';
import SpinnerIcon from '../ui/spinnermgl/mglspinner';
import Mgltree from '../ui/spinnermgl/mgltree';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false); 
  const observerTarget = useRef(null);

  // Set isFiltering to true when sortOrder or filter changes
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 600); // Simulating a delay for filtering
    return () => clearTimeout(timer);
  }, [sortOrder, filter]);

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
        return sorted; // Implement the attestation count logic here if needed
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
    return sorted;
  }, [filteredProjects, sortOrder]);


  const loadMoreProjects = useCallback(() => {
    if (!isLoading && visibleProjects < sortedProjects.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleProjects((prev) => prev + 12);
        setIsLoading(false);
      }, 200); // Simulating a delay, otherwise it loads to fast and is jerky
    }
  }, [isLoading, visibleProjects, sortedProjects.length]);

  //auto load when the user scrolls to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProjects();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreProjects]);

  const openModal = (project: Project | ProjectCount) => {
    setSelectedProject(project);
    console.log("project", project);
    setSelectedProjectName(project.projectName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const urlHelper = (url: string) => {
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-4 mx-3 md:grid-cols-3 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {isFiltering ? (
          // Display loading skeleton when filtering or sorting
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col p-6 border justify-center items-center bg-gray-100 animate-pulse rounded-md w-full h-66 shadow-xl"
            >
              <div className="rounded-md bg-gray-300 w-24 h-24 mb-4"></div>
              <div className="w-36 h-4 bg-gray-300 mb-2"></div>
              <div className="w-24 h-4 bg-gray-300"></div>
            </div>
          ))
        ) : (
          sortedProjects.slice(0, visibleProjects).map((project) => (
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
                  <div className="flex items-center justify-center text-gray-500"></div>
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
          ))
        )}
      </div>
      {visibleProjects < sortedProjects.length && !isFiltering && (
        <div ref={observerTarget} className="flex justify-center my-8">
          {isLoading ? (
            <div className="flex justify-center items-center mb-6 mt-6">
            <SpinnerIcon className="spinner w-16 h-16" />
            <Mgltree className="absolute w-12 h-12" />
          </div>
          ) : (
            <p className="text-xl font-bold">Scroll for more</p>
          )}
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
