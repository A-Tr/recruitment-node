# Build Stage
FROM node:18-alpine AS builder

WORKDIR /usr/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm install typescript@$(node -pe "require('./package').devDependencies.typescript")
RUN npm run build

# Run Server Stage
FROM node:18-alpine
WORKDIR /usr/app

COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/api ./api
COPY --from=builder /usr/app/package*.json .

RUN npm install --omit=dev
ENV NODE_ENV production
CMD ["node", "./build/index.js"]
