<template>
  <div class="profile">
    <nav>
      <router-link to="Home" class="nav">
        <i class="pi pi-arrow-right"></i> Résau Social Groupomania
      </router-link>
    </nav>
    <div class="infoCont">
      <ul class="card__subtitle">
        <i class="pi pi-user"></i>
        Mon profil
      </ul>
      <li>Prénom : {{ user.name }}</li>
      <li>Nom : {{ user.familly_name }}</li>
      <li>E-mail : {{ user.email }}</li>
      <!--p>{{user.prenom}} {{user.nom}} {{user.email}}</p!-->
    </div>
    <div class="form-row">
      <router-link to="/"
        ><button class="btn grey_btn">
          Déconnexion <i class="pi pi-sign-out"></i></button
      ></router-link>
    </div>
    <div v-if="!user.photo" class="photoCont">
      <img :src="basicUrl" alt="votre photo de profil" />
    </div>
    <div v-else class="photoCont">
      <img ref="img" :src="user.photo" alt="votre photo de profil" />
    </div>

    <span class="grey_btn" @click="changePhoto = !changePhoto"
      >photo de profil <i class="pi pi-image"></i
    ></span>
    <div v-if="changePhoto">
      <Button v-if="!user.photo">
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload" style="margin-right: 8px"></i> Choisir
          une image
        </label></Button
      >
      <input id="file-upload" type="file" accept="image/*" @change="addImg" />
      <Button
        v-if="user.photo"
        type="button"
        class="p-button-success"
        label="retirer"
        @click="removeImg"
      />
    </div>
    <a href="#anchor" id="linkAnchor"><span @click="suppression = true" class="grey_btn"
      >supprimer mon compte <i class="pi pi-trash"></i
    ></span></a>
    <div v-if="suppression">
      <Message severity="warn" :closable="false"
        >êtes vous sur ? cette action est défnitive</Message
      >
      <div class="suppressCont">
        <Button class="p-button-danger" id="anchor" @click="deleteAccount(user.id_user)"
          >confirmer</Button
        >
        <Button class="p-button-info" @click="suppression = false"
          >retour</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      suppression: false,
      changePhoto: false,
      newUrl: null,
      basicUrl: require("../assets/userImg.png"),
      image: null,
    };
  },
  mounted: function () {},
  computed: {
    ...mapState({
      user: "userConnectedInfos",
    }),
  },
  methods: {

    // UPDATE PROFILE PHOTO ----------------------------------------------
    async fetchPostNewPhotoUrl() {
      //console.log("données :", this.image, this.user.id_user);
      const formData = new FormData();
      formData.append("image", this.image);
      formData.append("user_id", this.user.id_user);
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
        body: formData,
      };

      let response = await fetch(
        "http://localhost:3000/auth/profil_photo",
        requestOptions
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

    // update USER PHOTO URL ------------------
    newPhoto() {
      this.fetchPostNewPhotoUrl()
        .then((data) => {
          //console.log(data);
        })
        .catch((e) => console.log(e));
    },

    // FETCH DELETE USER
    async fetchDeleteAccount(number) {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
        body: JSON.stringify({
          id: number,
          user_id: number,
        }),
      };

      let response = await fetch(
        "http://localhost:3000/auth/deleteAccount",
        requestOptions
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

    // DELETE USER
    deleteAccount(id) {
      this.fetchDeleteAccount(id)
        .then((data) => {
          //console.log(data);
          if (data["data"] === true) {
            this.logout();
          }
        })
        .catch((e) => console.log(e));
    },

    addImg(e) {
      const file = e.target.files[0];
      this.image = file;
      this.changePhoto = false;
      this.newUrl = URL.createObjectURL(file);
      this.newPhoto();
      this.$store.state.userConnectedInfos.photo = this.newUrl;
      localStorage.setItem(
        "connectedUser",
        JSON.stringify(this.$store.state.userConnectedInfos)
      );
    },
    removeImg() {
      this.newUrl = null;
      this.image = null;
      this.newPhoto();
      this.$store.state.userConnectedInfos.photo = null;
      localStorage.setItem(
        "connectedUser",
        JSON.stringify(this.$store.state.userConnectedInfos)
      );
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push("/");
    },
    // FETCH USER ON REFRESHING PAGE----------------------------------------------
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
  //FETCH USER ON REFRESHING PAGE
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
};
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 600px;
}
img {
  margin: 20px;
  border: white 2px solid;
  max-width: 80%;
  max-height: 100%;
  border-radius: 8px;
}
.infoCont {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
  color: white;
  padding: 15px;
  background: #185a9d;
  background: linear-gradient(90deg, #185a9d 26%, #43cea2 99%);
  border: 1px black solid;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.card__subtitle {
  align-self: center;
}
.photoCont {
  margin-top: 10px;
  width: 400px;
  background: #185a9d;
  background: linear-gradient(90deg, #185a9d 26%, #43cea2 99%);
  border: 1px black solid;
  border-radius: 5px;
}

ul,
li {
  font-size: 25px;
  list-style: none;
}
.primeBtn {
  margin-bottom: 10px;
  padding: 25px;
}
.btn {
  margin-top: 10px;
  font-size: 22px; /**/
  background-color: white;
  width: 200px; /**/
  height: 50px; /**/
}
.suppressCont {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
}

span {
  margin: 10px auto;
  border: black 1px solid;
  background-color: white;
  font-size: 25px;
  padding: 8px;
  /*font-weight: bolder;*/
}
span:active {
  transform: scale(0.9);
}
/* ancien span text supprimer */
.text {
  margin: 0px auto;
  border: none;
  background-color: transparent;
  font-size: 14px;
  font-weight: initial;
}
a {
  font-size: 30px;
}
#linkAnchor{
  text-decoration: none;
  color: black;
}
.pi {
  font-size: 20px;
  padding: 5px;
  margin-left: 2px;
}

input[type="file"] {
  display: none;
}
.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}

@media screen and (max-width: 1366px) {
  .photoCont {
    width: 550px;
    margin: 50px 0px;
  }
  ul,
  li {
    font-size: 25px;
  }
}
@media screen and (max-width: 767px) {
    .photoCont {
    width: auto;
    margin: 10px 0px
  }
  .btn {
    font-size: 18px; /**/
    width: 180px;
    height: 40px;
  }
  ul,
  li {
    font-size: 18px; /**/
  }
  span {
    font-size: 15px;
  }

  a {
    font-size: 18px;
    opacity: 0.8;
  }
}
</style>
