//Goal of this is to able to create schemas 
//on different chains through changing of states, similar 
//to changing the networks

//first i will put int the contract addresses for the different chains

//i've gone a bit over board with the number of chain, will make it easier later

// Define network names as a type
export type AttestationNetworkType =
  | 'Ethereum'
  | 'Optimism'
  | 'Base'
  | 'Arbitrum One'
  | 'Arbitrum Nova'
  | 'Polygon'
  | 'Scroll'
  | 'Celo'
  | 'Blast'
  | 'Linea'
  | 'Sepolia'
  | 'Optimism Sepolia'
  | 'Optimism Goerli'
  | 'Base Sepolia'
  | 'Base Goerli'
  | 'Arbitrum Goerli';

// Define a type for the contract addresses
export type ContractAddresses = {
  attestAddress: string;
  schemaRegistryAddress: string;
};

// Mapping network names to their contract addresses
export const networkContractAddresses: Record<AttestationNetworkType, ContractAddresses> = {
  Ethereum: {
    attestAddress: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
  },
  Optimism: {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  Base: {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  "Arbitrum One": {
    attestAddress: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
    schemaRegistryAddress: "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB",
  },
  "Arbitrum Nova": {
    attestAddress: "0x6d3dC0Fe5351087E3Af3bDe8eB3F7350ed894fc3",
    schemaRegistryAddress: "0x49563d0DA8DF38ef2eBF9C1167270334D72cE0AE",
  },
  Polygon: {
    attestAddress: "0x5E634ef5355f45A855d02D66eCD687b1502AF790",
    schemaRegistryAddress: "0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7",
  },
  Scroll: {
    attestAddress: "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0",
    schemaRegistryAddress: "0xD2CDF46556543316e7D34e8eDc4624e2bB95e3B6",
  },
  Celo: {
    attestAddress: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
    schemaRegistryAddress: "0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34",
  },
  Blast: {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  Linea: {
    attestAddress: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
    schemaRegistryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  },
  Sepolia: {
    attestAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
  },
  "Optimism Sepolia": {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  "Optimism Goerli": {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  "Base Sepolia": {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  "Base Goerli": {
    attestAddress: "0x4200000000000000000000000000000000000021",
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
  },
  "Arbitrum Goerli": {
    attestAddress: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
    schemaRegistryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
  }
};
