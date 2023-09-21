FROM node:18-alpine as base
RUN npm i -g typescript
RUN npm i -g nodemon
RUN npm i -g ts-node
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .

FROM base as dev
CMD [ "yarn", "run", "dev" ]

FROM base as build
RUN yarn run build

FROM node:18-alpine as prod
WORKDIR /app
COPY package.json .
RUN yarn install --production
COPY --from=build ./app/build ./build
CMD [ "yarn", "start" ]