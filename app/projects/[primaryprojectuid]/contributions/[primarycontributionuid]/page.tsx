import { ProjectCategories, getProjectByName, getProjectByPrimaryProjectUid } from '../../../../../src/lib/db/dbprojects';
import { getAttestationsByContribution, getAttestationsByContributionAndSubcategory } from '../../../../../src/lib/db/dbattestations';
import { getContributionByPrimaryContributionUid } from '../../../../../src/lib/db/dbcontributions';
import { Contribution, Project } from '../../../../../src/types';
import Footer from '../../../../components/ui/Footer';
import Sidebar from '@/app/components/projects/Sidebar';
import React from 'react';
import ContributionPage from '../../../../components/contributionPage/contributionPage';
import { Metadata } from 'next';

interface ContributionPageProps {
  params: {
    primaryprojectuid: string;
    primarycontributionuid: string;
  };
}

export async function generateMetadata({ params }: ContributionPageProps): Promise<Metadata> {
  const { primaryprojectuid, primarycontributionuid } = params;
  const projectName = await getProjectByPrimaryProjectUid(primaryprojectuid);
  const decodedProjectName = decodeURIComponent(projectName);
  return {
    title: `Impact Garden - ${decodedProjectName}`,
  };
}

const ContributionDetailsPage = async ({ params }: ContributionPageProps) => {
  const { primaryprojectuid, primarycontributionuid } = params;
  const projectName = await getProjectByPrimaryProjectUid(primaryprojectuid);
  const decodedProjectName = decodeURIComponent(projectName);

  try {
    const [contribution, project, contributionAttestations, categoryData] = await Promise.all([
      getContributionByPrimaryContributionUid(primarycontributionuid),
      getProjectByName(decodedProjectName),
      getAttestationsByContribution(primarycontributionuid),
      ProjectCategories(decodedProjectName),
    ]);

    const contributionAttestationsBeforeCount = await getAttestationsByContributionAndSubcategory(contribution.contribution, contribution?.category ?? '', contribution?.subcategory ?? '')
    const attestationCount = contributionAttestationsBeforeCount.length;
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
      </div>
    );
  } catch (error: unknown) {
    console.error('Error fetching contribution details:', error);
    return <div>Error loading contribution details</div>;
  }
};

export default ContributionDetailsPage;