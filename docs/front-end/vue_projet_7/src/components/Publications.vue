<template>
<div>
      <h1 v-if="News">Fil d'actualité</h1>
      <h1 v-else>Tchat</h1>
      <div><button :disabled="newPostInProgress" @click.prevent="newPost">Publication</button>
      <input class="search" type="text" placeholder="Chercher un utilisateur"></div>
      <div class="discussion" ref="discussion">
          
          <div v-if="newPostInProgress" class="message" ref="newPublication">
          <span>Utilisateur name :</span>
          <input placeholder='votre titre'/>
          <input placeholder='lien vers votre image'/>
          <div>
            <button @click="publish"> publier </button>
            <button @click="newPost"> annuler </button>
            </div>
            </div>

          <div class="message" ref="message">
              <span>Utilisateur Fox :</span>
              <span>titre</span>
              <img src="../assets/groupomania.png" alt="">
              <span class="comment"> Commentaires</span>
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
          newPostInProgress : false,
      }
  },
  methods : {
      switchDiscussion(){
          this.News = !this.News;
      },
      newPost(){
          this.newPostInProgress = !this.newPostInProgress;}
      },
      publish(){
          
      }
};
</script>
<style>
@media screen and (max-width : 768px) {
.discussion {
    height: 480px;
    overflow: scroll;
    max-width: 120%;
    background-color: white;
}
.message{
    display: grid;
    width: 100%;
    grid-template-rows: 1fr 1fr 3fr 1fr;
    justify-items: center;
    align-items: center;
    border: 1px black solid;
    height: 170px;
}
.comment{
    border: 1px solid black;
    width: 100%;
    height: 100%;
}
.search {
    margin: 5px 0 10px 0;
}
}
</style>