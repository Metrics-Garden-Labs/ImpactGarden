import SearchProjects from "./searchProjects";
import ProjectList from "./projectList";
import Navbar from "../components/navbar";

const ProjectPage = ({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      filter?: string;
      walletAddress?: string;
      endpoint?: string;
    };
  }) => {
    const query = searchParams?.query?.toString() || '';
    const filter = searchParams?.filter?.toString() || '';
    const walletAddress = searchParams?.walletAddress?.toString() || '';
    const endpoint = searchParams?.endpoint?.toString() || '';

  return (
    <div>
        <Navbar />
        <h1>Search Projects Here:</h1>
        <SearchProjects />
        <ProjectList query={query} filter={filter} walletAddress={walletAddress} endpoint={endpoint}/>
    </div>
  )
}

export default ProjectPage