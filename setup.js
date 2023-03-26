const express = require('express');
const router = express.Router();
const { runQuery } = require('./database');


router.post('/employee', (req, res) => {
    var query = 'INSERT INTO employee (first_name, last_name, role_id)'   
    runQuery(query)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(500);
            console.log(err);
        })
})

// Create a new employee
module.exports = router;