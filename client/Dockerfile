FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose port for Vite
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
