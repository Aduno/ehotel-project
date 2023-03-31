const express = require('express');
const router = express.Router();
const { runQuery } = require('./database');


//Must check how to implement composite attributes for some tables, is it like any regular attribute?
//Create Hotel_Chain table
router.post('/hotelchain', (req, res) => {
    const chainQuery = `
    CREATE TABLE Hotel_Chain (
    Chain_Name VARCHAR(30) NOT NULL PRIMARY KEY
    )`;
    runQuery(chainQuery)
        .then(result => {
            console.log('Hotel_Chain table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
// Create Office table
router.post('/office', (req, res) => {
    const officeQuery = `w
    CREATE TABLE Office (
    Branch_number INT NOT NULL PRIMARY KEY,
    Chain_Name VARCHAR(30) NOT NULL,
    Country VARCHAR(30) NOT NULL,
    Street_name VARCHAR(30) NOT NULL,
    Street_number INT NOT NULL,
    Unit_number INT,
    City VARCHAR(30) NOT NULL,
    Contact_emails VARCHAR(30),
    Contact_phone_numbers VARCHAR(30),
    FOREIGN KEY (Chain_Name) REFERENCES Hotel_Chain(Chain_Name)
    )`;
    runQuery(officeQuery)
        .then(result => {
            console.log('office table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
// Create Hotel table
//to respect data insertion rules, we consider area to be the city
router.post('/hotel', (req, res) => {//here should check the star rating condition for 1-5 stars
    const hotelQuery = `
    CREATE TABLE Hotel (
    Hotel_ID INT NOT NULL PRIMARY KEY,
    Star_rating INT CHECK (Star_rating BETWEEN 1 AND 5),
    Chain_Name VARCHAR(30) NOT NULL,
    Country VARCHAR(30) NOT NULL,
    City VARCHAR(30) NOT NULL,
    Street_name VARCHAR(30) NOT NULL,
    Street_number INT NOT NULL,
    Unit_number INT,
    email VARCHAR(30),
    Phone_number VARCHAR(15) CHECK(phone_number ~ '^\\d{1,2}-\\d{3}-\\d{3}-\\d{4}$'),
    FOREIGN KEY (Chain_Name) REFERENCES Hotel_Chain(Chain_Name)
    )`;
    runQuery(hotelQuery)
        .then(result => {
            console.log('Hotel table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
// Create Room table
router.post('/room', (req, res) => {//still need to work on the condition of the attrbutes (capacity --> single double etc)
    const roomQuery = `
    CREATE TABLE IF NOT EXISTS Room (
    Room_number INT NOT NULL PRIMARY KEY,
    Hotel_ID INT NOT NULL,
    Price MONEY NOT NULL,
    TV BOOLEAN NOT NULL,
    Air_Conditioner BOOLEAN NOT NULL,
    Fridge BOOLEAN NOT NULL,
    Wifi BOOLEAN NOT NULL,
    Room_Service BOOLEAN NOT NULL,
    Capacity INT CHECK(Capacity>1 and Capacity<12) NOT NULL,
    View VARCHAR(30) CHECK(View IN ('sea view','mountain view','city view')) NOT NULL,
    Extendable BOOLEAN NOT NULL,
    Problems TEXT,
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(Hotel_ID)
    )`;
    runQuery(roomQuery)
        .then(result => {
            console.log('Room table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
//Create employee table
router.post('/employee', (req, res) => {
    const employeeQuery = `
    CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    Position VARCHAR(30) NOT NULL,
    First_name VARCHAR(30) NOT NULL,
    Last_name VARCHAR(30) NOT NULL,
    Salary NUMERIC(10,2) NOT NULL CHECK (Salary>0.0),
    Hotel_ID INT NOT NULL,
    ManagerID INT,
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(Hotel_ID),
    FOREIGN KEY (ManagerID) REFERENCES Employee(EmployeeID)
    )`;
    runQuery(employeeQuery)
    .then(result => {
        console.log('Employee table created successfully');
        res.sendStatus(200);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
//create customer table
router.post('/customer', (req, res) => {
    const customerQuery = `
    CREATE TABLE Customer (
    Customer_ID SERIAL PRIMARY KEY,
    First_name VARCHAR(30) NOT NULL,
    Last_name VARCHAR(30) NOT NULL,
    Address_country VARCHAR(30) NOT NULL,
    Address_city VARCHAR(30) NOT NULL,
    Address_street_name VARCHAR(30) NOT NULL,
    Address_street_number INT NOT NULL,
    Address_unit_number INT,
    SSN_SIN NUMERIC(9,0) NOT NULL,
    Registration_date DATE NOT NULL
    )`;
    runQuery(customerQuery)
        .then(result => {
            console.log('Customer table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
//Create booking table
router.post('/booking', (req, res) => {
    const bookingQuery = `
    CREATE TABLE Booking (
    Booking_ID SERIAL PRIMARY KEY,
    Customer_ID SERIAL NOT NULL,
    Booking_start_date DATE NOT NULL,
    Booking_end_date DATE NOT NULL,
    Room_number INT NOT NULL,
    CHECK (Booking_start_date <= Booking_end_date),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Room_number) REFERENCES Room(Room_number)
    )`;
    runQuery(bookingQuery)
        .then(result => {
            console.log('Booking table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
//Create renting table
router.post('/renting', (req, res) => {
    const rentingQuery = `
    CREATE TABLE Renting (
    Renting_ID SERIAL PRIMARY KEY,
    Customer_ID SERIAL NOT NULL,
    Room_number INT NOT NULL,
    Booking_ID SERIAL,
    Check_in_date DATE NOT NULL,
    Check_out_date DATE NOT NULL,
    CHECK (Check_in_date <= Check_out_date),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Room_number) REFERENCES Room(Room_number),
    FOREIGN KEY (Booking_ID) REFERENCES Booking(Booking_ID)
    )`;
    runQuery(rentingQuery)
        .then(result => {
            console.log('Renting table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
//Create table booking_archive
// Not referecing external tables since we need to keep the data after it is deleted
// and also not prevent the foreign table from being deleted
// The customer is assumed to never be deleted
router.post('/booking_archive', (req, res) => {//Are we sure we only need booking_id as primary key? // what about the foreing keys? 
    const bookingArchiveQuery = `
    CREATE TABLE Booking_Archive (
    Booking_start_date DATE NOT NULL,
    Booking_end_date DATE NOT NULL,
    Booking_ID SERIAL NOT NULL,
    Customer_ID SERIAL NOT NULL,
    Room_number INT NOT NULL,
    Hotel_ID INT NOT NULL,
    Chain_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (Booking_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
    )`;
    runQuery(bookingArchiveQuery)
        .then(result => {
            console.log('booking_archive table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
//Create table renting_archive
router.post('/renting_archive', (req, res) => {//Are we sure we only need renting_id as primary key? // what about the foreing keys? 
    const rentingArchiveQuery = `
    CREATE TABLE renting_Archive (
    Renting_start_date DATE NOT NULL,
    Renting_end_date DATE NOT NULL,
    Renting_ID SERIAL NOT NULL,
    Customer_ID SERIAL NOT NULL,
    Room_number INT NOT NULL,
    Hotel_ID INT NOT NULL,
    Booking_ID SERIAL,
    Chain_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (Renting_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
    )`;
    runQuery(rentingArchiveQuery)
        .then(result => {
            console.log('renting_archive table created successfully');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.post('/triggers', (req, res) => {
    var query = `
        CREATE TRIGGER 
    `
});
// Create a new employee
module.exports = router;