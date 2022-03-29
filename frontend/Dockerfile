# Dockerfile adapted from
# https://mherman.org/blog/dockerizing-a-react-app/

# Build the React app
# basically, this compiles the React jsx to static HTML and js files.
FROM node:14-alpine3.14 as build
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
RUN npm i
RUN npm install react-scripts@3.4.1 -g
RUN export PORT=80
RUN npm run build

# Serve these static files with NGINX.
FROM nginx:1.21.6-alpine
COPY --from=build /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
