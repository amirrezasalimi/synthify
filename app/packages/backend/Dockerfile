FROM oven/bun

WORKDIR /app

COPY package.json .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "run", "start"]

EXPOSE 3001