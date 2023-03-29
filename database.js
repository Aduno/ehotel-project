const express = require('express')
const connection = require('./connection');

// function runQuery (sqlQuery) {
//     return new Promise((resolve, reject) => {    
//         connection.query(sqlQuery, function (error, result, fields) {
//             if (error) {
//                 return reject(error);
//             } else {
//                 console.log(sqlQuery);
//                 console.log(result[0])
//                 return resolve(result);
//             }
//         });
//     });
// }

function runQuery(sqlQuery){
    return new Promise((resolve, reject)=>{
        console.log("Running query: " + sqlQuery);
        connection.query(sqlQuery)
            .then((res=>{
                resolve(res);
            }))
            .catch((err)=>{
                reject(err);
            })
    })
}

module.exports = {runQuery}