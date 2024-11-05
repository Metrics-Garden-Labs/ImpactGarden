import React from "react";
import Image from "next/image";

export interface BadgeDisplayProps {
  isCoinbaseVerified?: boolean;
  isOpBadgeholder?: boolean;
  isPowerBadgeholder?: boolean;
  isDelegate?: boolean;
  s4Participant?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  isCoinbaseVerified,
  isOpBadgeholder,
  isPowerBadgeholder,
  isDelegate,
  s4Participant,
}) => {
  return (
    <span className="flex items-center space-x-1 ml-2">
      {isCoinbaseVerified && (
        <span className="tooltip" data-tip="Coinbase Verified Wallet">
          <Image
            src="/coinbaseWallet.png"
            alt="Coinbase Wallet Badge"
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
        </span>
      )}
      {isOpBadgeholder && (
        <span className="tooltip" data-tip="OP Badgeholder">
          <Image src="/badgeholder.svg" alt="OP Badge" width={20} height={20} />
        </span>
      )}
      {isPowerBadgeholder && (
        <span className="tooltip" data-tip="Warpcast Power User">
          <Image
            src="/powerBadge.png"
            alt="Warpcast Power Badge"
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
        </span>
      )}
      {isDelegate && (
        <span className="tooltip" data-tip="Optimism Delegate">
          <Image
            src="/opDelegate.png"
            alt="Optimism Delegate Badge"
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
        </span>
      )}
      {s4Participant && (
        <span className="tooltip" data-tip="Season 4 Participant">
          <Image
            src="/s-4grantparticipants.png"
            alt="Season 4 Participant Badge"
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
        </span>
      )}
    </span>
  );
};
