FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

# Copy Prisma schema BEFORE install (important)
COPY prisma ./prisma

RUN npm install

COPY . .
