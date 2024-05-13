FROM node:latest

# Generate the .env file
ARG BACKEND_HOST


COPY package.json .

RUN npm i

COPY . .
RUN echo "BACKEND_HOST=$BACKEND_HOST" > .env

ENV NODE_ENV production

EXPOSE 1999

CMD ["npx", "partykit", "dev"]