//import express, cors
const express = require('express')
const cors = require('cors')

const customerRouter = require('./routes/customerRouter')
const postsRouter = require('./routes/postsRouter')

//create new express app
const app = express()

// use the cors middleware
app.use(cors());

// use the express.json middleware
app.use(express.json());

//define the endpoints
app.use('/customers', customerRouter)
app.use('/posts', postsRouter)

//export the app
module.exports = app




