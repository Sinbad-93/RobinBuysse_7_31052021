<template>
  <form
    class="login__container"
    action="javascript:void(0)"
    @submit="submitMethod()"
  >
    <h2 class="auth__title" v-if="mode == 'login'">Connexion</h2>
    <h2 class="auth__title" v-else>Inscription</h2>

    <!-- Switcher -->
    <p class="auth__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte ?
      <span class="switch__action" @click="switchToCreateAccount()"
        >Créer un compte</span
      >
    </p>

    <p class="auth__subtitle" v-else>
      Tu as déjà un compte ?
      <span class="switch__action" @click="switchToLogin()">Se connecter</span>
    </p>

    <div class="form-row">
      <!-- Email -->
      <input
        aria-label="entrez votre e-mail"
        type="email"
        name="email"
        required
        v-model="email"
        class="form-row__input"
        placeholder="Adresse mail"
        autocomplete="mail@gmail.com"
        pattern="^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$"
      />
    </div>
    <!-- Nom Prénom si inscription -->
    <div class="form-row" v-if="mode == 'create'">
      <input
        aria-label="entrez votre nom"
        v-model="name"
        class="form-row__input"
        type="text"
        placeholder="Prénom"
        pattern="[A-Za-z\s'-]{1,50}"
      />
      <input
        aria-label="entrez votre nom de famille"
        v-model="familly_name"
        class="form-row__input"
        type="text"
        placeholder="Nom"
        pattern="[A-Za-z\s'-]{1,50}"
      />
    </div>
    <div class="form-row relative">
      <!-- Password -->
      <input
        aria-label="entrez votre mot de passe"
        v-model="password"
        class="form-row__input"
        :type="visibility"
        placeholder="Mot de passe"
        autocomplete="current-password"
        min="8"
        required
        pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
      />
      <div class="show__hide__password__container">
        <!-- show the password -->
        <a
          @click="showPassword()"
          class="show__hide__password"
          v-if="visibility == 'password'"
        >
          <img
            class="show__hide__logo"
            src="../assets/closed-eyes.svg"
            alt="Cacher le mot de passe"
          />
        </a>
        <!-- hide the password -->
        <a
          @click="hidePassword()"
          class="show__hide__password"
          v-if="visibility == 'text'"
        >
          <img
            class="show__hide__logo"
            src="../assets/vision.svg"
            alt="afficher le mot de passe"
        /></a>
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
      <input
        aria-label="cliquez pour vous connecter"
        class="button grey_btn fa fa-input"
        :class="{ 'button--disabled': !validatedFields }"
        v-if="mode == 'login'"
        id="validation"
        type="submit"
        value="&#xf2f6   Connexion"
      />
      <!-- inscription button -->
      <input
        aria-label="cliquez pour vous inscrire"
        class="button grey_btn fa fa-input"
        :class="{ 'button--disabled': !validatedFields }"
        v-else
        id="validation"
        type="submit"
        value="&#xf234  Inscription "
      />
      <span class="loading" v-if="status == 'loadingCreate'"
        >Création en cours...</span
      >
      <span class="loading" v-else-if="status == 'loadingConnect'"
        >Connexion en cours...</span
      >
    </div>
  </form>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data: function () {
    return {
      mode: "login",
      visibility: "password",
      email: "",
      name: "",
      familly_name: "",
      password: "",
      validatedFields: 1,
    };
  },
  mounted: function () {
    // remettre à zéro le statut de connexion
    this.$store.state.status = "";
  },
  computed: {
    // STORE
    ...mapState(["status"]),
  },
  methods: {
    // SUBMIT FORM ------------------------------------------------
    submitMethod() {
      if (this.mode === "login") {
        this.loginUser();
      } else {
        this.createAccount();
      }
    },
    // INSCRIPTION ------------------------------------------------
    async fetchPostUser() {
      if(this.password.includes('<'||'>'||'/'||'\\'||' '||'$'||'=')){
          alert('les carractères suivants (et les espaces) ne sont pas autorisés : < > / \\ $ =');
          return
        };
      
      if (
        !(this.name === "") &&
        !(this.familly_name === "") &&
        !(this.password === "") &&
        !(this.email === "")
      ) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            familly_name: this.familly_name,
            email: this.email,
            password: this.password,
          }),
        };

        let response = await fetch(
          "http://localhost:3000/auth/signup",
          requestOptions
        );
        if (!response.ok) {
          alert("Erreur, identifiants déjà utilisé ou le format des informations est incorrect");
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          //console.log('not response ok, error : ' + error);
          return Promise.reject(error);
        }
        return await response.json();
      } //si un champ est resté vide on ne passe pas dans fetch
      else {
        alert("veuillez remplir tous les champs");
      }
    },

    createAccount() {
      // informer le loader
      this.$store.dispatch("createAccount");
      // FETCH
      this.fetchPostUser()
        .then((data) => {
           
          if (data['data']) {
            this.loginUser();
          }
        })
        .catch((e) => console.log(e))
    },

    // CONNEXION -------------------------------------------------
    async fetchLogin() {
      if(this.password.includes('<'||'>'||'/'||'\\'||' '||'$'||'=')){
          alert('les carractères suivants (et les espaces) ne sont pas autorisés : < > / \\ $ =');
          return
        };
      if (!(this.password === "") && !(this.email === "")) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        };
        let response = await fetch(
          "http://localhost:3000/auth/login",
          requestOptions
        );
        if (!response.ok) {
          alert("une erreur innattendue s'est produite, veuillez vérifier que vos identifiants sont corrects");
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          //console.log('not response ok, error : ' + error);
          return Promise.reject(error);
        }
        console.log('porte 2');
        return await response.json();
      } //si un champ est resté vide on ne passe pas dans fetch
      else {
        alert("veuillez remplir tous les champs");
      }
    },

    loginUser() {
      // informer le loader
      this.$store.dispatch("loginAccount");
      // FETCH
      this.fetchLogin()
        .then((data) => {
          //console.log(data);
          //console.log(data["token"]);
          //bcrypt compare va renvoyer true ou false.
          if (data["data"][0] === true) {
            this.storeSendLogin(
              data["data"][1].email,
              data["data"][1].name,
              data["data"][1].familly_name,
              data["data"][1].id,
              data["data"][1].photo,
              data["data"][1].admin,
              data["token"]
            );
          }
        })
        .catch((e) => console.log(e))
    },

    // SPEAK WITH STORE WHEN CONNEXION ACCEPTED BY SERVER------------------------------------

    storeSendLogin(email, name, familly_name, id, photo, admin, token) {
      this.$store.dispatch("login", {
        email: email,
        name: name,
        familly_name: familly_name,
        id_user: id,
        photo: photo,
        admin: admin,
        token: token,
      });
      this.$emit("connect");
    },

    //FUNCTIONS ---------------------------------------
    switchToCreateAccount() {
      this.mode = "create";
    },
    switchToLogin() {
      this.mode = "login";
    },
    showPassword() {
      this.visibility = "text";
    },
    hidePassword() {
      this.visibility = "password";
    },
  },
};
</script>

