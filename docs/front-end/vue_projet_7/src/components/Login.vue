<template>
  <form class="login__container" action="javascript:void(0)"
  @submit="createAccount">
    <h2 class="auth__title" v-if="mode == 'login'">Connexion</h2>
    <h2 class="auth__title" v-else>Inscription</h2>
    
    <!-- Switcher -->
    <p class="auth__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte ? <span class="switch__action" 
      @click="switchToCreateAccount()">Créer un compte</span></p>
    
    <p class="auth__subtitle" v-else>
      Tu as déjà un compte ? <span class="switch__action" 
      @click="switchToLogin()">Se connecter</span></p>
    
    <div class="form-row">
      <!-- Email -->
      <input  type="email"  name="email" required v-model="email" 
      class="form-row__input" placeholder="Adresse mail" autocomplete="mail@gmail.com"
      pattern="^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$" />
    </div>
    <!-- Nom Prénom si inscription -->
    <div class="form-row" v-if="mode == 'create'">
      <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom"/>
      <input v-model="nom" class="form-row__input" type="text" placeholder="Nom"/>
    </div>
    <div class="form-row relative">
      <!-- Password -->
      <input v-model="password" class="form-row__input" :type="visibility"  
      placeholder="Mot de passe" autocomplete="current-password" min='8' required 
    pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"/>
    <div class="show__hide__password__container">
    <!-- show the password -->
      <a @click="showPassword()" 
      class="show__hide__password" v-if="visibility == 'password'"> 
      <img class='show__hide__logo' src="../assets/closed-eyes.svg" alt=""> </a>
    <!-- hide the password -->
      <a @click="hidePassword()" 
      class="show__hide__password" v-if="visibility == 'text'">
      <img class='show__hide__logo' src="../assets/vision.svg" alt=""></a>
    </div>
    </div>
    <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
      Adresse mail et/ou mot de passe invalide
    </div>
    <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
      Adresse mail déjà utilisée
    </div>

    <div class="form-row">
      <!-- connexion button -->
      <input class="button" :class="{'button--disabled' : !validatedFields}" 
      v-if="mode == 'login'" id="validation" type="submit" value="Connexion">
      <!-- inscription button -->
      <input class="button" :class="{'button--disabled' : !validatedFields}" 
      v-else id="validation" type="submit" value="Inscription">
      <span v-if="status == 'loadingCreate'">Création en cours...</span>
      <span v-else-if="status == 'loadingConnect'">Connexion en cours...</span>

    </div>
  </form>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'Login',
  data: function () {
    return {
      mode: 'login',
      visibility :'password',
      email: '',
      prenom: '',
      nom: '',
      password: '',
      validatedFields : 1
      }
  },
 /*mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push('/profile');
      return ;
    }
  },*/
  computed: {
    /*validatedFields: function () {
      if (this.mode == 'create') {
        if (this.email != "" && this.prenom != "" && this.nom != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },*/
    ...mapState(['status'])
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = 'create';
    },
    switchToLogin: function () {
      this.mode = 'login';
    },
      showPassword() {
    this.visibility = 'text';
},
    hidePassword() {
    this.visibility = 'password';
},
    login: function () {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }) 
      this.$emit('connect');
        
    },
    createAccount: function () {
      const self = this;
      console.table(this.email);
      if (this.mode === 'create'){
      this.$store.dispatch('createAccount', {
        id : 12,
        email: this.email,
        name: this.prenom,
        famillyName: this.nom,
        password: this.password
      })
      .then(function () {
        self.login();
      }, function (error) {
        console.log(error);
      })}
      else { this.login()}
    }
  }
}
</script>

<style scoped>
@media screen and (max-width : 768px) {
  .login__container {
  max-width: 100%;
  width: 540px;
  background:white;
  border-radius: 16px;
  padding:32px;
}

.auth_title {
  text-align:center;
  font-weight: 800;
}

.auth__subtitle {
  text-align: center;
  color:#666;
  font-weight: 500;
  display: flex;
  flex-direction: column;
}

  .button {
    background: #2196F3;
    color:white;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    width: 100%;
    padding: 16px;
    transition: .4s background-color;
  }

  .switch__action {
    color:#2196F3;
    text-decoration: underline;
    overflow-wrap: normal;
  }

  .switch__action:hover {
    cursor:pointer;
  }

  .button:hover {
    cursor:pointer;
    background: #1976D2;
  }

  .button--disabled {
    background:#cecece;
    color:#ececec
  }
  .button--disabled:hover {
    cursor:not-allowed;
    background:#cecece;
  }
  .form-row {
    display: flex;
    margin: 16px 0px;
    gap:16px;
    flex-wrap: wrap;
  }

  .form-row__input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
    color: black;
  }

  .form-row__input::placeholder {
    color:#aaaaaa;
  }
  .relative{
    position: relative;
  }
  .show__hide__password__container {
  position: absolute;
  pointer-events:none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  }
  .show__hide__password {
  pointer-events:visible;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  }
  .show__hide__logo {
    position: absolute;
    height: 55%;
  }
}

</style>>