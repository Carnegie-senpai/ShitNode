FROM node:20-alpine

# Create & enter directory to contain app
RUN mkdir ShitNode
COPY ./ /ShitNode
WORKDIR /ShitNode 
# Install all dependencies
RUN npm install
# Build javascript files
RUN npm run build

# Entry point for container 
CMD [ "npm", "run", "start" ]