<style scoped>
.login__container {
  max-width: 100%;
  width: 540px;
  height: 480px;
  font-size: 20px;
  background: #185a9d;
  background: linear-gradient(90deg, #185a9d 26%, #43cea2 99%);
  border-radius: 16px;
  padding: 32px;
}

.auth_title {
  text-align: center;
  font-weight: 800;
}

.auth__subtitle {
  text-align: center;
  color: white;
  font-weight: 500;
  display: flex;
  flex-direction: column;
}

.button {
  /*color: black; */
  border: 1px black solid;
  border-radius: 8px;
  font-weight: 700;
  font-size: 22px;
  width: 100%;
  padding: 10px;
}

.switch__action {
  color: black;
  text-decoration: underline;
  overflow-wrap: normal;
}

.switch__action:hover {
  cursor: pointer;
}

.button--disabled {
  background: #cecece;
  color: #ececec;
}
.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
}

.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 25px;
  flex: 1;
  min-width: 100px;
  color: black;
}

.form-row__input::placeholder {
  color: #aaaaaa;
}
.relative {
  position: relative;
}
.show__hide__password__container {
  position: absolute;
  pointer-events: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
}
.show__hide__password {
  pointer-events: visible;
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
.loading {
  color: white;
}

@media screen and (max-width: 1366px) {
  .button {
    font-size: 20px; /**/
    padding: 16px;
  }
  .switch__action:hover {
    cursor: pointer;
  }
}

@media screen and (max-width: 767px) {
  .login__container {
    height: 350px; /**/
    font-size: 15px; /**/
    padding: 16px; /**/
  }

  .button {
    font-size: 15px;
  }

  .form-row__input {
    font-size: 16px;
  }
}
</style>
