FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Creating a .env file with necessary configurations
RUN echo "PORT=4000" > .env

EXPOSE 4000

CMD ["npm", "start"]
