FROM node:20-alpine

WORKDIR /app

COPY . .
# Install dependencies
RUN npm install

# Define build arguments
ARG HOST
ARG GENERATE_SOURCEMAP
ARG REACT_APP_APP_URL
ARG REACT_APP_API_KEY
ARG REACT_APP_BRIDGE_URL

# Set environment variables from build arguments
ENV HOST=${HOST}
ENV GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP}
ENV REACT_APP_APP_URL=${REACT_APP_APP_URL}
ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
ENV REACT_APP_BRIDGE_URL=${REACT_APP_BRIDGE_URL}

# Build the packages in correct order
RUN npm run build --workspace=@tconnect.io/etherlink-api-types
RUN npm run build --workspace=@tconnect.io/tezos-beacon-api-types
RUN npm run build --workspace=@tconnect.io/tezos-wc-api-types
RUN npm run build --workspace=@tconnect.io/dapp-utils
RUN npm run build --workspace=@tconnect.io/core
RUN npm run build --workspace=@tconnect.io/dapp-communication
RUN npm run build --workspace=@tconnect.io/etherlink-provider
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