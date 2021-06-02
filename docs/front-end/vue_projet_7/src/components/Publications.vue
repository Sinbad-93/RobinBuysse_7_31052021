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

          <div v-for="(data,index) in publicationsData"
          :key="data" 
          :index="index" class="message" ref="message">
              <span>{{data.utilisateur}}</span>
              <span>{{data.title}}</span>
              <img :src="data.image" alt="">
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
          publicationsData : [
          {utilisateur : 'John',title : 'chat',image :require('../assets/IMG_0368.jpg')},
          {utilisateur : 'Joe',title : 'félin',image :require('../assets/IMG_0368.jpg')},
          {utilisateur : 'Johnny',title : 'animal',image :require('../assets/IMG_0368.jpg')}]
      }
  },
  methods : {
      switchDiscussion(){
          this.News = !this.News;
      },
      newPost(){
          this.newPostInProgress = !this.newPostInProgress;}
      ,
      publish(){
          console.log('publish');
        this.publicationsData.splice(0, 0, 
        {utilisateur : 'New',title :'NewPublication',image :require('../assets/IMG_0368.jpg')});
      }
      }
};
</script>
<style scoped>
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
    grid-template-rows: 1fr 1fr 8fr 1fr;
    justify-items: center;
    align-items: center;
    border: 1px black solid;
    height: 220px;
    margin-bottom : 20px;
}
.comment{
    border: 1px solid black;
    width: 100%;
    height: 100%;
}
.search {
    margin: 5px 0 10px 0;
}
img {
    max-width: 70%;
}
}
</style>