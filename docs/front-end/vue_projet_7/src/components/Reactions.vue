

<template>
<div class="reactions" ref="reactions" :id_db="id_db" > 
<button :id_db="id_db"  @click="testo(id_db)">testo</button>
    <i v-if="fnTest(0)" :id_db="id_db"  @click="likeFunction(id_db)" 
    class='fas fa-heart interactiveIcons full-heart'>
        </i>
    <i  v-else :id_db="id_db" :index="index" @click="likeFunction(id_db)" 
        class="far fa-heart interactiveIcons"></i> 
        <!-- ici on utlise v-if car on ne peut pas afficher 
        userState.numberOfReactions[id_db].reactions[0] 
        tant que l'objet numberOfReactions est vide, cela crée une erreur !--> 
        <span v-if="fnTest_2(0)" :id_db="id_db" > 
              {{parentReactions[0]}}
        <!-- equivalent à  {{userState.numberOfReactions[id_db].reactions[0]}} !-->
        </span>
         <span v-else> 
              0
        </span>


        <i  v-if="fnTest(1)" :id_db="id_db" :index="index" @click="smileFunction(id_db)" 
        class='fas fa-grin-beam interactiveIcons orange'></i> 

        <i  v-else :id_db="id_db" :index="index" @click="smileFunction(id_db)" 
        class="fas fa-grin-beam interactiveIcons black "></i> 
        
        <span v-if="fnTest_2(1)"> 
              {{parentReactions[1]}} 
               <!-- equivalent à  {{userState.numberOfReactions[id_db].reactions[1]}} !-->
        </span>
         <span v-else> 
              0
        </span>
        
        <i v-if="fnTest(2)" :id_db="id_db" :index="index" @click="laughFunction(id_db)" 
        class="far fa-grin-squint-tears interactiveIcons orange"></i>

        <i v-else :id_db="id_db" :index="index" @click="laughFunction(id_db)" 
        class="far fa-grin-squint-tears interactiveIcons black"></i>
        
        <span v-if="fnTest_2(2)" :id_db="id_db"> 
              {{parentReactions[2]}} 
              <!-- equivalent à  {{userState.numberOfReactions[id_db].reactions[2]}} !-->
        </span>
        <span v-else> 
              0
        </span>
        
        <i v-if="adminConnected" 
        class="fas fa-trash-alt interactiveIcons"></i> 
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "Reactions",
  components: {
  },
  props: ['index','adminConnected',"id_db","id_2"],
  data() {
      return {
        heart : false,
        smile : false,
        laugh : false,
        id_user : null,
        id_parent_publication : null,
        reaction :"",
        parentReactions : {0:0,1:0,2:0},
  }
  },
