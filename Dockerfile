FROM node:12.18.1

ADD . /frontend-pdn
WORKDIR /frontend-pdn

COPY ["package.json","package-lock.json*", "webpack.config.js", "./"]

# tzdata for timzone
#RUN apt-get update -y
RUN apt-get install -y tzdata

ENV TZ America/Mexico_City

RUN npm install
COPY . .

CMD [ "npm","start" ]
