# @tconnect.io/tezos-beacon-provider

Taquito wallet provider package for Telegram Mini App interaction with [Tezos](https://tezos.com) blockchain using the Beacon protocol.

## Documentation

For detailed documentation, visit our [official documentation](https://t-connect.gitbook.io).

## Installation

```bash
npm install @tconnect.io/tezos-beacon-provider
```

## Example

```typescript
// Import provider
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';

// ...

// Initialize provider
const provider = new TConnectTezosBeaconProvider({
	appName: 'your_app_name',
	appUrl: 'https://...',
	bridgeUrl: 'https://tconnect.io',
	secretSeed: 'your_secret_seed',
	apiKey: 'your_api_key',
	network: { type: 'mainnet' },
});

// Connect to wallet
await provider.permissionRequest();
```

## License

[MIT License](./LICENSE.txt)
