import { validateSchema, validateType } from '@tconnect.io/core';
import { TezosBeaconErrorResponse, TezosBeaconEvent, TezosBeaconResponse } from '@tconnect.io/tezos-beacon-api-types';
import Joi from 'joi';
import {
	BaseMessage,
	DisconnectMessage,
	ErrorResponse,
	OperationResponse,
	PairingResponse,
	PermissionResponse,
	SignPayloadResponse,
} from './types';

/**
 * Validates a Tezos Beacon response or error response against a predefined schema.
 *
 * @param value - The Tezos Beacon response or error response to validate.
 * @returns The validated Tezos Beacon response or error response.
 *
 * The function uses Joi to validate the structure of the input value. The input value
 * can be one of the following types:
 * - An error response with a type of 'error' and a payload that can be either a generic error
 *   or an error with a specific type ('invalidSessionId', 'invalidApiKey').
 * - An initialization response with a type of 'init' and a payload containing a sessionId and
 *   a loginRawDigest.
 * - A login response with a type of 'login' and a payload containing a connectionString.
 * - A message response with a type of 'message'.
 * - A reconnect response with a type of 'reconnect'.
 * - A disconnect response with a type of 'disconnect'.
 */
export const validateTezosBeaconResponse = (
	value: TezosBeaconResponse | TezosBeaconErrorResponse,
): TezosBeaconResponse | TezosBeaconErrorResponse =>
	validateSchema(
		value,
		Joi.alternatives()
			.try(
				Joi.object({
					type: Joi.string().valid('error').required(),
					payload: Joi.alternatives().try(
						Joi.object({
							type: Joi.string().valid('generic').required(),
							key: Joi.string().required(),
							message: Joi.string().allow(''),
						}),
						Joi.object({
							type: Joi.string().valid('invalidSessionId', 'invalidApiKey').required(),
							message: Joi.string().allow('').required(),
						}),
					),
				}),
				Joi.object({
					type: Joi.string().valid('init').required(),
					payload: Joi.object({
						sessionId: Joi.string().required(),
						loginRawDigest: Joi.string().hex().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('login').required(),
					payload: Joi.object({
						connectionString: Joi.string().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('message').required(),
				}),
				Joi.object({
					type: Joi.string().valid('reconnect').required(),
				}),
				Joi.object({
					type: Joi.string().valid('disconnect').required(),
				}),
			)
			.required(),
	);

/**
 * Validates a TezosBeaconEvent object against predefined schemas.
 *
 * This function uses Joi to validate the provided value against two possible schemas:
 * - A schema for events of type 'message' with a required 'message' payload.
 * - A schema for events of type 'disconnect'.
 *
 * @param value - The TezosBeaconEvent object to validate.
 * @returns The validated TezosBeaconEvent object.
 *
 * @throws {ValidationError} If the provided value does not match any of the schemas.
 */
export const validateTezosBeaconEvent = (value: TezosBeaconEvent): TezosBeaconEvent =>
	validateSchema(
		value,
		Joi.alternatives().try(
			Joi.object({
				type: Joi.string().valid('message').required(),
				payload: Joi.object({
					message: Joi.string().required(),
				}),
			}),
			Joi.object({
				type: Joi.string().valid('disconnect').required(),
			}),
		),
	);

/**
 * Validates if the given value conforms to the PeerInfo structure.
 *
 * The PeerInfo structure includes the following properties:
 * - `type`: A string that must be 'p2p-pairing-response'.
 * - `id`: A required string representing the peer's ID.
 * - `name`: A required string representing the peer's name.
 * - `version`: A required string representing the version.
 * - `publicKey`: A required string representing the peer's public key.
 * - `relayServer`: A required string representing the relay server.
 * - `appUrl`: An optional string representing the application URL, which can be empty.
 * - `icon`: An optional string representing the icon URL, which can be empty.
 *
 * @param value - The value to validate.
 * @returns A boolean indicating whether the value is a valid PairingResponse.
 */
export const isPairingResponse = (value: unknown): value is PairingResponse =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('p2p-pairing-response').required(),
			id: Joi.string().required(),
			name: Joi.string().required(),
			version: Joi.string().required(),
			publicKey: Joi.string().required(),
			relayServer: Joi.string().required(),
			appUrl: Joi.string().allow(''),
			icon: Joi.string().allow(''),
		}),
	);

/**
 * Validates if the given value is a BaseMessage.
 *
 * A BaseMessage is an object that contains the following properties:
 * - `type`: A string that must be one of the following values:
 *   - 'permission_request'
 *   - 'sign_payload_request'
 *   - 'operation_request'
 *   - 'broadcast_request'
 *   - 'permission_response'
 *   - 'sign_payload_response'
 *   - 'operation_response'
 *   - 'broadcast_response'
 *   - 'disconnect'
 *   - 'error'
 *   - 'acknowledge'
 * - `version`: A required string representing the version.
 * - `id`: A required string representing the ID.
 * - `senderId`: A required string representing the sender ID.
 *
 * @param value - The value to validate.
 * @returns A boolean indicating whether the value is a BaseMessage.
 */
export const isBaseMessage = (value: unknown): value is BaseMessage =>
	validateType(
		value,
		Joi.object({
			type: Joi.string()
				.valid(
					'permission_request',
					'sign_payload_request',
					'operation_request',
					'broadcast_request',
					'permission_response',
					'sign_payload_response',
					'operation_response',
					'broadcast_response',
					'disconnect',
					'error',
					'acknowledge',
				)
				.required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
		}).options({ allowUnknown: true }),
	);

/**
 * Validates if the given value conforms to the `PermissionResponse` type.
 *
 * @param value - The value to be validated.
 * @returns A boolean indicating whether the value is a valid `PermissionResponse`.
 */
export const isPermissionResponse = (value: unknown): value is PermissionResponse =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('permission_response').required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
			publicKey: Joi.string().required(),
			network: Joi.object({
				type: Joi.string().valid('mainnet', 'carthagenet', 'custom', 'ghostnet').required(),
				name: Joi.string().allow(''),
				rpcUrl: Joi.string().allow(''),
			}).required(),
			scopes: Joi.array()
				.items(Joi.string().valid('sign', 'operation_request', 'threshold'))
				.required(),
			threshold: Joi.object({
				amount: Joi.string().required(),
				timeframe: Joi.string().required(),
			}),
			appMetadata: Joi.object({
				senderId: Joi.string().required(),
				name: Joi.string().required(),
				icon: Joi.string().allow(''),
			}),
		}),
	);

