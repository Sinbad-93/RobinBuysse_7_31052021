<template>
  <div class="profile">
    <div><router-link to="Home">Home</router-link> <br>
   </div>
    <h1 class="card__title">Mon profil</h1>
    <ul class="card__subtitle">Mes informations :</ul>
    <li>Prénom: {{user.name}}</li> <li>Nom : {{user.familly_name}} </li><li>E-mail : {{user.email}}</li>
    <!--p>{{user.prenom}} {{user.nom}} {{user.email}}</p!-->
    <img src="../assets/IMG_0368.jpg"/>
    <span>changer ma photo de profil</span>
    <div class="form-row">
      <router-link to="/"><button @click="logout()" class="button">
        Déconnexion  
      </button></router-link>
    </div>
    <span @click="suppression=true">supprimer mon compte</span>
    <div v-if="suppression"><span>êtes vous sur ? cette action est défnitive</span>
    <button>confirmer</button> <button  @click="suppression=false">retour</button></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Profile',
  data(){
      return {
          suppression : false
      }
  },
  /*mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getUserInfos');
  },*/
  computed: {
    ...mapState({
      user: 'userConnectedInfos',
    })
  },/*
  methods: {
    logout: function () {
      this.$store.commit('logout');
      this.$router.push('/');
    }
  }*/
}
</script>

<style scoped>
@media screen and (max-width : 768px) {
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 600px;
}
img {
    margin: 50px;
  max-width: 80%;
  border-radius: 8px;
}
button{
    background-color: white;
    width: 150px;
    height: 30px;
}
}
</style>