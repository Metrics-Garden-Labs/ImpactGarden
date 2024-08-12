import {   getProjectByName } from '../../../../../src/lib/db/dbprojects';
import { getAttestationsByContribution } from '../../../../../src/lib/db/dbattestations';
import { getContributionById } from '../../../../../src/lib/db/dbcontributions';
import { Contribution, Project } from '../../../../../src/types';
import Footer from '../../../../components/ui/Footer';
import Sidebar from '../../../Sidebar';
import React from 'react';
import ContributionPage from '../contributionPage';

interface ContributionPageProps {
  params: {
    projectName: string;
    contributionId: number;
  };
}

export const metadata = {
  title: "Metrics Garden Labs - Contribution",
};

const ContributionDetailsPage = async ({ params }: ContributionPageProps) => {
  const { projectName, contributionId } = params;
  const decodedProjectName = decodeURIComponent(projectName);

  try {
    const contribution: Contribution = await getContributionById(contributionId);
    const project: Project = await getProjectByName(decodedProjectName);
    const contributionAttestations  = await getAttestationsByContribution(contribution.contribution);
    const attestationCount = contributionAttestations.length;

    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar project={project} projectAttestationCount={0} />
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
    if (error instanceof Error) {
      console.error('Error fetching project data:', error);
      // Render an error page or handle the error as needed
      return <div>Error loading contribution details</div>;
    }
  }
};

export default ContributionDetailsPage;
