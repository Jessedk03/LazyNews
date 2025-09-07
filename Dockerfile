FROM node:18-alpine AS build

WORKDIR /app

# Copy only dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
