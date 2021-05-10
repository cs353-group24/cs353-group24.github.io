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
            console.log("hi");
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
// for login national_id and email + password are used

    /*
       /login_first:
        required info:
        {
            "email": "$",
            "password": "$"
        }
        $ is the required info(s) that will provided by client side,
        naming conventions presented above should be followed
     */

app.post('/login_first', (req,res,next)=>{
    let q = 'SELECT * FROM person WHERE email=$1'
    let params =   req.body

    client.query(q, [params.email],(err, result)=>{
        if (err){
            return res.send(error);
        }
        else{
            // res.send(result);
           // console.log(JSON.parse(JSON.stringify(result)))
            if(result.rows[0].password.toString() === params.password.toString()){
                return res.status(200).send(result.rows[0])
            }
            else{
                return res.status(404).send('Not found')
            }
        }
    });
});

/*
    /login_second:
     required info:
     {
        "national_id": "$"
     }
     $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
  */



app.post('/login_second', (req,res,next)=>{
    let q = 'SELECT * FROM person WHERE national_id=$1'
    let params =   req.body

    client.query(q, [params.national_id],(err, result)=>{
        if (err){
            return res.send(error);
        }
        else{
            return res.status(200).send(result.rows[0])
        }
    });
});


/*
    /logout
    no info required
 */
//ask how to add national_id too

app.get('/logout', (req, res)=>{
    res.redirect('/');
});





//sign up



//also two page split up ??

/*
/signup
    {
        "national_id": "$",
        "name": "$",
        "surname": "$",
        "email": "$",
        "password": "$",
        "person_type": "$",
        "phone": "$",
        "birthday": "$"
    }
    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.post('/signup', (req,res)=>{
    let q = `INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8);`
    let re = req.body
    let params = [re.national_id,re.name,re.surname, re.email, re.password, re.person_type, re.phone, re.birthday]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.send(error).send({"message": "insertion unsuccessful"});
        }
        return res.status(200).send({"message": "insertion successful"})
    });
})


/* -----------------------------------------------------------------------------------------------------
    /user_type/:id
    the id will be passed by the client side always when calling these type of routes
----------------------------------------------------------------------------------------------------- */

//order by date


/*
    /patient/:id/homepage :
        /patient/$/homepage :
        info required is the id it will be passed on the URL

    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.get('/patient/:id/homepage', (req, res) =>{
    let q = ` SELECT appointment_id, date
            FROM appointment 
            WHERE appointment.patient_id = $1 
            ORDER BY  date DESC ; `

    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })

})


//appointments
/*
    /patient/:id/appointments :
        /patient/$/appointments :
        info required is the id it will be passed on the URL

    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.get('/patient/:id/appointment', (req,res)=>{

    let q = ` SELECT appointment_id, date
            FROM appointment 
            WHERE appointment.patient_id = $1; `

    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })


})


//appointments
/*
    /patient/:id/appointments :
        /patient/$/appointments :
        info required is the id it will be passed on the URL

    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

//appointment cancel
app.post('/patient/:id/appointment/cancel', (req,res)=>{

    let q = ` DELETE FROM appointment WHERE appointment.appointment_id = $1;`

    let params = Object.values(req.body) // will get id

    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "cancelation error"})
        }
        return res.status(200).send({"message": "deleted successfully"})
    })


})


//new appointment

/*
/patient/:id/appointment/newappointment:
/patient/$/appointment/newappointment
    {
        "appointment_id": "$",
        "date": "$",
        "doctor_id": "$"

    }
    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.post('/patient/:id/appointment/newappointment', (req,res)=>{

    let q = ` INSERT INTO appointment (appointment_id, date,  patient_id, doctor_id) VALUES
               ($1, $2,  $3, $4); `

    let params1 = req.params // will give national id
    let params2 = req.body //
    let params = [params1.appointment_id, params1.date, req.params, params2.doctor_id]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no appointment found"})
        }
        return res.status(200).send(result.rows)
    })


})

/*
    no info needed
 */
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

/*
    /patient/:id/appointment/newappointment/doctor
    {
        "department":"$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

//department value will be passed by the client side
//new appointment get doctor
app.get('/patient/:id/appointment/newappointment/doctor', (req,res)=>{

    let q = ` SELECT *

              FROM doctor

              WHERE department = $1 ;  `

    let params = Object.values(req.body)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.send(error).send({"message": "no doctor"})
        }
        return res.status(200).send(result.rows)
    })


})




//doctor routes

// /doctor/:id/...


//list all the appointments for the entire month

/*
    /doctor/:id/homepage
   /doctor/:$/homepage
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.get('/doctor/:id/homepage', (req,res)=>{
    let q = ` SELECT *
               FROM appointment
                WHERE doctor_id = $1 and EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM current_date)
                ORDER BY date DESC ;`
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

/*
    /doctor/:id/off_days
   /doctor/:$/off_days
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

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

/*
    /doctor/:id/create_off_days
   /doctor/:$/create_off_days

    {
        "date": "$"
    }

       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.post('/doctor/:id/create_off_days', (req,res)=>{

    let q = `INSERT INTO doctor_off_days (doctor_id, date ) VALUES ($1, $2); `

    let params1 = req.body //date
    let params2 = req.params //id
    let params = [params1, params2]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/doctor/:id/make_diagnosis
    {
        "apt_tracking_no" : "$",
        "disease_name": "$",
        "description":"$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
//Make diagnosis
app.post('/doctor/:id/make_diagnosis', (req,res)=>{

    let q = `INSERT INTO diagnosis (apt_tracking_no, disease_name, description) VALUES ($1, $2, $3)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/doctor/:id/get_test_types
no info required
 */
app.get('/doctor/:id/get_test_types',(req,res)=>{
    let q = ` SELECT * FROM test  `
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send(result.rows)
    })
})


//how doctor will ask tests ??
//apt_tracking no and testname should be selected
// laboratorian will be selected randomly a routed needed to pass required laboratorian types ???
//ask for tests -> will be ssigned to a random lab technician
app.post('/doctor/:id/ask_for_tests',(req,res)=>{



})


/*
/doctor/:id/get_disease_names
no info required
 */
app.get('/doctor/:id/get_disease_names', (req,res)=>{
    let q = `SELECT * FROM diseases `
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send(result.rows)
    })
})


/*
/doctor/:id/insert_patient_symptoms
    {
        "apt_tracking_no" : "$",
        "symptom_name": "$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.post('/doctor/:id/insert_patient_symptoms', (req,res)=>{
let q = `INSERT INTO patient_symptoms (apt_tracking_no, symptom_name) VALUES ($1, $2)`

    let params = Object.values(req.body)
    client.query(q, params, (err,result)=>{
        if(err){
            return res.sendStatus(401)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})








//laboratorian routes




//pharmacist routes




//admin routes