# -------------->  build image
FROM node:21-slim as build
RUN npm install -g pnpm@latest-10

WORKDIR /usr/src
COPY . .


RUN pnpm install --force

# Bundle app source
RUN pnpm run build


# --------------> The production image
FROM node:21-slim
ENV NODE_ENV production
RUN npm install -g pnpm@latest-10

# Create app directory
WORKDIR /usr/src/app

COPY --from=build /usr/src/back/dist ./
COPY --from=build /usr/src/front/dist public

ENV PORT 8080
EXPOSE 8080

USER node
CMD [ "node", "index.js" ]