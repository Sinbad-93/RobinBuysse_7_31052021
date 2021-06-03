<template>
<div >
      
      <div class="comments">
          <h3 >Commentaires</h3>
          <div class="comment" v-for="(data,index) in commentsData"
          :key="data"
          :index="index" >
              <span ref="userComment" @click="spread(event)" class="userComment">{{data.utilisateur}}</span>
              <span >{{data.message}}</span>
          </div>
        </div>
</div>
</template>

<script>


export default {
  name: "Comments",
  components: {
  },
  props: ['viewComment'],
  data() {
      return {
          isSpread : false,
         commentsData : [
          {utilisateur : 'Charouxlamagnifique et sublime',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra, c\'est vriament bien trouvé, je vais essayé de publier quelque chose de sympa également'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui !'},{utilisateur : 'Charoux',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui blablablablablablablalblablablbalbalblablbalbalbalblablbalbalbalblba !'},{utilisateur : 'Charoux',message : 'génial ta publication'},
          {utilisateur : 'Elvis',message : 'Waow extra'},
          {utilisateur : 'Fox',message : 'Alors ça, je dis oui !'}]
      }
  },
  methods : {
      spread(){
          if (this.isSpread === false){
          event.target.style.textOverflow = 'unset';
          event.target.style.overflow = 'visible';
          event.target.style.position =" absolute";
          event.target.style.maxWidth = 'none';
          event.target.style.height = '80px';
          event.target.style.zIndex= '5';
          event.target.nextSibling.style.gridColumnStart = '2';}
          else {
          event.target.style.textOverflow = 'ellipsis';
          event.target.style.overflow = 'hidden';
          event.target.style.position =" initial";
          event.target.style.maxWidth = '60px';
          event.target.style.height = '25px';
          event.target.style.zIndex= '0';
          }
          this.isSpread = !this.isSpread;   
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
    border: 1px black solid;
    height: 220px;
    margin-bottom : 20px;
}
span{
    max-width: 200px;
    margin-bottom: 10px;
    text-align:left;
}
.userComment{
    margin-left: 4px;
    margin-top: 3px;
    margin-right: auto;
    max-width: 60px;
    max-height: 25px;
    background-color: yellow;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 1;
    animation: appear 3s;
}
.comment{
    display: grid;
    position: relative;
    width: 100%;
    border: 1px black solid;
    grid-template-columns: 1fr 3fr;
}

}
</style>