FROM node:16-slim AS build

WORKDIR /src

COPY package*.json ./
RUN npm install --force
COPY . ./
RUN npm run build

# production env
FROM nginx:stable-alpine
COPY --from=build /src/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
