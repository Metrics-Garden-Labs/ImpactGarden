//include the endpoints for eas scan to link the attestation Uids correctly

import  {AttestationNetworkType} from '../types';


export const easScanEndpoints: Record<AttestationNetworkType, string> = {
    Ethereum: 'https://easscan.org/attestation/view/',
    'Arbitrum One': 'https://arbitrum.easscan.org/attestation/view/',
    Optimism: 'https://optimism.easscan.org/attestation/view/',
    Polygon: 'https://polygon.easscan.org/attestation/view/',
    Linea: 'https://linea.easscan.org/attestation/view/',
    Base: 'https://base.easscan.org/graphql/attestation/view/',
    Scroll: 'https://scroll.easscan.org/attestation/view/',
    Celo: 'https://celo.easscan.org/attestation/view/', //not active
    Blast: 'https://blast.easscan.org/attestation/view/', //placeholder not active
  };
  