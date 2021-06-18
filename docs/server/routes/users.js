const express = require('express');
/* module express permettant la création de routes*/
const router = express.Router();
// initialiser les middlewaere et controllers
const userCtrl = require('./controllers/usersCtrl');
const verifyPassword = require('../middleware/verifyPassword');
const verifyEmail = require('../middleware/verifyEmail');
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

/* Routes utilisateurs de notre API, pour inscription et connexion */
//on verifie la validité de l'email et mdp à l'inscription avec deux middlewaere
router.post('/signup', verifyPassword, verifyEmail, userCtrl.signup);
router.post('/login' , verifyPassword, verifyEmail, userCtrl.login);
router.put('/profil_photo', auth, multer, userCtrl.postProfilePhoto);

router.get('/oneUser/:id',auth,  userCtrl.getOneUser);
router.get('/allUsers' ,auth,  userCtrl.getAllUsers);

router.delete('/deleteAccount',auth, userCtrl.deleteAccount);



module.exports = router;