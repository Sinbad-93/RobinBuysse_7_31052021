<template>
  <div class="home">
      <ul>
          <li> <router-link to="Profile">Mon profil</router-link> </li>
          <li> <router-link to="/">Deconnexion</router-link></li>
      </ul>
      <Publications :adminConnected="adminConnected">
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
      }
  },
  methods : {
      
  }
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
