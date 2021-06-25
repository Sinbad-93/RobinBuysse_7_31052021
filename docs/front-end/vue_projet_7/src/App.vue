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
.nav {
  opacity: 0.3;
color: white;
text-decoration: none;
background-color: black;
border: solid 1px white;
padding: 0 10px;
border-radius: 20px;

}
.nav:hover {
opacity: 1; 

}
.nav:active{
opacity: 1;
transform: scale(0.9);
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
/* style metal and blue link utilisateur */
.metal {
  cursor: pointer;
  position: relative;
  outline: none;
  font: bold "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
  text-align: center;
  color: hsla(0,0%,20%,1);
  text-shadow: hsla(0,0%,40%,.5) 0 -1px 0, hsla(0,0%,100%,.6) 0 2px 1px;
  background-color: hsl(0,0%,90%);
  transition: color .2s;}
.radial.metal {
  border-radius: 80px;
  background-image:
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,  0%,0) 0%, hsla(0,0%,  0%,0)   3%, hsla(0,0%,  0%,.1) 3.5%),
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0)   6%, hsla(0,0%,100%,.1) 7.5%),
    -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.2) 2.2%),
    -webkit-radial-gradient( 50% 50%, 200% 50%, hsla(0,0%,90%,1) 5%, hsla(0,0%,85%,1) 30%, hsla(0,0%,60%,1) 100%);
}

.metal:active, .metal:hover {
  color: hsl(210, 100%, 40%);
  background-color: white;
  text-shadow: hsla(210,100%,20%,.3) 0 -1px 0, hsl(210,100%,85%) 0 2px 20px, hsla(200,100%,80%,1) 0 0 15px, hsla(210,100%,50%,.6) 0 0 20px;
  box-shadow: inset hsl(210, 100%, 40%) 0  0px 0px 3px, /* border */
                    hsla(0,0%,100%,.5) 0  5px 6px 4px; /* outer HL */;
}
.radial:active  {
    background-image: none;
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
