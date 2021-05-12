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
            return res.sendStatus(404).send(err);
        }
        else{
            // res.send(result);
           // console.log(JSON.parse(JSON.stringify(result)))
            if(result.rows[0].password.toString() === params.password.toString()){
                return res.sendStatus(200).send(result.rows[0])
            }
            else{
                return res.sendStatus(404).send(err)
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
            return res.sendStatus(404).send(err);
        }
        else{
            return res.sendStatus(200).send(result.rows[0])
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
    let params = [re.national_id,re.name,re.surname, re.email, re.password, 'patient', re.phone, re.birthday]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"message": "insertion successful"})
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
    let q = `SELECT a.appointment_id, p.name, p.surname, a.date, d.department
             FROM appointment as  a, doctor as d, person as p
             WHERE a.patient_id = $1 and d.national_id = p.national_id and d.national_id = a.doctor_id and a.status = 'upcoming'
             ORDER BY  date DESC ; `

    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
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
app.get('/patient/:id/appointments', (req,res)=>{

    let q = ` SELECT a.appointment_id, p.name, p.surname, a.date, d.department, a.status
              FROM appointment as  a, doctor as d, person as p
              WHERE a.patient_id = $1 and d.national_id = p.national_id and d.national_id = a.doctor_id 
              ORDER BY  date DESC ; `

    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
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

    let person_q = ` DELETE FROM appointment WHERE appointment_id = $1;`

    let params = Object.values(req.params) // will get id

    client.query(person_q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        else {
            return res.sendStatus(200).send({"message": "deleted successfully"})
        }
    })
})


//new appointment

/*
/patient/:id/appointment/newappointment:
/patient/$/appointment/newappointment
    {
        "date": "$",
        "doctor_id": "$"

    }
    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.post('/patient/:id/appointment/newappointment', (req,res)=>{

    let q = ` INSERT INTO appointment ( date,  patient_id, doctor_id) VALUES
               ( $1,  $2, $3); `

    let params1 = req.params // will give national id
    let params2 = req.body
    let params = [ params2.date, params1, params2.doctor_id]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
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
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
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

    let q = ` SELECT national_id, name, surname FROM person NATURAL JOIN doctor WHERE department = $1;  `

    let params = Object.values(req.body)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })


})
// /patient/:id/prescriptions
// /patient/:id/tests
// /patient/:id/diagnosis ?

//doctor routes

// /doctor/:id/...


//list all the appointments for the entire month

/*
    /doctor/:id/homepage
   /doctor/:$/homepage
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

// returns appointment_id, save it and then give it as a parameter in the following three requests as aid.
app.get('/doctor/:id/homepage', (req,res)=>{
    let q = ` SELECT appointment_id, P.name, P.surname, date
               FROM appointment, person as P 
                WHERE doctor_id = $1 and EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM current_date)
                and P.national_id = patient_id and status = 'upcoming'
                ORDER BY date DESC ;`
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
})


//manage days off -> need database changes
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
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
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
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"message":"successful insertion"})
    })
})

/*
/doctor/:id/make_diagnosis
    {
        "appointment_id" : "$",
        "disease_name": "$",
        "description":"$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
//Make diagnosis
app.post('/doctor/:id/make_diagnosis', (req,res)=>{

    let q = `INSERT INTO diagnosis (appointment_id, disease_name, description) VALUES ($1, $2, $3)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"message":"successful insertion"})
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
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
})



// laboratorian will be selected randomly a routed needed to pass required laboratorian types ???
//ask for tests -> will be ssigned to a random lab technician


/*
/doctor/:id/ask_for_tests
    {
        "appointment_id" : "$",
        "laboratorian_id": "$",
        "test_name": "$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.post('/doctor/:id/ask_for_tests',(req,res)=>{
    let q = `INSERT INTO test_assigned_to (appointment_id, laboratorian_id, test_nam) 
VALUES ($1, $2, $3) `
    let par = req.body
    let params = [par.appointment_id, par.laboratorian_id, par.test_name]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"message":"successful insertion"})
    })


})


/*
/doctor/:id/get_disease_names
no info required
 */
app.get('/doctor/:id/get_disease_names', (req,res)=>{
    let q = `SELECT * FROM diseases `
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
})


