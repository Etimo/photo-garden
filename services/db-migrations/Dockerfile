FROM node:9.3-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN yarn install

COPY . .

# Run migrations
#RUN ./node_modules/.bin/sequelize db:migrate

CMD ["./node_modules/.bin/sequelize", "db:migrate"]
