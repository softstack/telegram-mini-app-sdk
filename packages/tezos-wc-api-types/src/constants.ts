/**
 * The base path for the Tezos WalletConnect API.
 * This constant defines the root endpoint for all API requests related to Tezos WalletConnect.
 */
export const BASE_PATH = '/api/v1/tezos-wc';

/**
 * The path for the Socket.IO connection.
 * This constant is constructed by appending '/socket.io' to the BASE_PATH.
 */
export const SOCKET_IO_PATH = BASE_PATH + '/socket.io';

/**
 * The endpoint path for checking the health status of the service.
 * This constant is constructed by appending '/health' to the BASE_PATH.
 */
export const HEALTH_PATH = BASE_PATH + '/health';

/**
 * The channel name used for Tezos WalletConnect requests.
 * This constant is used to identify the communication channel
 * for sending and receiving requests between the Tezos WalletConnect
 * client and server.
 */
export const REQUEST_CHANNEL = 'tezosWcRequest';

/**
 * The channel name used for Tezos WalletConnect events.
 * This constant is used to identify the event channel for communication
 * between different parts of the Tezos WalletConnect SDK.
 */
export const EVENT_CHANNEL = 'tezosWcEvent';
