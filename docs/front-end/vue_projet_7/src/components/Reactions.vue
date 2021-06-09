

<template>
<div class="reactions" ref="reactions" :id_db="id_db" > 
    
    <button @click="findAllReactions">test</button>
    <i :id_db="id_db"  @click="likeFunction(id_db)" 
        v-for="(data,index) in userReactions" :key="data" 
          :index="index"
        :class="[((userReactions[index].id === id_db) &&(userReactions[index].reactions[0] === 1))?
        'fas fa-heart interactiveIcons full-heart':'no_display ',
        index === 1 ? 'far fa-heart interactiveIcons':null]"></i> 
         

        <span v-for="(data,index) in parentReactions"
          :key="data" 
          :index="index"
          :style="(parentReactions[index].id !== id_db)?{'display':'none'}:null"
          > 
              {{parentReactions[index].reactions[0]}}

        </span>


        <i :id_db="id_db" :index="index" @click="smileFunction(id_db)" 
        class="fas fa-grin-beam interactiveIcons"></i> 
        
        <span v-for="(data,index) in parentReactions"
          :key="data" 
          :index="index"
          :style="(parentReactions[index].id !== id_db)?{'display':'none'}:null"> 
              {{parentReactions[index].reactions[1]}}
        </span>
        
        <i :id_db="id_db" :index="index" @click="laughFunction(id_db)" 
        class="far fa-grin-squint-tears interactiveIcons "></i>
        
        <span v-for="(data,index) in parentReactions"
          :key="data" 
          :index="index"
          :style="(parentReactions[index].id !== id_db)?{'display':'none'}:null"> 
              {{parentReactions[index].reactions[2]}}
        </span>
        
        <i v-if="adminConnected" 
        class="fas fa-trash-alt interactiveIcons"></i> 
</div>
</template>

<script>


export default {
  name: "Reactions",
  components: {
  },
  props: ['user','index','adminConnected',"id_db"],
  data() {
      return {
        heart : false,
        smile : false,
        laugh : false,
        id_user : null,
        id_parent_publication : null,
        reaction :"",
        parentReactions : [],
        userReactions: [],
  }
  },
  methods : {
      // FUNCTIONS --------------------------------,
      testo(){
        var el = this.$refs.reactions.parentNode.parentNode;
        //console.log(el.getAttribute('id_db'));
        this.id_parent_publication = el.getAttribute('id_db');
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
        console.log(data);

        //this.findAllReactions()
      }).catch(e => console.log(e));},

    // GET REACTIONS ----------------------------------------------

    async fetchGetReactions() {

        let response = await fetch('http://localhost:3000/publish/find_reactions');
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},
    
    // display REACTIONS ------------------
    findAllReactions(){
        this.fetchGetReactions().then((data) => {
        this.sortReactions(data);

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
        console.log(data);

        //this.findAllReactions()
      }).catch(e => console.log(e));},
      

    likeFunction(number){
        this.heart = !this.heart;
        event.target.classList.toggle('fas') ;
        event.target.classList.toggle('far') ;
        event.target.classList.toggle('full-heart');
        //var number = event.target.getAttribute('id_db');
        console.log(number);
        this.reaction = 'heart';
        if (this.heart === false){
        this.publishReaction(number);}
        else {
            this.cancelReaction(number);
        }
          
      },
    smileFunction(number){

          this.smile = !this.smile;
          if(event.target.style.color === 'rgb(255, 174, 0)'){
              event.target.style.color = 'rgba(0, 0, 0,0.6)'
          }
          else{
              event.target.style.color = 'rgb(255, 174, 0)'
                };

        console.log(number);
        this.reaction = 'smile';
        this.publishReaction(number);

            },
    laughFunction(number){
          this.laugh = !this.laugh;
          if(event.target.style.color === 'rgb(255, 174, 0)'){
              event.target.style.color = 'rgba(0, 0, 0,0.6)'
          }
          else{
              event.target.style.color = 'rgb(255, 174, 0)'
                };
        console.log(number);
        this.reaction = 'laugh';
        this.publishReaction(number);

            },
      sortReactions(data){
        /* on va récuperer toutes les réactions et on va les trier 
        dans parentReactions pour qu'elles soient regroupés par commentaire */
        //console.log(data);
        var reactionsObject = data['data'];
        var userReactionsMiror = [];
        var parentReactionsMiror = [];
        var countSameId = [];
        var countSameId2 = []
        //console.log(reactionsObject[0]['id_parent_publication']);
        reactionsObject.forEach((key) => {
            // 0 : {rdv_date : 'string'}
            // 0 is key and rdv is i
                //console.log(i);
                //console.log(this.parentReactions);
                //console.log(key['id_parent_publication']);
// rassembler les réactions de l'utilisateur connecté pour colorer à la connexion 
            if(this.user.id_user == key['id_user']){

                if (!countSameId2.includes(key['id_parent_publication'])){

                countSameId2 += key['id_parent_publication'];
                userReactionsMiror.push({
                id : key['id_parent_publication'], 
                reactions : [
                key['heart'],
                key['smile'],
                key['laugh']
                ], user : key['id_user']
                });
                }
                else{

                userReactionsMiror.forEach((index) =>{
                if( index.id === key['id_parent_publication']){
                    if (key['heart'] === 1){
                        index.reactions[0] = 1;
                    }
                    if (key['smile'] === 1){
                        index.reactions[1] = 1;
                    }
                    if (key['laugh'] === 1){
                        index.reactions[2] = 1;
                    }
                }
                });}}

    // rassembler toutes les reactions et trier en fonction de l'id de la publication 
            if (!countSameId.includes(key['id_parent_publication'])){
                countSameId += key['id_parent_publication'];
                
                parentReactionsMiror.push({
                id :key['id_parent_publication'], 
                reactions : [
                key['heart'],
                key['smile'],
                key['laugh']
                ], user : key['id_user']
                })
            }
            else {
                //console.log(this.parentReactions);
                parentReactionsMiror.forEach((index) =>{
                //console.log(index[i]);
                //console.log(key['id_parent_publication']);

                if (index.id === 
                key['id_parent_publication'])
                { 
                    if (key['heart'] === 1 ){
                        index.reactions[0] += 1;
                    }
                    if (key['smile'] === 1 ){
                        index.reactions[1] += 1;
                    }
                    if (key['laugh'] === 1 ){
                        index.reactions[2] += 1;
                    }
                }
            
            
            })
                }
        });
        this.userReactions = userReactionsMiror;
        this.parentReactions = parentReactionsMiror;
        //console.log(this.parentReactions);
        //console.log(this.userReactions);
      },
      NotClicked(id_db){
          return true
      }


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
.fa-grin-beam {
    color: rgba(12, 9, 9, 0.6);
}
.fa-grin-squint-tears{
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