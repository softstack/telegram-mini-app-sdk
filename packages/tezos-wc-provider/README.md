# @tconnect.io/tezos-wc-provider

Taquito wallet provider package for Telegram Mini App interaction with [Tezos](https://tezos.com) blockchain using the WalletConnect protocol.

## Documentation

For detailed documentation, visit our [official documentation](https://t-connect.gitbook.io).

## Installation

```bash
npm install @tconnect.io/tezos-wc-provider
```

## Example

```typescript
// Import provider
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';

// ...

// Initialize provider
const provider = new TConnectTezosWcProvider({
	appName: 'your_app_name',
	appUrl: 'https://...',
	bridgeUrl: 'https://tconnect.io',
	apiKey: 'your_api_key',
	network: 'mainnet',
});

// Connect to wallet
await provider.permissionRequest();
```

## License

[MIT License](./LICENSE.txt)
