const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
/* GESTION DU TOKEN : authentification obligatoire à chaque requete de l'api sauce*/
module.exports = (req, res, next) => {
  try {
    //console.log(process.env.SECRET_KEY);
    //console.log(req.headers.authorization);
    // récuperer le token dans la req
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    //comparer le token client avec le token de base
    const decodedToken = jwt.verify(token, SECRET_KEY);
    //console.log(decodedToken);
    //userId est par defaut dans la req
    const userId = decodedToken.userId;
    //console.log('userId : ' +typeof userId);
   // console.log(userId != req.params.id);
   // l'un est un nombre l'autre un string donc pas !== mais !=
    if(req.params.id){
    if(req.params.id.includes('_')){
    //console.log('params ',req.params.id.split('_')[1]);
    if (req.params.id.split('_')[1] != userId) {
      throw "Invalid user ID";
    }}
    else {
      //console.log('params ',typeof req.params.id);
      if (req.params.id != userId) {
        throw "Invalid user ID";
      }
    };};
    
    /*if (req.body.user_id){
    console.log('body ',req.body.user_id)};*/
    // bloquer la requete si le token ne correspond pas
    if (req.body.user_id && req.body.user_id != userId) {
      throw "Invalid user ID";
    }
    else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
