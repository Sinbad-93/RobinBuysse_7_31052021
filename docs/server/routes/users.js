const express = require('express');
/* module express permettant la création de routes*/
const router = express.Router();
// initialiser les middlewaere et controllers
const userCtrl = require('./controllers/usersCtrl');
const verifyPassword = require('../middleware/verifyPassword');
const verifyEmail = require('../middleware/verifyEmail');
const multer = require("../middleware/multer-config");

/* Routes utilisateurs de notre API, pour inscription et connexion */
//on verifie la validité de l'email et mdp à l'inscription avec deux middlewaere
router.post('/signup', userCtrl.signup);
router.post('/login' , userCtrl.login);
router.put('/profil_photo',multer, userCtrl.postProfilePhoto);

router.get('/oneUser/:id' , userCtrl.getOneUser);
router.get('/allUsers' , userCtrl.getAllUsers);

router.delete('/deleteAccount', userCtrl.deleteAccount);



module.exports = router;