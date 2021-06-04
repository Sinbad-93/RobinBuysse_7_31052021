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
        publishAnswer(){
          console.log('publish');
        if (this.newTitle != '' && this.newAnswer != ''){
        this.answersData.splice(0, 0, 
        {utilisateur : 'New',message : this.newAnswer});
        this.postAnswer = !this.postAnswer;
        }
        else { alert('veuillez ajouter un titre et une image')}
      },
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
    overflow-x: hidden;
    width: 100%;
    justify-items: center;
    align-items: center;
    /*border: 1px black solid;*/
    height: 220px;
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