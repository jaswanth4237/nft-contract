# Use Node.js lightweight base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY hardhat.config.js ./

# Install dependencies
RUN npm install

# Pre-download Solidity compiler 0.8.20
RUN npx hardhat compile || true

# Copy project files
COPY contracts ./contracts
COPY test ./test

# Run tests by default
CMD ["npx", "hardhat", "test"]
