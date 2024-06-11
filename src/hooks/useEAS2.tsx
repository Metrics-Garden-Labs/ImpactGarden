// import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
// import { FallbackProvider, ethers, BrowserProvider, JsonRpcProvider, JsonRpcSigner } from "ethers";
// import { useEffect, useState } from "react";
// import { Alchemy, Network } from "alchemy-sdk";
// import { usePublicClient, useWalletClient } from "wagmi";
// import { PublicClient, HttpTransport, WalletClient, Client, Transport, Chain, Account } from "viem";
// import { isMobile } from "react-device-detect";
// import WalletConnectProvider from "@walletconnect/web3-provider";



// //i've gone a bit over board with the number of chain, will make it easier later
// //not sure how useful this hook is now

// // Define network names as a type
// export type AttestationNetworkType =
//   | 'Ethereum'
//   | 'Optimism'
//   | 'Base'
//   | 'Arbitrum One'
//   | 'Polygon'
//   | 'Scroll'
//   | 'Celo'
//   | 'Blast'
//   | 'Linea';

// // Define a type for the contract addresses
// export type ContractAddresses = {
//   attestAddress: string;
//   schemaRegistryAddress: string;
// };

// // Mapping network names to their contract addresses
// export const networkContractAddresses: Record<AttestationNetworkType, ContractAddresses> = {
//   Ethereum: {
//     attestAddress: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
//     schemaRegistryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
//   },
//   Optimism: {
//     attestAddress: "0x4200000000000000000000000000000000000021",
//     schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
//   },
//   Base: {
//     attestAddress: "0x4200000000000000000000000000000000000021",
//     schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
//   },
//   "Arbitrum One": {
//     attestAddress: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
//     schemaRegistryAddress: "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB",
//   },
//   Polygon: {
//     attestAddress: "0x5E634ef5355f45A855d02D66eCD687b1502AF790",
//     schemaRegistryAddress: "0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7",
//   },
//   Scroll: {
//     attestAddress: "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0",
//     schemaRegistryAddress: "0xD2CDF46556543316e7D34e8eDc4624e2bB95e3B6",
//   },
//   Celo: {
//     attestAddress: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
//     schemaRegistryAddress: "0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34",
//   },
//   Blast: {
//     attestAddress: "0x4200000000000000000000000000000000000021",
//     schemaRegistryAddress: "0x4200000000000000000000000000000000000020",
//   },
//   Linea: {
//     attestAddress: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
//     schemaRegistryAddress: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
//   },
// };



// export const useEAS = () => {
//   const [eas, setEAS] = useState<EAS>();
//   const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry>();
//   const [currentAddress, setCurrentAddress] = useState("");
//   const [selectedNetwork, setSelectedNetwork] = useState<AttestationNetworkType>('Optimism');
//   const signer = useSigner();
//   const [address, setAddress] = useState<string>("");

//   console.log("network selected: ", selectedNetwork);
//   const settings = {
//     apiKey: process.env.ALCHEMY_API_KEY as string, // Ensure you have this in your .env.local file
//     network: Network.OPT_MAINNET, // Adjust based on the network you want to connect to
//   };
  
//   // const network = new ethers.Network("optimism", 10);
//   // const alchemy = new Alchemy(settings);
//   // const alchemyProvider = new ethers.AlchemyProvider(settings.network, settings.apiKey);
  

//   // Wrapped in useEffect hook, will re-run whenever the selectedNetwork changes
//   useEffect(() => {
//     const initEAS = async () => {
//       try {
//         // Check if the sdk is already initialized

//         if (!signer) {
//           console.log("NO SIGNER ");
//           return;
//         }
//         console.log("in hook now we have signer", signer.address);

//         console.log("Initializing EAS");

//         const { attestAddress, schemaRegistryAddress } = networkContractAddresses[selectedNetwork];

//         // Initialize the sdk with the address of the EAS Schema contract address
//         const easInstance = new EAS(attestAddress);
//         const schemaRegistryInstance = new SchemaRegistry(schemaRegistryAddress);

//         console.log("Instances created: ", easInstance, "SchemaRegistry: ", schemaRegistryInstance);

//         const address = await signer.getAddress();
//         setAddress(address);
//         console.log("Address obtained: ", address);

//         // Connects an ethers style provider/signingProvider to perform read/write functions.
//         easInstance.connect(signer);

//         schemaRegistryInstance.connect(signer);
//         console.log("Connected to EAS");

//         setEAS(easInstance);
//         setSchemaRegistry(schemaRegistryInstance);
//         setCurrentAddress(address);
//       } catch (error) {
//         console.error("Error initializing EAS", error);
//       }
//     };
//     initEAS();
//   }, [selectedNetwork, signer]);

//   const handleNetworkChange = (network: AttestationNetworkType) => {
//     setSelectedNetwork(network);
//     console.log("Network changed to: ", network);
//   };

//   return { eas, schemaRegistry, currentAddress, selectedNetwork, address, handleNetworkChange };
// };

// // export function clientToProvider(client: Client<Transport, Chain>) {
// //   const { chain, transport } = client;
// //   const network = {
// //     chainId: chain.id,
// //     name: chain.name,
// //     ensAddress: chain.contracts?.ensRegistry?.address,
// //   };
// //   if (transport.type === 'fallback') {
// //     const providers = (transport.transports as ReturnType<Transport>[]).map(
// //       ({ value }) => new JsonRpcProvider(value?.url, network)
// //     );
// //     if (providers.length === 1) return providers[0];
// //     return new FallbackProvider(providers);
// //   }
// //   console.log("client to provider | transport", transport.url);
// //   console.log("client to provider | network", network);
// //   return new JsonRpcProvider(transport.url, network);
// // }

