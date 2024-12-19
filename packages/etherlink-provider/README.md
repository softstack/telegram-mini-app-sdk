# @tconnect.io/etherlink-provider

EIP-1193 provider package for Telegram Mini App interaction with [Etherlink](https://www.etherlink.com) blockchain using the WalletConnect protocol.

## Documentation

For detailed documentation, visit our [official documentation](https://t-connect.gitbook.io).

## Installation

```bash
npm install @tconnect.io/etherlink-provider
```

## Example

```typescript
// Import provider
import { TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';

// ...

// Initialize provider
const provider = new TConnectEtherlinkProvider({
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
