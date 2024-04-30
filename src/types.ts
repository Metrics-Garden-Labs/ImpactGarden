export interface Project {
  id: number;
  createdAt: Date | null;
  userFid: string;
  ethAddress: string;
  ecosystem: string;
  projectName: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
  projectUid: string;
}

export interface Contribution {
  id?: number;
  userFid: string;
  projectName: string;
  contribution: string;
  ecosystem: string;
  desc: string;
  link: string;
  easUid?: string | null | undefined;
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

export interface NewContribution {
  id: number;
  userFid: string;
  projectName: string;
  contribution: string;
  desc: string;
  link: string;
  ecosystem: string;
  easUid?: string;
  ethAddress: string;
  createdAt: Date;
}

export interface NewUser {
  fid: string;
  username: string;
  ethaddress?: string;
  id?: number;
  createdAt?: Date;
}
