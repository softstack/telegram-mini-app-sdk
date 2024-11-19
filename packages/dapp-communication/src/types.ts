export interface WrappedRequest<Request> {
	requestId: string;
	request: Request;
}

export interface WrappedResponse<Response> {
	requestId: string;
	response: Response;
}

export interface CommunicationControllerEvents<Event> {
	error: Error;
	event: Event;
}

export interface SerializedCommunicationController {
	bridgeUrl: string;
	path: string;
	requestChannel: string;
	eventChannel: string;
}
