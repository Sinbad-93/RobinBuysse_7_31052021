<template>
  <div>
    <div ref="comments" class="comments">
      <button
        :disabled="postComment"
        @click="postComment = !postComment"
        class="grey_btn"
      >
        poster un commentaire
      </button>
      <div v-if="postComment" class="comment" ref="newPublication">
        <span>Exprimez vous !</span>
        <textarea
          ref="textarea"
          v-model="comment"
          name=""
          id=""
          minlength="5"
          cols="30"
          rows="10"
        ></textarea>
        <div>
          <button
            class="grey_btn"
            :disabled="checkTextarea()"
            :id_db="id_db"
            @click="publishComment(id_db)"
          >
            publier
          </button>
          <button class="grey_btn" @click="postComment = !postComment">
            annuler
          </button>
        </div>
      </div>
      <div v-else-if="loading && !postComment" class="comment loading">
        LOADING ...
      </div>

      <div
        :id_comment_db="data.id_comment_and_answer"
        v-bind:class="checkParentId(data.parent_id) ? 'comment ' : 'notVisible'"
        ref="comment"
        v-for="(data, index) in commentsData"
        :key="data"
        :index="index"
      >
        <div
          class="commentCont"
          :index="index"
          v-if="checkParentId(data.parent_id)"
        >
          <span
            ref="userComment"
            @click="$emit('find_user', index_parent, data.user_id)"
            class="userComment metal radial"
            >{{ data.name }} {{ data.familly_name }}
          </span>
          <span class="commentMessage">{{ data.comment }}</span>
          <span class="commentHour">{{ data.date_posted }}</span>

          <button
            v-if="!indexCheck(index)"
            :index="index"
            class="answerButton"
            @click="openAnswersFunction(index)"
          >
            Réponses
          </button>
          <button
            v-else
            :index="index"
            class="answerButton"
            @click="openAnswersFunction(index)"
          >
            Masquer
          </button>
        </div>
        <Answer
          :id_db="data.parent_id"
          :id_comment_db="data.id_comment_and_answer"
          :objectSize="objectSize"
          :user="user"
          :adminConnected="adminConnected"
          @find_user="emitToPublication"
          :index_parent="index_parent"
          v-if="indexCheck(index)"
        ></Answer>
      </div>
    </div>
  </div>
</template>

<script>
import Answer from "../components/Answer.vue";

