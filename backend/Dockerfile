# Dockerfile adapted from
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Create app directory
WORKDIR /usr/src/app

RUN npm install

EXPOSE 3000
CMD [ "node", "app.js" ]