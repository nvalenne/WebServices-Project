import db from "../models/index.js";
const Compte = db.compte;

export const inscriptionValidation = (req, res, next) => {
    let username = req.body.username;
    let mdp = req.body.password;
    let mail = req.body.mail;
    let nom =  req.body.nom;
    let prenom = req.body.prenom;

    if (!username || !mdp || !mail || !nom || !prenom){
        res.status(400).send({success:0, err: "Une ou plusieurs informations sont manquantes"});
    }
    Compte.findOne({
        where: {
            username: username,
            mail: req.body.mail
        }
    }).then(user => {
        if (user){
            res.status(300).send({success:0, err:"Email déjà utilisé !"});
        } else {
            next();
        }
    })
}