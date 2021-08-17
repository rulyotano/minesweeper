# pull official base image
FROM node:16-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ["package.json", "./"]
COPY ["yarn.lock", "./"]
RUN yarn --silent
COPY . .
CMD ["yarn", "start"]