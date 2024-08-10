#!/bin/bash

# Clear the .dockerignore files
truncate -s 0 ./backend/.dockerignore 
truncate -s 0 ./frontend/.dockerignore
# truncate -s 0 ./nginx/.dockerignore
 

# Copy backend prod files into .dockerignore file
echo "./django_dockerfile/Dockerfile.prod" >> ./backend/.dockerignore
echo "./entrypoint.prod.sh" >> ./backend/.dockerignore
echo "fire_env" >> ./backend/.dockerignore
echo "./.gitinore" >> ./backend/.dockerignore

#Copy nginx prod files in .dockerignore
echo "./nginx_config/nginx.prod.conf" >> ./frontend/.dockerignore
echo "./nginx_dockerfile/Dockerfile.prod" >> ./frontend/.dockerignore


# Copy frontend prod files into .dockerignore file
echo "./react_dockerfile/Dockerfile.prod" >> ./frontend/.dockerignore
echo "./nginx/nginx.prod.conf" >> ./frontend/.dockerignore
echo "./entrypoint.prod.sh" >> ./frontend/.dockerignore
echo "node_modules" >> ./frontend/.dockerignore
echo "./.gitinore" >> ./frontend/.dockerignore

# Update the env-config with the enironment variables
sh ./frontend/entrypoint.dev.sh

# Stop the dev container and rebuild using production configuration
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
