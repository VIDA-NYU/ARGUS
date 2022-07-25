FROM node:16-slim AS build

RUN mkdir /src
WORKDIR /src
COPY frontend/package.json frontend/package-lock.json /src/
RUN npm install
COPY frontend /src/
RUN npm run build