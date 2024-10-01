import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Contribution, Project } from '@/src/types';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import AttestationModal2 from '../projects/AttestationModal2';
import { useRouter } from 'next/router';

interface ReviewCompletionPageProps {
    reviewedProject: Project | null;
  reviewedContribution: Contribution | null;
  attestationUID: string;
  userFid: string;
  attestationType: Contribution | Project | null;
  easScanEndpoints?: { [key: string]: string };
  onClose: () => void;
}

const ITEMS_PER_PAGE = 4;

function useOutsideClick(ref: React.RefObject<HTMLDivElement>, callback: () => void) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  }

const ReviewConfirmationPage: React.FC<ReviewCompletionPageProps> = ({
  reviewedContribution,
  userFid,
  attestationUID,
  attestationType,
  easScanEndpoints,
  reviewedProject,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

//   const contentRef = useRef<HTMLDivElement>(null);
//   useOutsideClick(contentRef, onClose);


useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  const CategoryToFetch = "OP Stack"; // You might want to make this dynamic

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getContributionsByCategory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            category: CategoryToFetch,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            userFid: userFid
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch contributions');
        }
        const data = await response.json();
        setContributions(data.contributions.contributions);
        setTotalContributions(data.contributions.total);
      } catch (err) {
        console.error("Error fetching contributions:", err);
        setError('Failed to load contributions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [currentPage, userFid]);

  const fetchProjectDetails = async (projectName: string): Promise<Project | null> => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const data = await response.json();
      return data.project;
    } catch (error) {
      console.error("Error fetching project details:", error);
      return null;
    }
  };

  const openModal = async (contribution: Contribution) => {
    setSelectedContribution(contribution);
    const project = await fetchProjectDetails(contribution.projectName);
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContribution(null);
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalContributions / ITEMS_PER_PAGE)));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const totalPages = Math.ceil(totalContributions / ITEMS_PER_PAGE);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-center items-center p-8 w-full text-black">
        <Image src="/star.png" alt="Smiley" width={60} height={60} className="mb-4" />
        <h1 className="text-xl font-bold text-center mb-4">
          Review completed!
        </h1>
        <p className="text-center mb-8 text-sm">Thank you for reviewing this project!</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-12 w-1/5 max-w-md">
          <Image 
            src={reviewedProject?.logoUrl || ""}
            alt={reviewedProject?.projectName || "Project"}
            width={80}
            height={80}
            className="mx-auto rounded-lg"
          />
          <h2 className="text-lg font-semibold text-center mt-4">{reviewedContribution?.projectName || "Project"}</h2>
          <p className="text-center text-gray-600 mt-2">{reviewedContribution?.desc || "Description"}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-black">
        {loading ? (
          <p>Loading contributions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="relative w-full items-center justify-center max-w-6xl flex flex-col text-black">
              <h3 className="text-lg font-semibold mb-6 text-left w-full">Other projects for you to review</h3>
              <div className="flex items-center justify-center space-x-7 overflow-x-auto p-6">
                {contributions.map((contribution, index) => (
                  <div key={index} className="flex-shrink-0 w-56 h-88 bg-white rounded-md p-4 flex flex-col items-center shadow-md">
                    <div className="flex flex-col items-center p-1 w-full">
                      <div className="w-48 h-28 mb-4 overflow-hidden rounded-lg">
                        <Image 
                          src={contribution.logoUrl || "/placeholder-logo.png"} 
                          alt={contribution.projectName} 
                          width={100} 
                          height={100} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-center text-sm font-semibold w-full truncate px-1 break-words">{contribution.projectName}</h3>
                      {contribution.projectName !== contribution.contribution && (
                        <h4 className="text-center text-xs mt-1 w-full truncate px-1 break-words">{contribution.contribution}</h4>
                      )}
                      <p className="text-xs text-gray-600 mt-2 mb-3 text-center w-full truncate px-1 break-words">{contribution.subcategory}</p>
                      <p className="text-xs mb-4 text-center w-full line-clamp-2 px-1 break-words">{contribution.desc}</p>

                      <button 
                        className="btn btn-primary bg-black text-xs text-white items-center hover:bg-gray-800 px-2 py-1 rounded"
                        onClick={() => openModal(contribution)}
                      >
                        Review Contribution
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {currentPage > 1 && (
                <button 
                  onClick={prevPage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                >
                  <FaChevronLeft size={20} />
                </button>
              )}
              {currentPage < totalPages && (
                <button 
                  onClick={nextPage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                >
                  <FaChevronRight size={20} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center space-x-2 pb-8 text-black">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentPage - 1 ? 'bg-gray-800' : 'bg-gray-300'}`}
            onClick={() => setCurrentPage(index + 1)}
          />
        ))}
      </div>
      
      {isModalOpen && selectedContribution && selectedProject && (
        <AttestationModal2 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          contribution={selectedContribution}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default ReviewConfirmationPage;