mounted(){
    
  },
  computed:  {
    ...mapState({
      user: 'userConnectedInfos',
    }),
    userState() {

     console.log(this.$store.getters.getUser);

      // Getters
      return this.$store.getters.getUser;
    }},
  methods : {
      // FUNCTIONS --------------------------------,
      testo(id_db){
       console.log(this.user);
       console.log(this.user.userReactions[21]);
       //console.log(this.user.numberOfReactions[28].reactions[0]);
       
       console.log(id_db);
      },
      isObjEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
},
isKeyExists(obj,key){
    if( obj[key] == undefined ){
        return false;
    }else{
        return true;
    }
},
      fnTest(number){

        //console.table(this.user);
        //console.log(this.isObjEmpty(this.user.userReactions));
        if (this.isObjEmpty(this.user.userReactions) === true){
        switch(number){
        case(0):
        this.heart = false;
        case(1):
        this.smile = false;
        case(2):
        this.laugh = false;}
        return false}
        else if(this.isKeyExists(this.user.userReactions, this.id_db)){
          if(this.user.userReactions[this.id_db].reactions[number] === 1){
            if(number === 0){
              this.heart = true;
            }
            else if(number === 1){
              this.smile= true;
            }
            else if(number === 2){
              this.laugh = true;
            }
        return true}
          }
        else {
          switch(number){
        case(0):
        this.heart = false;
        case(1):
        this.smile = false;
        case(2):
        this.laugh = false;}
          return false
        }
        
      },
      fnTest_2(number){

        //console.table(this.user);
        //console.log(this.isObjEmpty(this.user.userReactions));
        if (this.isObjEmpty(this.user.numberOfReactions) === true){
        return false}
        else if(this.isKeyExists(this.user.numberOfReactions, this.id_db)){
         this.parentReactions[number] =  this.user.numberOfReactions[this.id_db].reactions[number]; 
        return true
          }
        else {
          return false
        }
        
      },

    // POST REACTIONS ----------------------------------------------
        
    async fetchPostReaction(number) {
        this.id_parent_publication = number;
        this.id_user = this.user.id_user;

        const requestOptions = {
        method : 'POST',
        headers : { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            reaction : this.reaction,
            id_parent_publication : this.id_parent_publication,
            heart : this.heart,
            smile : this.smile,
            laugh : this.laugh,
            id_user : this.id_user
          })};

        let response = await fetch('http://localhost:3000/publish/postReaction', requestOptions);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},

        // publish REACTIONS ----------------
    publishReaction(number){
      this.fetchPostReaction(number).then((data) => {
        console.log('pub'+ data);
      this.$store.dispatch("findAllReactions");
        //this.findAllReactions()
      }).catch(e => console.log(e));},

    
    
// DELETE REACTIONS ----------------------------------------------
        
    async fetchDeleteReaction(number) {
        this.id_parent_publication = number;
        this.id_user = this.user.id_user;

        const requestOptions = {
        method : 'DELETE',
        headers : { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            reaction : this.reaction,
            id_parent_publication : this.id_parent_publication,
            heart : this.heart,
            smile : this.smile,
            laugh : this.laugh,
            id_user : this.id_user
          })};

        let response = await fetch('http://localhost:3000/publish/deleteReaction', requestOptions);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},

        // Cancel Reaction  ----------------
    cancelReaction(number){
      this.fetchDeleteReaction(number).then((data) => {
        console.log('del' + data);
        this.$store.dispatch("findAllReactions");

        //this.findAllReactions()
      }).catch(e => console.log(e));},
      

    likeFunction(number){
        //this.heart = !this.heart;
        event.target.classList.toggle('fas') ;
        event.target.classList.toggle('far') ;
        event.target.classList.toggle('full-heart');
        //var number = event.target.getAttribute('id_db');
         console.log(this.heart);
        this.reaction = 'heart';
        if (this.heart === false){
        this.heart = !this.heart;
        this.publishReaction(number);}
        else {
          this.heart = !this.heart;
            this.cancelReaction(number);
        }
          
      },
    smileFunction(number){

        event.target.classList.toggle('orange') ;
        event.target.classList.toggle('black') ;
        console.log(this.smile);
        this.reaction = 'smile';
        if (this.smile === false){
        this.smile = !this.smile;
        this.publishReaction(number);}
        else {
          this.smile = !this.smile;
            this.cancelReaction(number);
        }

            },
    laughFunction(number){
          
        event.target.classList.toggle('orange') ;
        event.target.classList.toggle('black') ;
        console.log(this.laugh);
        this.reaction = 'laugh';
        if (this.laugh === false){
        this.laugh = !this.laugh;
        this.publishReaction(number);}
        else {
          this.laugh = !this.laugh;
            this.cancelReaction(number);
        }

            },


}}
</script>

<style scoped>
@media screen and (max-width : 768px) {

.fa-heart {
  position: relative;
  cursor: pointer;
  font-size: 15px;
  color: red;
}
.full-heart {
    color: red;
}
.orange{
  color:orange
}
.black{
color: rgba(0, 0, 0,0.6);
}
.interactiveIcons{
margin: 5px 0 5px 10px;
}
.no_display {
    display : none;
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