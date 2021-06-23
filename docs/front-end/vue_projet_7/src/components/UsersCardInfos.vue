<template>
<div class="centered" >
    
              <div class="userWindowInfos " >
               <i @click="$emit('close')" class="far fa-times-circle"></i>
                <span v-if='!userState.photo'> photo : <img :src="basicUrl" alt=""></span>
                <span v-else> photo : <img :src="userState.photo" alt=""></span>
                <span> prenom : {{userState.name}}</span>
                <span> nom : {{userState.famillyName}}</span>
                <span> mail : {{userState.email}}</span>
                
                <span> citation : "Un grand pouvoir implique de grandes responsabilités"</span>
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
  width: 620px; 
  height: 420px;
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
  width: 120px; 
  height: 120px; 
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