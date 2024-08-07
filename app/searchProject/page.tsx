import { Project, SearchResult } from '../../src/types';
import { getProjects } from '../../src/lib/db/dbprojects';
import ProjectPageClient from './ProjectPageClient';
import { Metadata } from 'next';

interface Props {
  searchParams?: {
    query?: string;
    filter?: string;
    sortOrder?: string;
    searchResults?: SearchResult[];
  };
}

export const metadata: Metadata = {
  title: "Metrics Garden Labs - Search Projects",
};

const ProjectPage = async ({ searchParams }: Props) => {
  const query = searchParams?.query || '';
  const filter = searchParams?.filter || '';
  const sortOrder = searchParams?.sortOrder || 'asc';

  console.log('Received search parameters:', searchParams);

  try {
    const projects: Project[] = await getProjects(filter);
    console.log('Projects retrieved successfully:', projects);
    console.log('Received sortOrder in ProjectPage:', sortOrder);
    console.log("filter:", filter);


    return (
      <ProjectPageClient
        projects={projects}
        query={query}
        filter={filter}
        sortOrder={sortOrder}
        searchResults={searchParams?.searchResults || []}
      />
    );
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return (
      <ProjectPageClient
        projects={[]}
        query={query}
        filter={filter}
        sortOrder={sortOrder}
        searchResults={[]}
        error="Failed to fetch projects"
      />
    );
  }
};

export default ProjectPage;
