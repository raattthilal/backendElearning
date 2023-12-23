const mongoose = require("mongoose");
const User = require('../app/models/users');
const bcrypt = require('bcryptjs');

const dbConfig = require('../config/database.config')['development'];

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if(err)console.log(err)
    else
    console.log("Connected to database ....");
});

//create password hash

    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash('password', salt, (err, hash) => {
    //         if (err) throw err;
    //         console.log(hash);
    //     });
    // });


const UserAdmin = new User({
    username: 'Admin',
    email:'admin@gmail.com',
    firstName:'admin',
    lastName:'admin',
    password:'$2a$10$0D5qLkpzaf1/GeSHO3Qw6OIKrFC6wgFU5HbnZDG7NELNUAOr.Nr7a',
    role: "SUPERADMIN"
})
UserAdmin.save();
