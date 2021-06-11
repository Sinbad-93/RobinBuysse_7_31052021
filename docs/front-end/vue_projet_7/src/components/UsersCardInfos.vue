<template>
<div class="centered" >
    
              <div class="userWindowInfos " >
                  <i @click="$emit('close')" class="far fa-times-circle"></i>
                <span> prenom : {{userPickedInfos.name}}</span>
                <span> nom : {{userPickedInfos.familly_name}}</span>
                <span> mail : {{userPickedInfos.email}}</span>
                <span> photo :</span>
                <span> description :</span>
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
        userPickedInfos :{
      id_user : '0',
      name : '0',
      famillyName : '0',
      email : '0',
      password: '0',
      userReactions : {},
      numberOfReactions : {},
    }
      }
  },
   mounted() {
  },
  methods : {
      
},
computed: {
    ...mapState({
       userPickedInfos: ' userPickedInfos',
    })
  }}
</script>

<style scoped>
@media screen and (max-width : 768px) {
.userWindowInfos{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 5px;
  position: absolute;
  top: 0;
  width: 320px;
  height: 280px;
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
}
</style>