import { createStore } from "vuex";

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

class User{
  constructor(id, mail, name, famillyName) {
      this.id = id
      this.name = name
      this.famillyName = famillyName
      this.mail = mail
  }
};
let fakeUser21 = new User(21, 'Robin', 'Fox');
class FakeUser {
  constructor() {
      this.key = "basket"
      // this.content = JSON.parse(localStorage.getItem(this.key))
      // this.content = []
      this.content = [{id: 22, email:'rob1_93@hotmail.fr',name: 'Robinou', famillyName: 'Buysse',password :'Motdepasse1'}]
  }
  _returnAllUser(){
    return this.content
  }
  _returnLastUser(){
    return this.content[(this.content.length -1)]
  }
  _addNewUser(newUser) {
    console.log("On ajoute un utilisateur")
    this.content.push(newUser)
    /*this._save()*/
}
  _save(){
    localStorage.setItem(this.key, JSON.stringify(this.content))
}
};
let falseuser = new FakeUser();
export default createStore({
  //state
  state: {
    refresh : 0,
    data : null,
    status : '',
    user : fakeUser21,
    falseuser : falseuser._returnLastUser(),
    newuser :'New',
    userConnectedInfos :{
      id_user : '1',
      name : '',
      famillyName : '',
      email : '',
      password: '',
      token : null,
      photo : null,
      userReactions : {},
      numberOfReactions : {},
    },
    userPickedInfos :{
      id_user : '0',
      name : '0',
      famillyName : '0',
      email : '0',
      password: '0',
      userReactions : {},
      numberOfReactions : {},
    },
    allUsers : [],
  },
  getters:{
    refresh(state){
      return state.refresh;
    },
  
    getUser(state) {
      return state.userConnectedInfos;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
    getUserPickedInfos(state){
      return state.userPickedInfos;
    }
  },
  // mutations
  mutations: {
    refreshing(state){
      state.refresh += 1;
    },
    oneUser(state,data){
      
      state.userPickedInfos.name =  data[0].name;
      state.userPickedInfos.famillyName =  data[0].familly_name;
      state.userPickedInfos.email =  data[0].email;
      state.userPickedInfos.photo =  data[0].photo;
      
    },
    allUsers(state,data){
      
     //console.log(data);
     for (let i = 0; i < data.length; ++i) {
       //console.log(i);
      state.allUsers.push(data[i]);}
      //console.log(state.allUsers);
    },
    saveUser(state){
      state.newuser = state.falseuser._returnLastUser();
    },
    setStatus: function (state, status) {
      state.status = status;
    },
    connectUser: function(state, userInfos){
      state.userConnectedInfos.name =  userInfos.name;
      state.userConnectedInfos.famillyName =  userInfos.familly_name;
      state.userConnectedInfos.email =  userInfos.email;
      state.userConnectedInfos.id_user =  userInfos.id_user;
      state.userConnectedInfos.photo =  userInfos.photo;
      state.userConnectedInfos.token =  userInfos.token;
    },
    sortReactions(state, data){
      /* on va récuperer toutes les réactions et on va les trier 
      dans parentReactions pour qu'elles soient regroupés par publications */

      //A RETIRER LORSQUE LA CONNEXION SERA OBLIGATOIRE
      state.userConnectedInfos = JSON.parse(localStorage.getItem("connectedUser"));

      //console.log(data);
      var reactionsObject = data['data'];
      var userReactionsMiror = [];
      var numberOfReactionsMiror = [];
      var countSameId = [];
      var countSameId2 = [];
      //console.log(reactionsObject);
      //console.log(reactionsObject[0]['id_parent_publication']);
      reactionsObject.forEach((key) => {
          // 0 : {rdv_date : 'string'}
          // 0 is key and rdv is i
              //console.log(i);
              //console.log(this.parentReactions);
              //console.log(key['id_parent_publication']);
  // rassembler les réactions de l'utilisateur connecté pour colorer à la connexion 
          if(state.userConnectedInfos.id_user == key['id_user']){
  
              if (!countSameId2.includes(key['id_parent_publication'])){
  
              countSameId2.push(key['id_parent_publication']);
              userReactionsMiror.push({
              id : key['id_parent_publication'], 
              reactions : [
              key['heart'],
              key['smile'],
              key['laugh']
              ], user : key['id_user']
              });
              }
              else{
  
              userReactionsMiror.forEach((index) =>{
              if( index.id === key['id_parent_publication']){
                  if (key['heart'] === 1){
                      index.reactions[0] = 1;
                  }
                  if (key['smile'] === 1){
                      index.reactions[1] = 1;
                  }
                  if (key['laugh'] === 1){
                      index.reactions[2] = 1;
                  }
              }
              });}
            //console.log(countSameId2);
            }
  
  // rassembler toutes les reactions et trier en fonction de l'id de la publication 
          if (!countSameId.includes(key['id_parent_publication'])){
              countSameId.push(key['id_parent_publication']);
              
              numberOfReactionsMiror.push({
              id :key['id_parent_publication'], 
              reactions : [
              key['heart'],
              key['smile'],
              key['laugh']
              ], user : key['id_user']
              })
          }
          else {
              //console.log(this.parentReactions);
              numberOfReactionsMiror.forEach((index) =>{
              //console.log(index[i]);
              //console.log(key['id_parent_publication']);
  
              if (index.id === 
              key['id_parent_publication'])
              { 
                  if (key['heart'] === 1 ){
                      index.reactions[0] += 1;
                  }
                  if (key['smile'] === 1 ){
                      index.reactions[1] += 1;
                  }
                  if (key['laugh'] === 1 ){
                      index.reactions[2] += 1;
                  }
              }
          
          
          })
              }
      });
      //this.userReactions = userReactionsMiror;
      //this.parentReactions = parentReactionsMiror;
      //console.log(this.parentReactions);
      //console.log(userReactionsMiror);
      var packets = {};
      for(let index = 0; index < userReactionsMiror.length; ++index){
        //console.log(userReactionsMiror[index].id,userReactionsMiror[index].reactions);
  packets[userReactionsMiror[index].id] = {
  reactions: userReactionsMiror[index].reactions,
  user: userReactionsMiror[index].user
  };
  }

  var packets_2 = {};
  for(let index = 0; index < numberOfReactionsMiror.length; ++index){
    packets_2[numberOfReactionsMiror[index].id] = {
    reactions: numberOfReactionsMiror[index].reactions,
    user: numberOfReactionsMiror[index].user
    };
    }
    
    state.userConnectedInfos.userReactions= packets;
    state.userConnectedInfos.numberOfReactions= packets_2;
    console.log(state.user);
    },
    
    
  },
  //actions
  actions: {
    login: ({commit}, userInfos) => {
      //falseuser = falseuser._addNewUser(userInfos);
      console.log('l\'utilisateur est connecté');
      console.log(userInfos);
      commit('setStatus', 'loadingConnect');
      /*générer des chaines aléatoires de verification pour garantir le bon acces front end
      même si un utilisateur trafic le local ou sessionStorage */
      var lockString = Math.random().toString(36).substring(2, 15) + 
      Math.random().toString(36).substring(2, 15);
      if (userInfos.admin === 1 ){
      var lockString2 = Math.random().toString(36).substring(2, 15) + 
      Math.random().toString(36).substring(2, 15);
      lockString += lockString2;
      const lockStringCrypted = aesEncrypt(lockString);
      sessionStorage.setItem("lockAccess", JSON.stringify(lockString));
      localStorage.setItem("lockAccessCrypted", JSON.stringify(lockStringCrypted));
      localStorage.setItem("adminAccess", JSON.stringify(lockString2));
      }
      else {
      const lockStringCrypted = aesEncrypt(lockString);
      console.log('basic :', lockString);
      console.log('encrypted :', lockStringCrypted);
      sessionStorage.setItem("lockAccess", JSON.stringify(lockString));
      localStorage.setItem("lockAccessCrypted", JSON.stringify(lockStringCrypted));
      }

      sessionStorage.setItem("currentUser", JSON.stringify(userInfos.name));
      localStorage.setItem("connectedUser", JSON.stringify(userInfos));
      localStorage.setItem("token", JSON.stringify(userInfos.token));
      commit('connectUser',userInfos);
      },

    createAccount: ({commit}) => {
      commit('setStatus', 'loadingCreate');
      //commit('saveUser');
      },
    
      // GET REACTIONS ----------------------------------------------
    async fetchGetReactions({ commit, dispatch }, id){
      let response = await fetch('http://localhost:3000/publish/find_reactions/'+
      id,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
      }
      );
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          //console.log('not response ok, error : ' + error);
          alert('une erreur innattendue s\'est produite');
          return Promise.reject(error); 
          }
          return await response.json();},
  
  // display REACTIONS ------------------
  findAllReactions:({ commit, dispatch }, id)=>{
     dispatch('fetchGetReactions',id).then((data) => {
      //console.log(data);
      commit('sortReactions', data);
      
}).catch(e => console.log(e));},
  
// FETCH TO USER ----------------------------------------------
  async fetchGetOneUser({ commit, dispatch }, ids) {
    //console.log(id);
    let response = await fetch('http://localhost:3000/auth/oneUser/' + ids,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
    } );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert('une erreur innattendue s\'est produite');
        return Promise.reject(error); 
        }
        return await response.json();},

