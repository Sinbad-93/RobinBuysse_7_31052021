<template>
<div class="container" >
      
      <div class="answers">
          <button class="littleHeight btn-grad "
              @click="postAnswer = !postAnswer">répondre</button>

              <div v-if="postAnswer" class="answer" ref="newPublication">
          <span>Utilisateur name :</span>
          <textarea v-model="newAnswer" name="" id="" cols="30" rows="10"></textarea>
          <div>
            <button @click="publishAnswer"> publier </button>
            <button @click="postAnswer = !postAnswer"> annuler </button>
            </div>
            </div>

          <div class="answer" v-for="(data,index) in answersData"
          :key="data"
          :index="index" >
              <span ref="userAnswer " 
              class="userAnswer metal radial">{{data.utilisateur}} 
              </span>
              <span class="answerMessage" >{{data.message}}</span>
              <div class="icons">
              <i @click="arrowFunction" ref="topArrow" class="fas fa-arrow-alt-circle-up"></i> 8
              <i @click="arrowFunction" class="fas fa-arrow-alt-circle-down"></i> 1
              <i class="fas fa-exclamation-triangle"></i>
              <i v-if="adminConnected" class="fas fa-trash-alt"></i>
              
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
  props: ['viewComment','adminConnected'],
  data() {
      return {
          isSpread : false,
          seeAnswer : false,
          postAnswer : false,
          newTitle : 'new',
          newAnswer : '',
         answersData : [
          {utilisateur : 'Charouxlamagnifiqueetsublimetuesparfaite',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra, c\'est vriament bien trouvé, je vais essayé de publier quelque chose de sympa également'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui !'},{utilisateur : 'Charoux',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui blablablablablablablalblablablbalbalblablbalbalbalblablbalbalbalblba !'},
          {utilisateur : 'Charoux',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui !'}]
      }
  },
  methods : {
        // POST ANSWERS ----------------------------------------------
    async fetchPostAnswer() {
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
              
        // publish answers ----------------
    publishtAnswer(){
      this.fetchPostAnswer().then((data) => {
        console.log(data);
        //fermer la fenetre de publication
        this.postComment = false;
        this.loading = true;
        // rafraichir les données
        this.findAllComments()
      }).catch(e => console.log(e));},

    // GET ANSWERS ----------------------------------------------

    async fetchGetAnswers() {

        let response = await fetch('http://localhost:3000/publish/find_comments');
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

}
</style>