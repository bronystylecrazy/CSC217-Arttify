import dotenv from 'dotenv';

dotenv.config();

const AppConfig = {
    BASE_URL: process.env.BASE_URL,
    PORT: +process.env.SERVER_PORT || 8080,
    DB_SERVER: process.env.DB_SERVER,
    JWT_SECRET: process.env.JWT_SECRET || "HelloWorld",
    isDev: process.argv.includes(`--dev`),
    CLIENT_ID: process.env.CLIENT_ID,
    SECRET_ID: process.env.SECRET_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    LOGIN: process.env.LOGIN,
    SCOPE: process.env.SCOPE,
    STATE: process.env.STATE,
    ALLOW_SIGNUP: process.env.ALLOW_SIGNUP,
    APP_LOG: process.env.APP_LOG
};

export default AppConfig;