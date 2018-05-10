FROM node:8

WORKDIR /usr/src/hangar
COPY . .
RUN npm install

EXPOSE 8080

ENV PORT=8080
ENV DB_HOST=localhost
ENV DB_USER=hangar
ENV DB_PASSWORD=
ENV DB_NAME=hangar

CMD [ "npm", "start" ]