/**
 * The base path for the EVM API endpoints.
 * This constant is used to construct the full URL for API requests.
 */
export const BASE_PATH = '/api/v1/evm';

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
 * The channel name used for sending requests to the EVM API.
 * This constant is used to identify the specific communication channel
 * for EVM-related requests within the application.
 */
export const REQUEST_CHANNEL = 'evmRequest';

/**
 * The constant `EVENT_CHANNEL` represents the name of the event channel used for EVM events.
 * This channel is used to communicate and handle events related to the Ethereum Virtual Machine (EVM).
 */
export const EVENT_CHANNEL = 'evmEvent';
