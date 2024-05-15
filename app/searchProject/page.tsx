// app/projects/page.tsx

import { Project, SearchResult } from '../../src/types';
import { getProjects } from '../../src/lib/db';
import ProjectPageClient from './ProjectPageClient';


interface Props {
  searchParams?: {
    query?: string;
    filter?: string;
    walletAddress?: string;
    endpoint?: string;
    sortOrder?: string;
    searchResults?: SearchResult[];
  };
}

const ProjectPage = async ({ searchParams }: Props) => {
  const query = searchParams?.query || '';
  const filter = searchParams?.filter || '';
  const walletAddress = searchParams?.walletAddress || '';
  const endpoint = searchParams?.endpoint || '';
  const sortOrder = searchParams?.sortOrder || 'asc';

  try {
    const projects: Project[] = await getProjects(walletAddress, endpoint);
    console.log("Projects", projects);

    return <ProjectPageClient
      projects={projects}
      query={query}
      filter={filter}
      walletAddress={walletAddress}
      endpoint={endpoint}
      sortOrder={sortOrder}
      searchResults={searchParams?.searchResults || []}
    />;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Handle the error, display an error message, or return a fallback UI
    return <ProjectPageClient
      projects={[]}
      query={query}
      filter={filter}
      walletAddress={walletAddress}
      endpoint={endpoint}
      sortOrder={sortOrder}
      searchResults={[]}
    />;
  }
};

export default ProjectPage;