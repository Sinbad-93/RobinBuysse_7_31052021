import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import store from "../store/index"

import CryptoJS from 'crypto-js'

const key = '82f2ceed4c503896c8a291e560bd4325' // change to your key
const iv = 'sinasinasisinaaa' // change to your iv

function aesEncrypt(txt) {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  })

  return cipher.toString()
};
function aesDencrypt(txt) {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  })

  return CryptoJS.enc.Utf8.stringify(cipher).toString()
};
var tester = aesEncrypt('blabla');
console.log('encrypt :', tester );
console.log('decrypt :', aesDencrypt(tester) )

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
        console.log('from local : ',JSON.parse(window.sessionStorage.lockAccess));
        let currentUser = JSON.parse(window.sessionStorage.currentUser);
        let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
        let lockAccessCrypted = JSON.parse(window.localStorage.lockAccessCrypted);
        const lockAccessDecrypted = aesDencrypt(lockAccessCrypted);
        console.log(lockAccess);
        console.log(lockAccessCrypted);
        console.log(lockAccessDecrypted);
        if(currentUser && lockAccess && 
          (lockAccess === lockAccessDecrypted) ){
            console.log('true');
          next();
        }
        else {
          console.log('false');
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
        console.log('from local : ',JSON.parse(window.localStorage.lockAccessCrypted));
        let currentUser = JSON.parse(window.sessionStorage.currentUser);
        let lockAccess = JSON.parse(window.sessionStorage.lockAccess);
        let lockAccessCrypted = JSON.parse(window.localStorage.lockAccessCrypted);
        const lockAccessDecrypted = aesDencrypt(lockAccessCrypted);
        if(currentUser && lockAccess && 
          (lockAccess === lockAccessDecrypted) ){
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
