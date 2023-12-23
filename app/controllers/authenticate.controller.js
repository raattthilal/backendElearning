const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/params.config');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'info.englearn360@gmail.com', // Your email address
        pass: 'zgdazwoievzsasfx' // Your email password or an application-specific password
    }
});



module.exports = {
    //User Authentication
    authenticate: (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            if (!username) {
                res.send({
                    success: false,
                    message: 'Username is Empty..!'
                })
            }
            if (!password) {
                res.send({
                    success: false,
                    message: 'Password is Empty..!'
                })
            }
            if (!username && !password) {
                res.send({
                    success: false,
                    message: 'Username and password is Required..!'
                })
            }
        }
        //Getting user details
        User.getUserByUsername(username, (err, userData) => {

            if (err || !userData) {
                return res.send({
                    success: false,
                    message: 'User not existed',
                    error: err
                })
            }
            userData = userData[0];
            //Cross checking password
            User.comparePassword(password, userData?.password, (err, isMatch) => {
                // if (err) {
                //     return res.send({
                //         success: false,
                //         message: 'something went wrong with Password',
                //         error:err
                //     });
                // }
                if (isMatch) {
                    const userRes = {
                        id: userData.id,
                        role: userData.role,
                        username: userData.username,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        verified: userData.verified ?? false,
                        payment_status: userData.paymentStatus
                    }
                    //Creating jwt token
                    const token = jwt.sign(userRes, config.development.jwt.secret, {
                        expiresIn: '24h' //24 hours
                    });
                    return res.send({
                        success: true,
                        token: token,
                        user: userRes,
                        expiresIn: '24 Hours'
                    });
                } else {
                    return res.send({
                        success: false,
                        message: 'Wrong Password'
                    });
                }
            })
        })
    },

    //forget password
    forgetPasword: async (req, res, next) => {
        const username = req.body.username;
        if (!username) {
            res.send({
                success: false,
                message: 'username is Empty..!'
            })
        }
        let update = {}
        await User.getUserByUsername(username, async (err, userData) => {

            if (err || !userData) {
                return res.send({
                    success: false,
                    message: 'User not existed',
                    error: err
                })
            }

            userData = userData[0];
            let newPassword = userData.firstName + "12345";
            // Email content
            const mailOptions = {
                from: 'info.englearn360@gmail.com',
                to: userData.email,
                subject: 'Password Resetting Email',
                text: `Hello ${userData.firstName}, this is your new Password -- ${newPassword} --, Thank you!`
            };
            await bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, async (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    update.password = hash;
                    //if User Existing
                    await User.findByIdAndUpdate(userData.id,
                        {
                            $set: update
                        }, { new: true },
                        (err, data) => {
                            if (err || !data) {
                                return res.send({
                                    success: false,
                                    message: "Password resetting failed..!"
                                })
                            }
                            // Send the email
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.error('Error:', error.message);
                                } else {
                                    console.log('Email sent:', info.response);
                                }
                            });

                            return res.send({
                                success: true,
                                message: "User password resetted successfully, Please check your email.!"
                            })
                        });

                });
            });

        })
    }
}