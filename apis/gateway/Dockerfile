FROM node:9.3-alpine

WORKDIR /usr/src/app

ADD package.json .
RUN yarn install --production

ENTRYPOINT ["yarn", "run", "start:prod"]
