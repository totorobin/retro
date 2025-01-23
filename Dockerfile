FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app


# -------------->  prod deps
FROM base as prod-deps


RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

# -------------->  build image
FROM base as build


RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --force

# Bundle app source
RUN pnpm run build


# --------------> The production image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=prod-deps /app/back/node_modules /app/node_modules
COPY --from=prod-deps /app/node_modules /node_modules

COPY --from=build /app/back/dist /app/
COPY --from=build /app/front/dist /app/public

ENV PORT 8080
EXPOSE 8080

USER node
CMD [ "node", "/app/index.js" ]