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

//add triggers to database

/*
const patientRouter = require('./routes/patientRoute.js');
app.use('/patient', patientRouter);
*/
// for login national_id and password are used
app.post('/login1', (req,res,next)=>{
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

app.post('/login2', (req,res,next)=>{
    let q = 'SELECT * FROM person WHERE national_id=$1'
    let params =   [req.body.national_id]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.send(error);
        }
        else{
            return res.status(200).send(result.rows[0])
        }
    });
});


//ask how to add national_id too

app.get('/logout', (req, res)=>{
    res.redirect('/');
});

//sign up

//also two page split up
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



//patient routes
// /patient/:id/...


//order by date

// ask what info is necessary in the json
//homepage all patient apointments
app.get('/patient/:id/homepage', (req, res) =>{
    let q = ` SELECT tracking_number, date
            FROM appointment 
            WHERE appointment.patient_id = $1; `

    let params = Object.values(req.params)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })

})


//appointments
app.get('/patient/:id/appointment', (req,res)=>{

    let q = ` SELECT tracking_number, date
            FROM appointment 
            WHERE appointment.patient_id = $1; `

    let params = Object.values(req.params)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })


})


// how to do edit
app.post('/patient/:id/appointment/edit', (req,res)=>{

    let q = ` SELECT tracking_number, date, status
            FROM appointment 
            WHERE appointment.patient_id = $1; `

    let params = Object.values(req.params)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })

})


//appointment cancel
app.post('/patient/:id/appointment/cancel', (req,res)=>{

    let q = ` DELETE FROM appointment WHERE appointment.tracking_number = $1;`

    let params = Object.values(req.params) // will get id
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "cancelation error"})
        }
        return res.status(200).send({"message": "canceled successfully"})
    })


})


//new appointment
app.post('/patient/:id/appointment/newappointment', (req,res)=>{

    let q = ` INSERT INTO appointment (tracking_number, date,  patient_id, doctor_id) VALUES
               ($1, $2,  $3, $4); `

    let params1 = Object.values(req.params) // will give national id
    let params2 = Object.values(req.body) //

    client.query(q, params2.splice(2,0,params1), (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })


})

//new appointment get departments
app.get('/patient/:id/appointment/newappointment/departments', (req,res)=>{

    let q = ` SELECT name FROM department;  `
    // let params = Object.values(req.body)

    client.query(q,  (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no department found"})
        }
        return res.status(200).send(result.rows)
    })


})


//department value will be passed by the client side
//new appointment get doctor
app.get('/patient/:id/appointment/newappointment/doctor', (req,res)=>{

    let q = ` SELECT *

              FROM doctor, person

              WHERE department = $1 AND person.national_id = doctor.national_id;  `

    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no doctor"})
        }
        return res.status(200).send(result.rows)
    })


})


//time will be implemented according to the feedback
/*
app.post('/patient/:id/appointment/newappointment/time', (req,res)=>{

    let q = ` INSERT INTO appointment (tracking_number, date,  patient_id, doctor_id) VALUES
               ($1, $2,  $3, $4) `

    let params1 = Object.values(req.params)
    let params2 = Object.values(req.body)

    client.query(q, params1.splice(2,0,params2), (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })


})
*/


//add routes for necessary operations as well


//doctor routes

// /doctor/:id/...


//list all the appointments for the entire month
app.get('/doctor/:id/homepage', (req,res)=>{
    let q = ` SELECT *
               FROM appointment
                WHERE doctor_id = $1 and EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM current_date);`
    let params = Object.values(req.params)
    console.log(params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })
})




//manage days of -> need database changes
//add off day

app.get('/doctor/:id/off_days', (req,res)=>{

    let q = ` SELECT *
              FROM doctor_off_days
              WHERE doctor_id = $1 ;  `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })
})


app.post('/doctor/:id/create_off_days', (req,res)=>{

    let q = `INSERT INTO doctor_off_days (doctor_id, date ) VALUES ($1, $2); `

    let params1 = Object.values(req.body) //date
    let params2 = Object.values(req.params) //id
    let params = params2.concat(params1)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})
//write sysptoms


//ask for tests -> will be ssigned to a random lab technician


//diagnose the patient





//laboratorian routes




//pharmacist routes




//admin routes