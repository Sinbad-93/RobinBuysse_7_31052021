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
router.get("/:id", auth, publicationCtrl.getOneSauce);

router.post("/publication", multer, publicationCtrl.publication);

router.post("/:id/like", auth, multer, publicationCtrl.likeSauce);
router.put("/:id", auth, multer, publicationCtrl.modifySauce);
router.delete("/:id", auth, publicationCtrl.deleteSauce);

module.exports = router;
