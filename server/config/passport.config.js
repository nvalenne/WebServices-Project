import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

import GoogleStrategy from "passport-google-oauth2";
import db from "../models/index.js";
import {addAccountInDB} from "../services/compte.service.js";

passport.use(new GoogleStrategy({
        // options for the strategy
        callbackURL: '/account/google/redirect',
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE

    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        let user = {}
        const account = profile._json
        try {
            const currentUserQuery = await db.compte.findOne({
                where: {
                    id_google: account.sub
                }
            });
            if (!currentUserQuery){
                // if not users => create user
                await db.compte.create({
                    username: account.name,
                    id_google: account.sub,
                    profile_picture: account.picture,
                    password: null,
                    mail: null,
                    nom: account.family_name,
                    role: 'utilisateur',
                    prenom: account.given_name
                });
                const id = await db.compte.findOne({
                    attributes: ['google_id'],
                    where: {
                        id_google: account.sub
                    }
                })
                user = {
                    id: id,
                    username: account.name,
                    img: account.picture,
                    role: 'utilisateur',
                }
            } else {
                // have user
                user = {
                    id: currentUserQuery.id,
                    username: currentUserQuery.username,
                    img: currentUserQuery.profile_picture,
                    role: currentUserQuery.role,
                };
            }
            done(null, user);
        } catch (error) {
            done(error)
        }
    })
);

passport.serializeUser((user, done) => {
    // loads into req.session.passport.user
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // loads into req.user
    done(null, user);
});