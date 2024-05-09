export interface Project {
  id?: number | null;
  createdAt?: Date | null;
  userFid: string;
  ethAddress?: string;
  ecosystem: string;
  projectName: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
  projectUid: string | null;
}

export interface Contribution {
  id?: number;
  userFid: string;
  projectName: string;
  contribution: string;
  ecosystem: string;
  desc: string;
  link: string;
  easUid: string | null;
  ethAddress?: string;
  createdAt?: Date | null;
}

export interface NewProject {
  userFid: string;
  ethAddress: string;
  projectName: string;
  websiteUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  id?: number;
  ecosystem: string;
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
  id: number;
  userFid: string;
  projectName: string;
  contribution: string;
  desc: string;
  link: string;
  ecosystem: string;
  easUid: string;
  ethAddress: string;
  createdAt: Date;
}

export interface NewUser {
  fid: string;
  username: string;
  ethaddress?: string;
  pfp_url?: string;
  id?: number;
  createdAt?: Date;
}

export type User = {
  id: number;
  fid: string;
  username: string;
  pfp_url: string | null;
  ethaddress: string | null;
  createdAt: Date | null;
};

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
  attestationType: string;
  feedback: string | null;
  createdAt: Date;
}

export interface ContributionAttestation {
  id: number;
  userFid: string;
  projectName: string | undefined;
  contribution: string;
  ecosystem: string | undefined;
  attestationUID: string;
  attesterAddy: string;
  attestationType: string;
  feedback: string | null;
  createdAt: Date;
}

export type Attestation = {
  id: number;
  userFid: string;
  projectName: string;
  contribution: string;
  ecosystem: string;
  attestationUID: string;
  attesterAddy: string;
  attestationType: string;
  feedback: string | null;
  createdAt: Date | null;
};

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

export type AttestationData = {
  projectName: string;
  websiteUrl: string;
  twitterUrl: string;
  githubURL: string;
};

export interface ContributionAttestationWithUsername
  extends ContributionAttestation {
  username: string;
}
