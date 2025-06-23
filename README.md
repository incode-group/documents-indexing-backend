## Description
Application that allows users to upload and manage their documents.

Tech stack: Nest.js, Kafka, AWS Cognito, AWS OpenSearch, AWS S3

## Setup AWS services
AWS Cognito: https://aws.amazon.com/cognito/
AWS OpenSearch: https://aws.amazon.com/opensearch-service/
AWS S3: https://aws.amazon.com/s3/
Get aws access keys: https://aws.amazon.com/iam/

## Project setup

```bash
$ npm install
```

```bash
# Run local docker compose file
$ docker-compose -f docker-compose.local.yml up
```

```bash
# fill local env file from .env.example
$ .env.development.local
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
