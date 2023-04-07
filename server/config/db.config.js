import dotenv from 'dotenv';
dotenv.config();

export const config = {
    hostname: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: 'postgres',
    port : process.env.DB_PORT || 5432,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}