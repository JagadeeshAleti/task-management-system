# Assuming you're using Node.js in the Dockerfile
FROM node:18.17.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (this will install bcrypt for the correct platform)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port and start the server
EXPOSE 7000
CMD ["npm", "start"]
