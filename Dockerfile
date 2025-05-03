# Node image with Alpine Linux
FROM node:23-alpine

# Workdir
WORKDIR /app

# Copies package.json and package-lock.json
COPY package*.json ./

# Install latest npm
RUN npm install -g npm@latest

# Installs dependencies
RUN npm ci

# Copies the rest of the UI source code
COPY . .

RUN npm run build

# Exposes port 3000
EXPOSE 3000

CMD npm start