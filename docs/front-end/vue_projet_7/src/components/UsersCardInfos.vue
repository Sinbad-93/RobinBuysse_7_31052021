<template>
<div class="centered" >
    
              <div class="userWindowInfos " >
               <i @click="$emit('close')" class="far fa-times-circle"></i>
               <h3>Carte du profil</h3>
                 <img v-if='!userState.photo' :src="basicUrl" alt="">
                 <img v-else :src="userState.photo" alt="">
                <span> Prenom : {{userState.name}}</span>
                <span> Nom : {{userState.famillyName}}</span>
                <span> Email : {{userState.email}}</span>
                
                <span> Citation : "Un grand pouvoir implique de grandes responsabilités"</span>
              </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "UsersCardInfos",
  components: {
  },
  props: [],
  data() {
      return {
        basicUrl : require('../assets/userImg.png'),
      }
  },
   mounted() {
  },
  methods : {
    
      
},
computed: {
    ...mapState({
       userPickedInfos: ' userPickedInfos',
    }),
    userState() {
     console.log(this.$store.getters.getUserPickedInfos);
     return this.$store.getters.getUserPickedInfos;}
  },
  
  }
</script>

<style scoped>
.userWindowInfos{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 5px;
  position: absolute;
  top: 0;
  border: 5px solid grey;/**/ 
  background: rgb(233,44,19);/**/ 
  background: linear-gradient(90deg, rgba(233,44,19,0.9752275910364145) 2%, rgba(254,163,2,1) 52%, rgba(255,239,0,1) 93%);/**/ 
  width: 620px; 
  height: 420px;
  z-index: 5;

}
span{
  font-size : 20px;/**/ 
}
.centered{
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);

}
.fa-times-circle{
   /*margin-left: auto;*/
   align-self: flex-end;
   margin-right: 5px;
   margin-top: -15px;/**/ 
   font-size: 25px;
}
h3 {
  position: absolute;/**/ 
  left: 10px;/**/ 
  top: 20px; /**/
}
img {
  position: absolute;/**/
  border-radius: 20px; 
  right: 80px;/**/
  top: 40px;/**/ 
  width: 220px; /**/ 
  height: 220px; /**/ 
}

@media screen and (max-width : 1366px) {
.userWindowInfos{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 5px;
  position: absolute;
  top: 0;
  width: 620px;/**/ 
  height: 420px;/**/
  z-index: 5;
  background-color: white;
}
.centered{
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);

}
.fa-times-circle{
   /*margin-left: auto;*/
   align-self: flex-end;
   margin-right: 5px;
   font-size: 25px;
}
img {
  width: 120px;/**/ 
  height: 120px;/**/ 
}
}
@media screen and (max-width : 767px) {
.userWindowInfos{
  width: 320px;
  height: 280px;

}
img {
  width: 50px;
  height: 50px;
}


}
</style>