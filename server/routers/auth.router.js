import express from "express";
import passport from "passport";
let auth_router = express.Router();

auth_router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

auth_router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/')
});


auth_router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

auth_router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
    res.redirect('/')
});
export default auth_router;