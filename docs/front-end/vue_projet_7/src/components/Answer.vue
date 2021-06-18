<template>
<div class="container" >
      
      <div class="answers" ref="answers">
          <button class="littleHeight btn-grad "
              @click="postAnswer = !postAnswer">répondre</button>
<button @click="findAllAnswers">FETCH</button>
              <div v-if="postAnswer" class="answer" ref="newPublication">
          <span>Utilisateur name :</span>
          <textarea v-model="answer" name="" id="" cols="30" rows="10"></textarea>
          <div>
            <button :id_comment_db="id_comment_db" @click="publishAnswer(id_comment_db)"> publier </button>
            <button @click="postAnswer = !postAnswer"> annuler </button>
            </div>
            </div>
            <div v-else-if="(loading) && !(postComment)" class="answer loading" 
            >LOADING</div>
          <div class="answer" v-for="(data,index) in answersData"
          :key="data"
          :index="index" >
          <div :index="index" :id_comment_db="id_comment_db" v-if="checkParentId(id_comment_db, data.parent_id)">
              <span ref="userAnswer " 
              class="userAnswer metal radial">{{data.name}} {{data.familly_name}}
              </span>
              <span class="answerMessage" >{{data.answer}}</span>
              <div class="icons">
              <i @click="arrowFunction" ref="topArrow" class="fas fa-arrow-alt-circle-up"></i> 8
              <i @click="arrowFunction" class="fas fa-arrow-alt-circle-down"></i> 1
              <i class="fas fa-exclamation-triangle"></i>
              <i v-if="adminConnected" class="fas fa-trash-alt"></i>
              </div> 
              </div>              
          </div>
        </div>
</div>
</template>

<script>


export default {
  name: "Answer",
  components: {
  },
  props: ['viewComment','adminConnected','user','objectSize','id_comment_db'],
  data() {
      return {
          isSpread : false,
          seeAnswer : false,
          postAnswer : false,
          loading : false,
          newTitle : 'new',
          newAnswer : '',
          comment : 'none',
          answer : '',
          parent_id :null,
         answersData : [
          {utilisateur : 'Elvis',answer : 'Waow extra'},
          {utilisateur : 'Fox',answer : 'Alors ça, je dis oui !'}]
      }
  },
   mounted() {
      this.findAllAnswers()
  },
  methods : {
      // FUNCTIONS ---------------------------------
      checkParentId(number, parent_id){
          if(!number){
              return false
          };
          if(number == parent_id){
              return true
          }
          else {
            return false
          }
      },
    // POST ANSWERS ----------------------------------------------
        
    async fetchPostAnswer(number) {
       if(!(this.comment === "")
         ){
        
        this.parent_id = number;
        const requestOptions = {
        method : 'POST',
        headers : { "Content-Type": "application/json", 
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
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

        // publish answers ----------------
    publishAnswer(number){
      this.fetchPostAnswer(number).then((data) => {
        console.log(data);
        //fermer la fenetre de publication
        this.postComment = false;
        this.loading = true;
        // rafraichir les données
        this.findAllAnswers()
      }).catch(e => console.log(e));},

    // GET ANSWERS ----------------------------------------------

    async fetchGetAnswers() {

        let response = await fetch('http://localhost:3000/publish/find_answers',
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
    
    // display answers ------------------
    findAllAnswers(){
      this.fetchGetAnswers().then((data) => {
        console.log(data);
        this.answersData = [];
        var size = this.objectSize(data['data']);
        size = size.reverse();
        //console.log(size);
        size.forEach(size => {
            this.answersData.push(data['data'][size])
        });
        //this.publicationsData.slice().reverse();    
        this.loading = false;
      }).catch(e => console.log(e));},

      arrowFunction(){
           if((event.target.style.color === 'black') && 
           (event.target.classList.value == this.$refs.topArrow.classList.value)){
              event.target.style.color = 'blue';
              event.target.nextSibling.nextSibling.style.color = 'black';
          }
          else if((event.target.style.color === 'black') && (event.target != this.$refs.topArrow)){
              event.target.style.color = 'blue';
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
.answers{
    display: flex;
    flex-direction: column;
    overflow-wrap: break-word;
    overflow-x: visible;
    width: 100%;
    justify-items: center;
    align-items: center;
    /*border: 1px black solid;*/
    height: auto;
    margin-bottom : 20px;
    background-color: transparent;
}
.answer{
    background-color: rgb(252, 252, 252);
    display: grid;
    position: relative;
    width: 100%;
    margin-bottom : 10px;

}
span{
    max-width: 260px;
    margin-bottom: 10px;
    margin: auto;
    text-align:left;
}
.userAnswer{
    grid-row-start: 1;
    max-height: 25px;
    background-color: yellow;
    overflow :scroll;
    padding-left: 10px;
    padding-right: 10px;
}
.answerMessage {
    grid-row-start: 2;
    margin-top: 10px;

}
.icons{
    grid-row-start: 3;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
}
.loading{
    background-color: rgb(255, 255, 255);
}
}
</style>