const express = require('express');
const { runQuery } = require('./database');
const router = express.Router();
var multer = require("multer");
var upload = multer();
router.use(upload.array());

// Update customer booking to renting (Still keeps the old booking in the table)
router.post('/booking/check_in/:booking_id', (req, res) => {
    var query= 
    `
    INSERT INTO renting 
    (room_number, customer_id, booking_id,
    hotel_id, check_in_date, check_out_date)
    SELECT
    room_number, customer_id, booking_id,
    hotel_id, booking_start_date, booking_end_date 
    FROM bookings
    WHERE booking_id='${req.params.booking_id}'
    `
    var response = runQuery(booking)
    response.then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
        console.log(err);
    })
})

// Update customer information
// If nothing is sent in the body or the keys are missing
// those missing keys values will not be updated
// Ex. if the body is {first_name: "John", last_name: "Doe"}
// the query will be "update customer set first_name = "John", last_name = "Doe"
// and the other values will not be updated
router.post('/customers/:customer_id', (req, res) => {
    var customer_template = {
        first_name: null,
        last_name: null,
        phone_number: null,
        email: null,
        address_country: null,
        address_city: null,
        address_street_name: null,
        address_street_number: null,
        address_unit_number: null,
        password: null,
        SSN_SIN: null
    }
    var query = `update 
    customer set ${formatUpdate(req.body, customer_template)}
     where customer_id = '${req.params.customer_id}'`
    var response = runQuery(query);
    response.then((result) => {
        console.log(result);
        if(result['rowCount']==0){
            res.send("No customer with that id exists")
        }
        else{
            res.send("Customer information updated")
        }
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
})

// Update employee inforWmation
router.post('/employees/:employee_id', (req, res,)=>{
    var employee_template = {
        first_name: null,
        last_name: null,
        position: null,
        email: null,
        password: null,
        phone_number:null,
        hotel_id: null,
        managerid: null,
    }
    var query = `update 
    employee set ${formatUpdate(req.body, employee_template)}
     where employeeID = '${req.params.employee_id}'`
    var response = runQuery(query);
    response.then((result) => {
        console.log(result);
        if(result['rowCount']==0){
            res.send("No emplyee with that id exists")
        }
        else{
            res.send("Employee information updated")
        }
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
})

function formatUpdate(req, template){
    var formatted = ''
    console.log(req)
    for (var key in template){
        if (req[key]){
            formatted += key + " = '" + req[key] + "', "
        }
    }
    if(formatted.length > 0){
        formatted = formatted.slice(0, -2)
    }
    return formatted;
}
module.exports = router;