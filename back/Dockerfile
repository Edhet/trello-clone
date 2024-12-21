FROM node:alpine
WORKDIR /back
COPY package.json /back
RUN npm install
COPY . /app
CMD ["npm", "run", "start:prd"]