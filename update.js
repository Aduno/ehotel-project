const express = require('express');
const { runQuery } = require('./database');
const router = express.Router();

// Update customer booking to renting (Still keeps the old booking in the table)
router.post('/:booking_id', (req, res) => {
    var query= 'insert into renting (room_number, customer_id, booking_id, \
        hotel_id, check_in_date)\
        select customer_id, room_number, booking_id, hotel_id, booking_start_date, booking_end_date from booking where booking_id ='+req.params.booking_id;
    var response = runQuery(booking)
    response.then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
        console.log(err);
    })
})

module.exports = router;