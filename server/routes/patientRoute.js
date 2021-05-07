const router = require('express').Router();
const {Client} = require('pg');

const client = new Client({
    host: "163.172.25.36",
    port: 5432,
    user: "mohi",
    password: "mohimohi",
    database: "hm"
})

/**
 * This is an example usage, it does not work
 * */
router.route('/').get((req, res) =>{
    //query string
    let q = `SELECT * FROM jhkj`
    client.query( q, (err, result) =>{
        if(err){
            return res.send(err);
        }else {
            res.send(result);
        }
    })
})