const express = require('express')
const connection = require('./connection');

function runQuery (sqlQuery) {
    return new Promise((resolve, reject) => {    
        connection.query(sqlQuery, function (error, result, fields) {
            if (error) {
                return reject(error);
            } else {
                console.log(sqlQuery);
                console.log(result[0])
                return resolve(result);
            }
        });
    });
}

module.exports = {runQuery}