FROM node:20-alpine

WORKDIR /app

COPY . .
# Install dependencies
RUN npm install

# Build the packages in correct order
RUN npm run build --workspace=@tconnect.io/evm-api-types
RUN npm run build --workspace=@tconnect.io/tezos-beacon-api-types
RUN npm run build --workspace=@tconnect.io/tezos-wc-api-types
RUN npm run build --workspace=@tconnect.io/dapp-utils
RUN npm run build --workspace=@tconnect.io/core
RUN npm run build --workspace=@tconnect.io/dapp-communication
RUN npm run build --workspace=@tconnect.io/evm-provider
RUN npm run build --workspace=@tconnect.io/tezos-beacon-provider
RUN npm run build --workspace=@tconnect.io/tezos-wc-provider
RUN npm run build --workspace=@tconnect.io/modal
RUN npm run build --workspace=telegram-mini-app

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:telegram-mini-app"]