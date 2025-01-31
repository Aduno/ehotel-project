const express = require('express')
const router = express.Router();
const setup = require('./setup')
const { runQuery } = require('./database');


// Function to quickly format the insert into values
function format(){
    var formatted = "("
    for(var i=0; i<arguments.length;i++){
        if(arguments[i]){
            formatted+=`'${arguments[i]}',`;
        }
    }
    formatted= (formatted.substring(0, formatted.length-1)+")")
    return formatted;
}
// Function for parsing out information and properly formatting the phone number
function format_phone_number(number){
    var split_number = number.split('-');
    if(split_number[1].length>10){ // Validate the phone number
        return null;
    }
    var area_code = split_number[0];
    var phone_number = split_number[1].substring(0,3) + '-' + split_number[1].substring(3,6) + '-' + split_number[1].substring(6,11);
    return area_code + '-' + phone_number;
}

// Add a booking 
router.post('/book',(req,res)=>{
    // MAKE A SEPARATE FUNCTION FOR THIS AND IN THE MAIN FUNCTION HERE, CHECK THAT BOTH PROMISES SUCCESSFULLY FINISHES
    var values = format(req.body.hotelID, req.body.roomNumber, req.body.customerID, req.body.start, req.body.end);
    var insert = 'insert into booking(hotel_id, room_number, customer_id, booking_start_date, booking_end_date) values '+ values;
    var response = runQuery(insert);
    response.
        then((result) => {
            console.log("Successfully created booking");
            res.send(result);
        }).
        catch((err) => {
            console.log(err)
            console.log("Failed to create booking");
            res.sendStatus(500);
        });
});

// Create a check-in + check-in from booking (+Archive)
router.post('/rent', (req, res) => {
    var values = format(req.body.customer_id,req.body.hotel_id, req.body.room_number, req.body.start, req.body.end, req.body.booking_id);
    if(req.body.booking_id){
        var insert = 'insert into renting(customer_id, hotel_id, room_number, check_in_date, check_out_date, booking_id) values '+ values;
    }
    else{
        var insert = 'insert into renting(customer_id, hotel_id, room_number, check_in_date, check_out_date) values '+ values;
    }
    runQuery(insert)
        .then((result)=>{
            console.log("Successfully created renting")
            res.send(result);
        })
        .catch((err)=>{
            res.sendStatus(500);
        })
    query = 'UPDATE BOOKING SET Checked_in = true WHERE booking_id = ' + req.body.booking_id;
    runQuery(query)
        .then((result)=>{
            console.log("Successfully updated booking")
            res.send(result)
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500);   
        })
});


// Creating new user
// Check what happens if the user dose not enter unit number
router.post('/user', (req, res) => {
    const date = new Date();
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    let phone_number = format_phone_number(req.body.phone_number);
    if(!phone_number){ // If the phone number is not valid
        res.send("Invalid phone number");
    }

    var values = format(req.body.first_name, req.body.last_name,
        phone_number, req.body.email, req.body.address_country,
        req.body.address_city, req.body.address_street_name, req.body.address_street_number, req.body.address_unit_number,
        req.body.ssn_sin, req.body.password, currentDate);
    if(req.body.address_unit_number){
        var query = `
        insert into customer(first_name, last_name, 
            phone_number, email, address_country, address_city,
            address_street_name, address_street_number, address_unit_number, ssn_sin, password,
            registration_date) 
            values ` + values;
    }
    else{
        var query = `
        insert into customer(first_name, last_name, 
            phone_number, email, address_country, address_city,
            address_street_name, address_street_number, ssn_sin, password,
            registration_date) 
            values ` + values;
    }
    
    runQuery(query)
        .then(result=>{
            console.log("Successfully created user");
            res.sendStatus(200);
        })
        .catch(err=>{
            console.log(err);
            res.sendStatus(500);
        })
})


router.use('/setup', setup);

module.exports = router;