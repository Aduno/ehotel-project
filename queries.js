const express = require('express');
const { runQuery } = require('./database');
const router = express.Router();
var multer = require("multer");
var upload = multer();
router.use(upload.array());

// ** Routes ** //
// I know this is not proper authentication but for the development of the project, we'll keep it simple
router.route('/login')
    .post((req, res)=>{
        checkLogin(req.body.username, req.body.password).then(isValid=>{
            if(isValid) res.send("Success");
            else res.send("Failed");
        })
    });
// Get all the names hotel chains
router.route('/hotel-chains')
    .get()
// Get the details (Office) for a hotel chain
router.route('/:hotel-chain')
    .get()
// List all the hotels 
router.route('/hotels')
    .get()
// Get details for a hotel
router.route('/:hotel_id')
// Get all the rooms for a hotel (Uses req.query https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express)
router.route('/:hotel_id/rooms')
// Get details for a room in a hotel
router.route('/:hotel_id/:room_id')
// Get customer information 

// Get Employee information

// Get Booking information for a room

// 

// ** Query Functions ** //

function checkLogin(username, password){
    return new Promise((resolve, reject)=>{
        var query = 'select COUNT(1) as exist from employee where employee_id=\''+username+'\' and password=\''+password+'\'';
        var response = runQuery(query);
        response.then((data)=>{
            if(data[0]['exist']==0){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}

function getHotelChainNames(){
    return new Promise((resolve, reject)=>{
        var query = 'select chain_name from hotelchain '
    })
}

module.exports = router;