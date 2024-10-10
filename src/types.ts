export interface Project {
  id?: number | null;
  createdAt?: Date | null;
  userFid: string | null;
  ethAddress?: string;
  ecosystem: string;
  projectName: string;
  // category: string | null;
  // link: string | null;
  oneliner: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
  primaryprojectuid?: string | null;
  projectUid: string | null;
}

export interface ProjectCount extends Project {
  attestationCount: number;
  // averageRating: number; not including the rating for now
}

export interface Contribution {
  id?: number;
  userFid: string;
  projectName: string;
  // primaryprojectuid?: string | null;
  contribution: string;
  category: string | null;
  subcategory: string | null;
  governancetype: string | null;
  ecosystem: string;
  secondaryecosystem: string | null;
  desc: string;
  link: string | null;
  primarycontributionuid: string | null;
  easUid: string | null;
  ethAddress: string | null;
  attestationCount?: number;
  createdAt?: Date | null;
  logoUrl?: string | null;
}

export interface ContributionWithAttestationCount extends Contribution {
  attestationCount?: number;
}

export interface ContributionWithProjectsAndAttestationCount
  extends Contribution {
  description?: string | null;
  projectLogoUrl: string | null;
  projectUid: string | null;
  primaryprojectuid: string | null;
  attestationCount?: number;
}

export interface ProjectWithAttestationCount extends Project {
  attestationCount?: number;
}

export interface NewProject {
  userFid: string | null;
  ethAddress: string;
  projectName: string;
  oneliner?: string;
  category?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  id: number;
  ecosystem: string;
  primaryprojectuid?: string;
  projectUid: string;
  logoUrl?: string;
  createdAt?: Date;
}

export interface SearchResult {
  address: string;
  fname: string;
  username: string;
  fid: string;
  score: number;
}

export interface NewContribution {
  id?: number;
  userFid: string;
  projectName: string;
  // primaryprojectuid?: string | null;
  contribution: string;
  governancetype?: string;
  category?: string;
  subcategory?: string;
  ecosystem: string;
  secondaryecosystem?: string;
  desc: string;
  link: string;
  primarycontributionuid: string;
  easUid: string | null;
  ethAddress: string;
  createdAt?: Date | null;
}

export interface NewUser {
  fid: string;
  username: string;
  ethaddress?: string;
  pfp_url?: string;
  id?: number;
  createdAt?: Date;
}

export interface User {
  id: number;
  fid: string;
  username: string;
  ethaddress: string | null;
  pfp_url: string | null;
  createdAt: Date | null;
}

export interface UserVerification {
  users: User;
  userAddresses: {
    coinbaseVerified: boolean | null;
    opBadgeholder: boolean | null;
    powerBadgeholder: boolean | null;
  } | null;
}

export type UserBadgeVerification = {
  users: {
    id: number;
    fid: string;
    username: string;
    pfp_url: string | null;
    ethaddress: string | null;
    createdAt: Date | null;
  };
  userAddresses: {
    coinbaseVerified: boolean | null;
    opBadgeholder: boolean | null;
    powerBadgeholder: boolean | null;
    isdelegate: boolean | null;
    s4participant: boolean | null;
  } | null;
};

export interface NewContributionAttestation {
  id: number;
  userFid: string;
  projectName: string;
  contribution: string;
  ecosystem: string;
  attestationUID: string;
  attesterAddy: string;
  feedback: string | null;
  isdelegate: boolean;
  rating: string;
  improvementareas: string | null;
  extrafeedback: string | null;
  createdAt: Date;
}

export interface ContributionAttestation {
  id: number;
  userFid: string;
  projectName: string;
  contribution: string;
  ecosystem: string;
  attestationUID: string | null;
  attesterAddy: string;
  feedback: string | null;
  isdelegate: boolean;
  rating: string;
  improvementareas: string | null;
  extrafeedback: string | null;
  createdAt: Date;
}

export interface Attestation {
  id: number;
  userFid: string;
  projectName: string | null;
  contribution: string;
  ecosystem: string;
  attestationUID: string;
  attesterAddy: string;
  feedback: string | null;
  isdelegate: boolean | null;
  rating: string | null;
  improvementareas: string | null;
  extrafeedback: string | null;
  createdAt: Date | null;
  logoUrl?: string | null;
}

