FROM node:21.7.1 AS build
# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY ./package*.json /app/

# Install dependencies
RUN npm install --no-cache

# Copy the rest of the application code into the container
COPY . /app/

# Build the React application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/nginx.conf





