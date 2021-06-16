import { createStore } from "vuex";


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
    oneUser(state,data){
      
      state.userPickedInfos.name =  data[0].name;
      state.userPickedInfos.famillyName =  data[0].familly_name;
      state.userPickedInfos.email =  data[0].email;
      
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
      console.log('l\'utilisateur est connecté')
      commit('setStatus', 'loadingConnect');
      localStorage.setItem("connectedUser", JSON.stringify(userInfos));
      commit('connectUser',userInfos);
      },

    createAccount: ({commit}) => {
      commit('setStatus', 'loadingCreate');
      //commit('saveUser');
      },
    
      // GET REACTIONS ----------------------------------------------
    fetchGetReactions:async() =>{
      let response = await fetch('http://localhost:3000/publish/find_reactions');
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          //console.log('not response ok, error : ' + error);
          alert('une erreur innattendue s\'est produite');
          return Promise.reject(error); 
          }
          return await response.json();},
  
  // display REACTIONS ------------------
  findAllReactions:({ commit, dispatch })=>{
     dispatch('fetchGetReactions').then((data) => {
      //console.log(data);
      commit('sortReactions', data);
      
}).catch(e => console.log(e));},
  // FETCH TO USER ----------------------------------------------
  async fetchGetOneUser({ commit, dispatch }, id) {
    //console.log(id);
    let response = await fetch('http://localhost:3000/auth/oneUser/' + id );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert('une erreur innattendue s\'est produite');
        return Promise.reject(error); 
        }
        return await response.json();},

// GET ONE USER ------------------
getOneUser:({ commit, dispatch }, id)=>{
  dispatch('fetchGetOneUser', id).then((data) => {
    console.log(data);
    commit('oneUser', data['data']);
    
}).catch(e => console.log(e));},

// FETCH ALL USERS ----------------------------------------------
async fetchGetAllUsers({ commit, dispatch }) {
  let response = await fetch('http://localhost:3000/auth/allUsers');
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      //console.log('not response ok, error : ' + error);
      alert('une erreur innattendue s\'est produite');
      return Promise.reject(error); 
      }
      return await response.json();},

// GET ALL USERS ------------------
getAllUsers:({ commit, dispatch })=>{
dispatch('fetchGetAllUsers').then((data) => {
  //console.log(data);
  commit('allUsers', data['data']);
  
}).catch(e => console.log(e));},

//FETCH URL


// POST PUBLICATIONS ----------------------------------------------
async fetchPostNewPhotoUrl({ commit, dispatch }, object){
   const formData = new FormData();
   formData.append("image", object.image);
   formData.append("id",object.id);
   const requestOptions = {
   method: 'POST',
   body: formData
       };

   let response = await fetch('http://localhost:3000/auth/profil_photo', requestOptions);
     if (!response.ok) {
       // get error message from body or default to response status
       const error = (data && data.message) || response.status;
       //console.log('not response ok, error : ' + error);
       alert('une erreur innattendue s\'est produite');
       return Promise.reject(error); 
       }
       return await response.json();},

// POST USER PHOTO URL ------------------
newPhoto:({ commit, dispatch }, object)=>{
  dispatch('fetchPostNewPhotoUrl', object).then((data) => {
    console.log(data);
    
    
  }).catch(e => console.log(e));},

},


  
    
    
  
  modules: {},
});

