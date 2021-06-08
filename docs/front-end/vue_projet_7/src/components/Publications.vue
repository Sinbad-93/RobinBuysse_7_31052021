<template>
<div>
      <h1 class="mainTitle">Fil d'actualité</h1> <button @click="findAllPublications">FETCH</button>
      <div><button :disabled="newPostInProgress" class="btn-grad"
       @click="newPostInProgress = !newPostInProgress">Publication</button>
      <input class="search" type="text" :placeholder="searching">
      <button @click="typeOfSearch"> {{searchingSwitch}}</button></div>
      <div class="discussion" ref="discussion">
          
          <div v-if="newPostInProgress" class="message" ref="newPublication">
          <span>Utilisateur name :</span>
          <input v-model="newTitle" placeholder='votre titre'/>
          <input v-if="!newUrl" type="file" accept="image/*" @change="addImg" />
          <input v-else type="button" value="retirer" @click="removeImg" />
            <img v-if="newUrl" :src="newUrl" />
          <div>
            <button @click="publishPublication"> publier </button>
            <button @click="newPostInProgress = !newPostInProgress"> annuler </button>
            </div>
            </div>
            <div v-else-if="(loading) && !(newPostInProgress)" class="message loading" 
            ref="newPublication">LOADING</div>
            <div v-for="(data,index) in publicationsData"
          :key="data" 
          :index="index">
          <div :index="index"  class="message" :ref="'message'+index">
              <span class="user metal radial">{{data.name}} {{data.familly_name}} : </span>
              <span class="messageTitle">{{data.publication_title}}</span>
              <span class="messageHour">{{data.date_added}}</span>
              <img :src="data.publication_media" alt="">
              <span class="reactions"> 
                  <i  @click="likeFunction(event)" class="far fa-heart interactiveIcons"></i> 21
                  <i :index="index" @click="smileFunction(event)" class="fas fa-grin-beam interactiveIcons"></i> 22
                  <i :index="index" @click="smileFunction(event)" class="far fa-grin-squint-tears interactiveIcons "></i> 12
                  <i v-if="adminConnected" class="fas fa-trash-alt interactiveIcons"></i>
                <button :index="index" @click="openCommentsFunction(index)" class="commentButton">Commentaires</button> 
                  </span></div>
                  <Comments :index="index" :adminConnected="adminConnected" v-if="indexCheck(index)" 
                  :ref="'comment'+index"
                   ></Comments></div>
          
      </div>
    
  </div>
</template>

<script>
import Comments from '../components/Comments.vue';
import { mapState } from 'vuex'

