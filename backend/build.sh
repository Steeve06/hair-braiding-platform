#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Install dependencies
pip install -r requirements.txt

# 2. Collect Static Files (Do this before migrations to catch path errors early)
# Removed '|| true' so we know if it actually fails
python manage.py collectstatic --no-input

# 3. Handle Database Schema
# makemigrations should be run locally and committed, NOT on Render.
# migrate applies whatever committed migration files exist.
python manage.py migrate

# 4. Create Admin
# Adding a check here: if create_admin.py is not in the root of backend,
# it might fail. Ensure the path is correct.
if [ -f "create_admin.py" ]; then
    python create_admin.py
fi

echo "Build Process Completed Successfully"