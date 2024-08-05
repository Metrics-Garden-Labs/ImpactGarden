// app/projects/[projectName]/page.tsx

import {  getProjectByName } from '../../../src/lib/db/dbprojects';
import {getContributionsByProjectName} from '../../../src/lib/db/dbcontributions';
import { getAttestationCountByProject } from '../../../src/lib/db/dbattestations';
import { Contribution, ContributionWithAttestationCount, Project } from '../../../src/types';
import ProfilePage from '../profilepage1';
import Navbar from '../../components/navbar1';
import Footer from '../../components/footer';
import Sidebar from '../sidebar1';
import React from 'react';
import { Metadata } from 'next';

interface Props {
  params?: {
    projectName?: string;
  };
}

export const metadata: Metadata = {
  title: "Metrics Garden Labs - Project",
};

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


