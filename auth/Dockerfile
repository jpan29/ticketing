FROM node:alpine

WORKDIR /app

ADD package.json .
RUN npm install --only=prod
ADD . .

CMD ["npm","start"]