const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const nodemailer = require('nodemailer')

const customerController = {
    //register new user/ create newuser/ signup
    signUp: async (request, response) => {
        try {
            //get user details from the request body
            const { userName, password, firstName, lastName } = request.body

            // check if the user exists in the database
            const user = await Customer.findOne({ userName })

            // if the user already exist, return an error
            if (user)
                return response.status(400).json({ error: 'username already exists' });

            // if the username is unique, create a new user
            // hash the password
            const passwordHash = await bcrypt.hash(password, 10)

            const newCustomer = new Customer({
                userName,
                firstName,
                lastName,
                passwordHash

            })

            // save the user to the database
            const savedUser = await newCustomer.save();

            // return the saved user
            response.json({ message: 'user created', user: savedUser });


        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    //signin to existing user
    signIn: async (request, response) => {
        try {
            //get the username , pwd from request
            const { userName, password } = request.body

            //check if user Exist in database
            const user = await Customer.findOne({ userName })

            //if username doesnot exist, return an error
            if (!user) {
                return response.json({ error: 'User Not Found' })
            }

            //if user exist, check if the pwd is correct
            const pwdMatch = await bcrypt.compare(password, user.passwordHash)

            //if pwdmatch false
            if (!pwdMatch)
                return response.json({ error: 'incorrect password' })

            //if password matches, generate token for particular user
            const token = jwt.sign({
                id: user._id,
                userName: user.userName,
                firstName: user.firstName
            }, config.JWT_SECRET, { expiresIn: '1h' })

            response.json({ message: 'Login successful', token, user: user.userName })
        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }
    },

    //generate otp and send via mail
    resetPwd: async (request, response) => {
        try {
            //get the username request
            const { userName } = request.body

            //check if user Exist in database
            const user = await Customer.findOne({ userName })

            //if username doesnot exist, return an error
            if (!user) {
                return response.json({ error: 'User Not Found' })
            }
            //if user exist, generate otp
            const otp = Math.random().toString(36).slice(-8)
            user.resetPwdOtp = otp
            user.resetPwdExpiry = Date.now() + 3600000  //1hr
            console.log(user)
            //update user
            await user.save()

            //create transprter mail
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "nagapriyankar@gmail.com",
                    pass: "jdru fjhk qyid uare"
                }
            })

            //create message to send
            const message = {
                from: 'nagapriyankar@gmail.com',
                to: user.userName,
                subject: "Password Reset Request",
                text: `You are receiving this because you (or someone else) is requesting password reset for your account \n\n Please use the OTP to resett your password: ${user.resetPwdOtp} \n\n If you didnot request a password reset, kindly ignore this mail`
            }

            //send email
            transporter.sendMail(message, (err, info) => {
                if (err)
                    return response.status(404).json({ message: "Something Went Wrong, Try again!" })
                else
                    return response.status(200).json({ message: "Email Sent Successful"})
            })
        }
        catch (error) {
             return response.status(500).json({ error: error.message })
        }
    },

    //reset pwd using otp
    enterNewPwd: async (request, response) => {
        try { 
            //get otp, new password from request body
            const { otp, password } = request.body

            //check if otp matches
            const user = await Customer.findOne({
                resetPwdOtp: otp,
                resetPwdExpiry: {$gt : Date.now()}
            })
            console.log(user)
            //if not match, send error 
            if (!user)
                return response.status(404).json({ message: 'OTP Invalid' })
            
            console.log(password)
            //if otp matches, hash the new password
            const passwordHash = await bcrypt.hash(password, 10)
            console.log(passwordHash)
            console.log(user)
            user.passwordHash = passwordHash

            //set user data to null
            user.resetPwdOtp = null
            user.resetPwdExpiry = null
            console.log(user)
            
            await user.save()
            return response.status(200).json({ message: "PWD Reset Successful"})

        }
        catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }
}


module.exports = customerController