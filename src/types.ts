export interface Project {
  id: number;
  createdAt: Date | null;
  userFid: string;
  ethAddress: string;
  projectName: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
}

export interface Contribution {
  id?: number;
  userFid: string;
  projectName: string;
  contribution: string;
  desc: string;
  link: string;
  ethAddress?: string;
  createdAt?: Date | null;
}
