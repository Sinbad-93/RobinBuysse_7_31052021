const mysql = require("mysql");
const dotenv = require("dotenv");
const { response } = require("express");
let instance = null;
dotenv.config();
/*CONFIGURER L'ACCES A LA BASE DE DONNEES MYSQL */
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});
/* lancer la connection, et gerer les erreurs de connection*/
connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }

  console.log("db " + connection.state);
});

class DbService {
  /*permet de creer des demandes uniques à chaque fois ? */
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  //---------------------USERS DATA-----------------------------

  // INSCRIPTION -------------------------------
  async insertNewUser(name, familly_name, email, password) {
    try {
      const datetime = new Date();
      response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO user (name, familly_name, email, password, datetime) VALUES (?,?,?,?,?);";
        connection.query(
          query,
          [name, familly_name, email, password, datetime],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // CONNEXION -------------------------------
  async getUserLogin(email, pass) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM user WHERE email=?;";
        connection.query(query, [email], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ONE USER
  async getOneUser(id) {
    //console.log(id);
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT name, familly_name, email, photo, admin FROM user WHERE id=?; ";
        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ALL USERS
  async getAllUsers() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT name, familly_name, id FROM user ";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  //  INSERT PROFILE PHOTO
  async insertProfilePhoto(post) {
    try {
      //console.log(post.id);
      //console.log(post.imageUrl);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE user SET photo=? WHERE id=? ;";
        connection.query(query, [post.imageUrl, post.id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  //  GET PROFILE PHOTO
  async getProfilePhoto(post) {
    try {
      //console.log(post.id);
      //console.log(post.imageUrl);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT photo FROM user where id=?";
        connection.query(query, [post.id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

   //  GET PUBLICATION PHOTO
   async getPublicationPhoto(id) {
    try {
      //console.log(post.id);
      //console.log(post.imageUrl);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT publication_media FROM publications where id_publication=?";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // DELETE ACCOUNT WHERE id = ?
  async deleteAccountData(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM user where id=? ";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      /* affectedRows permet de renvoyer true si des lignes ont été suppr de mysql*/
      return response === 1 ? true : false;
    } catch (error) {
      console.log("dbservice : " + error);
      return false;
    }
  }

  //-------------------------------PUBLICATIONS DATA-----------------------------
  // PUBLICATION insertPublication

  async insertPublication(post) {
    try {
      var dateAdded = new Date();
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      dateAdded = dateAdded.toLocaleDateString("fr-FR", options);
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO publications (publication_user_id, publication_title, publication_media, date_added) VALUES (?,?,?,?);";
        connection.query(
          query,
          [post.user_id, post.title, post.imageUrl, dateAdded],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ALL PUBLICATIONS ------------------

  /*SELECT * FROM TABLE*/
  async getAllPublicationsData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM publications LEFT JOIN user ON publications.publication_user_id = user.id; ";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // POST insert COMMENT AND ANSWER

  async insertCommentAndAnswer(
    parent_id,
    parent_id_answer,
    user_id,
    comment,
    answer
  ) {
    try {
      var date_posted = new Date();
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      date_posted = date_posted.toLocaleDateString("fr-FR", options);
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO comment_and_answer (parent_id,parent_id_answer,user_id, comment, answer, date_posted) VALUES (?,?,?,?,?,?);";
        connection.query(
          query,
          [parent_id, parent_id_answer, user_id, comment, answer, date_posted],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ALL COMMENT  ------------------

  async getAllCommentsData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM comment_and_answer LEFT JOIN user ON comment_and_answer.user_id = user.id WHERE comment !='none' ";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ALL ANSWERS  ------------------

  async getAllAnswersData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM comment_and_answer LEFT JOIN user ON comment_and_answer.user_id = user.id WHERE answer !='none' ";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // POST REACTIONS  ------------------
  async insertReaction(
    reaction,
    id_parent_publication,
    heart,
    smile,
    laugh,
    user_id
  ) {
    try {
      const response = await new Promise((resolve, reject) => {
        if (reaction === "heart") {
          const query =
            "INSERT INTO reactions (id_parent_publication,reaction, id_user) VALUES (?,?,?);";
          connection.query(
            query,
            [id_parent_publication, reaction, user_id],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
            }
          );
        } else if (reaction === "smile") {
          const query =
            "INSERT INTO reactions (id_parent_publication, reaction, id_user) VALUES (?,?,?);";
          connection.query(
            query,
            [id_parent_publication, reaction, user_id],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
            }
          );
        } else if (reaction === "laugh") {
          const query =
            "INSERT INTO reactions (id_parent_publication,reaction, id_user) VALUES (?,?,?);";
          connection.query(
            query,
            [id_parent_publication, reaction, user_id],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
            }
          );
        }
      });
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  // GET ALL REACTIONS  ------------------

  async getAllReactionsData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = `
    SELECT
        id_parent_publication, 
        sum(CASE WHEN reaction LIKE 'heart' THEN 1 ELSE 0 END) hearts, 
        sum(CASE WHEN reaction LIKE 'smile' THEN 1 ELSE 0 END) smiles, 
        sum(CASE WHEN reaction LIKE 'laugh' THEN 1 ELSE 0 END) laughs 
        FROM reactions
        GROUP BY id_parent_publication 
        ORDER BY id_parent_publication `;
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  async getUserReactionsData(id_user) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = `
    SELECT
    id_parent_publication, id_user, 
    sum(CASE WHEN reaction LIKE 'heart' THEN 1 ELSE 0 END) hearts, 
    sum(CASE WHEN reaction LIKE 'smile' THEN 1 ELSE 0 END) smiles, 
    sum(CASE WHEN reaction LIKE 'laugh' THEN 1 ELSE 0 END) laughs 
    FROM reactions
    WHERE id_user=? 
    GROUP BY id_parent_publication 
    ORDER BY id_parent_publication
    `;
        connection.query(query, id_user, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log("dbservice : " + error);
    }
  }

  /*"DELETE FROM reactions WHERE id = ?"*/
  async deleteReaction(
    reaction,
    id_parent_publication,
    heart,
    smile,
    laugh,
    id_user
  ) {
    try {
      const response = await new Promise((resolve, reject) => {
        if (reaction === "heart") {
          //console.log("delete heart ?");
          const query =
            "DELETE FROM reactions WHERE id_parent_publication=? AND id_user=? AND reaction = 'heart';";
          connection.query(
            query,
            [id_parent_publication, id_user],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.affectedRows);
            }
          );
        } else if (reaction === "smile") {
          //console.log("delete smile ?");
          const query =
            "DELETE FROM reactions WHERE id_parent_publication=? AND id_user=? AND reaction = 'smile';";
          connection.query(
            query,
            [id_parent_publication, id_user],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.affectedRows);
            }
          );
        } else if (reaction === "laugh") {
          //console.log("delete laugh ?");
          const query =
            "DELETE FROM reactions WHERE id_parent_publication=? AND id_user=? AND reaction = 'laugh';";
          connection.query(
            query,
            [id_parent_publication, id_user],
            (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.affectedRows);
            }
          );
        }
      });
      /* affectedRows permet de renvoyer true si des lignes ont été suppr de mysql*/
      return response === 1 ? true : false;
    } catch (error) {
      console.log("dbservice : " + error);
      return false;
    }
  }

  // DELETE PUBLICATION WHERE id = ?
  async deletePublicationData(id, user_id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM publications WHERE id_publication =? ";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      /* affectedRows permet de renvoyer true si des lignes ont été suppr de mysql*/
      return response === 1 ? true : false;
    } catch (error) {
      console.log("dbservice : " + error);
      return false;
    }
  }

}

module.exports = DbService;
