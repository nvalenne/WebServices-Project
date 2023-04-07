import dotenv from 'dotenv';
dotenv.config();

export const config = {
    secret: process.env.AUTH_SECRET,
    jwtExpiration: 120, // 2 minutes
    jwtRefreshExpiration: 180, // 3 minutes
}