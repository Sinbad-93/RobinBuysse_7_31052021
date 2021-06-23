<template>
  <div class="profile">
    <div><router-link to="Home">Home</router-link> <br>
   </div>
    <h1 class="card__title">Mon profil</h1>
    <ul class="card__subtitle">Mes informations :</ul>
    <li>Prénom: {{user.name}}</li> <li>Nom : {{user.famillyName}} </li><li>E-mail : {{user.email}}</li>
    <!--p>{{user.prenom}} {{user.nom}} {{user.email}}</p!-->
    <div class="form-row">
      
      <router-link to="/"><button @click="logout()" class="button">
        Déconnexion  
      </button></router-link>
    </div>
    <img v-if="!user.photo" :src="basicUrl" />
    <img v-else ref="img" :src="user.photo" alt="">
    <span @click="changePhoto = !changePhoto">changer ma photo de profil</span>
    <div v-if="changePhoto">
    <input v-if="!user.photo" type="file" accept="image/*" @change="addImg" />
    <input v-else type="button" value="retirer" @click="removeImg" />
    </div>
    
    
    <span @click="suppression=true">supprimer mon compte</span>
    <div v-if="suppression"><span class="text">êtes vous sur ? cette action est défnitive</span>
    <button @click='deleteAccount(user.id_user)'>confirmer</button> <button  @click="suppression=false">retour</button></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Profile',
  data(){
      return {
          suppression : false,
          changePhoto : false,
          newUrl : null,
          basicUrl : require('../assets/userImg.png'),
          image : null,
      }
  },
  mounted: function () {
  },
  computed: {
    ...mapState({
      user: 'userConnectedInfos',
    })
  },
  methods: {
            // UPDATE PROFILE PHOTO ----------------------------------------------
    async fetchPostNewPhotoUrl(){
      console.log('données :', this.image, this.user.id_user);
         const formData = new FormData();
         formData.append("image", this.image);
         formData.append("user_id",this.user.id_user);
         const requestOptions = {
         method: 'PUT',
          headers : {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
         body: formData
             };

         let response = await fetch('http://localhost:3000/auth/profil_photo', requestOptions);
           if (!response.ok) {
             // get error message from body or default to response status
             const error = (data && data.message) || response.status;
             //console.log('not response ok, error : ' + error);
             alert('une erreur innattendue s\'est produite');
             return Promise.reject(error); 
             }
             return await response.json();},

      // update USER PHOTO URL ------------------
    newPhoto(){
        this.fetchPostNewPhotoUrl().then((data) => {
          console.log(data);
      }).catch(e => console.log(e));},

    // FETCH DELETE USER
        
    async fetchDeleteAccount(number) {

        const requestOptions = {
        method : 'DELETE',
        headers : { "Content-Type": "application/json",
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
        body: JSON.stringify({ 
            id : number,
            user_id : number,
          })};

        let response = await fetch('http://localhost:3000/auth/deleteAccount', requestOptions);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},

    // DELETE USER
      deleteAccount(id){
        this.fetchDeleteAccount(id).then((data) => {
          console.log(data);
          if(data["data"] === true){
            this.logout();
          }
      }).catch(e => console.log(e));},

    addImg(e) {
      const file = e.target.files[0];
      this.image = file;
      this.changePhoto = false;
      this.newUrl = URL.createObjectURL(file);
      this.newPhoto();
      this.$store.state.userConnectedInfos.photo = this.newUrl ;
      localStorage.setItem("connectedUser", JSON.stringify(this.$store.state.userConnectedInfos));
                },
    removeImg(){
      this.newUrl = null;
      this.image = null;
      this.newPhoto();
      this.$store.state.userConnectedInfos.photo = null ;
      localStorage.setItem("connectedUser", JSON.stringify(this.$store.state.userConnectedInfos));
      
        },
        logout(){
          localStorage.clear();
          sessionStorage.clear();
          this.$router.push('/'); 
        },
        // FETCH USER ON REFRESHING PAGE----------------------------------------------
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
}
</script>

<style scoped>
@media screen and (max-width : 1024px) {
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 600px;
}
img {
    margin: 20px;
  max-width: 80%;
  max-height: 50%;/**/
  border-radius: 8px;
}
ul, li {
  font-size: 25px; /**/
}
button{
  margin-top: 10px;
  font-size: 22px; /**/ 
    background-color: white;
    width: 200px; /**/ 
    height: 50px;/**/
}
span {
  margin: 10px auto;
  border: black 1px solid;
  background-color: white;
  font-size: 25px;/**/ 
  padding: 8px;/**/
  font-weight: bolder;
}
.text {
  margin: 0px auto;
  border: none;
  background-color: transparent;
  font-size: 14px;
  font-weight: initial;
}
a{
  font-size: 30px;
}
}
@media screen and (max-width : 767px) {
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 600px;
}
img {
    margin: 20px;
  max-width: 80%;
  border-radius: 8px;
}
button{
  margin-top: 10px;
    background-color: white;
    font-size: 18px; /**/
    width: 150px;
    height: 30px;
}
ul, li {
  font-size: 18px; /**/
}
span {
  margin: 10px auto;
  border: black 1px solid;
  background-color: white;
  font-size: 15px;
  font-weight: bolder;
}
.text {
  margin: 0px auto;
  border: none;
  background-color: transparent;
  font-size: 14px;
  font-weight: initial;
}
}
</style>