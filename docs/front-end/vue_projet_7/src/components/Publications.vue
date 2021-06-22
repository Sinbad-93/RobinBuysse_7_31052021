<template>
<div>
<button  @click="testo()">testo</button>
      <h1 class="mainTitle">Fil d'actualité</h1> 
     <!-- {{optionBinder}} {{refresh}}!-->
      <!--button @click="findAllPublications">FETCH</button!-->
      <div class="interactiveCont">
        
        <select ref="select" v-model="selected" name="sort" id="sort-select">
    <option value="default">Date : récente</option>
    <option value="old">Date : ancienne</option>
    <option value="heart">le plus de coeur</option>
    <option value="smile">le plus de sourire</option>
    <option value="laugh">le plus de rire</option>
    <option value="reactions">le plus de réactions</option>
</select>

      <div  class="searchCont">
      <input class="search" type="text" :placeholder="searching" 
      @focus="checkSearchMode()" v-model="search">
       <div class="searchWindowCont" v-if="searchWindow&&(searchingSwitch==='user')">
       <div class="searchWindow">
       <span @click="getOneUser('bySearch',findUser.id)" v-for="findUser in allUsersState" 
       :key="findUser" >{{findUser.id}} {{findUser.name}} {{findUser.famillyName}}</span></div>
       <button @click="searchWindow = false" class="searchQuit">quit</button>
       </div>
       <transition name='opacity'> <UsersCardInfos @close="findingUser = false" 
              v-if="findingUser" class="userWindowInfos"></UsersCardInfos></transition>
      </div>
      <button @click="typeOfSearch" > {{searchingSwitch}}</button>
     </div>
     <button :disabled="newPostInProgress" class="btn-grad"
       @click="newPostInProgress = !newPostInProgress">Publication</button>
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
                >LOADING</div>

<!---------------------AFFICHAGE TOTAL DE TOUTES LES PUBLICATIONS----------!-->

                     <div v-for="(findPublication, index) in filterPublications"
          :key="findPublication" :index="index" :id_db="findPublication.id"
          > 
            <div :index="index" :id_db="findPublication.id" class="message" 
          :ref="'message'+index">
              <span :index="index" ref="username" 
              @click="focusIndexFn(index,findPublication.user)" 
              class="user metal radial">{{findPublication.name}} {{findPublication.familly}} : </span>
              <span class="messageTitle">{{findPublication.title}}</span>
              <span class="messageHour">{{findPublication.date}}</span>
              <img :src="findPublication.media" alt="">
              <transition name='opacity'>
                <UsersCardInfos @close="focusIndexUser = null"
              :index="index" :id_db="findPublication.id" 
              v-if="openInfos(index)" class="userWindowInfos"></UsersCardInfos>
              </transition>
              
              
              <div class="reactions_container">
                <Reactions 
                :id_db="findPublication.id" :adminConnected="adminConnected" 
                :user="user" :index="index" class="reactions"> </Reactions>
              
              <button :index="index" @click="openCommentsFunction(index)" class="commentButton">Commentaires</button>
              </div>
          </div>
               
                  <Comments :id_db="findPublication.id" :objectSize="objectSize" :user="user" :index="index" :adminConnected="adminConnected" v-if="indexCheck(index)" 
                  :ref="'comment'+index"
                   ></Comments>
          
                   </div>
<!-------------------------------------------------------!-->
      </div>
    
  </div>
</template>

<script>
import Comments from '../components/Comments.vue';
import Reactions from '../components/Reactions.vue';
import UsersCardInfos from '../components/UsersCardInfos.vue';
import { mapState } from 'vuex'

class User {
  constructor(name, famillyName,id) {
    this.name = name;
    this.famillyName =famillyName;
    this.id = id;
  }
}

class PublicationsObject {
  constructor(title, name, familly, id, date, media,user) {
    this.title = title;
    this.name = name;
    this.familly = familly;
    this.id = id;
    this.date = date;
    this.media = media;
    this.user = user;
  }
}