export interface ProjectAttestations {
  id: number;
  userFid: string;
  username: string | null;
  projectName: string | null;
  pfp: string | null;
  contribution: string | null;
  ecosystem: string;
  attestationUID: string;
  attesterAddy?: string;
  feedback: string | null;
  isdelegate?: boolean | null;
  rating?: string | null;
  improvementareas?: string | null;
  extrafeedback?: string | null;
  category?: string;
  subcategory?: string;
  createdAt: Date | null;
  logoUrl?: string | null;
  likely_to_recommend?: string;
  examples_of_usefulness?: string;
  feeling_if_didnt_exist?: string;
  useful_for_understanding?: string;
  effective_for_improvements?: string;
  governance_knowledge?: string;
  governance_knowledge_number?: string;
  recommend_contribution?: string;
}

export interface Attestation2 {
  id: number;
  userFid: string;
  username?: string;
  pfp?: string;
  projectName: string;
  contribution: string | null;
  ecosystem: string;
  attestationUID: string;
  attesterAddy?: string;
  feedback: string | null;
  isdelegate?: boolean | null;
  rating?: string | null;
  improvementareas?: string | null;
  extrafeedback?: string | null;
  category?: string;
  subcategory?: string;
  createdAt: Date | null;
  logoUrl?: string | null;
  explanation?: string | null;
  likely_to_recommend?: string | null;
  feeling_if_didnt_exist?: string | null;
  feeling_if_didnt_exist_number?: string | null;
  useful_for_understanding?: string;
  examples_of_usefulness?: string;
  effective_for_improvements?: string;
  governance_knowledge?: string;
  governance_knowledge_number?: string;
  recommend_contribution?: string;
}
export type Attestation3 = {
  id: number;
  userFid: string;
  projectName: string;
  contribution: string | null;
  ecosystem: string;
  attestationUID: string;
  feedback: string | null;
  category: string | null;
  subcategory: string | null;
  createdAt: Date | null;
  logoUrl: string | null;
  likely_to_recommend: string | null | undefined;
  feeling_if_didnt_exist: string | null | undefined;
  feeling_if_didnt_exist_number?: string | null | undefined;
  useful_for_understanding: string | null | undefined;
  effective_for_improvements: string | null | undefined;
  governance_knowledge: string | null | undefined;
  governance_knowledge_number?: string | null | undefined;
  recommend_contribution: string | null | undefined;
  attesterAddy: string | null | undefined;
  isdelegate: boolean | null | undefined;
  improvementareas: string | null | undefined;
  extrafeedback: string | null | undefined;
  rating: string | null | undefined;
};

export interface Attestation4 {
  id: number;
  userFid: string;
  username?: string;
  pfp?: string;
  projectName: string | null;
  contribution: string | null;
  ecosystem: string;
  attestationUID: string;
  attesterAddy?: string;
  feedback: string | null;
  isdelegate?: boolean | null;
  rating?: string | null;
  improvementareas?: string | null;
  extrafeedback?: string | null;
  category?: string;
  subcategory?: string;
  createdAt: Date | null;
  logoUrl?: string | null;
  explanation?: string | null;
  likely_to_recommend?: string | null;
  feeling_if_didnt_exist?: string | null;
  feeling_if_didnt_exist_number?: string | null;
  useful_for_understanding?: string;
  examples_of_usefulness?: string;
  effective_for_improvements?: string;
  governance_knowledge?: string;
  governance_knowledge_number?: string;
  recommend_contribution?: string;
}
export interface userAddresses {
  id: number;
  userfid: string;
  ethAddress: string;
  addressorder: string;
  coinbaseverified: boolean;
  opbadgeholder: boolean;
  powerbadgeholder: boolean;
  createdat: Date | null;
}

export interface newUserAddresses {
  id: number;
  userfid: string;
  ethAddress: string;
  addressorder: string;
  coinbaseverified: boolean;
  opbadgeholder: boolean;
  powerbadgeholder: boolean;
  createdat: Date | null;
}

