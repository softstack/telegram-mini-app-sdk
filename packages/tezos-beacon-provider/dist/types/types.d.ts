export type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;
export type TezosBeaconWalletApp = 'altme' | 'kukai' | 'temple' | '_generic_';
export interface SerializedTConnectTezosBeaconProvider {
    appName: string;
    appUrl: string;
    appIcon: string | undefined;
    network: Network;
    bridgeUrl: string;
    walletApp: TezosBeaconWalletApp | undefined;
    _secretSeed: string;
    _apiKey: string;
    _genericWalletUrl: string;
    _communicationController: string;
    _sessionId: string;
    _otherPublicKey: Buffer;
    _publicKey: string;
}
export interface TConnectTezosBeaconProviderOptions {
    appName: string;
    appUrl: string;
    appIcon?: string;
    bridgeUrl: string;
    secretSeed: string;
    apiKey: string;
    network: Network;
    walletApp?: TezosBeaconWalletApp;
}
export interface TConnectTezosBeaconProviderEvents {
    connectionString: string;
    disconnect: undefined;
}
export interface PairingResponse {
    type: 'p2p-pairing-response';
    id: string;
    name: string;
    version: string;
    publicKey: string;
    relayServer: string;
    appUrl?: string;
    icon?: string;
}
export type MessageType = 'permission_request' | 'sign_payload_request' | 'operation_request' | 'broadcast_request' | 'permission_response' | 'sign_payload_response' | 'operation_response' | 'broadcast_response' | 'disconnect' | 'error' | 'acknowledge';
export type NetworkType = 'mainnet' | 'carthagenet' | 'custom' | 'ghostnet';
export type PermissionScope = 'sign' | 'operation_request' | 'threshold';
export type TezosOperationType = 'origination' | 'delegation' | 'reveal' | 'transaction' | 'activate_account' | 'endorsement' | 'seed_nonce_revelation' | 'double_endorsement_evidence' | 'double_baking_evidence' | 'proposals' | 'ballot' | 'attestation' | 'preattestation' | 'preendorsement' | 'set_deposits_limit' | 'double_preattestation_evidence' | 'double_preendorsement_evidence' | 'attestation_with_slot' | 'endorsement_with_slot' | 'double_attestation_evidence' | 'failing_noop' | 'register_global_constant' | 'transfer_ticket' | 'increase_paid_storage' | 'update_consensus_key' | 'drain_delegate' | 'vdf_revelation' | 'event' | 'ticket_updates' | 'smart_rollup_originate' | 'smart_rollup_add_messages' | 'smart_rollup_execute_outbox_message' | 'smart_rollup_publish' | 'smart_rollup_cement' | 'smart_rollup_recover_bond' | 'smart_rollup_refute' | 'smart_rollup_timeout' | 'dal_publish_commitment';
export type ErrorType = 'BROADCAST_ERROR' | 'NETWORK_NOT_SUPPORTED' | 'NO_ADDRESS_ERROR' | 'NO_PRIVATE_KEY_FOUND_ERROR' | 'NOT_GRANTED_ERROR' | 'PARAMETERS_INVALID_ERROR' | 'TOO_MANY_OPERATIONS' | 'TRANSACTION_INVALID_ERROR' | 'ABORTED_ERROR' | 'UNKNOWN_ERROR';
export type SigningType = 'raw' | 'operation' | 'micheline';
export interface AppMetadata {
    senderId: string;
    name: string;
    icon?: string;
}
export interface Network {
    type: NetworkType;
    name?: string;
    rpcUrl?: string;
}
export interface TezosBaseOperation {
    kind: TezosOperationType;
}
export interface TezosActivateAccountOperation extends TezosBaseOperation {
    kind: 'activate_account';
    pkh: string;
    secret: string;
}
export interface TezosBallotOperation extends TezosBaseOperation {
    kind: 'ballot';
    source: string;
    period: string;
    proposal: string;
    ballot: 'nay' | 'yay' | 'pass';
}
export interface TezosBlockHeader {
    level: number;
    proto: number;
    predecessor: string;
    timestamp: string;
    validation_pass: number;
    operations_hash: string;
    fitness: string[];
    context: string;
    priority: number;
    proof_of_work_nonce: string;
    signature: string;
}
export interface TezosDoubleBakingEvidenceOperation extends TezosBaseOperation {
    kind: 'double_baking_evidence';
    bh1: TezosBlockHeader;
    bh2: TezosBlockHeader;
}
export interface TezosEndorsementOperation extends TezosBaseOperation {
    kind: 'endorsement';
    level: string;
}
export interface TezosProposalOperation extends TezosBaseOperation {
    kind: 'proposals';
    period: string;
    proposals: string[];
}
export interface TezosSeedNonceRevelationOperation extends TezosBaseOperation {
    kind: 'seed_nonce_revelation';
    level: string;
    nonce: string;
}
export interface TezosDelegationOperation extends TezosBaseOperation {
    kind: 'delegation';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    delegate?: string;
}
export interface TezosOriginationOperation extends TezosBaseOperation {
    kind: 'origination';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    balance: string;
    delegate?: string;
    script: string;
}
export interface TezosRevealOperation extends TezosBaseOperation {
    kind: 'reveal';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    public_key: string;
}
export interface TezosIncreasePaidStorageOperation extends TezosBaseOperation {
    kind: 'increase_paid_storage';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    amount: string;
    destination: string;
}
export interface TezosTransferTicketOperation extends TezosBaseOperation {
    kind: 'transfer_ticket';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    ticket_contents: MichelineMichelsonV1Expression;
    ticket_ty: MichelineMichelsonV1Expression;
    ticket_ticketer: string;
    ticket_amount: string;
    destination: string;
    entrypoint: string;
}
export type MichelsonPrimitives = 'ADD' | 'IF_NONE' | 'SWAP' | 'set' | 'nat' | 'CHECK_SIGNATURE' | 'IF_LEFT' | 'LAMBDA' | 'Elt' | 'CREATE_CONTRACT' | 'NEG' | 'big_map' | 'map' | 'or' | 'BLAKE2B' | 'bytes' | 'SHA256' | 'SET_DELEGATE' | 'CONTRACT' | 'LSL' | 'SUB' | 'IMPLICIT_ACCOUNT' | 'PACK' | 'list' | 'PAIR' | 'Right' | 'contract' | 'GT' | 'LEFT' | 'STEPS_TO_QUOTA' | 'storage' | 'TRANSFER_TOKENS' | 'CDR' | 'SLICE' | 'PUSH' | 'False' | 'SHA512' | 'CHAIN_ID' | 'BALANCE' | 'signature' | 'DUG' | 'SELF' | 'EMPTY_BIG_MAP' | 'LSR' | 'OR' | 'XOR' | 'lambda' | 'COMPARE' | 'key' | 'option' | 'Unit' | 'Some' | 'UNPACK' | 'NEQ' | 'INT' | 'pair' | 'AMOUNT' | 'DIP' | 'ABS' | 'ISNAT' | 'EXEC' | 'NOW' | 'LOOP' | 'chain_id' | 'string' | 'MEM' | 'MAP' | 'None' | 'address' | 'CONCAT' | 'EMPTY_SET' | 'MUL' | 'LOOP_LEFT' | 'timestamp' | 'LT' | 'UPDATE' | 'DUP' | 'SOURCE' | 'mutez' | 'SENDER' | 'IF_CONS' | 'RIGHT' | 'CAR' | 'CONS' | 'LE' | 'NONE' | 'IF' | 'SOME' | 'GET' | 'Left' | 'CAST' | 'int' | 'SIZE' | 'key_hash' | 'unit' | 'DROP' | 'EMPTY_MAP' | 'NIL' | 'DIG' | 'APPLY' | 'bool' | 'RENAME' | 'operation' | 'True' | 'FAILWITH' | 'parameter' | 'HASH_KEY' | 'EQ' | 'NOT' | 'UNIT' | 'Pair' | 'ADDRESS' | 'EDIV' | 'CREATE_ACCOUNT' | 'GE' | 'ITER' | 'code' | 'AND';
export type MichelineMichelsonV1Expression = {
    int: string;
} | {
    string: string;
} | {
    bytes: string;
} | MichelineMichelsonV1Expression[] | {
    prim: MichelsonPrimitives;
    args?: MichelineMichelsonV1Expression[];
    annots?: string[];
};
export interface TezosTransactionParameters {
    entrypoint: 'default' | 'root' | 'do' | 'set_delegate' | 'remove_delegate' | string;
    value: MichelineMichelsonV1Expression;
}
export interface TezosTransactionOperation extends TezosBaseOperation {
    kind: 'transaction';
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
    amount: string;
    destination: string;
    parameters?: TezosTransactionParameters;
}
export type OmittedTezosOperationProps = 'source' | 'fee' | 'counter' | 'gas_limit' | 'storage_limit';
export type PartialTezosDelegationOperation = Optional<TezosDelegationOperation, OmittedTezosOperationProps>;
export type PartialTezosOriginationOperation = Optional<TezosOriginationOperation, OmittedTezosOperationProps>;
export type PartialTezosRevealOperation = Optional<TezosRevealOperation, OmittedTezosOperationProps>;
export type PartialTezosTransactionOperation = Optional<TezosTransactionOperation, OmittedTezosOperationProps>;
export type PartialTezosIncreasePaidStorageOperation = Optional<TezosIncreasePaidStorageOperation, OmittedTezosOperationProps>;
export type PartialTezosTransferTicketOperation = Optional<TezosTransferTicketOperation, OmittedTezosOperationProps>;
export type PartialTezosOperation = TezosActivateAccountOperation | TezosBallotOperation | PartialTezosDelegationOperation | TezosDoubleBakingEvidenceOperation | TezosEndorsementOperation | PartialTezosOriginationOperation | TezosProposalOperation | PartialTezosRevealOperation | TezosSeedNonceRevelationOperation | PartialTezosTransactionOperation | PartialTezosIncreasePaidStorageOperation;
export interface BaseMessage {
    type: MessageType;
    version: string;
    id: string;
    senderId: string;
}
export interface PermissionRequest extends BaseMessage {
    type: 'permission_request';
    appMetadata: AppMetadata;
    network: Network;
    scopes: Array<PermissionScope>;
}
export interface PermissionResponse extends BaseMessage {
    type: 'permission_response';
    publicKey: string;
    network: Network;
    scopes: Array<PermissionScope>;
    threshold?: {
        amount: string;
        timeframe: string;
    };
    appMetadata?: AppMetadata;
}
export interface OperationRequest extends BaseMessage {
    type: 'operation_request';
    network: Network;
    operationDetails: PartialTezosOperation[];
    sourceAddress: string;
}
export interface OperationResponse extends BaseMessage {
    type: 'operation_response';
    transactionHash: string;
}
export interface SignPayloadRequest extends BaseMessage {
    type: 'sign_payload_request';
    payload: string;
    sourceAddress: string;
    signingType: SigningType;
}
export interface SignPayloadResponse extends BaseMessage {
    type: 'sign_payload_response';
    signature: string;
    signingType?: SigningType;
}
export interface DisconnectMessage extends BaseMessage {
    type: 'disconnect';
}
export interface ErrorResponse extends BaseMessage {
    type: 'error';
    errorType: ErrorType;
}
export type IgnoredRequestInputProperties = 'id' | 'senderId' | 'version';
export type PermissionRequestInput = Omit<PermissionRequest, Exclude<IgnoredRequestInputProperties, 'id'>>;
export type OperationRequestInput = Omit<OperationRequest, IgnoredRequestInputProperties>;
export type SignPayloadRequestInput = Omit<SignPayloadRequest, IgnoredRequestInputProperties>;
export type DisconnectMessageInput = Omit<DisconnectMessage, IgnoredRequestInputProperties>;
export interface RequestSignPayloadInput {
    signingType?: SigningType;
    payload: string;
    sourceAddress?: string;
}
