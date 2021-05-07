const express = require('express');
const {Client} = require('pg');
const bodyParser = require('body-parser');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
let server = require('http').Server(app);

let port = (process.env.PORT || 8079);
server.listen(port, () => console.log('listening on port ' + port));

// home router

app.get('/', function(req, res){
    let q = `SELECT * FROM person`
    client.query( q, (err, result) =>{
        if(err){
            res.send(err);
            console.log("safafgag");
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
// for login national_id and password are used
app.post('/login', (req,res,next)=>{
    let q = 'SELECT * FROM person WHERE email=$1'
    let params =   [req.body.email]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.send(error);
        }
        else{
            // res.send(result);
           // console.log(JSON.parse(JSON.stringify(result)))
            if(result.rows[0].password.toString() === req.body.password.toString()){
                return res.status(200).send(result.rows[0])
            }
            else{
                return res.status(404).send('Not found')
            }
        }
    });
});

app.get('/logout', (req, res)=>{
    res.redirect('/');
});

//sign up

app.post('/signup', (req,res)=>{
    let q = `INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8);`
    let params = Object.values(req.body)
    console.log(params)
    client.query(q, params,(err, result)=>{
        if (err){
            return res.send(error).send({"message": "insertion unsuccessful"});
        }
        return res.status(200).send({"message": "insertion successful"})
    });
})

