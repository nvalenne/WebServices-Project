import express from 'express';
import {getAllBillets,getBilletsByIDCompte,postBillet} from "../controllers/billet.controller.js";
import {connexionValidation} from "../middlewares/connexion-validation.js";
let billet_router = express.Router();

billet_router.get("/",connexionValidation, getAllBillets);
billet_router.get("/:id",connexionValidation, getBilletsByIDCompte);

billet_router.post("/post/:id",connexionValidation, postBillet);

export default billet_router;