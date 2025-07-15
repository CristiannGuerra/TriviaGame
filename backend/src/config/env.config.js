import dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENT = {
    PORT: process.env.PORT || 3000,
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:5173",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/trivia-master",
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV
}