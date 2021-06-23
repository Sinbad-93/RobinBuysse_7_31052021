<template>
  <div class="home">
      <ul>
          <li> <router-link to="Profile">Mon profil</router-link> </li>
          <li> <router-link to="/" >Deconnexion</router-link></li>
      </ul>
     <span>bienvenue {{userName}}</span> 
      <Publications :adminConnected="adminConnected" :userName="userName">
      </Publications>
      </div>
</template>

<script>
import Publications from "@/components/Publications.vue";
import { mapState } from 'vuex'
import CryptoJS from 'crypto-js'

const key = '82f2ceed4c503896c8a291e560bd4325' // change to your key
const iv = 'sinasinasisinaaa' // change to your iv


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
    aesDencrypt(txt) {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  })

  return CryptoJS.enc.Utf8.stringify(cipher).toString()
},


/*vérifier si le panier existe, sinon l'initialiser*/
    checkConnexion() {
  if (this.isKeyExist(localStorage, "connectedUser")){
      this.userConnectedInfos = JSON.parse(localStorage.getItem("connectedUser"));
      let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
      let lockAccessCrypted = JSON.parse(window.localStorage.lockAccessCrypted);
      const lockAccessDecrypted = this.aesDencrypt(lockAccessCrypted);
      if (this.userConnectedInfos.admin === 1){
        let adminAccess = JSON.parse(window.localStorage.adminAccess);
      if ( (lockAccess) && (lockAccess === lockAccessDecrypted) 
        // commenter ici pour tester la sécurité
        && lockAccess.includes(adminAccess) ){
        this.adminConnected = true ;
      }
      }
       
      return true
  }
},

// FETCH USER ON REFRESHING PAGE ----------------------------------------------
async fetchVerifyToken() {
  const connectedUser = JSON.parse(window.localStorage.connectedUser);
  let response = await fetch('http://localhost:3000/auth/verifyToken/'+ connectedUser.id_user,
  {
    method: 'GET',
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

  },

    beforeCreate(){
    console.log('BEFORE CREATED');
    },

  //FETCH USER ON REFRESHING PAGE
    created(){
    console.log('CREATED');
    // refresh page, vide le store, on utilise le local storage
    if ((this.$store.state.userConnectedInfos.token === null) && (JSON.parse(window.localStorage.connectedUser))){
        this.fetchVerifyToken().then((data) => {
        console.log(data);
        const verifiedUser = data['data'][0];
        const connectedUser = JSON.parse(window.localStorage.connectedUser);
        
      console.log('VERIFY TOKEN');
      this.$store.dispatch("login", {
        email: verifiedUser.email,
        name: verifiedUser.name,
        familly_name: verifiedUser.familly_name,
        id_user: connectedUser.id_user,
        photo : verifiedUser.photo,
        admin : verifiedUser.admin,
        token: connectedUser.token
      
      });}).catch(e => console.log(e));

    }
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
        this.$store.dispatch("findAllReactions", this.userConnectedInfos.id_user);
    }
},

}
</script>
<style>
.home{
  width: 720px; 
  display: flex;
  flex-direction: column;
  align-items: center;
}
span{
  font-size: 20px; 
}
ul{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
}
li{
    list-style: none;
    font-size: 22px; 
}
a {
    text-decoration: none;
}

@media screen and (max-width : 1366px) {
.home{
  width: 720px;/**/ 
  display: flex;
  flex-direction: column;
  align-items: center;
}
span{
  font-size: 20px; /**/
}
ul{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
}
li{
    list-style: none;
    font-size: 22px;/**/ 
}
a {
    text-decoration: none;
}}
@media screen and (max-width : 767px) {
.home{
  width: initial;/**/ 
}
span{
  font-size: 18px; /**/
}
li{
    font-size: 15px;
}

}
</style>
