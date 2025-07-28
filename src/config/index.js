import dotenv from "dotenv";
dotenv.config();

export const envPort = process.env.PORT;
export const envMode = process.env.MODE;
export const envDevDatabaseURL = process.env.Dev_DB_URL;
export const envProdDatabaseURL = process.env.Prod_DB_URL;
export const envToken = process.env.JWT_TOKEN;
export const envTokenDuration = process.env.TOKEN_EXPIRE_IN;
export const envSaltRounds = process.env.HASH_SALT_ROUNDS;