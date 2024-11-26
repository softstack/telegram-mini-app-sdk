FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy source code
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build","-l","3000"]