#!/bin/bash

# Clear the .dockerignore files
truncate -s 0 ./backend/.dockerignore 
truncate -s 0 ./frontend/.dockerignore 
truncate -s 0 ./nginx/.dockerignore

# Append backend dev files to .dockerignore file
echo "./django_dockerfile/Dockerfile.dev" >> ./backend/.dockerignore
echo "./entrypoint.dev.sh" >> ./backend/.dockerignore
echo "fire_env" >> ./backend/.dockerignore
echo "./.gitinore" >> ./backend/.dockerignore

#Copy nginx dev files in .dockerignore
echo "./nginx_config/nginx.dev.conf" >> ./nginx/.dockerignore
echo "./nginx_dockerfile/Dockerfile.dev" >> ./nginx/.dockerignore


# Append frontend dev files to .dockerignore file
echo "./react_dockerfile/Dockerfile.dev" >> ./frontend/.dockerignore
echo "./nginx/nginx.dev.conf" >> ./frontend/.dockerignore
echo "./entrypoint.dev.sh" >> ./frontend/.dockerignore
echo "node_modules" >> ./frontend/.dockerignore
echo "./.gitinore" >> ./frontend/.dockerignore

# Update the env-config with the enironment variables
sh ./frontend/entrypoint.prod.sh

# Stop the prod container and rebuild using the development configuration
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build
