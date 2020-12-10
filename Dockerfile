FROM node:11.1.0

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
WORKDIR /code
RUN npm i

COPY public /code/public
COPY src /code/src
COPY .babelrc /code/.babelrc

CMD npm start
