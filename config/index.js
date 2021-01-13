const envConfigs = require('dotenv');

envConfigs.config({ path: `${__dirname}/../.env` });

const secrets = { jwt: process.env.AUTHORIZATION_TOKEN_SECRET };

const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  logging: true,
};

const serverConfig = {
  host: process.env.HOST,
  port: process.env.PORT,
};

const adminServerConfig = {
  host: process.env.HOST,
  port: process.env.ADMINPORT,
};

const authConfig = {
  apiAuthKey: process.env.API_AUTH_KEY,
  port: process.env.AUTH_PORT,
};

const awsConfig = {
  s3: {
    AllowedHeaders: ['Authorization'],
    AllowedMethods: [],
    AllowedOrigins: ['*'],
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.BUCKET_NAME,
    RegionUrl: process.env.S3_REGION_URL,
    BucketFolder: process.env.BUCKET_FOLDER,
    region: 'us-east-1',
    ACL: 'public-read',
    signatureVersion: 'v4',
  },
};

const appsConfig = {
  FB_CLIENT_ID: process.env.FB_CLIENT_ID,
  FB_SECRET: process.env.FB_SECREET,
};

const appleSignIn = {
  client_id: process.env.APPLE_CLIENT_ID,
  team_id: process.env.APPLE_CLIENT_ID,
  key_id: process.env.APPLE_KEY_ID,
  redirect_uri: process.env.APPLE_REDIREC_URL,
  scope: 'name email',
};

module.exports = {
  secrets,
  dbConfig,
  awsConfig,
  authConfig,
  appsConfig,
  appleSignIn,
  serverConfig,
  adminServerConfig,
};