// Define type for insertion purposes
export type NewUserAddress = Omit<userAddresses, "id">;

//Attestation Network Type
export type AttestationNetworkType =
  | "Ethereum"
  | "Optimism"
  | "Base"
  | "Arbitrum One"
  | "Polygon"
  | "Scroll"
  | "Celo"
  | "Blast"
  | "Linea";

// Define a type for the contract addresses
export type ContractAddresses = {
  attestAddress: string;
  schemaRegistryAddress: string;
};

// export type AttestationData = {
//   projectName: string;
//   websiteUrl: string;
//   twitterUrl: string;
//   githubURL: string;
// };

export interface ContributionAttestationWithUsername
  extends ContributionAttestation {
  username: string;
  pfp: string | null;
  rating: string;
}

export interface OpDelegate {
  id?: number;
  address: string;
  twitter: string | null;
  createdAt?: Date;
}

export type AttestationData = {
  projectName: string;
  oneliner: string | "";
  websiteUrl: string;
  twitterUrl: string;
  // link: string;
  githubURL: string;
  category: string;
  farcaster: string;
  mirror: string;
};

export type AttestationData1 = {
  issuer: string;
  farcasterID: string;
  projectName: string;
  category: string;
  parentProjectRefUID: string;
  metadataType: string;
  metadataURL: string;
};

export type CategoryKey =
  | OnchainBuildersCategoryKey
  | GovernanceCategoryKey
  | OPStackCategoryKey
  | DeveloperToolingCategoryKey;

export type OnchainBuildersCategoryKey =
  | "CeFi"
  | "Crosschain"
  | "DeFi"
  | "Governance"
  | "NFT"
  | "Social"
  | "Utilities";

export type GovernanceCategoryKey =
  | "Infra & Tooling"
  | "Governance Research & Analytics"
  | "Collaboration & Onboarding"
  | "OP Governance Structure";

export type higherCategoryKey = "Governance" | "Onchain Builders" | "OP Stack";
// | "Developer Tooling";

export type OPStackCategoryKey =
  | "Ethereum Core Contributions"
  | "OP Stack Research and Development"
  | "OP Stack Tooling";

export type DeveloperToolingCategoryKey = "Undefined" | "Waiting for Update";

export type contributionRolesKey =
  | "OP Foundation Employee"
  | "Metagovernance Designer"
  | "Delegate"
  | "Delegate (Token Holder)"
  | "Badgeholder"
  | "Other"
  | "I do not actively participate in Optimism Governance";

export interface RatingScaleProps {
  rating: number;
  handleRating: (rate: number) => void;
}

export interface OnchainBuildersAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  recommend_contribution: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number: string;
  createdAt?: Date;
}

export interface OPStackAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number: string;
  explanation: string;
  createdAt?: Date;
}

export interface GovernanceInfraAndToolingAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  likely_to_recommend: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number: string;
  explanation: string;
  private_feedback: string;
  createdAt?: Date;
}

export interface GovernanceRandAAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  likely_to_recommend: string;
  useful_for_understanding: string;
  effective_for_improvements: string;
  explanation: string;
  private_feedback: string;
  createdAt?: Date;
}

export interface GovernanceCollabAndOnboardingAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  governance_knowledge: string;
  governance_knowledge_number: string;
  recommend_contribution: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number: string;
  explanation: string;
  private_feedback: string;
  createdAt?: Date;
}

export interface GovernanceStrucutresAttestation {
  userfid: string;
  ethAddress: string;
  projectName: string;
  contribution: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number: string;
  explanation: string;
  examples_of_usefulness: string;
  private_feedback: string;
  createdAt?: Date;
}

// NewContributionAttestation will act as a union type
export type NewContributionAttestationGov =
  | GovernanceInfraAndToolingAttestation
  | GovernanceRandAAttestation
  | GovernanceCollabAndOnboardingAttestation
  | GovernanceStrucutresAttestation
  | OnchainBuildersAttestation
  | OPStackAttestation;

//these are the types that will hopefully work for displaying the attestations on the contribution page
// export interface GovInfraAndToolingDisplay
//   extends GovernanceInfraAndToolingAttestation {
//   username: string;
//   pfp: string | null;
// }

