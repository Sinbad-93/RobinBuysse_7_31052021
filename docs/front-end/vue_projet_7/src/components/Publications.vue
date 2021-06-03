<template>
<div>
      <h1>Fil d'actualité</h1>
      <div><button :disabled="newPostInProgress" @click="newPost">Publication</button>
      <input class="search" type="text" placeholder="Chercher un utilisateur"></div>
      <div class="discussion" ref="discussion">
          
          <div v-if="newPostInProgress" class="message" ref="newPublication">
          <span>Utilisateur name :</span>
          <input v-model="newTitle" placeholder='votre titre'/>
          <input v-model="newImg" placeholder='lien vers votre image'/>
          <div>
            <button @click="publish"> publier </button>
            <button @click="newPost"> annuler </button>
            </div>
            </div>
            <div v-for="(data,index) in publicationsData"
          :key="data" 
          :index="index">
          <div :index="index"  class="message" :ref="'message'+index">
              <span>{{data.utilisateur}}</span>
              <span>{{data.title}}</span>
              <img :src="data.image" alt="">
              <span class="reactions"> 
                  <i v-if="!like" @click="like=!like" class="far fa-heart interactiveIcons"></i>
                  <i v-else @click="like=!like" class="fas fa-heart full-heart interactiveIcons"></i> 21
                  <i v-if="!smile" @click="smile=!smile" class="fas fa-grin-beam interactiveIcons"></i>
                  <i v-else @click="smile=!smile" class="fas fa-grin-beam colored interactiveIcons"></i> 22
                  <i v-if="!laugh" @click="laugh=!laugh" class="far fa-grin-squint-tears interactiveIcons "></i>
                  <i v-else @click="laugh=!laugh" class="far fa-grin-squint-tears colored interactiveIcons"></i> 12
                <button :index="index" @click="openCommentsFunction(index)" class="commentButton">Commentaires</button> 
                  </span></div>
                  <Comments :index="index" v-if="indexCheck(index)" 
                  :ref="'comment'+index"
                   ></Comments></div>
          
      </div>
    
  </div>
</template>

<script>
import Comments from '../components/Comments.vue';

export default {
  name: "Home",
  components: {
      Comments
  },
  data() {
      return {
          newPostInProgress : false, 
          newTitle : '',
          newImg : '',
          like : false,
          smile : false,
          laugh : false,
          viewComment : false,
          focusIndex : [],
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
        if (this.newTitle != '' && this.newImg != ''){
        this.publicationsData.splice(0, 0, 
        {utilisateur : 'New',title : this.newTitle,image :this.newImg});}
        else { alert('veuillez ajouter un titre et une image')}
      },
      openCommentsFunction(index){
          //si les commentaires sont déjà visibles et qu'on clique
          if (this.focusIndex.includes(index)){
              var position = this.focusIndex.indexOf(index);
            if (position > -1) {
                // alors on retire l'index de la liste pour masquer les commentaires
                this.focusIndex.splice(position, 1);
            }
          }
          // si les commentaires sont masqués
          else {
        //inserer l'index dans la liste, donc les commentaires sont visibles
          this.focusIndex.push(index);}
      },
      indexCheck(index){
          if (this.focusIndex.includes(index)){ return true}
      }
      }
};
</script>
<style scoped>
@media screen and (max-width : 768px) {
.discussion {
    height: 480px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    max-width: 120%;
    background-color: white;
}
.message{
    display: grid;
    width: 100%;
    grid-template-rows: 1fr 1fr 8fr 1fr ;
    justify-items: center;
    align-items: center;
    border: 1px black solid;
    height: 220px;
    margin-bottom : 20px;
}
.reactions{
    border: 1px solid black;
    display: flex;
    width: 100%;
    height: 100%;
}
.search {
    margin: 5px 0 10px 0;
}
img {
    max-width: 70%;
}
.fa-heart {
  position: relative;
  cursor: pointer;
  font-size: 15px;
  color: rgb(214, 212, 212);;
}
.full-heart {
    color: red;
}
.fa-grin-beam {
    color: rgb(214, 212, 212);;
}
.fa-grin-squint-tears{
    color: rgb(214, 212, 212);
}
.colored {
    color: rgb(255, 174, 0);
}
.interactiveIcons{
margin: 5px 0 5px 10px;
}
.commentButton {
    margin-left: auto;
    margin-right: 5px;
}
@keyframes fill_heart {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
}
</style>