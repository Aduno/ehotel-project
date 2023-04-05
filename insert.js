const express = require('express')
const router = express.Router();
const setup = require('./setup')
const { runQuery } = require('./database');


// Function to quickly format the insert into values
function format(){
    var formatted = "("
    for(var i=0; i<arguments.length-1;i++){
        formatted+=arguments[i] +',';
    }
    formatted+= (formatted[arguments.length-1]+")")
    return formatted;
}

// Add a booking (Automatically create a copy of this data in the archive)
router.get('/book',(req,res)=>{
    // MAKE A SEPARATE FUNCTION FOR THIS AND IN THE MAIN FUNCTION HERE, CHECK THAT BOTH PROMISES SUCCESSFULLY FINISHES
    var values = format(req.query.hotelID, req.query.roomNumber, req.query.customerID, req.query.start, req.query.end);
    var insert = 'insert into booking(hotel_id, room_number, customer_id, booking_start_date, booking_end_date) values '+ values;
    var response = runQuery(insert);
    response.
        then((result) => console.log("Successfully created booking")).
        catch((err) => console.log("Failed to create booking"));

    // Archive
    // FIX THIS MAKE A SEPARATE FUNCTION FOR THIS
    var chainNameQuery = "select chain_name from hotel where hotel_id='"+hotelID+"'"
    response = runQuery(chainNameQuery);
    response.
        then((result) => {
            values= values.substring(0, values.length-2)+result[0]['chain_name']+")"
            insert = 'insert into booking_archive(hotel_id, room_number, customer_id, booking_start_date, booking_end_date, chain_name) values '+ values
        })
        .catch((err) => console.log("Failed to archive"));
});

// Create a check-in + check-in from booking (+Archive)

// Create new hotel

// Create new rooms

// Create new hotel chain

// Creating new user
router.post('/user', (req, res) => {
    var query = "insert into customer(first_name, last_name, country) values ('"+req.body.username+"";
})


router.use('/setup', setup);

module.exports = router;