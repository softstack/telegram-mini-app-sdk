/**
 * The base path for the Tezos Beacon API.
 * This constant defines the root endpoint for all API requests related to the Tezos Beacon.
 */
export const BASE_PATH = '/api/v1/tezos-beacon';

/**
 * The path for the Socket.IO connection.
 * This constant is constructed by appending '/socket.io' to the BASE_PATH.
 */
export const SOCKET_IO_PATH = BASE_PATH + '/socket.io';

/**
 * The endpoint path for checking the health status of the API.
 * This constant is constructed by appending '/health' to the BASE_PATH.
 */
export const HEALTH_PATH = BASE_PATH + '/health';

/**
 * The constant `REQUEST_CHANNEL` represents the name of the channel used for sending
 * requests in the Tezos Beacon API.
 *
 * This channel is used to communicate between different parts of the application
 * that interact with the Tezos blockchain through the Beacon API.
 */
export const REQUEST_CHANNEL = 'tezosBeaconRequest';

/**
 * The name of the event channel used for Tezos Beacon events.
 * This constant is used to identify and subscribe to events related to the Tezos Beacon API.
 */
export const EVENT_CHANNEL = 'tezosBeaconEvent';

export const secretbox_NONCEBYTES = 24; // crypto_secretbox_NONCEBYTES
