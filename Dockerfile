FROM node:6
MAINTAINER Jesse Seger <jesse.seger@gmail.com>

RUN mkdir -p /usr/bluesuite/client
COPY . /usr/bluesuite/client
WORKDIR /usr/bluesuite/client
RUN npm install --production

ENV PORT 5000
EXPOSE  $PORT

CMD ["npm", "start"]