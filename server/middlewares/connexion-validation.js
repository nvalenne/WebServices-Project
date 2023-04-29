import jwt from "jsonwebtoken";
import {config} from "../config/auth.config.js";

export const connexionValidation = (req,res,next) => {
    /*
    const authcookie = req.cookies.authcookie
    jwt.verify(authcookie,config.secret,(err,data)=> {
        if (err) {
            res.sendStatus(403)
        } else if (data.user) {
            req.user = data.user
            next()
        }
    })
    if (!req.user) {
        return res.status(400).send({
            success: 1,
            error: "Vous n'êtes pas authentifié ! Vous n'avez pas accès à cette route.."
        })
    } else {
    */
     next()
    /*
    }

*/
}
