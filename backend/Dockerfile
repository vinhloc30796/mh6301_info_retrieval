FROM python:3.8.10-slim-buster

# Get latest root certificates
# RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates
RUN apt-get update && apt-get -y install libpq-dev gcc

# Install requirements.txt
COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

ENV PYTHONUNBUFFERED=1 PYTHONHASHSEED=random PYTHONDONTWRITEBYTECODE=1

# Copy the application
COPY . /app
WORKDIR /app
