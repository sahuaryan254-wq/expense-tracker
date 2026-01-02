FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (matches internal port in docker-compose)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
