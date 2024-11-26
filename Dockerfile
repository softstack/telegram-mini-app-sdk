FROM node:18-alpine

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY .eslintrc.* ./
COPY prettier.config.* ./

# Copy all package configurations first (for better caching)
COPY packages/telegram-mini-app/package*.json ./packages/telegram-mini-app/
COPY packages/core/package*.json ./packages/core/
COPY packages/dapp-utils/package*.json ./packages/dapp-utils/
COPY packages/dapp-communication/package*.json ./packages/dapp-communication/
COPY packages/evm-api-types/package*.json ./packages/evm-api-types/
COPY packages/evm-provider/package*.json ./packages/evm-provider/
COPY packages/tezos-beacon-api-types/package*.json ./packages/tezos-beacon-api-types/
COPY packages/tezos-beacon-provider/package*.json ./packages/tezos-provider/
COPY packages/tezos-wc-api-types/package*.json ./packages/tezos-wc-api-types/
COPY packages/tezos-wc-provider/package*.json ./packages/tezos-wc-provider/

# Copy all source files
COPY packages/core ./packages/core/
COPY packages/dapp-utils ./packages/dapp-utils/
COPY packages/dapp-communication ./packages/dapp-communication/
COPY packages/evm-api-types ./packages/evm-api-types/
COPY packages/evm-provider ./packages/evm-provider/
COPY packages/tezos-beacon-api-types ./packages/tezos-beacon-api-types/
COPY packages/tezos-beacon-provider ./packages/tezos-provider/
COPY packages/tezos-wc-api-types ./packages/tezos-wc-api-types/
COPY packages/tezos-wc-provider ./packages/tezos-wc-provider/
COPY packages/telegram-mini-app ./packages/telegram-mini-app/

# Install dependencies at root level
RUN npm install

# Build only the telegram mini app
RUN npm run build --workspace=telegram-mini-app

# Install serve
RUN npm install -g serve

# Set working directory to the built app
WORKDIR /app/packages/telegram-mini-app

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]