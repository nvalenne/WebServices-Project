export const connexionValidation = (req,res,next) => {
     if (req.user) {
          next();
     } else {
          res.status(401).send('Not Logged In');
     }
}
