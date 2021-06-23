<template>
  <div class="auth_page">
    <!--router-link to="Home">Home</router-link!-->
    <!--router-link to="Profile">Mon profil</router-link!-->
    <div class="presentation">
    <img alt="Vue logo" src="../assets/groupomania.png" />
    <h1 id="logo__title">Groupomania Social Network</h1>   </div>

    <Login @connect="routerMethod" ></Login>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import { mapState } from 'vuex'

export default {
  name: "Auth",
  components: {
    Login,
  },
  data(){ return {
    test : false
  }},
  methods : {
    routerMethod(){
        this.$router.push('/profile');
    }
  },
  mounted () {
    console.log(this.$store.state.user);
    localStorage.clear();
    sessionStorage.clear();
    console.log('STORAGE CLEARED');
    },
  computed: {
    ...mapState({
      user: 'userConnectedInfos',
      falseuser :'falseuser',
      newuser : 'newuser'
    })
}}
</script>
<style scoped>
.auth_page{
  display: flex;
  margin-top: 0px; 
  flex-direction: column;
  align-items: center;
}
.presentation{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:0 0 20px 0;
  font-weight: 600;
}
img {
  max-width: 20%;
  border-radius: 8px;
}
#logo__title {
  font-size: 27px; 
}

@media screen and (max-width : 1366px) {
.auth_page{
  display: flex;
  margin-top: 0px;/**/ 
  flex-direction: column;
  align-items: center;
}
.presentation{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin:0 0 20px 0;
  font-weight: 600;
}
img {
  max-width: 20%;
  border-radius: 8px;
}
#logo__title {
  font-size: 27px;/**/ 
}}
@media screen and (max-width : 767px) {
.auth_page{
  margin-top: 70px;
}

#logo__title {
  font-size: 19px;
}


}
</style>
