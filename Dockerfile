FROM node:alpine3.19 as depens
ENV APP=/app
WORKDIR ${APP}
COPY package.json ${APP}
RUN yarn

FROM node:alpine3.19 as build
ENV APP=/app
WORKDIR ${APP}
COPY --from=depens ${APP}/node_modules ${APP}/node_modules
COPY . ${APP}
RUN yarn build

FROM node:alpine3.19 as running
EXPOSE ${PORT}
ENV APP=/app
WORKDIR ${APP}
COPY package.json ${APP}
COPY --from=build ${APP}/dist ${APP}/src
RUN yarn --prod
CMD [ "node","src/main" ]