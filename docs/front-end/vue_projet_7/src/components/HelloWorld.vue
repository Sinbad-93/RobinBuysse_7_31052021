<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
Connectez vous au réseau Détente&Fun de Groupomania pour partager
des ondes positives avec vos collègues ! 
    </p>
   <form class='loginForm' action="javascript:void(0)" 
   @submit="getUsersLogin(loginEmail,loginPassword)">
      <!-- LoginEmail -->
      <div class="loginFormDiv"><label for="loginEmail">Entrez votre email: </label>
      <input placeholder="mail@gmail.com" type="email" v-model="loginEmail" 
      name="email" id="loginEmail" required 
      pattern="^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$" ></div> 
      <!-- LoginPassword -->
      <div class="loginFormDiv"><label for="loginPassword">Entrez votre mot de passe : </label>
      <input class='input' :type="visibility" v-model="loginPassword" 
      id="loginPassword" min='8' required 
    pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$">
    <!-- shows the password -->
      <a @click="showPassword()" 
      class="showHidePassword" v-if="visibility == 'password'"> Afficher</a>
    <!-- hides the password -->
      <a @click="hidePassword()" 
      class="showHidePassword" v-if="visibility == 'text'">Masquer</a></div>
   <div class="loginFormDiv"> 
     <input id="validation" type="submit" value="Connexion">
    <button type="button" @click="closeForm()">Annuler</button></div>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@media screen and (max-width : 768px) {
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div {
  border: green 1px dashed;
  margin: 10px;
}
.loginForm{
  border: 1px black solid;
  display: grid;
}
.loginFormDiv{

}
}
</style>
