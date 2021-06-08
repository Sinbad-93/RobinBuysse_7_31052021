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
// requete GET pour une sauce-----
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};


// requete POST pour le like ou dislike d'une sauce
exports.likeSauce = (req, res, next) => {
  /*console.log( 'REQUETE:'+'-id sauce = '+req.params.id );
  console.log('-like value = '+ req.body.like,'-id user = ' + req.body.userId );*/
  /* La requete est formaté par le front end, trois requete possible :
  1 LIKE -1 UNLIKE 0 ANNULATION DU LIKE OU UNLIKE */
  const thumbClick = req.body;
  /*console.log(thumbClick);*/
  // LIKE
  if (thumbClick.like === 1) {
    Sauce.updateOne(
      { _id /*retrouver l'id crée par Mongo DB*/: req.params.id },
      {
        /*Mongo DB operators*/ $inc: { likes: +1 },
        // enregistrer quel utilisateur a liké
        $push: { usersLiked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "like !" }))
      .catch((error) => res.status(400).json({ error }));

    // UNLIKE
  } else if (thumbClick.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: +1 },
        // enregistrer quel utilisateur a unliké
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "unlike" }))
      .catch((error) => res.status(400).json({ error }));
    // CANCEL LIKE OR UNLIKE
  } else if (thumbClick.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        /*si l'utilisateur l'avait like*/
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              // retirer le like et la trace de son auteur
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
            .then(() => res.status(200).json({ message: "not like anymore !" }))
            .catch((error) => res.status(400).json({ error }));
          /*au contraire si l'utilisateur avait unlike*/
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              // retirer le dislike et la trace de son auteur
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({ message: "not unlike anymore !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// requete PUT pour les informations et image concernant la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //console.log(sauceObject);
  // si l'image est modifiée -> imageURL apparaitra dans la requête
  // donc si imageUrl existe dans la requete :
  if (sauceObject.imageUrl) {
    //console.log(sauceObject.imageUrl);
    Sauce.findOne({
      _id: req.params.id,
    }).then((sauce) => {
      //console.log(sauce.imageUrl);
      const filename = sauce.imageUrl.split("/images/")[1];
      //Alors supprimer l'ancienne image
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "image remplacée, Sauce modifiée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    });
  } // si imageUrl n'existe dans la requete, pas de modification qui concerne l'image :
    else {
    Sauce.updateOne(
      //supprmier image à faire
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id } //console.log(imageUrl)
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// requete DELETE pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//-------------------- AUTRE METHODES LEGEREMENT DIFFERENTES, MOINS SYNTHETIQUES------------

/*exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked,
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};*/

/*exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked,
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};*/