// // export function clientToSigner(client: Client<Transport, Chain, Account>) {
// //   const { account, chain, transport } = client;
// //   const network = {
// //     chainId: chain.id,
// //     name: chain.name,
// //     ensAddress: chain.contracts?.ensRegistry?.address,
// //   };
// //   const provider = new BrowserProvider(transport, network);
// //   const signer = new JsonRpcSigner(provider, account.address);

// //   console.log("client to signer", network);
// //   signer.getNonce().then(data => {
// //     console.log("client to signer nonce", data);
// //   });

// //   return signer;
// // }

// // let i = 0;
// // export function useSigner() {
// //   const { data: walletClient } = useWalletClient();
// //   const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

// //   useEffect(() => {
// //     async function getSigner() {
// //       if (!walletClient) return;

// //       const tmpSigner = clientToSigner(walletClient);
// //       console.log("use Signer | tmp signer", tmpSigner);

// //       setSigner(tmpSigner);
// //     }

// //     getSigner();
// //   }, [walletClient]);

// //   console.log("useSigner | run ", i++, " times");
// //   return signer;
// // }

// export function clientToProvider(client: Client<Transport, Chain>) {
//   const { chain, transport } = client;
//   const settings = {
//     apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
//     network: Network.OPT_MAINNET, // Adjust based on the network you want to connect to
//   };

//   const alchemyProvider = new ethers.AlchemyProvider(settings.network, settings.apiKey);
//   console.log("client to provider | transport", transport.url);
//   console.log("client to provider | network", chain.name);

//   return alchemyProvider;
// }

// export function clientToSigner(client: Client<Transport, Chain, Account>) {
//   const { account } = client;
//   const settings = {
//     apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
//     network: Network.OPT_MAINNET, // Adjust based on the network you want to connect to
//   };

//   const alchemyProvider = new ethers.AlchemyProvider(settings.network, settings.apiKey);
//   const signer = new ethers.Wallet(account.address, alchemyProvider);

//   console.log("client to signer", account.address);
//   signer.getNonce().then(data => {
//     console.log("client to signer nonce", data);
//   });

//   return signer;
// }


// export function useSigner() {
//   const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

//   useEffect(() => {
//     const initSigner = async () => {
//       try {
//         let provider;

//         // Check if the user is on mobile
//         if (isMobile) {
//           // Initialize WalletConnect provider
//           provider = new WalletConnectProvider({
//             rpc: {
//               1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`, // Ethereum Mainnet
//               // Add other networks here
//             },
//             qrcode: true,
//           });

//           // Enable session (triggers QR Code modal)
//           await provider.enable();
//         } else {
//           // Check if window.ethereum is available for desktop
//           if (!window.ethereum) {
//             console.error("No Ethereum provider found. Install MetaMask.");
//             return;
//           }

//           // Request the user's wallet to connect
//           await window.ethereum.request({ method: "eth_requestAccounts" });
//           provider = new ethers.providers.Web3Provider(window.ethereum);
//         }

//         // Create an ethers.js signer from the provider
//         const tmpSigner = provider.getSigner();

//         // Ensure the provider can use the Alchemy API for additional functionalities
//         const alchemyProvider = new ethers.AlchemyProvider("mainnet", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);

//         // Use ethers.js to merge the signer with the Alchemy provider
//         const mergedSigner = tmpSigner.connect(alchemyProvider);

//         console.log("use Signer | merged signer", mergedSigner);

//         setSigner(mergedSigner); // Set the merged signer in state
//       } catch (error) {
//         console.error("Error initializing signer:", error);
//       }
//     };

//     initSigner();
//   }, []);

//   return signer;
// }

// // export function useSigner() {
// //   const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

// //   useEffect(() => {
// //     const initSigner = async () => {
// //       try {
// //         const settings = {
// //           apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string, // Ensure you have this in your .env.local file
// //           network: Network.OPT_MAINNET, // Adjust based on the network you want to connect to
// //         };

// //         const alchemy = new Alchemy(settings);
// //         const alchemyProvider = new ethers.AlchemyProvider(settings.network, settings.apiKey);

// //         // Assumes a signer connected to the provider
// //         const tmpSigner = alchemyProvider.getSigner();

// //         console.log("use Signer | tmp signer", tmpSigner);

// //         setSigner(await tmpSigner); // Ensure tmpSigner is awaited
// //       } catch (error) {
// //         console.error("Error initializing Alchemy signer:", error);
// //       }
// //     };

// //     initSigner();
// //   }, []);

// //   return signer;
// // }

//alchemy provider stuff

  // const alchemyapi = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
            // if (!alchemyapi) {
            //     console.error('Alchemy API key not set');
            //     return;
            // }
            // const settings = {
            //     apiKey: process.env.ALCHEMY_API_KEY,
            //     network: Network.OPT_MAINNET,
            //   };
            //   const network = new ethers.Network("optimism", 10);
            //   const alchemy = new Alchemy(settings);
            //   console.log("Alchemy", alchemy);
            //   const alchemyProvider = new ethers.AlchemyProvider(
            //     network,
            //     settings.apiKey
            //   );
            //   //const provider = new ethers.BrowserProvider(window.ethereum);
            //   console.log('Provider:', alchemyProvider);
            //   const signer = await alchemyProvider.getSigner();
            // const provider = new ethers.BrowserProvider(window.ethereum);
            // const signer = await provider.getSigner();