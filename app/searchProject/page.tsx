import SearchProjects from "./searchProjects";
import ProjectList1 from "./projectList1";
import Navbar from "../components/navbar";
import { Project } from '@/src/types'

  
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

  const res = await fetch('http://localhost:3001/api/getProjects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress, endpoint }),
    });
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
};

export default ProjectPage;