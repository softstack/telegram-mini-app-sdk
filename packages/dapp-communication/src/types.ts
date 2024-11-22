/**
 * Represents a wrapped request with an associated request ID.
 *
 * @template Request - The type of the request payload.
 * @property {string} requestId - A unique identifier for the request.
 * @property {Request} request - The actual request payload.
 */
export interface WrappedRequest<Request> {
	requestId: string;
	request: Request;
}

/**
 * Represents a wrapped response that includes a request ID and the actual response data.
 *
 * @template Response - The type of the response data.
 * @property {string} requestId - The unique identifier for the request.
 * @property {Response} response - The actual response data.
 */
export interface WrappedResponse<Response> {
	requestId: string;
	response: Response;
}

/**
 * Interface representing the events that can be emitted by the CommunicationController.
 *
 * @template Event - The type of the event that can be emitted.
 *
 * @property {Error} error - An error event that indicates something went wrong.
 * @property {Event} event - A generic event of type `Event` that represents a specific event emitted by the controller.
 */
export interface CommunicationControllerEvents<Event> {
	error: Error;
	event: Event;
}

/**
 * Represents the serialized form of a communication controller.
 * This interface is used to define the structure of the data
 * required to establish communication between different parts
 * of the application.
 *
 * @property {string} bridgeUrl - The URL of the bridge server used for communication.
 * @property {string} path - The path used for the communication endpoint.
 * @property {string} requestChannel - The channel used for sending requests.
 * @property {string} eventChannel - The channel used for receiving events.
 */
export interface SerializedCommunicationController {
	bridgeUrl: string;
	path: string;
	requestChannel: string;
	eventChannel: string;
}
