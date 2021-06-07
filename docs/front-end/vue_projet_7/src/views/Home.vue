<template>
  <div class="home">
      <ul>
          <li> <router-link to="Profile">Mon profil</router-link> </li>
          <li> <router-link to="/">Deconnexion</router-link></li>
      </ul>
      bienvenue {{userName}}
      <Publications :adminConnected="adminConnected" :userName="userName">
      </Publications>
      </div>
</template>

<script>
import Publications from "@/components/Publications.vue";


export default {
  name: "Home",
  components: {
      Publications,

  },
  data() {
      return {
          adminConnected : false,
          userConnectedInfos : false,
          userName: 'example',
      }
  },
  methods :{
/*vérifier si un élément existe dans notre local storage, return true || false*/
    isKeyExist(obj, key) {
  return obj.hasOwnProperty(key);
},
/*vérifier si le panier existe, sinon l'initialiser*/
    checkConnexion() {
  if (this.isKeyExist(localStorage, "connectedUser")){
      this.userConnectedInfos = JSON.parse(localStorage.getItem("connectedUser"));
      return true
  }
}
  },
    beforeCreate(){
    console.log('BEFORE CREATED');
    },
    created(){
    console.log('CREATED');
    },
    beforeMount(){
    console.log('BEFORE MOUNTED');
    },
    mounted() {
    console.log('MOUNTED');
    console.log(localStorage);
    if (this.checkConnexion() === true){
        console.log(this.userConnectedInfos['name']);
        this.userName = this.userConnectedInfos['name'];
    }
},

}
</script>
<style>
@media screen and (max-width : 768px) {
.home{
  display: flex;
  flex-direction: column;
  align-items: center;
}
ul{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
}
li{
    list-style: none;
    font-size: 15px;
}
a {
    text-decoration: none;
}
}
</style>
