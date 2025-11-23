FROM node:18-alpine

# Set working directory
WORKDIR /app

# Ensure the dev server is reachable from host
ENV HOST=0.0.0.0
ENV NODE_ENV=development

# Copy dependency manifests first for better caching
COPY package*.json ./

# Install deps
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose default Next.js port
EXPOSE 3000

# Start dev server (use `npm start` in production if defined)
CMD ["npm", "run", "dev"]
