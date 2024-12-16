import { EvmNetwork } from '@tconnect.io/evm-api-types';
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider, Network as TezosBeaconNetwork } from '@tconnect.io/tezos-beacon-provider';
import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { Network } from '../types';
export type Step = 'connect' | 'connecting' | 'invalidChainId' | 'connected';
export interface TConnectModalProps {
    appName: string;
    appUrl: string;
    appIcon: string | undefined;
    bridgeUrl: string;
    apiKey: string;
    networkFilter: Array<'etherlink' | 'tezos'> | undefined;
    evmNetwork: EvmNetwork | undefined;
    tezosBeaconNetwork: TezosBeaconNetwork | undefined;
    tezosWcNetwork: TezosWcNetwork | undefined;
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
}
export declare const TConnectModal: import("react").NamedExoticComponent<TConnectModalProps>;
