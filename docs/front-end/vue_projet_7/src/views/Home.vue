<template>
  <div class="home">
      <ul>
          <li>Mon profil</li>
          <li @click="switchDiscussion">Tchat</li>
          <li>Deconnexion</li>
      </ul>
      <h1 v-if="News">Fil d'actualité</h1>
      <h1 v-else>Tchat</h1>
      <input type="text" placeholder="Rechercher un collègue">
      <div class="discussion">
          <div class="message">
              <span>Utilisateur Fox :</span>
              <span>bonjour</span>
              <img src="../assets/groupomania.png" alt="">
          </div>
          
      </div>
    
  </div>
</template>

<script>


export default {
  name: "Home",
  components: {
  },
  data() {
      return {
          News : true,
      }
  },
  method : {
      switchDiscussion(){
          this.News = !this.News;
      }
  }
};
</script>
<style>
@media screen and (max-width : 768px) {
.home{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.discussion {
    height: 500px;
    overflow: scroll;
    max-width: 120%;
    background-color: white;
}
.message{
    display: grid;
    grid-template-rows: 1fr 1fr 3fr;
    justify-items: center;
    align-items: center;
    border: 1px black solid;
    height: 150px;
}
}
</style>
