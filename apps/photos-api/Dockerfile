FROM node:9.3-alpine

WORKDIR /usr/src/app

ADD package.json .

# Install deps since node_modules is ignored and cannot be added
RUN yarn install

# App is mounted through volume
ENTRYPOINT ["npm", "run", "start:dev"]
