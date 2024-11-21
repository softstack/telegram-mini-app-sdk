import { validateSchema, validateType } from '@tconnect.io/core';
import { TezosBeaconErrorResponse, TezosBeaconEvent, TezosBeaconResponse } from '@tconnect.io/tezos-beacon-api-types';
import Joi from 'joi';
import {
	BaseMessage,
	DisconnectMessage,
	ErrorResponse,
	OperationResponse,
	PeerInfo,
	PermissionResponse,
	SignPayloadResponse,
} from './types';

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

export const isPeerInfo = (value: unknown): value is PeerInfo =>
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
