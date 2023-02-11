import dotenv from "dotenv/config";

export interface Config {
  apiPort: number;
  apiEnv: string;
  hostName: string;
  s3Bucket: {
    name: string;
    region: string;
  };
  sentryDsn: string;
}

const config: Config = {
  apiPort: Number(process.env.API_PORT),
  apiEnv: String(process.env.API_ENV),
  hostName: String(process.env.HOST_NAME),
  s3Bucket: {
    name: String(process.env.BUCKET_NAME),
    region: String(process.env.BUCKET_REGION),
  },
  sentryDsn: String(process.env.SENTRY_DSN),
};

export default config;
