FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root level config files
COPY tsconfig.base.json ./

# Copy the telegram mini app package
COPY packages/telegram-mini-app ./packages/telegram-mini-app/

# Install dependencies
RUN cd packages/telegram-mini-app && npm install && npm run build

# Install serve
RUN npm install -g serve

# Set working directory to the built app
WORKDIR /app/packages/telegram-mini-app

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]