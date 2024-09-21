'use client'

//next thing is adding the userFid and only showing projects they have not attestted to yet


import React, { useEffect, useState } from 'react';
import { FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Image from 'next/image';
import { AttestationNetworkType, Contribution, Project } from '@/src/types';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import AttestationModal2 from '../projects/AttestationModal2';
import { easScanEndpoints } from '@/src/utils/easScan';

interface ReviewCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  userFid: string;
  attestationUID?: string;
  attestationType?: Contribution | Project | null;
  easScanEndpoints?: { [key: string]: string };
}

interface ApiResponse {
  contributions: {
    contributions: Contribution[];
    total: number;
  };
}

const ITEMS_PER_PAGE = 5;

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ 
  isOpen,
  onClose,
  userFid,
  attestationUID,
  attestationType,
  easScanEndpoints
}) => {
    const [currentPage, setCurrentPage] = useState(1);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  const CategoryToFetch = "OP Stack"

  useEffect(() => {
    const fetchContributions = async () => {
      if (!isOpen) return;
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
        const data: ApiResponse = await response.json();
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
  }, [isOpen, currentPage, userFid]);

  const fetchProjectDetails = async (projectName: string): Promise<Project | null> => {
    setProjectLoading(true);
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
    } finally {
      setProjectLoading(false);
    }
  };

  const totalPages = Math.ceil(totalContributions / ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  //include props for open modal


  const openModal = async (contribution: Contribution) => {
    setSelectedContribution(contribution);
    const project = await fetchProjectDetails(contribution.projectName);
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContribution( null);
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const renderAttestationConfirmation = () => {
    if(!attestationUID || !attestationType || !easScanEndpoints) return null;

    const attestationLink = `${easScanEndpoints[attestationType.ecosystem as AttestationNetworkType]}${attestationUID}`;

    return(
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
      <p className="font-bold">Attestation Created Successfully!</p>
      <p>Your attestation for {attestationType.projectName} has been recorded.</p>
      <a
        href={attestationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Attestation
      </a>
    </div>
  );
};

  console.log('ReviewCarousel props:', { isOpen, userFid, attestationUID, attestationType });

  if (!isOpen) {
    console.log('ReviewCarousel not open, returning null');
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-xl w-4/5 h-3/4 overflow-y-auto">
      <div className="flex justify-between items-center pl-16 pt-10 pb-4">
        <div className="flex items-center space-x-4">
          <Image src="/MGLLogoGreen.png" alt="Logo" width={90} height={90} />
          {attestationUID ? (
            <div>
              <h2 className="text-2xl pl-6">Thank you for your attestation!</h2>
              <p className="text-gray-600 pt-2 pl-6">Here are some contributions to review</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl pl-6">Welcome to Metrics Garden!</h2>
              <p className="text-gray-600 pt-2 pl-6">Select a contribution to review</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="text-black hover:text-gray-600 pr-6 transform -translate-y-10">
          <FaTimes size={16} />
        </button>
      </div>
      <div className={attestationUID ? "pl-12 pr-12 pt-4 relative" : "p-12 relative"}>
          {renderAttestationConfirmation()}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading contributions...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : contributions.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No contributions found for this category.</p>
            </div>
          ) : (
            <div className="flex space-x-8 overflow-x-auto p-4">

              {contributions.map((contribution, index) => (
                <div key={index} className="flex-shrink-0 w-56 h-88 bg-white rounded-md p-4 flex flex-col items-center shadow-md">
                <div className="flex flex-col items-center p-1">
                  <div className="w-48 h-28 mb-4 overflow-hidden rounded-lg">
                    <Image 
                      src={contribution.logoUrl || "/placeholder-logo.png"} 
                      alt={contribution.projectName} 
                      width={100} 
                      height={100} 
                      className="w-full h-full object-contain"  // Make sure the image stays within the container
                    />
                  </div>
                  <h3 className="text-center text-sm font-semibold w-full truncate">{contribution.projectName}</h3>
                  {contribution.projectName !== contribution.contribution && (
                    <h4 className="text-center text-xs mt-1 w-full truncate">{contribution.contribution}</h4>
                  )}
                  <p className="text-xs text-gray-600 mt-2 mb-3 text-center w-48 truncate">{contribution.subcategory}</p>
                  <p className="text-xs mb-4 text-center w-48 line-clamp-2 truncate">{contribution.desc}</p>
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
          )}
          
          {totalPages > 1 && (
            <>
              <button 
                onClick={prevPage} 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={20} />
              </button>
              <button 
                onClick={nextPage} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                disabled={currentPage === totalPages}
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>
        {totalPages > 0 && (
          <div className="flex justify-center pb-2 space-x-2 h-1/10">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentPage - 1 ? 'bg-gray-800' : 'bg-gray-300'}`}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}
          </div>
        )}
        
        {isModalOpen &&  selectedContribution && selectedProject && (
        <AttestationModal2 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            contribution={selectedContribution}
            project={selectedProject}
          />
        )}
    </div>
    </div>
  );
};


export default ReviewCarousel;