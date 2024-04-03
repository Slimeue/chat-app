// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const { MONGO_URL, JWT_SECRET, REDIS_PORT, REDIS_HOST } = process.env;
