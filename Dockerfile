# syntax=docker/dockerfile:1.2

FROM quay.io/ukhomeofficedigital/asl-base:v16

RUN apk upgrade --no-cache

COPY .npmrc /app/.npmrc
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN --mount=type=secret,id=token \
    --mount=type=secret,id=username \
    NPM_AUTH_USERNAME=`cat /run/secrets/username` \
    NPM_AUTH_TOKEN=`cat /run/secrets/token` \
    npm ci --production --no-optional --ignore-scripts

COPY . /app

RUN rm /app/.npmrc

USER 999

CMD npm run migrate
