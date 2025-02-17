FROM oven/bun:1

ARG PORT
ARG MONGO_URI
ARG CORS_ORIGIN

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

ENV PORT=${PORT:-3000}
ENV MONGO_URI=${MONGO_URI}
ENV CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:4200}
EXPOSE 3000

CMD ["bun", "src/index.ts"]
