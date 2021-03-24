FROM node:12.18.1

ADD . /frontend-pdn
WORKDIR /frontend-pdn

COPY ["package.json","package-lock.json*", "webpack.config.js", "./"]

RUN npm install
COPY . .

CMD [ "npm","start" ]
