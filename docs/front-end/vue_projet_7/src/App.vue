<template>
<router-view>
  </router-view>
</template>

<script>

export default {
  name: 'App',
  components: {},
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');
#app {
  max-width: 100%;
  height: 768px; 
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
background: rgb(233,44,19);
background: linear-gradient(90deg, rgba(233,44,19,0.9752275910364145) 2%, rgba(254,163,2,1) 52%, rgba(255,239,0,1) 93%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding:0 16px;
  padding-top: 30px;

}
.grey_btn {
  cursor: pointer;
  background: rgb(175,165,165);
background: linear-gradient(90deg, rgba(175,165,165,1) 23%, rgba(215,209,209,1) 57%);
}


* {
  font-family: 'Poppins', sans-serif;
  margin:0;
  padding: 0;
  box-sizing: border-box;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@media screen and (max-width : 1366px) {
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');
#app {
  max-width: 100%;
  height: 768px; //
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {

  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding:0 16px;
  padding-top: 30px;

}

* {
  font-family: 'Poppins', sans-serif;
  margin:0;
  padding: 0;
  box-sizing: border-box;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
}


@media screen and (max-width : 767px) {
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');
#app {
  height: 620px;
}

}
</style>
