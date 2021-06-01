<template>
  <div class="auth_page">
    <div class="presentation">
    <img alt="Vue logo" src="../assets/groupomania.png" />
    <h1 id="logo__title">Groupomania Social Network</h1>   </div>

    <Login />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";

export default {
  name: "Auth",
  components: {
    Login,
  },
};
</script>
<style>

@media screen and (max-width : 768px) {
.auth_page{
  display: flex;
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
  font-size: 19px;
}


}
</style>
