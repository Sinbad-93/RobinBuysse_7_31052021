<template>
  <div class="profile">
    <div><router-link to="Home">Home</router-link> <br>
   </div>
    <h1 class="card__title">Mon profil</h1>
    <ul class="card__subtitle">Mes informations :</ul>
    <li>Prénom: {{user.name}}</li> <li>Nom : {{user.familly_name}} </li><li>E-mail : {{user.email}}</li>
    <!--p>{{user.prenom}} {{user.nom}} {{user.email}}</p!-->
    <img v-if="!newUrl" :src="user.photo||basicUrl" />
    <img v-else :src="newUrl" alt="">
    <span @click="changePhoto = !changePhoto">changer ma photo de profil</span>
    
    <div v-if="changePhoto">
    <input v-if="!newUrl" type="file" accept="image/*" @change="addImg" />
    <input v-else type="button" value="retirer" @click="removeImg" />
    </div>
    
    <div class="form-row">
      
      <router-link to="/"><button @click="logout()" class="button">
        Déconnexion  
      </button></router-link>
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
     addImg(e) {
      const file = e.target.files[0];
      this.image = file;
      this.changePhoto = false;
      this.newUrl = URL.createObjectURL(file);
      this.$store.dispatch('newPhoto',{
        image: this.image,
        id: this.user.id_user,
      });
                },
    removeImg(){
      this.newUrl = null;
      this.image = null;
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
    margin: 50px;
  max-width: 80%;
  border-radius: 8px;
}
button{
  margin-top: 10px;
    background-color: white;
    width: 150px;
    height: 30px;
}
}
</style>