export default {
  name: "Home",
  components: {
      Comments, Reactions, UsersCardInfos
  },
  props : ['adminConnected'],
  data() {
      return {
          searchingUser : false,
          searching :'Chercher un post',
          newPostInProgress : false, 
          searchingSwitch : 'post',
          newTitle : '',
          searchWindow : false,
          image : null,
          newUrl: null,
          loading : false,
          viewComment : false,
          userWindowInfos : false,
          focusIndex : [],
          focusIndexUser : null,
          findingUser : false,
          publicationsData : [],
          isMounted : false,
          option : 'Trier par',
          search : '',
          selected : 'default',
          userList : [
            new User('blabla1', 'blaba2'),
            new User('blabla3', 'blalbla4') ]
      }
  },
  mounted() {
    this.isMounted = true;
      this.findAllPublications(this.user.id_user);
      this.$store.dispatch('getAllUsers', this.user.id_user);
  },
  computed:  {
    ...mapState({
      user: 'userConnectedInfos',
    }),
    userState() {

    console.log(this.$store.getters.getUser);
    
      // Getters
      return this.$store.getters.getUser;
      
    },
    refresh(){
      //console.log('rafraichir : ',this.$store.getters.refresh);
      this.findAllPublications(this.$store.getters.getUser.id_user);
      return this.$store.getters.refresh;
    },

    allUsersState() {
      let loopsBox;
      var usersList = [];
     console.log(this.$store.getters.getAllUsers);
     loopsBox = this.$store.getters.getAllUsers;
     for ( let i =0; i < loopsBox.length; i++){
       //console.log(loopsBox[i].name);
       // console.log(loopsBox[i].familly_name);
        //console.log(loopsBox[i].id);
        usersList.push(new User(loopsBox[i].name, loopsBox[i].familly_name, loopsBox[i].id));

     }
     //console.log(usersList);
      // Getters
      return usersList.filter(user => {
        return user.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    optionBinder(){
      /*if(this.isMounted === true){
      this.option = this.$refs.select.options[this.$refs.select.selectedIndex].text;}
      return this.option;*/
      return this.selected
    },
    filterPublications() {
      //selecteur de tri
      let loopsBox;
      var publicationsObject = [];
     loopsBox = this.publicationsData;
     for ( let i =0; i < loopsBox.length; i++){
        //console.log(loopsBox[i].id_publication);
        publicationsObject.push(new PublicationsObject(loopsBox[i].publication_title,
        loopsBox[i].name, loopsBox[i].familly_name, loopsBox[i].id_publication,
        loopsBox[i].date_added, loopsBox[i].publication_media, loopsBox[i].publication_user_id));

     }
     //console.log(publicationsObject);
      // Getters
      if((this.searchingSwitch === "post") && (this.selected === 'default')){
      return publicationsObject.filter(publicationsTitle => {
        return publicationsTitle.title.toLowerCase().includes(this.search.toLowerCase())
      })
    } 
      else if( this.selected === 'old'){
          return publicationsObject.reverse()
        }
      else if( this.selected === 'heart'){
          var allIdMap = new Map();
          allIdMap = this.sortWithMap(loopsBox,this.user.numberOfReactions,allIdMap,0);
           let publicationsHeart = [];
           return this.sortByreactions(publicationsObject,publicationsHeart,allIdMap,loopsBox);
      }
      else if( this.selected === 'smile'){
          var allIdMap = new Map();
          allIdMap = this.sortWithMap(loopsBox,this.user.numberOfReactions,allIdMap,1);
           let publicationsSmile = [];
           return this.sortByreactions(publicationsObject,publicationsSmile,allIdMap,loopsBox);
        }
      else if( this.selected === 'laugh'){
          var allIdMap = new Map();
          allIdMap = this.sortWithMap(loopsBox,this.user.numberOfReactions,allIdMap,2);
           let publicationsLaugh = [];
           return this.sortByreactions(publicationsObject,publicationsLaugh,allIdMap,loopsBox);
        }
      else if( this.selected === 'reactions'){
          var allIdMap = new Map();
          allIdMap = this.sortWithMap(loopsBox,this.user.numberOfReactions,allIdMap,3);
           let publicationsTotalReactions = [];
          return this.sortByreactions(publicationsObject,publicationsTotalReactions,allIdMap,loopsBox);
        }
      else if (this.searchingSwitch === "user"){
        return publicationsObject
      }
    },
        },

  watch: {
    refresh (newCount, oldCount) {
      // Our fancy notification (2).
      console.log(`actualisation ${newCount} `)
    }
  },
  methods : {
    testo(){//this.$store.dispatch('getAllUsers');
    //console.log(this.user.numberOfReactions[28].reactions[1]);
    //console.log(JSON.parse(localStorage.getItem('token')));
    //console.log(this.user.token);
      
    },
    // POST PUBLICATIONS ----------------------------------------------
    async fetchPostPublication() {
       if(! (this.newTitle === "") 
       && !(this.newUrl === "")
         ){
           console.log('données :', this.image, this.user.id_user);
        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("title", this.newTitle);
        formData.append("user_id",this.user.id_user);
        
        const requestOptions = {
        method: 'POST',
        headers : {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
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
        this.findAllPublications(this.user.id_user)
      }).catch(e => console.log(e));},

    // GET PUBLICATIONS ----------------------------------------------

    async fetchGetPublications(id) {

        let response = await fetch('http://localhost:3000/publish/find_publications/' +id,
        {method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
      });
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},
    
    // display publications
    findAllPublications(id){
      this.fetchGetPublications(id).then((data) => {
        this.publicationsData = [];
        var size = this.objectSize(data['data']);
        size = size.reverse();
        //console.log(size);
        //console.log('FETCH PUBLICATION');
        size.forEach(size => {
            this.publicationsData.push(data['data'][size])
        });
        //this.publicationsData.slice().reverse();    
        this.loading = false;
      }).catch(e => console.log(e));},

      checkSearchMode(){
        if(this.searchingSwitch === 'user')
        {this.searchWindow = true};
        if(this.searchingSwitch === 'post')
        {this.searchWindow = false};
      },

    switchDiscussion(){
          this.News = !this.News;
      },
    addImg(e) {
      const file = e.target.files[0];
      this.image = file;
      this.newUrl = URL.createObjectURL(file);
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
      focusIndexFn(number, id){
        console.log(id);
        this.getOneUser('byClick',id);
        //this.$store.dispatch('getOneUser', id)
        this.findingUser = false;
        this.focusIndexUser = number;
        //console.log(this.focusIndexUser);
      },
      getOneUser(type,id){
        //console.log(findUser.id);
        console.log(id);
        // id de l'utilisateur que je cherche et id de l'utilisateur connecté
        // on utilise l'id utilisateur pour passer l'authentification
        const ids = id + '_' + this.user.id_user;
        this.$store.dispatch('getOneUser', ids);
        if (type === 'bySearch'){
        this.findingUser = true;}
      },
      openInfos(number){
        if(this.focusIndexUser != null){
        if(this.focusIndexUser === number ){return true}}
        return false
      },
      sortWithMap(loopsBox,numberOfReactions,allIdMap,numb){
        if(numb > 2){
          for ( let i =0; i < loopsBox.length; i++){
            if (!(numberOfReactions[loopsBox[i].id_publication])){
              allIdMap.set(loopsBox[i].id_publication , 0);
            }
           else if (numberOfReactions[loopsBox[i].id_publication]){
             allIdMap.set(loopsBox[i].id_publication , (numberOfReactions[loopsBox[i].id_publication].reactions[0]
             + numberOfReactions[loopsBox[i].id_publication].reactions[1]
             + numberOfReactions[loopsBox[i].id_publication].reactions[2]));
           };}
        }
        else {
        for ( let i =0; i < loopsBox.length; i++){
            if (!(numberOfReactions[loopsBox[i].id_publication])){
              allIdMap.set(loopsBox[i].id_publication , 0);
            }
           else if (numberOfReactions[loopsBox[i].id_publication]){
             allIdMap.set(loopsBox[i].id_publication , (this.user.numberOfReactions[loopsBox[i].id_publication].reactions[numb]));
           };}}
           return allIdMap;
      },
      sortByreactions(object, array, mapObject, loopsBox){
        
        const allIdMapSorted = new Map([...mapObject.entries()].sort((a, b) => b[1] - a[1]));
           allIdMapSorted.forEach((value, clé, map) => {
          //console.log(`map.get('${clé}') = ${value}`);
          for ( let i =0; i < object.length; i++){
            if(object[i].id === clé ){;
              array.push(new PublicationsObject(loopsBox[i].publication_title,
              loopsBox[i].name, loopsBox[i].familly_name, loopsBox[i].id_publication,
              loopsBox[i].date_added, loopsBox[i].publication_media, loopsBox[i].publication_user_id));
            }
            }
            });
            return array
      },

    indexCheck(index){
          if (this.focusIndex.includes(index)){ return true}
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
  }
    }
</script>
<style scoped>
@media screen and (max-width : 768px) {
.mainTitle{
    font-size: 20px;
    margin: 10px 0;
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
.reactions_container {
    display: flex;
    width : 100%;
    justify-content: space-between;
}
.interactiveCont {
  display: flex;
  margin-bottom: 8px;

}
.searchCont {
  position: relative;
  height: 25px;

}
.search {
    /*margin: 5px 0 10px 5px;*/
}
.searchWindowCont{
  position: absolute;
  z-index: 5;
  right: 0;
  height: 200px;
  width: 95%;
}
.searchWindow {
  
  padding-left: 8px;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px black solid;
  height: 200px;
  width: 100%;
  
  
}
.searchQuit {
  position: absolute;
  left: 0;
  bottom: -20px;
  width: 100%;

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

.opacity-enter-active {
    animation : enterAnimation 1.5s ease-in;
}
.opacity-leave-active {
    animation : outAnimation 0.4s ease-in-out;
}

@keyframes enterAnimation {
    from { opacity : 0;}
    to { opacity : 1;}
}
@keyframes outAnimation {
    from { opacity : 1;}
    to {opacity: 0;}
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