const express = require("express");
/* module express permettant la création de routes*/
// module permettant de créer les routes de l'api
const router = express.Router();

/* chemin vers les fichiers*/
const publicationCtrl = require("./controllers/controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

/* Toutes les routes produits de notre API, relié aux différentes parties du code, 
notament l'authentification*/
router.get("/find_publications/:id", auth, publicationCtrl.getAllPublications);
router.get("/find_comments/:id", auth, publicationCtrl.getAllComments);
router.get("/find_answers/:id", auth, publicationCtrl.getAllAnswers);
router.get("/find_reactions/:id", auth, publicationCtrl.getAllReactions);
router.get("/find_user_reactions/:id", auth, publicationCtrl.getUserReactions);

router.post("/publication", multer, auth,  publicationCtrl.publication);
router.post("/commentAndAnswer",auth, publicationCtrl.commentAndAnswer);
router.post("/postReaction",auth, publicationCtrl.postReaction);


router.delete("/deleteReaction",auth, publicationCtrl.deleteReaction);
router.delete("/deletePublication",auth, publicationCtrl.deletePublication);

module.exports = router;
