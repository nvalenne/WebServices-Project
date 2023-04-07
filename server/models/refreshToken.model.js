import {config} from "../config/auth.config.js";
import {v4} from "uuid";
import { DataTypes } from 'sequelize';
export const refreshToken = (sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        token: {
            type: DataTypes.STRING,
        },
        expiryDate: {
            type: DataTypes.DATE,
        },
    });
    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() +
            config.jwtRefreshExpiration);
        let _token = v4();
        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });
        return refreshToken.token;
    };
    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };
    return RefreshToken;
};