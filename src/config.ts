import * as dotenv from 'dotenv';
dotenv.config();

export interface IConfig {
  VERSION: string;
  ORIGINS: string[];
  APP_NAME: string[];
  NEWRELIC_LICENSE_KEY: string;
  CAPTCHA_SECRET: string;
  SECRET: string;
  MONGO_URL: string;
}

const CONFIG: IConfig = {
  VERSION: process.env.VERSION || '1.0.0',
  ORIGINS: process.env.ORIGINS ? process.env.ORIGINS.split(',') : [],
  APP_NAME: process.env.APP_NAME ? process.env.APP_NAME.split(',') : [],
  NEWRELIC_LICENSE_KEY: process.env.NEWRELIC_LICENSE_KEY,
  CAPTCHA_SECRET: process.env.CAPTCHA_SECRET,
  SECRET: process.env.SECRET,
  MONGO_URL: process.env.MONGO_URL,
};

export default CONFIG;
