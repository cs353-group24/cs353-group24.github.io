const express = require('express');
const {Client} = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors())

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


//req.params
// for get use req.query
// for post use req.body
//-------------------------------------------- ROUTES-------------------------------------------------//

// home router

app.get('/', function(req, res){
    let q = `SELECT * FROM person;`
    client.query( q, (err, result) =>{
        if(err){
            res.send(err);
            return;
        }else {

            res.send(result);
        }
    })
    client.query( q, (err, result) =>{
        if(err){
            res.send(err);
            return;
        }else {

            res.send(result);
        }
    })
});

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

app.get('/login_first', (req,res,next)=>{
    let q = 'SELECT TO_CHAR(birthday,\'YYYY-MM-DD\' ) as birthday_to_char, * FROM person WHERE email=$1'
    let params = req.query

    client.query(q, [params.email],(err, result)=>{
        if (err){
            return res.status(404).send(err);
        }
        else{
            if (result.rows.length === 0){
                return res.status(403).send(err)
            } else {
                if(result.rows[0].password.toString() === params.password.toString()){
                    return res.status(200).send(result.rows[0])
                }
                else{
                    return res.status(402).send(err)
                }
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



app.get('/login_second', (req,res,next)=>{
    let q = 'SELECT TO_CHAR(birthday,\'YYYY-MM-DD\' ) as birthday_to_char, * FROM person WHERE national_id=$1'
    let params =   req.query
    console.log(params)

    client.query(q, [params.national_id],(err, result)=>{
        if (err){
            return res.status(404).send(err);
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
        ($1, $2, $3, $4, $5, $6, $7, to_date($8, 'YYYY-MM-DD') );`
    let re = req.body
    let params = [re.national_id,re.name,re.surname, re.email, re.password, 'patient', re.phone, re.birthday]

    client.query(q, params,(err, result)=>{
        if (err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message": "insertion successful"})
    });
})

//--------------------------------------------PATIENT ROUTES-------------------------------------------------//


/* -----------------------------------------------------------------------------------------------------
    /user_type/:id
    the id will be passed by the client side always when calling these type of routes
----------------------------------------------------------------------------------------------------- */

/*
    /patient/:id/homepage :
        /patient/$/homepage :
        info required is the id it will be passed on the URL

    $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.get('/patient/:id/homepage', (req, res) =>{
    let q = `SELECT a.appointment_id, p.name, p.surname, TO_CHAR(a.date,'YYYY-MM-DD' ) as date, d.department, a.status
             FROM appointment as  a, doctor as d, person as p
             WHERE a.patient_id = $1 and d.national_id = p.national_id and d.national_id = a.doctor_id and a.status = 'upcoming'
             ORDER BY  date ASC ; `

    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
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
app.get('/patient/:id/appointments', (req,res)=>{

    let q = ` SELECT a.appointment_id, p.name, p.surname, to_char(a.date, 'YYYY-MM-DD') as date, d.department, a.status
              FROM appointment as  a, doctor as d, person as p
              WHERE a.patient_id = $1 and d.national_id = p.national_id and d.national_id = a.doctor_id
              ORDER BY  date DESC ; `

    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
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

    let person_q = ` DELETE FROM appointment WHERE appointment_id = $1;`

    let params = Object.values(req.params) // will get id

    client.query(person_q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        else {
            return res.status(200).send({"message": "deleted successfully"})
        }
    })
})


/*
    edits an appoitnemnt
     {
        "date": "$",
        "doctor_id": "$",
        "appointment_id": "$"
    }
 */


app.post('/patient/:id/appointment/edit', (req,res)=>{

    let person_q = ` UPDATE  appointment 
                     SET date = to_date($1, 'YYYY-MM-DD'), doctor_id = $2 
                      WHERE appointment_id = $3  `

    let params = Object.values(req.body) // will get id

    client.query(person_q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        else {
            return res.status(200).send({"message": "edited successfully"})
        }
    })
})


app.post('/patient/:id/appointment/status', (req,res)=>{

    let person_q = ` UPDATE  appointment 
                     SET status = 'finalized' 
                      WHERE appointment_id = $1  `

    let params = Object.values(req.body) // will get id

    client.query(person_q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        else {
            return res.status(200).send({"message": "edited successfully"})
        }
    })
})

/*
    gives tests for a given appointment
     {
        "appointment_id": "$"
    }
 */

//appointment cancel
app.post('/patient/:id/appointment/cancel_appointment', (req,res)=>{

    let person_q = ` DELETE FROM appointment
                     WHERE appoitnment_id = $1`

    let params = Object.values(req.body) // will get id

    client.query(person_q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        else {
            return res.status(200).send({"message": "edited successfully"})
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

    let q = ` INSERT INTO appointment ( date, patient_id, doctor_id, status) VALUES
        ( to_date($1, 'YYYY-MM-DD'), $2, $3, $4); `

    let params1 = req.params // will give national id
    let params2 = req.body
    let params = [ params2.date, params1.id, params2.doctor_id, params2.status]

    console.log(params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message": "insertion successful"})
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
            return res.status(404).send(err)
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

    let q = ` SELECT national_id, name, surname FROM person NATURAL JOIN doctor WHERE department = $1;  `

    let params = Object.values(req.query)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

})

/*
    this function returns a patient to their all tests
    /patient/:id/see_all_tests:
        /patient/$/see_all_tests
      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.get('/patient/:id/see_all_tests', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, *
             FROM appointment AS a NATURAL JOIN test_result 
             WHERE patient_id = $1 ; `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
    this function returns a patient to their all test components
    /patient/:id/see_all_comps:
        /patient/$/see_all_comps
      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */
app.get('/patient/:id/see_all_comps', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, 
            to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM appointment AS a NATURAL JOIN test_result AS t NATURAL JOIN comp_result
             WHERE patient_id = $1 ; `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )


/*
     this function returns a patient to their test results for an appointment
      /patient/:id/see_app_tests:
        /patient/$/see_app_tests

        {
            "appointment_id":"$"
        }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.get('/patient/:id/see_app_tests', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, 
            to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM appointment AS a NATURAL JOIN test_result AS t
             WHERE patient_id = $1 and appointment_id = $2 ; `
    let params1 = req.params
    let params2 = req.query
    let params = [params1.id, params2.appointment_id]


    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )


/*
     this function returns a patient to their test results along with components for an appointment
      /patient/:id/see_app_comps:
        /patient/$/see_app_comps

        {
            "appointment_id":"$"
        }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.get('/patient/:id/see_app_comps', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, 
                to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM appointment AS a ,test_result AS t , comp_result AS c
             WHERE a.patient_id = $1 and a.appointment_id = $2 and a.appointment_id = t.appointment_id and t.result_id = c.result_id; `
    let params1 = req.params
    let params2 = req.query
    let params = [params1.id, params2.appointment_id]


    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
     this function returns a patient to their tests and components for an appointment
      /patient/:id/see_app_tests:
        /patient/$/see_app_tests

        {
            "appointment_id":"$",
            "test_name": "$"
        }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.get('/patient/:id/see_app_test_comps', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, 
                to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM appointment AS a NATURAL JOIN test_result AS t NATURAL JOIN comp_result
             WHERE patient_id = $1 and appointment_id = $2 and test_name = $3; `
    let params1 = req.params
    let params2 = req.query
    let params = [params1.id, params2.appointment_id, params2.test_name]


    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
      this function returns a patient to their tests components
      /patient/:id/see_test_comps:
        /patient/$/see_test_comps

        {
           "result_id": "$"
        }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.get('/patient/:id/see_test_comps', (req,res)=>{
    let q = `SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char, 
                to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM appointment AS a NATURAL JOIN test_result AS t NATURAL JOIN comp_result
             WHERE result_id = $1 ;`
    let params1 = req.query
    let params = [params1.result_id]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )


/*

      /patient/:id/see_app_tests:
        /patient/$/see_app_tests

        {
           "comp_name": "$"
        }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed

 */
app.get('/patient/:id/see_prev_test_comps', (req,res)=>{
    let q = `SELECT to_char(t.result_date, 'YYYY-MM-DD') as result_date, 
                a.appointment_id, c.result_id, c.comp_value, c.comp_result, c.comp_status, c.comp_name
             FROM appointment as a  NATURAL JOIN test_result as t NATURAL JOIN comp_result as c
             WHERE a.patient_id = $1 and c.comp_name = $2 `


    let params1 = req.params
    let params2 = req.query
    let params = [params1.id, params2.comp_name]


    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )


/*
    this function returns a patient to their all diagnoses
    /patient/:id/see_all_diag:
        /patient/$/see_all_diag
      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.get('/patient/:id/see_all_diag', (req,res)=>{
    let q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, *
             FROM appointment NATURAL JOIN diagnosis
             WHERE patient_id = $1 ; `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
    this function returns a patient to their diagnosis for a specific apointment
    /patient/:id/see_all_diag:
        /patient/$/see_all_diag

           {
            "appointment_id":"$"
            }

      $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.get('/patient/:id/see_app_diag', (req,res)=>{
    let q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, *
             FROM appointment NATURAL JOIN diagnosis
             WHERE patient_id = $1 and appointment_id = $2 ; `
    let params1 = req.params
    let params2 = req.query
    let params = [params1.id, params2.appointment_id]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

// /patient/:id/prescriptions
app.get('/patient/:id/see_all_presc', (req,res)=>{

    let q = ` SELECT to_char(a.date, 'YYYY-MM-DD') as date_to_char,
                     to_char(p.date, 'YYYY-MM-DD') as prescription_date_to_char, *
              FROM appointment a, prescribed_by pb, prescription p
              WHERE a.appointment_id = pb.appointment_id and pb.prescription_no = p.prescription_no
                and patient_id = $1`
    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

})


/*
    {
       "appointment_id":"$"
    }
 */
app.get('/patient/:id/see_presc', (req,res)=>{
    let q = ` SELECT to_char(p.date, 'YYYY-MM-DD') as prescription_date_to_char, *
              FROM  prescribed_by as pb, prescription p, prescribed_in pi, medicine m
              WHERE  p.prescription_no = pi.prescription_no and pi.med_name = m.name 
                and appointment_id = $1 and pb.prescription_no = p.prescription_no;`
    let params = Object.values(req.query)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })


})

/*
    {
        "appointment_id": "$"
    }
 */
app.get("/patient/:id/see_app_symp", (req,res)=>{
    let q = ` SELECT  ds.symptom_name as symptom_name, s.description as description
              FROM diagnosis d , symptom s, disease_symptoms ds
              where d.disease_name = ds.disease_name and s.name = ds.symptom_name and appointment_id = $1; `

    let params = Object.values(req.query)
    client.query(q, params, (err, result) =>{
        if(err){
            console.log(err)
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

})



//--------------------------------------------DOCTOR ROUTES-------------------------------------------------//

// /doctor/:id/...


// list all the appointments for the entire month

/*
    /doctor/:id/homepage
   /doctor/:$/homepage
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

// returns appointment_id, save it and then give it as a parameter in the following three requests as aid.
app.get('/doctor/:id/homepage', (req,res)=>{
    let q = ` SELECT appointment_id, P.name, P.surname, to_char(date, 'YYYY-MM-DD') as date, status
              FROM appointment, person as P
              WHERE doctor_id = $1
                and P.national_id = patient_id
              ORDER BY date DESC ;`
    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
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

    let q = ` SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, *
              FROM doctor_off_days
              WHERE doctor_id = $1 ;  `
    let params = Object.values(req.params)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
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

    let q = `INSERT INTO doctor_off_days (doctor_id, date ) VALUES ($1,to_date( $2, 'YYYY-MM-DD')); `

    let params1 = req.body //date
    let params2 = req.params //id
    let params = [params2.id, params1.date]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
    /doctor/:id/delete_off_days
   /doctor/:$/delete_off_days
    {
        "date": "$"
    }
       $ is the required info(s) that will provided by client side,
     naming conventions presented above should be followed
 */

app.post('/doctor/:id/delete_off_days', (req,res)=>{

    let q = `DELETE FROM doctor_off_days WHERE doctor_id = $1 AND date = to_date($2, 'YYYY-MM-DD'); `

    let params1 = req.body //date
    let params2 = req.params //id
    let params = [params2.id, params1.date]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"deletion successful"})
    })
})

/*
    /doctor/:id/:aid/see_patient_symptoms
    id: doctor_id, aid: appointment_id
 */
app.get('/doctor/:id/:aid/see_patient_symptoms', (req,res)=>{
    let q = `SELECT * FROM patient_symptoms NATURAL JOIN symptom WHERE appointment_id = $1 and symptom_name = name`
    let re = req.params
    let params = [re.aid]
    client.query(q, params, (err,result)=>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    see_all_symptom
    /*
    /doctor/:id/:aid/see_all_patient_symptoms
    id: doctor_id
 */
app.get('/doctor/:id/see_all_patient_symptoms', (req,res)=>{
    let q = `SELECT  symptom_name, description FROM appointment a, patient_symptoms p, symptom  s
             WHERE a.appointment_id = p.appointment_id and p.symptom_name = s.name and a.doctor_id = $1;`
    let re = req.params
    let params = [re.id]
    client.query(q, params, (err,result)=>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
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
            return res.status(404).send(err)
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
    client.query(q,  (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    /doctor/:id/get_laboratorians
    no info required
    returns all the laboratorians, choose one with same department in frontend
 */
app.get('/doctor/:id/get_laboratorians',(req,res)=>{
    let q = ` SELECT * FROM laboratorian NATURAL JOIN person; `
    client.query(q,  (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

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
    let q = `INSERT INTO test_assigned_to (appointment_id, laboratorian_id, test_name, date) 
            VALUES ($1, $2, $3, $4) `
    let par = req.body
    let params = [par.appointment_id, par.laboratorian_id, par.test_name, par.date]
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            console.log(err)
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
    /doctor/:id/:aid/see_tests
    id: doctor_id, aid: appointment_id
    save the result_id's and use them to see component results etc.
 */
app.get('/doctor/:id/:aid/see_tests', (req,res)=>{
    let q = ` SELECT to_char(tat.date, 'YYYY-MM-DD') as date_to_char, *
              FROM appointment a , test_result tr  , test_assigned_to tat, person p
              where a.appointment_id = tr.appointment_id and tr.appointment_id = tat.appointment_id
                and tr.test_name = tat.test_name and a.appointment_id = $1 and tat.laboratorian_id = p.national_id;`
    let re = req.params
    let params = [re.aid]
    console.log(re, params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    /doctor/:id/:aid/see_test_components
    {
        "result_id": "$"
    }
 */
app.get('/doctor/:id/:aid/see_test_components', (req,res)=>{
    let q = ` SELECT * FROM comp_result NATURAL JOIN component WHERE result_id = $1;`
    let re = req.query
    let params = [re.result_id]
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
/doctor/:id/get_disease_names
no info required
 */
app.get('/doctor/:id/get_disease_names', (req,res)=>{
    let q = `SELECT * FROM disease `
    client.query(q,  (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

app.get('/doctor/:id/get_symptom_names', (req,res)=>{
    let q = `SELECT * FROM symptom `
    client.query(q,  (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})


// see diagnosis for the given aid

/*
    /doctor/:id/homepage/:aid/see_diagnosis
    /doctor/$/homepage/$/see_diagnosis
     id: doctor_id, aid: appointment_id
*/

app.get('/doctor/:id/:aid/see_diagnosis', (req,res)=>{
    let q = ` SELECT *
              FROM diagnosis dg, disease d WHERE dg.appointment_id = $1 and dg.disease_name = d.name;`
    let re = req.params
    let params = [re.aid]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

app.get('/doctor/:id/:aid/see_diagnosis_desc', (req,res)=>{
    let q = ` SELECT DISTINCT description
              FROM diagnosis WHERE appointment_id = $1;`
    let re = req.params
    let params = [re.aid]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
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
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

// insert and delete prescriptions

/*
/doctor/:id/get_medicines
no info required
 */
app.get('/doctor/:id/get_medicines', (req,res)=>{
    let q = `SELECT * FROM medicine `
    client.query(q,  (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    /doctor/:id/get_prescription
    {
        "appointment_id" : "$"
    }
 */
app.get('/doctor/:id/get_prescription_no', (req,res)=>{

    let q = `SELECT precription_no FROM prescribed_by WHERE appointment_id = $1;`
    let params = Object.values(req.query)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})


/*
    /doctor/:id/get_prescription
    {
        "appointment_id" : "$"
    }
 */
app.get('/doctor/:id/get_prescription', (req,res)=>{

    let q = `SELECT * FROM prescription WHERE prescription_no = $1;`
    let params = Object.values(req.query)
    console.log(params, req.query)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})


/*
    "prescription_no": "$"
 */
app.get('/doctor/:id/get_presc_medicine', (req,res)=>{
    let q = `SELECT * FROM prescribed_in NATURAL JOIN medicine WHERE prescription_no = $1 and med_name = name;`
    let params = Object.values(req.query)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
{
    "appointment_id" : "$",
    "symptom_name":"$"
}
 */

app.post('/doctor/:id/delete_symptom', (req,res)=>{
    let q = `DELETE From patient_symptoms where  appointment_id = $1 and symptom_name LIKE $2  ESCAPE '#' ;`
    let params = Object.values(req.body)
    client.query(q, params,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful deletion"})
    })
})

/*
{
    "appointment_id" : "$",
    "test_name":"$"
}
 */

app.post('/doctor/:id/delete_assigned_test', (req,res)=>{
    let q = `DELETE From test_assigned_to where  appointment_id = $1 and test_name LIKE $2  ESCAPE '#' ;`
    let params = Object.values(req.body)
    client.query(q, params,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful deletion"})
    })
})

/*
{
    "prescription_no" : "$",
    "med_name":"$"
}
 */
app.post('/doctor/:id/delete_medicine', (req,res)=>{
    let q = `DELETE From prescribed_in where  prescription_no = $1 and med_name LIKE $2  ESCAPE '#' ;`
    let params = Object.values(req.body)
    client.query(q, params,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful deletion"})
    })
})

/*
    /doctor/:id/add_prescription
    {
        "appointment_id" : "$"
    }
*/
app.post('/doctor/:id/add_prescription', (req,res)=>{

    let q = `INSERT INTO prescription (prescription_no, date, status) VALUES ($1, current_date, 'waiting')`
    let params = Object.values(req.body)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        q = `INSERT INTO prescribed_by (prescription_no, appointment_id) VALUES ($1, $2); `
        let params2 = [req.body.appointment_id, req.body.appointment_id]
        client.query(q, params2, (err, result) =>{
            if(err){
                return res.status(405).send(err)
            }
            return res.status(200).send({"message":"successful insertion"})
        })
    })
})

/*
    /doctor/:id/add_prescription
    {
        "prescription_no" : "$",
        "med_name":"$",
        "qty": "$",
        "usage_method": "$",
    }
*/

app.post('/doctor/:id/add_medicine_to_presc', (req,res)=>{

    let q = `INSERT INTO prescribed_in (prescription_no, med_name, qty ,usage_method, med_status) 
                VALUES ($1, $2, $3, $4,'waiting')`
    let params = Object.values(req.body)
    console.log(params)
    client.query(q, params,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})




//--------------------------------------------LABORATORIAN ROUTES-------------------------------------------------//

/*
    /laboratorian/:id/homepage:
    /laboratorian/$/homepage
 */
app.get('/laboratorian/:id/homepage', (req,res)=>{

    let q = `SELECT to_char(tr.result_date, 'YYYY-MM-DD') as result_date_to_char, 
                to_char(ta.date, 'YYYY-MM-DD') as assign_date_to_char, *
             FROM test_assigned_to AS ta NATURAL JOIN test_result AS tr, person AS p, appointment AS a
             WHERE laboratorian_id = $1
               AND a.appointment_id = ta.appointment_id AND a.patient_id = p.national_id;  `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
    /laboratorian/:id/get_tests:
    /laboratorian/$/get_tests
 */
app.get('/laboratorian/:id/get_tests', (req,res)=>{

    let q = `SELECT to_char(tr.result_date, 'YYYY-MM-DD') as result_date_to_char, 
                to_char(ta.date, 'YYYY-MM-DD') as assign_date_to_char, *
             FROM test_assigned_to ta NATURAL JOIN test_result tr
             WHERE laboratorian_id = $1;  `
    let params = Object.values(req.params)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

/*
    /laboratorian/:id/get_spec_comps:
    /laboratorian/$/get_spec_comps
    {
        "appointment_id" : "$",
        "test_name" : "$"
    }
 */
app.get('/laboratorian/:id/get_spec_comps', (req,res)=>{
    let q = `SELECT to_char(t.result_date, 'YYYY-MM-DD') as result_date_to_char, *
             FROM test_result AS t NATURAL JOIN comp_result AS cr, component AS c
             WHERE t.test_name = $2 AND t.appointment_id = $1 AND 
                   t.result_id = cr.result_id AND cr.comp_name = c.comp_name;  `

    let params = Object.values(req.query)

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )

//get components with result_id
app.get('/laboratorian/:id/get_all_comp', (req,res)=>{
    let q =  `SELECT to_char(tr.result_date, 'YYYY-MM-DD') as result_date_to_char, 
                to_char(ta.date, 'YYYY-MM-DD') as assign_date_to_char, * 
        FROM test_assigned_to ta NATURAL JOIN test_result tr NATURAL JOIN comp_result 
        WHERE laboratorian_id = $1;`
    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    /laboratorian/:id/post_spec_comps:
    /laboratorian/$/post_spec_comps
    {
        "result_id" : "$",
        "comp_name" : "$",
        "comp_value": "$"
    }
 */
app.post('/laboratorian/:id/post_spec_comps', (req,res)=>{
    let q = `UPDATE comp_result
             SET  comp_value = $1, comp_status = 'finalized'
             WHERE result_id = $2 and comp_name = $3;  `

    let re = req.body
    let params = [re.comp_value, re.result_id, re.comp_name]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"MESSAGE" : "successfull"})
    })
})

/*
    /laboratorian/:id/post_test:
    /laboratorian/$/post_test
    {
        "result_id" : "$",
        "result_date" : "$",
        "test_status" : "$"
    }
 */
app.post('/laboratorian/:id/post_test', (req,res)=>{
    let q = `UPDATE test_result
             SET  result_date = $2, test_status = $3
             WHERE result_id = $1;  `

    let re = req.body
    let params = [re.result_id, re.result_date, re.test_status, re.result_id, re.comp_name]

    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"MESSAGE" : "successfull"})
    })
} )



//--------------------------------------------PHARMACIST ROUTES-------------------------------------------------//

app.get('/pharmacist/:id/get_all_prescriptions', (req,res)=>{
    let q= `SELECT to_char(p.date, 'YYYY-MM-DD') as date_to_char, *, p.status
            FROM prescription_assigned_to AS pat , prescription AS p, prescribed_by AS pb, appointment AS a, person
            WHERE pharmacist_id = $1 AND pat.prescription_no = p.prescription_no AND p.prescription_no = pb.prescription_no AND pb.appointment_id = a.appointment_id AND a.doctor_id = person.national_id ; `
    let params = Object.values(req.params)
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

app.get('/pharmacist/:id/get_prescription_details', (req,res)=>{
    let q= `SELECT *
            FROM prescription_assigned_to NATURAL JOIN prescribed_in
            WHERE pharmacist_id = $1 and prescription_no = $2;`
    let params = req.params.id
    let re = req.query.prescription_no
    console.log(params)
    console.log(re)
    params1 = [params, re]
    console.log(params1)
    client.query(q, params1, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
 */
app.get('/pharmacist/:id/get_waiting_prescriptions', (req,res)=>{
    let q= `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, *
            FROM prescription_assigned_to NATURAL JOIN prescription
            WHERE pharmacist_id = $1 and status = 'waiting'; `
    let params = Object.values(req.params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.row)
    })
})

app.get('/pharmacist/:id/check_stock' , (req,res)=>{
    let q = `SELECT * FROM medicine`
    client.query(q, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
    this function adds stock to medicine
    {
        "stock": "$",
        "name": "$"
    }
 */

app.post ('/pharmacist/:id/add_stock', (req,res)=>{
    let q  = ` UPDATE medicine
               SET stock = stock + $1
               where medicine.name = $2  `

    let params = [req.body.stock, req.body.name]
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"MESSAGE" : "successfull"})
    })
})

/*
    this function adds stock to medicine
    {
        "stock": "$",
        "name": "$"
    }
 */

app.post ('/pharmacist/:id/delete_stock', (req,res)=>{
    let q  = ` UPDATE medicine
               SET stock = stock - $1
               where medicine.name = $2  `

    let params = [req.body.stock, req.body.name]
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"MESSAGE" : "successfull"})
    })
})


/*
        {
            "prescription_id": "$",
            "status": "$",
            "qty":"$",
            "medicine_name" : "$"
        }
 */

// pahrmacists will be able to full the presc if they can supply the quantity (if there is enough stock)
app.post('/pharmacist/:id/fill_med', (req,res)=>{
    let q = ` UPDATE prescribed_in
              SET med_status = $1  
              WHERE prescription_no = $2 AND med_name = $3; `
    let params = [req.body.status, req.body.prescription_id, req.body.medicine_name]
    
    console.log(params)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        else {
            let y = `UPDATE medicine
                SET stock = stock - $1
                 WHERE medicine.name = $2; `
                 let params1 = [req.body.qty, req.body.medicine_name]
                 console.log(params1)
            client.query(y, params1, (error, result) => {
                if (error) {
                    return res.status(405).send(error)
                }
                else{
                    return res.status(200).send({"MESSAGE" : "successfull"})
                }
            })
        }

    })
})

/*
        {
           "name": "$"
        }

 */
app.get('/pharmacist/:id/medicine_search' , (req,res)=>{
    let q = `SELECT * FROM medicine WHERE name LIKE '%' || $1 || '%'`

    let params = Object.values(req.query)
    client.query(q,params ,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

app.get('/pharmacist/:id/def_medicine_search' , (req,res)=>{
    let q = `SELECT * FROM medicine WHERE name = $1`

    let params = Object.values(req.query)
    client.query(q,params ,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
})

/*
        {
           "lower_bound": "$",
           "upper_bound":"$"
        }
 */
app.get('/pharmacist/:id/stock_search', (req,res)=>{
    let q = `SELECT * from medicine WHERE stock NOT BETWEEN $1 AND $2`

    let params = Object.values(req.query)
    client.query(q, params ,(err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

})


app.get('/pharmacist/:id/get_max_stock_smaller_than_avg', (req,res)=>{
    let q = `SELECT * FROM medicine where stock =
                                          (SELECT Max(stock) FROM medicine
                                           where stock < (SELECT AVG(stock) from medicine))
             GROUP BY name, manufacturer;`
    client.query(q, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

} )

app.get('/pharmacist/:id/get_min_stock_bigger_than_avg', (req,res)=>{
    let q = `SELECT * FROM medicine where stock =
                                          (SELECT min(stock) FROM medicine
                                           where stock > (SELECT AVG(stock) from medicine) )
             GROUP BY name, manufacturer; `
    client.query(q, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })

} )


//--------------------------------------------ADMIN ROUTES-------------------------------------------------//

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
        ($1, $2, $3, $4, $5, $6, $7, to_date($8, 'YYYY-MM-DD'));`
    let re = req.body
    let params = [re.national_id,re.name,re.surname, re.email, re.password, re.person_type, re.phone, re.birthday]

    client.query(q, params,(err, result)=>{
        if (err){
            console.log(err)
            return res.status(404).send(err);
        }
        else{
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
            console.log(params)
            client.query(q, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(403).send(err);
                }
                return res.status(200).send({"message": "insertion successful"})
            });
        }
    });
})

/*
/admin/add_test
    {
        "test_name" : "$",
        "department": "$"
    }
 */
app.post('/admin/add_test', (req,res)=>{

    let q = `INSERT INTO test (test_name, department) VALUES ($1, $2)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/admin/add_component
    {
        "test_name" : "$",
        "comp_name": "$",
        "upper_normality_interval": "$",
        "lower_normality_interval": "$"
    }
 */
app.post('/admin/add_component', (req,res)=>{

    let q = `INSERT INTO component (test_name, comp_name, upper_normality_interval, lower_normality_interval)
             VALUES ($1, $2, $3, $4)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/admin/add_symptom
    {
        "name" : "$",
        "description": "$"
    }
 */
app.post('/admin/add_symptom', (req,res)=>{


    let q = `INSERT INTO symptom (name, description) 
                VALUES ($1, $2)`

    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/admin/add_disease
    {
        "name" : "$",
        "description": "$"
    }
 */
app.post('/admin/add_disease', (req,res)=>{

    let q = `INSERT INTO disease (name, description) VALUES ($1, $2)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            console.log(err)
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/admin/add_medicine
    {
        "name" : "$",
        "manufacturer": "$",
        "stock": "$"
    }
 */
app.post('/admin/add_medicine', (req,res)=>{

    let q = `INSERT INTO medicine (name, manufacturer, stock) VALUES ($1, $2, $3)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
/admin/add_department
    {
        "name" : "$",
        "date_est": "$",
        "building": "$"
    }
 */
app.post('/admin/add_department', (req,res)=>{

    let q = `INSERT INTO department (name, date_est, building) VALUES ($1, TO_DATE($2,'YYYY-MM-DD') , $3)`
    let params = Object.values(req.body)
    client.query(q, params, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({"message":"successful insertion"})
    })
})

/*
    table: name of the table to be viewed.
 */
app.get('/admin/:table', (req,res)=>{
    let q = ``
    let table = req.params.table
    if (table === 'appointment') {
        q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, * FROM appointment;  `
    } else if (table === 'person' ) {
        q = `SELECT to_char(birthdate, 'YYYY-MM-DD') as birthdate_to_char, * FROM person;  `
    } else if (table === 'doctor' ) {
        q = `SELECT * FROM doctor;  `
    } else if (table === 'department' ) {
        q = `SELECT to_char(date_est, 'YYYY-MM-DD') as date_est_to_char, * FROM department;  `
    } else if (table === 'diagnosis' ) {
        q = `SELECT * FROM diagnosis;  `
    } else if (table === 'disease' ) {
        q = `SELECT * FROM disease;  `
    } else if (table === 'disease_symptoms' ) {
        q = `SELECT * FROM disease_symptoms;  `
    } else if (table === 'laboratorian' ) {
        q = `SELECT * FROM laboratorian;  `
    } else if (table === 'medicine' ) {
        q = `SELECT * FROM medicine;  `
    } else if (table === 'patient' ) {
        q = `SELECT * FROM patient;  `
    } else if (table === 'patient_symptoms' ) {
        q = `SELECT * FROM patient_symptoms;  `
    } else if (table === 'pharmacist' ) {
        q = `SELECT * FROM pharmacist;  `
    } else if (table === 'prescribed_by' ) {
        q = `SELECT * FROM prescribed_by;  `
    } else if (table === 'prescribed_in' ) {
        q = `SELECT * FROM prescribed_in;  `
    } else if (table === 'prescription' ) {
        q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, * FROM prescription;  `
    } else if (table === 'test_result' ) {
        q = `SELECT to_char(result_date, 'YYYY-MM-DD') as result_date_to_char, * FROM test_result;  `
    } else if (table === 'comp_result' ) {
        q = `SELECT * FROM comp_result;  `
    } else if (table === 'component' ) {
        q = `SELECT * FROM component;  `
    } else if (table === 'symptom' ) {
        q = `SELECT * FROM symptom;  `
    } else if (table === 'test' ) {
        q = `SELECT * FROM test;  `
    } else if (table === 'test_assigned_to' ) {
        q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, * FROM test_assigned_to;  `
    } else if (table === 'doctor_off_days' ) {
        q = `SELECT to_char(date, 'YYYY-MM-DD') as date_to_char, * FROM doctor_off_days;  `
    } else if (table === 'prescription_assigned_to' ) {
        q = `SELECT * FROM prescription_assigned_to;  `
    } else {
        return res.send({"message": "invalid table name"})
    }
    client.query(q, (err, result) =>{
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send(result.rows)
    })
} )