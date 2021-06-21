import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import store from "../store/index"

const routes = [
  {
    path: "/",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
      beforeEnter(to, from, next){
        console.log('from store : ',store.state.stringAccess);
        let currentUser = JSON.parse(window.sessionStorage.currentUser);
        let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
        if(currentUser && lockAccess && 
          (lockAccess === store.state.stringAccess) ){
          next();
        }
        else {
          next("/")
        }
      },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Profile.vue"),
  
      beforeEnter(to, from, next){
        console.log('from store : ',store.state.stringAccess);
        let currentUser = JSON.parse(window.sessionStorage.currentUser);
        let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
        if(currentUser && lockAccess && 
          (lockAccess === store.state.stringAccess) ){
          next();
        }
      else {
        next("/")
      }
    },
}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
