import { createStore } from "vuex";

import CryptoJS from "crypto-js";

const key = "82f2ceed4c503896c8a291e560bd4325"; // change to your key
const iv = "sinasinasisinaaa"; // change to your iv

function aesEncrypt(txt) {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
}
function aesDencrypt(txt) {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
}
var tester = aesEncrypt("blabla");
//console.log("encrypt :", tester);
//console.log("decrypt :", aesDencrypt(tester));


export default createStore({
  //state
  state: {
    refresh: 0,
    data: null,
    status: "",
    newuser: "New",
    userConnectedInfos: {
      id_user: "0",
      name: "",
      familly_name: "",
      email: "",
      password: "",
      admin: 0,
      token: null,
      photo: null,
      userReactions: {},
    },
    numberOfReactions: {},
    userPickedInfos: {
      id_user: "0",
      name: "0",
      familly_name: "0",
      email: "0",
      password: "0",
      photo : null,
      userReactions: {},
    },
    allUsers: [],
  },
  getters: {
    refresh(state) {
      return state.refresh;
    },

    getUser(state) {
      return state.userConnectedInfos;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
    getUserPickedInfos(state) {
      return state.userPickedInfos;
    },
  },
  // mutations
  mutations: {
    refreshing(state) {
      state.refresh += 1;
    },
    oneUser(state, data) {
      state.userPickedInfos.name = data[0].name;
      state.userPickedInfos.familly_name = data[0].familly_name;
      state.userPickedInfos.email = data[0].email;
      state.userPickedInfos.photo = data[0].photo;
    },
    allUsers(state, data) {
      state.allUsers = [];
      //console.log(data);
      for (let i = 0; i < data.length; ++i) {
        //console.log(i);
        state.allUsers.push(data[i]);
      }
      //console.log(state.allUsers);
    },
    setStatus: function (state, status) {
      state.status = status;
    },
    connectUser: function (state, userInfos) {
      state.userConnectedInfos.name = userInfos.name;
      state.userConnectedInfos.familly_name = userInfos.familly_name;
      state.userConnectedInfos.email = userInfos.email;
      state.userConnectedInfos.id_user = userInfos.id_user;
      state.userConnectedInfos.admin = userInfos.admin;
      state.userConnectedInfos.photo = userInfos.photo;
      state.userConnectedInfos.token = userInfos.token;
    },
    formatUserReactions(state, data) {
      //console.log("DATA SORT");
      //console.log(data["data"]);
      let userReactionsMiror = data["data"];
      var packets = {};
      // reformater la data pour passer de 0:{ id : 21, heart : 2, smile :1} à
      // 21:{ reactions :[2,1]} ce qui nous permet d'avoir l'id de la publication comme index
      for (let index = 0; index < userReactionsMiror.length; ++index) {
        packets[userReactionsMiror[index].id_parent_publication] = {
          reactions: [
            userReactionsMiror[index].hearts,
            userReactionsMiror[index].smiles,
            userReactionsMiror[index].laughs,
          ],
        };
      }
      //console.log("PACKETS");
      //console.log(packets);
      state.userConnectedInfos.userReactions = packets;
      //console.log(state.user);
    },

    formatNumberOfReactions(state, data) {
      //console.log('DATA SORT');
      //console.log(data['data']);
      let numberOfReactionsMiror = data["data"];
      var packets = {};
      // reformater la data pour passer de 0:{ id : 21, heart : 2, smile :1} à
      // 21:{ reactions :[2,1]} ce qui nous permet d'avoir l'id de la publication comme index
      for (let index = 0; index < numberOfReactionsMiror.length; ++index) {
        packets[numberOfReactionsMiror[index].id_parent_publication] = {
          reactions: [
            numberOfReactionsMiror[index].hearts,
            numberOfReactionsMiror[index].smiles,
            numberOfReactionsMiror[index].laughs,
          ],
        };
      }
      //console.log('PACKETS');
      //console.log(packets);
      //state.userConnectedInfos.userReactions= packets;
      state.numberOfReactions = packets;
      //console.log(state.user);
    },
  },
  //actions
  actions: {
    login: ({ commit }, userInfos) => {

      //console.log("l'utilisateur est connecté");
      //console.log(userInfos);

      /*générer des chaines aléatoires de verification pour garantir le bon acces front end
      même si un utilisateur trafic le local ou sessionStorage */
      var lockString =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      if (userInfos.admin === 1) {
        var lockString2 =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        lockString += lockString2;
        const lockStringCrypted = aesEncrypt(lockString);
        sessionStorage.setItem("lockAccess", JSON.stringify(lockString));
        localStorage.setItem(
          "lockAccessCrypted",
          JSON.stringify(lockStringCrypted)
        );
        localStorage.setItem("adminAccess", JSON.stringify(lockString2));
      } else {
        const lockStringCrypted = aesEncrypt(lockString);
        //console.log("basic :", lockString);
        //console.log("encrypted :", lockStringCrypted);
        sessionStorage.setItem("lockAccess", JSON.stringify(lockString));
        localStorage.setItem(
          "lockAccessCrypted",
          JSON.stringify(lockStringCrypted)
        );
      }

      sessionStorage.setItem("currentUser", JSON.stringify(userInfos.name));
      localStorage.setItem("connectedUser", JSON.stringify(userInfos));
      localStorage.setItem("token", JSON.stringify(userInfos.token));
      commit("connectUser", userInfos);
    },

    loginAccount: ({ commit }) => {
      commit("setStatus", "loadingConnect");
      //commit('saveUser');
    },
    createAccount: ({ commit }) => {
      commit("setStatus", "loadingCreate");
      //commit('saveUser');
    },

    // GET REACTIONS ----------------------------------------------
    // reactions de l'utilisateur connecté

    async fetchGetUserReactions({ commit, dispatch }, id) {
      let response = await fetch(
        "http://localhost:3000/publish/find_user_reactions/" + id,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },

    // display USER REACTIONS ------------------
    findUserReactions: ({ commit, dispatch }, id) => {
      dispatch("fetchGetUserReactions", id)
        .then((data) => {
          //console.log("USER REACTIONS");
          //console.log(data);
          commit("formatUserReactions", data);
        })
        .catch((e) => console.log(e));
    },

    // nombre total de reactions
    async fetchGetReactions({ commit, dispatch }, id) {
      let response = await fetch(
        "http://localhost:3000/publish/find_reactions/" + id,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },

    // display REACTIONS ------------------
    findAllReactions: ({ commit, dispatch }, id) => {
      dispatch("fetchGetReactions", id)
        .then((data) => {
          //console.log(data);
          //console.log("DATA");
          //console.log(data);
          commit("formatNumberOfReactions", data);
        })
        .catch((e) => console.log(e));
    },

    // FETCH TO USER ----------------------------------------------
    async fetchGetOneUser({ commit, dispatch }, ids) {
      //console.log(id);
      let response = await fetch("http://localhost:3000/auth/oneUser/" + ids, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      });
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },

    // GET ONE USER ------------------
    // l'id utilisateur indispensable pour passer l'authentification
    getOneUser: ({ commit, dispatch }, ids) => {
      dispatch("fetchGetOneUser", ids)
        .then((data) => {
          //console.log(data);
          commit("oneUser", data["data"]);
        })
        .catch((e) => console.log(e));
    },

    // FETCH ALL USERS ----------------------------------------------
    async fetchGetAllUsers({ commit, dispatch }, id) {
      let response = await fetch("http://localhost:3000/auth/allUsers/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
      });
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },

    // GET ALL USERS ------------------
    getAllUsers: ({ commit, dispatch }, id) => {
      dispatch("fetchGetAllUsers", id)
        .then((data) => {
          //console.log(data);
          commit("allUsers", data["data"]);
        })
        .catch((e) => console.log(e));
    },

    // FETCH DELETE PUBLICATION ----------------------------------------------

    async fetchDeletePublication({ commit, dispatch }, ids) {
      const id_user = ids.split("_")[0];
      const id_publication = ids.split("_")[1];
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
        },
        body: JSON.stringify({
          id: id_publication,
          user_id: id_user,
        }),
      };

      let response = await fetch(
        "http://localhost:3000/publish/deletePublication",
        requestOptions
      );
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        //console.log('not response ok, error : ' + error);
        alert("une erreur innattendue s'est produite");
        return Promise.reject(error);
      }
      return await response.json();
    },

    // DELETE PUBLICATION ----------------------------------------------
    // l'id utilisateur indispensable pour passer l'authentification
    deletePublication: ({ commit, dispatch }, ids) => {
      const id_user = ids.split("_")[0] + "_" + ids.split("_")[0];
      // on verifie l'identité de l'utilisateur avant de lancer la requete delete,
      //et si le back nous retourne bien admin true
      dispatch("fetchGetOneUser", id_user)
        .then((data) => {
          //console.log(data);
          /* une fois qu'on a notre utilisateur on verifie si il est admin depuis la db
 le front sait déjà si il est admin à la connexion MAIS refaire une verif back à chaque appel
 garantie que même si quelqu'un trafic le localStorage ou une variable du store, 
 il n'aura pas accès au fonction administrateur */
          if (data["data"][0].admin === 1) {
            dispatch("fetchDeletePublication", ids)
              .then((data) => {
                //console.log("publication deleted" + data);
                //actualiser les posts
                commit("refreshing");
              })
              .catch((e) => console.log(e));
          } else {
            console.log("vous n'êtes pas administateur");
          }
        })
        .catch((e) => console.log(e));
    },
  },

  modules: {},
});
