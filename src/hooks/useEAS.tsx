import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { FallbackProvider, ethers, BrowserProvider } from "ethers";
import { useEffect, useState } from "react";

import { PublicClient, HttpTransport, WalletClient, Client, Transport, Chain, Account } from "viem";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";


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


export const useEAS = () => {
    const [ eas, setEAS] = useState<EAS>();
    const [ schemaRegistry, setSchemaRegistry ] = useState<SchemaRegistry>();
    const [ currentAddress, setCurrentAddress ] = useState("");
    const [ selectedNetwork, setSelectedNetwork ] = useState<AttestationNetworkType>('Sepolia');
    const signer = useSigner();

    console.log("network selected: ", selectedNetwork);

    //wrapped in useEffect hook, will re-run whenever the selectedNetwork changes

    useEffect(() => {
        const initEAS = async () => {
            try {
                //Check if the sdk is already initializedd
                if (!signer) {
                  console.log("NO SIGNER ");
                  return;
                };
                console.log("in hook now we have signer", signer.address);


                console.log("Initializing EAS");

                const { attestAddress, schemaRegistryAddress } = networkContractAddresses[selectedNetwork];

                //Initialize the sdk with the address of the EAS Schema contract address
                
                const easInstance = new EAS(attestAddress);
                const schemaRegistryInstance = new SchemaRegistry(schemaRegistryAddress);

                console.log("Instances created: ", easInstance, "SchemaRegistry: ", schemaRegistryInstance);

                //Gets a default provider (in production use something else like infura/alchemy)
                // TODO: check
                console.log("Signer obtained: ", signer);
                console.log(signer.provider)

                const address = await signer.getAddress();
                console.log("Address obtained: ", address);

                //Connects an ethers style provider/signingProvider to perform read/write functions.
                //had to comment out line 39 -41 of eas.js to get this to work
                easInstance.connect(signer); 

                schemaRegistryInstance.connect(signer);
                console.log("Connected to EAS");

                setEAS(easInstance);
                setSchemaRegistry(schemaRegistryInstance);
                setCurrentAddress(address);
            } catch (error) {
                console.error("Error initializing EAS", error);
            }
        };
        initEAS();
    }, [ selectedNetwork, signer ]);

    const handleNetworkChange = (network: AttestationNetworkType) => {
        setSelectedNetwork(network);
        console.log("Network changed to: ", network);
      
    }
    

    return { eas, schemaRegistry, currentAddress, selectedNetwork, handleNetworkChange };
};

// export function clientToProvider(client: Client<Transport, Chain>) {
//   const { chain, transport } = client
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   }
//   if (transport.type === 'fallback') {
//     const providers = (transport.transports as ReturnType<Transport>[]).map(
//       ({ value }) => new JsonRpcProvider(value?.url, network),
//     )
//     if (providers.length === 1) return providers[0]
//     return new FallbackProvider(providers)
//   }
//   console.log("client to provider | transport", transport.url);
//   console.log("client to provider | network", network);
//   return new JsonRpcProvider(transport.url, network)
// }


export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)

  console.log("client to signer", network);
  signer.getNonce().then(data=>{
    console.log("client to signer nonce", data);
  });

  return signer
}

let i = 0;
export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      const tmpSigner = clientToSigner(walletClient);
      console.log("use Signer | tmp signer", tmpSigner);

      setSigner(tmpSigner);
    }

    getSigner();

  }, [walletClient]);

  console.log("useSigner | run ", i++, " times");
  return signer;
}

