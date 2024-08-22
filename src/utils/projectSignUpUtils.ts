import {
  AttestationNetworkType,
  DeveloperToolingCategoryKey,
  GovernanceCategoryKey,
  OPStackCategoryKey,
  OnchainBuildersCategoryKey,
  higherCategoryKey,
} from "../types";
import { getChainId } from "./networkContractAddresses";

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

export const higherCategories: { [key in higherCategoryKey]: string } = {
  // "Developer Tooling": "Developer Tooling",
  Governance: "Governance",
  "Onchain Builders": "Onchain Builders",
  "OP Stack": "OP Stack",
};

export const governanceCategories: { [key in GovernanceCategoryKey]: string } =
  {
    "Infra & Tooling": "Infra & Tooling",
    "Governance Research & Analytics": "Governance Research & Analytics",
    "Collaboration & Onboarding": "Collaboration & Onboarding",
    "OP Governance Structure": "OP Governance Structure",
  };

export const onchainBuildersCategories: {
  [key in OnchainBuildersCategoryKey]: string;
} = {
  CeFi: "CeFi",
  Crosschain: "Crosschain",
  DeFi: "DeFi",
  Governance: "Governance",
  NFT: "NFT",
  Social: "Social",
  Utilities: "Utilities",
};

export const opStackCategories: { [key in OPStackCategoryKey]: string } = {
  "Ethereum Core Contributions": "Ethereum Core Contributions",
  "OP Stack Research and Development": "OP Stack Research and Development",
  "OP Stack Tooling": "OP Stack Tooling",
};

export const developerToolingCategories: {
  [key in DeveloperToolingCategoryKey]: string;
} = {
  Undefined: "Undefined",
  "Waiting for Update": "Waiting for Update",
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
