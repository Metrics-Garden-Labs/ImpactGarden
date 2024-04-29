import SearchProjects from "./searchProjects";
import ProjectList1 from "./projectList1";
import Navbar from "../components/navbar";
import { Project } from '@/src/types'
import { NEXT_PUBLIC_URL } from '@/src/config/config'

  
  interface Props {
    searchParams?: {
      query?: string;
      filter?: string;
      walletAddress?: string;
      endpoint?: string;
    };
  }

const ProjectPage = async ({ searchParams }: Props) => {
  const query = searchParams?.query || '';
  const filter = searchParams?.filter || '';
  const walletAddress = searchParams?.walletAddress || '';
  const endpoint = searchParams?.endpoint || '';
  console.log("Wallet Address", walletAddress);
  console.log("Endpoint", endpoint);

  const res = await fetch(`${NEXT_PUBLIC_URL}/api/getProjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress, endpoint }),
    });
    if (!res.ok) {
      console.error('Failed to fetch projects:', res.statusText);
      return;
    } else {
      const projects: Project[] = await res.json();
      console.log("Projects", projects);
  

      return (
        <div>
          <Navbar />
          <h1>Search Projects Here:</h1>
          <SearchProjects />
          <ProjectList1 projects={projects} query={query} filter={filter} walletAddress={walletAddress} endpoint={endpoint} />
        </div>
      );
    }
};

export default ProjectPage;