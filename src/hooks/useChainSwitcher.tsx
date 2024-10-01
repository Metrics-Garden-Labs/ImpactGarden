import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { getChainId } from '../../src/utils/networkContractAddresses';
import { Project, AttestationNetworkType } from '@/src/types';

//deprecated, may need if we reintroduce attestating on other chains

function useChainSwitcher(project: Project) {
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    const switchToProjectChain = async () => {
      if (project) {
        const chainId = getChainId(project.ecosystem as AttestationNetworkType);
        if (chainId) {
          try {
            await switchChain({ chainId });
          } catch (error) {
            console.error('Failed to switch network:', error);
          }
        }
      }
    };

    switchToProjectChain();
  }, [project, switchChain]);
}

export default useChainSwitcher;