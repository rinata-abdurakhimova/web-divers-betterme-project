FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start compiled app
CMD ["node", "dist/index.js"]