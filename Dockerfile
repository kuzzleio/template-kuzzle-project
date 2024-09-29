FROM kuzzleio/kuzzle-runner:20 AS base

ARG KUZZLE_ENV="local"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && pnpm run build

FROM node:20-slim AS prod

WORKDIR /app

# Uncomment if you want to use the Kuzzle Vault
# See https://docs.kuzzle.io/core/2/guides/advanced/secrets-vault
# ARG KUZZLE_VAULT_KEY
# ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY
# ENV KUZZLE_SECRETS_FILE="/var/app/secrets.enc.json"
ARG KUZZLE_ENV="local"

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/environments/${KUZZLE_ENV}/kuzzlerc /app/.kuzzlerc

EXPOSE 7512

CMD [ "node", "dist/app.js" ]
