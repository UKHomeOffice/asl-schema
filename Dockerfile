FROM quay.io/ukhomeofficedigital/nodejs-base:v8

RUN npm install -g npm@6

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci --production --no-optional
COPY . /app

RUN rm /app/.npmrc

USER 999

CMD npm run migrate && touch /app/alive
