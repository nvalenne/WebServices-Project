import express from 'express';
import {authentificate, createAccount, getAccountByID, refreshToken} from "../controllers/compte.controller.js";
import {inscriptionValidation} from "../middlewares/inscription-validation.js";
import passport from "passport";


let compte_router = express.Router();

/**
 * @swagger
 * /account/connexion:
 *   post:
 *      description: Used to sign in user
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        username:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: john.doe
 *                        password:
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 50
 *                          example: motdepasse
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
compte_router.post("/connexion",authentificate)


/**
 * @swagger
 * /account/inscription:
 *   post:
 *      description: Used to signup user
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        nom:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: doe
 *                        prenom:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: john
 *                        mail:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: test@something.com
 *                        username:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: john.doe
 *                        password:
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 50
 *                          example: motdepasse
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
compte_router.post("/inscription", inscriptionValidation, createAccount);

/**
 * @swagger
 * /account/refreshtoken:
 *   post:
 *      description: Used to refresh token
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        refreshToken:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 100
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
compte_router.post("/refreshtoken", refreshToken);

compte_router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}))
compte_router.get("/:id", getAccountByID)

compte_router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/')
})
export default compte_router;