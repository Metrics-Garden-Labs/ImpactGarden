import { useEffect, useState } from 'react';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { Contribution, AttestationDisplay, Project } from '@/src/types';

//this is used to fetch the contributions and recent attestations for a project
//series of api calls to get the data

function useContributionData(project: Project, activeTab: string) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [recentAttestations, setRecentAttestations] = useState<AttestationDisplay[]>([]);
  const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectWithContributionCount = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectsWithContributionCount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectName: project.projectName }),
        });

        if (response.ok) {
          const data = await response.json();
          setContributions(data.contributions);
        } else {
          console.error('Error fetching project:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectWithContributionCount();
  }, [project]);

  useEffect(() => {
    if (activeTab === 'insights') {
      const fetchRecentAttestations = async () => {
        try {
          const response = await fetch(`${NEXT_PUBLIC_URL}/api/getAttestationsByProject`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectName: project.projectName }),
          });

          const responseData = await response.json();

          if (responseData && responseData.attestations) {
            setRecentAttestations(responseData.attestations);
          }
        } catch (error) {
          console.error('Error fetching attestations:', error);
        } finally {
          setRecentAttestationsLoading(false);
        }
      };

      fetchRecentAttestations();
    }
  }, [activeTab, project]);

  return { contributions, recentAttestations, recentAttestationsLoading };
}


export default useContributionData;