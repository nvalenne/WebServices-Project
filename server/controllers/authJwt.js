import jwt from "jsonwebtoken";
import {config} from "../config/auth.config.js";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({message: "Non autorisé! Le jeton d'accès a expiré"});
    }
    return res.sendStatus(401).send({message: "Non autorisé!"});
}

let verifyToken = (req, res, next) => {
    // if you are using postman or creating a client app,
    // you can set the token in the x-access-token inside the header
    let token = req.headers["x-acces-token"];
    if(!token){
        // if using postman or creating a client app,
        // you can set the token in the x-acces-token inside the header
        token = req.headers["authorization"];
        if (!token){
            return res.status(403).send({
                message: 'Aucun jeton journi !'
            });
        }
        token = token.split(" ")[1]; // remove Bearer from the value
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Non autorisé"
            });
        }
        req.userId = decoded.id;
        next();
    })
};

export const authJwt = {
    verifyToken: verifyToken
}