<template>
  <div class="centered">
    <i @click="Close()" class="far fa-times-circle"></i>
    <h3>Carte du profil</h3>
    <img v-if="!userState.photo" :src="basicUrl" alt="photo de profile" />
    <img v-else-if="photo" :src="userState.photo" alt="photo de profile" />
    <span> Prenom : {{ userState.name }}</span>
    <span> Nom : {{ userState.familly_name }}</span>
    <span> Email : {{ userState.email }}</span>
  <!-- Citation pour le fun, potentiellement personnalisable par utilisateur !-->
    <span>
      Citation : "Un grand pouvoir implique de grandes responsabilités"</span
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UsersCardInfos",
  components: {},
  props: [],
  data() {
    return {
      basicUrl: require("../assets/userImg.png"),
      photo : false,
    };
  },
  mounted() {},
  methods: {
    Close(){
    this.$emit('close');
    // permet de mettre un temps d'attente avant de voir l'image, autre methode mieux
    // serait de dispatch au store pour supprimer la photo au close
    this.photo = false;
    }
  },
  //STORE
  computed: {
    ...mapState({
      userPickedInfos: " userPickedInfos",
    }),
    // GETTERS STORE
    userState() {
      // permet d'attendre que l'image soit chargée
      //sinon montre l'ancienne image présente dans la variable du store pendant 0.5s
      setTimeout(() => {
        this.photo = true;
      }, 1000);
      return this.$store.getters.getUserPickedInfos;
    },
  },
};
</script>

<style scoped>
.userWindowInfos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 5px;
  position: absolute;
  top: 0;
  border: 5px solid grey; /**/
  background: rgb(233, 44, 19); /**/
  background: linear-gradient(
    90deg,
    rgba(233, 44, 19, 0.9752275910364145) 2%,
    rgba(254, 163, 2, 1) 52%,
    rgba(255, 239, 0, 1) 93%
  ); /**/
  width: 620px;
  height: 420px;
  z-index: 5;
}
span {
  font-size: 20px; /**/
}
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}
.fa-times-circle {
  /*margin-left: auto;*/
  align-self: flex-end;
  margin-right: 5px;
  margin-top: -15px; /**/
  font-size: 25px;
}
h3 {
  position: absolute; /**/
  left: 10px; /**/
  top: 20px; /**/
}
img {
  position: absolute; /**/
  border-radius: 20px;
  right: 80px; /**/
  top: 40px; /**/
  width: 220px; /**/
  height: 220px; /**/
}

@media screen and (max-width: 1366px) {
  .userWindowInfos {
    border: 3px solid grey; /**/
  }
  img {
    width: 120px; /**/
    height: 120px; /**/
  }
}
@media screen and (max-width: 767px) {
  .userWindowInfos {
    width: 320px;
    height: 280px;
  }
  .fa-times-circle {
    margin-right: 1px;
    margin-top: -8px; /**/
  }
  h3 {
    left: 5px; /**/
    top: 2px; /**/
  }
  img {
    border-radius: 20px;
    right: 20px; /**/
    top: 20px; /**/
    width: 100px; /**/
    height: 100px; /**/
  }
}
</style>
