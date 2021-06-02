<template>
  <div class="home">
      <ul>
          <li> <router-link to="Profile">Mon profil</router-link> </li>
          <li> <router-link to="/">Deconnexion</router-link></li>
      </ul>
      <Publications></Publications>
      </div>
    
</template>

<script>
import Publications from "@/components/Publications.vue";

export default {
  name: "Home",
  components: {
      Publications
  },
  data() {
      return {

      }
  },
  methods : {
      newPost(){
          
      }
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
}
}
</style>
