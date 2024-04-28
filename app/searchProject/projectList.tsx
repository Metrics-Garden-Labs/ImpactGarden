import { getProjects } from "../../src/lib/db";
import React from 'react';

const ProjectList = async ({ query, filter, walletAddress, endpoint }: { query: string; filter: string; walletAddress: string; endpoint: string }) => {
  const projects = await getProjects(walletAddress, endpoint);
  
  const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
    const value = project[filter as keyof typeof project];
    return value !== undefined && value !== null ? String(value).toLowerCase().includes(query.toLowerCase()) : false;
  }) : [];

  console.log('filteredProjects projectlist', filteredProjects);

  return (
    <div className="mt-8">
    {Array.isArray(projects) && projects.length === 0 ? (
      <p className="mt-4">No projects found</p>
    ) : (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left font-semibold">Project Name</th>
            <th className="py-2 px-4 text-left font-semibold">Twitter</th>
            <th className="py-2 px-4 text-left font-semibold">Website</th>
            <th className="py-2 px-4 text-left font-semibold">GitHub</th>
            <th className="py-2 px-4 text-left font-semibold">Eth Address</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(projects) &&
            filteredProjects.map((project) => (
              <tr key={project.id} className="border-t">
                <td className="py-2 px-4">{project.projectName}</td>
                <td className="py-2 px-4">{project.twitterUrl}</td>
                <td className="py-2 px-4">{project.websiteUrl}</td>
                <td className="py-2 px-4">{project.githubUrl}</td>
                <td className="py-2 px-4">{project.ethAddress}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default ProjectList;




















      {/* <div className="flex flex-col mt-6">
        {Array.isArray(filteredProjects) &&
          filteredProjects.map((project) => (
            <div key={project.id} className="flex flex-col">
              <div className="flex space-x-6 items-center">
                <h2>{project.projectName}</h2>
                <h2>{project.twitterUrl}</h2>
                <h2>{project.websiteUrl}</h2>
              </div>
              <div className="my-4 border-b border-gray-300"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectList;
             */}
   