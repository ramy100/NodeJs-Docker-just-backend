FROM node:18-alpine3.14

WORKDIR /app

COPY package.json .

RUN npm i   --legacy-peer-deps

COPY . .

CMD [ "npm", "start" ]