/**
 * Checks if the given value is an OperationResponse.
 *
 * @param value - The value to be checked.
 * @returns A boolean indicating whether the value is an OperationResponse.
 */
export const isOperationResponse = (value: unknown): value is OperationResponse =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('operation_response').required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
			transactionHash: Joi.string().required(),
		}),
	);

/**
 * Validates if the given value is a SignPayloadResponse.
 *
 * @param value - The value to validate.
 * @returns A boolean indicating whether the value is a SignPayloadResponse.
 */
export const isSignPayloadResponse = (value: unknown): value is SignPayloadResponse =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('sign_payload_response').required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
			signature: Joi.string().required(),
			signingType: Joi.string(), // 'raw'
		}),
	);

/**
 * Checks if the given value is a DisconnectMessage.
 *
 * @param value - The value to be checked.
 * @returns A boolean indicating whether the value is a DisconnectMessage.
 */
export const isDisconnectMessage = (value: unknown): value is DisconnectMessage =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('disconnect').required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
		}),
	);

/**
 * Checks if the given value is an ErrorResponse.
 *
 * This function validates the structure of the value to ensure it matches the expected
 * ErrorResponse schema using Joi validation.
 *
 * @param value - The value to be checked.
 * @returns A boolean indicating whether the value is an ErrorResponse.
 */
export const isErrorResponse = (value: unknown): value is ErrorResponse =>
	validateType(
		value,
		Joi.object({
			type: Joi.string().valid('error').required(),
			version: Joi.string().required(),
			id: Joi.string().required(),
			senderId: Joi.string().required(),
			errorType: Joi.string()
				.valid(
					'BROADCAST_ERROR',
					'NETWORK_NOT_SUPPORTED',
					'NO_ADDRESS_ERROR',
					'NO_PRIVATE_KEY_FOUND_ERROR',
					'NOT_GRANTED_ERROR',
					'PARAMETERS_INVALID_ERROR',
					'TOO_MANY_OPERATIONS',
					'TRANSACTION_INVALID_ERROR',
					'ABORTED_ERROR',
					'UNKNOWN_ERROR',
				)
				.required(),
		}),
	);
