FROM node:18-alpine
# Install build dependencies and MySQL client
RUN apk add --no-cache \
    build-base \
    mysql-client
# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present) to the working directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY backend/ .

# Expose port 5000 for the application
EXPOSE 5000

# Define the command to run your application
CMD ["npm", "start"]


#building the image: docker build -t stackmasters-webapp .
