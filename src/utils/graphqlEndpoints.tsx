
export type NetworkType =
  | 'Ethereum'
  | 'Arbitrum'
  | 'Optimism'
  | 'Linea'
  | 'Sepolia'
  | 'Base'
  | 'Optimism-Goerli'
  | 'Base-Goerli';

export const networkEndpoints: Record<NetworkType, string> = {
  Ethereum: 'https://easscan.org/graphql',
  Arbitrum: 'https://arbitrum.easscan.org/graphql',
  Optimism: 'https://optimism.easscan.org/graphql',
  Linea: 'https://linea.easscan.org/graphql',
  Sepolia: 'https://sepolia.easscan.org/graphql',
  Base: 'https://base.easscan.org/graphql',
  'Optimism-Goerli': 'https://optimism-goerli-bedrock.easscan.org/graphql',
  'Base-Goerli': 'https://base-goerli.easscan.org/graphql',
};
