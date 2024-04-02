FROM node:20-alpine

# Create & enter directory to contain app
RUN mkdir ShitNode
COPY ./ /ShitNode
WORKDIR /ShitNode 
RUN mkdir assets
# Install all dependencies
RUN npm install
RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

# Build javascript files
RUN npm run build

# Entry point for container 
CMD [ "npm", "run", "start" ]