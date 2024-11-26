FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY .eslintrc.* ./
COPY prettier.config.* ./

# Copy all package configurations first (for better caching)
COPY packages/*/package*.json ./packages/

# Copy all source files
COPY packages ./packages/

# Install dependencies at root level
RUN npm install

# Build all required packages in the correct order
RUN npm run build --workspace=@tconnect.io/core && \
    npm run build --workspace=@tconnect.io/dapp-utils && \
    npm run build --workspace=@tconnect.io/dapp-communication && \
    npm run build --workspace=@tconnect.io/evm-api-types && \
    npm run build --workspace=@tconnect.io/evm-provider && \
    npm run build --workspace=@tconnect.io/tezos-beacon-api-types && \
    npm run build --workspace=@tconnect.io/tezos-beacon-provider && \
    npm run build --workspace=@tconnect.io/tezos-wc-api-types && \
    npm run build --workspace=@tconnect.io/tezos-wc-provider && \
    npm run build --workspace=@tconnect.io/modal && \
    npm run build --workspace=telegram-mini-app

# Install serve
RUN npm install -g serve

# Set working directory to the built app
WORKDIR /app/packages/telegram-mini-app

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]