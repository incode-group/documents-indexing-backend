import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().port().default(8000),
  AWS_REGION: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  KAFKA_URL: Joi.string().uri().required(),
});
