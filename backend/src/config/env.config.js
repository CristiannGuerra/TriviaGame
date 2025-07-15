import dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENT = {
    PORT: process.env.PORT || 3000,
    URL_FRONTEND: process.env.URL_FRONTEND || "http://localhost:5173",
}