export default {
  name: "Home",
  components: {
      Comments
  },
  props : ['adminConnected'],
  data() {
      return {
          searchingUser : false,
          searching :'Chercher un post',
          newPostInProgress : false, 
          searchingSwitch : 'post',
          newTitle : '',
          image : null,
          newUrl: null,
          like : false,
          smile : false,
          laugh : false,
          loading : false,
          viewComment : false,
          focusIndex : [],
          publicationsData : [
          {publication_user_id : 'John',publication_title : 'chat',publication_media :require('../assets/IMG_0368.jpg')},
          {publication_user_id : 'Joe',publication_title: 'félin',publication_media :require('../assets/IMG_0368.jpg')},
          {publication_user_id : 'Johnny',publication_title : 'animal',publication_media :require('../assets/IMG_0368.jpg')}]
      }
  },
  methods : {
    // POST PUBLICATIONS ----------------------------------------------
    async fetchPostPublication() {
       if(! (this.newTitle === "") 
       && !(this.newUrl === "")
         ){
        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("title", this.newTitle);
        formData.append("user_id",this.user.id_user)
        
        const requestOptions = {
        method: 'POST',
        body: formData
            };

        let response = await fetch('http://localhost:3000/publish/publication', requestOptions);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();}  
            //si un champ est resté vide on ne passe pas dans fetch
            else{
              console.log('veuillez remplir tous les champs')
              }},

    publishPublication(){
      this.fetchPostPublication().then((data) => {
        console.log(data);
        //fermer la fenetre de publication
        this.newPostInProgress = false;
        this.loading = true;
        // rafraichir les données
        this.findAllPublications()
      }).catch(e => console.log(e));},

    // GET PUBLICATIONS ----------------------------------------------

    async fetchGetPublications() {

        let response = await fetch('http://localhost:3000/publish/find_publications');
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},
    
    // display publications
    findAllPublications(){
      this.fetchGetPublications().then((data) => {
        this.publicationsData = [];
        var size = this.objectSize(data['data']);
        size = size.reverse();
        //console.log(size);
        size.forEach(size => {
            this.publicationsData.push(data['data'][size])
        });
        //this.publicationsData.slice().reverse();    
        this.loading = false;
      }).catch(e => console.log(e));},

    switchDiscussion(){
          this.News = !this.News;
      },

    publish(){
          console.log('publish');
        if (this.newTitle != '' && this.newUrl != ''){
        this.publicationsData.splice(0, 0, 
        {utilisateur : 'New',title : this.newTitle,image :this.newUrl});}
        else { alert('veuillez ajouter un titre et une image')}
      },
    addImg(e) {
      const file = e.target.files[0]
      this.image = file
      this.newUrl = URL.createObjectURL(file)
                },
    removeImg(){
      this.newUrl = null;
      this.image = null;
        },
    
    objectSize (obj) {
        var size = [];
        var itération = 0,
        key;
        for (key in obj) {
             if (obj.hasOwnProperty(key))  itération++ ; size.push(itération-1);
                         }
        return size;
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
      },

    smileFunction(){
          if(event.target.style.color === 'rgb(255, 174, 0)'){
              event.target.style.color = 'rgba(0, 0, 0,0.6)'
          }
          else{
              event.target.style.color = 'rgb(255, 174, 0)'
          }
          
      },

    likeFunction(){
          event.target.classList.toggle('fas') 
          event.target.classList.toggle('far') 
          event.target.classList.toggle('full-heart') 
          
      },

    typeOfSearch(){
          if (this.searchingUser === true){
              this.searching ="Chercher un utilisateur"
              this.searchingSwitch ="user"}
          else{
             this.searching ="Chercher un post"
             this.searchingSwitch ="post"}
                    this.searchingUser = !this.searchingUser;
                    }
        
    },
    computed: {
    ...mapState({
      user: 'userConnectedInfos',
    })
  }
};
</script>
<style >
@media screen and (max-width : 768px) {
.mainTitle{
    font-size: 20px;
    margin: 30px 0;
    border-radius: 5px;
    background-color: rgb(212, 253, 253);
}
.discussion {
    height: 530px;
    border-radius: 5px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    max-width: 120%;
    background-image: linear-gradient(62deg, #7efbc1 0%, #c0f768 100%);
}
.message{
    display: grid;
    width: 100%;
    background-color: rgb(212, 253, 253);
    grid-template-rows: 1fr 1fr 1fr 8fr 1fr ;
    justify-items: center;
    align-items: center;
    border: 1px black solid;
    border-radius: 5px;
    height: 280px;
    margin-top : 70px;
    margin-bottom : 60px;
}
.messageHour{
    font-size: 12px;
}
.loading{
    background-color: rgb(255, 255, 255);
}
.user {
justify-self: flex-start;
margin-left: 5px;
font-size: 14px;
background-color: rgb(238, 228, 228);
border-radius: 10px;
padding-left: 10px;
padding-right: 10px;
}

.messageTitle {
 color: #FFFFFF;
text-shadow: 2px 2px 0 #4074b5, 2px -2px 0 
#4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 
#4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5;
}
img {
    max-width: 80%;
    border-radius: 5px;
}
.reactions{
    /*border: 1px solid black;*/
    display: flex;
    width: 100%;
    height: 100%;
}

.search {
    margin: 5px 0 10px 5px;
}

.fa-heart {
  position: relative;
  cursor: pointer;
  font-size: 15px;
  color: red;
}
.full-heart {
    color: red;
}
.fa-grin-beam {
    color: rgba(12, 9, 9, 0.6);
}
.fa-grin-squint-tears{
    color: rgba(0, 0, 0,0.6);
}
.interactiveIcons{
margin: 5px 0 5px 10px;
}
.commentButton {
    margin-left: auto;
    margin-right: 5px;
    max-height: 20px;
    border: none;
    background-color: rgb(212, 253, 253);
}
@keyframes fill_heart {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* style metal and blue link utilisateur */
.metal {
  position: relative;
  outline: none;
  font: bold "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
  text-align: center;
  color: hsla(0,0%,20%,1);
  text-shadow: hsla(0,0%,40%,.5) 0 -1px 0, hsla(0,0%,100%,.6) 0 2px 1px;
  background-color: hsl(0,0%,90%);
  transition: color .2s;}
.radial.metal {
  border-radius: 80px;
  background-image:
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,  0%,0) 0%, hsla(0,0%,  0%,0)   3%, hsla(0,0%,  0%,.1) 3.5%),
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0)   6%, hsla(0,0%,100%,.1) 7.5%),
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.2) 2.2%),
    -webkit-radial-gradient( 50% 50%, 200% 50%, hsla(0,0%,90%,1) 5%, hsla(0,0%,85%,1) 30%, hsla(0,0%,60%,1) 100%);
}

.metal:active {
  color: hsl(210, 100%, 40%);
  background-color: white;
  text-shadow: hsla(210,100%,20%,.3) 0 -1px 0, hsl(210,100%,85%) 0 2px 20px, hsla(200,100%,80%,1) 0 0 15px, hsla(210,100%,50%,.6) 0 0 20px;
  box-shadow: inset hsl(210, 100%, 40%) 0  0px 0px 3px, /* border */
                    hsla(0,0%,100%,.5) 0  5px 6px 4px; /* outer HL */;
}
.radial:active  {
    background-image: none;
}
/*bouton de publication */

.btn-grad {background-image: linear-gradient(to right, #43cea2 0%, #185a9d  51%, #43cea2  100%)}
.btn-grad {
   padding: 5px 5px;
   text-align: center;
   text-transform: uppercase;
   transition: 0.5s;
   background-size: 200% auto;
   color: white;            
   box-shadow: 0 0 20px #eee;
   border-radius: 10px;
   }

 .btn-grad:hover {
   background-position: right center; /* change the direction of the change here */
   color: #fff;
   text-decoration: none;
 }
 /* for comments and answer components*/
.littleHeight {
    padding: 5px 20px;
    margin-bottom: 30px;
}         

}
</style>