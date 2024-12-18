import { EtherlinkErrorResponse, EtherlinkEvent, EtherlinkResponse } from '@tconnect.io/etherlink-api-types';
export declare const validateEtherlinkResponse: (value: EtherlinkResponse | EtherlinkErrorResponse) => EtherlinkResponse | EtherlinkErrorResponse;
export declare const validateEtherlinkEvent: (value: EtherlinkEvent) => EtherlinkEvent;
