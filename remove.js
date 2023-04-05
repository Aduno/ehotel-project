const express = require('express');
const router = express.Router();
const { runQuery } = require('./database');

router.post('/hotel/:hotel_id', (req, res) => {
    var query = 'delete from hotel where hotel_id ='+req.params.hotel_id;
    var response = runQuery(query);
    response.then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.post('/room/:room_id', (req, res) => {
    var query = 'delete from room where room_id ='+req.params.room_id;
    var response = runQuery(query);
    response.then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.post('/hotel_chain/:chain_name', (req, res) => {
    var query = 'delete from hotel_chain where chain_name ='+req.params.chain_name;
    var response = runQuery(query);
    response.then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.post('/booking/:booking_id',(req, res) => {
    var query = 'delete from booking where booking_id ='+req.params.booking_id;
    var response = runQuery(query);
    response.then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})


module.exports = router;