/*
/doctor/:id/insert_patient_symptoms
    {
        "appointment_id" : "$",
        "symptom_name": "$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.post('/doctor/:id/insert_patient_symptoms', (req,res)=>{
let q = `INSERT INTO patient_symptoms (appointment_id, symptom_name) VALUES ($1, $2)`

    let params = Object.values(req.body)
    client.query(q, params, (err,result)=>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"message":"successful insertion"})
    })
})




//laboratorian routes

/*
    /laboratorian/:id/homepage:
    /laboratorian/$/homepage
 */
app.get('/laboratorian/:id/homepage', (req,res)=>{

    let q = `SELECT *
             FROM test_assigned_to ta NATURAL JOIN test_result tr
             WHERE laboratorian_id = $1 and test_status = 'assigned' 
             and EXTRACT(MONTH FROM ta.date) = EXTRACT(MONTH FROM current_date)
             and ta.date >= current_date;  `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
} )

/*
    /laboratorian/:id/get_tests:
    /laboratorian/$/get_tests
 */
app.get('/laboratorian/:id/get_tests', (req,res)=>{

    let q = `SELECT *
             FROM test_assigned_to NATURAL JOIN test_result
             WHERE laboratorian_id = $1;  `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
} )

/*
    /laboratorian/:id/get_spec_comps:
    /laboratorian/$/get_spec_comps
    {
        "result_id" : "$"
    }
 */
app.get('/laboratorian/:id/get_spec_comps', (req,res)=>{
    let q = `SELECT *
             FROM test_result NATURAL JOIN comp_result
             WHERE result_id = $1;  `

    let params = Object.values(req.body)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
} )

//get components with result_id
app.get('/laboratorian/:id/get_all_comp', (req,res)=>{
    let q = 'SELECT * FROM test_assigned_to NATURAL JOIN test_result NATURAL JOIN comp_result WHERE laboratorian_id = $1;'
    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send(result.rows)
    })
})

/*
    /laboratorian/:id/post_spec_comps:
    /laboratorian/$/post_spec_comps
    {
        "result_id" : "$",
        "comp_name" : "$",
        "comp_value": "$",
        "comp_result" : "$",
        "comp_status" : "$"
    }
 */
app.post('/laboratorian/:id/post_spec_comps', (req,res)=>{
    let q = `UPDATE comp_result
             SET  comp_value = $1, comp_result = $2, comp_status = $3
             WHERE result_id = $4 and comp_name = $5;  `

    let re = req.body
    let params = [re.comp_value, re.comp_result, re.comp_status, re.result_id, re.comp_name]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.sendStatus(404).send(err)
        }
        return res.sendStatus(200).send({"MESSAGE" : "successfull"})
    })
} )


//pharmacist routes




//admin routes


/*
/admin/add_staff
    {
        "national_id" : "$",
        "person_type" : "$",
        "email" : "$",
        "password" : "$",
        "name" : "$",
        "surname" : "$",
        "phone" : "$",
        "birthday" : "$",
        "room_no" : "$"     // optional
        "department": "$"   // optional
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.post('/admin/add_staff', (req,res)=>{
    let q = `INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8);`
    let re = req.body
    let params = [re.national_id,re.name,re.surname, re.email, re.password, re.person_type, re.phone, re.birthday]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.sendStatus(404).send(err);
        }
        else {
            if (re.person_type === 'doctor') {
                q = `INSERT INTO doctor (national_id, room_no, department)
                          VALUES ($1, $2, $3);`
                params = [re.national_id, re.room_no, re.department]
            } else if (re.person_type === 'pharmacist') {
                q = `INSERT INTO pharmacist (national_id)
                          VALUES ($1)`
                params = [re.national_id]
            } else if (re.person_type === 'laboratorian') {
                q = `INSERT INTO laboratorian (national_id, department)
                          VALUES ($1, $2);`
                params = [re.national_id, re.department]
            } else {
                return res.send({"message": "invalid person type"})
            }
            client.query(q, params, (err, result) => {
                if (err) {
                    return res.sendStatus(404).send(err);
                }
                return res.sendStatus(200).send({"message": "insertion successful"})
            });
        }
    });
})