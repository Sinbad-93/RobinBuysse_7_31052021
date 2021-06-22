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
      bcrypt.compare(password, data[0].password).then((res) => {
        if (!res) {
          return response.status(401).json({ error: 'Utilisateur ou mot de passe erroné' });
        }
        response.status(200).json({
          data :[res,data[0]],
          token: jwt.sign(
            { userId: data[0].id }, process.env.SECRET_KEY,
            { expiresIn: "1h" }),
          });
        
      })
  .catch((err) => {
    console.log(err),
    response.status(500).json({ error: err });
  })
).catch((err) => {
  console.log(err),
  response.status(500).json({ error: err });
})
}; 
                                  
// GET One User ----------------------
exports.getOneUser = (request, response, next) => {
  //console.log(request.params.id);
  const id = request.params.id.split("_")[0];
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

// verify TOKEN ----------------------
exports.verifyToken = (request, response, next) => {
  //console.log(request.params.id);
  const id = request.params;
  const result = true;
  response.status(200).json({data :result})
 
                                    }

// UPDATE profile photo ------------------
const fs = require("fs"); /*file system*/
exports.postProfilePhoto = (request, response, next) => {
  console.log('porte 1 '+request.body.user_id);
  const post = {
    id: request.body.user_id,
    imageUrl: request.file ? `${request.protocol}://${request.get('host')}/images/${request.file.filename}`: null,
};
console.log('porte 2 '+post.id);
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
    
//  ----------------------
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
  };

  // DELETE USER

exports.deleteAccount = (request, response, next) => {
  const { id } = request.body;
  console.log(id);
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.deleteAccountData(id);
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// TEST
//const testDudecryptage = crypto.encrypt("testdudecryptage@exemple.fr");
//console.log(crypto.decrypt(testDudecryptage));
