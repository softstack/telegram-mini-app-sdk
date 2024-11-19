import { EvmErrorResponse, EvmEvent, EvmResponse } from '@tconnect.io/evm-api-types';
export declare const validateEvmResponse: (value: EvmResponse | EvmErrorResponse) => EvmResponse | EvmErrorResponse;
export declare const validateEvmEvent: (value: EvmEvent) => EvmEvent;
