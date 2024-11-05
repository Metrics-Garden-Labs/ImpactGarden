import React, { useState } from "react";
import {
  AttestationDisplay,
  AttestationNetworkType,
  GovCollabAndOnboardingDisplay,
  GovInfraAndToolingDisplay,
  GovRandADisplay,
  GovStructuresDisplay,
  OPStackDisplay,
  OnchainBuildersDisplay,
  Project,
} from "@/src/types";
import Image from "next/image";
import { format } from "date-fns";
import { easScanEndpoints } from "@/src/utils/easScan";
import { renderStars10, renderStars5 } from "../ui/RenderStars";
import UserBadges, {
  useUserBadges,
  type BadgeDisplayProps,
} from "../ui/UserBadges";

interface ContributionAttestationsProps {
  recentAttestations: AttestationDisplay[];
  recentAttestationsLoading: boolean;
  handleAttestationClick: (attestation: AttestationDisplay) => void;
  project: Project;
}

function isGovRandADisplay(
  attestation: AttestationDisplay
): attestation is GovRandADisplay {
  return (
    (attestation as GovRandADisplay).useful_for_understanding !== undefined
  );
}

function isGovCollabAndOnboardingDisplay(
  attestation: AttestationDisplay
): attestation is GovCollabAndOnboardingDisplay {
  return (
    (attestation as GovCollabAndOnboardingDisplay).governance_knowledge !==
    undefined
  );
}

function isGovInfraAndToolingDisplay(
  attestation: AttestationDisplay
): attestation is GovInfraAndToolingDisplay {
  return (
    (attestation as GovInfraAndToolingDisplay).likely_to_recommend !== undefined
  );
}

function isGovStructuresOpDisplay(
  attestation: AttestationDisplay
): attestation is GovStructuresDisplay {
  return (
    (attestation as GovStructuresDisplay).examples_of_usefulness !== undefined
  );
}

function isOnchainBuildersDisplay(
  attestation: AttestationDisplay
): attestation is OnchainBuildersDisplay {
  return (
    (attestation as OnchainBuildersDisplay).recommend_contribution !== undefined
  );
}

function isOPStackDisplay(
  attestation: AttestationDisplay
): attestation is OPStackDisplay {
  return (attestation as OPStackDisplay).feeling_if_didnt_exist !== undefined;
}

const FILTERS = {
  all: "Show all",
  //coinbaseVerified: "Coinbase Verified",
  opBadgeholder: "OP Badgeholder",
  //powerBadgeholder: "Power Badgeholder",
  delegate: "Delegate",
  //s4Participant: "S4 Participant",
} as const;

type FilterKeys = keyof typeof FILTERS;

const FILTERS_KEYS = Object.keys(FILTERS).reduce(
  (acc, key) => ({
    ...acc,
    [key]: key,
  }),
  {} as Record<FilterKeys, FilterKeys>
);

const ContributionAttestations: React.FC<ContributionAttestationsProps> = ({
  recentAttestations,
  recentAttestationsLoading,
  handleAttestationClick,
  project,
}) => {
  const renderAttestationContent = (attestation: AttestationDisplay) => {
    if (isGovRandADisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Governance Research and Analytics</p> */}
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Would recommend:{" "}
            {renderStars10(Number(attestation.likely_to_recommend))}
          </p>
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Effective for Improvements:{" "}
            {renderStars5(Number(attestation.effective_for_improvements))}
          </p>
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Useful for Understanding:{" "}
            {renderStars5(Number(attestation.useful_for_understanding))}
          </p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovCollabAndOnboardingDisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Collaboration and Onboarding</p> */}
          <p className="text-sm text-gray-500 mb-2">
            Governance Knowledge: {attestation.governance_knowledge}
          </p>
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Would recommend:{" "}
            {renderStars10(Number(attestation.recommend_contribution))}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}
          </p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovInfraAndToolingDisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Infrastructure and Tooling</p> */}
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Would recommend:{" "}
            {renderStars10(Number(attestation.likely_to_recommend))}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}
          </p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovStructuresOpDisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          <p className="text-sm text-gray-500 mb-2">
            Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Examples of Usefulness: {attestation.examples_of_usefulness}
          </p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isOnchainBuildersDisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          <p className="text-sm text-gray-500 mb-2 flex gap-2">
            Recommendation:{" "}
            {renderStars10(Number(attestation.recommend_contribution))}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}
          </p>
        </>
      );
    }

    if (isOPStackDisplay(attestation)) {
      return (
        <>
          <p className="text-md text-black mb-2">{attestation.contribution}</p>
          <p className="text-sm text-gray-500 mb-2">
            Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}
          </p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    // Default case for generic attestations
    if ("feedback" in attestation) {
      return (
        <>
          {/* <p className='text-sm text-gray-500 mb-2'>Feedback: {attestation.feedback}</p> */}
          <p className="text-sm text-gray-500 mb-2">
            Rating: {attestation.rating}
          </p>
        </>
      );
    }

    return null;
  };

  const [filter, setFilter] = useState<FilterKeys>("all");

  return (
    <div className="text-black text-left">
      <div className="  w-full bg-[#F4D3C3]/30 my-4 gap-8 justify-between px-4 py-6 flex items-center">
        <h3 className="font-semibold mb-4">Insights</h3>
        <nav className="flex-grow flex justify-end ">
          <div className="relative w-48 sm:w-1/2 md:w-1/5">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as any);
              }}
              className="block w-full px-4 py-2 text-gray-900  border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-0 appearance-none"
            >
              {Object.entries(FILTERS).map(([key, label]) => {
                return (
                  <option key={`option-${key}`} value={key}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </nav>
      </div>
      {recentAttestationsLoading ? (
        <p>Loading...</p>
      ) : recentAttestations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
          {recentAttestations.map((attestation, index) => {
            return (
              <GetUserBadges
                fid={attestation.userFid}
                key={`attest-${attestation.attestationUID}`}
              >
                {(badge) => {
                  const isSelected = [
                    [FILTERS_KEYS.all, true],
                    //[FILTERS_KEYS.coinbaseVerified, badge?.isCoinbaseVerified],
                    [FILTERS_KEYS.delegate, badge?.isDelegate],
                    [FILTERS_KEYS.opBadgeholder, badge?.isOpBadgeholder],
                    //[FILTERS_KEYS.s4Participant, badge?.s4Participant],
                    //[FILTERS_KEYS.powerBadgeholder, badge?.isPowerBadgeholder],
                  ].some(([key, value]) => key === filter && value);

                  return isSelected ? (
                    <div
                      className="p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#F4D3C3]/20"
                      onClick={() => handleAttestationClick(attestation)}
                    >
                      <div className="flex items-start mb-2">
                        {attestation.pfp && (
                          <Image
                            src={attestation.pfp}
                            alt={attestation.username}
                            width={40}
                            height={40}
                            className="mr-2 size-10 block shrink-0 mt-2 shadow-black shadow-md border-[#F4D3C3] border-2 rounded-full"
                          />
                        )}
                        <div className=" ">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">
                              {attestation.username}
                            </h3>
                            <UserBadges fid={attestation.userFid} />
                          </div>
                          {renderAttestationContent(attestation)}
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(attestation.createdAt || ""),
                              "MMMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                }}
              </GetUserBadges>
            );
          })}
        </div>
      ) : (
        <p>No attestations yet.</p>
      )}
    </div>
  );
};

function GetUserBadges({
  fid,
  children,
}: {
  fid?: string;
  children: (badge: BadgeDisplayProps | null) => JSX.Element | null;
}) {
  const { data } = useUserBadges(fid);
  return children(data || null);
}

export default ContributionAttestations;
