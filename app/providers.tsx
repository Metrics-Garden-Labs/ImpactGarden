'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
    zora,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { useGlobalState } from './config/config';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
    appName: 'RainbowDemo',
    projectId: '861a0d63610c9afa17176ad8a3acd2d2',
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        zora,
        sepolia
        // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <GlobalStateProvider>
                    <RainbowKitProvider>{children}</RainbowKitProvider>
                </GlobalStateProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address } = useAccount();
    const [, setWalletAddress] = useGlobalState('walletAddress');
    //console.log('address', address);


    React.useEffect(() => {
        if (address) {
            setWalletAddress(address);
        } else {
            setWalletAddress('');
        }
    }, [address, setWalletAddress]);

    return <>{children}</>;
};