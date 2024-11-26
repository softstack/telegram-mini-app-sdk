FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY packages/*/package*.json ./packages/
COPY packages/*/tsconfig*.json ./packages/

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the packages in correct order
RUN npm run build:clean || true \
    && cd packages/evm-api-types && npm run build \
    && cd ../tezos-beacon-api-types && npm run build \
    && cd ../tezos-wc-api-types && npm run build \
    && cd ../core && npm run build \
    && cd ../dapp-utils && npm run build \
    && cd ../modal && npm run build \
    && cd ../telegram-mini-app && npm run build

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:telegram-mini-app"]