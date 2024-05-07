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
    scroll,
    celo,
    blast,
    linea,
    
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { useGlobalState } from '../src/config/config';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
    appName: 'module3',
    projectId: 'fd9485b2313c31a14cd8fd4cdb94893f',
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
        scroll,
        celo,
        blast,
        linea,
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
                    <RainbowKitProvider >
                        {children}
                    </RainbowKitProvider>
                </GlobalStateProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address } = useAccount();
    const [, setWalletAddress] = useGlobalState('walletAddress');
    console.log('address', address);


    React.useEffect(() => {
        if (address) {
            setWalletAddress(address);
        } else {
            setWalletAddress('');
        }
    }, [address, setWalletAddress]);

    return <>{children}</>;
};