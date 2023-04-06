const express = require('express')
const router = express.Router();
const setup = require('./setup')
const { runQuery } = require('./database');


// Function to quickly format the insert into values
function format(){
    var formatted = "("
    for(var i=0; i<arguments.length-1;i++){
        if(arguments[i]){
            formatted+=arguments[i] +',';
        }
    }
    formatted+= (formatted[arguments.length-1]+")")
    return formatted;
}

// Add a booking 
router.post('/book',(req,res)=>{
    // MAKE A SEPARATE FUNCTION FOR THIS AND IN THE MAIN FUNCTION HERE, CHECK THAT BOTH PROMISES SUCCESSFULLY FINISHES
    var values = format(req.query.hotelID, req.query.roomNumber, req.query.customerID, req.query.start, req.query.end);
    var insert = 'insert into booking(hotel_id, room_number, customer_id, booking_start_date, booking_end_date) values '+ values;
    var response = runQuery(insert);
    response.
        then((result) => {
            console.log("Successfully created booking");
            res.send(result);
        }).
        catch((err) => {
            console.log("Failed to create booking");
            res.sendStatus(500);
        });
});

// Create a check-in + check-in from booking (+Archive)
router.post('/rent', (req, res) => {
    var values = format(req.query.customer_id,req.query.hotel_id, req.query.room_number, req.query.start, req.query.end, req.query.booking_id);
    if(req.query.booking_id){
        var insert = 'insert into booking(customer_id, hotel_id, room_number, check_in_date, check_out_date, booking_id) values '+ values;
    }
    else{
        var insert = 'insert into booking(customer_id, hotel_id, room_number, check_in_date, check_out_date) values '+ values;
    }
    runQuery(insert)
        .then((result)=>{
            console.log("Successfully created renting")
            res.send(result);
        })
        .catch((err)=>{
            res.sendStatus(500);
        })

})
// Create new hotel
// Create new rooms
// Create new hotel chain

// Creating new user
// Check what happens if the user dose not enter unit number
router.post('/user', (req, res) => {
    const date = new Date();
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
    var values = formatted(req.query.first_name, req.query.last_name,
        req.query.phone_number, req.query.email, req.query.country,
        req.query.city, req.query.street_name, req.query.unit_number,
        req.query.sin, currentDate);
    if(req.query.unit_number){
        var query = `
        insert into customer(first_name, last_name, 
            phone_number, email, address_country, address_city,
            address_street_name, address_unit_number, ssn_sin,
            registration_date) 
            values ` + values;
    }
    else{
        var query = `
        insert into customer(first_name, last_name, 
            phone_number, email, address_country, address_city,
            address_street_name, ssn_sin,
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