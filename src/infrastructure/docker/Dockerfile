# Use a base Node.js image
FROM node:20-bullseye

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@10.5.1

# Install node-gyp globally (tool for compiling native modules)
RUN npm install -g node-gyp

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Copy the .env file
COPY .env ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Rebuild bcrypt specifically for the current architecture
RUN npm rebuild bcrypt --build-from-source

# Rebuild common native modules
RUN npm rebuild argon2 --build-from-source || true && \
    npm rebuild sqlite3 --build-from-source || true && \
    npm rebuild sharp --build-from-source || true

# Generate Prisma Client
RUN npx prisma generate --schema=src/infrastructure/orm/schema.prisma

# Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["pnpm", "dev"]
