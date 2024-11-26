FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all source files
COPY . .

# Install root dependencies first
RUN npm install

# Build the telegram mini app using workspace
RUN npm run build

# Install serve
RUN npm install -g serve

# Set working directory to the built app
WORKDIR /app/packages/telegram-mini-app

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]