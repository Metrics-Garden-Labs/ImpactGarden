// app/projects/[projectName]/page.tsx

import { getAttestationCountByProject, getContributionsByProjectName, getProjectByName } from '../../../src/lib/db';
import { Contribution, Project } from '../../../src/types';
import ProfilePage from '../profilepage1';
import Navbar from '../../components/navbar1';
import Footer from '../../components/footer';
import Sidebar from '../sidebar1';
import React from 'react';

interface Props {
  params?: {
    projectName?: string;
  };
}

const ProjectPage = async ({ params }: Props) => {
  const encodedProjectName = params?.projectName || '';
  const decodedProjectName = decodeURIComponent(encodedProjectName);
  
  try {
    const contributions: Contribution[] = await getContributionsByProjectName(decodedProjectName);
    console.log('Contributions:', contributions);
    console.log('decoded Project name:', decodedProjectName);

    const project: Project = await getProjectByName(decodedProjectName);
    const projectAttestations = await getAttestationCountByProject(project.projectName);
    const projectAttestationCount = projectAttestations.length;


    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar project={project} projectAttestationCount={projectAttestationCount} />
          <main className="flex-1 overflow-auto">
            <ProfilePage 
              contributions={contributions} 
              project={project} 
              projectAttestationCount={projectAttestationCount} 
              />
          </main>
        </div>
        <Footer />
      </div>
      
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching project data:', error);
      // ...
    }
  }
};

export default ProjectPage;


