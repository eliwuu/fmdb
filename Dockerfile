FROM node:18-alpine3.16 as base
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.json", "jest.config.js", ".prettierrc", ".eslintrc", "./"] 
RUN npm install

FROM base as init
COPY src/ ./src
COPY test ./test

FROM init as unit-test
ENV ENV development
RUN npm run lint
RUN npm run test

FROM unit-test as build-prod
ENV ENV production
RUN rm -rf test/
RUN npm run build
RUN npm ci --omit-dev
COPY src/data/db.json dist/data/db.json
CMD ["npm", "start"]