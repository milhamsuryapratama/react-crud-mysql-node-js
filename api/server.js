const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mysql = require('mysql')
const path = require('path')
const cors = require('cors');

require('dotenv').config()

const dataRouter = require('../api/routes')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

con.connect(function (err) {
    if (err) {
        console.log("database connection error")
    } else {
        console.log('database connection success')
    }
})

// Using pug template engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// connecting route to database
app.use(cors());
app.use(function (req, res, next) {
    req.con = con
    next()
})

// parsing post data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routing
app.use('/', dataRouter)
app.use(express.static('public'))

app.listen(3001, function () {
    console.log('server listening on port 3000')
})