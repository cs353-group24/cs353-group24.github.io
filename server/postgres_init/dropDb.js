// Imports

const { Client } = require('pg');
const fs = require('fs');

//__dirname is important
//sql queries toString
const sql_init = fs.readFileSync(__dirname + '/init.sql').toString();
const sql_pop= fs.readFileSync(__dirname + '/populate.sql').toString();
const sql_drop = fs.readFileSync(__dirname + '/dropTables.sql').toString();
// console.log(sql_init);


//database connection
const client = new Client({
    host: "163.172.25.36",
    port: 5432,
    user: "mohi",
    password: "mohimohi",
    database: "hm"
})

client.on("connect", () =>{
    console.log("Database connection established.")
})
client.connect();


//query to database functions
/*
client.query(sql_init, (err, res ) => {
    if(err){ throw err;}
});
*/


client.query(sql_drop, (err, res ) => {
    if(err){ throw err;}
});

/*
client.query(sql_pop, (err, res ) => {
    if(err){ throw err;}
});
*/
