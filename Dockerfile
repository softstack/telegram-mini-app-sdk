FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy workspace config files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY packages/telegram-mini-app/package*.json ./packages/telegram-mini-app/
COPY packages/telegram-mini-app/tsconfig.json ./packages/telegram-mini-app/
COPY packages/telegram-mini-app/craco.config.ts ./packages/telegram-mini-app/

# Install root dependencies first
RUN npm install

# Copy all source files
COPY packages/telegram-mini-app ./packages/telegram-mini-app/

# Build the telegram mini app using workspace
RUN npm run build --workspace=telegram-mini-app

# Install serve
RUN npm install -g serve

# Set working directory to the built app
WORKDIR /app/packages/telegram-mini-app

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]