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
    status : '',
    user : fakeUser21,
    falseuser : falseuser._returnLastUser(),
    newuser :'New',
    userConnectedInfos :{
      name : '',
      famillyName : '',
      email : '',
      photo : ''
    }
  },
  getters:{},
  // mutations
  mutations: {
    saveUser(state){
      state.newuser = falseuser._returnLastUser();
    },
    setStatus: function (state, status) {
      state.status = status;
    },
    connectUser: function(state){
      state.userConnectedInfos.name = falseuser.name;
      state.userConnectedInfos.famillyName = falseuser.famillyName;
      state.userConnectedInfos.email =falseuser.email;
    }
  },
  //actions
  actions: {
    login: ({commit}, userInfos) => {
      falseuser = falseuser._returnLastUser();
      if ((falseuser.email === userInfos.email) && 
      (falseuser.password === userInfos.password)){
        console.log('l\'utilisateur exsite')
        commit('setStatus', 'loadingConnect');
        commit('connectUser')
      }else {
        console.log('non trouvé')
      }
      
    },
    createAccount: ({commit},userInfos) => {
      falseuser._addNewUser(userInfos);
      commit('setStatus', 'loadingCreate');
      commit('saveUser');
      
    },
  },
  modules: {},
});
