<template>
  <div class="container">
    <div class="answers" ref="answers">
      <button @click="postAnswer = !postAnswer" class="grey_btn">
        répondre
      </button>
      <!--button @click="findAllAnswers">FETCH</button!-->
      <div v-if="postAnswer" class="answer" ref="newPublication">
        <span>Exprimez vous !</span>
        <textarea v-model="answer" name="" id="" cols="30" rows="10"></textarea>
        <div>
          <button
            class="grey_btn"
            :disabled="checkTextarea()"
            :id_db="id_db"
            :id_comment_db="id_comment_db"
            @click="publishAnswer(id_db, id_comment_db)"
          >
            publier
          </button>
          <button class="grey_btn" @click="postAnswer = !postAnswer">
            annuler
          </button>
        </div>
      </div>
      <div v-else-if="loading && !postComment" class="answer loading">
        LOADING ...
      </div>
      <div
        class="answer"
        v-for="(data, index) in answersData"
        :key="data"
        :index="index"
      >
        <div
          class="answerCont"
          :index="index"
          :id_comment_db="id_comment_db"
          v-if="checkParentId(id_comment_db, data.parent_id_answer)"
        >
          <span
            ref="userAnswer "
            @click="$emit('find_user', index_parent, data.user_id)"
            class="userAnswer metal radial"
            >{{ data.name }} {{ data.familly_name }}
          </span>
          <span class="answerMessage">{{ data.answer }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Answer",
  components: {},
  props: [
    "viewComment",
    "adminConnected",
    "user",
    "objectSize",
    "id_comment_db",
    "id_db",
    "index_parent",
  ],
  data() {
    return {
      isSpread: false,
      seeAnswer: false,
      postAnswer: false,
      alreadyClicked: false,
      loading: false,
      newTitle: "new",
      newAnswer: "",
      comment: "none",
      answer: "",
      parent_id: null,
      answersData: [
        { utilisateur: "Elvis", answer: "Waow extra" },
        { utilisateur: "Fox", answer: "Alors ça, je dis oui !" },
      ],
    };
  },
  mounted() {
    this.findAllAnswers();
  },
  methods: {
    // FUNCTIONS ---------------------------------
    // réponses affichés sur le bon posts -> cohérence
    checkParentId(number, parent_id) {
      if (!number) {
        return false;
      }
      if (number == parent_id) {
        return true;
      } else {
        return false;
      }
    },
    // POST ANSWERS ----------------------------------------------

    async fetchPostAnswer(number, comment_id) {
      if (!(this.comment === "")) {
        this.parent_id = comment_id;
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")),
          },
          body: JSON.stringify({
            parent_id: number,
            parent_id_answer: this.parent_id,
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
        alert("veuillez remplir tous les champs");
      }
    },

    // publish answers ----------------
    publishAnswer(number, comment_id) {
      if (this.alreadyClicked === false) {
        this.alreadyClicked = true;
        this.fetchPostAnswer(number, comment_id)
          .then((data) => {
            //console.log(data);
            //fermer la fenetre de publication
            this.postComment = false;
            this.loading = true;
            // rafraichir les données
            this.findAllAnswers();
            this.postAnswer = !this.postAnswer;
            this.alreadyClicked = false;
          })
          .catch((e) => console.log(e));
      }
    },

    // GET ANSWERS ----------------------------------------------

    async fetchGetAnswers() {
      let response = await fetch(
        "http://localhost:3000/publish/find_answers/" + this.user.id_user,
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

    // display answers ------------------
    findAllAnswers() {
      this.fetchGetAnswers()
        .then((data) => {
          //console.log(data);
          this.answersData = [];
          var size = this.objectSize(data["data"]);
          size = size.reverse();
          //console.log(size);
          size.forEach((size) => {
            this.answersData.push(data["data"][size]);
          });
          //this.publicationsData.slice().reverse();
          this.loading = false;
        })
        .catch((e) => console.log(e));
    },

    checkTextarea() {
      if (this.alreadyClicked === true) {
        return true;
      }
      if (this.answer.length < 5) {
        return true;
      } else if (this.answer.length > 255) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.answers {
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  overflow-x: visible;
  width: 100%;
  justify-items: center;
  align-items: center;
  /*border: 1px black solid;*/
  height: auto;
  margin-bottom: 20px;
  background-color: transparent;
}
.answer {
  background-color: transparent;
  display: grid;
  position: relative;
  width: 70%; /**/
  margin-bottom: 10px;
}
.answerCont {
  display: grid;
  opacity: 0.9; /**/
  border-radius: 20px;
  background-color: white;
  min-height: 120px;
  /*grid-template-rows: 20% auto ;*/
  justify-items: center;
  align-items: center;
}
span {
  max-width: 500px;
  margin-bottom: 10px;
  /*margin: auto;*/ /**/

  text-align: left;
}
button {
  margin-bottom: 30px;
  font-size: 22px;
  padding: 7px;
}
.userAnswer {
  grid-row-start: 1;
  max-height: 25px;
  padding-left: 10px;
  padding-right: 10px;
  overflow: hidden;
}
.answerMessage {
  grid-row-start: 2;
  justify-self: center;
  padding-left: 5px;
  color: black;
  font-size: 22px;
  margin-top: 10px;
}
.icons {
  grid-row-start: 3;
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
.loading {
  background-color: rgb(255, 255, 255);
  color: black;
  font-size: 25px;
}
textarea {
  font-size: 22px;
}

@media screen and (max-width: 1366px) {
  .answer {
    width: 80%;
  }

  span {
    max-width: 380px;
    margin: auto;
  }

  .answerMessage {
    /*font-size: 22px;*/
    margin-top: 10px;
    font-size: 20px;
  }
  textarea {
    font-size: 18px;
    max-height: 180px;
  }
}

@media screen and (max-width: 767px) {
  button {
    margin-bottom: 30px;
    font-size: 14px; /**/
    padding: 7px; /**/
  }
  .answer {
    width: 80%;
  }
  .answerMessage {
    font-size: 17px;
  }
  textarea {
    font-size: 16px;
  }
  span {
    max-width: 230px;
  }
}
</style>
