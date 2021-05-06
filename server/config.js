const express = require('express');
const {Client} = require('pg');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())
let server = require('http').Server(app);

let port = (process.env.PORT || 8079);
server.listen(port, () => console.log('listening on port ' + port));

// home router
app.get('/', function(req, res){
    let q = `SELECT * FROM trial`
    client.query( q, (err, result) =>{
        if(err){
            console.log(err);
            return;
        }else {
            res.send(result);
        }
    })
});

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

//-------------------- ROUTES-------------------//
/*
const patientRouter = require('./routes/patientRoute.js');
app.use('/patient', patientRouter);
*/
