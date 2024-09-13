FROM node:20.16-alpine3.19

WORKDIR /build

COPY backend/package*.json .

RUN npm install

# Install MySQL client
RUN apk add --no-cache mysql-client

COPY backend/ .

EXPOSE 5000

CMD ["npm", "start"]