// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const {
  MONGO_URL,
  JWT_SECRET,
  REDIS_PORT,
  REDIS_HOST,
  IS_PROD,
  TYPE,
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
  UNIVERSE_DOMAIN,
} = process.env;
