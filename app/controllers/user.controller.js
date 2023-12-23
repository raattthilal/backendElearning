const User = require('../models/users.model');
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
    //Create new User
    createUser: (req, res, next) => {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.phone.toString(),
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        })

        User.addUser(newUser, (err, data) => {
            if (err) {
                return res.send({
                    success: false,
                    error: err,
                    message: 'Failed to register new user'
                });
            } else {
                // Email content
                const mailOptions = {
                    from: 'info.englearn360@gmail.com',
                    to: data.email,
                    subject: `Let's Talk English - Welcome Email`,
                    text: `Hello ${data.firstName}, Welcome to Let's Talk English e-learning platform, Thank you!`
                };
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
                    id: data.id,
                    message: 'User registered successfully, Please Login!'
                });
            }
        })
    },

    //View Single User
    getUser: async (req, res, next) => {
        let id = req.params.id;
        if (!id) {
            return res.send({
                success: false,
                message: "userId required..!",
            })
        }
        await User.find({ "_id": id, "status": true }, (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "User Not founded..!",
                    error: err ? err : "No active users data in db"
                })
            }
            let responseData = {
                id: data[0].id,
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                username: data[0].username,
                email: data[0].email,
                phone: data[0].phone,
                status: data[0].status,
                role: data[0].role,
                verified: data[0].verified,
                paymentStatus: data[0].paymentStatus
            }
            let result = {
                data: responseData,
                success: true
            }
            return res.send(result);
        })
    },
    // Get All Users
    listUser: async (req, res, next) => {

        await User.find({ "status": true, role: 'LEARNER' }, (err, data) => {

            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "No Users founded..!",
                    error: err ? err : "No active users data in db"
                })
            }
            let responseData = [];
            for (let i = 0; i < data.length; i++) {
                let resData = {
                    id: data[i].id,
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    username: data[i].username,
                    email: data[i].email,
                    phone: data[i].phone,
                    status: data[i].status,
                    role: data[i].role,
                    verified: data[i].verified,
                    paymentStatus: data[i].paymentStatus
                }
                responseData.push(resData);
            }

            let result = {
                data: responseData,
                success: true
            }
            res.send(result);
        })
    },

    //Update User
    updateUser: async (req, res, next) => {
        let id = req.params.id;
        if (!id) {
            return res.send({
                success: false,
                message: "UserId Required..!",
            })
        }

        let params = req.body;
        if (!params.firstName && !params.lastName && !params.phone && !params.email && !params.status && !params.paymentId && !params.verified) {
            return res.send({
                success: false,
                message: "Nothing to update"
            })
        }
        let update = {}
        if (params.firstName) {
            update.firstName = params.firstName;
        }
        if (params.lastName) {
            update.lastName = params.lastName;
        }
        if (params.phone) {
            update.phone = params.phone;
        }
        if (params.email) {
            update.email = params.email;
        }
        if (params.status) {
            update.status = params.status;
        }
        if (params.verified) {
            update.verified = params.verified;
        }
        if (params.paymentId) {
            update.paymentId = params.paymentId;
            update.paymentStatus = "PAID"
        }

        await User.find({ "_id": id, "status": true }, async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "User Not founded with this userId"
                })
            }
            //if User Existing
            await User.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, updateData) => {
                    if (err || !updateData) {
                        return res.send({   
                            success: false,
                            message: "User Updation failed..!"
                        })
                    }
                    if (params.paymentId && params.verified) {
                        // Email content
                        const mailOptions = {
                            from: 'info.englearn360@gmail.com',
                            to: data[0].email,
                            subject: `Let's Talk English Payment Successfull`,
                            text: `Hello ${data[0].firstName}, Your payment of Rupees 100/- has been received. Welcome to Let's Talk English e-learning platform, Thank you!`
                        };
                        // Send the email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error:', error.message);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    }
                    return res.send({
                        success: true,
                        message: "User Updated successfully"
                    })
                });
        })
    },
    //Delete User
    deleteUser: async (req, res, next) => {
        let id = req.params.id;
        let update = {
            status: false
        }
        await User.find({ "_id": id, "status": true }, async (err, data) => {
            if (err || data.length == 0) {
                return res.send({
                    success: false,
                    message: "User Not founded with this userId"
                })
            }
            await User.findByIdAndUpdate(id,
                {
                    $set: update
                }, { new: true },
                (err, data) => {
                    if (err || !data) {
                        return res.send({
                            success: false,
                            message: "User Deletion failed..!"
                        })
                    }
                    return res.send({
                        success: true,
                        message: "User Deleted successfully"
                    })
                });
        })
    }

}