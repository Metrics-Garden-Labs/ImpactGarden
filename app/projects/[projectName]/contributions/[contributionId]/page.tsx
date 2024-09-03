import { ProjectCategories, getProjectByName } from '../../../../../src/lib/db/dbprojects';
import { getAttestationsByContribution } from '../../../../../src/lib/db/dbattestations';
import { getContributionById } from '../../../../../src/lib/db/dbcontributions';
import { Contribution, Project } from '../../../../../src/types';
import Footer from '../../../../components/ui/Footer';
import Sidebar from '../../../Sidebar';
import React from 'react';
import ContributionPage from '../contributionPage';
import { Metadata } from 'next';

interface ContributionPageProps {
  params: {
    projectName: string;
    contributionId: string;
  };
}

export async function generateMetadata({ params }: ContributionPageProps): Promise<Metadata> {
  const { projectName, contributionId } = params;
  const decodedProjectName = decodeURIComponent(projectName);
  return {
    title: `Impact Garden - ${decodedProjectName}`,
  };
}

const ContributionDetailsPage = async ({ params }: ContributionPageProps) => {
  const { projectName, contributionId } = params;
  const decodedProjectName = decodeURIComponent(projectName);

  try {
    const [contribution, project, contributionAttestations, categoryData] = await Promise.all([
      getContributionById(parseInt(contributionId)),
      getProjectByName(decodedProjectName),
      getAttestationsByContribution(contributionId),
      ProjectCategories(decodedProjectName)
    ]);

    const attestationCount = contributionAttestations.length;
    const { categories, subcategories } = categoryData;

    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            project={project} 
            projectAttestationCount={attestationCount} 
            categories={categories}
            subcategories={subcategories}
          />
          <main className="flex-1 overflow-auto">
            <ContributionPage 
              contribution={contribution} 
              project={project}
              attestationCount={attestationCount}
            />
          </main>
        </div>
        <Footer />
      </div>
    );
  } catch (error: unknown) {
    console.error('Error fetching contribution details:', error);
    return <div>Error loading contribution details</div>;
  }
};

export default ContributionDetailsPage;