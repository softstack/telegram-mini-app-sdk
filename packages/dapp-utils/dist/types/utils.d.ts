import { EvmErrorType } from '@tconnect.io/evm-api-types';
import { TezosBeaconErrorType } from '@tconnect.io/tezos-beacon-api-types';
import { TezosWcErrorType } from '@tconnect.io/tezos-wc-api-types';
import { OperatingSystem } from './types';
export declare const isAndroid: () => boolean;
export declare const isMobileSafari: () => boolean;
export declare const getOperatingSystem: () => OperatingSystem | undefined;
export declare const getErrorMessage: (errorType: Exclude<EvmErrorType | TezosBeaconErrorType | TezosWcErrorType, "generic">, message: string) => string;
