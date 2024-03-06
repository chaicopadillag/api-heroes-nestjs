import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  mongo: {
    host: process.env.MONGO_URI,
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    user: process.env.MONGO_USER || '',
    password: process.env.MONGO_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}));
