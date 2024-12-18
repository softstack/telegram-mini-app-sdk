/**
 * The base path for the Etherlink API endpoints.
 * This constant is used to construct the full URL for API requests.
 */
export const BASE_PATH = '/api/v1/etherlink';

/**
 * The path for the Socket.IO connection.
 * This constant is constructed by appending '/socket.io' to the BASE_PATH.
 */
export const SOCKET_IO_PATH = BASE_PATH + '/socket.io';

/**
 * The endpoint path for checking the health status of the API.
 * This constant is constructed by appending '/health' to the base path.
 */
export const HEALTH_PATH = BASE_PATH + '/health';

/**
 * The channel name used for sending requests to the Etherlink API.
 * This constant is used to identify the specific communication channel
 * for Etherlink-related requests within the application.
 */
export const REQUEST_CHANNEL = 'etherlinkRequest';

/**
 * The constant `EVENT_CHANNEL` represents the name of the event channel used for Etherlink events.
 * This channel is used to communicate and handle events related to the Etherlink blockchain.
 */
export const EVENT_CHANNEL = 'etherlinkEvent';
