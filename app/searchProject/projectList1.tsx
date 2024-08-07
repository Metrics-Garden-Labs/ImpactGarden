'use client';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useGlobalState } from '../../src/config/config';
import { Project, ProjectCount, SearchResult } from '../../src/types';
import { LuArrowUpRight } from 'react-icons/lu';
import Image from 'next/image';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import { IoStarHalfSharp, IoStarOutline, IoStarSharp } from 'react-icons/io5';

interface Props {
  projects: (Project | ProjectCount)[];
  query: string;
  filter: string;
  sortOrder: string;
  searchResults: SearchResult[];
}

const renderStars = (rating: number) => {
  const fullStarsCount = Math.floor(rating);
  const halfStarsCount = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStarsCount = 5 - fullStarsCount - halfStarsCount;

  return (
    <div className="flex justify-center">
      {Array.from({ length: fullStarsCount }, (_, index) => (
        <IoStarSharp key={`full-${index}`} />
      ))}
      {Array.from({ length: halfStarsCount }, (_, index) => (
        <IoStarHalfSharp key={`half-${index}`} />
      ))}
      {Array.from({ length: emptyStarsCount }, (_, index) => (
        <IoStarOutline key={`empty-${index}`} />
      ))}
    </div>
  );
};

export default function ProjectList({ 
  projects,
  query,
  filter,
  sortOrder,
  searchResults,
}: Props) {
  useEffect(() => {
    //console.log("Received sortOrder in ProjectList:", sortOrder);
  }, [sortOrder]);

  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>(
    'selectedProject', null
  );
  const [selectedProjectName, setSelectedProjectName] = useGlobalState('selectedProjectName');
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (query && !project.projectName?.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (filter === 'Recently Added' || filter === 'Most Attested' || filter === 'Best Rated') {
        return true; // Since the backend is already filtering, just return true here
      }
      return true;
    });
  }, [projects, query, filter]);

  const sortedProjects = useMemo(() => {
    console.log("Sorting with sortOrder:", sortOrder);
    if (filter === 'Recently Added') {
      return filteredProjects.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    } else if (filter === 'Most Attested') {
      return filteredProjects.sort((a, b) => {
        return ((b as ProjectCount).attestationCount || 0) - ((a as ProjectCount).attestationCount || 0);
      });
    } else if (filter == 'Best Rated') {
      return filteredProjects.sort((a, b) => {
        return ((b as ProjectCount).averageRating || 0) - ((a as ProjectCount).averageRating|| 0);
      });
    }

    return filteredProjects.sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.projectName || '').localeCompare(b.projectName || '', undefined, { sensitivity: 'base' });
      } else if (sortOrder === 'desc') {
        return (b.projectName || '').localeCompare(a.projectName || '', undefined, { sensitivity: 'base' });
      }
      return 0;
    });
  }, [filteredProjects, sortOrder, filter]);

  const openModal = (project: Project) => {
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

  const checkwebsiteUrl = urlHelper(selectedProject?.websiteUrl || '');

  const renderModal = () => {
    if (!modalOpen || !selectedProject) return null;

    console.log("Rendering modal with Selected Project", selectedProject);
    console.log("Rendering modal with Selected Project Name", selectedProjectName);

    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
        <div
          className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/4 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">{selectedProject.projectName}</h2>
          </div>
          <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
          <div className="mb-4 items-center py-3">
            <h3 className="font-semibold text-center">Description</h3>
            <p className="text-center">{selectedProject.oneliner}</p>
          </div>
          {selectedProject.websiteUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Website</h3>
            <p className="text-center overflow-wrap break-words max-w-full mx-auto truncate">
                <Link href={`${checkwebsiteUrl}`}>
                  <span className="text-black hover:text-gray-300 visited:text-indigo-600 ">
                    {selectedProject.websiteUrl}
                  </span>
                </Link>
            </p>
          </div>
          )}
          {selectedProject.twitterUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Twitter</h3>
            <p className="text-center">
                <Link href={selectedProject.twitterUrl} target="_blank" rel="noopener noreferrer">
                  {selectedProject.twitterUrl}
                </Link>
            </p>
          </div>
          )}
          {selectedProject.githubUrl && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Github</h3>
            <p className="text-center">
                <Link href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                  {selectedProject.githubUrl}
                </Link>
            </p>
          </div>
          )}
          <div className="mb-4 text-center">
            <Link href={`/projects/${encodeURIComponent(selectedProject.projectName)}`}>
              <button className='btn'>
                View Contributions
              </button>
            </Link>
          </div>
          <button onClick={closeModal} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
            <RxCross2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-4 mx-3 md:grid-cols-3 md:mx-8 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {sortedProjects.slice(0, visibleProjects).map((project) => (
          <div
            key={project.id}
            className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-md w-full h-66 shadow-xl"
            onClick={() => {
              console.log('clicked project:', project);
              openModal(project);
            }}
          >
            <div className="rounded-md bg-gray-300 w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
              {project.logoUrl ? (
                <Image
                  src={project.logoUrl}
                  alt="Project Logo"
                  width={64}
                  height={64}
                  style={{  height: "auto" }}
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
            {Array.isArray(searchResults) && searchResults.find((result) => result.fid === project.userFid)?.username && (
              <p className="text-gray-500">
                {searchResults.find((result) => result.fid === project.userFid)?.username}
              </p>
            )}
            {filter === 'Most Attested' && (            <p className="mb-2 text-md text-gray-500 text-center truncate max-w-full">
              Attestations: {(project as ProjectCount).attestationCount}
            </p>
            )}
            {filter === 'Best Rated' && (
              <div className="mb-2 text-md text-gray-500 text-center truncate max-w-full">
                Average Rating: {renderStars((project as ProjectCount).averageRating ?? 0)}
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleProjects < sortedProjects.length && (
        <div className="flex justify-center my-8">
          <button onClick={loadMoreProjects} className="btn">
            Load More
          </button>
        </div>
      )}
      {renderModal()}
    </div>
  );
}
