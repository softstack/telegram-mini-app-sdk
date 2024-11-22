import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { Network } from '../types';
export type Step = 'connect' | 'connecting' | 'invalidChainId' | 'connected';
export interface TConnectModalProps {
    appName: string;
    appUrl: string;
    bridgeUrl: string;
    apiKey: string;
    networkFilter?: Array<'etherlink' | 'tezos'>;
    genericWalletUrl?: string;
    step: Step;
    onChangeStep: (action: Step | ((prevStep: Step) => Step)) => void;
    currentNetwork: Network | undefined;
    onChangeCurrentNetwork: (network: Network) => void;
    currentWallet: Network['wallets'][0] | undefined;
    onChangeCurrentWallet: (wallet: Network['wallets'][0]) => void;
    evmProvider: TConnectEvmProvider | undefined;
    onChangeEvmProvider: (provider: TConnectEvmProvider, chainId: bigint) => void;
    tezosBeaconProvider: TConnectTezosBeaconProvider | undefined;
    onChangeTezosBeaconProvider: (provider: TConnectTezosBeaconProvider) => void;
    tezosWcProvider: TConnectTezosWcProvider | undefined;
    onChangeTezosWcProvider: (provider: TConnectTezosWcProvider) => void;
    onDisconnect: () => void;
    onClose: () => void;
    onError: (error: unknown) => void;
}
export declare const TConnectModal: import("react").NamedExoticComponent<TConnectModalProps>;
