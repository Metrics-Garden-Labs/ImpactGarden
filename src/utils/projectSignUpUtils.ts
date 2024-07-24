import { AttestationNetworkType, CategoryKey } from "../types";
import { getChainId } from "./networkContractAddresses";
import { useSwitchChain } from "wagmi";

export const networks: AttestationNetworkType[] = [
  "Ethereum",
  "Optimism",
  "Base",
  "Arbitrum One",
  "Polygon",
  "Scroll",
  "Celo",
  "Blast",
  "Linea",
];

// export const categories1: { [key in CategoryKey]: string } = {
//   CeFi: "CeFi",
//   Crosschain: "Crosschain",
//   DeFi: "DeFi",
//   Governance: "Governance",
//   NFT: "NFT",
//   Social: "Social",
//   Utilities: "Utilities",
// };

export const categories: { [key in CategoryKey]: string } = {
  "Infra & Tooling": "Infra & Tooling",
  "Governance Research & Analytics": "Governance Research & Analytics",
  "Collaboration & Onboarding": "Collaboration & Onboarding",
  "Governance Leadership": "Governance Leadership",
};

export const checkNetwork = async (
  selectedNetwork: AttestationNetworkType,
  switchChain: any
) => {
  if (selectedNetwork) {
    const chainId = getChainId(selectedNetwork);
    if (chainId) {
      try {
        await switchChain({ chainId });
      } catch (error) {
        console.error("Failed to switch network:", error);
        alert("Please switch to the correct network in your wallet.");
      }
    }
  }
};
