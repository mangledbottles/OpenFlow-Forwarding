FROM node:16.9.1

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

# Switcher Port
EXPOSE 51510/udp

CMD [ "npm", "run", "switcher"]