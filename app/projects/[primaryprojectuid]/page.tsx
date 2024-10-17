import { ProjectCategories, getProjectByName, getProjectByPrimaryProjectUid } from '../../../src/lib/db/dbprojects';
import { getContributionsByProjectName, getContributionsWithAttestationCounts } from '../../../src/lib/db/dbcontributions';
import { getAttestationCountByProject } from '../../../src/lib/db/dbattestations';
import { Contribution, Project } from '../../../src/types';
import ProfilePage from '../../components/projects/profilepage1';
import Footer from '../../components/ui/Footer';
import Sidebar from '@/app/components/projects/Sidebar';
import React from 'react';
import { Metadata } from 'next';

interface Props {
  params?: {
    primaryprojectuid?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projectName = await getProjectByPrimaryProjectUid(params?.primaryprojectuid || '');
  const decodedProjectName = decodeURIComponent(projectName);
  return {
    title: `Impact Garden - ${decodedProjectName}`,
  };
}

const ProjectPage = async ({ params }: Props) => {
  const primaryProjectUid = params?.primaryprojectuid || '';
  const projectName = await getProjectByPrimaryProjectUid(primaryProjectUid);
  const decodedProjectName = decodeURIComponent(projectName);
  
  try {
    const [categoryData, contributions, project, projectAttestations] = await Promise.all([
      ProjectCategories(decodedProjectName),
      getContributionsByProjectName(decodedProjectName),
      getProjectByName(decodedProjectName),
      // getAttestationCountByProject(decodedProjectName),
      getContributionsWithAttestationCounts(decodedProjectName)
    ]);

    const { categories, subcategories } = categoryData;

    console.log('Categories:', categories);
    console.log('Subcategories:', subcategories);
    console.log('Contributions:', contributions);
    console.log('decoded Project name:', decodedProjectName);

    const projectAttestationCount = projectAttestations.reduce((sum, contribution) => sum + (contribution.attestationCount ?? 0), 0);

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
              categories={categories}
              subcategories={subcategories}
            />
          </main>
        </div>
      </div>
    );

  } catch (error: unknown) {
    console.error('Error in ProjectPage:', error);
    // Handle error state here
    return <div>Error loading project data</div>;
  }
};

export default ProjectPage;