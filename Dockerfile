FROM node:lts-alpine AS build-stage

RUN npm install -g npm@9.6.0
RUN apk add g++ make py3-pip
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# production
FROM nginx:stable-alpine AS production-stage
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]