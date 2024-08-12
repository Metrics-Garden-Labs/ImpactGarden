import { Contribution, Project } from '../../../src/types';
import FrameCustomization from '../../components/frames/FrameCustomization';

async function getContributionData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/getContribution`;
    console.log(`Fetching contribution data from: ${url}`);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    console.log('Fetch response status:', res.status);

    if (!res.ok) {
      console.error('Failed to fetch data, status:', res.status);
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error in getContributionData:', error);
    throw error;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  try {
    console.log('Page params:', params);
    const { contribution, project } = await getContributionData(params.id);
    console.log('Fetched contribution and project:', { contribution, project });

    return <FrameCustomization contribution={contribution} project={project} />;
  } catch (error) {
    console.error('Error in Page component:', error);
    return <div>Error loading data</div>;
  }
}
