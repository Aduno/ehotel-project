const express = require('express');
const { runQuery } = require('./database');
const router = express.Router();
var multer = require("multer");
var upload = multer();
router.use(upload.array());

// ** Routes ** //
// I know this is not proper authentication but for the development of the project, we'll keep it simple
router.post('/customer/login' ,(req, res)=>{
        checkLogin(req.body.email, req.body.password, false).then(result=>{
             res.send(result);
        })
        .catch((err)=>{
            res.sendStatus(401);
        })
    });
router.post('/employee/login', (req, res)=>{
        checkLogin(req.body.email, req.body.password, true).then(result=>{
                res.send(result);
        })
        .catch((err)=>{
            res.send(err);
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

// Get all the hotels based on filter
// If none are selected, returns all hotels without filtering
router.get('/hotels', (req, res)=>{
    var hotel = {
        "chain_name": req.query.chain_name.toString().split(','),
        "star_rating": req.query.star_rating.toString().split(','),
        "city": req.query.city,
        "country": req.query.country,
        "num_rooms": req.query.num_rooms
    }
    var query = `
    select * from 
    hotel, 
    (select count(room.room_number) as num_rooms, hotel_id from hotel join room using(hotel_id) group by hotel_id) 
    as room_num where room_num.hotel_id = hotel.hotel_id `+ formatHotelFilter(hotel);
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
    // var query = 'SELECT * FROM customer join booking using(customer_id) join renting using(customer_id) where customer_id='+req.params.customer_id;
    var query = 'SELECT * FROM customer where customer_id='+req.params.customer_id;
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

// Get booking archives
router.get('/booking_archives', (req, res)=>{
    var query = 'SELECT * FROM booking_archive';
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})
// Get renting archives
router.get('/renting_archives', (req, res)=>{
    var query = 'SELECT * FROM renting_archive';
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})
// Get Booking information for a room based on customer_id
router.get('/bookings/:customer_id', (req, res)=>{
    var query = 'SELECT booking.*, hotel.chain_name, price FROM booking join hotel using(hotel_id) join room on room.room_number=booking.room_number where customer_id='+req.params.customer_id;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

// All bookings 
router.get('/bookings', (req, res)=>{
    var query = 'SELECT booking.*, price, chain_name FROM booking join hotel using(hotel_id) join room using(room_number)';
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})

router.get('/booking/past_start_date', (req, res)=>{
    var query = `
    SELECT booking.*, price, chain_name from booking join hotel using(hotel_id) join room using(room_number) where booking_start_date >= '${req.query.date}'
    `;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
})

router.get('/booking/before_start_date', (req, res)=>{
    var query = `
    SELECT  booking.*, price, chain_name from booking join hotel using(hotel_id) join room using(room_number) where booking_start_date < '${req.query.date}'
    `;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
})

router.get('/renting/ongoing', (req, res)=>{
    var query = `
    SELECT renting.*, price, chain_name from renting join hotel using(hotel_id) join room using(room_number) where check_out_date >= '${req.query.date}'
    `;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
})
router.get('/renting/past', (req, res)=>{
    var query = `
    SELECT renting.*, price, chain_name from renting join hotel using(hotel_id) join room using(room_number) where check_out_date < '${req.query.date}'
    `;
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    });
})

// *** Room filter page apis ***
// Return rooms that are available for use based on the filter
router.get('/available_rooms', (req, res)=>{
    var filter = {
        hotel_id: req.query.hotel_id,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        booking_start_date: req.query.start_date,
        booking_end_date: req.query.end_date,
        view: req.query.views? [req.query.views.toString().split(','), 'views']: null,
        capacity: req.query.room_capacity? [req.query.room_capacity.toString().split(','), 'capacity']: null,
        tv: req.query.amenities? [req.query.amenities.tv, 'amenity'] : null,
        room_service: req.query.amenities? [req.query.amenities.room_service, 'amenity']: null, 
        fridge: req.query.amenities? [req.query.amenities.fridge, 'amenity']: null,
        wifi: req.query.amenities? [req.query.amenities.wifi, 'amenity']: null,
        air_conditioner: req.query.amenities? [req.query.amenities.ac, 'amenity']: null,
        extendable: req.query.amenities? [req.query.amenities.extendable, 'extendability']: null
    }
    query = `
    SELECT * from room 
    WHERE room.room_number 
    NOT IN(SELECT room_number FROM booking 
    WHERE ('${filter.booking_start_date}', '${filter.booking_end_date}')
    OVERLAPS (booking_start_date, booking_end_date))
    and 
    `+ formatFilter(filter);
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
    });
})
// Gets all the cities in the database
router.get('cities', (req, res)=>{
    var query = 'SELECT DISTINCT(city) from hotel';
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    });
})

// Gets the capacity of all the hotels
router.get('/hotel_capacities', (req, res)=>{
    var query = 'SELECT * from hotel_capacity';
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})
// Gets the capacity of the city
router.get('/cities/available_rooms', (req, res)=>{
    var query = 'SELECT * from City_Capacity'
    var response = runQuery(query);
    response.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})
// ** Query Functions ** //
function checkLogin(username, password, isEmployee){
    return new Promise((resolve, reject)=>{
        if(isEmployee){
            var query = 'select employeeID, managerID, hotel_ID from employee where email=\''+username+'\' and password=\''+password+'\'';
        }
        else{
            var query ='select customer_id from customer where email=\''+username+'\' and password=\''+password+'\'';
        }
        var response = runQuery(query);
        response.then((data)=>{
            if(data['rows'][0]){
                resolve(data);
            }else{
                reject("Invalid username or password");
            }
        }).catch((err)=>{
            console.log(err);
            resolve("Invalid username or password");
        })
    })
}
// Function for formatting query parameters for hotel filter
function formatHotelFilter(filter){
    var formatted = '';
    for(var key in filter){
        // if item is of type array and is not empty
        if(Array.isArray(filter[key])){
            if(filter[key][0]){
                formatted += key + ' in ('
                for(var val of filter[key]){
                    formatted += `'${val}',`
                }
                formatted= formatted.substring(0,formatted.length-1)+') and '
            }
        }
        else if(filter[key]){
            if(key =='num_rooms'){
                formatted += key + " > '" + filter[key]+ "' and ";
                console.log(formatted)
            }
            else{
                formatted += key + " = '" + filter[key] + "' and ";
            }
        }
    }
    if(formatted){
        formatted = ' and ' + formatted.substring(0, formatted.length-5);
    }
    return formatted;
}
// Not really worth to make use hashmap to reduce time complexity
// Sorry for this abomination of code lol
function formatFilter(filter){
    var query = '';
    var firstOR = true;
    for(var key in filter){
        if(filter[key]){
            if(key == 'hotel_id'){
                query+= 'hotel_id='+filter[key];
            }
            // Behaviour for list queries
            else if(filter[key][0] instanceof Array && filter[key][0].length>0){
                var formattedList = sqlFormatList(filter[key][0])
                query+= ' and '+key+' IN ('+ formattedList + ')';
            }
            else if(filter[key] instanceof Array){
                if(filter[key][0]){ // if not empty (Doesnt work if theres anything else in the if statement)
                    if(filter[key][1]=='amenity'){
                        if(firstOR){
                        query += ' and ('
                        }
                        else{
                            query += ' or '
                        }
                        query += key +'='+filter[key][0];
                        firstOR = false;
                    }
                    else{
                        query+= ' and '+key+'='+filter[key][0];
                    }
                }
                
            }
            // Behaviour for range queries
            else if(key=="min_price"){
                query+= ' and price>= CAST('+ filter[key]+' as MONEY)';
            }
            else if(key == "max_price"){
                query+= ' and price<= CAST('+filter[key]+' as MONEY)';
            }
            else if(key=="booking_start_date" || key=="booking_end_date"){
                continue;
            }
        }
    }
    if(!firstOR){
        query+=')';
    }
    return query;
}

function sqlFormatList(list){
    var formatted = '';
    for(var item of list){        
        formatted+= `'${String(item).toLowerCase()}',`;
    }
    return formatted.substring(0, formatted.length-1);
}

module.exports = router;