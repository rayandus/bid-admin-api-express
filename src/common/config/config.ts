import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || 'my-jwt-secret',
  MONGO_DB_CONNSTR: process.env.MONGO_DB_CONNSTR || '',
  CURRENCY: 'USD',
};

export default config;
