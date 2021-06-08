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
      id_user : '1',
      name : '',
      famillyName : '',
      email : '',
      password: ''
    }
  },
  getters:{},
  // mutations
  mutations: {
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
    }
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
      }
    },
  modules: {},
});
