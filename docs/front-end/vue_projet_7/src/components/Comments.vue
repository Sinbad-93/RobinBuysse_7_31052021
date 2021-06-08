<template>
<div>
      
      <div ref="comments" class="comments" >
          <button class="littleHeight btn-grad" :disabled="postComment" @click="postComment = !postComment">poster un commentaire</button>
<button @click="testo">FETCH</button>
        <div v-if="postComment" class="comment" ref="newPublication">
          <span>Utilisateur name :</span>
          <textarea v-model="comment" name="" id="" cols="30" rows="10"></textarea>
          <div>
            <button  @click="publishComment"> publier </button>
            <button @click="postComment = !postComment"> annuler </button>
            </div>
            </div>
            <div v-else-if="(loading) && !(postComment)" class="comment loading" 
            >LOADING</div>

          <div  :id_db="data.id_comment_and_answer" v-bind:class="checkParentId(data.parent_id) ? 'comment ' : 'notVisible'" ref="comment" v-for="(data,index) in commentsData"
          :key="data"
          :index="index" >
          <div :index="index" v-if="checkParentId(data.parent_id)">
              <span ref="userComment" 
              class="userComment metal radial">{{data.name}} {{data.familly_name}} 
              </span>
              <span class="commentMessage" >{{data.comment}}</span>
              <span class="commentHour">{{data.date_posted}}</span>
              <div class="icons">
              <i @click="arrowFunction" ref="topArrow" class="fas fa-arrow-alt-circle-up"></i>8
              <i @click="arrowFunction" class="fas fa-arrow-alt-circle-down"></i>1
              <i class="fas fa-exclamation-triangle"></i>
              <i v-if="adminConnected" class="fas fa-trash-alt"></i></div>
                            
              <button class="answerButton" @click="seeAnswer = !seeAnswer">Réponses 7</button>
               </div>   <Answer :adminConnected="adminConnected" v-if="seeAnswer"></Answer>
          </div>
        </div>
</div>
</template>

<script>
import Answer from '../components/Answer.vue';

export default {
  name: "Comments",
  components: {
      Answer
  },
  props: ['viewComment','adminConnected','user', 'objectSize'],
  data() {
      return {
          isSpread : false,
          seeAnswer : false,
          postComment : false,
          newTitle : 'new',
          loading : false,
          comment : '',
          answer : 'none',
          parent_id : null,
         commentsData : [
          {utilisateur : 'Charoux',comment : 'génial ta publication'},]
      }
  },
  mounted() {
      this.findAllComments()
  },
  methods : {
          // POST COMMENTS ----------------------------------------------
    async fetchPostComment() {
       if(!(this.comment === "")
         ){
        var el = this.$refs.comments.parentNode.parentNode.firstChild;
        console.log(el.getAttribute('id_db'));
        this.parent_id = el.getAttribute('id_db');

        const requestOptions = {
        method : 'POST',
        headers : { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            parent_id : this.parent_id,
            user_id : this.user.id_user,
            comment : this.comment,
            answer : this.answer,
          })};

        let response = await fetch('http://localhost:3000/publish/commentAndAnswer', requestOptions);
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
    // publish comments----------------
    publishComment(){
      this.fetchPostComment().then((data) => {
        console.log(data);
        //fermer la fenetre de publication
        this.postComment = false;
        this.loading = true;
        // rafraichir les données
        this.findAllComments()
      }).catch(e => console.log(e));},

    // GET COMMENTS ----------------------------------------------

    async fetchGetComments() {

        let response = await fetch('http://localhost:3000/publish/find_comments');
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},
    
    // display comments----------------
    findAllComments(){
      this.fetchGetComments().then((data) => {
        console.log(data);
        this.commentsData = [];
        var size = this.objectSize(data['data']);
        size = size.reverse();
        //console.log(size);
        size.forEach(size => {
            this.commentsData.push(data['data'][size])
        });
        //this.publicationsData.slice().reverse();    
        this.loading = false;
      }).catch(e => console.log(e));},

        // FUNCTIONS ---------------------------------
      checkParentId(number){
          if(!number){
              return false
          };
        var ele = this.$refs.comments.parentNode.parentNode.firstChild;
        //console.log(el.getAttribute('id_db'));
        var parent_id = ele.getAttribute('id_db');
          if(number == parent_id){
              return true
          }
          else {
            return false
          }
      },
      
      arrowFunction(){
           if((event.target.style.color === 'black') && 
           (event.target.classList.value == this.$refs.topArrow.classList.value)){
              event.target.style.color = 'white';
              event.target.nextSibling.nextSibling.style.color = 'black';
          }
          else if((event.target.style.color === 'black') && (event.target != this.$refs.topArrow)){
              event.target.style.color = 'white';
              event.target.previousSibling.previousSibling.style.color = 'black';
          }
          else{
              event.target.style.color = 'black'
          }
      }
    

}}
</script>

<style scoped>
@media screen and (max-width : 768px) {
.comments{
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    justify-items: center;
    align-items: center;
   /* border: 1px black solid;*/
    height: auto;
    /*height: 420px;*/
    margin-bottom : 20px;
    
}
.comment{
    display: grid;
    background-color: transparent;
    position: relative;
    width: 100%;
    border: 1px black solid;
    margin-bottom : 10px;

}
span{
    max-width: 260px;
    margin-bottom: 10px;
    margin: auto;
    text-align:left;
}
.userComment{
    grid-row-start: 1;
    font-size: 14px;
    max-height: 25px;
    overflow :scroll;
    margin-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
}
.commentMessage {
    grid-row-start: 2;
    margin-top: 10px;
}
.commentHour {
    font-size: 12px;
}
.answerButton{
    border: none;
    color: white;
    background-color: transparent;
}
.icons{
    grid-row-start: 3;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
}
button{
    margin-bottom: 30px;
}
.notVisible{
    display: none;
}
}
</style>