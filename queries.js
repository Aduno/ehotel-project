const express = require('express');
const { runQuery } = require('./database');
const router = express.Router();
var multer = require("multer");
var upload = multer();
router.use(upload.array());

// ** Routes ** //
// I know this is not proper authentication but for the development of the project, we'll keep it simple
router.get('/customer/login' ,(req, res)=>{
        checkLogin(req.body.username, req.body.password, false).then(isValid=>{
            if(isValid) res.send("Success");
            else res.send("Failed");
        })
    });
router.get('/employee/login', (req, res)=>{
        checkLogin(req.body.username, req.body.password, true).then(isValid=>{
            if(isValid) res.send("Success");
            else res.send("Failed");
        })
    });
// Get all the names hotel chains
router.get('/hotel_chain', (req, res)=>{
        var query = 'select chain_name from hotel_chain'
        var response = runQuery(query);
        response.then((data)=>{
            res.send(data);
        }).catch((err)=>{
            console.log(err);
        });
    })

// Get all the hotels 
router.get('/hotels', (req, res)=>{
    var query ='select * from hotel';
        var response = runQuery(query);
        response.then((data)=>{
            res.send(data);
        }).catch((err)=>{
            console.log(err);
        });
})
// List all the hotels for a hotel chain
router.get('/hotel_chain/:chain_name', (req, res)=>{
        var query ='select hotel_id from hotel where chain_name ='+req.params.chain_name;
        var response = runQuery(query);
        response.then((data)=>{
            res.send(data);
        }).catch((err)=>{
            console.log(err);
        });
    })

// List all the Offices for a hotel chain
router.get('/hotel_chain/:chain_name/office', (req, res)=>{
    var query = 'select branch_number from office where chain_name ='+req.params.chain_name;  
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get details of a office for a hotel chain
router.get('/hotel_chain/:chain_name/office/:branch_number', (req, res)=>{
    var query = 'select * from office where chain_name ='+req.params.chain_name+' and branch_number='+req.params.branch_number;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get details of a hotel for a hotel chain
router.get('/hotel/:hotel_id', (req, res)=>{
    var query = 'select * from hotel where chain_name ='+req.params.chain_name+' and hotel_id='+req.params.hotel_id;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})


// Get all the rooms for a hotel (Uses req.query https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express)
router.get('/hotel/:hotel_id/rooms', (req, res)=>{
    var query = 'select room_number from room where hotel_id='+req.params.hotel_id
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get details for a room in a hotel
router.get('/hotel/:hotel_id/:room_id')
// List all customers 
router.get('/customers', (req, res)=>{
    var query = 'SELECT first_name, last_name, customer_ID FROM customer';  
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get customer information
// Might need to fix this later on. I think this query could cause some issues where a customer has a renting without booking
router.get('/customer/:customer_id', (req, res)=>{
    var query = 'SELECT * FROM customer join booking using (customer_id) join renting using(customer_id) having customer_id='+req.params.customer_id;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get Employee information
router.get('/employee/:employee_id', (req, res)=>{
    var query = 'SELECT * FROM employee where employee_id='+req.params.employee_id;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// Get Booking information for a room

// 

// ** Query Functions ** //

function checkLogin(username, password, isEmployee){
    return new Promise((resolve, reject)=>{
        if(isEmployee){
            var query = 'select COUNT(1) as exist from employee where employee_id=\''+username+'\' and password=\''+password+'\'';
        }
        else{
            var query ='select COUNT(1) as exist from customer where customer_id=\''+username+'\' and password=\''+password+'\'';
        }
        var response = runQuery(query);
        response.then((data)=>{
            if(data['rows'][0]['exist']==0){
                resolve(false);
            }else{
                resolve(true);
            }
        }).catch((err)=>{
            console.log(err);
            resolve(false);
        })
    })
}

module.exports = router;