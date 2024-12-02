# @tconnect.io/evm-provider

EIP-1193 provider package for Telegram Mini App interaction with [Etherlink](https://www.etherlink.com) blockchain using the WalletConnect protocol.

## Documentation

For detailed documentation, visit our [official documentation](https://t-connect.gitbook.io).

## Installation

```bash
npm install @tconnect.io/evm-provider
```

## Example

```typescript
// Import provider
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';

// ...

// Initialize provider
const provider = new TConnectEvmProvider({
	appName: 'your_app_name',
	appUrl: 'https://...'
	bridgeUrl: 'https://tconnect.io',
	apiKey: 'your_api_key',
});

// Connect to wallet
await provider.connect();
```

## License

[MIT License](./LICENSE.txt)
