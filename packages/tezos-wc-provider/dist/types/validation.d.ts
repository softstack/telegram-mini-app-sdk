import { TezosWcErrorResponse, TezosWcEvent, TezosWcResponse } from '@tconnect.io/tezos-wc-api-types';
import { GetAccountsResult, SendResult, SignResult } from './types';
export declare const validateTezosWcResponse: (value: TezosWcResponse | TezosWcErrorResponse) => TezosWcResponse | TezosWcErrorResponse;
export declare const validateTezosWcEvent: (value: TezosWcEvent) => TezosWcEvent;
export declare const isGetAccountsResult: (value: unknown) => value is GetAccountsResult;
export declare const isSignResult: (value: unknown) => value is SignResult;
export declare const isSendResult: (value: unknown) => value is SendResult;
