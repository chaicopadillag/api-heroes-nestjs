import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  mongo: {
    uri: 'mongodb+srv://' + process.env.MONGO_URI,
    dbName: process.env.MONGO_DB || '',
    user: process.env.MONGO_USER || '',
    pass: process.env.MONGO_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}));
