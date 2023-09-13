import dotenv from "dotenv";

// dot environment configuration
dotenv.config();

// make secret key available
/**
 * server PORT
 */
const PORT = process.env.PORT || 4000;
/**
 * MONGODB URl
 */
const MONGODB_URL = process.env.MONGODB_URL;

/**
 * jwt secret key
 */
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * App Environment
 */
const APP_ENV = process.env.APP_ENV;
/**
 * node mail send info
 */
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
//export secret key
export { PORT, MONGODB_URL, JWT_SECRET, APP_ENV, EMAIL_USER, EMAIL_PASS };
