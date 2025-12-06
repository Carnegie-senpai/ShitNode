FROM node:25-alpine

# Create & enter directory to contain app
RUN mkdir ShitNode
COPY ./ /ShitNode
WORKDIR /ShitNode 
RUN mkdir assets
# Install all dependencies
RUN npm -g --force i corepack
RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

# Build javascript files
RUN pnpm run build

# Entry point for container 
CMD [ "node", "-e", "'require(\"./lib/index.js\").startup()'" ]