# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies (required for some python packages like asyncpg if building from source, though wheels usually exist)
RUN apt-get update \
    && apt-get install -y gcc \
    && apt-get clean

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Expose the port (Railway uses the PORT environment variable)
EXPOSE $PORT

# Command to run the application using uvicorn, dynamically binding to the port Railway assigns
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
