<template>
  <div class="profile">
    <div><router-link to="Home">Home</router-link> <br>
   </div>
    <h1 class="card__title">Mon profil</h1>
    <ul class="card__subtitle">Mes informations :</ul>
    <li>Prénom: {{user.name}}</li> <li>Nom : {{user.familly_name}} </li><li>E-mail : {{user.email}}</li>
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
    <div v-if="suppression"><span>êtes vous sur ? cette action est défnitive</span>
    <button>confirmer</button> <button  @click="suppression=false">retour</button></div>
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
  /*mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getUserInfos');
  },*/
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
         formData.append("id",this.user.id_user);
         const requestOptions = {
         method: 'PUT',
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
  }
}
</script>

<style scoped>
@media screen and (max-width : 768px) {
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
    width: 150px;
    height: 30px;
}
span {
  margin: 10px auto;
  border: black 1px solid;
  background-color: white;
  font-size: 18px;
  font-weight: bolder;
}
}
</style>