import React, { useState } from "react";
import { ProjectReview } from "../../searchProjects/ProjectModal";
import { cn } from "@/src/lib/helpers";
import { METRIC_GARDEN_LABS } from "./constants";
import { RxCross2 } from "react-icons/rx";

const RateUserExperienceModal = ({ onClose }: { onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenReview, setIsOpenReview] = useState(false);

  function handleClose() {
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50",
        isOpenReview && "[&_.description]:hidden [&_.heading]:hidden"
      )}
    >
      <div className="bg-white relative p-8 max-h-[90vh] overflow-auto rounded-lg shadow-lg w-full max-w-md sm:w-4/5 sm:max-w-lg md:w-1/2 lg:w-1/3">
        <button
          className="absolute top-4 right-4 text-black hover:text-gray-800"
          onClick={handleClose}
        >
          <RxCross2 className="h-6  w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-black ">
          Rate your experience 😀
        </h2>

        {isOpenReview ? (
          <h3 className="font-semibold text-center text-black">
            How likely are you to recommend Impact Garden to someone in your
            role or position as part of OP Governance?
          </h3>
        ) : (
          <p className="text-center text-black">
            Please rate your experience using {""}
			<strong >
			Impact Garden
				</strong> 
          </p>
        )}

        {isOpenReview ? (
          <ProjectReview
            contribution={METRIC_GARDEN_LABS.contribution as any}
            project={METRIC_GARDEN_LABS.project as any}
            onClose={handleClose}
            isOpen
          />
        ) : (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpenReview(true)}
              className="px-4 py-2 my-4 bg-[#424242] text-white rounded-md"
            >
              Rate Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateUserExperienceModal;
