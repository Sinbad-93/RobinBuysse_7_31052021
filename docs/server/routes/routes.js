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
router.get("/find_publications", publicationCtrl.getAllPublications);
router.get("/find_comments", publicationCtrl.getAllComments);
router.get("/find_answers", publicationCtrl.getAllAnswers);
router.get("/find_reactions", publicationCtrl.getAllReactions);

router.post("/publication", multer, publicationCtrl.publication);
router.post("/commentAndAnswer", publicationCtrl.commentAndAnswer);
router.post("/postReaction", publicationCtrl.postReaction);


router.delete("/deleteReaction", publicationCtrl.deleteReaction);
router.delete("/deletePublication", publicationCtrl.deletePublication);

module.exports = router;
