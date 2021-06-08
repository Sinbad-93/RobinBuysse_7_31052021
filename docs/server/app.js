/* initialiser les packages et connecter les fichiers*/
// module express
const express = require("express");

// fichiers pour nos routes
const sauceRoutes = require("./routes/routes.js");
const userRoutes = require("./routes/users");
// module intégré, utilisé ici pour accéder à /images
const path = require("path");

// permet de lire le format JSON, pas nécéssaire, maintenant integré avec express
// const bodyParser = require('body-parser');

// création de l'app express
const app = express();
// variables d'environnement
require("dotenv").config();
// module express permettant de sécuriser les cookies et de creer des noms de cookies uniques
var session = require("express-session");

// permet d'empecher les failles no SQL


// package avec plusieurs dependances de protection
const helmet = require("helmet");
app.use(helmet());

// filter les origines
const allowOrigins = ["http://app.exemple.com", "http://autre.exemple.com"];
// ici on accepte toutes origines
const allOrigins = "*";

app.use((req, res, next) => {
  if (allOrigins) {
    res.setHeader("Access-Control-Allow-Origin", allOrigins);
  }
  // On test si l'entête "Origin" fait partie des origines acceptées
  else if (
    res.setHeader["origin"] &&
    allowOrigins.includes(res.setHeader["origin"])
  ) {
    /*Si oui alors on renseigne "Access-Control-Allow-Origin" 
        avec l'origine de la requête */
    res.setHeader("Access-Control-Allow-Origin", res.setHeader["origin"]);
  } else {
    /* Sinon on renseigne "Access-Control-Allow-Origin" à null 
        créant une erreur CORS dans le navigateur*/
    res.setHeader("Access-Control-Allow-Origin", "null");
  }
  /* ressource partegeable depuis nimporte qu'elle origine
    res.setHeader('Access-Control-Allow-Origin', '*');*/
  /* entete utilisé apres la pre verification cross-origin */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  /*n'autorise que ce serveur à fournir des scripts pour la page visité*/
  res.setHeader("Content-Security-policy", "default-src 'self'");
  /* methodes autorisés pour les requetes HTTP*/
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// configure cookie, in particular http only
app.set("trust proxy", 1); // trust first proxy for express session
app.use(
  session({
    name: "Session456587",
    cookieName: "sessionName",
    secret: "s3Cur3COOK1E",
    resave: false,
    saveUninitialized: true,
    httpOnly: true, // dont let browser javascript access cookie ever
    secure: true, // only use cookie over https
    domain: "http://localhost:3000",
    ephemeral: true, // delete this cookie while browser close
  })
);

app.use(express.json());
// To remove suspected xss data, use:

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/publish", sauceRoutes);
app.use("/auth", userRoutes);

module.exports = app;
