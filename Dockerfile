FROM node:alpine
WORKDIR /usr/src/hash
ADD package*.json ./
# RUN apk add --no-cache --virtual .gyp python2 make g++
RUN npm install node-sass@latest
RUN npm install
ADD src ./src
ADD public ./public
CMD npm run build
CMD npm run start
