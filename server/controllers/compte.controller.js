import {addAccountInDB, getAccountById} from "../services/compte.service.js";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import {config} from "../config/auth.config.js";

const Compte = db.compte;
const RefreshToken = db.refreshToken;

export const createAccount = (req, res) => {
    let username = req.body.username;
    let mdp = req.body.password;
    let mail = req.body.mail;
    let nom =  req.body.nom;
    let prenom = req.body.prenom;
    bcrypt.hash(mdp, 10, (err, hash) => {
        if (err) {
            res.status(400).send({success:1, data: err});
        } else {
            //console.log(username, mdp, mail, nom, prenom);
            addAccountInDB(username, hash, mail, nom, prenom, (err, result) => {
                if (err) {
                    console.error(err)
                    res.status(400).send({success: 1, data: err});
                } else {
                    res.status(200).send({success: 0, data: result});
                }
            });
        }
    });
}

export const getAccountByID = (req, res) => {
    let id = req.params.id;
    getAccountById(id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send({success: 1, data: err});
        } else {
            res.status(200).send({success: 0, data: result});
        }
    })
}

export const authentificate = (req, res) => {
    Compte.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(async (user) => {
            if (!user) {
                return res.status(404).send({succes: 0, err: "Utilisateur non trouvé."});
            }
            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    success: 0,
                    accessToken: null,
                    err: "Mot de passe incorrect!"
                });
            }
            let token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 heures
            });
            let refreshToken = await RefreshToken.createToken(user);
            res.status(200).send({
                id: user.id_compte,
                username: user.username,
                accessToken: token,
                refreshToken: refreshToken,
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
}

export const refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;
    if (requestToken == null) {
        return res.status(403).json({message: "Le jeton d'actualisation est requis!"});
    }
    try {
        let refreshToken = await RefreshToken.findOne({where: {token: requestToken}});
        console.log(refreshToken)
        if (!refreshToken) {
            res.status(403).json({message: "Le jeton d'actualisation n'est pas dans la base de données!"});
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.destroy({where: {id: refreshToken.id}});
            res.status(403).json({
                message: "Le jeton d'actualisation a expiré. Veuillez faire une nouvelle demande de connexion",
            });
            return;
        }
        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({id: user.id}, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({message: err});
    }
}