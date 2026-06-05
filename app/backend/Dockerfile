# Stage 1: Build the application on a reliable Debian-based image
FROM node:18-slim AS builder

# Install standard Debian packages for Chromium
RUN apt-get update \
    && apt-get install -y \
    chromium \
    # All the necessary dependencies for Chromium to run headlessly
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

WORKDIR /usr/src/app

# Tell Puppeteer to NOT download its own version of Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Stage 2: Create the production image
FROM node:18-slim

# Install only the necessary runtime dependencies for the system-installed Chromium
RUN apt-get update && apt-get install -y --no-install-recommends chromium

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app .

USER node

# We don't need to set the path here, we will do it in the code for clarity.

EXPOSE 3000

CMD ["npm", "run", "start"]