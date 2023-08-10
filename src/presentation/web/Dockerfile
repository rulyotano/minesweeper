FROM node:16.20.1-alpine3.18 as base
ENV NODE_ENV=development
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node ["package.json", "yarn.lock",  "./"]
RUN yarn --frozen-lockfile --silent && yarn cache clean

FROM base as source
COPY --chown=node:node . .

FROM source as dev
EXPOSE 3000
ENV PATH=/app/node_modules/.bin:$PATH
ENV CI=true
CMD ["yarn", "start"]

FROM dev as test
CMD yarn lint && yarn test

FROM source as build
RUN yarn build