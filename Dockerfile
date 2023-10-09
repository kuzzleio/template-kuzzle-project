FROM kuzzleio/kuzzle-runner:18 AS builder

ADD . /var/app

WORKDIR /var/app

RUN npm ci
RUN npm run build

FROM kuzzleio/kuzzle-runner:18 AS prepare

WORKDIR /var/app
ENV NODE_ENV=production

COPY --from=builder /var/app/package*.json /var/app/.npmrc* /var/app/dist ./
RUN npm install --production

# Final image
FROM node:18-stretch-slim AS production

ARG KUZZLE_VAULT_KEY
ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY

ENV NODE_ENV=production

WORKDIR /var/app

COPY --from=prepare /var/app/ ./

CMD [ "node", "app.js" ]
