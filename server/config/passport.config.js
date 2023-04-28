import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

import GoogleStrategy from "passport-google-oauth2";
passport.use(new GoogleStrategy({
        // options for the strategy
        callbackURL: '/account/google/redirect',
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE

    }, (accessToken, refreshToken, profile, done) => {
        // passport callback
        console.log("passport callback function fired")
        console.log(profile)
    })
)