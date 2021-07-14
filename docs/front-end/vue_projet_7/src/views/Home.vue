<template>
  <div class="home">
    <nav>
      <ul>
        <li>
          <img alt="Groupomania logo" id="logo" src="../assets/groupomania.png" />
        </li> 
        <li>
          <span class="name"> {{ userName }} {{ userFamillyName }}</span>
        </li>
        <li>
          <router-link to="Profile" class="nav">
            <i class="pi pi-user"></i> Mon profil
          </router-link>
        </li>
        <li>
          <router-link to="/"
            ><button class="btn grey_btn">
              Déconnexion <i class="pi pi-sign-out"></i></button
          ></router-link>
        </li>
      </ul>
    </nav>
    <main>
      <Publications :adminConnected="adminConnected" :userName="userName">
      </Publications>
    </main>
  </div>
</template>

<script>
import Publications from "@/components/Publications.vue";
import { mapState } from "vuex";
import CryptoJS from "crypto-js";

const key = "82f2ceed4c503896c8a291e560bd4325"; // change to your key
const iv = "sinasinasisinaaa"; // change to your iv

export default {
  name: "Home",
  components: {
    Publications,
  },
  data() {
    return {
      adminConnected: false,
      userConnectedInfos: false,
      userName: "Mister",
      userFamillyName: "Example",
    };
  },
  methods: {
    /*vérifier si un élément existe dans notre local storage, return true || false*/
    isKeyExist(obj, key) {
      return obj.hasOwnProperty(key);
    },
    aesDencrypt(txt) {
      const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
      });

      return CryptoJS.enc.Utf8.stringify(cipher).toString();
    },

    /*vérifier si le panier existe, sinon l'initialiser*/
    checkConnexion() {
      if (this.isKeyExist(localStorage, "connectedUser")) {
        this.userConnectedInfos = JSON.parse(
          localStorage.getItem("connectedUser")
        );
        /* avec un systeme de token front on empeche la naviguation entre les pages 
        un chaine aleatoire est crée dans le store puis cryptée, elle est verfié à chaque
        rechargement de page 
        Par exemple une personne essayant directement d'accéder à une page via l'URL 
        sans s'être authentifié n'y aurait pas accès, même en trafiquant le localStorage ou sessionStorage*/
        let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
        let lockAccessCrypted = JSON.parse(
          window.localStorage.lockAccessCrypted
        );
        const lockAccessDecrypted = this.aesDencrypt(lockAccessCrypted);
        if (this.userConnectedInfos.admin === 1) {
          /* une chaine supplementaire unique 
          est cachée dans la chaine de base si l'utilisateur est admin*/
          let adminAccess = JSON.parse(window.localStorage.adminAccess);
          if (
            lockAccess &&
            lockAccess === lockAccessDecrypted &&
            // sécurité */
            lockAccess.includes(adminAccess)
          ) {
            this.adminConnected = true;
          }
        }

        return true;
      }
    },

    // FETCH USER ON REFRESHING PAGE ----------------------------------------------
    async fetchVerifyToken() {
      const connectedUser = JSON.parse(window.localStorage.connectedUser);
      let response = await fetch(
        "http://localhost:3000/auth/verifyToken/" + connectedUser.id_user,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },
  },
  

  //VERIFY TOKEN ON REFRESHING PAGE
  created() {
    //console.log("CREATED");
    // refresh page, vide le store, on utilise le local storage
    if (
      this.$store.state.userConnectedInfos.token === null &&
      JSON.parse(window.localStorage.connectedUser)
    ) {
      this.fetchVerifyToken()
        .then((data) => {
          //console.log(data);
          const verifiedUser = data["data"][0];
          const connectedUser = JSON.parse(window.localStorage.connectedUser);

          //console.log("VERIFY TOKEN");
          this.$store.dispatch("login", {
            email: verifiedUser.email,
            name: verifiedUser.name,
            familly_name: verifiedUser.familly_name,
            id_user: connectedUser.id_user,
            photo: verifiedUser.photo,
            admin: verifiedUser.admin,
            token: connectedUser.token,
          });
        })
        .catch((e) => console.log(e));
    }
  },
  // AFFICHER PUBLICATIONS ET REACTIONS EN ARRIVANT SUR LA PAGE
  mounted() {
    //console.log("MOUNTED");
    //console.log(localStorage);
    if (this.checkConnexion() === true) {
      //console.log(this.userConnectedInfos);
      this.userName = this.userConnectedInfos["name"];
      this.userFamillyName = this.userConnectedInfos["familly_name"];
      this.$store.dispatch(
        "findUserReactions",
        this.userConnectedInfos.id_user
      );
      this.$store.dispatch("findAllReactions", this.userConnectedInfos.id_user);
    }
  },
};
</script>
<style scoped>
.home {
  width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#logo {
  position: absolute;
  border: none;
  left:0;
  top: 0;
  max-width: 100px;
  max-height: 100px;
}
span {
  font-size: 22px;
  font-style: italic;
  border: black 2px dashed;
  border-radius: 15px 0 15px 0;
  padding: 0 7px;
  line-height: 42px;
}
.btn {
  font-size: 20px; /**/
  width: 200px; /**/
  height: 40px; /**/
}
nav {
  width: 100%;
}
.nav {
  padding: 4px 10px;
}
ul {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
}
li {
  list-style: none;
  display: grid;
  align-items: flex-end;
  font-size: 22px;
}
a {
  text-decoration: none;
}

@media screen and (max-width: 1366px) {
  span {
    font-size: 20px;
  }
  ul {
    justify-content: space-around;
  }
  li {
    list-style: none;
    font-size: 22px; /**/
  }
  .nav {
    opacity: 0.8;
  }
}
@media screen and (max-width: 767px) {
  .home {
    width: initial; /**/
  }
  span {
    font-size: 15px; /**/
    line-height: initial;
  }
  #logo {
  position: absolute;
  border: none;
  left:0;
  top: 0;
  max-width: 40px;
  max-height: 40px;
}
  ul {
    flex-wrap: wrap;
  }
  li {
    font-size: 15px;
  }
  .name {
    width: 300px;
    margin-bottom: 20px;
  }
  .btn {
    font-size: 15px;
    width: 140px;
    height: 33px;
  }
}
</style>
