import { ProjectCategories, getProjectByName } from '../../../src/lib/db/dbprojects';
import { getContributionsByProjectName } from '../../../src/lib/db/dbcontributions';
import { getAttestationCountByProject } from '../../../src/lib/db/dbattestations';
import { Contribution, Project } from '../../../src/types';
import ProfilePage from '../profilepage1';
import Footer from '../../components/ui/Footer';
import Sidebar from '../Sidebar';
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
    const [categoryData, contributions, project, projectAttestations] = await Promise.all([
      ProjectCategories(decodedProjectName),
      getContributionsByProjectName(decodedProjectName),
      getProjectByName(decodedProjectName),
      getAttestationCountByProject(decodedProjectName)
    ]);

    const { categories, subcategories } = categoryData;

    console.log('Categories:', categories);
    console.log('Subcategories:', subcategories);
    console.log('Contributions:', contributions);
    console.log('decoded Project name:', decodedProjectName);

    const projectAttestationCount = projectAttestations.length;

    if (!project) {
      throw new Error('Project not found');
    }

    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            project={project} 
            projectAttestationCount={projectAttestationCount} 
            categories={categories}
            subcategories={subcategories}
          />
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
    console.error('Error in ProjectPage:', error);
    // Handle error state here
    return <div>Error loading project data</div>;
  }
};

export default ProjectPage;