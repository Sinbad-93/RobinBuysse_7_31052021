
//brouillon
//VOIR SI POSSIBLE DE DIVISER LA LOGIQUE

/*SELECT * FROM TABLE*/
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


/*INSERT INTO names (name, date_added) VALUES (?,?)*/
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