const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
let instance = null;
dotenv.config();
/*CONFIGURER L'ACCES A LA BASE DE DONNEES MYSQL */
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});
/* lancer la connection, et gerer les erreurs de connection*/
connection.connect((err) => {
    if (err) {console.log(err.message);}
    
    console.log('db ' + connection.state);});

class DbService {
/*permet de creer des demandes uniques à chaque fois ? */
static getDbServiceInstance() {return instance ? instance : new DbService();}

//---------------------USERS DATA-----------------------------

// INSCRIPTION -------------------------------
async insertNewUser(name, familly_name, email, password) {
    try {const datetime = new Date();
    response = await new Promise((resolve, reject) => {
    const query = "INSERT INTO user (name, familly_name, email, password, datetime) VALUES (?,?,?,?,?);";
    connection.query(query, [name, familly_name, email, password, datetime] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    }}

// CONNEXION -------------------------------
async getUserLogin(email, pass) {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM user WHERE email=?;";
    connection.query(query, [email], (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    return response
      ;}  
    catch (error) {
        console.log('dbservice : ' + error);
        }}

// GET ONE USER
async getOneUser(id) {
    //console.log(id);
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT name, familly_name, email FROM user WHERE iduser=?; ";
    connection.query(query, [id], (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}

// GET ALL USERS
async getAllUsers() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT name, familly_name, iduser FROM user ";
    connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }};

  //  INSERT PROFILE PHOTO
  
  async insertProfilePhoto(post) {
    try {
        console.log(post.id);
        console.log(post.imageUrl);
    const response = await new Promise((resolve, reject) => {
    const query = "UPDATE user SET photo=? WHERE iduser=? ;";
    connection.query(query, [post.imageUrl,post.id] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return  response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    }}


//-------------------------------PUBLICATIONS DATA-----------------------------
  // PUBLICATION insertPublication

  async insertPublication(post) {
    try {var dateAdded = new Date();
    var options = {weekday: "long", year: "numeric", month: "long", 
    day: "2-digit", hour: '2-digit', minute:'2-digit'};
    dateAdded = dateAdded.toLocaleDateString("fr-FR", options);
    const response = await new Promise((resolve, reject) => {
    const query = "INSERT INTO publications (publication_user_id, publication_title, publication_media, date_added) VALUES (?,?,?,?);";
    connection.query(query, [post.user_id, post.title, post.imageUrl, dateAdded] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return  response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    }}

// GET ALL PUBLICATIONS ------------------

/*SELECT * FROM TABLE*/
async getAllPublicationsData() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM publications LEFT JOIN user ON publications.publication_user_id = user.iduser; ";
    connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}

  // POST insert COMMENT AND ANSWER

  async insertCommentAndAnswer(parent_id,user_id, comment, answer) {
    try {var date_posted = new Date();
    var options = {weekday: "long", year: "numeric", month: "long", 
    day: "2-digit", hour: '2-digit', minute:'2-digit'};
    date_posted = date_posted.toLocaleDateString("fr-FR", options);
    const response = await new Promise((resolve, reject) => {
    const query = "INSERT INTO comment_and_answer (parent_id,user_id, comment, answer, date_posted) VALUES (?,?,?,?,?);";
    connection.query(query, [parent_id, user_id, comment, answer, date_posted] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return  response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    }}

// GET ALL COMMENT  ------------------

async getAllCommentsData() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM comment_and_answer LEFT JOIN user ON comment_and_answer.user_id = user.iduser WHERE comment !='none' ";
    connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}   
        
// GET ALL ANSWERS  ------------------        

async getAllAnswersData() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM comment_and_answer LEFT JOIN user ON comment_and_answer.user_id = user.iduser WHERE answer !='none' ";
    connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}   

// POST REACTIONS  ------------------     
async insertReaction(reaction, id_parent_publication,heart, smile, laugh, id_user) {
    try {
        const response = await new Promise((resolve, reject) => {
    if (reaction === 'heart'){
        const query = "INSERT INTO reactions (id_parent_publication,heart, id_user) VALUES (?,?,?);";
        connection.query(query, [id_parent_publication,heart, id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);})
    }
    else if ( reaction === 'smile'){
        const query = "INSERT INTO reactions (id_parent_publication, smile, id_user) VALUES (?,?,?);";
        connection.query(query, [id_parent_publication, smile, id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);})
    }
    else if ( reaction === 'laugh'){
        const query = "INSERT INTO reactions (id_parent_publication,laugh, id_user) VALUES (?,?,?);";
        connection.query(query, [id_parent_publication,laugh, id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);})
    }
    
    
  
});
    return  response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    }}

// GET ALL REACTIONS  ------------------        

async getAllReactionsData() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM reactions";
    connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response); 
    return response;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}   
    
/*"DELETE FROM names WHERE id = ?"*/
async deleteReaction(reaction, id_parent_publication,heart, smile, laugh, id_user) {
    try {
        const response = await new Promise((resolve, reject) => {
    if (reaction === 'heart'){
        console.log('delete heart ?');
        const query = "DELETE FROM reactions where id_parent_publication=? AND id_user=? AND heart =1;";
        connection.query(query, [id_parent_publication,id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result.affectedRows);})
    }
    else if ( reaction === 'smile'){
        console.log('delete smile ?');
        const query = "DELETE FROM reactions where id_parent_publication=? AND id_user=? AND smile =1;";
        connection.query(query, [id_parent_publication,id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result.affectedRows);})
    }
    else if ( reaction === 'laugh'){
        console.log('delete laugh ?');
        const query = "DELETE FROM reactions where id_parent_publication=? AND id_user=? AND laugh =1;";
        connection.query(query, [id_parent_publication,id_user] , (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result.affectedRows);})
    }
});
/* affectedRows permet de renvoyer true si des lignes ont été suppr de mysql*/
    return response === 1 ? true : false;} 
    catch (error) {
        console.log('dbservice : ' + error); 
        return false;}}



// BROUILLON -------------------------------
/*SELECT * FROM TABLE*/
async getAllData() {
try {const response = await new Promise((resolve, reject) => {
const query = "SELECT * FROM user;";connection.query(query, (err, results) => {
if (err) reject(new Error(err.message));
resolve(results);})});
// console.log(response);
return response;} 

catch (error) {
    console.log('dbservice : ' + error); 
    }}

/*SELECT * FROM TABLE*/
async getAllReserve() {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT * FROM rendez_vous;";connection.query(query, (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response);
    return response;} 
    
    catch (error) {
        console.log('dbservice : ' + error); 
        }}

/*SELECT * FROM TABLE*/
async getMyRdv(userGet) {
    try {const response = await new Promise((resolve, reject) => {
    const query = "SELECT rdv_date FROM rendez_vous WHERE publications=?;";
    connection.query(query, [userGet], (err, results) => {
    if (err) reject(new Error(err.message));
    resolve(results);})});
    // console.log(response);
    return response;} 
    
    catch (error) {
        console.log('dbservice : ' + error); 
        }}


/* reservation */
async insertReserve(rdv_date, publications) {
    try {const dateAdded = new Date();
    const response = await new Promise((resolve, reject) => {
    const query = "INSERT INTO rendez_vous (rdv_date, publications) VALUES (?,?);";
    connection.query(query, [rdv_date, publications] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return {
    id_rendez_vous : response,
    rdv_date : rdv_date,
    publications : publications};} 
    catch (error) {
        console.log('dbservice : ' + error); 
        }}

}

module.exports = DbService;