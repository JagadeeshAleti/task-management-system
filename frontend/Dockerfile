# Stage 1: Build the app using a smaller Node image
FROM node:16.15.1-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for efficient caching
COPY package.json .

# Install dependencies
RUN npm install

# Copy all the app files
COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Command to run your app
CMD [ "npm", "run", "dev" ]