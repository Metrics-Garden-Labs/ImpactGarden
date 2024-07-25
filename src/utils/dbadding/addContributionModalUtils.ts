import { AttestationNetworkType, Contribution, Project } from "@/src/types";

export type Category =
  | "Governance"
  | "Onchain Builders"
  | "Developer Tooling"
  | "OP Stack"
  | "";
export type Subcategory =
  | "Infra & Tooling"
  | "Governance Research & Analytics"
  | "Collaboration & Onboarding"
  | "Governance Leadership"
  | "CeFi"
  | "Crosschain"
  | "DeFi"
  | "Governance"
  | "NFT"
  | "Social"
  | "Utilities"
  | "Undefined"
  | "Waiting for Update"
  | "Ethereum Core Contributions"
  | "OP Stack Research and Development"
  | "OP Stack Tooling"
  | "Other";

export const subcategoryMap: Record<Category, Subcategory[]> = {
  Governance: [
    "Infra & Tooling",
    "Governance Research & Analytics",
    "Collaboration & Onboarding",
    "Governance Leadership",
  ],
  "Onchain Builders": [
    "CeFi",
    "Crosschain",
    "DeFi",
    "Governance",
    "NFT",
    "Social",
    "Utilities",
  ],
  "Developer Tooling": ["Undefined", "Waiting for Update"],
  "OP Stack": [
    "Ethereum Core Contributions",
    "OP Stack Research and Development",
    "OP Stack Tooling",
  ],
  "": [],
};

export const getSubcategories = (category: Category): Subcategory[] => {
  return subcategoryMap[category] || [];
};

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

export const higherCategories: { [key in Category]: string } = {
  "Developer Tooling": "Developer Tooling",
  Governance: "Governance",
  "Onchain Builders": "Onchain Builders",
  "OP Stack": "OP Stack",
  "": "",
};
