// ContributionList.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  ContributionWithProjectsAndAttestationCount,
  Project,
} from "@/src/types";
import Image from "next/image";
import useLocalStorage from "@/src/hooks/use-local-storage-state";
import SpinnerIcon from "../ui/spinnermgl/mglspinner";
import Mgltree from "../ui/spinnermgl/mgltree";
import useSWR from "swr";
import { getUserAttestations } from "./actions";
import ProjectModal from "./ProjectModal";

interface Props {
  contributions: ContributionWithProjectsAndAttestationCount[];
  query: string;
  filter: string;
  sortOrder: string;
  projects?: Project[];
}

const ContributionList: React.FC<Props> = ({
  contributions,
  query,
  filter,
  sortOrder,
  projects = [],
}) => {
  const [user, setUser, removeUser] = useLocalStorage("user", {
    fid: "",
    username: "",
    ethAddress: [],
  });
  const { fid } = user;
  const [selectedContribution, setSelectedContribution] =
    useState<ContributionWithProjectsAndAttestationCount | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleContributions, setVisibleContributions] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(0);

  const project = projects.find(
    (project) => project.projectUid === selectedContribution?.projectUid
  );

  //console.debug({ selectedContribution, project });
  console.debug({ visibleContributions, contributions });

  const { data: userAttestations = [] } = useSWR(
    fid ? `user-data-${fid}` : null,
    async () => {
      const result = await getUserAttestations(fid);
      return result;
    }
  );

  const openModal = (
    contribution: ContributionWithProjectsAndAttestationCount
  ) => {
    scrollPositionRef.current = window.scrollY; // Save the scroll position
    setSelectedContribution(contribution);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    window.scrollTo(0, scrollPositionRef.current); // Restore the scroll position
  };

  // Disable scroll when modal is open
  useEffect(() => {
    const handleScrollLock = () => {
      if (modalOpen) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
      } else {
        const scrollY = scrollPositionRef.current;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      }
    };

    handleScrollLock();

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [modalOpen]);

  // Set isFiltering to true when sortOrder or filter changes
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 1000); // Simulating a delay for filtering
    return () => clearTimeout(timer);
  }, [sortOrder, filter]);

  // Filter contributions based on query
  const filteredContributions = (() => {
    return contributions.filter((contribution) => {
      if (
        query &&
        !contribution.contribution
          ?.toLowerCase()
          .includes(query.toLowerCase()) &&
        !contribution.projectName?.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  })();

  // Sort contributions
  const sortedContributions = useMemo(() => {
    let sorted = [...filteredContributions];
    switch (sortOrder) {
      case "Most Attested":
        sorted.sort((a, b) => {
          return (b.attestationCount || 0) - (a.attestationCount || 0);
        });
        break;
      case "Recently Added":
        sorted.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
      case "Z-A":
        sorted.sort((a, b) =>
          (b.contribution || "").localeCompare(
            a.contribution || "",
            undefined,
            {
              sensitivity: "base",
            }
          )
        );
        break;
      case "A-Z":
      default:
        sorted.sort((a, b) =>
          (a.contribution || "").localeCompare(
            b.contribution || "",
            undefined,
            {
              sensitivity: "base",
            }
          )
        );
    }
    return sorted;
  }, [filteredContributions, sortOrder]);

  // Load more contributions when scrolling
  const loadMoreContributions = () => {
    if (
      !isLoading &&
      visibleContributions < sortedContributions.length &&
      !isFiltering
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleContributions((prev) => prev + 12);
        setIsLoading(false);
      }, 350); // Simulating a delay for smoother loading
    }
  };

  useEffect(() => {
    const currentTarget = observerTarget.current; // Get the current target

    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.debug("Intersecting", entries[0]);
          loadMoreContributions();
        }
      },
      { threshold: 0.5 }
    );

    if (currentTarget) {
      observer.observe(currentTarget); // Observe only if currentTarget is defined
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget); // Cleanup unobserving
      }
    };
  });

  const urlHelper = (url: string) => {
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  const isReviewedContribution = (projectName: string) => {
    return userAttestations.some(
      (attestation) =>
        attestation.projectName?.toLocaleLowerCase() ===
        projectName.toLocaleLowerCase()
    );
  };

  return (
    <div className="bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-4 mx-3 md:grid-cols-3 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {isFiltering
          ? Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col p-6 border justify-center items-center bg-gray-100 animate-pulse rounded-md w-full h-66 shadow-xl"
              >
                <div className="rounded-md bg-gray-300 w-24 h-24 mb-4"></div>
                <div className="w-36 h-4 bg-gray-300 mb-2"></div>
                <div className="w-24 h-4 bg-gray-300"></div>
              </div>
            ))
          : sortedContributions
              .slice(0, visibleContributions)
              .map((contribution) => {
                const isReviewed = isReviewedContribution(
                  contribution.projectName || ""
                );

                return (
                  <div
                    key={contribution.id}
                    className="flex flex-col relative px-6 py-8 border justify-center items-center bg-white text-black border-gray-300 rounded-md w-full h-66 shadow-xl"
                  >
                    <div className="rounded-md bg-gray-300 w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
                      {contribution.projectLogoUrl ? (
                        <Image
                          src={contribution.projectLogoUrl}
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
                    {isReviewed && (
                      <div className="absolute pt-1 pb-16 top-0 bg-white/75 left-0 right-0 bottom-20 flex items-center justify-center">
                        <Image
                          src="/reviewed_stamp.svg"
                          alt="Reviewed Stamp"
                          width={64}
                          height={64}
                          className="object-cover size-36 backdrop-blur-[2px]"
                        />
                      </div>
                    )}
                    <h3 className="mb-2 text-xl pt-4 font-semibold truncate max-w-full">
                      {contribution.contribution}
                    </h3>
                    <p className="mb-2 text-md text-gray-500 text-center truncate max-w-full">
                      {contribution.desc}
                    </p>
                    {sortOrder === "Most Attested" &&
                      contribution.attestationCount !== undefined &&
                      Number(contribution.attestationCount) > 0 && (
                        <p className="mb-2 text-md text-gray-500 text-center truncate max-w-full">
                          Attestations: {contribution.attestationCount}
                        </p>
                      )}
                    <button
                      onClick={() => openModal(contribution)}
                      className="btn btn-primary px-6 py-1 mt-2 bg-[#424242] cursor-pointer text-white font-thin rounded-md hover:bg-black"
                    >
                      {isReviewed ? "View" : "Review"}
                    </button>
                  </div>
                );
              })}
      </div>

      {/* Only show the load more button if there are more contributions to load */}
      <div className="flex justify-center my-8">
        {isLoading ? (
          <div className="flex justify-center items-center mb-6 mt-6">
            <SpinnerIcon className="spinner w-16 h-16" />
            <Mgltree className="absolute w-12 h-12" />
          </div>
        ) : (
          visibleContributions < sortedContributions.length && (
            <button
              onClick={loadMoreContributions}
              className="btn btn-primary px-6 py-2 bg-black text-white font-bold rounded-md hover:bg-white hover:text-black"
            >
              Load More
            </button>
          )
        )}
      </div>
      <div
        ref={observerTarget}
        className="flex h-px w-full justify-center py-10"
      />
      {/* Render the modal if you have one */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        project={project || null}
        contribution={selectedContribution}
        checkwebsiteUrl={urlHelper}
      />
    </div>
  );
};

export default ContributionList;