// GET ONE USER ------------------
// l'id utilisateur indispensable pour passer l'authentification
getOneUser:({ commit, dispatch }, ids)=>{
  dispatch('fetchGetOneUser', ids).then((data) => {
    console.log(data);
    commit('oneUser', data['data']);
    
}).catch(e => console.log(e));},

// FETCH ALL USERS ----------------------------------------------
async fetchGetAllUsers({ commit, dispatch }, id) {
  let response = await fetch('http://localhost:3000/auth/allUsers/'+ id,
  {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
  });
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      //console.log('not response ok, error : ' + error);
      alert('une erreur innattendue s\'est produite');
      return Promise.reject(error); 
      }
      return await response.json();},

// GET ALL USERS ------------------
getAllUsers:({ commit, dispatch }, id)=>{
dispatch('fetchGetAllUsers',id).then((data) => {
  //console.log(data);
  commit('allUsers', data['data']);
  
}).catch(e => console.log(e));},

    // FETCH DELETE PUBLICATION ----------------------------------------------
        
async fetchDeletePublication({ commit, dispatch }, ids) {
  const id_user  = ids.split("_")[0];
  const id_publication  = ids.split("_")[1]
    const requestOptions = {
    method : 'DELETE',
    headers : { "Content-Type": "application/json",
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))},
    body: JSON.stringify({ 
        id : id_publication,
        user_id : id_user
      })
    }

    let response = await fetch('http://localhost:3000/publish/deletePublication', requestOptions);
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert('une erreur innattendue s\'est produite');
        return Promise.reject(error); 
        }
        return await response.json();},

// DELETE PUBLICATION ----------------------------------------------  
// l'id utilisateur indispensable pour passer l'authentification
deletePublication:({ commit, dispatch }, ids) =>{
  const id_user  = ids.split("_")[0] + '_' + ids.split("_")[0];
  dispatch('fetchGetOneUser', id_user).then((data) => {
    console.log(data);
    /* une fois qu'on a notre utilisateur on verifie si il est admin depuis la db
 le front sait déjà si il est admin à la connexion MAIS refaire une verif back à chaque appel
 garantie que même si quelqu'un trafic le localStorage ou une variable du store, 
 il n'aura pas accès au fonction administrateur */
    if (data['data'][0].admin === 1){
      dispatch('fetchDeletePublication',ids).then((data) => {
      console.log('publication deleted' + data);
      //actualiser les posts
      commit('refreshing');
    }).catch(e => console.log(e));}
    else {console.log('vous n\'êtes pas administateur')}


  }).catch(e => console.log(e));
  
}
  },

 
  modules: {},

});

