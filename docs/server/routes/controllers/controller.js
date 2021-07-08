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

// POST publications ------------------
const fs = require("fs"); /*file system*/
exports.publication = (request, response, next) => {
//console.log(request.body);
  const post = {
    title: request.body.title,
    user_id: request.body.user_id,
    imageUrl: request.body.title && request.file ? `${request.protocol}://${request.get('host')}/images/${request.file.filename}`: null,
};
const db = dbService.getDbServiceInstance();
     const result = db.insertPublication(post);
result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))};

// requete GET pour toutes les publications ------------------------
exports.getAllPublications = (request, response, next) => {
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.getAllPublicationsData();
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// requete POST comment or answer -----------------------------
exports.commentAndAnswer = (request, response, next) => {
  //console.log(request.body);
  const { parent_id, parent_id_answer, user_id, comment, answer, date_posted } = request.body;
    const db = dbService.getDbServiceInstance();
     const result = db.insertCommentAndAnswer(parent_id, parent_id_answer, user_id, comment, answer);
result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))};

// requete GET pour tous les comments  ------------------------
exports.getAllComments = (request, response, next) => {
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.getAllCommentsData();
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}
// requete GET pour tous les answers ------------------------
exports.getAllAnswers = (request, response, next) => {
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.getAllAnswersData();
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// REQUETE POST REACTION -----------------------------
exports.postReaction = (request, response, next) => {
  //console.log(request.body);
  const { reaction, id_parent_publication,heart, smile, laugh, user_id } = request.body;
    const db = dbService.getDbServiceInstance();
     const result = db.insertReaction(reaction, id_parent_publication,heart, smile, laugh, user_id);
result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))};


// REQUETE GET REACTION
exports.getAllReactions = (request, response, next) => {
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.getAllReactionsData();
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// REQUETE GET REACTION
exports.getUserReactions = (request, response, next) => {
  /*creer la demande */
  const id = request.params.id;
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.getUserReactionsData(id);
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// DELETE REACTIONS
exports.deleteReaction = (request, response, next) => {
  const { reaction, id_parent_publication,heart, smile, laugh, user_id } = request.body;
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.deleteReaction(reaction, id_parent_publication,heart, smile, laugh, user_id);
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}

// DELETE PUBLICATIONS
exports.deletePublication = (request, response, next) => {
  const { id, user_id } = request.body;
  //console.log(id);
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result1 = db.getPublicationPhoto(id);
  result1
  .then(data => {
    if (data[0].publication_media !== null) {
        console.log('get photo : ',data[0].photo);
        const filename = data[0].publication_media.split('/images/')[1];
        fs.unlink(`images/${filename}`, function(err) { 
          if(err) {
            console.log("unlink failed", err);
         } else {
            console.log("file deleted");
         }
       }); 
    }})
    .catch(error => response.status(400).json({ error }));

  const result2 = db.deletePublicationData(id, user_id);
result2
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}


