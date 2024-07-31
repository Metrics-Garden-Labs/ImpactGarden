export interface Project {
  id?: number | null;
  createdAt?: Date | null;
  userFid: string | null;
  ethAddress?: string;
  ecosystem: string;
  projectName: string;
  // category: string | null;
  oneliner: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
  primaryprojectuid?: string | null;
  projectUid: string | null;
}

export interface ProjectCount extends Project {
  attestationCount: number; // Explicitly typing attestationCount as number
  averageRating: number; // Explicitly typing averageRating as number
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
  easUid: string | null;
  ethAddress: string | null;
  createdAt?: Date | null;
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
  | "Governance Leadership";

export type higherCategoryKey =
  | "Developer Tooling"
  | "Governance"
  | "Onchain Builders"
  | "OP Stack";

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

export interface GovernanceInfraAndToolingAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  likely_to_recommend: string;
  feeling_if_didnt_exist: string;
  explanation: string;
  private_feedback: string;
  createdAt?: Date;
}

export interface GovernanceRandAAttestation {
  userfid: string;
  ethaddress: string;
  projectName: string;
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
  category: string;
  subcategory: string;
  ecosystem: string;
  attestationUID: string;
  governance_knowledge: string;
  recommend_contribution: string;
  feeling_if_didnt_exist: string;
  explanation: string;
  private_feedback: string;
  createdAt?: Date;
}

// NewContributionAttestation will act as a union type
export type NewContributionAttestationGov =
  | GovernanceInfraAndToolingAttestation
  | GovernanceRandAAttestation
  | GovernanceCollabAndOnboardingAttestation;

//these are the types that will hopefully work for displaying the attestations on the contribution page
export interface GovInfraAndToolingDisplay
  extends GovernanceInfraAndToolingAttestation {
  username: string;
  pfp: string | null;
}

export interface GovRandADisplay extends GovernanceRandAAttestation {
  username: string;
  pfp: string | null;
}

export interface GovCollabAndOnboardingDisplay
  extends GovernanceCollabAndOnboardingAttestation {
  username: string;
  pfp: string | null;
}

export type AttestationDisplay =
  | GovInfraAndToolingDisplay
  | GovRandADisplay
  | GovCollabAndOnboardingDisplay
  | ContributionAttestationWithUsername;
