const mongoose = require('mongoose')

const customerSchemma = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    passwordHash: String,
    date: {
        type: Date,
        default: Date.now,
    },
    resetPwdOtp: String,
    resetPwdExpiry: String

})

module.exports = mongoose.model('Customer', customerSchemma, 'customers')