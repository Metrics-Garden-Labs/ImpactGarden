
import SearchProjects from "./searchProjects";
import ProjectList1 from "./projectList1";
import Navbar from "../components/navbar";
import { Project } from '../../src/types';
import { getProjects } from '../../src/lib/db';
import React from "react";

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

  try {
    const projects: Project[] = await getProjects(walletAddress, endpoint);
    console.log("Projects", projects);

    return (
      <div className="bg-backgroundgray text-black">
        <Navbar />
        <h1 className="ml-4">Search Projects Here:</h1>
        <SearchProjects />
        <ProjectList1
          projects={projects}
          query={query}
          filter={filter}
          walletAddress={walletAddress}
          endpoint={endpoint}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // Handle the error, display an error message, or return a fallback UI
    return (
      <div className="bg-backgroundgray text-black">
        <Navbar />
        <h1>Search Projects Here:</h1>
        <SearchProjects />
        <p>Failed to fetch projects. Please try again later.</p>
      </div>
    );
  }
};

export default ProjectPage;