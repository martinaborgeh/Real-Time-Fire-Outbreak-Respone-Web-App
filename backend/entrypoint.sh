#!/bin/bash

# Exit on any error
set -e

# Activate the virtual environment
source /app/venv/bin/activate

export PYTHONPATH=/app/fire_outbreak_project

echo $PYTHONPATH
# Set environment variable for Django settings module
export DJANGO_SETTINGS_MODULE=fire_outbreak_project.settings


# Wait for the database to be ready
until pg_isready -h $DB_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "Waiting for database..."
  sleep 2
done

# Apply database migrations
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py createcachetable


# Start Gunicorn with the specified configuration
gunicorn --access-logfile - --workers 3 --threads 3 --worker-connections=1000 --bind 0.0.0.0:8000 fire_outbreak_project.wsgi:application
