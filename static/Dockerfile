FROM node:14.10.1-stretch as build

RUN mkdir /app

WORKDIR /app

COPY ./templates/package.json /app
COPY ./templates/yarn.lock /app

RUN yarn install --prod

COPY ./templates/ /app

RUN yarn build

FROM nginx:1.19.2-alpine as runner

COPY ./static/server.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build /app/dist/* /app/
COPY --from=build /app/dist/*.* /app/

EXPOSE 80