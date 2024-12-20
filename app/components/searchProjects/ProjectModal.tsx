import React, {
  useState,
  useEffect,
  PropsWithoutRef,
  Component,
  ComponentProps,
} from "react";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import {
  Contribution,
  ContributionWithProjectsAndAttestationCount,
  Project,
} from "../../../src/types";
import { formatOneliner } from "../../../src/utils/fomatOneliner";
import AttestationModal2 from "../projects/AttestationModal2";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { cn } from "@/src/lib/helpers";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  project: Project | null;
  checkwebsiteUrl: (url: string) => string;
  contribution: ContributionWithProjectsAndAttestationCount | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  contribution,
  checkwebsiteUrl,
}) => {
  const [activeTab, setActiveTab] = useState<"description" | "rating">(
    "description"
  );
  const [isLongDescription, setIsLongDescription] = useState(false);

  const DESCRIPTION_PREVIEW_LENGTH = 300;

  const description = contribution?.description || "";

  const toggleLongDescription = () => {
    setIsLongDescription(!isLongDescription);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("description");
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <div
        className="relative m-auto sm:p-4 bg-white rounded-lg shadow-lg max-w-4xl w-5/6 md:w-2/3 lg:w-2/5 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center pt-8 p-2">
          <h2 className="text-xl font-bold mb-4">{project.projectName}</h2>
        </div>
        {/* Tabs */}
        <div className="flex justify-center w-full space-x-4 mb-4">
          <button
            className={`font-semibold w-full border-b-2 pb-2 ${
              activeTab === "description"
                ? "text-black border-black"
                : "text-gray-500 border-black/30"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`font-semibold w-full border-b-2 pb-2 ${
              activeTab === "rating"
                ? "text-black  border-black"
                : "text-gray-500 border-black/30"
            }`}
            onClick={() => setActiveTab("rating")}
          >
            Rate
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="mb-4 items-center py-3">
            <h3 className="font-semibold text-center">Description</h3>
            <p
              className={`text-left font-sm text-[#A6A6A6] leading-relaxed 
              ${isLongDescription ? "" : "line-clamp-6"}`}
            >
              {formatOneliner(description)}
            </p>
            {description.length > DESCRIPTION_PREVIEW_LENGTH && (
              <div className="flex justify-center">
                <button
                  onClick={toggleLongDescription}
                  className="mt-2 text-gray-600 text-center hover:text-black text-sm flex items-center gap-1"
                >
                  {isLongDescription ? (
                    <>
                      Show less <IoIosArrowUp />
                    </>
                  ) : (
                    <>
                      Show more <IoIosArrowDown />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <ProjectReview
            isOpen={activeTab === "rating"}
            onClose={() => {
              setActiveTab("description");
              onClose();
            }}
            onSubmit={onSubmit}
            project={project}
            contribution={contribution}
          />
        )}

        {project.websiteUrl && activeTab === "description" && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Website</h3>
            <p className="text-left font-sm text-[#A6A6A6] leading-relaxed overflow-wrap break-words max-w-full mx-auto truncate">
              <Link
                target="_blank"
                href={`${checkwebsiteUrl(project.websiteUrl)}`}
              >
                <span className="text-left font-sm text-[#A6A6A6] leading-relaxed hover:text-[#2C3F2D] visited:text-indigo-600">
                  {project.websiteUrl}
                </span>
              </Link>
            </p>
          </div>
        )}
        {project.twitterUrl && activeTab === "description" && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Twitter</h3>
            <p className="text-left font-sm text-[#A6A6A6] hover:text-[#2C3F2D] leading-relaxed">
              <Link
                href={project.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.twitterUrl}
              </Link>
            </p>
          </div>
        )}
        {project.githubUrl && activeTab === "description" && (
          <div className="mb-4">
            <h3 className="font-semibold text-center">Github</h3>
            <p className="text-left font-sm text-[#A6A6A6] hover:text-[#2C3F2D] leading-relaxed">
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.githubUrl}
              </Link>
            </p>
          </div>
        )}

        {activeTab === "description" && (
          <div className="mb-4 text-center">
            <Link
              href={`/projects/${encodeURIComponent(
                project?.primaryprojectuid || ""
              )}`}
            >
              <button className="btn bg-[#353436] text-white hover:text-black">
                View Project Profile
              </button>
            </Link>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4"
        >
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const ProjectReview = ({
  className,
  ...props
}: ComponentProps<typeof AttestationModal2>) => {
  console.debug({
    props,
    metricsData: 1,
  });
  return (
    <AttestationModal2
      {...props}
      className={cn(
        "relative w-full block [&_.Content]:overflow-visible bg-white [&_.Content]:shadow-none [&_.Content]:max-h-none [&_.Content]:!w-full [&_.Content]:!m-0",
        className
      )}
    />
  );
};

export default ProjectModal;
