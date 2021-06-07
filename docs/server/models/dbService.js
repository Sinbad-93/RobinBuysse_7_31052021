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

// INSCRIPTION -------------------------------
async insertNewUser(name, familly_name, email, password) {
    try {const dateAdded = new Date();
    const response = await new Promise((resolve, reject) => {
    const query = "INSERT INTO user (name, familly_name, email, password, date_added) VALUES (?,?,?,?,?);";
    connection.query(query, [name, familly_name, email, password, dateAdded] , (err, result) => {
    if (err) reject(new Error(err.message));
    resolve(result);})});
    return  response;} 
    catch (error) {
    console.log('dbservice : ' + error);
    response.status(400);
    //return error.message;
        // a tenté de renvoyer au front, ne fonctionne pas 
        //res.status(400).send({error: 'This email account is already in use.'})
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

/*"DELETE FROM names WHERE id = ?"*/
async deleteRdv(rdv_date) {
try { const response = await new Promise((resolve, reject) => {
const query = "DELETE FROM rendez_vous WHERE rdv_date = ?";
connection.query(query, [rdv_date] , (err, result) => {
if (err) reject(new Error(err.message));
resolve(result.affectedRows);})});/* affectedRows permet de renvoyer true si des lignes ont été suppr de mysql*/
return response === 1 ? true : false;} 

catch (error) {
    console.log('dbservice : ' + error); 
    return false;}}}

module.exports = DbService;