FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./

# Copy Prisma schema BEFORE install (important)
COPY prisma ./prisma

RUN npm install

FROM deps AS dev
COPY . .

EXPOSE 2000

CMD ["npm", "run", "dev"]
