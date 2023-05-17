# Base image
FROM node:19.4.0-alpine AS builder

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

# Copy source files
COPY . /app

# Build the application
RUN npm run build

# -----

# Production image
FROM node:19.4.0-alpine

# Set working directory
WORKDIR /app

# Install serve
RUN npm install -g next

# Copy over node modules and build from the 'builder' stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json

# Set environment variables
ENV NODE_ENV production

# Expose the listening port
EXPOSE 3000

# Start the application
CMD ["next", "start"]
