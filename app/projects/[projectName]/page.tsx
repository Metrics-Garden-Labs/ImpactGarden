// app/projects/[projectName]/page.tsx

import { getContributionsByProjectName, getProjectByName } from '@/src/lib/db';
import { Contribution, Project } from '@/src/types';
import ProfilePage from '../profilepage1';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Sidebar from '../sidebar1';

interface Props {
  params?: {
    projectName?: string;
  };
}

const ProjectPage = async ({ params }: Props) => {
  const projectName = params?.projectName || '';

  try {
    const contributions: Contribution[] = await getContributionsByProjectName(projectName);
    console.log('Contributions:', contributions);
    const project: Project | null = await getProjectByName(projectName);

    if (!project) {
      return <div>Project not found</div>;
    }

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar project={project} />
          <main className="flex-1 overflow-auto">
            <ProfilePage contributions={contributions} />
          </main>
        </div>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching project data:', error);
    return <div>Error fetching project data</div>;
  }
};

export default ProjectPage;