export default {
  name: "Comments",
  components: {
    Answer,
  },
  props: [
    "viewComment",
    "adminConnected",
    "user",
    "objectSize",
    "id_db",
    "index_parent",
  ],
  data() {
    return {
      isSpread: false,
      postComment: false,
      alreadyClicked: false,
      newTitle: "new",
      loading: false,
      comment: "",
      answer: "none",
      parent_id: null,
      viewAnswer: false,
      focusIndex: [],
      commentsData: [
        { utilisateur: "Charoux", comment: "génial ta publication" },
      ],
    };
  },
  mounted() {
    this.findAllComments();
  },
  methods: {
    // POST COMMENTS ----------------------------------------------
    async fetchPostComment(number) {
      if (!(this.comment === "")) {
        this.parent_id = number;
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
          body: JSON.stringify({
            parent_id: this.parent_id,
            user_id: this.user.id_user,
            comment: this.comment,
            answer: this.answer,
          }),
        };

        let response = await fetch(
          "http://localhost:3000/publish/commentAndAnswer",
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
      }
      //si un champ est resté vide on ne passe pas dans fetch
      else {
        console.log("veuillez remplir tous les champs");
      }
    },
    // publish comments----------------
    publishComment(number) {
      if (this.alreadyClicked === false) {
        this.alreadyClicked = true;
        this.fetchPostComment(number)
          .then((data) => {
            console.log(data);
            //fermer la fenetre de publication
            this.postComment = false;
            this.loading = true;
            // rafraichir les données
            this.findAllComments();
            this.alreadyClicked = false;
          })
          .catch((e) => console.log(e));
      }
    },

    // GET COMMENTS ----------------------------------------------

    async fetchGetComments() {
      let response = await fetch(
        "http://localhost:3000/publish/find_comments/" + this.user.id_user,
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

    // display comments----------------
    findAllComments() {
      this.fetchGetComments()
        .then((data) => {
          console.log(data);
          this.commentsData = [];
          var size = this.objectSize(data["data"]);
          size = size.reverse();
          //console.log(size);
          size.forEach((size) => {
            this.commentsData.push(data["data"][size]);
          });
          //this.publicationsData.slice().reverse();
          this.loading = false;
        })
        .catch((e) => console.log(e));
    },

    // FUNCTIONS ---------------------------------
    // COMPARER l'id du parent et celui de la table commentaire
    // pour associer les bons coms avec les bons publis
    checkParentId(number) {
      if (!number) {
        return false;
      }
      var ele = this.$refs.comments.parentNode.parentNode.firstChild;
      //console.log(el.getAttribute('id_db'));
      var parent_id = ele.getAttribute("id_db");
      if (number == parent_id) {
        return true;
      } else {
        return false;
      }
    },
    // Verifier le nombre de carractère textarea pour autoriser la publication
    checkTextarea() {
      if (this.alreadyClicked === true) {
        return true;
      }
      if (this.comment.length < 5) {
        return true;
      } else if (this.comment.length > 1000) {
        return true;
      } else {
        return false;
      }
    },

    openAnswersFunction(index) {
      //si les answers sont déjà visibles et qu'on clique
      if (this.focusIndex.includes(index)) {
        var position = this.focusIndex.indexOf(index);
        if (position > -1) {
          // alors on retire l'index de la liste pour masquer les answers
          this.focusIndex.splice(position, 1);
        }
      }
      // si les answers sont masqués
      else {
        //inserer l'index dans la liste, donc les answers sont visibles
        this.focusIndex.push(index);
      }
    },
    // verifier que les réponses affichés sont bien reliés aux bons commentaires 
    indexCheck(index) {
      if (this.focusIndex.includes(index)) {
        return true;
      }
    },
    // evenement active la fonction sur le parent pour voir la carte de profil 
    emitToPublication(index, number) {
      this.$emit("find_user", index, number);
    },
  },
};
</script>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  justify-items: center;
  align-items: center;
  /* border: 1px black solid;*/
  height: auto;
  /*height: 420px;*/
  margin-bottom: 20px;
}
.comment {
  display: grid;
  color: white; /**/
  background: #185a9d; /**/
  background: linear-gradient(90deg, #185a9d 26%, #43cea2 99%); /**/
  position: relative;
  width: 100%;
  border: 1px black solid;
  margin-bottom: 10px;
}

.commentCont {
  display: grid;
  min-height: 200px;
  grid-template-rows: 1fr auto 1fr 1fr;
  justify-items: center;
  align-items: center;
}

span {
  max-width: 700px;
  margin-bottom: 10px;
  margin: auto;
  text-align: left;
}
::-webkit-scrollbar {
  display: none;
}
.userComment {
  grid-row-start: 1;
  font-size: 20px;
  /*max-height: 25px;*/
  overflow: hidden;
  margin-top: 5px;
  padding: 5px 10px;
}
.commentMessage {
  grid-row-start: 2;
  width: 700px; /**/
  justify-self: center;
  font-size: 23px;
  margin-top: 10px;
}
.commentHour {
  font-size: 18px; /**/
  color: black; /**/
}
.answerButton {
  font-size: 21px;
  margin: 0;
  border: none;
  color: white;
  background-color: transparent;
}
.icons {
  grid-row-start: 3;
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
button {
  margin-bottom: 30px;
  font-size: 22px;
  padding: 7px;
}
.notVisible {
  display: none;
}
.loading {
  background-color: rgb(255, 255, 255);
  font-size: 25px;
}
textarea {
  width: 700px; /**/
  justify-self: center;
  font-size: 23px;
}

@media screen and (max-width: 1366px) {
  span {
    max-width: 450px;
  }

  .userComment {
    font-size: 18px;
    padding-top: 0;
    max-height: 25px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .commentMessage {
    font-size: 20px;

    /*width: 700px;*/
  }
  .commentHour {
    font-size: 14px;
  }
  .answerButton {
    font-size: 16px;
  }
  textarea {
    width: 460px; /**/
    font-size: 16px;
  }
}

@media screen and (max-width: 767px) {
  button {
    /*margin-bottom: 30px;*/
    font-size: 14px; /**/
    padding: 5px; /**/
  }
  .userComment {
    font-size: 15px;
    padding-top: 0;
  }
  .commentMessage {
    font-size: 17px;
    /*width: 700px;*/
  }
  textarea {
    width: 260px; /**/
    font-size: 14px;
  }
  span {
    max-width: 260px;
  }
}
</style>
