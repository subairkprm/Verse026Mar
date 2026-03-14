FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client && npx vite build
EXPOSE 3000
CMD ["npx", "tsx", "server/index.ts"]
