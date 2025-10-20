# Builder stage
FROM kuzzleio/kuzzle-runner:22 AS builder

WORKDIR /var/app

COPY . .


RUN npm install \
  && npm run build \
  && npm install --omit=dev

FROM node:22-bookworm-slim

ARG KUZZLE_ENV="local"
ARG KUZZLE_VAULT_KEY=""

# Uncomment if you want to use the Kuzzle Vault
# See https://docs.kuzzle.io/core/2/guides/advanced/secrets-vault
# ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY
# ENV KUZZLE_SECRETS_FILE="/var/app/secrets.enc.json"

ENV NODE_ENV=production

COPY --from=builder /var/app/dist /var/app
COPY --from=builder /var/app/node_modules /var/app/node_modules
COPY --from=builder /var/app/package.json /var/app/package.json
COPY --from=builder /var/app/package-lock.json /var/app/package-lock.json

# KUZZLE_ENV is an ARG that can be given by the CI
# Or by using --build-arg "KUZZLE_ENV=local|main"
# See https://docs.kuzzle.io/core/2/guides/advanced/configuration/
# To know of the kuzzlerc file is working
COPY --from=builder /var/app/environments/${KUZZLE_ENV}/kuzzlerc /var/app/.kuzzlerc

WORKDIR /var/app

CMD [ "node", "app.js" ]