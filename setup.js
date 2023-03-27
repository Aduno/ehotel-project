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
    const officeQuery = `
    CREATE TABLE Office (
    Branch_number INT NOT NULL,
    Chain_Name VARCHAR(30) NOT NULL,
    Country VARCHAR(30) NOT NULL,
    Street_name VARCHAR(30) NOT NULL,
    Street_number INT NOT NULL,
    Unit_number INT,
    City VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_number VARCHAR(13) NOT NULL,
    PRIMARY KEY (Branch_number, Chain_Name),
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
router.post('/hotel', (req, res) => {//here should check the star rating condition for 1-5 stars
    const hotelQuery = `
    CREATE TABLE Hotel (
    Star_rating DECIMAL(2,1) CHECK (Star_rating BETWEEN 1.0 AND 5.0),
    Hotel_ID VAR(5) NOT NULL PRIMARY KEY,
    Chain_Name VARCHAR(30) NOT NULL,
    Country VARCHAR(30) NOT NULL,
    City VARCHAR(30) NOT NULL,
    Street_name VARCHAR(30) NOT NULL,
    Street_number INT NOT NULL,
    Unit_number INT,
    email VARCHAR(30) NOT NULL,
    Phone_number VARCHAR(13) NOT NULL,
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
// Capacity VARCHAR(20) CHECK (Capacity IN ('Single', 'Double', 'Triple', 'Quadruple')),
router.post('/room', (req, res) => {//still need to work on the condition of the attrbutes (capacity --> single double etc)
    const roomQuery = `
    CREATE TABLE IF NOT EXISTS Room (
    Room_number INT NOT NULL,
    Hotel_ID VARCHAR(5) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    TV BOOLEAN NOT NULL,
    Air_Conditioner BOOLEAN NOT NULL,
    Fridge BOOLEAN NOT NULL,
    Wifi BOOLEAN NOT NULL,
    Room_Service BOOLEAN NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity > 0),
    View VARCHAR(30) CHECK (View IN ('Sea view', 'Mountain view','City view')),
    Extendable BOOLEAN NOT NULL,
    Problems VARCHAR(255),
    PRIMARY KEY (Room_number, Hotel_ID),
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
// Hash the password (Low prio)
router.post('/employee', (req, res) => {
    const employeeQuery = `
    CREATE TABLE Employee (
    EmployeeID VARCHAR(5) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Password VARCHAR(30) NOT NULL,
    Position VARCHAR(30) NOT NULL,
    First_name VARCHAR(30) NOT NULL,
    Last_name VARCHAR(30) NOT NULL,
    Salary MONEY NOT NULL,
    Hotel_ID VARCHAR(5) NOT NULL,
    ManagerID VARCHAR(5),
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(HotelID),
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
    Customer_ID VARCHAR(15) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Password VARCHAR(30) NOT NULL,
    First_name VARCHAR(30) NOT NULL,
    Last_name VARCHAR(30) NOT NULL,
    Address_country VARCHAR(30) NOT NULL,
    Address_city VARCHAR(30) NOT NULL,
    Address_street_name VARCHAR(30) NOT NULL,
    Address_street_number INT NOT NULL,
    Address_unit_number INT,
    SSN_SIN VARCHAR(12) NOT NULL,
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
    Booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID VARCHAR(15) NOT NULL,
    Booking_start_date DATE NOT NULL,
    Booking_end_date DATE NOT NULL,
    Room_number INT NOT NULL,
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
    Rent_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID VARCHAR(15) NOT NULL,
    Room_number INT NOT NULL,
    Booking_ID INT,
    Check_in_date DATE NOT NULL,
    Check_out_date DATE NOT NULL,
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
router.post('/booking_archive', (req, res) => {//Are we sure we only need booking_id as primary key? // what about the foreing keys? 
    const bookingArchiveQuery = `
    CREATE TABLE Booking_Archive (
    Booking_start_date DATE NOT NULL,
    Booking_end_date DATE NOT NULL,
    Booking_ID INT NOT NULL,
    Customer_ID VARCHAR(15) NOT NULL,
    Room_number INT NOT NULL,
    Hotel_ID VARCHAR(5) NOT NULL,
    Chain_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (Booking_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Room_number) REFERENCES Room(Room_number),
    FOREIGN KEY (Chain_Name) REFERENCES Hotel_Chain(Chain_Name),
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(HotelID),
    FOREIGN KEY (Booking_ID) REFERENCES Booking(Booking_ID)
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
    const brentingArchiveQuery = `
    CREATE TABLE renting_Archive (
    Renting_start_date DATE NOT NULL,
    Renting_end_date DATE NOT NULL,
    Renting_ID INT NOT NULL,
    Customer_ID VARCHAR(15) NOT NULL,
    Room_number INT NOT NULL,
    Hotel_ID VARCHAR(5) NOT NULL,
    Chain_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (Renting_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Room_number) REFERENCES Room(Room_number),
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(HotelID),
    FOREIGN KEY (Chain_Name) REFERENCES Hotel_Chain(Chain_Name),
    FOREIGN KEY (Renting_ID) REFERENCES Renting(Rent_id)
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

// Create a new employee
module.exports = router;