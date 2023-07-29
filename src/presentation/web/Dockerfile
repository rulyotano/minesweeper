FROM node:16.20.1-alpine3.18 as base
ENV NODE_ENV=development
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node ["package.json", "yarn.lock",  "./"]
RUN yarn --frozen-lockfile --silent && yarn cache clean

FROM base as source
COPY --chown=node:node . .

FROM source as dev
EXPOSE 3000
ENV PATH=/app/node_modules/.bin:$PATH
CMD ["yarn", "start"]

FROM dev as test
CMD yarn lint && yarn test

FROM source as build
RUN yarn build

FROM httpd:alpine3.18 as prod
EXPOSE 80
RUN apk add libcap && chown -hR www-data:www-data /usr/local/apache2/ && \
  setcap 'cap_net_bind_service=+ep' /usr/local/apache2/bin/httpd
USER "www-data"
COPY --from=build --chown=www-data:www-data /app/build /usr/local/apache2/htdocs/