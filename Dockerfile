FROM node:20-alpine

WORKDIR /app

COPY . .

# Install dependencies at root level
RUN npm install

RUN npm run build
# Install serve
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start serve from the build directory
CMD ["npm", "run","start:telegram-mini-app"]