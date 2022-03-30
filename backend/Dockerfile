# Dockerfile adapted from
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install

# Bundle app source
COPY . ./

ARG SECRET
ARG ORIGIN
ARG DB_CONNECTION_STRING

ENV SECRET=$SECRET
ENV ORIGIN=$ORIGIN
ENV DB_CONNECTION_STRING=$DB_CONNECTION_STRING

EXPOSE 3000
CMD [ "node", "app.js" ]