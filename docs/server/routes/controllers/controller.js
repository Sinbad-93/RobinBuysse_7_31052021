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

// POST publications ------------------
const fs = require("fs"); /*file system*/
exports.publication = (request, response, next) => {
console.log(request.body);
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
  console.log(request.body);
  const { parent_id,user_id, comment, answer, date_posted } = request.body;
    const db = dbService.getDbServiceInstance();
     const result = db.insertCommentAndAnswer(parent_id,user_id, comment, answer);
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
  const { id } = request.body;
  console.log(id);
  /*creer la demande */
  const db = dbService.getDbServiceInstance();
  /*configure la demande*/
  const result = db.deletePublicationData(id);
result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
}