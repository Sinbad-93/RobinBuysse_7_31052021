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
      password: ''
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
    postUserInfos: ({commit},userInfos) => {
      //console.log('INSCRIPTION');
      console.log(userInfos);
      console.log(userInfos.famillyName, userInfos.name, 
        userInfos.email, userInfos.password )
      /*if (this.dataVerify.some(el => email.includes(el))){
            alert('vote e-mail est déjà utilisé, veuillez le modifier pour continuer');
            return
          }
      else if (this.dataVerify.some(el => identifiant.includes(el))){
            alert('vote identifiant est déjà utilisé, veuillez le modifier pour continuer');
            return
          }*/
       if(!(userInfos.name === "") 
       && !(userInfos.famillyName === "") 
       && !(userInfos.password === "") 
       && !(userInfos.email === "")
          ){
      // POST request using fetch with error handlingvar 
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familly_name : userInfos.famillyName, name : userInfos.name, 
          email : userInfos.email,password : userInfos.password  })};
      fetch('http://localhost:3000/auth/signup', requestOptions)
        .then(response => {
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
          const data = response.json()
          .then(data => falseuser._addNewUser(data))
          
          .then( /*setTimeout(() => {
            commit('saveUser')
          }, 5000)*/commit('saveUser')
          
          // LE COMMIT S4EXECUTE AVANT QUE LA DATA NE SOIT ARRIVEE; PQ ?



            /*data =>*/ //console.log( "Formulaire réponse : " + this.dataGet ),
           // à faire : mettre un load spinner voir une fenetre de choix 
          //console.log('inscription réuissie...'),
          /*this.newPass = password,
          
          this.newMail = email,
          this.proposeLogin()*/);})
          .catch(error => {
          this.errorMessage = error;
          console.error('Formulaires, error : ', error);
          return});
          }
          //si un champ est resté vide on ne passe pas dans fetch
        else{
          console.log('veuillez remplir tous les champs')
          }
    },
  },
  modules: {},
});
