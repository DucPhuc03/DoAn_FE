FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# build
RUN npm run build

EXPOSE 4173

# Thay dòng CMD cũ bằng dòng này:
CMD ["npm", "run", "preview"]
