const express = require('express')
const connection = require('./connection');

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