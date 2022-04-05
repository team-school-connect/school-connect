# Dockerfile adapted from
# https://mherman.org/blog/dockerizing-a-react-app/

# Build the React app
# basically, this compiles the React jsx to static HTML and js files.
FROM node:14-alpine3.14 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm i
RUN npm install react-scripts@3.4.1 -g
COPY . ./
ENV PORT=80
ENV REACT_APP_API_URI=https://api.schoolconnect.tech
# This key is restricted
ENV REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyDTihwgzYdvRceQS9A_D_9DT_AOve3H1uc
RUN npm run build

# Serve these static files with NGINX.
FROM nginx:1.21.6-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
