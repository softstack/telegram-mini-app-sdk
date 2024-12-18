import { EtherlinkErrorType } from '@tconnect.io/etherlink-api-types';
import { TezosBeaconErrorType } from '@tconnect.io/tezos-beacon-api-types';
import { TezosWcErrorType } from '@tconnect.io/tezos-wc-api-types';
import { OperatingSystem } from './types';
export declare const isAndroid: () => boolean;
export declare const isMobileSafari: () => boolean;
export declare const getOperatingSystem: () => OperatingSystem | undefined;
export declare const getErrorMessage: (errorType: Exclude<EtherlinkErrorType | TezosBeaconErrorType | TezosWcErrorType, "generic">, message: string) => string;
export declare const randomUUID: () => string;
export declare const openLink: (link: string, options?: {
    try_instant_view: boolean;
}) => Promise<void>;
export declare const toIntegerString: (value: bigint | number | string) => string;
export declare const formatTransactionAmount: (amount: number, mutez?: boolean) => string;
