import React, { useState } from "react";
import Link from "next/link";
import { AttestationNetworkType, Contribution, Project } from "@/src/types";

interface AttestationConfirmationModalProps {
  attestationUID: string;
  attestationType: Project | Contribution | null;
  setAttestationUID: (uid: string) => void;
  easScanEndpoints: { [key: string]: string };
  onClose?: () => void;
}

const AttestationConfirmationModal: React.FC<
  AttestationConfirmationModalProps
> = ({
  attestationUID,
  attestationType,
  setAttestationUID,
  easScanEndpoints,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md sm:w-4/5 sm:max-w-lg md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center text-black ">
          Review Completed!
        </h2>
        <p className="text-center text-black">
          {" "}
          Thank you for reviewing this project
        </p>
        {""}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-[#424242] text-white rounded-md"
            onClick={handleClose}
          >
            Review other Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttestationConfirmationModal;
