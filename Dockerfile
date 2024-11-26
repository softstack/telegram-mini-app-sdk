FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/*/package*.json ./packages/
COPY packages/*/tsconfig*.json ./packages/

# Install dependencies
RUN npm i

COPY . .

# Build the packages in correct order
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:telegram-mini-app"]