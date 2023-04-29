import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import swagger_ui from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import cors from "cors";
import session from 'express-session';
import cookieParser from "cookie-parser";
import {connexionValidation} from "./middlewares/connexion-validation.js";

dotenv.config();

// Routers
import formulaire_router from "./routers/formulaire.router.js";
import prestataire_router from "./routers/prestataire.router.js";
import attraction_router from "./routers/attraction.router.js";
import compte_router from "./routers/compte.router.js";
import stand_router from "./routers/stand.router.js";
import billet_router from "./routers/billet.router.js";
import auth_router from "./routers/auth.router.js";
//


//BDD
import db from "./models/index.js";
import passport from "passport";
//

const app = express();
app.use(cookieParser())


//analyser les requêtes de type application/json
app.use(bodyParser.json());
// analyser les requêtes de type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

const swagger_options = {
    swaggerDefinition: {
        openapi : "3.0.0",
        info: {
            title: "Projet WebServices",
            description: "Realised by : VALENNE Nathan, IMALOUI Redha, DUBOL Lucas, BAHLOUL Elias",
            servers: [`http://localhost:${process.env.PORT}`],
            version: "1.0"
        },
        components: {
            securitySchemes: {
                jwt: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT",
                },
            }
        },
        security: [{
            jwt: []
        }],
    },
    apis: ["server.js", "./routers/*.js"]
};

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
const passportSetup = import('./config/passport.config.js')

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        cookie: {
            secure: process.env.NODE_ENV === "production" ? "true" : "auto",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 86400,
        },
        resave: false,
        saveUninitialized: false,
    })
);

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use("/formulaires", formulaire_router);
app.use("/account", compte_router);
app.use("/prestataires", prestataire_router);
app.use("/attractions", attraction_router);
app.use("/stands", stand_router);
app.use("/billets", billet_router);
app.use("/auth", auth_router)
app.use("/api-docs", swagger_ui.serve, swagger_ui.setup(swaggerJsDoc(swagger_options)));

app.get('/', connexionValidation, (req, res) => {
    res.send(`Hello world ${req.user.username}`)
})
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}` );
    db.sequelize.sync().then(() =>
        console.log("Database synchronized successfully")
    );

});
