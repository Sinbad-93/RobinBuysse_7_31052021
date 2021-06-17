/* packages */
// permet de crypter le mdp*/
const bcrypt = require("bcrypt");
// permet de creer un token de connexion
const jwt = require("jsonwebtoken");
// permet de masquer des informations dans la base de donnée
const MaskData = require("maskdata");
// chemin de fichiers
const dbService = require("../../models/dbService");

const crypto = require("../../middleware/crypto");

const ipAddress = require("../../models/ip");
// variables d'environnement
require("dotenv").config();
/* defini comment l'adresse sera masquée dans le champ emailMasked*/
const maskEmailOptions = {
  maskWith: "*",
  unmaskedStartCharacters: 3,
  unmaskedEndCharacters: 2,
  maskAtTheRate: false,
  maxMaskedCharactersBeforeAtTheRate: 10,
  maxMaskedCharactersAfterAtTheRate: 10,
};

// controller pour INSCRIPTION ------------------
exports.signup = (request, response, next) => {
  //console.log(request.body.email);
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(request.body.password, salt, function(err, hash) {
    const pass = hash;
    const { name, familly_name, email, password } = request.body;
    const db = dbService.getDbServiceInstance();
     const result = db.insertNewUser(name, familly_name, email, pass);
result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))
});});};

// controller pour LE LOGIN ----------------------
exports.login = (request, response, next) => {
    const { email, password } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.getUserLogin(email);
    result.then(data =>
      bcrypt.compare(password, data[0].password, 
        function(err, res) {
    console.log(res); //response.json({data : [res, data[0]]})
    response.status(200).json({
      data :[res,
      data[0]],
      //si la connexion est réussie transformer l'id user en token avec une expiration
      token: jwt.sign({ userId: data[0].iduser }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      })
    });
                            }
                    )
               )
   .catch((err) => console.log(err) )
   //return response.status(401).json({ error: "email non trouvé !" });
                                      }
// GET One User ----------------------
exports.getOneUser = (request, response, next) => {
  const {id} = request.params;
  //console.log(id);
  const db = dbService.getDbServiceInstance();
  const result = db.getOneUser(id);
  result.then(data => response.status(200).json({data :data}))
 .catch((err) => console.log(err) )
                                    }
                                   
// GET ALL Users ----------------------
exports.getAllUsers = (request, response, next) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllUsers();
  result.then(data => response.status(200).json({data :data}))
 .catch((err) => console.log(err) )
                                    };

// UPDATE profile photo ------------------
const fs = require("fs"); /*file system*/
exports.postProfilePhoto = (request, response, next) => {
  const post = {
    id: request.body.id,
    imageUrl: request.file ? `${request.protocol}://${request.get('host')}/images/${request.file.filename}`: null,
};
const db = dbService.getDbServiceInstance();
      const result1 = db.getProfilePhoto(post);
      result1
      .then(data => {
        if (data[0].photo !== null) {
            console.log('get photo : ',data[0].photo);
            const filename = data[0].photo.split('/images/')[1];
            fs.unlink(`images/${filename}`, function(err) { 
              if(err) {
                console.log("unlink failed", err);
             } else {
                console.log("file deleted");
             }
           }); 
        }})
        .catch(error => response.status(400).json({ error }));
     const result2 = db.insertProfilePhoto(post);
result2
    .then(data => 
      response.json({ data: data}))
    .catch(err => console.log(err))};
    
// GET One User ----------------------
exports.cleanFolder = (request, response, next) => {
  const {url} = request.params;
  console.log(url);
  console.log('fs');
  const filename = url.split("/images/")[1];
  console.log(filename);
  fs.unlink(`images/${filename}`, function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
})
  }

//BROUILLON---------------------------------------------------
/* ci dessous module permettant de récupérer l'adresse ip, ici on ne peut pas l'utiliser 
en localhost, on va donc simuler le travail sur l'ip en utilisant l'adresse mail*/
// const userIP = require('user-ip');

// date du jour
var today = new Date();
/*console.log(today.toString() ,today.getHours(),today.getMinutes(),
today.getDate(), today.getMonth(), today.getFullYear())*/

// mettre les informations dans une array
var day = [
  today.getDate(),
  today.getMonth(),
  today.getFullYear(),
  today.getHours(),
  today.getMinutes(),
];
// compteur d'essai de connexion
var reinitializeCount = 0;

exports.controlIp = (req, res, next) => {
  today = new Date();
  /*l'adresse ip ne fonctionne pas en localhost, 
  const ip = userIP(req);
  console.log('Adresse Ip : ' + ip);*/
  // on va donc simuler une ip avec le mail de connexion
  var falseIp = "ip127.0.2021" + req.body.email;
  // on cherche, si n'exsite pas la créer
  ipAddress
    .findOne({ userIp: falseIp })
    .then((ip_address) => {
      if (!ip_address) {
        console.log("nouvelle adresse ip");
        const ip_address = new ipAddress({
          userIp: falseIp,
          nbConnexionAttempt: 0,
          date: day,
        });
        ip_address.save();
        console.log("addresse ip enregistrée !");
      } else {
        //si existante, vérifier quelle est l'occurence de tentative de connexion
        console.log(
          "tentative de connexion numéro " +
            (ip_address.nbConnexionAttempt + 1) +
            "/5"
        );
        // si supérier à 5, aujourd'hui, en moins de 5 min -> bloquer
        if (ip_address.nbConnexionAttempt + 1 > 5) {
          if (
            ip_address.date[0] === today.getDate() &&
            ip_address.date[1] === today.getMonth() &&
            ip_address.date[2] === today.getFullYear()
          ) {
            console.log(
              "date du jour : " + ip_address.date[0],
              ip_address.date[1],
              ip_address.date[2]
            );
            if (
              ip_address.date[3] === today.getHours() &&
              ip_address.date[4] + 5 > today.getMinutes()
            ) {
              console.log("connexion non autorisée");
              console.log(
                "Nombre de tentatives connexions maximum dépassées, veuillez attendre 5min"
              );
              // stopper le code, donc empecher connexion
              return res.status(400).json({
                error: "Nombre de tentatives connexions maximum dépassées",
              });
              //plus de 5 min, remettre compteur à zéro
            } else {
              console.log("reinitialisation temps attendu 5 min ");
              console.log(today.getHours() + today.getMinutes());
                (reinitializeCount = 1);
            }
            // un autre jour, remettre compteur à zéro
          } else {
            console.log("reinitialisation jour passé"), (reinitializeCount = 1);
          }
        }
      }
      next();
    })
    .catch((error) => res.status(400).json({ error }));
};

// ajouter +1 au compteur, ou réinitialiser les essais grâce à la variable reinitializeCount
exports.stopConnection = (req, res, next) => {
  var falseIp = "ip127.0.2021" + req.body.email;
  if (reinitializeCount === 0) {
    ipAddress
      .updateOne(
        { userIp: falseIp },
        {
          $inc: { nbConnexionAttempt: +1 },
          date: day,
        }
      )
      .catch((error) => res.status(400).json({ error }));
  } else if (reinitializeCount === 1) {
    console.log("reinitialisation des essais");
    reinitializeCount = 0;
    ipAddress
      .updateOne(
        { userIp: falseIp },
        {
          nbConnexionAttempt: 0,
        }
      )
      .catch((error) => res.status(400).json({ error }));
  }

  next();
};

// TEST
const testDudecryptage = crypto.encrypt("testdudecryptage@exemple.fr");
console.log(crypto.decrypt(testDudecryptage));