// export interface GovRandADisplay extends GovernanceRandAAttestation {
//   username: string;
//   pfp: string | null;
// }

// export interface GovCollabAndOnboardingDisplay
//   extends GovernanceCollabAndOnboardingAttestation {
//   username: string;
//   pfp: string | null;
// }

// export type AttestationDisplay =
//   | GovInfraAndToolingDisplay
//   | GovRandADisplay
//   | GovCollabAndOnboardingDisplay
//   | ContributionAttestationWithUsername;

interface BaseAttestationDisplay {
  id: number; // Add this line
  userFid: string;
  username: string;
  pfp: string | null;
  createdAt: string | null;
  attestationUID: string;
  contribution: string;
  projectName: string;
  category: string;
  subcategory: string;
  ecosystem: string;
}

export interface OnchainBuildersDisplay extends BaseAttestationDisplay {
  recommend_contribution: string;
  feeling_if_didnt_exist: string;
  likely_to_recommend?: string | null;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
  useful_for_understanding?: string | null;
  effective_for_improvements?: string | null;
  feeling_if_didnt_exist_number?: string | null;
  explanation?: string;
  rating?: string;
  examples_of_usefulness?: string | null;
}

export interface OPStackDisplay extends BaseAttestationDisplay {
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number?: string | null;
  explanation: string;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
  useful_for_understanding?: string | null;
  effective_for_improvements?: string | null;
  recommend_contribution?: string | null;
  examples_of_usefulness?: string | null;
  likely_to_recommend?: string | null;
  rating?: string;
}

export interface GovStructuresDisplay extends BaseAttestationDisplay {
  explanation: string;
  examples_of_usefulness: string;
  feeling_if_didnt_exist_number?: string | null;
  recommend_contribution?: string | null;
  rating?: string;
  feeling_if_didnt_exist: string;
  likely_to_recommend?: string | null;
  useful_for_understanding?: string | null;
  effective_for_improvements?: string | null;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
}

export interface GovRandADisplay extends BaseAttestationDisplay {
  useful_for_understanding: string;
  effective_for_improvements: string;
  feeling_if_didnt_exist_number?: string | null;
  explanation: string;
  rating?: string;
  feeling_if_didnt_exist?: string | null;
  examples_of_usefulness?: string | null;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
  likely_to_recommend?: string | null;
  recommend_contribution?: string | null;
}

export interface GovCollabAndOnboardingDisplay extends BaseAttestationDisplay {
  governance_knowledge: string;
  governance_knowledge_number: string;
  recommend_contribution: string;
  feeling_if_didnt_exist: string;
  feeling_if_didnt_exist_number?: string | null;
  explanation: string;
  rating?: string;
  useful_for_understanding?: string | null;
  examples_of_usefulness?: string | null;
  effective_for_improvements?: string | null;
  likely_to_recommend?: string | null;
}

export interface GovInfraAndToolingDisplay extends BaseAttestationDisplay {
  likely_to_recommend: string;
  explanation: string;
  rating?: string;
  feeling_if_didnt_exist?: string | null;
  feeling_if_didnt_exist_number?: string | null;
  examples_of_usefulness?: string | null;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
  useful_for_understanding?: string | null;
  recommend_contribution?: string | null;
  effective_for_improvements?: string | null;
}

export interface GeneralAttestationDisplay extends BaseAttestationDisplay {
  feedback: string;
  rating: string;
  explanation?: string | null;
  likely_to_recommend?: string | null;
  examples_of_usefulness?: string | null;
  useful_for_understanding?: string | null;
  recommend_contribution?: string | null;
  governance_knowledge?: string | null;
  governance_knowledge_number?: string | null;
  effective_for_improvements?: string | null;
  feeling_if_didnt_exist?: string | null;
}

export type AttestationDisplay =
  | GovRandADisplay
  | GovCollabAndOnboardingDisplay
  | GovInfraAndToolingDisplay
  | GeneralAttestationDisplay
  | GovStructuresDisplay
  | OnchainBuildersDisplay
  | OPStackDisplay;

export interface CategoryData {
  categories: string[];
  subcategories: string[];
}
